var fs = require("fs-extra");

fs.emptyDirSync("out");
/**
 * Chrome Buid
 */
fs.copySync("./dist", "./out/chrome/dist");
fs.copySync("./dist/background.js", "./out/chrome/background.js");
fs.removeSync("./out/chrome/dist/background.js");
fs.copySync("./manifest.json", "./out/chrome/manifest.json");

/**
 * Firefox Build
 */
fs.copySync("./dist", "./out/firefox/dist");
fs.copySync("./dist/background.js", "./out/firefox/background.js");
fs.removeSync("./out/firefox/dist/background.js");
fs.copySync("./manifest.json", "./out/firefox/manifest.json");