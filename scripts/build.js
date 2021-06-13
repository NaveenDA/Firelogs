var fs = require("fs-extra");

fs.mkdirp("chrome");
fs.emptyDirSync("chrome");
fs.copy("./dist", "./chrome/dist");
fs.copy("./background.js", "./chrome/background.js");
fs.copy("./manifest.json", "./chrome/manifest.json");