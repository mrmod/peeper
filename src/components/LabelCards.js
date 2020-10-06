import React from 'react'
import PropTypes from 'prop-types'
import {DOCUMENT_SHAPE} from "../services/typeShapes"

import LabelCard from './LabelCard'

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

export default LabelCards