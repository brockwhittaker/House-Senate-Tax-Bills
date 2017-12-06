const CURRENT_TAXES = require("./tax-schedules/current");
const SENATE_BILL = require("./tax-schedules/senate-bill");

const calculateFederalTaxBurden = (payload, tax_structure) => {
    const { income, numExemptions } = payload;
    const { brackets } = tax_structure;

    let x = 0;
    let tax = 0;

    const taxableIncome = (
        income -                                  // start with gross income.
        numExemptions * tax_structure.exemption - // remove number of personal exemptions.
        tax_structure.standardDeduction           // remove standard deduction for all.
    );

    do {
        const bracket = brackets[x];
        const previousBracket = brackets[x - 1] || [0, 0];

        tax += (Math.min(taxableIncome, bracket[1]) - previousBracket[1]) * bracket[0];

        x++;
    } while (taxableIncome > brackets[x - 1][1]);

    return tax;
};

module.exports = {
    calculateFederalTaxBurden: {
        current: payload => calculateFederalTaxBurden(payload, CURRENT_TAXES),
        senate: payload => calculateFederalTaxBurden(payload, SENATE_BILL),
    },
};
