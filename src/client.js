require('dotenv').config();
const { WebSocket } = require('ws');

const { WS_PORT } = process.env;

const ws = new WebSocket(`ws://192.168.68.63:${WS_PORT}`);

ws.on('error', console.error);

ws.on('open', () => {});

ws.on('message', (data) => {
  console.log('received:', data.toString());
});
