require('dotenv').config();

const mqtt = require('mqtt');
const { WebSocketServer, WebSocket } = require('ws');

const { WS_PORT, MQTT_SERVER } = process.env;

/**
 * Connect and subscribe to mqtt
 */
const client = mqtt.connect(MQTT_SERVER);
client.on('connect', () => {
  client.subscribe('#', (err) => {
    if (err) {
      console.log('err:', err);
    }
  });
});

/**
 * Set up ws server
 */
const wss = new WebSocketServer({ port: WS_PORT });
wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
});

/**
 * Forward message to all ws clients
 */
client.on('message', (topic, messageBuffer) => {
  const message = messageBuffer.toString();
  console.log(topic, message);

  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ topic, message }));
    }
  });
});
