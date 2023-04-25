const getMessage = require("./bin/rabbitmq.util")
require("@tensorflow/tfjs-node");


getMessage.getMessage().then(()=>{
    console.log("MQ running...");
});
