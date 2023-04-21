const faceApi = require("@vladmandic/face-api");
const {Canvas, Image} = require("canvas");
const canvas = require("canvas");
const FaceModel = require("../models/face.model");
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
        await UserModel.findOneAndUpdate({user: userId}, {
            descriptions: descriptions,
        });
        console.log("Face data saved successfully");
        return true;
    } catch (error) {
        console.log(error);
        return (error);
    }
}

async function getDescriptorsFromDB(image, userId) {
    // Get all the face data from mongodb and loop through each of them to read the data
    let faces = await FaceModel.findOne({user: userId});
    for (let i = 0; i < faces.length; i++) {
        // Change the face data descriptors from Objects to Float32Array type
        for (let j = 0; j < faces[i].descriptions.length; j++) {
            faces[i].descriptions[j] = new Float32Array(Object.values(faces[i].descriptions[j]));
        }
        // Turn the DB face docs to
        faces[i] = new faceApi.LabeledFaceDescriptors(faces[i].label, faces[i].descriptions);
    }

    // Load face matcher to find the matching face
    const faceMatcher = new faceApi.FaceMatcher(faces, 0.6);

    // Read the image using canvas or other method
    const img = await canvas.loadImage(image);
    let temp = faceApi.createCanvasFromMedia(img);
    // Process the image for the model
    const displaySize = {width: img.width, height: img.height};
    faceApi.matchDimensions(temp, displaySize);

    // Find matching faces
    const detections = await faceApi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
    const resizedDetections = faceApi.resizeResults(detections, displaySize);
    return resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));
}

module.exports = {uploadLabeledImages, getDescriptorsFromDB}
