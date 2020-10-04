# Upload an image to firebase storage

import os
import sys

import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage

cred = credentials.Certificate('./firebase_credentials.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'pi-garage-6000-291113.appspot.com'
})

bucket = storage.bucket()

def upload_image(image_path):
    (camera, event_date, frame_jpg) = image_path.split(os.path.sep)[-3:]

    bucket_file = os.path.join(camera, event_date, frame_jpg)

    blob = bucket.blob(bucket_file)

    print(f"Uploading {image_path}")
    blob.upload_from_filename(image_path)


if __name__ == "__main__":
    upload_image(sys.argv[1])