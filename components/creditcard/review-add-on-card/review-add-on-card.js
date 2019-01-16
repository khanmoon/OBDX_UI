define([
    "ojs/ojcore",
    "knockout"

], function (oj, ko) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        Params.dashboard.headerName(self.resource.addonCard.cardHeading);
    };
});