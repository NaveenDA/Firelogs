var fs = require("fs-extra");

fs.emptyDirSync("dist");
fs.copyFileSync("./src/firelogs.html", "./dist/firelogs.html");
fs.copyFileSync("./manifest.json", "./dist/manifest.json");
