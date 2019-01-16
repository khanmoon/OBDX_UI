define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/offline-notification"
], function (ko, $, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        self.isOffline = ko.observable(false);
        var timeout = null;
        window.addEventListener("offline", function () {
            self.isOffline(true);
            ko.tasks.runEarly();
            $("div.offline-notification").removeClass("flip-down slide-and-resize");
            $("div.offline-notification").addClass("flip-down");
            timeout = setTimeout(function () {
                self.dismiss();
            }, 10000);
        }, false);
        window.addEventListener("online", function () {
            $("div.offline-notification").fadeOut("slow", function () {
                self.isOffline(false);
            });
        }, false);
        self.dismiss = function () {
            clearTimeout(timeout);
            $("div.offline-notification a").remove();
            $("div.offline-notification").addClass("slide-and-resize");
            $("div.offline-notification div").html(rootParams.baseModel.format(self.locale.lastActivity, { lat: rootParams.baseModel.formatDate(rootParams.baseModel.lastUpdatedTime().toISOString(), "timeFormat") }));
        };
    };
});