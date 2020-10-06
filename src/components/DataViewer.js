import React from 'react'
import {LinearProgress} from "@material-ui/core"
import { getDocumentCollection } from '../services/firebase'
import LabelCards from './LabelCards'

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
    return _labels
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
        getDocumentCollection()
            .then(result => {
                const documentCollection = []
                result.forEach(doc => documentCollection.push(doc.data()))
                return documentCollection
            })
            .then(docs => {
                setLabels(getLabels(docs))
            })
            .then(() => setLoading(false))

            .catch(err => console.error(err))
    }, [])

    if (loading) {
        return <LinearProgress />
    } else {
        return <div style={{display: "flex", flexWrap: "wrap"}}>
            <LabelCards labels={labels} />
        </div>
    }
}


export default DataViewer