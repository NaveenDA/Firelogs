/* eslint-disable quotes */
import ChromeUtils from "../shared/chrome";
import RUID from "../shared/uuid";
import Storage from "../shared/store";
import Transmission from "../shared/transmission";

const fullData = {};
const { chrome } = window;
class RequestProcessor {
  /**
   * @param {object} details Request/Response Object
   * @param {string} eventName Name of event
   */
  // eslint-disable-next-line no-unused-vars
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
      let url;
      let reqId;
      switch (eventName) {
        case "beforeRequest":
          if (details.requestBody && details.requestBody.formData) {
            fullData[details.requestId].input = details.requestBody.formData;
            fullData[details.requestId].in = details.requestId;
          }
          break;
        case "before":
          url = RequestProcessor.parseUri(details.url);
          reqId = details.requestId;
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
        default:
        // Do nothing
      }

      chrome.tabs.executeScript({
        code: `
          window.localStorage.setItem('firelogs_requests',
          \`${JSON.stringify(fullData)}\`);
          `
      });
      if (eventName === "response") {
        // Create a tranmission
        const port = chrome.runtime.connect({ name: "firelogs-tab" });
        Transmission.postMessage(port, { type: "response", details: fullData });
      }
    } catch (error) {
      chrome.tabs.executeScript({
        code: `
          console.error(\`${error.message}\`)
        `
      });
    }
  }

  static processResponse(response) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(fullData)) {
      const { ruid } = value;
      let res = {};
      if (response[ruid]) {
        res = response[ruid].response;
      }
      fullData[key].output = res;
    }
  }

  static isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  static parseUri(url) {
    /**
     * Based on the parseUri
     * @link https://blog.stevenlevithan.com/archives/parseuri
     */
    const options = {
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

    const regexGroup =
      options.parser[options.strictMode ? "strict" : "loose"].exec(url);
    const uri = {};
    let index = 14;

    // eslint-disable-next-line no-plusplus
    while (index--) uri[options.key[index]] = regexGroup[index] || "";

    uri[options.q.name] = {};
    uri[options.key[12]].replace(options.q.parser, ($0, $1, $2) => {
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
    // return escape(str);
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

  /**
   * Sent the data to the another tab
   * @param {*} data
   */
  static async syncData(data) {
    // No Nothing
    // eslint-disable-next-line no-console
    console.log(data);
  }

  /**
   * @param  {string} requestID
   * @param  {any} requestObject
   * @param  {null} viod
   */
  static async saveData(requestID, requestObject) {
    const data = (await Storage.get("firelogs_requests")) || {};
    data[requestID] = requestObject;
    await Storage.set(data);
    ChromeUtils.executeScript(
      `
      window.localStorage.setItem('firelogs_requests', ${JSON.stringify(data)})`
    );
  }
}

export default RequestProcessor;
