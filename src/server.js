require('dotenv').config();

const mqtt = require('mqtt');
const express = require('express');
const { WebSocket } = require('ws');

const { WS_PORT, MQTT_SERVER, EXPRESS_PORT } = process.env;

/**
 * Set up ws server
 */
const wss = new WebSocket.Server({
  port: WS_PORT,
  clientTracking: true,
});
wss.on('connection', handleConnection);

wss.on('listening', () => {
  console.log(`Websocket server listening at ws://localhost:${wss.address().port}`);
});

wss.on('error', (error) => {
  console.log('websocket error:', error);
});

/**
 * Handles new websocket connections
 */
function handleConnection(ws) {
  console.log('✔ connected to websocket client');
  ws.isAlive = true;

  // response from heartbeat
  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('close', (code) => {
    console.log(`  closed with code: ${code}`);
  });
}

/**
 * Terminates any nonresponsive clients
 */
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping(() => {});
  });
}, 5000);

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
 * Forward message to all ws clients
 */
client.on('message', (topic, messageBuffer) => {
  const message = messageBuffer.toString();
  console.log(topic, message);

  latestTopics[topic] = message;

  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ topic, message }));
    }
  });
});

/**
 * Add express server for debug info
 */
const expressApp = express();
expressApp.set('json spaces', 2);
expressApp.listen(EXPRESS_PORT);
expressApp.get('/info', (req, res) => {
  const list = Array.from(wss.clients);
  res.json({
    numClients: list.length,
  });
});
