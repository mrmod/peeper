# Extract frames from an h264 video
# Usage: ./getFrames $FULL_VIDEO_PATH
# Example: ./getFrames /mnt/video/camera1-20200920T225214.1600667534.h264

VIDEO=$(basename $1)
CAMERA=$(echo $VIDEO | cut -d-  -f1)
DATE=$(echo $VIDEO | cut -d-  -f2 | cut -d. -f1-2)

OUTPATH=/mnt/analysis/$CAMERA/$DATE

mkdir -p $OUTPATH

ffmpeg -i $1 -qscale:4 2 $OUTPATH/%04d.jpg