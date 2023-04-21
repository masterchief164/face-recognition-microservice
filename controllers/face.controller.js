const faceService = require('../services/face.service');

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

const checkFace = async (req, res) => {
    try {
        const File1 = req.files.File1.tempFilePath;
        const userId = req.user._id;
        let result = await faceService.getDescriptorsFromDB(File1, userId);
        res.json({result});
    } catch (error) {
        console.log(error);
        res.status(500)
            .send({error});
    }
}

module.exports = {addFaces, checkFace}
