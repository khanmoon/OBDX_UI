define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "framework/js/constants/application-form-generic",
    "ojs/ojradioset",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojtrain",
    "ojs/ojdatetimepicker"
], function (oj, ko, $, ApplicationFormModel, ApplicationFormGeneric) {
    "use strict";
    return function (rootParams) {
        var self = this, i, j, successHandlers = {};
        ko.utils.extend(self, rootParams.rootModel);
        self.fundingOptionsLoaded = ko.observable(false);
        self.dataLoaded = ko.observable(false);
        rootParams.baseModel.registerComponent("financial-template-base", "origination");
        self.applicantType = "PRIMARY";
        if (typeof self.productDetails().requirements.requestedAmount !== "undefined") {
            self.loanAmount(rootParams.baseModel.formatCurrency(self.productDetails().requirements.requestedAmount.amount, self.productDetails().requirements.requestedAmount.currency));
        }
        successHandlers.successHandlerfetchApplcantList = function (data) {
            if (data.applicants && data.applicants.length > 0) {
                data.applicants.reduce(function (a, e) {
                    if (e.applicantRelationshipType === "CO_APPLICANT") {
                        self.applicantDetails()[1].applicantId(e.applicantId);
                    }
                    if (e.applicantRelationshipType === "APPLICANT") {
                        self.applicantDetails()[0].applicantId(e.applicantId);
                    }
                    return null;
                }, []);
            }
            self.dataLoaded(true);
        };
        ApplicationFormModel.fetchpplicantList(self.productDetails().submissionId.value, successHandlers.successHandlerfetchApplcantList);
        if (!self.applicantDetails()[0].applicantType) {
            self.applicantDetails()[0].applicantType = ko.observable("anonymous");
            self.applicantDetails()[0].channelUser = ko.observable(false);
            for (i = 1; i <= self.productDetails().requirements.noOfCoApplicants; i++) {
                self.applicantDetails()[i].applicantType = ko.observable("anonymous");
                self.applicantDetails()[i].channelUser = ko.observable(false);
            }
        }
        if (typeof self.productDetails().requirements.requestedTenure !== "undefined" && self.productDetails().requirements.requestedTenure.years() !== 0) {
            self.tenure(self.tenure() + self.productDetails().requirements.requestedTenure.years() + self.resource.applicationForm.years);
        }
        if (typeof self.productDetails().requirements.requestedTenure !== "undefined" && self.productDetails().requirements.requestedTenure.months() !== 0) {
            self.tenure(self.tenure() + self.productDetails().requirements.requestedTenure.months() + self.resource.applicationForm.months);
        }
        if (!self.productDetails().application) {
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
        self.validateEmploymentProfile = function () {
            if (self.productDetails().sectionBeingEdited()) {
                self.getNextApplicationStage();
            } else {
                ApplicationFormModel.validateEmployment(self.productDetails().submissionId.value, self.applicantDetails()[0].applicantId().value, 0, successHandlers.successHanldervalidateEmployment);
            }
        };
        var count = 0;
        successHandlers.successHanldervalidateEmployment = function (data, validateEmploymentIndex) {
            count++;
            if (data.employmentProfiles) {
                self.applicantDetails()[validateEmploymentIndex].financialProfile = [];
                self.employmentProfileIds = ko.observableArray();
                for (var i = 0; i < data.employmentProfiles.length; i++) {
                    self.employmentProfileIds().push(data.employmentProfiles[i].id);
                    self.applicantDetails()[validateEmploymentIndex].financialProfile.push({
                        profileId: data.employmentProfiles[i].id,
                        type: data.employmentProfiles[i].type
                    });
                }
            }
            if (count === 1 && self.applicantDetails().length > 1) {
                ApplicationFormModel.validateEmployment(self.productDetails().submissionId.value, self.applicantDetails()[1].applicantId().value, 1, successHandlers.successHanldervalidateEmployment);
            }
            if (count === self.applicantDetails().length) {
                self.getNextApplicationStage();
            }
        };
        ko.utils.extend(self, new ApplicationFormGeneric(self));
    };
});
