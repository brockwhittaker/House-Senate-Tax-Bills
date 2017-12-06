var router = new Router();

router.use((e, next) => {
    next();
});


(() => {
    const INCOME_RANGE_VALUES = new Array(200);
    for (let x = 0; x < 100; x += 0.5) {
        INCOME_RANGE_VALUES[x * 2] = taxes.convertLinearRangeToIncome(x);
    }

    router.add("/i/:income/s/:filingStatus/d/:dependents/", (e) => {
        const { income, filingStatus, dependents } = e.params;

        vue.$refs.incomeRange.value = INCOME_RANGE_VALUES.indexOf(+income) / 2;
        vue.$refs.numDependents.value = +dependents;
        vue.$refs.filingStatus.value = filingStatus;

        methods.onIncomeUpdate.call(vue);
    });
})();

router.add("/", (e) => {

});

router.init();
