const fs = require("fs-extra");
const path = require("path");

(async () => {
    const logs = (await fs.readFile(path.join(__dirname, "ip.txt"), "utf8"))
        .split(/\n/g).map(log => {
            const payload = log.split(/,/g);
            return { ip: payload[0], timestamp: new Date(log[1]) };
        });

    const IP_MAP = {

    };

    logs.forEach(log => {
        if (!IP_MAP[log.ip]) {
            IP_MAP[log.ip] = 0;
        }

        IP_MAP[log.ip]++;
    });

    console.log(`${Object.keys(IP_MAP).length} unique visitors to the site.`);
})();
