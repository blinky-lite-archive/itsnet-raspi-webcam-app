function setupApp()
{
    socket.emit('ipStatus', 'get');
    socket.on('enableSettings', function(data) 
    {
        if (data) alert("Looky but no touchy!");
    });
    
}
