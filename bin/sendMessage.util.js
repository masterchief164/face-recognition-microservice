const amqplib = require("amqplib");
require("dotenv").config();
const url = process.env.RABBITMQ_URL;
const sendMessage = async (message, queueName) => {
    try {
        const connection = await amqplib.connect(url);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, {durable: true});
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {persistent: true, autoDelete: true});
    } catch (err) {
        console.log(err);
    }
}

module.exports = {sendMessage}
