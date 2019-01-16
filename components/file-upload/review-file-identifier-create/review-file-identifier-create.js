define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/review-file-identifier"
], function (oj, ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.Nls = resourceBundle.reviewFileIdentifier;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.dashboard.headerName(self.Nls.fIMaintenance);
        self.fiRegistrationPayload = ko.mapping.fromJS(self.params.data);
        self.back = function () {
            history.go(-1);
        };
    };
});