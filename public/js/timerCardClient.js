class TimerCard {

  constructor(ch1Title,ch2Title,ch3Title,ch4Title, publishTopic, label) 
  {
      this.chTitle = ["Chx", "Chx", "Chx", "Chx"];
      this.startTime = [0,0,0,0];
      this.stopTime = [1,1,1,1];
      this.event = [0,0,0,0];
      this.chTitle[0] = ch1Title;
      this.chTitle[1] = ch2Title;
      this.chTitle[2] = ch3Title;
      this.chTitle[3] = ch4Title;
      this.publishTopic = publishTopic;
      this.label = label;
      this.settingsEnabled = false;
 }
  setDisabled(disabled) {
    for (var irow = 0; irow < 8 ; ++irow) {
      for (var icol = 1; icol < 5; icol++) {
        var id = "#" + this.tableId +  "-ch" + icol + "-bit" + irow;
        $(id).prop("disabled", disabled);
      }
    }
    for (var icol = 1; icol < 5; icol++) {
        var id = "#" + this.tableId +  "-ch" + icol + "Start";
        $(id).prop("disabled", disabled);
        id = "#" + this.tableId +  "-ch" + icol + "Stop";
        $(id).prop("disabled", disabled);
    }
    $("#" + this.tableId + '-setButton').attr("disabled", disabled);
//    if ( disabled) document.getElementById(this.tableId + '-setButton').style.display = "none";
//    if (!disabled) document.getElementById(this.tableId + '-setButton').style.display = "block";
    this.settingsEnabled = !disabled;
  }
  setSettings() 
  {
    var data = {};100
    for (var ii = 1; ii < 5; ++ii) 
    {
      this.startTime[ii - 1] = Number($( '#' + this.tableId + '-ch' + ii + 'Start').val())
      this.stopTime[ii - 1]  = Number($( '#' + this.tableId + '-ch' + ii + 'Stop').val());
			var mask = 0;
			var pow2 = 1;
			for (var ij = 0; ij < 8; ++ij)
			{
        if ($( '#' + this.tableId + "-ch" + ii + "-bit" + ij).prop('checked')) mask = mask + pow2;
				pow2 = pow2 * 2;
			}
			this.event[ii - 1] = mask; 
      data['channel' + ii] = this.event[ii - 1].toString() + ' ' + this.startTime[ii - 1].toString() + ' ' + this.stopTime[ii - 1];
    }
    var data2 = {'topic':this.publishTopic, 'jsonData':data};
    socket.emit('publishTimerCardMqttTopic', data2);
  }
  createTimer(tableId) {
    // creates a <table> element and a <tbody> element
      var _this = this; // a weird thing to do to define button click
      this.tableId = tableId;
      var divy = document.createElement("div");
      var tabLabel = document.createElement("Label");
      tabLabel.setAttribute("for", "name");
      tabLabel.setAttribute("class", 'widgetTab');
      tabLabel.innerHTML = this.label;
      $( "#" + tableId ).append(tabLabel);
     
      var tbl = document.createElement("table");
      var tblBody = document.createElement("tbody");
     
      var row = document.createElement("tr");
      var cell = document.createElement("td");
      row.appendChild(cell);
      cell = document.createElement("td");
      row.appendChild(cell);

      cell = document.createElement("td");
      var button = document.createElement("BUTTON");
      var buttonText = document.createTextNode("Set");     
      button.style.width = "5em";
      button.style.textAlign = "center";
      button.appendChild(buttonText);
      button.setAttribute("id", tableId + "-setButton");
      button.onclick = function() { _this.setSettings()}; 
      cell.style.textAlign = "center";
      cell.appendChild(button);
      row.appendChild(cell);

      cell = document.createElement("td");
      row.appendChild(cell);
      cell = document.createElement("td");
      row.appendChild(cell);
      
      tblBody.appendChild(row);

      row = document.createElement("tr");
      cell = document.createElement("td");
      var cellText = document.createTextNode("");document.createElement("INPUT");
      cell.setAttribute("class", 'cellText');
      cell.appendChild(cellText);
      row.appendChild(cell);
      for (var icol = 1; icol < 5; icol++) {
          cell = document.createElement("td");
          cellText = document.createTextNode(this.chTitle[icol - 1]);
          cell.setAttribute("class", 'cellText');
          cell.style.textAlign = "center";
          cell.appendChild(cellText);
          row.appendChild(cell);
      }
      
      tblBody.appendChild(row);
      
      row = document.createElement("tr");
      cell = document.createElement("td");
      cellText = document.createTextNode("Start (uS)");
      cell.setAttribute("class", 'cellText');
      cell.style.textAlign = "center";
      cell.appendChild(cellText);
      row.appendChild(cell);
      var startInput = [];
      for (var icol = 1; icol < 5; icol++) {
          cell = document.createElement("td");
          var inputId = tableId + "-ch" + icol + "Start";
          startInput[icol -1] = document.createElement("INPUT");
          startInput[icol -1].setAttribute("type", "number");
          startInput[icol -1].setAttribute("value", this.startTime[icol - 1]);
          startInput[icol -1].setAttribute("id",inputId);
          startInput[icol -1].style.width = "4em";

          cell.setAttribute("class", 'cellText');
          cell.style.textAlign = "center";
          cell.appendChild(startInput[icol -1]);
          row.appendChild(cell);
      }
      startInput[0].onchange = function(){_this.inputFieldChange(_this.tableId + "-ch" + 1 + "Start", _this.startTime[0]);};
      startInput[1].onchange = function(){_this.inputFieldChange(_this.tableId + "-ch" + 2 + "Start", _this.startTime[1]);};
      startInput[2].onchange = function(){_this.inputFieldChange(_this.tableId + "-ch" + 3 + "Start", _this.startTime[2]);};
      startInput[3].onchange = function(){_this.inputFieldChange(_this.tableId + "-ch" + 4 + "Start", _this.startTime[3]);};
      
      tblBody.appendChild(row);
      
      row = document.createElement("tr");
      cell = document.createElement("td");
      cellText = document.createTextNode("Stop (uS)");
      cell.setAttribute("class", 'cellText');
      cell.style.textAlign = "center";
      cell.appendChild(cellText);
      row.appendChild(cell);
      var stopInput = [];
      for (var icol = 1; icol < 5; icol++) {
          cell = document.createElement("td");
          stopInput[icol -1] = document.createElement("INPUT");
          stopInput[icol -1].setAttribute("type", "number");
          stopInput[icol -1].setAttribute("value", this.stopTime[icol - 1]);
          stopInput[icol -1].setAttribute("id",tableId + "-ch" + icol + "Stop");
          stopInput[icol -1].style.width = "4em";

          cell.setAttribute("class", 'cellText');
          cell.style.textAlign = "center";
          cell.appendChild(stopInput[icol -1]);
          row.appendChild(cell);
      }
      stopInput[0].onchange = function(){_this.inputFieldChange(_this.tableId + "-ch" + 1 + "Stop", _this.stopTime[0]);};
      stopInput[1].onchange = function(){_this.inputFieldChange(_this.tableId + "-ch" + 2 + "Stop", _this.stopTime[1]);};
      stopInput[2].onchange = function(){_this.inputFieldChange(_this.tableId + "-ch" + 3 + "Stop", _this.stopTime[2]);};
      stopInput[3].onchange = function(){_this.inputFieldChange(_this.tableId + "-ch" + 4 + "Stop", _this.stopTime[3]);};
      
      tblBody.appendChild(row);
      
      for (var irow = 0; irow < 8 ; ++irow) {
          row = document.createElement("tr");
          cell = document.createElement("td");
          cellText = document.createTextNode("B" + irow);
          cell.setAttribute("class", 'cellText');
          cell.style.textAlign = "center";
          cell.appendChild(cellText);
          row.appendChild(cell);
          for (var icol = 1; icol < 5; icol++) {
              cell = document.createElement("td");
              var input = document.createElement("INPUT");
              input.setAttribute("type", "checkbox");
              input.setAttribute("id",tableId + "-ch" + icol + "-bit" + irow);
              cell.setAttribute("class", 'cellText');
              cell.style.textAlign = "center";
              cell.appendChild(input);
              row.appendChild(cell);
          }
          tblBody.appendChild(row);
      }
      tbl.appendChild(tblBody);
      divy.style.border = "thin solid #FFFFFF";
      divy.appendChild(tbl);
      document.getElementById(tableId).setAttribute("class", 'widgetDiv');
      document.getElementById(tableId).appendChild(divy);

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

  getBit(myByte, position)
	{
	   return (myByte >> position) & 1;
	}
  readData(data)
  {
    console.log("Received: " + JSON.stringify(data));
    for (var ii = 1; ii < 5; ++ii) {
      var chxdata = data['channel' + ii].split(" ");
      this.startTime[ii - 1] = Number(chxdata[1]);
      this.stopTime[ii - 1]  = Number(chxdata[2]);
      this.event[ii - 1] = Number(chxdata[0]);
      if (this.settingsEnabled) $( '#' + this.tableId + '-ch' + ii + 'Start').attr('class','inputFieldNormal');
      if (this.settingsEnabled) $( '#' + this.tableId + '-ch' + ii + 'Stop').attr('class','inputFieldNormal');

			for (var ij = 0; ij < 8; ++ij)
			{
				var bitOn = false;
				if (this.getBit(this.event[ii - 1], ij) > 0) bitOn = true;
        $( '#' + this.tableId + "-ch" + ii + "-bit" + ij).prop('checked', bitOn);
			}
			$( '#' + this.tableId + '-ch' + ii + 'Start').val(this.startTime[ii - 1]);
			$( '#' + this.tableId + '-ch' + ii + 'Stop').val(this.stopTime[ii - 1]);
    }
  }

}

