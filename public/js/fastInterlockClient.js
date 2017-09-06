class FastInterlock
{
    constructor(label)
    {
        this.label = label;
        this.settingsDisabled = true;
        this.pinSwitchOn = false;
    }
    createGui(parentId)
    {
      var _this = this; // a weird thing to do to define button click
      this.parentId = parentId;
      var tabLabel = document.createElement("Label");
      tabLabel.setAttribute("for", "name");
      tabLabel.setAttribute("class", 'widgetTab');
      tabLabel.innerHTML = this.label;
      $( "#" + parentId ).append(tabLabel);

      var guiDiv = document.createElement("div");
      var tbl = document.createElement("table");
      var tblBody = document.createElement("tbody");
     
      var row = document.createElement("tr");
      var cell = document.createElement("td");
      var button = document.createElement("BUTTON");
      var buttonText = document.createTextNode("Reset");     
      button.style.textAlign = "center";
      button.appendChild(buttonText);
      button.setAttribute("id", parentId + "-resetButton");
      button.setAttribute("class", 'resetFastInterlockButton');
      button.onclick = function() { _this.reset()}; 
      cell.style.textAlign = "center";
      cell.appendChild(button);
      row.appendChild(cell);
      
      cell = document.createElement("td");
      var cellText = document.createTextNode("Reflected Power Trip :");
      cell.style.textAlign = "right";
      cell.appendChild(cellText);
      row.appendChild(cell);
      
      cell = document.createElement("td");
      var img = document.createElement("img");
      img.src = "images/redlight.png";      
      img.setAttribute("class", 'fastInterlockTripLed');
      img.setAttribute("id", parentId + "-reflectedPowerTripLed");
      cell.appendChild(img);
      row.appendChild(cell);
      
      tblBody.appendChild(row);

      row = document.createElement("tr");
      cell = document.createElement("td");
      row.appendChild(cell);

      cell = document.createElement("td");
      cellText = document.createTextNode("CERN Arc Det. Trip:");
      cell.style.textAlign = "right";
      cell.appendChild(cellText);
      row.appendChild(cell);
      
      cell = document.createElement("td");
      img = document.createElement("img");
      img.src = "images/redlight.png";      
      img.setAttribute("class", 'fastInterlockTripLed');
      img.setAttribute("id", parentId + "-cernArcTripLed");
      cell.appendChild(img);
      row.appendChild(cell);
      
      tblBody.appendChild(row);

      row = document.createElement("tr");
      cell = document.createElement("td");
      button = document.createElement("BUTTON");
      buttonText = document.createTextNode("Pin Switch");     
      button.style.textAlign = "center";
      button.appendChild(buttonText);
      button.setAttribute("id", parentId + "-pinSwitchButton");
      button.setAttribute("class", 'pinSwitchOffButton');
      button.onclick = function() { _this.pinSwitch()}; 
      cell.style.textAlign = "center";
      cell.appendChild(button);
      row.appendChild(cell);
      
      cell = document.createElement("td");
      cellText = document.createTextNode("AFT Arc Det. Trip:");
      cell.style.textAlign = "right";
      cell.appendChild(cellText);
      row.appendChild(cell);
      
      cell = document.createElement("td");
      img = document.createElement("img");
      img.src = "images/redlight.png";      
      img.setAttribute("class", 'fastInterlockTripLed');
      img.setAttribute("id", parentId + "-aftArcTripLed");
      cell.appendChild(img);
      row.appendChild(cell);
      
      tblBody.appendChild(row);

      tbl.appendChild(tblBody);
      guiDiv.style.border = "thin solid #FFFFFF";
      guiDiv.appendChild(tbl);
      $( "#" + parentId ).append(guiDiv);
      document.getElementById(parentId).setAttribute("class", 'widgetDiv');
    }
    reset()
    {
        var data = {"reset":'TRUE'};
        var data2 = {'topic':'toshibaFastInterlock/set', 'jsonData':data};
        socket.emit('publishFastInterlockMqttTopic', data2);
    }
    pinSwitch()
    {
        var pinSwitchState = 'ON';
        if (this.pinSwitchOn) pinSwitchState = 'OFF';
        var data = {"pinSwitch":pinSwitchState};
        var data2 = {'topic':'toshibaFastInterlock/set', 'jsonData':data};
        socket.emit('publishFastInterlockMqttTopic', data2);
    }
    readData(data)
    {
        console.log("Received: " + JSON.stringify(data));
//      "reflPowLvl":"0.143", "pinSwitch":"ON", "trip":"TRUE", "tripType":"arcDet"
        if (data['pinSwitch'] == 'ON')
        {
             $('#' + this.parentId + '-pinSwitchButton').attr('class','pinSwitchOnButton');
             this.pinSwitchOn = true;
        }
        else
        {
             $('#' + this.parentId + '-pinSwitchButton').attr('class','pinSwitchOffButton');
             this.pinSwitchOn = false;
        }
        $('#' + this.parentId + '-reflectedPowerTripLed').attr('src','images/greenlight.png');
        $('#' + this.parentId + '-cernArcTripLed').attr('src','images/greenlight.png');
        $('#' + this.parentId + '-aftArcTripLed').attr('src','images/greenlight.png');
        if (data['trip'] == 'TRUE')
        {
            if (data['tripType'] == 'reflPower') $('#' + this.parentId + '-reflectedPowerTripLed').attr('src','images/redlight.png');
            if (data['tripType'] == 'arcDet') $('#' + this.parentId + '-cernArcTripLed').attr('src','images/redlight.png');
            if (data['tripType'] == 'aftDet') $('#' + this.parentId + '-aftArcTripLed').attr('src','images/redlight.png');
            
        }
    }
    setDisabled(disabled) 
    {
        this.settingsDisabled = disabled;
        $( '#' + this.parentId + '-resetButton').prop("disabled", disabled);
        $('#' + this.parentId + '-pinSwitchButton').prop("disabled", disabled);
    }
}
