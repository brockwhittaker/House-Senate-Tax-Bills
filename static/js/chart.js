const chart = (() => {
    const chart = {};

    const payload = {
        chart: {
            type: "spline",
        },

        title: {
            text: null,
            style: {
                fontWeight: 600,
            },
        },

        subtitle: {
            text: 'Source: senate.gov',
            style: {
                color: "#aaa",
            },
        },

        yAxis: {
            title: {
                text: null,
            },
            labels: {
                formatter: function () {
                    return `${this.value}%`;
                },
            },
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 0
            }
        },

        plotOptions: {
            series: {
                lineWidth: 2,
                marker: {
                    enabled: false,
                }
            },
        },

        series: [],

        tooltip: {
            valueDecimals: 2,
            valueSuffix: '%',
            formatter: function () {
                return `
                    <span>Income: </span><b>${methods.toDollar(this.x * 5000)}</b>
                    <br>
                    <span>${this.series.name}: </span><b>${this.y.toFixed(2)}%</b>
                `
            }
        },

        xAxis: {
            title: {
                text: "Salary",
            },
            labels: {
                formatter: function () {
                    return "$" + (this.value * 5000 / 1000) + "k";
                },
            },
        },

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        },

        credits: {
            enabled: false
        },

        legend: {
            align: 'center',
            verticalAlign: 'bottom',
        },
    };

    chart.render = (opts) => {
        payload.series = opts.data;
        payload.title.text = opts.title;
        payload.yAxis.title.text = opts.yAxisText;
        Highcharts.chart(opts.container, payload);
    };

    chart.payload = payload;

    return chart;
})();
