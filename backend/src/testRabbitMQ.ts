import amqp from 'amqplib';
import dotenv from "dotenv";
dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5671/';

async function testConnection() {
    try {
        console.log('🔄 Connecting to RabbitMQ...');
        const connection = await amqp.connect(RABBITMQ_URL);
        console.log(' Successfully connected to RabbitMQ');
        await connection.close();
    } catch (error) {
        console.error('❌ RabbitMQ Connection Error:', error);
    }
}

testConnection();
