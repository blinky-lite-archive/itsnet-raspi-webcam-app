$(document).ready(function() {
    var gaugeData;
    var gaugeChart;
    var gaugeOptions;
    var lineData;
    var lineChart;
    var lineChartOptions;
    var socket = io.connect(window.location.href)

    socket.on('connect', function(data) {
        socket.emit('join', 'Connection from browser established.');
    });

    socket.on('cpmBroadcast', function(data) {
        var time = new Date();
        var timeVal = [time.getHours(), time.getMinutes(), time.getSeconds()];

        gaugeData.setValue(0, 1, Number(data));
        gaugeChart.draw(gaugeData, gaugeOptions);

        lineData.addRow(
            [timeVal, Number(data), null, null, null]);
        lineChart.draw(lineData, lineChartOptions);
    });

    socket.on('envbroadcast', function(data) {
        var time = new Date();
        var timeVal = [time.getHours(), time.getMinutes(), time.getSeconds()];

        gaugeData.setValue(1, 1, Number(data['tempGet']));
        gaugeData.setValue(2, 1, Number(data['photoAvgGet']));
        gaugeData.setValue(3, 1, Number(data['photoGet']));
        gaugeChart.draw(gaugeData, gaugeOptions);

        lineData.addRow(
            [timeVal, null, Number(data['tempGet']), Number(data['photoAvgGet']), Number(data['photoGet'])]);
        lineChart.draw(lineData, lineChartOptions);
    });

    google.charts.load('current', {
        'packages': ['corechart', 'line', 'gauge']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

        gaugeData = google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            ['CPM', 0],
            ['Temperature', 0],
            ['Photo-Avg', 0],
            ['Photo', 0]
        ]);

        lineData = new google.visualization.DataTable();
        lineData.addColumn('timeofday', 'Time');
        lineData.addColumn('number', 'CPM');
        lineData.addColumn('number', 'Temperature');
        lineData.addColumn('number', 'Photo-Average');
        lineData.addColumn('number', 'Photo');

        gaugeOptions = {
            width: 900,
            height: 250,
            minorTicks: 10,
            max: 40
        };

        lineChartOptions = {
            interpolateNulls: true
        };

        gaugeChart = new google.visualization.Gauge(document.getElementById('gauge_div'));

        lineChart = new google.visualization.LineChart(document.getElementById('linechart_div'));
    }
});
