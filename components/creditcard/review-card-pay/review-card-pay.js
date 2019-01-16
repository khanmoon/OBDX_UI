define([
    "ojs/ojcore",
    "knockout"

], function (oj, ko) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.dashboard.headerName(self.resource.pay.cardHeading);
    };
});