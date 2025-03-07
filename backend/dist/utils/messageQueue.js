"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeQueue = exports.publishToQueue = exports.connectQueue = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const env_1 = require("../config/env");
let channel = null;
//  Function to Connect to RabbitMQ and Initialize Channel
const connectQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield amqplib_1.default.connect(env_1.ENV.RABBITMQ_URL);
        channel = yield connection.createChannel();
        yield channel.assertQueue("movieQueue", { durable: true });
        console.log(" Connected to RabbitMQ and queue initialized.");
    }
    catch (error) {
        console.error("❌ RabbitMQ Connection Error:", error);
        throw new Error("Failed to connect to RabbitMQ");
    }
});
exports.connectQueue = connectQueue;
//  Publish message to queue (with channel check)
const publishToQueue = (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (!channel) {
        console.error("❌ RabbitMQ channel is not initialized.");
        throw new Error("RabbitMQ channel is not initialized");
    }
    channel.sendToQueue("movieQueue", Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log("📩 Message sent to queue:", message);
});
exports.publishToQueue = publishToQueue;
//  Consume messages from queue (with channel check)
const consumeQueue = (callback) => __awaiter(void 0, void 0, void 0, function* () {
    if (!channel) {
        console.error("❌ RabbitMQ channel is not initialized.");
        throw new Error("RabbitMQ channel is not initialized");
    }
    channel.consume("movieQueue", (msg) => {
        if (msg !== null) {
            const data = JSON.parse(msg.content.toString());
            callback(data);
            channel === null || channel === void 0 ? void 0 : channel.ack(msg); //  Ensure message acknowledgment
        }
    });
});
exports.consumeQueue = consumeQueue;
