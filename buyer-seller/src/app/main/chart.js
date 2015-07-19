angular.module('buyerSeller').service('chart', function() {
  var c = this.chartInfo = {};

  c.type = 'LineChart';
  c.displayed = true;
  c.data  = {
    cols: [
        {id: "month", label: "Month", type: "string"},
        {id: "Sentiment-id", label: "Sentiment", type: "number"}
    ],
    rows: []
  };
  c.options = {
    title: 'Sentiment',
    isStacked: true,
    fill: 20,
    displayExactValues: true,
    vAxis: {
      title: 'Sentiment',
      gridlines: {
        count: 10
      }
    },
    hAxis: {
      title: 'Time'
    }
  }
  var rows = c.data.rows;

});