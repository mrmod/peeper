import cv2
import matplotlib.pyplot as plt
import cvlib as cv
from cvlib.object_detection import draw_bbox
import sys
import json
import os
from datetime import datetime

# input: /mnt/video/camera1-20200920T225214.1600667534.h264
in_image = sys.argv[1]
print(f"Running detection on {in_image}")
proc_start = datetime.now()

im = cv2.imread(in_image)
rois, labels, conf = cv.detect_common_objects(im)
output_image = draw_bbox(im, rois, labels, conf)

metadata = {
    "image": in_image,
    "labels": labels,
    "rois": rois,
    "conf": conf,
}

metadata_file = in_image.replace(".jpg", ".json")

with open(metadata_file, "w+") as output:
    json.dump(metadata, output)

proc_end = datetime.now()
detect_time = proc_end - proc_start
print(f"Finished detection on {in_image} in {detect_time.seconds} seconds")