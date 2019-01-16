define([
    "ojs/ojcore",
    "knockout"
], function (oj, ko) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        function getProfileData() {
            window.IN.API.Profile("me").fields([
                "firstName",
                "lastName",
                "headline",
                "positions:(company,title,summary,startDate,endDate,isCurrent)",
                "industry",
                "location:(name,country:(code))",
                "pictureUrl",
                "publicProfileUrl",
                "emailAddress",
                "educations"
            ]).result(function (result) {
                if (self.callback) {
                    self.callback(result);
                }
                window.IN.User.logout();
            });
        }
        if (!rootParams.baseModel.small()) {
            require(["https://platform.linkedin.com/in.js?async=true"], function () {
                window.IN.init({
                    api_key: "@@LINKEDIN_API_KEY",
                    authorize: false
                });
            });
        }
        self.linkedinLogin = function () {
            window.IN.User.authorize(getProfileData);
        };
    };
});