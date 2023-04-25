const faceApi = require("@vladmandic/face-api");
const {Canvas, Image} = require("canvas");
const canvas = require("canvas");
const UserModel = require("../models/user.model");
faceApi.env.monkeyPatch({Canvas, Image});


async function LoadModels() {
    // Load the ml_models
    // __dirname gives the root directory of the server
    await faceApi.nets.faceRecognitionNet.loadFromDisk(__dirname + "/../ml_models");
    await faceApi.nets.faceLandmark68Net.loadFromDisk(__dirname + "/../ml_models");
    await faceApi.nets.ssdMobilenetv1.loadFromDisk(__dirname + "/../ml_models");
}

LoadModels().then(() => {
    console.log("Models loaded successfully")
});


async function uploadLabeledImages(images, userId) {
    try {
        let counter = 0;
        const descriptions = [];
        for (let i = 0; i < images.length; i++) {
            const img = await canvas.loadImage(images[i]);
            counter = (i / images.length) * 100;
            console.log(`Progress = ${counter}%`);
            // Read each face and save the face descriptions in the descriptions array
            const detections = await faceApi.detectSingleFace(img)
                .withFaceLandmarks().withFaceDescriptor();
            if (!detections)
                return false;
            descriptions.push(detections.descriptor);
        }


        // Create a new face document with the given label and save it in DB
        await UserModel.findByIdAndUpdate(userId, {$set: {descriptions: descriptions}}, {runValidators: true});
        console.log("Face data saved successfully");
        return true;
    } catch (error) {
        console.log(error);
        return (error);
    }
}

async function getDescriptorsFromDB(image, userId) {
    let userFace = await UserModel.findById(userId);
    for (let j = 0; j < userFace.descriptions.length; j++) {
        userFace.descriptions[j] = new Float32Array(Object.values(userFace.descriptions[j]));
    }
    const img = await canvas.loadImage(image);
    let temp = faceApi.createCanvasFromMedia(img);
    const displaySize = {width: img.width, height: img.height};
    faceApi.matchDimensions(temp, displaySize);

    const detections = await faceApi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
    const newDetectionsResized = faceApi.resizeResults(detections, displaySize);
    let minDistance = 100;
    console.log("")
    for (const face of newDetectionsResized) {
        for (const descriptor of userFace.descriptions) {
            const distance = faceApi.euclideanDistance(descriptor, face.descriptor);
            console.log("distance", distance)
            minDistance = Math.min(minDistance, distance);
        }
    }
    console.log(minDistance);
    return minDistance< 0.55;
}

module.exports = {uploadLabeledImages, getDescriptorsFromDB}
