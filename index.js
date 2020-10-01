import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import firebase from 'firebase/app'
import 'firebase/firestore'

import * as config from './firebaseConfig'
import { Button, Card, CardContent, CardHeader, Grid, LinearProgress, TextField, Typography } from '@material-ui/core'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

firebase.initializeApp({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
})

const firestore = firebase.firestore()
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

const LabelCard = (props) => {
    
    return <Card style={{margin: "2px"}} variant="outlined" square={true}>
        <CardHeader
            title={`Label: ${props.label}`}
            subheader={`${props.documents.length} detections`} />
        <CardContent>
            <Typography variant="h5">Label Confidence</Typography>
            <ResponsiveContainer width={400} height={400}>
                <AreaChart data={props.documents}>
                    <Area type="monotone" dataKey="confidence" />
                </AreaChart>
            </ResponsiveContainer>
        </CardContent>
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

const DataViewer = () => {

    const [loading, setLoading] = React.useState(false)
    const [labels, setLabels] = React.useState({})
    const [showImagePaths, setShowImagePaths] = React.useState(false)

    const [docsLoaded, setDocsLoaded] = React.useState(0)
    const [totalDocs, setTotalDocs] = React.useState(1)

    React.useEffect(() => {
        setLoading(true)
        firestore.collection(COLLECTION).get()
            .then(result => {
                const documentCollection = []
                result.forEach(doc => documentCollection.push(doc.data()))
                setTotalDocs(documentCollection.length)
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
            // Might be too quick to capture
            setDocsLoaded(docsLoaded+1)
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
        return <LinearProgress
            variant="determinate"
            value={100 * (docsLoaded / totalDocs )} />
    } else {
        return <div style={{display: "flex", flexWrap: "wrap"}}>
            <LabelCards labels={labels} />
            <Button
                fullWidth={true}
                onClick={() => setShowImagePaths(!showImagePaths)}
                color={showImagePaths ? "secondary" : "primary"}
                variant="outlined">
                    {showImagePaths ? 'Hide' : 'Show'} local image paths
                </Button>
            {showImagePaths ? dumpImagePaths(labels) : null }
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