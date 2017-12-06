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
                pointStart: 0,
                lineWidth: 2,
                marker: {
                    enabled: false,
                },
            }
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
            plotLines: [{
                color: '#ccc', // Color value
                dashStyle: 'shortdot', // Style of the plot line. Default to solid
                value: null, // Value of where the line will appear
                width: 1 // Width of the line
            }]
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
        payload.xAxis.plotLines[0].value = store.income / 5000;
        payload.series = opts.data;
        payload.title.text = opts.title;
        payload.yAxis.title.text = opts.yAxisText;

        return Highcharts.chart(opts.container, payload);
    };

    chart.updateData = (c, series) => {
        c.update({
            series,
        });
    },

    chart.updateIncome = (c, income) => {
        c.update({
            xAxis: {
                plotLines: [{
                    color: "#ccc",
                    dashStyle: "shortdot",
                    value: income / 5000,
                    width: 1,
                }],
            },
        });
    };

    chart.payload = payload;

    return chart;
})();
