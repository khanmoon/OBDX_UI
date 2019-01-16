define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!lzn/gamma/resources/nls/application-form",
    "framework/js/constants/application-form-generic",
    "ojs/ojradioset",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojtrain",
    "ojs/ojdatetimepicker"
], function (oj, ko, $, ApplicationFormModel, resourceBundle, ApplicationFormGeneric) {
    "use strict";
    return function (rootParams) {
        var self = this, i, j, successHandlers = {};
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.applicantType = "PRIMARY";
        self.dataLoaded = ko.observable(false);
        if (self.productDetails().requirements && self.productDetails().requirements.requestedAmount) {
          self.loanAmount(rootParams.baseModel.formatCurrency(self.productDetails().requirements.requestedAmount.amount, (self.productDetails().requirements.requestedAmount.currency===undefined)?self.productDetails().currency:self.productDetails().requirements.requestedAmount.currency));
        }
        successHandlers.successHandlerfetchApplcantList = function (data) {
            self.applicantDetails()[0].newApplicant = data.applicants[0].newApplicant;
            self.dataLoaded(true);
        };
        ApplicationFormModel.fetchpplicantList(self.productDetails().submissionId.value, successHandlers.successHandlerfetchApplcantList);
        if (!self.applicantDetails()[0].applicantType) {
            self.applicantDetails()[0].applicantType = ko.observable("anonymous");
            self.applicantDetails()[0].channelUser = ko.observable(false);
            if (self.productDetails().requirements) {
                for (i = 1; i <= self.productDetails().requirements.noOfCoApplicants; i++) {
                    self.applicantDetails()[i].applicantType = ko.observable("anonymous");
                    self.applicantDetails()[i].channelUser = ko.observable(false);
                }
            }
        }
        if (self.productDetails().requirements) {
            if (typeof self.productDetails().requirements.requestedTenure !== "undefined" && self.productDetails().requirements.requestedTenure.years() !== 0) {
                self.tenure(self.tenure() + self.productDetails().requirements.requestedTenure.years() + self.resource.years);
            }
            if (typeof self.productDetails().requirements.requestedTenure !== "undefined" && self.productDetails().requirements.requestedTenure.months() !== 0) {
                self.tenure(self.tenure() + self.productDetails().requirements.requestedTenure.months() + self.resource.months);
            }
        }
        self.disableFinalContinue = function (obj) {
            for (i = 0; i < obj.length; i++) {
                if (!JSON.parse(obj[i].isComplete())) {
                    return true;
                }
            }
            return false;
        };
        if (!self.productDetails().application) {
            self.productDetails().applicantList = ko.observableArray([]);
            self.productDetails().application = ko.observable({ stages: ko.observableArray([]) });
            rootParams.baseModel.registerComponent(self.productDetails().currentStage.stages[0].id, "origination");
            self.productDetails().productApplicationComponentName = ko.observable(self.productDetails().currentStage.stages[0].id);
            for (i = 0; i < self.productDetails().currentStage.stages.length; i++) {
                self.productDetails().application().stages.push(self.productDetails().currentStage.stages[i]);
                if (self.productDetails().application().stages()[i].stages !== null) {
                    self.productDetails().application().stages()[i].applicantStages = JSON.parse(ko.toJSON(self.productDetails().application().stages()[i].stages));
                    for (j = 0; j < self.productDetails().application().stages()[i].stages.length; j++) {
                        self.productDetails().application().stages()[i].applicantStages[j].isComplete = ko.observable(false);
                    }
                }
            }
            self.productDetails().application().currentApplicationStage = self.productDetails().application().stages()[0];
        }
        self.saveApplicationCustomer = function (stage) {
            var payload = {
                requestedAmount: {
                    currency: rootParams.baseModel.getLocaleValue("localCurrency"),
                    amount: 0
                },
                requestedTenure: {
                    days: 0,
                    months: 0,
                    years: 0
                },
                isIPA: false,
                purposeType: "",
                frequency: "MONTHLY",
                isCapitalizeFeesOpted: false,
                isSettlementRequired: false,
                purpose: { code: "" },
                noOfCoApplicants: "0",
                productGroupCode: self.productDetails().productCode,
                productGroupName: self.productDetails().productDescription,
                productGroupSerialNumber: self.productGroupSerialNumber(),
                productClass: self.productDetails().productClassName,
                productSubClass: self.productDetails().productType,
                productId: self.productDetails().productCode,
                state: self.selectedState(),
                facilityId: self.productDetails().facilityId
            };
            var isStageReq = stage.id === "requirements" || stage.id === "vehicle-info";
            var isFirstStageForCustomer = !self.applicantDetails()[0].newApplicant && stage.sequenceNumber === 1;
            if (isFirstStageForCustomer && !self.applicationStartedFromDraft && !isStageReq) {
                ApplicationFormModel.validateLoan(self.productDetails().submissionId.value, payload);
            }
        };
        ko.utils.extend(self, new ApplicationFormGeneric(self));
    };
});
