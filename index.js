import React from 'react'
import ReactDOM from 'react-dom'

import { Typography, Grid } from '@material-ui/core'

import DataViewer from './src/components/DataViewer'

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