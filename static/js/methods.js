// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

const methods = {
    onIncomeUpdate: (() => {
        let last = {
            USState: null,
            numDependents: null,
            filingStatus: null,
        };

        return function (e) {
            const { incomeRange, USState, numDependents, filingStatus } = this.$refs;

            store.state = USState.value;
            store.income = taxes.convertLinearRangeToIncome(incomeRange.value);
            store.tax.state = taxes.calculateStateTaxBurden(
                store.income,
                false,
                TAX_RATES[2017].state[USState.value]
            );

            ["current", "senate", "house"].forEach(bill => {
                store.tax[bill] = taxes.calculateFederalTaxBurden[bill]({
                    income: store.income,
                    numExemptions: 1 + (+numDependents.value),
                    SALT: store.tax.state,
                });
            });

            ["senate", "house"].forEach(bill => {
                store.taxDiff[bill] = store.tax[bill] / store.tax.current - 1;
            });

            if (USState.value !== last.USState || numDependents.value !== last.numDependents) {
                methods.renderChart();

                Object.assign(last, {
                    USState: USState.value,
                    numDependents: numDependents.value,
                    filingStatus: filingStatus.value
                });
            }
        }
    })(),

    renderChart: () => {
        const state = vue.$refs.USState.value;
        const numDependents = vue.$refs.numDependents.value;
        const numExemptions = 1 + (+numDependents);

        const arr = [];
        for (let x = 0; x < 100; x++) {
            arr[x] = x * 5000;
        }

        const schedules = [
            { bill: "current", name: "Current Federal Taxes", color: "#e8757c" },
            { bill: "senate", name: "Senate Proposed Federal Taxes", color: "#51badc", dashStyle: "longdash" },
            { bill: "house", name: "House Proposed Federal Taxes", color: "#b9e48c", dashStyle: "longdash" }
        ];

        const d1 = schedules.map(schedule => {
            return {
                name: schedule.name,
                data: arr.map(income => {
                    return taxes.calculateFederalTaxBurden[schedule.bill]({
                        income: income,
                        numExemptions,
                        SALT: taxes.calculateStateTaxBurden(income, false, TAX_RATES[2017].state[state]),
                    }) / income * 100;
                }),
                color: schedule.color,
                dashStyle: schedule.dashStyle,
            };
        });

        const d2 = schedules.slice(1).map(schedule => {
            return {
                name: schedule.name,
                data: arr.map(income => {
                    const percentTaxOnBill = taxes.calculateFederalTaxBurden[schedule.bill]({
                        income: income,
                        numExemptions,
                        SALT: taxes.calculateStateTaxBurden(income, false, TAX_RATES[2017].state[state]),
                    }) / income * 100;
                    const percentTaxOnCurrent = taxes.calculateFederalTaxBurden.current({
                        income: income,
                        numExemptions,
                        SALT: taxes.calculateStateTaxBurden(income, false, TAX_RATES[2017].state[state]),
                    }) / income * 100;

                    const value = ((percentTaxOnBill / percentTaxOnCurrent - 1) * 100) || 0;

                    // change to logarithmic y-axis tomorrow.
                    return Math.min(500, value);
                }),
                color: schedule.color,
                dashStyle: schedule.dashStyle,
            };
        });

        chart.render({
            data: d1,
            title: "Federal Taxes as a Percentage of Net Income",
            yAxisText: "Percent of Income to Federal Tax",
            container: "tax_chart_container",
        })

        chart.render({
            data: d2,
            title: "New Taxes as a Percentage of Old Taxes",
            yAxisText: "% Taxes Paid by Plan vs. Current",
            container: "tax_diff_container",
        });
    },


    // this changes a decimal to a properly formatted percentage.
    toPercent: (value) => {
        var shouldSign = value > 0;

        if (isNaN(value)) {
            return 'N/A';
        }

        return (shouldSign ? '+' : '') + (value * 100).toFixed(2) + '%';
    },

    toDollar: (value) => {
        return `$` + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
};
