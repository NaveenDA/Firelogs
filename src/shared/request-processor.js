import ChromeUtils from "./chrome";
import Storage from "./store";
let fullData = {};
class RequestProcessor {
  /**
   * @param  {object} details
   * @param  {string} eventName
   */
  static async process(details, eventName) {
    if (!fullData[details.requestId]) {
      fullData[details.requestId] = {
        url: "",
        method: "",
        input: "",
        output: "",
        statusCode: "",
        type: "",
        urlParams: ""
      };
    }

    try {
      switch (eventName) {
        case "beforeRequest":
        if(details.requestBody && details.requestBody.formData){
          fullData[details.requestId].input=details.requestBody.formData;
        }
        break;
        case "before":
          let url = RequestProcessor.parseUri(details.url);
          fullData[details.requestId].method = details.method;
          fullData[details.requestId].type = details.type;
          fullData[details.requestId].urlParams = url.queryKey || null;
          fullData[details.requestId].url = url.path;

          break;
        case "complete":
          fullData[details.requestId].statusCode = details.statusCode;
          break;
        case "error":
          fullData[details.requestId].statusCode = details.statusCode;
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
        strict:
          /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:
          /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
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
