define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/bills-reports",
    "ojs/ojinputtext"
], function (oj, ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.todayDate = oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate());
    };
});