import React from 'react'
import ReactDOM from 'react-dom'

import firebase from 'firebase/app'
import 'firebase/firestore'

import * as config from './firebaseConfig'
import { Card, CardContent, CardHeader, Grid, LinearProgress, Typography } from '@material-ui/core'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

firebase.initializeApp({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
})

const firestore = firebase.firestore()
const COLLECTION = "detections"

const LabelCard = (props) => {
    
    return <Card style={{margin: "2px"}} variant="outlined" square={true}>
        <CardHeader
            title={`Label: ${props.label}`}
            subheader={`${props.labels.length} detections`} />
        <CardContent>
            <Typography variant="h5">Label Confidence</Typography>
            <ResponsiveContainer width={400} height={400}>
                <AreaChart data={props.labels}>
                    <Area type="monotone" dataKey="confidence" />
                </AreaChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
}

const LabelCards = (props) => {
    return <>
        {Object.keys(props.labels).map((label, key) => (<LabelCard
            key={key}
            label={label}
            labels={props.labels[label]}
        />))}
    </>
}

const DataViewer = (props) => {
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

    // Create a labels and count of label
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