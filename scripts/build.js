var fs = require("fs-extra");
var buildNumber = process.env.npm_package_version
fs.emptyDirSync("out");
/**
 * Update build number to the Manifest JSON
 */
var manifest = fs.readFileSync("./manifest.json").toString();
manifest = JSON.parse(manifest);
manifest.version = buildNumber;
fs.writeFileSync("./manifest.json", JSON.stringify(manifest, null, 2));
/**
 * Chrome Buid
 */
fs.copySync("./dist", "./out/chrome/dist");
fs.copySync("./manifest.json", "./out/chrome/manifest.json");
fs.removeSync("./out/chrome/dist/manifest.json");

/**
 * Firefox Build
 */
fs.copySync("./dist", "./out/firefox/dist");
fs.removeSync("./out/firefox/dist/manifest.json");
fs.copySync("./manifest.json", "./out/firefox/manifest.json");
