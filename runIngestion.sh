VIDEO=$(basename $1)
CAMERA=$(echo $VIDEO | cut -d-  -f1)
DATE=$(echo $VIDEO | cut -d-  -f2 | cut -d. -f1-2)

OUTPATH=/mnt/analysis/$CAMERA/$DATE

find $OUTPATH -name "*.json" -exec python3 ingest_to_firestore.py {} \;

