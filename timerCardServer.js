var setTopics = ['itsClkRecvr01/set/channel', 'itsClkRecvr02/set/channel'];
var setMessages = [{"channel1":"1 1 2","channel2":"1 1 2","channel4":"1 1 2","channel3":"1 1 2"}, {"channel1":"1 1 2","channel2":"1 1 2","channel4":"1 1 2","channel3":"1 1 2"}];
var echoTopics = ['itsClkRecvr01/echo/channel', 'itsClkRecvr02/echo/channel'];
var getTopics = ['itsClkRecvr01/get/channel', 'itsClkRecvr02/get/channel'];
        
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
  browserClient.on('initTimerCard', function(data){init(data, io);});
  browserClient.on('publishTimerCardMqttTopic', function(data){publish(data,mqttClient);});
  
};
