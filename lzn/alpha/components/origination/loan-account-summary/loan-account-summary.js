define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!lzn/alpha/resources/nls/loan-account-summary",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojinputnumber"
], function (oj, ko, $, LoanAccountSummaryModelObject, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, LoanAccountSummaryModel = new LoanAccountSummaryModelObject(), getNewKoModel = function () {
                var KoModel = LoanAccountSummaryModel.getNewModel();
                for (var i = 0; i < KoModel.loanAccountSummary.stageDetails.length; i++) {
                    KoModel.loanAccountSummary.stageDetails[i].frequencies = ko.observable(KoModel.loanAccountSummary.stageDetails[0].frequencies);
                    KoModel.loanAccountSummary.stageDetails[i].rateType = ko.observable(KoModel.loanAccountSummary.stageDetails[0].rateType);
                    KoModel.loanAccountSummary.stageDetails[i].tenure.years = ko.observable(KoModel.loanAccountSummary.stageDetails[0].tenure.years);
                    KoModel.loanAccountSummary.stageDetails[i].tenure.months = ko.observable(KoModel.loanAccountSummary.stageDetails[0].tenure.months);
                    KoModel.loanAccountSummary.stageDetails[i].installmentAmount.amount = ko.observable(KoModel.loanAccountSummary.stageDetails[0].installmentAmount.amount);
                    KoModel.loanAccountSummary.stageDetails[i].stageName = ko.observable(KoModel.loanAccountSummary.stageDetails[i].stageName);
                }
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.validationTracker = ko.observable();
        self.applicantObject = ko.observable(rootParams.applicantObject);
        self.accountSummaryInfoLoaded = ko.observable(false);
        self.isEPIPresent = ko.observable(false);
        self.isIOIPresent = ko.observable(false);
        LoanAccountSummaryModel.init(self.productDetails().submissionId.value);
        self.productDetails().loanAccountSummaryInfo = getNewKoModel();
        self.initializeModel = function () {
            if (self.accountSummaryData().accountSummary) {
                var i;
                for (i = 0; i < self.accountSummaryData().accountSummary.length; i++) {
                    self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails[i].frequencies(self.resource.frequencyList[self.accountSummaryData().accountSummary[i].frequencies]);
                    self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails[i].rateType(self.accountSummaryData().accountSummary[i].rateType);
                    self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails[i].tenure.years(self.accountSummaryData().accountSummary[i].tenure.years);
                    self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails[i].tenure.months(self.accountSummaryData().accountSummary[i].tenure.months);
                    self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails[i].installmentAmount.amount(self.accountSummaryData().accountSummary[i].installmentAmount.amount);
                    self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails[i].installmentAmount.currency = self.accountSummaryData().accountSummary[i].installmentAmount.currency;
                    self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails[i].stageCode = self.accountSummaryData().accountSummary[i].stageCode;
                    self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails[i].stageName(self.accountSummaryData().accountSummary[i].stageName);
                }
                for (i = self.accountSummaryData().accountSummary.length; i < self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails.length; i++) {
                    self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails[i].stageName("");
                    self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails[i].frequencies("");
                    self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails[i].rateType("");
                    self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails[i].tenure.years(0);
                    self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails[i].tenure.months(0);
                    self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails[i].installmentAmount.amount(0);
                    self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails[i].installmentAmount.currency = "";
                    self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails[i].stageCode = "";
                }
                if (self.getIndex(self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails, "INTEREST") >= 0) {
                    self.isIOIPresent(true);
                } else {
                    self.isIOIPresent(false);
                }
                if (self.getIndex(self.productDetails().loanAccountSummaryInfo.loanAccountSummary.stageDetails, "PRINCIPAL") >= 0) {
                    self.isEPIPresent(true);
                } else {
                    self.isEPIPresent(false);
                }
                self.accountSummaryInfoLoaded(true);
            }
        };
        self.getIndex = function (obj, key) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].stageName() === key) {
                    return i;
                }
            }
        };
        self.initializeModel();
        self.accountSummaryContinue = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.uplTrackingDetails().additionalInfo.sections[rootParams.index].isComplete(true);
            self.showNextComponent(rootParams.index + 1);
        };
    };
});