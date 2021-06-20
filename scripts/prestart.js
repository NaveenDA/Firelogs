var fs = require("fs-extra");

fs.emptyDirSync("./dev-extension");
fs.ensureDirSync("./dev-extension/dist")
fs.copyFileSync("./src/firelogs.html", "./dev-extension/dist/firelogs.html");
fs.copyFileSync("./manifest.json", "./dev-extension/manifest.json");
fs.copySync("./images", "./dev-extension/images");
