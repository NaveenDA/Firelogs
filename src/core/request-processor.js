import ChromeUtils from "../shared/chrome";
import Storage from "../shared/store";
import RUID from "../shared/uuid";
let fullData = {};

class RequestProcessor {
    /**
     * @param  {object} details
     * @param  {string} eventName
     */
    static async process(details, eventName) {
        if (details?.requestId && !fullData[details.requestId]) {
            fullData[details.requestId] = {
                url: "",
                method: "",
                input: {},
                output: {},
                statusCode: "",
                type: "",
                urlParams: "",
                id: "",
                ruid: ""
            };
        }

        try {
            switch (eventName) {
                case "beforeRequest":
                    if (details.requestBody && details.requestBody.formData) {
                        fullData[details.requestId].input =
                            details.requestBody.formData;
                        fullData[details.requestId].in = details.requestId;
                    }
                    break;
                case "before":
                    let url = RequestProcessor.parseUri(details.url);
                    var reqId = details.requestId;
                    fullData[reqId].method = details.method;
                    fullData[reqId].type = details.type;
                    fullData[reqId].urlParams = url.queryKey || null;
                    fullData[reqId].url = url.path;
                    fullData[reqId].ruid = RUID.reqUUID(url.path);
                    break;
                case "complete":
                    fullData[details.requestId].statusCode = details.statusCode;
                    break;
                case "error":
                    fullData[details.requestId].statusCode = details.statusCode;
                    break;
                case "response":
                    RequestProcessor.processResponse(details);
                    break;
            }
            chrome.tabs.executeScript({
                code: `
          window.localStorage.setItem('firelogs_requests',\`${JSON.stringify(
              fullData
          )}\`);
          `
            });
        } catch (error) {
            chrome.tabs.executeScript({
                code: `
          console.error(\`${JSON.stringify(error)}\`)
        `
            });
        }
    }
    static processResponse(response) {
        for (let [key, value] of Object.entries(fullData)) {
            var ruid = value["ruid"];
            var res = {};
            if (response[ruid]) {
                res = response[ruid].response;
                res = RequestProcessor.escape(res);
            }
            fullData[key].output = res;
        }
    }

    static parseUri(url) {
        /**
         * Based on the parseUri
         * @link https://blog.stevenlevithan.com/archives/parseuri
         */
        let options = {
            strictMode: false,
            key: [
                "source",
                "protocol",
                "authority",
                "userInfo",
                "user",
                "password",
                "host",
                "port",
                "relative",
                "path",
                "directory",
                "file",
                "query",
                "anchor"
            ],
            q: {
                name: "queryKey",
                parser: /(?:^|&)([^&=]*)=?([^&]*)/g
            },
            parser: {
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
            }
        };

        let regexGroup =
            options.parser[options.strictMode ? "strict" : "loose"].exec(url);
        let uri = {};
        let index = 14;

        while (index--) uri[options.key[index]] = regexGroup[index] || "";

        uri[options.q.name] = {};
        uri[options.key[12]].replace(options.q.parser, function ($0, $1, $2) {
            if ($1) uri[options.q.name][$1] = $2;
        });

        return uri;
    }
    /**
     * Escape the JSON string, if the json contains new line it will break the data
     * @param {String} str
     * @returns
     */
    static escape(str) {
        return str
            .replace(/[\\]/g, "\\\\")
            .replace(/[\"]/g, '\\"')
            .replace(/[\/]/g, "\\/")
            .replace(/[\b]/g, "\\b")
            .replace(/[\f]/g, "\\f")
            .replace(/[\n]/g, "\\n")
            .replace(/[\r]/g, "\\r")
            .replace(/[\t]/g, "\\t");
    }

    static async syncData(data) {}
    /**
     * @param  {string} requestID
     * @param  {any} requestObject
     * @param  {null} viod
     */
    static async saveData(requestID, requestObject) {
        let data = (await Storage.get("firelogs_requests")) || {};
        data[requestID] = requestObject;
        await Storage.set(data);
        ChromeUtils.executeScript(
            `console.log("Code from request Processor");
      window.localStorage.setItem('firelogs_requests', ${JSON.stringify(data)})`
        );
        ChromeUtils.log("Data saved on request: " + requestID);
    }

    static async updateData(data) {}
}

export default RequestProcessor;
