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
        let lastState = null;

        return function (e) {
            const { USState, incomeRange } = this.$refs;
            const state = USState.value;

            store.state = state;
            store.income = taxes.convertLinearRangeToIncome(incomeRange.value);
            store.tax.state = taxes.calculateStateTaxBurden(store.income, false, TAX_RATES[2017].state[state]);

            ["current", "senate", "house"].forEach(bill => {
                store.tax[bill] = taxes.calculateFederalTaxBurden[bill]({
                    income: store.income,
                    numExemptions: 1,
                    SALT: store.tax.state,
                });
            });

            ["senate", "house"].forEach(bill => {
                store.taxDiff[bill] = store.tax[bill] / store.tax.current - 1;
            });

            if (state !== lastState) {
                methods.renderChart();
                lastState = state;
            }


            //debounce(methods.renderChart, 500, true);
        }
    })(),

    renderChart: () => {
        const state = vue.$refs.USState.value;

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
                        numExemptions: 1,
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
                        numExemptions: 1,
                        SALT: taxes.calculateStateTaxBurden(income, false, TAX_RATES[2017].state[state]),
                    }) / income * 100;
                    const percentTaxOnCurrent = taxes.calculateFederalTaxBurden.current({
                        income: income,
                        numExemptions: 1,
                        SALT: taxes.calculateStateTaxBurden(income, false, TAX_RATES[2017].state[state]),
                    }) / income * 100;

                    return (percentTaxOnBill / percentTaxOnCurrent - 1) * 100;
                }),
                color: schedule.color,
                dashStyle: schedule.dashStyle,
            };
        });

        chart.render(d1, d2);
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
