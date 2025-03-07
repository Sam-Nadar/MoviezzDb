import amqplib from "amqplib";
import { ENV } from "../config/env";

let channel: amqplib.Channel | null = null;

//  Function to Connect to RabbitMQ and Initialize Channel
export const connectQueue = async (): Promise<void> => {
    try {
        const connection = await amqplib.connect(ENV.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue("movieQueue", { durable: true });
        console.log(" Connected to RabbitMQ and queue initialized.");
    } catch (error) {
        console.error("❌ RabbitMQ Connection Error:", error);
        throw new Error("Failed to connect to RabbitMQ");
    }
};

//  Publish message to queue (with channel check)
export const publishToQueue = async (message: object): Promise<void> => {
    if (!channel) {
        console.error("❌ RabbitMQ channel is not initialized.");
        throw new Error("RabbitMQ channel is not initialized");
    }
    
    channel.sendToQueue("movieQueue", Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log("📩 Message sent to queue:", message);
};

//  Consume messages from queue (with channel check)
export const consumeQueue = async (callback: (data: any) => void): Promise<void> => {
    if (!channel) {
        console.error("❌ RabbitMQ channel is not initialized.");
        throw new Error("RabbitMQ channel is not initialized");
    }

    channel.consume("movieQueue", (msg) => {
        if (msg !== null) {
            const data = JSON.parse(msg.content.toString());
            callback(data);
            channel?.ack(msg); //  Ensure message acknowledgment
        }
    });
};
