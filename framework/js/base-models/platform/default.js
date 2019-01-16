define(["framework/js/constants/constants"], function(Constants) {
  "use strict";
  return {
    init: function(platform, resolve) {
      resolve(platform);
    },
    downloadFile: function(options, nonce, genericCompleteHandler) {
      var request = new XMLHttpRequest();
      request.open("GET", options.url, true);
      request.setRequestHeader("x-nonce", nonce);
      var a = document.createElement("a"),
        win;
      if (typeof a.download === "undefined") {
        win = window.open("", "_blank");
      }
      request.onreadystatechange = function() {
        if (request.readyState === 4) {
          if (request.status === 200) {
            var filename = "";
            var disposition = request.getResponseHeader("Content-Disposition");
            if (disposition && disposition.indexOf("attachment") !== -1) {
              var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
              var matches = filenameRegex.exec(disposition);
              if (matches && matches[1])
                filename = matches[1].replace(/['"]/g, "");
            }
            var blob = request.response;
            if (typeof window.navigator.msSaveBlob !== "undefined") {
              // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
              window.navigator.msSaveBlob(blob, filename);
            } else {
              var URL = window.URL || window.webkitURL;
              var downloadUrl = URL.createObjectURL(blob);

              if (filename) {
                // use HTML5 a[download] attribute to specify filename
                var a = document.createElement("a");
                // safari doesn't support this yet
                if (typeof a.download === "undefined") {
                  win.location = downloadUrl;
                  win.onunload = function() {
                    URL.revokeObjectURL(downloadUrl);
                  };
                } else {
                  a.href = downloadUrl;
                  a.download = filename;
                  document.body.appendChild(a);
                  a.click();
                  setTimeout(function() {
                    URL.revokeObjectURL(downloadUrl);
                    document.body.removeChild(a);
                  }, 100);
                }
              } else {
                win.location = downloadUrl;
                win.onunload = function() {
                  URL.revokeObjectURL(downloadUrl);
                };
              }
            }
          } else if (request.responseText !== "") {
            var newRequest = request;
            newRequest.responseJSON = JSON.parse(request.responseText);
            genericCompleteHandler.apply(options, [newRequest]);
          }
        } else if (request.readyState === 2) {
          if (request.status === 200) {
            request.responseType = "blob";
          } else {
            request.responseType = "text";
          }
        }
      };
      request.send();
    },
    logOut: function() {
      var form = document.createElement("form");
      if(Constants.authenticator === "IDCSAuthenticator"){
        form.action = "/logout";
      }else{
        form.action = "/logout.";
      }
      document.body.appendChild(form);
      form.submit();
    }
  };
});
