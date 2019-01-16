define([
    "ojs/ojcore",
    "knockout"
], function (oj, ko) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.isActive = ko.observable(false);
        Params.dashboard.loadComponent("list-goal", self.isActive(), self);
    };
});