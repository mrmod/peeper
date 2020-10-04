import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

import * as config from './firebaseConfig'
import { Button, Card, CardActionArea, CardContent, CardHeader, CardMedia, Grid, LinearProgress, TextField, Typography } from '@material-ui/core'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

firebase.initializeApp({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
})

const firestore = firebase.firestore()
const storage = firebase.storage()
const COLLECTION = "detections"

const DOCUMENT_SHAPE = {
    /**
     * EG: camera1
     */
    camera: PropTypes.string.isRequired,
    /**
     * Percentage. EG: 0.60110339
     */
    confidence: PropTypes.number.isRequired,
    /**
     * Nanosecond precision: yyyymmddThhmmss.123456789
     */
    eventDate: PropTypes.string.isRequired,
    /**
     * Index of frame in the 25fps source video. 0-padded to length of 4
     */
    frame: PropTypes.string.isRequired,
    /**
     * Counter of detections for this eventDate and frame
     */
    detection: PropTypes.number.isRequired,
    /**
     * Source image location on storage
     */
    image: PropTypes.string.isRequired,
    /**
     * Always lower case label/classification of region of interest (ROI)
     */
    label: PropTypes.string.isRequired,
    /**
     * Clockwise from TopLeft ROI polygon corner points
     */
    roi: PropTypes.arrayOf(PropTypes.number).isRequired,

}

const imageBucketPath = (document) => {
    return `${document.camera}/${document.eventDate}/${document.frame}.jpg`
}

const getBucketImage = (imagePath) => {
    const pathRef = storage.refFromURL(
        `gs://${config.storageBucket}/${imagePath}`
    )
    return storage.ref("/").child(imagePath).getDownloadURL()
    .then((url) => {
        return url
    })
    .catch(err => {
        console.warn(`Unable to create ref for ${imagePath}`)
        return null
    })
}

const getDocumentSample = (documents) => documents[Math.floor(Math.random() * documents.length)]
const getDocumentImage = (document) => {
    return getBucketImage(imageBucketPath(document))
}

const sampleId = doc => `${doc.camera}/${doc.eventDate}/${doc.frame}.jpg`
/**
 * Container for chart plotting label confidence
 * @param {*} props 
 */
const LabelCard = (props) => {
    const [documentSample, setDocumentSample] = React.useState(null)
    const [imageSample, setImageSample] = React.useState(null)
    const [showImageSample, setShowImageSample] = React.useState(false)
    
    React.useEffect(() => {
        if (documentSample) {
            return
        }
        const document = getDocumentSample(props.documents)
        setDocumentSample(document)
        getDocumentImage(document)
            .then(imageUrl => setImageSample(imageUrl))
    },[props.documents])

    return <Card style={{margin: "2px"}} variant="outlined" square={true}>
        <CardHeader
            title={`Label: ${props.label}`}
            subheader={imageSample ? `Sample: ${sampleId(documentSample)}` : `${props.documents.length} detections`} />

        <CardContent>
            <Typography variant="h5">Label Confidence</Typography>
            <ResponsiveContainer width={400} height={400}>
                <AreaChart data={props.documents}>
                    <XAxis />
                    <YAxis dataKey="confidence" />
                    <Area type="monotone" dataKey="confidence" />
                </AreaChart>
            </ResponsiveContainer>
            { imageSample && showImageSample? <CardMedia
                style={{height: "425px"}}
                image={imageSample}
                title="Representative sample" /> : null }
                
        </CardContent>
        <CardActionArea>
            { imageSample ? <Button
                onClick={() => setShowImageSample(!showImageSample)}
                color={showImageSample ? 'secondary' : 'primary'}>
                    {showImageSample ? 'Hide' : 'Show'} image sample
                </Button> : null }
        </CardActionArea>
    </Card>
}

LabelCard.propTypes = {
    /**
     * Label/classification term. EG: car
     */
    label: PropTypes.string.isRequired,
    documents: PropTypes.arrayOf(
        PropTypes.shape(DOCUMENT_SHAPE),
    )
}

const LabelCards = (props) => {
    return <>
        {Object.keys(props.labels).map((label, key) => (<LabelCard
            key={key}
            label={label}
            documents={props.labels[label]}
        />))}
    </>
}

LabelCards.propTypes = {
    /**
     * Shape: { "labelAsString": [DOCUMENT_SHAPE]}
     */
    labels: PropTypes.shape({
        [PropTypes.string]: PropTypes.arrayOf(PropTypes.shape(DOCUMENT_SHAPE))
    })
}

/**
 * DataViewer
 * 
 * Container for plots of label confidence scores for video frames
 */
const DataViewer = () => {

    const [loading, setLoading] = React.useState(false)
    const [labels, setLabels] = React.useState({})

    React.useEffect(() => {
        setLoading(true)
        firestore.collection(COLLECTION).get()
            .then(result => {
                const documentCollection = []
                result.forEach(doc => documentCollection.push(doc.data()))
                return documentCollection
            })
            .then(docs => {
                getLabels(docs)
            })
            .then(() => setLoading(false))

            .catch(err => console.error(err))
    }, [])

    // Create a labels and collect documents matching it
    const getLabels = (docs) => {
        const _labels = {}
        docs.forEach(doc => {
            if (doc.label in _labels) {
                _labels[doc.label].push(doc)
            } else {
                _labels[doc.label] = [doc]
            }
        })
        setLabels(_labels)
    }

    // Create a listing of image paths which had detections
    const dumpImagePaths = (labels) => {
        return Object.keys(labels).reduce((acc, label) => {
            labels[label].forEach(doc => {
                acc = acc.concat([<Typography
                    key={doc.eventDate + doc.frame + doc.detection}
                    variant="h6">
                        {doc.image}
                </Typography>])
            })
            return acc
        }, [])
    }

    if (loading) {
        return <LinearProgress />
    } else {
        return <div style={{display: "flex", flexWrap: "wrap"}}>
            <LabelCards labels={labels} />
        </div>
    }
}

class Root extends React.Component {

    render() {
        return <Grid container>
            <Grid item xs={12}>
                <Typography variant="h2">{this.props.appName}</Typography>
            </Grid>
            <Grid item xs={12}>
                <DataViewer />
            </Grid>
        </Grid>
    }
}


ReactDOM.render(
    <Root appName="Frontage Detections" />,
    document.getElementById("app")
)