const store = {
    income: 0,
    numExemptions: 1,
    filingStatus: "single",
    tax: {
        current: 0,
        senate: 0,
        house: 0,
        state: 0,
    },
    taxDiff: {
        senate: 0,
        house: 0,
    },
    STATES: STATES,
    state: "CA",

    MAP_BILL: "senate",
    MAP_COLORS: [
        [-20, `hsl(142, 57%, 65%)`],
        [-10, `hsla(142, 57%, 65%, 0.75)`],
        [-5, `hsla(142, 57%, 65%, 0.50)`],
        [-2, `hsla(142, 57%, 65%, 0.25)`],
        [0, `hsl(0, 0%, 95%)`],
        [2, `hsla(0, 57%, 65%, 0.25)`],
        [5, `hsla(0, 57%, 65%, 0.50)`],
        [10, `hsla(0, 57%, 65%, 0.75)`],
        [20, `hsl(0, 57%, 65%)`]
    ],
};
