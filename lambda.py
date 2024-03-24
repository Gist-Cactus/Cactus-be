import boto3
import botocore
import json
import os
import logging
import fitz
import urllib
import requests
import io
from PIL import Image, ImageDraw, ExifTags, ImageColor, ImageFont
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info("New files uploaded to the source bucket.")
    logger.info(event)
    
    model = 'arn:aws:rekognition:ap-northeast-2:730335373015:project/cactus_with_table_800/version/cactus_with_table_800.2024-03-24T10.30.14/1711243816880'
    client = boto3.client("s3", region_name='ap-northeast-2')
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    print(key)
    obj = client.get_object(Bucket='cactus-process', Key=key)
    doc = fitz.open(stream=obj['Body'].read(), filetype="pdf")
    key = key.split('.')[0]
    
    for i, page in enumerate(doc):
        img = page.get_pixmap()
        file = img.tobytes(output='jpg')
        res = client.put_object(Bucket='cactus-process', Key=f'images/{key}-{i}', Body=file, ContentType="image/jpeg")
        params = {'presentationId': key }
        body = {'title': f'images/{key}-{i}'}
        response = requests.post('http://13.125.174.232:3000/slide', params=params, json=body)
        json_data = response.json()
        print(json_data)
        
        labels = show_custom_labels(model, 'cactus-process', f'images/{key}-{i}', 80)
        
        save_bounding_box_images('cactus-process', f'images/{key}-{i}', labels, json_data['id'])

    return {
        'statusCode': 200,
        'body': json.dumps("")
    }
    
def show_custom_labels(model, bucket, photo, min_confidence):
    client = boto3.client('rekognition', region_name='ap-northeast-2')

    # Call DetectCustomLabels
    response = client.detect_custom_labels(Image={'S3Object': {'Bucket': bucket, 'Name': photo}},
                                           MinConfidence=min_confidence,
                                           ProjectVersionArn=model)
                                           
                                

    # For object detection use case, uncomment below code to display image.
    # display_image(bucket,photo,response)

    return response['CustomLabels']

def save_bounding_box_images(bucket, photo, labels, id):
    print("bounding box")
    # Load image from S3 bucket
    s3_connection = boto3.client('s3', region_name='ap-northeast-2')
    s3_object = s3_connection.get_object(Bucket=bucket, Key=photo)
    stream = io.BytesIO(s3_object['Body'].read())
    image = Image.open(stream)

    # Image dimensions
    imgWidth, imgHeight = image.size

    # Process each detected custom label
    for index, customLabel in enumerate(labels, start=1):
        if 'Geometry' in customLabel:
            box = customLabel['Geometry']['BoundingBox']
            left = int(imgWidth * box['Left'])
            top = int(imgHeight * box['Top'])
            width = int(imgWidth * box['Width'])
            height = int(imgHeight * box['Height'])
            
            # Define the bounding box area to crop
            area = (left, top, left + width, top + height)
            cropped_image = image.crop(area)
            img_byte_arr = io.BytesIO()
            cropped_image.save(img_byte_arr, format='JPEG')
            img_byte_arr = img_byte_arr.getvalue()
            
            print(id)
            if customLabel['Name'] == 'text': 
                text = extract_and_combine_text(img_byte_arr)
                customLabel['Text'] = text
                print(customLabel)
                print(text)
            params = {'slideId': id }
            body = {'type': customLabel['Name'], 'content': json.dumps(customLabel)}
            response = requests.patch('http://13.125.174.232:3000/slide', params=params, json=body)
            print(response)

            # Save the cropped image
            file_name = f"element-images/{photo}_{index}.jpg"
            print(file_name)
            res = s3_connection.put_object(Bucket='cactus-process', Key=file_name, Body=img_byte_arr, ContentType="image/jpeg")
            print(res)
            
            
def extract_and_combine_text(bytes):
    """
    Extracts text from an image using AWS Rekognition and combines it based on line and word relationships.

    Parameters:
    - file_path: Path to the image file.

    Returns:
    - A list of combined text strings.
    """

    # Initialize the AWS Rekognition client
    rekognition = boto3.client('rekognition', region_name='ap-northeast-2')

    # Open the image file
    response = rekognition.detect_text(Image={'Bytes': bytes})

    text_detections = response['TextDetections']

    # Prepare dictionaries for lines and words
    line_texts = {det['Id']: det['DetectedText'] for det in text_detections if det['Type'] == 'LINE'}
    word_texts = {}
    for det in text_detections:
        if det['Type'] == 'WORD':
            if det['ParentId'] in word_texts:
                word_texts[det['ParentId']] += ' ' + det['DetectedText']
            else:
                word_texts[det['ParentId']] = det['DetectedText']

    # Combine the texts
    combined_texts_by_line = [line_texts[line_id] if line_id not in word_texts else word_texts[line_id] for line_id in line_texts]
    combined_texts_all = ' '.join(combined_texts_by_line)

    return combined_texts_all