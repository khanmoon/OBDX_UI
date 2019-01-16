define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!lzn/alpha/resources/nls/application-loan-statement-input",
    "ojs/ojswitch",
    "ojs/ojcheckboxset"
], function (oj, ko, $, ApplicationLoanStatementModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, getNewKoModel = function (model) {
                var KoModel = ApplicationLoanStatementModel.getNewModel(model);
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.dataLoaded = ko.observable(false);
        self.frequencyOptions = ko.observable([]);
        self.isStatementRequired = ko.observable(false);
        self.checkBoxResponse = ko.observable(false);
        self.isCheckBoxResponse = ko.observable("OPTION_YES");
        self.isEmailResponse = ko.observable("OPTION_NO");
        self.isPostResponse = ko.observable("OPTION_NO");
        self.selectedFrequency = ko.observable();
        self.validationTracker = ko.observable();
        self.uplTrackingDetails().additionalInfo.loanStatement = getNewKoModel().loanStatement;
        self.isStatementType = ko.observable("");
        self.statementTypes = ko.observable("");
        self.checkBoxResponse.subscribe(function (newValue) {
            if (newValue === true || newValue === "true") {
                self.isStatementRequired(true);
            } else {
                self.isStatementRequired(false);
            }
        });
        self.saveCheckBoxResponse = function (event, data) {
            if (data.value === "OPTION_NO") {
                self.isStatementRequired(false);
            }
            if (data.value === "OPTION_YES") {
                self.isStatementRequired(true);
            }
        };
        self.saveEmailResponse = function (event, data) {
            if (data.value === "OPTION_YES") {
                if (self.isPostResponse() === "OPTION_YES") {
                    self.statementTypes([
                        "ONLINE",
                        "PHYSICAL"
                    ]);
                } else {
                    self.statementTypes(["ONLINE"]);
                }
            }
            if (data.value === "OPTION_NO") {
                self.statementTypes(["PHYSICAL"]);
            }
        };
        self.savePostResponse = function (event, data) {
            if (data.value === "OPTION_YES") {
                if (self.isEmailResponse() === "OPTION_YES") {
                    self.statementTypes([
                        "ONLINE",
                        "PHYSICAL"
                    ]);
                } else {
                    self.statementTypes(["PHYSICAL"]);
                }
            }
            if (data.value === "OPTION_NO") {
                self.statementTypes(["ONLINE"]);
            }
        };
        ApplicationLoanStatementModel.fetchFrequencyList().done(function (data) {
            self.frequencyOptions(data.enumRepresentations[0].data);
            self.dataLoaded(true);
            ApplicationLoanStatementModel.fetchConfiguration(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function (data) {
                self.checkBoxResponse(data.isStatementRequired ? data.isStatementRequired : self.checkBoxResponse());
                self.isStatementType(data.statementType ? data.statementType : self.isStatementType());
                self.selectedFrequency([data.frequency ? data.frequency : self.selectedFrequency()]);
                if (self.selectedFrequency()[0] === undefined) {
                    self.selectedFrequency([self.frequencyOptions()[0].value]);
                }
                if (data.statementType && data.statementType === "BOTH") {
                    self.statementTypes([
                        "ONLINE",
                        "PHYSICAL"
                    ]);
                    self.isEmailResponse("OPTION_YES");
                    self.isPostResponse("OPTION_YES");
                } else if (data.statementType) {
                    if (data.statementType === "ONLINE") {
                        self.statementTypes([data.statementType]);
                        self.isEmailResponse("OPTION_YES");
                    }
                    if (data.statementType === "PHYSICAL") {
                        self.statementTypes([data.statementType]);
                        self.isPostResponse("OPTION_YES");
                    }
                }
            });
        });
        self.submitLoanStatementInfo = function () {
            if (self.statementTypes().length > 1) {
                self.isStatementType("BOTH");
            } else {
                self.isStatementType(self.statementTypes()[0]);
            }
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            var frequencyToBeSent = self.selectedFrequency()[0];
            self.uplTrackingDetails().additionalInfo.loanStatement.required = self.isStatementRequired();
            self.uplTrackingDetails().additionalInfo.loanStatement.frequency = self.selectedFrequency();
            if (self.isStatementRequired()) {
                ApplicationLoanStatementModel.configureLoanStatement(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId(), {
                    isStatementRequired: self.isStatementRequired(),
                    statementType: self.isStatementType(),
                    frequency: frequencyToBeSent
                }).done(function () {
                    self.additionalInfoAccordion().close(3);
                });
            } else {
                ApplicationLoanStatementModel.configureLoanStatement(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId(), { isStatementRequired: self.isStatementRequired() }).done(function () {
                    self.additionalInfoAccordion().close(3);
                });
            }
            self.uplTrackingDetails().additionalInfo.sections[2].isComplete(true);
            self.additionalInfoAccordion().open(3);
        };
    };
});