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
fs.copySync("./dev-extension", "./out/chrome/");

/**
 * Firefox Build
 * @todo: Need to create firefox compactable build
 */
fs.copySync("./dev-extension", "./out/firefox/");
