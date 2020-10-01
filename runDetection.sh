# Run detection on all frames in a video

# input: /mnt/video/camera1-20200920T225214.1600667534.h264

VIDEO=$(basename $1)
CAMERA=$(echo $VIDEO | cut -d-  -f1)
DATE=$(echo $VIDEO | cut -d-  -f2 | cut -d. -f1-2)

OUTPATH=/mnt/analysis/$CAMERA/$DATE

find $OUTPATH -name "*.jpg" -exec python3 cv_detect.py {} \;