var setTopics = ['itsRfSigGen01/set/rf'];
var setMessages = [{"rfFreq":"704.42","rfPowLvl":"-20","rfPowOn":"OFF"}];
var echoTopics = ['itsRfSigGen01/echo/rf'];
var getTopics = ['itsRfSigGen01/get/rf'];

exports.handleMqtt = function(topic, message, io)
{
  var itopic = 0;
  while (itopic < setTopics.length) 
  {
    if (topic == setTopics[itopic]) 
    {
      setMessages[itopic] = JSON.parse(message);
      console.log("Received Mqtt message with topic " + topic + " data: " + JSON.stringify(setMessages[itopic]));
      io.sockets.emit(setTopics[itopic], setMessages[itopic]);
      itopic == setTopics.length;
    }
    ++itopic;
  }
  itopic = 0;
  while (itopic < echoTopics.length)
  {
    if (topic == echoTopics[itopic]) 
    {
      setMessages[itopic] = JSON.parse(message);
      console.log("Received Mqtt message with topic " + topic + " data: " + JSON.stringify(setMessages[itopic]));
      io.sockets.emit(setTopics[itopic], setMessages[itopic]);
      itopic == echoTopics.length;
    }
    ++itopic;
  }
};
function init(topic,io)
{
  var itopic = 0;
  while (itopic < setTopics.length) 
  {
    if (topic == setTopics[itopic]) 
    {
      io.sockets.emit(setTopics[itopic], setMessages[itopic]);
      itopic == setTopics.length;
    }
    ++itopic;
  }
}
exports.subscribe = function(mqttClient)
{
  for (var itopic = 0; itopic < setTopics.length; ++itopic) 
  {
    console.log("Subscribing to " + setTopics[itopic]);
    mqttClient.subscribe(setTopics[itopic]);
  }
  for (var itopic = 0; itopic < echoTopics.length; ++itopic) 
  {
    console.log("Subscribing to " + echoTopics[itopic]);
    mqttClient.subscribe(echoTopics[itopic]);
  }
  for (var itopic = 0; itopic < getTopics.length; ++itopic) 
  {
    console.log("Publishing: " + getTopics[itopic]);
    mqttClient.publish(getTopics[itopic], ' ', {qos:0, retain:true, dup:false}, function() {});
  }
  
};
function publish(data, mqttClient)
{
  console.log("Publishing to " + data['topic'] + " data: " + JSON.stringify(data['jsonData']));
  mqttClient.publish(data['topic'], JSON.stringify(data['jsonData']), {qos:0, retain:true, dup:false}, function() {});
  
}
exports.setupSocket = function(browserClient, io, mqttClient)
{
  browserClient.on('initRfSigGen', function(data){init(data, io);});
  browserClient.on('publishRFSigGenMqttTopic', function(data){publish(data,mqttClient);});
  
};
