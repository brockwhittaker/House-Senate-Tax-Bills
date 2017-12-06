const fs = require("fs-extra");
const path = require("path");

const taxes = require("../app/taxes");

module.exports = (app, api) => {
    app.get("*", (req, res) => {
        let ip = req.connection.remoteAddress.replace(/^::ffff:/, "");
        res.render("index");
        fs.appendFile(path.join(__dirname, "..", "logs", "ip.txt"), `${ip},${new Date().getTime()}\n`);
    });

    // accepted schedules are `current`, and `senate`.
    app.post("/federal-taxes/:schedule/", (req, res) => {
        const { schedule } = req.params;
        const { income, numExemptions } = req.body;


        const taxationSchedule = taxes.calculateFederalTaxBurden[schedule];

        if (taxationSchedule) {
            res.status(200).json(taxationSchedule({ income, numExemptions }));
        } else {
            res.status(500).json({ error: `A tax schedule for "${schedule}" does not exist. The current options are "current" and "senate".` });
        }
    });
};
