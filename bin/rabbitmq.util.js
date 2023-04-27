const amqplib = require('amqplib');
const controller = require('../controllers/face.controller');

require("dotenv").config();
const url = process.env.RABBITMQ_URL;
const getMessage = async () => {
    try {

        const connection = await amqplib.connect(url)
        const channel = await connection.createChannel();
        await channel.assertQueue("jobs", {durable: true});
        await channel.prefetch(1);
        await channel.consume("jobs", async (message) => {
            const job = JSON.parse(message.content.toString());
            if (job.type === "addFace") {
                try {
                    await controller.addFaces(message.content.toString());
                } catch (err) {
                    console.log(err)
                }
                channel.ack(message)
            } else if (job.type === "checkFace") {
                try {
                    await controller.checkFace(job)
                } catch (err) {
                    console.log(err)
                }
                channel.ack(message)
            } else {
                channel.ack(message)
            }
        }, {noAck: false});
    } catch (err) {
        console.log(err)
    }
}

module.exports = {getMessage};
