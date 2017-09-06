var topics = ['itsPowerMeter01/get'];
var messages = [{"power1":"0", "power2":"0"}];

exports.handleMqtt = function(topic, message, io)
{
  var itopic = 0;
  while (itopic < topics.length) 
  {
    if (topic == topics[itopic]) 
    {
      messages[itopic] = JSON.parse(message);
      console.log("Received Mqtt message with topic " + topic + " data: " + JSON.stringify(messages[itopic]));
      io.sockets.emit(topics[itopic], messages[itopic]);
      itopic == topics.length;
    }
    ++itopic;
  }
};
exports.subscribe = function(mqttClient)
{
  for (var itopic = 0; itopic < topics.length; ++itopic) 
  {
    console.log("Subscribing to " + topics[itopic]);
    mqttClient.subscribe(topics[itopic]);
  }

};
