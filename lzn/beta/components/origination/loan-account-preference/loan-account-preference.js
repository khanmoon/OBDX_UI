define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!lzn/beta/resources/nls/loan-account-preference",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojinputnumber",
    "ojs/ojcheckboxset"
], function (oj, ko, $, LoanAccountPreferenceModelObject, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, LoanAccountPreferenceModel = new LoanAccountPreferenceModelObject(), getNewKoModel = function () {
                var KoModel = LoanAccountPreferenceModel.getNewModel();
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.validationTracker = ko.observable();
        self.applicantObject = rootParams.applicantObject;
        self.frequencyLoaded = ko.observable(false);
        self.preferenceFrequencies = ko.observable();
        self.redrawFacility = ko.observable("OPTION_YES");
        self.accountPreferenceInfoLoaded = ko.observable(false);
        LoanAccountPreferenceModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId());
        LoanAccountPreferenceModel.fetchAccountPreference().done(function (data) {
            self.applicantObject().loanAccountPreference = getNewKoModel().loanAccountPreference;
            self.applicantObject().loanAccountPreference.loanAccountAdditionalDetails.statementFrequncy = ko.observable(data.loanAccountAdditionalDetails.statementFrequncy);
            self.applicantObject().loanAccountPreference.loanAccountAdditionalDetails.isRedraw = data.loanAccountAdditionalDetails.isRedraw;
            if (self.applicantObject().loanAccountPreference.loanAccountAdditionalDetails.isRedraw) {
                self.redrawFacility("OPTION_YES");
            } else {
                self.redrawFacility("OPTION_NO");
            }
            self.accountPreferenceInfoLoaded(true);
        });
        LoanAccountPreferenceModel.fetchEnum().done(function (data) {
            self.preferenceFrequencies(data.enumRepresentations[0].data);
            self.frequencyLoaded(true);
        });
        self.redrawFacilitySelected = function (event, data) {
            if (data.value === "OPTION_NO") {
                self.redrawFacility("OPTION_NO");
                self.applicantObject().loanAccountPreference.loanAccountAdditionalDetails.isRedraw = false;
            }
            if (data.value === "OPTION_YES") {
                self.redrawFacility("OPTION_YES");
                self.applicantObject().loanAccountPreference.loanAccountAdditionalDetails.isRedraw = true;
            }
        };
        self.submitAccountPreference = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            LoanAccountPreferenceModel.saveAccountPreference(ko.toJSON(self.applicantObject().loanAccountPreference.loanAccountAdditionalDetails)).done(function () {
                if (self.componentName() === "application-tracking-base") {
                    self.uplTrackingDetails().additionalInfo.sections[rootParams.index].isComplete(true);
                    self.showNextComponent(rootParams.index + 1);
                } else {
                    self.productDetails().productStages[3].stages[rootParams.index].isComplete(true);
                    self.showNextComponent(rootParams.index + 1);
                }
            });
        };
    };
});
