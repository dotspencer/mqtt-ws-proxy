require('dotenv').config();
const { WebSocket } = require('ws');

const { WS_PORT, PROXY_SERVER } = process.env;

const ws = new WebSocket(`${PROXY_SERVER}:${WS_PORT}`);

ws.on('error', console.error);

ws.on('open', () => {});

ws.on('message', (data) => {
  console.log('received:', data.toString());
});
