const confme = require("confme");

const config = confme(`${__dirname}/../etc/config.json`);

module.exports = config;
