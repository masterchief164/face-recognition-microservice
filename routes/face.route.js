const express = require('express');
const controller = require('../controllers/face.controller');
const {verify} = require("../middleware/auth");

const router = express.Router();


router.post('/post-face', verify, controller.addFaces);
router.post('/check-face', verify, controller.checkFace);

module.exports = router;
