class RfSigGen
{
    constructor(publishTopic, label)
    {
        this.label = label;
        this.freqMhz = 704.42;
        this.powLvl = -20.0;
        this.powOn = false;
        this.publishTopic = publishTopic;
        this.settingsDisabled = true;
    }
    createGui(parentId)
    {
      var _this = this; // a weird thing to do to define button click
      this.parentId = parentId;
      var guiDiv = document.createElement("div");
      var tabLabel = document.createElement("Label");
      tabLabel.setAttribute("for", "name");
      tabLabel.setAttribute("class", 'widgetTab');
      tabLabel.innerHTML = this.label;
      $( "#" + parentId ).append(tabLabel);

      var tbl = document.createElement("table");
      var tblBody = document.createElement("tbody");
     
      var row = document.createElement("tr");
      var cell = document.createElement("td");
      var cellText = document.createTextNode("");
      cell.setAttribute("class", 'cellText');
      cell.appendChild(cellText);
      row.appendChild(cell);
      
      cell = document.createElement("td");
      var button = document.createElement("BUTTON");
      var buttonText = document.createTextNode("Set");     
      button.style.width = "5em";
      button.style.textAlign = "center";
      button.appendChild(buttonText);
      button.setAttribute("id", parentId + "-setButton");
      button.onclick = function() { _this.setSettings()}; 
      cell.style.textAlign = "center";
      cell.appendChild(button);
      row.appendChild(cell);

      cell = document.createElement("td");
      cellText = document.createTextNode("");
      cell.setAttribute("class", 'cellText');
      cell.appendChild(cellText);
      row.appendChild(cell);

      tblBody.appendChild(row);

      row = document.createElement("tr");
      cell = document.createElement("td");
      cellText = document.createTextNode("Name");
      cell.setAttribute("class", 'cellText');
      cell.appendChild(cellText);
      row.appendChild(cell);

      cell = document.createElement("td");
      cellText = document.createTextNode("Value");
      cell.setAttribute("class", 'cellText');
      cell.appendChild(cellText);
      row.appendChild(cell);
        
      cell = document.createElement("td");
      cellText = document.createTextNode("Unit");
      cell.setAttribute("class", 'cellText');
      cell.appendChild(cellText);
      row.appendChild(cell);

      tblBody.appendChild(row);
      
      row = document.createElement("tr");
      cell = document.createElement("td");
      cellText = document.createTextNode("Frequency");
      cell.setAttribute("class", 'cellText');
      cell.appendChild(cellText);
      row.appendChild(cell);

      cell = document.createElement("td");
      var input = document.createElement("INPUT");
      input.setAttribute("type", "number");
      input.setAttribute("value", this.freqMhz);
      input.setAttribute("step", "0.01");
      input.setAttribute("id",parentId + "-freqMhz");
      input.onchange = function(){ _this.inputFieldChange(parentId + "-freqMhz", _this.freqMhz)};
      input.style.width = "5em";
      cell.setAttribute("class", 'cellText');
      cell.style.textAlign = "center";
      cell.appendChild(input);
      row.appendChild(cell);

      cell = document.createElement("td");
      cellText = document.createTextNode("MHz");
      cell.setAttribute("class", 'cellText');
      cell.appendChild(cellText);
      row.appendChild(cell);

      tblBody.appendChild(row);

      row = document.createElement("tr");
      cell = document.createElement("td");
      cellText = document.createTextNode("Power Level");
      cell.setAttribute("class", 'cellText');
      cell.appendChild(cellText);
      row.appendChild(cell);

      cell = document.createElement("td");
      input = document.createElement("INPUT");
      input.setAttribute("type", "number");
      input.setAttribute("value", this.powLvl);
      input.setAttribute("step", "0.1");
      input.setAttribute("id",parentId + "-powLvl");
      input.onchange = function(){ _this.inputFieldChange(parentId + "-powLvl", _this.powLvl)};
      input.style.width = "5em";
      cell.setAttribute("class", 'cellText');
      cell.style.textAlign = "center";
      cell.appendChild(input);
      row.appendChild(cell);

      cell = document.createElement("td");
      cell.setAttribute("class", 'cellText');
      cellText = document.createTextNode("dBm");
      cell.appendChild(cellText);
      row.appendChild(cell);

      tblBody.appendChild(row);

      row = document.createElement("tr");
      cell = document.createElement("td");
      cellText = document.createTextNode("Power");
      cell.setAttribute("class", 'cellText');
      cell.appendChild(cellText);
      row.appendChild(cell);

      cell = document.createElement("td");
      button = document.createElement("BUTTON");
      buttonText = document.createTextNode("OFF");     
      button.style.width = "5em";
      button.style.textAlign = "center";
      button.appendChild(buttonText);
      button.setAttribute("id", parentId + "-onButton");
      button.setAttribute("class", 'powOffButton');
      button.onclick = function() { _this.togglePowerButton()}; 
      cell.style.textAlign = "center";
      cell.appendChild(button);
      row.appendChild(cell);

      cell = document.createElement("td");
      row.appendChild(cell);

      tblBody.appendChild(row);

      tbl.appendChild(tblBody);
      guiDiv.style.border = "thin solid #FFFFFF";
      guiDiv.appendChild(tbl);
      $( "#" + parentId ).append(guiDiv);
      document.getElementById(parentId).setAttribute("class", 'widgetDiv');
        
    }
    setSettings()
    {
        $( "#" + this.parentId + "-onButton" ).attr('class','powIntButton');
        var rfOn = $( "#" + this.parentId + "-onButton" ).html();
        this.freqMhz = Number($(  "#" + this.parentId + "-freqMhz" ).val())
        this.powLvl = Number($(  "#" + this.parentId + "-powLvl" ).val())
        var data = {"rfFreq":this.freqMhz.toString(), "rfPowLvl":this.powLvl.toString(), "rfPowOn":rfOn};
        var data2 = {'topic':this.publishTopic, 'jsonData':data};
        socket.emit('publishRFSigGenMqttTopic', data2);

    }
    togglePowerButton()
    {
        $( "#" + this.parentId + "-onButton" ).attr('class','powIntButton');
        var rfOn = $( "#" + this.parentId + "-onButton" ).html();
        if (rfOn == "ON")
        {
            $( "#" + this.parentId + "-onButton" ).html("OFF");
            rfOn = 'OFF';
        }
        else
        {
            $( "#" + this.parentId + "-onButton" ).html("ON");
            rfOn = 'ON';
        }
        var data = {"rfFreq":this.freqMhz.toString(), "rfPowLvl":this.powLvl.toString(), "rfPowOn":rfOn};
        var data2 = {'topic':this.publishTopic, 'jsonData':data};
        socket.emit('publishRFSigGenMqttTopic', data2);
        
    }
    inputFieldChange(id, storedValue)
    {
        if (storedValue != $( "#" + id).val())
        {
            $( "#" + id).attr('class','inputFieldChange');
        }
        else
        {
            $( "#" + id).attr('class','inputFieldNormal');
        }
    }
    readData(data)
    {
        console.log("Received: " + JSON.stringify(data));
        this.freqMhz = Number(data['rfFreq']);
        $( "#" + this.parentId + "-freqMhz" ).val(this.freqMhz);
        if (!this.settingsDisabled) $( "#" + this.parentId + "-freqMhz" ).attr('class','inputFieldNormal');
        this.powLvl = Number(data['rfPowLvl']);
        $( "#" + this.parentId + "-powLvl" ).val(this.powLvl);
        if (!this.settingsDisabled) $( "#" + this.parentId + "-powLvl" ).attr('class','inputFieldNormal');
        var rfOn = data['rfPowOn'];
        this.powOn = false;
        if (rfOn == 'ON') this.powOn = true;
        if (this.powOn)
        {
            $( "#" + this.parentId + "-onButton" ).html('ON');
            $( "#" + this.parentId + "-onButton" ).attr('class','powOnButton');
        }
        else
        {
            $( "#" + this.parentId + "-onButton" ).html('OFF');
            $( "#" + this.parentId + "-onButton" ).attr('class','powOffButton');
        }
    }

      setDisabled(disabled) 
      {
        this.settingsDisabled = disabled;
        $( "#" + this.parentId + "-freqMhz").prop("disabled", disabled);
        $( "#" + this.parentId + "-powLvl").prop("disabled", disabled);
        $( "#" + this.parentId + "-onButton").prop("disabled", disabled);
        if ( disabled) document.getElementById(this.parentId + '-setButton').style.display = "none";
        if (!disabled) document.getElementById(this.parentId + '-setButton').style.display = "block";
          
      }

}