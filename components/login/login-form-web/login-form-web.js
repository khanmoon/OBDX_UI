define([
    "knockout",
    "jquery",

    "framework/js/constants/constants",
    "ojs/ojbutton",
    "ojs/ojinputtext"
], function (ko, $, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.alternateLogin = ko.observable();
        var GenericViewModel = null;
        self.afterRender = function (genericViewModel) {
            GenericViewModel = genericViewModel;
            if (genericViewModel.queryMap) {
                if (genericViewModel.queryMap.p_error_code !== null && genericViewModel.queryMap.p_error_code === "OAM-10") {
                    self.message(self.nls.loginForm.validationMsgs.errrorOAM10);
                } else if (genericViewModel.queryMap.p_error_code !== null && genericViewModel.queryMap.p_error_code === "OAM-5") {
                    self.message(self.nls.loginForm.validationMsgs.errrorOAM5);
                } else if (genericViewModel.queryMap.p_error_code !== null && genericViewModel.queryMap.p_error_code === "OBDXIDM-0") {
                    self.message(genericViewModel.queryMap.p_error_message);
                } else if (genericViewModel.queryMap.p_error_code) {
                    self.message(self.nls.loginForm.validationMsgs.invalidCredentials);
                }
            }
        };

        function loginOAM(path, params, method) {
            method = method || "post";
            var form = document.createElement("form");
            form.setAttribute("method", method);
            form.setAttribute("action", path);
            var hiddenField;
            for (var key in params) {
                if (params[key]) {
                    hiddenField = document.createElement("input");
                    hiddenField.setAttribute("type", "hidden");
                    hiddenField.setAttribute("name", key);
                    hiddenField.setAttribute("value", params[key]);
                    form.appendChild(hiddenField);
                }
            }
            hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", "username");
            hiddenField.setAttribute("value", self.username());
            form.appendChild(hiddenField);
            hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", "password");
            hiddenField.setAttribute("value", self.password());
            form.appendChild(hiddenField);
            document.body.appendChild(form);
            form.submit();
        }

        function loginDBAuthenticator(path, redirectURL) {
            var http = new XMLHttpRequest();
            var url = path;
            var params = "j_username=" + self.username() + "&j_password=" + encodeURIComponent(self.password());
            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.setRequestHeader("redirect_url", decodeURIComponent(redirectURL));
            var objectContext = rootParams.baseModel.QueryParams.get(null, redirectURL);
            http.onreadystatechange = function () {
                if (http.status === 404) {
                    if (objectContext && !/login/.test(objectContext.module)) {
                        if (objectContext.homeComponent && !objectContext.homeComponent.module) {
                            objectContext.homeComponent = {
                                component: objectContext.homeComponent,
                                module: objectContext.homeModule,
                                query: {}
                            };
                            delete objectContext.homeModule;
                            Object.keys(objectContext).forEach(function (key) {
                                if (key !== "homeComponent")
                                    objectContext.homeComponent.query[key] = objectContext[key];
                            });
                        }
                        rootParams.baseModel.switchPage(objectContext, true);
                    } else {
                        rootParams.baseModel.switchPage({}, false);
                    }
                } else if (http.status === 403) {
                var redirectURL = window.location.origin + http.getResponseHeader("X-AUTH-LOCATION-URL");
                window.location = redirectURL;
            }
            };
            http.send(params);
        }
        $(window).keypress(function (e) {
            if (e.which === 13) {
                $("#login-button").focus();
                self.onLogin(GenericViewModel);
            }
        });
        self.afterUserNameRender = function () {
            $("#login_username").focus();
        };
        self.onLogin = function (genericViewModel) {
  if (genericViewModel.queryMap.redirect_url !== undefined) {
        var redirectURL;
        //eslint-disable-next-line no-storage/no-browser-storage
      localStorage.setItem("Payment_redirection_URL", genericViewModel.queryMap.redirect_url);
      redirectURL = genericViewModel.queryMap.redirect_url;
  } else {
     //eslint-disable-next-line no-storage/no-browser-storage
      redirectURL = localStorage.getItem("Payment_redirection_URL");
  }
  if (Constants.authenticator === "OBDXAuthenticator") {
      loginDBAuthenticator(Constants.appBaseURL + "/j_security_check?locale=" + rootParams.baseModel.getLocale(), redirectURL);
  } else {
      loginOAM("http://oamapp:14100/oam/server/auth_cred_submit", {
          request_id: genericViewModel.queryMap.request_id
      });
  }
  };
        self.forgotPass = function (genericViewModel) {
            var l = document.createElement("a");
            l.href = decodeURIComponent(genericViewModel.queryMap.resource_url);
            if (genericViewModel.queryMap.resource_url) {
                self.referrer = l.protocol + "//" + l.host;
            } else {
                self.referrer = window.location.origin;
            }
            window.location.href = self.referrer + "/?homeComponent=user-information&homeModule=recovery&context=index";
        };
        self.forgotUserId = function (genericViewModel) {
            var l = document.createElement("a");
            l.href = decodeURIComponent(genericViewModel.queryMap.resource_url);
            if (genericViewModel.queryMap.resource_url) {
                self.referrer = l.protocol + "//" + l.host;
            } else {
                self.referrer = window.location.origin;
            }
            window.location.href = self.referrer + "/index.html?homeComponent=user-recovery-info&homeModule=recovery&context=index";
        };
        $(document).on("blur", "#forgotPassword", function () {
            $("input[name='username']").focus();
        });
    };
});
