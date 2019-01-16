define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/service-request-list",
    "ojs/ojlistview"
], function (ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.serviceRequests = ko.observable(self.partyData());
        self.componentName = ko.observable("date-box");
        self.nls = resourceBundle;
        rootParams.dashboard.headerName(self.nls.serviceRequest.header);
    };
});