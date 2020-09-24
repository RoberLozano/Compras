
const CP = ["FUE", "CON", "TAM", "INT", "POD", "DES", "ASP"];
//Charts
//#region charts


google.charts.load('current', {'packages':['corechart'], 'language': 'es'}); 
google.charts.setOnLoadCallback(drawChart);

var chart;

function drawChart() {

  var data = new google.visualization.DataTable();
  data.addColumn('date', 'Time of Day');
  data.addColumn('number', 'Rating');

  data.addRows([
    [new Date(2015, 0, 1), 5],  [new Date(2015, 0, 2), 7],  [new Date(2015, 0, 3), 3],
    [new Date(2015, 0, 4), 1],  [new Date(2015, 0, 5), 3],  [new Date(2015, 0, 6), 4],
    [new Date(2015, 0, 7), 3],  [new Date(2015, 0, 8), 4],  [new Date(2015, 0, 9), 2],
    [new Date(2015, 0, 10), 5], [new Date(2015, 0, 11), 8], [new Date(2015, 0, 12), 6],
    [new Date(2015, 0, 13), 3], [new Date(2015, 0, 14), 3], [new Date(2015, 0, 15), 5],
    [new Date(2015, 0, 16), 7], [new Date(2015, 0, 17), 6], [new Date(2015, 0, 18), 6],
    [new Date(2015, 0, 19), 3], [new Date(2015, 0, 20), 1], [new Date(2015, 0, 21), 2],
    [new Date(2015, 0, 22), 4], [new Date(2015, 0, 23), 6], [new Date(2015, 0, 24), 5],
    [new Date(2015, 0, 25), 9], [new Date(2015, 0, 26), 4], [new Date(2015, 0, 27), 9],
    [new Date(2015, 0, 28), 8], [new Date(2015, 0, 29), 6], [new Date(2015, 0, 30), 4],
    [new Date(2015, 0, 31), 6], [new Date(2015, 1, 1), 7],  [new Date(2015, 1, 2), 9]
  ]);


  var options = {
    title: 'Rate the Day on a Scale of 1 to 10',
    width: 700,
    height: 300,
    hAxis: {
      format: 'd/M/yy',
      gridlines: {count: 15}
    },
    vAxis: {
      gridlines: {color: 'none'},
      minValue: 0
    }
  };

  chart = new google.visualization.LineChart(document.getElementById('chart_div'));

  chart.draw(data, options);

  var button = document.getElementById('change');

  button.onclick = function () {

    // If the format option matches, change it to the new option,
    // if not, reset it to the original format.
    options.hAxis.format === 'M/d/yy' ?
    options.hAxis.format = 'MMM dd, yyyy' :
    options.hAxis.format = 'M/d/yy';

    chart.draw(data, options);
  };
}




var ctx = document.getElementById('precioChart').getContext('2d');

var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Precio',
      lineTension: 0, //recta 
      data: [{
          t: "2015-03-15T13:03:00Z",
          y: 12
        },
        {
          t: "2015-03-25T13:02:00Z",
          y: 21
        },
        {
          t: "2015-04-25T14:12:00Z",
          y: 32
        },
        {
            t: "2020-07-10T14:01:52.189Z",
            y: 11
          }

        
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      xAxes: [{
        type: 'time'
      }]
    }
  }
});

// new Chartist.Line('#chart1', {
//   labels: [1, 2, 3, 4],
//   series: [[100, 120, 180, 200]]
// });

// var chart = new Chartist.Line('.ct-chart', {
//   series: [
//     {
//       name: 'series-1',
//       data: [
//         {x: new Date(143134652600), y: 53},
//         {x: new Date(143234652600), y: 40},
//         {x: new Date(143340052600), y: 45},
//         {x: new Date(143366652600), y: 40},
//         {x: new Date(143410652600), y: 20},
//         {x: new Date(143508652600), y: 32},
//         {x: new Date(143569652600), y: 18},
//         {x: new Date(143579652600), y: 11}
//       ]
//     },
//     {
//       name: 'series-2',
//       data: [
//         {x: new Date(143134652600), y: 53},
//         {x: new Date(143234652600), y: 35},
//         {x: new Date(143334652600), y: 30},
//         {x: new Date(143384652600), y: 30},
//         {x: new Date(143568652600), y: 10}
//       ]
//     }
//   ]
// }, {
//   axisX: {
//     type: Chartist.FixedScaleAxis,
//     divisor: 5,
//     labelInterpolationFnc: function(value) {
//       return moment(value).format('MMM D');
//     }
//   }
// });



//radar

var ctxR = document.getElementById("radarChart").getContext('2d');
var myRadarChart = new Chart(ctxR, {
    type: 'radar',
    data: {
        labels: CP,
        datasets: [{
            label: "Humana",
            data: [15, 15, 15, 29, 37, 23, 17],
            backgroundColor: [
                'rgba(105, 0, 132, .2)',
            ],
            borderColor: [
                'rgba(200, 99, 132, .7)',
            ],
            borderWidth: 2
        },
        {
            label: "Dragón",
            data: [34, 33, 34, 19, 37, 18, 22],
            backgroundColor: [
                'rgba(0, 250, 220, .2)',
            ],
            borderColor: [
                'rgba(0, 213, 132, .7)',
            ],
            borderWidth: 2
        }
        ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

//#endregion

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });

    chart.update();
}