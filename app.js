var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var mqtt = require('mqtt');

var app = express();
var server = http.createServer(app);
var io = socketio(server);

var clientsConnected = 0;

var mqttClient = mqtt.connect('tcp://broker.shiftr.io', {
  clientId: 'itsnet-test-app',
  username: process.env.MQTTUSER,
  password: process.env.MQTTKEY
});


mqttClient.on('connect', function(){
  console.log('Connected to MQTT broker.');
  mqttClient.subscribe('itsGeiger01/get/cpm');
  mqttClient.subscribe('itsSolarMeter01/get/cond');
});

mqttClient.on('message', function(topic, message) {
  var msgObj = JSON.parse(message);
  if (msgObj['cpmGet']) {
    io.sockets.emit('cpmBroadcast', msgObj['cpmGet'])
  } else if (msgObj['tempGet']) {
    io.sockets.emit('envbroadcast', msgObj)
  }
});

app.set('port', (process.env.PORT || 1337));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(browserClient){
  console.log('Number of connected clients: ' + ++clientsConnected);
  browserClient.on('join', function(data){
    console.log(data);
  })
  browserClient.on('disconnect', function() {
    console.log('Number of connected clients: ' + --clientsConnected);
  });
});

server.listen(app.get('port'), function() {
  console.log('Server started on port: ', app.get('port'));
});
