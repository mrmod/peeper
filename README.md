# Security Video Analysis

Converts a captured H.264 video into a series of JPEG frames. Objects can then be detected and classified in each frame. Finally, the resulting metadata JSON from the previsou step is uploaded to Firestore for the next phase of this project

# Prerequisites

* Install python modules `python -m pip install -r requirements.txt`
* Mount H.264 videos dataset to `/mnt/video`
* Mount an output path for analyzed videos to `/mnt/analysis`

# Using the Local Pipeline

```
video=/mnt/video//mnt/video/camera1-20200921T091843.1600705123.h264

./getFrames.sh $video
./runDetection.sh $video
```

# Ingest Metadata to Google Cloud

You'll need to install the [ Firebase SDK ](ttps://firebase.google.com/docs/firestore/quickstart) for this part.

```
video=/mnt/video//mnt/video/camera1-20200921T091843.1600705123.h264

./runIngestion.sh
```

# Plans

* Find events where there's no car in the driveway
* Find luminous events during dark videos
* Find events of optical transgression (dogs,people crossing the field of view)
* Find out who's speeding in the neighborhood by adding localization