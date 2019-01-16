define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/action-widget"
], function (ko, $, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        self.dataLoaded = ko.observable(false);
        self.header = rootParams.header;
        self.captionText = ko.observable(rootParams.captionText);
        self.expandComponent = rootParams.expandComponent;
        self.expansionHandler = ko.utils.unwrapObservable(rootParams.onDashboard) ? 4 : 5;
        if (rootParams.controls && Object.keys(rootParams.controls).length > 3) {
            throw "ERROR! CHECK THE PARAMETERS!";
        }
        self.controls = {
            ctrl1: false,
            ctrl2: false,
            ctrl3: false
        };
        $.extend(self.controls, rootParams.controls);
        self.expandComponentHandler = function () {
            if (ko.utils.unwrapObservable(rootParams.onDashboard)) {
                return rootParams.dashboard.loadComponent(ko.utils.unwrapObservable(self.expandComponent), {}, self);
            }
                return rootParams.dashboard.hideDetails();

        };
        self.dataLoaded(true);
    };
});