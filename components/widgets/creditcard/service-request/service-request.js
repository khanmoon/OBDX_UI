define([
    "ojs/ojcore",
    "knockout",
    "./model",

    "ojL10n!resources/nls/service-request"
], function (oj, ko, ServiceRequestModel, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("service-request-list", "creditcard");
        rootParams.baseModel.registerElement("object-card");
        rootParams.baseModel.registerElement("date-box");
        self.locale = locale;
        self.image = "cards/service-requests.svg";
        self.showCard = ko.observable(false);
        self.count = ko.observable(0);
        self.serviceRequests = ko.observableArray([]);
        self.cardData = {
            title: self.locale.serviceRequest.card_title,
            linkText: self.locale.serviceRequest.card_viewall,
            description: self.locale.serviceRequest.card_description
        };
        ServiceRequestModel.fetchServiceRequest().done(function (data) {
            self.count(data.list.length);
            self.serviceRequests(data.list);
            self.showCard = ko.observable(true);
        });
    };
});