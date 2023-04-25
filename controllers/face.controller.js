const faceService = require('../services/face.service');
const {sendMessage} = require('../bin/sendMessage.util');

const addFaces = async (message) => {
    message = JSON.parse(message)
    try {
        const File1 = Buffer.from(message.File1);
        const File2 = Buffer.from(message.File2);
        const File3 = Buffer.from(message.File3);
        const userId = message.userId;
        await faceService.uploadLabeledImages([File1, File2, File3], userId);
    } catch (error) {
        console.log(error);
    }
}

const checkFace = async (message) => {
    try {
        const File1 = Buffer.from(message.File1);
        const userId = message.userId;
        console.log(message.uuid)
        const result =  await faceService.getDescriptorsFromDB(File1, userId);
        await sendMessage(result, message.uuid)
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {addFaces, checkFace}
