define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/request-pin"
], function (oj, ko, $, ResourceBundle) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.resource = ResourceBundle;
        Params.dashboard.headerName(self.resource.requestPin.cardHeading);
    };
});