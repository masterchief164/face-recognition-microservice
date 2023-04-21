const amqplib = require('amqplib');
const controller = require('../controllers/face.controller');

const getMessage = async ()=>{
    try {

        const connection = await amqplib.connect("amqp://localhost:5672")
        const channel = await connection.createChannel();
        await channel.assertQueue("jobs", {durable: true});
        await channel.prefetch(1);
        await channel.consume("jobs", async (message) => {
            const job = JSON.parse(message.content.toString());
            if (job.type === "addFace") {
                await controller.addFaces(message.content.toString());
                channel.ack(message)
            } else if (job.type === "checkFace") {
                await controller.checkFace(job)
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
