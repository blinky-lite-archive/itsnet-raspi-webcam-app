class TimerTable {

  constructor(ch1Title,ch2Title,ch3Title,ch4Title, publishTopic, label) {
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
    if ( disabled) document.getElementById(this.tableId + '-setButton').style.display = "none";
    if (!disabled) document.getElementById(this.tableId + '-setButton').style.display = "block";
    this.settingsEnabled = !disabled;
  }
  setSettings() 
  {
    var data = {};
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
    socket.emit('publishMqttTopic', data2);
  }
  createTimer(tableId) {
    // creates a <table> element and a <tbody> element
      var _this = this; // a weird thing to do to define button click
      this.tableId = tableId;
      var divy = document.createElement("div");
      $( "#" + tableId ).append('<div><label for="name" style="background-color:#FFFFFF;color: #0095CD; font-weight: bold;">' + this.label + '</label></div>');
     
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
//      button.setAttribute("value", 'Submit');
      button.onclick = function() { _this.setSettings()}; 
      cell.style.textAlign = "center";
      cell.appendChild(button);
      row.appendChild(cell);
      button.style.display = "none";

      cell = document.createElement("td");
      row.appendChild(cell);
      cell = document.createElement("td");
      row.appendChild(cell);
      
      tblBody.appendChild(row);

      row = document.createElement("tr");
      cell = document.createElement("td");
      var cellText = document.createTextNode("");
      cell.appendChild(cellText);
      row.appendChild(cell);
      for (var icol = 1; icol < 5; icol++) {
          cell = document.createElement("td");
          cellText = document.createTextNode(this.chTitle[icol - 1]);
          cell.style.textAlign = "center";
          cell.appendChild(cellText);
          row.appendChild(cell);
      }
      
      tblBody.appendChild(row);
      
      row = document.createElement("tr");
      cell = document.createElement("td");
      cellText = document.createTextNode("Start (uS)");
      cell.style.textAlign = "center";
      cell.appendChild(cellText);
      row.appendChild(cell);
      for (var icol = 1; icol < 5; icol++) {
          cell = document.createElement("td");
          var input = document.createElement("INPUT");
          input.setAttribute("type", "number");
          input.setAttribute("value", this.startTime[icol - 1]);
          input.setAttribute("id",tableId + "-ch" + icol + "Start");
          input.style.width = "5em";
          cell.style.textAlign = "center";
          cell.appendChild(input);
          row.appendChild(cell);
      }
      
      tblBody.appendChild(row);
      
      row = document.createElement("tr");
      cell = document.createElement("td");
      cellText = document.createTextNode("Stop (uS)");
      cell.style.textAlign = "center";
      cell.appendChild(cellText);
      row.appendChild(cell);
      for (var icol = 1; icol < 5; icol++) {
          cell = document.createElement("td");
          var input = document.createElement("INPUT");
          input.setAttribute("type", "number");
          input.setAttribute("value", this.stopTime[icol - 1]);
          input.setAttribute("id",tableId + "-ch" + icol + "Stop");
          input.style.width = "5em";
          cell.style.textAlign = "center";
          cell.appendChild(input);
          row.appendChild(cell);
      }
      
      tblBody.appendChild(row);
      
      for (var irow = 0; irow < 8 ; ++irow) {
          row = document.createElement("tr");
          cell = document.createElement("td");
          cellText = document.createTextNode("B" + irow);
          cell.style.textAlign = "center";
          cell.appendChild(cellText);
          row.appendChild(cell);
          for (var icol = 1; icol < 5; icol++) {
              cell = document.createElement("td");
              var input = document.createElement("INPUT");
              input.setAttribute("type", "checkbox");
              input.setAttribute("id",tableId + "-ch" + icol + "-bit" + irow);
              cell.style.textAlign = "center";
              cell.appendChild(input);
              row.appendChild(cell);
          }
          tblBody.appendChild(row);
      }
      tbl.appendChild(tblBody);
      divy.style.border = "thin solid #FFFFFF";
      divy.style.width = "28em";
      divy.appendChild(tbl);
      document.getElementById(tableId).appendChild(divy);
      this.setDisabled(false);

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

