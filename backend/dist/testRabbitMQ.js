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
const amqplib_1 = __importDefault(require("amqplib"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5671/';
function testConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('🔄 Connecting to RabbitMQ...');
            const connection = yield amqplib_1.default.connect(RABBITMQ_URL);
            console.log(' Successfully connected to RabbitMQ');
            yield connection.close();
        }
        catch (error) {
            console.error('❌ RabbitMQ Connection Error:', error);
        }
    });
}
testConnection();
