var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var mqtt = require('mqtt');

var app = express();
var server = http.createServer(app);
var io = socketio(server);

var clientsConnected = 0;
var ipAddress;

var mqttClient = mqtt.connect('tcp://broker.shiftr.io', 
{
  clientId: 'itsnet-basic-app',
  username: process.env.MQTTUSER,
  password: process.env.MQTTKEY,
  clean:false
});

mqttClient.on('connect', function(){connectToMqtt();});
mqttClient.on('message', function(topic, message) {handleMqttMessage(topic, message);});


app.set('port', (process.env.PORT || 1337));

app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res, next){
  res.sendFile(__dirname + '/index.html');
  ipAddress = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
});


server.listen(app.get('port'), function() 
{
  console.log('Server started on port: ', app.get('port'));
});

io.on('connection', function(browserClient)
{
  console.log('Number of connected clients: ' + ++clientsConnected);
  browserClient.on('join', function(data){console.log(data);});
  browserClient.on('disconnect', function() {console.log('Number of connected clients: ' + --clientsConnected);});
});


function handleMqttMessage(topic, message)
{
}
function connectToMqtt()
{
  console.log('Connected to MQTT broker.');
}
