var forwardPowerGaugeData;
var forwardPowerGaugeChart;
var forwardPowerGaugeOptions;
var parentId = 'googleGauge'; 

function setupGaugePlots()
{
    var tabLabel = document.createElement("Label");
    tabLabel.setAttribute("for", "name");
    tabLabel.setAttribute("class", 'widgetTab');
    tabLabel.innerHTML = 'Klystron Power';
    $( "#" + parentId ).append(tabLabel);

    var guiDiv = document.createElement("div");
    var tbl = document.createElement("table");
    var tblBody = document.createElement("tbody");
     
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    cell.setAttribute("id", parentId + "-gaugeCell");

    row.appendChild(cell);
    tblBody.appendChild(row);
    row = document.createElement("tr");
    cell = document.createElement("td");
    cell.setAttribute("id", parentId + "-powerCell");
    var tbl2 = document.createElement("table");
    tbl2.setAttribute('width', '100%');
    var tblBody2 = document.createElement("tbody");
     
    var row2 = document.createElement("tr");
    var cell2 = document.createElement("td");
    cell2.innerHTML = 'Fwd Pow';
    cell2.style.textAlign = "left";
    row2.appendChild(cell2);
    cell2 = document.createElement("td");
    cell2.innerHTML = '0';
    cell2.setAttribute("id", parentId + "-FwdPowCell");
    cell2.style.textAlign = "center";
    row2.appendChild(cell2);
    cell2 = document.createElement("td");
    cell2.innerHTML = 'dBm';
    cell2.style.textAlign = "right";
    row2.appendChild(cell2);

    tblBody2.appendChild(row2);

    row2 = document.createElement("tr");
    cell2 = document.createElement("td");
    cell2.innerHTML = 'Rev Pow';
    cell2.style.textAlign = "left";
    row2.appendChild(cell2);
    cell2 = document.createElement("td");
    cell2.innerHTML = '0';
    cell2.setAttribute("id", parentId + "-RevPowCell");
    cell2.style.textAlign = "center";
    row2.appendChild(cell2);
    cell2 = document.createElement("td");
    cell2.innerHTML = 'dBm';
    cell2.style.textAlign = "right";
    row2.appendChild(cell2);

    tbl2.appendChild(tblBody2);
    cell.appendChild(tbl2);

    row.appendChild(cell);
    tblBody.appendChild(row);
    
    tbl.appendChild(tblBody);
    guiDiv.appendChild(tbl);
    
    tblBody2.appendChild(row2);

    guiDiv.style.border = "thin solid #FFFFFF";
    $( "#" + parentId ).append(guiDiv);
    document.getElementById(parentId).setAttribute("class", 'widgetDiv');

    google.charts.load('current', {'packages': ['corechart', 'gauge']});
    google.charts.setOnLoadCallback(drawChart);
}
function drawChart()
{
    forwardPowerGaugeData = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Power kW', 0]
    ]);
    forwardPowerGaugeData.setValue(0, 1, Number(0));
    forwardPowerGaugeOptions = {
        width: 225,
        height: 250,
        minorTicks: 10,
        max: 1500,
        greenFrom: 0,
        greenTo: 500,
        yellowFrom: 500,
        yellowTo: 1000,
        redFrom: 1000,
        redTo: 1500
    };
    forwardPowerGaugeChart = new google.visualization.Gauge(document.getElementById(parentId + "-gaugeCell"));
    forwardPowerGaugeChart.draw(forwardPowerGaugeData, forwardPowerGaugeOptions);
}
function updateGaugePlots(data)
{
    console.log("Received: " + JSON.stringify(data));
    var fwdPowKw =  Math.pow(10.0, (Number(data['power1']) - 60.0) / 10.0);
    forwardPowerGaugeData.setValue(0, 1, fwdPowKw);
    forwardPowerGaugeChart.draw(forwardPowerGaugeData, forwardPowerGaugeOptions);
    $( "#" + parentId + "-FwdPowCell" ).html(data['power1']);
    $( "#" + parentId + "-RevPowCell" ).html(data['power2']);
    
}
    
