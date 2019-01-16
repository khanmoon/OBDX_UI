define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/review-funds-transfer"

], function (oj, ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle;
        self.FTdetails = ko.observable(ko.utils.unwrapObservable(rootParams.data));
        self.approvalTypesMap = {
            R: self.Nls.fileupload.record,
            F: self.Nls.fileupload.file
        };
    };
});