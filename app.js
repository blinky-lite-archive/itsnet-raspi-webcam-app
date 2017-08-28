var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var mqtt = require('mqtt');

var app = express();
var server = http.createServer(app);
var io = socketio(server);

var clientsConnected = 0;
var msgObj = "";
var topics = ['itsClkRecvr01/set/channel'];
var messages = [''];
var okayIps = ['130.235.82.5'];

var mqttClient = mqtt.connect('tcp://broker.shiftr.io', {
  clientId: 'itsnet-test-app',
  username: process.env.MQTTUSER,
  password: process.env.MQTTKEY
});

mqttClient.on('connect', function(){connectToMqtt();});
mqttClient.on('message', function(topic, message) {handleMqttMessage(topic, message);});

app.set('port', (process.env.PORT || 1337));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next){
  res.sendFile(__dirname + '/index.html');
  var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
  setTimeout(function(){checkIp(ip);}, 500);
  
});

io.on('connection', function(browserClient){
  console.log('Number of connected clients: ' + ++clientsConnected);
  browserClient.on('join', function(data){console.log(data);});
  browserClient.on('initData', function(data){sendJsonDataToClient(data);});
  browserClient.on('disconnect', function() {console.log('Number of connected clients: ' + --clientsConnected);});
});


server.listen(app.get('port'), function() {
  console.log('Server started on port: ', app.get('port'));
});

function sendJsonDataToClient(topic)
{
  var itopic = 0;
  while (itopic < topics.length) 
  {
    if (topic == topics[itopic]) 
    {
      io.sockets.emit(topics[itopic], messages[itopic]);
      itopic == topics.length;
    }
    ++itopic;
  }
}
function handleMqttMessage(topic, message)
{
  var itopic = 0;
  while (itopic < topics.length) {
    if (topic == topics[itopic]) {
      messages[itopic] = JSON.parse(message);
      io.sockets.emit(topics[itopic], messages[itopic]);
      itopic == topics.length;
    }
    ++itopic;
  }
}
function connectToMqtt()
{
  console.log('Connected to MQTT broker.');
  for (var itopic = 0; itopic < topics.length; ++itopic) 
  {
    console.log("Subscribing to " + topics[itopic]);
    mqttClient.subscribe(topics[itopic]);
  }
}
function checkIp(ip)
{
  var iip = 0;
//  ip = ip.trim();
  var ipOkay = false;
  while (iip < okayIps.length) 
  {
    if (ip == okayIps[iip]) 
    {
      iip == okayIps.length;
      ipOkay = true;
    }
    ++iip;
  }
  if (ipOkay)
  {
    console.log(ip + " is okay");
    io.sockets.emit('enableSettings', true);
  }
  else
  {
    console.log(ip + " is bad");
    io.sockets.emit('enableSettings', false);
    
  }
}