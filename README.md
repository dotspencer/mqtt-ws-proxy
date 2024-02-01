# mqtt-ws-proxy

A simple mqtt to ws proxy. Connects to a mqtt server, acts as a ws server, and forwards all mqtt messages to all connected ws clients.

### Setup

Create a `.env` file with the following info. Add ip address of the mqtt server on your network.

```
MQTT_SERVER="mqtt://192.168.X.X"
WS_PORT=7070
```

Run `yarn` to install dependencies.

### Start

Run `yarn server` to start the proxy.

Run `yarn test-client` to start a client for testing that logs all received messages.
