var setTimerTopics = ['itsClkRecvr01/set/channel', 'itsClkRecvr02/set/channel'];
var setTimerMessages = [{"channel1":"1 1 2","channel2":"1 1 2","channel4":"1 1 2","channel3":"1 1 2"}, {"channel1":"1 1 2","channel2":"1 1 2","channel4":"1 1 2","channel3":"1 1 2"}];
var echoTimerTopics = ['itsClkRecvr01/echo/channel', 'itsClkRecvr02/echo/channel'];
var getTimerTopics = ['itsClkRecvr01/get/channel', 'itsClkRecvr02/get/channel'];
        
exports.handleMqtt = function(topic, message, io)
{
  var itopic = 0;
  while (itopic < setTimerTopics.length) 
  {
    if (topic == setTimerTopics[itopic]) 
    {
      setTimerMessages[itopic] = JSON.parse(message);
      console.log("Received Mqtt message with topic " + topic + " data: " + JSON.stringify(setTimerMessages[itopic]));
      io.sockets.emit(setTimerTopics[itopic], setTimerMessages[itopic]);
      itopic == setTimerTopics.length;
    }
    ++itopic;
  }
  itopic = 0;
  while (itopic < echoTimerTopics.length)
  {
    if (topic == echoTimerTopics[itopic]) 
    {
      setTimerMessages[itopic] = JSON.parse(message);
      console.log("Received Mqtt message with topic " + topic + " data: " + JSON.stringify(setTimerMessages[itopic]));
      io.sockets.emit(setTimerTopics[itopic], setTimerMessages[itopic]);
      itopic == echoTimerTopics.length;
    }
    ++itopic;
  }
};
function init(topic,io)
{
  var itopic = 0;
  while (itopic < setTimerTopics.length) 
  {
    if (topic == setTimerTopics[itopic]) 
    {
      io.sockets.emit(setTimerTopics[itopic], setTimerMessages[itopic]);
      itopic == setTimerTopics.length;
    }
    ++itopic;
  }
}
exports.subscribe = function(mqttClient)
{
  for (var itopic = 0; itopic < setTimerTopics.length; ++itopic) 
  {
    console.log("Subscribing to " + setTimerTopics[itopic]);
    mqttClient.subscribe(setTimerTopics[itopic]);
  }
  for (var itopic = 0; itopic < echoTimerTopics.length; ++itopic) 
  {
    console.log("Subscribing to " + echoTimerTopics[itopic]);
    mqttClient.subscribe(echoTimerTopics[itopic]);
  }
  for (var itopic = 0; itopic < getTimerTopics.length; ++itopic) 
  {
    console.log("Publishing: " + getTimerTopics[itopic]);
    mqttClient.publish(getTimerTopics[itopic], ' ', {qos:0, retain:true, dup:false}, function() {});
  }
  
};
function publish(data, mqttClient)
{
  console.log("Publishing to " + data['topic'] + " data: " + JSON.stringify(data['jsonData']));
  mqttClient.publish(data['topic'], JSON.stringify(data['jsonData']), {qos:0, retain:true, dup:false}, function() {});
  
}
exports.setupSocket = function(browserClient, io, mqttClient)
{
  browserClient.on('initTimerCard', function(data){init(data, io);});
  browserClient.on('publishTimerCardMqttTopic', function(data){publish(data,mqttClient);});
  
};
