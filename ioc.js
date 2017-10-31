var dotenv  = require('dotenv').config();
var mqtt = require('mqtt');
var exec = require('child_process').exec;

var cameraSettings = 
{
  width:'800',
  height:'600',
  rot:'0',
  timeout:'3000'
};
var camInfo = {date:new Date().toLocaleTimeString(), counter:0}
var cameraInterval = 5000;
var counter = 0;

var mqttClientId = 'ItsIceCube07CamIoc';
var mqttMainTopic = 'itsIceCube07Cam'

var mqttClient = mqtt.connect('tcp://broker.shiftr.io', 
{
  clientId: mqttClientId,
  username: process.env.MQTTUSER,
  password: process.env.MQTTKEY,
  clean:false
});

mqttClient.on('connect', function(){connectToMqtt();});
mqttClient.on('message', function(topic, message) {handleMqttMessage(topic, message);});

function connectToMqtt()
{
  mqttClient.subscribe(mqttMainTopic + '/set');
}
function handleMqttMessage(topic, message)
{
//  console.log('Received top: ' + topic + ' with mesage: ' + message);
//  if (topic == 'itsIceCube08Cam/image/date') console.log(message);
    if (topic == mqttMainTopic + '/set')
    {
        cameraSettings = JSON.parse(message);
    }
    
}
setInterval(function(){takePicture();}, cameraInterval);
function takePicture()
{
    var cameraCommand = '';
    cameraCommand  = cameraCommand + " -w " + cameraSettings.width;
    cameraCommand  = cameraCommand + " -h " + cameraSettings.height;
    cameraCommand  = cameraCommand + " -rot " + cameraSettings.rot;
    cameraCommand  = cameraCommand + " -t " + cameraSettings.timeout;
    cameraCommand = "raspistill" + cameraCommand + " -o raspiWebCamImage.jpg";
    console.log('Executing: ' + cameraCommand);

}