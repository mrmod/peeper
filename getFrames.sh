# Extract frames from an h264 video
# Usage: ./getFrames $FULL_VIDEO_PATH
# Example: ./getFrames /mnt/video/camera1-20200920T225214.1600667534.h264
set -e
VIDEO=$(basename $1)

# 1/2 of recording FPS (30)
FPS=${2:-15}

CAMERA=$(echo $VIDEO | cut -d-  -f1)
DATE=$(echo $VIDEO | cut -d-  -f2 | cut -d. -f1-2)

OUTPATH=/mnt/analysis/$CAMERA/$DATE

echo "Creating $OUTPATH"
mkdir -p $OUTPATH
echo "Decoding at $FPS"
# Decode at 15 FPS
ffmpeg \
  -i $1 \
  -qscale:4 2 \
  -vf fps=fps=$FPS \
  $OUTPATH/%04d.jpg
