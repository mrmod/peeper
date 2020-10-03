import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

import json
import os
import sys

# Use a service account
cred = credentials.Certificate('./firebase_credentials.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

def document_name(json_path):
    (cam, event_date, frame_id) = sequence_info(json_path)

    return f"{cam}.{event_date}.{frame_id}"

def sequence_info(json_path):
    (cam, event_date, frame_json) = json_path.split(os.path.sep)[-3:]
    (frame_id, _) = os.path.splitext(frame_json)

    return (cam, event_date, frame_id)

def create_document(json_path):
    with open(json_path) as f:
        metadata = json.load(f)
        (camera, event_date, frame_id) = sequence_info(json_path)

        for i, label in enumerate(metadata.get('labels')):
            doc = db.collection("detections").document(document_name(json_path) + f".{i}")

            doc.set({
                'detection': i,
                'camera': camera,
                'frame': frame_id,
                'eventDate': event_date, # yyyymmddThhmmss.nanosecond
                'image': metadata.get('image'),
                'label': label,
                'roi': metadata.get('rois')[i],
                'confidence': metadata.get('conf')[i],
            })

def show_documents():
    detections = db.collection('detections')

    for doc in detections.stream():
        print(f"{doc.to_dict()}")


if __name__ == "__main__":
    print(f"Ingesting {sys.argv[1]}")
    create_document(sys.argv[1])
    # show_documents()