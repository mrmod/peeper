import React from 'react'
import PropTypes from 'prop-types'

import {scaledPt} from '../services/image'

const colors = [
    '#B39DDB',
    '#9575CD',
    '#7E57C2',
    '#673AB7',
    '#5E35B1',
    '#512DA8',
    '#4527A0',
    '#311B92',
    '#B388FF',
    '#7C4DFF',
    '#651FFF',
    '#6200EA',]


const ImageCanvas = (props) => {
    const [colorIndex, setColorIndex] = React.useState(0)
    const [isLoading, setIsLoading] = React.useState(true)
    // const image = new Image()
    const ref = React.createRef()

    React.useEffect(() => {
        if (ref && ref.current) {
            const context = ref.current.getContext("2d")
            ref.current.width = 512
            ref.current.height = 768 / 2
            const image = new Image()
            image.src = props.imageUrl
            image.onload = () => {
                context.drawImage(image, 0, 0, 512, 768/2)
                props.roiMat.forEach((roi, i) => {
                    context.beginPath()
                    // origin
                    const ox = scaledPt(roi[0])
                    const oy = scaledPt(roi[1])
                    const w = Math.round(scaledPt(roi[2]))
                    const h = Math.round(scaledPt(roi[3]))
                    
                    context.strokeStyle = colors[colorIndex + i]
    
                    context.moveTo(ox, oy)
                    context.strokeRect(ox, oy, (w-ox), (h-oy))
                    
                })
            }

        }
    }, [props.isVisible])

    if (!props.isVisible) {
        return null
    }

    return <canvas ref={ref} />
}

Image.propTypes = {
    /**
     * MAT of [x, y, w, h]
     * github.com/arunponnusamy/cvlib/blob/master/cvlib/object_detection.py#L125
     */
    roiMat: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    imageUrl: PropTypes.string,
    isVisible: PropTypes.bool,
}

export default ImageCanvas