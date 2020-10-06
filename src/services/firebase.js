
import * as config from '../../firebaseConfig'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
firebase.initializeApp({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
})

const firestore = firebase.firestore()
const storage = firebase.storage()
const COLLECTION = "detections"


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
const getLabels = (camera, eventDate, label, frame) => {
    const collection = firestore.collection(COLLECTION)

    const query = collection
        .where("camera", "==", camera)
        .where("eventDate", "==", eventDate)
        .where("label", "==", label)
        .where("frame", "==", frame)
    
    return query.get().then(snapshot => snapshot.docs.map(doc => doc.data()))
}

const sampleId = doc => `${doc.camera}/${doc.eventDate}/${doc.frame}.jpg`

const getDocumentCollection = () => firestore.collection(COLLECTION).get()

.catch(err => console.error(err))
export {
    firestore,
    storage,
    imageBucketPath,
    getBucketImage,
    getDocumentSample,
    getDocumentImage,
    getDocumentCollection,
    getLabels,
    sampleId,
}