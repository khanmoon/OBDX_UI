define([
    "ojs/ojcore",
    "knockout",
    "jquery"
], function(oj, ko) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);

        require(["@@FB_SDK_URL"], function() {
            self.apiMap = {
                USER_PROFILE: {
                    url : "me",
                    fields: "name, first_name,last_name,email,gender",
                    scope: "public_profile,email"
                },
                USER_FRIENDS: {
                    url : "me/friends",
                    fields: "name,id,picture,first_name,last_name",
                    scope: "public_profile,email,user_friends"
                }
            };
            self.currentAPI = self.customAPI ? self.customAPI : self.apiMap[self.api];
            window.FB.init({
                appId: "@@FB_API_KEY",
                cookie: true,
                xfbml: true,
                status: true,
                version: "v2.9"
            });
            self.login = function() {
                window.FB.login(function(response) {
                    if (response.authResponse) {
                        self.callFBApi();
                    }
                }, { scope: self.currentAPI.scope });
            };
            self.checkLoginState = function() {
                window.FB.getLoginStatus(function(response) {
                    if (response.status === "connected") {
                        self.callFBApi();
                    } else {
                        self.login();
                    }
                });
            };
            self.callFBApi = function() {
                var url = self.currentAPI.url;
                var fields = self.currentAPI.fields;
                window.FB.api(url, {
                    locale: window.lang,
                    fields: fields
                }, function(response) {
                    if (self.callback) {
                        self.callback(response);
                    }
                });
            };
            if (self.autoLogin)
                self.checkLoginState();
        });

    };
});