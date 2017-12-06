const chart = (() => {
    const chart = {};

    const payload = {
        chart: {
            type: "spline",
        },

        title: {
            text: 'Federal Taxes as a Percentage of Net Income',
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
                text: 'Percent of Income to Federal Tax'
            }
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
            labels: {
                formatter: function () {
                    return "$" + (this.value * 5000 / 1000) + "k";
                },
            },
        },

        yAxis: {
            labels: {
                formatter: function () {
                    return `${this.value}%`;
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

    chart.render = (d1, d2) => {
        payload.series = d1;
        Highcharts.chart('tax_chart_container', payload);
        payload.series = d2;
        payload.title.text = "New Taxes as a Percentage of Old Taxes";
        Highcharts.chart('tax_diff_container', payload);
    };

    chart.payload = payload;

    return chart;
})();
