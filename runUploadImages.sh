# Find and upload images in the path

echo Uploading images from $1
find $1 -name "*.jpg" -exec python3 upload_image.py {} \;

