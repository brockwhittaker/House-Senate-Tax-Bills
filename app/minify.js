const compressor = require('node-minify');
const path = require("path");

const concat = require("concat-files");

const fs = require("fs-extra");

const concatJS = async () => {
    const inputMap = [
        "/vendor/tax-rates.js",
        "/vendor/jquery.min.js",
        "/vendor/highcharts.min.js",
        "/vendor/vue.min.js",
        "/router.js",
        "/chart.js",
        "/taxes.js",
        "/store.js",
        "/methods.js",
        "/main.js",
        "/routes.js",
    ].map(o => path.join(__dirname, `../static/js${o}`));
    const output = path.join(__dirname, '../static/js/main.min.js');

    return new Promise((resolve, reject) => {
        concat(inputMap, output, function (error) {
            if (!error) resolve(output);
            else reject({ error });
        });
    });
};

module.exports = {
    js: () => {
        return new Promise(async (resolve, reject) => {
            const inputSrc = await concatJS();
            console.log(inputSrc);
        });
    }
};
