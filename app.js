const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const getMessage = require("./bin/rabbitmq.util")
const router = require("./routes/face.route");
require("@tensorflow/tfjs-node");


app.use(cors({
    credentials: true,
    origin: ['http://localhost:3001', 'https://smartattendance.live', 'https://www.smartattendance.live',
        'https://smart-attendance-blue.vercel.app/']
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"));

app.use(morgan("dev"));
app.use('/', router);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

getMessage.getMessage();
