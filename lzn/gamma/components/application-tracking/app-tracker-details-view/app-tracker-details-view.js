define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!lzn/gamma/resources/nls/application-details-view",
    "ojL10n!lzn/gamma/resources/nls/application-list",
    "ojs/ojswitch"
], function (oj, ko, $, ApplicationDetailsViewModel, BaseLogger, resourceBundle, appResource) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.appResource = appResource;
        self.headingText(self.resource.application);
        self.dataLoaded = ko.observable(false);
        self.applicationInfoAccordion = ko.observable({});
        self.applicationFormId = ko.observable("");
        self.documentReferenceId = ko.observable("");
        self.showApplicationForm = ko.observable(false);
        self.detailsLoaded = ko.observable(false);
        self.applicationSummaryLoaded = ko.observable(false);
        self.addressesForBranches = ko.observableArray([]);
        self.stateOptions = ko.observableArray([]);
        self.primaryApplicant = ko.observable();
        self.addressesForParty = ko.observable({
            HOME: {},
            POSTAL: {}
        });
        self.feeAmount = {
            amount: 0,
            currency: "USD"
        };
        self.documentName = ko.observable(self.applicationInfo().currentSubmissionId() + ".rtf");
        self.appDetails().loanApplicationDate = new Date(self.appDetails().loanApplicationDate).toDateString();
        self.formatMaturityDate = function (date) {
            var year = date.substr(0, 4);
            var month = date.substr(5, 2);
            var day = date.substr(8, 2);
            return month + "-" + day + "-" + year;
        };
        self.downloadDocument = function () {
            if (self.documentReferenceId()) {
                ApplicationDetailsViewModel.fetchDocumentsByteArray(self.documentReferenceId(), self.appDetails().coApplicants[0].applicantId.value);
            }
        };
    };
});