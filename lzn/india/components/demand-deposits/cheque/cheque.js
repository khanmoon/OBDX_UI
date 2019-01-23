define([
    "knockout",
    "jquery",
    "framework/js/constants/constants",
    "ojL10n!resources/nls/cheque-book-request",
    "ojs/ojknockout-validation",
    "ojs/ojvalidation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup"
], function (ko, $, Constants, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.chequeBookRequestLocale = locale;
        self.common = locale.common;
        self.constants = Constants;
        ko.utils.extend(self, rootParams.rootModel);
        self.modelInstance = rootParams.rootModel.params.modelInstance;
    };
});
