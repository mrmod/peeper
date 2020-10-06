import PropTypes from 'prop-types'


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

export {DOCUMENT_SHAPE}