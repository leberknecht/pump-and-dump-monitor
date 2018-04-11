"use strict";

const WebSocket = require('ws');
let yaml = require('js-yaml');
let  fs = require('fs');

const configPath = __dirname + '/../config/services.yaml';
let  configParameters = yaml.safeLoad(fs.readFileSync(configPath, 'utf8')).parameters;

console.log('websocket push key: ' + configParameters.secret);

const wss = new WebSocket.Server({
    port: 8081
});

wss.on('connection', function connection(ws) {
    let remoteIp = ws._socket.remoteAddress;
    let thisSocket = ws;

    function writeLog(message) {
        console.log(remoteIp + ': ' + message);
    }

    console.log('new client connected, ip: ' + remoteIp);

    ws.on('message', function incoming(message) {
        let broadcastMessage = JSON.parse(message);
        if (configParameters.secret !== JSON.parse(message).push_secret) {
            writeLog('invalid push key, message: ' + message);
            writeLog(configParameters.secret);
            writeLog(broadcastMessage.push_secret);

            return;
        }

        delete broadcastMessage.push_secret;
        wss.clients.forEach(function each(client) {
            if (client !== thisSocket && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(broadcastMessage));
            }
        });
    });
});
