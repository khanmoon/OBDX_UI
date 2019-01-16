define([
    "ojs/ojcore",
    "knockout",
    "ojs/ojfilmstrip",
    "ojs/ojpagingcontrol",
    "ojs/ojbutton"
], function (oj, ko) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.module = rootParams.module;
        self.accounts = rootParams.rootModel.accounts;
        self.resource = rootParams.rootModel.nls;
        self.showSummaryDetails = rootParams.rootModel.showSummaryDetails;
        self.pagingModel = ko.observable(null);
        self.identifier = rootParams.identifier;
        self.cardReady = function () {
            var filmStrip = document.getElementById("filmStrip" + rootParams.identifier);
            if (filmStrip) {
                var busyContext = oj.Context.getContext(filmStrip).getBusyContext();
                busyContext.whenReady().then(function () {
                    self.pagingModel(filmStrip.getPagingModel());
                });
            }
        };
    };
});