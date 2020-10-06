import React from 'react'
import PropTypes from 'prop-types'
import {DOCUMENT_SHAPE} from "../services/typeShapes"
import {Button, Card, CardContent, CardHeader, CardMedia, CardActionArea, Typography} from "@material-ui/core"
import {ResponsiveContainer, AreaChart, Area, YAxis, XAxis} from "recharts"

import {getDocumentSample, getDocumentImage, sampleId, getLabels} from "../services/firebase"
import Image from './Image'
/**
 * Container for chart plotting label confidence
 * @param {*} props 
 */
const LabelCard = (props) => {
    const [documentSample, setDocumentSample] = React.useState(null)
    const [imageSample, setImageSample] = React.useState(null)
    const [showImageSample, setShowImageSample] = React.useState(false)
    const [roiMat, setRoiMat] = React.useState([])
    React.useEffect(() => {
        if (documentSample) {
            return
        }
        const document = getDocumentSample(props.documents)

        if (document) {
            const work = []
            work.push(
                getLabels(
                    document.camera,
                    document.eventDate,
                    document.label,
                    document.frame
                )
                .then(docs => {
                    const rois = docs.map(doc => doc.roi)
                    setRoiMat(rois)
                })
            )
            work.push(
                getDocumentImage(document)
                    .then(imageUrl => setImageSample(imageUrl))
            )
            Promise.all(work)
                .then(() => {
                    setDocumentSample(document)
                })
        }

    },[props.documents])

    if (documentSample) {
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
                <Image
                    roiMat={roiMat}
                    imageUrl={imageSample}
                    isVisible={showImageSample} />
            </CardContent>
            <CardActionArea>
                { imageSample ? <Button
                    onClick={() => setShowImageSample(!showImageSample)}
                    color={showImageSample ? 'secondary' : 'primary'}>
                        {showImageSample ? 'Hide' : 'Show'} image sample
                    </Button> : null }
            </CardActionArea>
        </Card>
    } else {
        return <Typography variant="h4">Loading...</Typography>
    }
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

export default LabelCard