const taxes = (() => {
    // this is the current tax schedule for 2017.
    const CURRENT_TAXES = {
        "brackets": {
            single: [
                [0.1, 9325],
                [0.15, 37950],
                [0.25, 91900],
                [0.33, 191900],
                [0.35, 416700],
                [0.396, Infinity],
            ],
            married: [
                [0.1, 18650],
                [0.15, 75900],
                [0.25, 153100],
                [0.33, 233350],
                [0.35, 470700],
                [0.396, Infinity],
            ],
        },
        standardDeduction: 6350,
        exemption: 4050,
        DEDUCT: { SALT: true },
    };

    // this is the current senate bill tax schedule for 2018.
    const SENATE_BILL = {
        brackets: {
            single: [
                [0.1, 9525],
                [0.12, 38700],
                [0.22, 70000],
                [0.24, 160000],
                [0.32, 200000],
                [0.35, 500000],
                [0.385, Infinity],
            ],
            married: [
                [0.1, 19050],
                [0.12, 77400],
                [0.22, 140000],
                [0.24, 320000],
                [0.32, 400000],
                [0.35, 1000000],
                [0.385, Infinity],
            ]
        },
        standardDeduction: 12000,
        exemption: 0,
        DEDUCT: { SALT: false },
    };

    const HOUSE_BILL = {
        brackets: {
            single: [
                [0.12, 45000],
                [0.25, 200000],
                [0.35, 500000],
                [0.396, Infinity],
            ],
            married: [
                [0.12, 90000],
                [0.25, 260000],
                [0.35, 1000000],
                [0.396, Infinity],
            ],
        },
        standardDeduction: 12000,
        exemption: 0,
        DEDUCT: { SALT: false },
    };

    const calculateFederalTaxBurden = (payload, tax_structure) => {
        const { income, numExemptions, filingStatus } = payload;
        const brackets = tax_structure.brackets[filingStatus];

        let x = 0;
        let tax = 0;

        let taxableIncome = (
            income -                                  // start with gross income.
            numExemptions * tax_structure.exemption - // remove number of personal exemptions.
            tax_structure.standardDeduction -         // remove standard deduction for all.
            payload.SALT * tax_structure.DEDUCT.SALT
        );

        // taxable income cannot be less than zero dollars. We don't have negative
        // income tax in the United States. :(
        taxableIncome = Math.max(0, taxableIncome);

        do {
            const bracket = brackets[x];
            const previousBracket = brackets[x - 1] || [0, 0];

            tax += (Math.min(taxableIncome, bracket[1]) - previousBracket[1]) * bracket[0];

            x++;
        } while (taxableIncome > brackets[x - 1][1]);

        return tax;
    };

    // `tax_structure` should be the object for a state.
    const calculateStateTaxBurden = (taxableIncome, is_married, tax_structure) => {
        let rates = tax_structure.taxes.income.rate;

        // this means it is either a flat tax or no tax.
        if (typeof rates === "number") {
            return taxableIncome * rates;
        // this means there are no single vs married state tax rates.
        } else if (Array.isArray(rates)) {
            // do nothing here in particular, we'll just want an array below.
        // this means there are both single and married state tax rates.
        } else if (typeof rates === "object") {
            rates = is_married ? rates.married : rates.single;
        }

        let x = 0;
        let tax = 0;

        do {
            let bracket = rates[x];
            const previousBracket = rates[x - 1] || [0, 0];

            if (!bracket) {
                rates.push([Infinity, previousBracket[1]]);
                bracket = rates[x];
            }

            // `bracket[0]` is income bracket threshold.
            // `bracket[1]` is tax rate at bracket.
            tax += (Math.min(taxableIncome, bracket[0]) - previousBracket[0]) * bracket[1];
            x++;
        } while (taxableIncome > rates[x - 1][0]);

        return tax;
    };

    // 0 - 100:
    //     0 - 10   => 0    -  1k?  (by 100)
    //     10 - 20  => 1    -  5k?  (by 400)
    //     20 - 35  => 5k   -  20k  (by 1,000)
    //     35 - 50  => 20k  -  50k  (by 2,000)
    //     50 - 60  => 50k  -  100k (by 5,000)
    //     60 - 80  => 100k -  300k (by 10,000)
    //     80 - 90  => 300k -  800k (by 50,000)
    //     90 - 97  => 800k -  1.5m (by 100,000)
    //     97 - 100 => 1.5m -  3m   (by 500,000)
    //
    // value assumed to be an integer between 0 - 100.
    const convertLinearRangeToIncome = (value) => {
        let sum = 0;

        const INTERVAL_GROUPS = [
            [97, 500000], [90, 100000], [80, 50000],
            [60, 10000] , [50, 5000]  , [35, 2000],
            [20, 1000]  , [10, 400]   , [0, 100]
        ];

        INTERVAL_GROUPS.forEach(group => {
            if (value > group[0]) {
                sum += (value - group[0]) * group[1];
                value = group[0];
            }
        });

        return sum;
    };

    return {
        calculateFederalTaxBurden: {
            current: payload => calculateFederalTaxBurden(payload, CURRENT_TAXES),
            senate: payload => calculateFederalTaxBurden(payload, SENATE_BILL),
            house: payload => calculateFederalTaxBurden(payload, HOUSE_BILL),
        },
        calculateStateTaxBurden,
        convertLinearRangeToIncome,
    };
})();

const STATES = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FL": "Florida",
    "GA": "Georgia",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PA": "Pennsylvania",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
};
