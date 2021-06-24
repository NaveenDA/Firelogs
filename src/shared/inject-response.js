/* eslint-disable import/prefer-default-export */
/**
 * Inject the script for get the reponse of every xhr request
 * @param {RUID} RUID
 */
export const injectResponseScript = (RUID) => `
    (function () {
      var __firelogsResponse = {};
      var __firelogs_ruid = ${RUID};
      var XHR = XMLHttpRequest.prototype;
      var send = XHR.send;
      var open = XHR.open;
      XHR.open = function (method, url) {
        this.url = url;
        this.ruid = __firelogs_ruid.reqUUID(url);
        this.method = method;
        return open.apply(this, arguments);
      };
      XHR.send = function () {
        this.addEventListener("load", function () {
          var url = new URL(this.url, location);
          var res = this.response;
          res =JSON.parse(res);
          res = JSON.stringify(res);
          __firelogsResponse[this.ruid] = {
              url:url.pathname,
              method: this.method,
              ruid:this.ruid,
              response: res
          };
          var el = document.querySelector("#data-container-firelogs");
          if (el) {
            el.innerHTML = JSON.stringify(__firelogsResponse);
          } 
        });
        return send.apply(this, arguments);
      };
    })();
`;
