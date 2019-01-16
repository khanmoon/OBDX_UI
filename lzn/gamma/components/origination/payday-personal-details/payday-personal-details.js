define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "paperAccordion",
    "ojs/ojbutton"
], function (oj, ko, $, PersonalDetailsService) {
    "use strict";
    return function (rootParams) {
        var self = this, i = 0, j = 0;
        ko.utils.extend(self, rootParams.rootModel);
        self.productHeadingName(self.productDetails().application().currentApplicationStage.name);
        self.showComponents = ko.observable(false);
        self.showAboutYouBanner = ko.observable(false);
        self.extraFieldsJson = null;
        self.productDetails().application().currentApplicationStage.applicantAccordion = ko.observable({});
        self.applicationStages = ko.utils.arrayFilter(self.productDetails().application().currentApplicationStage.applicantStages, function (stage) {
            if (stage.stepCategory === "APPLICATION") {
                return stage;
            }
        });
        if (!self.applicantDetails()[0].newApplicant) {
            self.showAboutYouBanner(true);
        }
        self.optionsByFinTemplate = ko.observable(false);
        for (i = 0; i < self.productDetails().application().currentApplicationStage.applicantStages.length; i++) {
            self.productDetails().application().currentApplicationStage.applicantStages[i].accordionTitle = ko.observable();
            if (self.applicantDetails().length > 1) {
                if (self.productDetails().application().currentApplicationStage.applicantStages[i].coappNumber) {
                    self.productDetails().application().currentApplicationStage.applicantStages[i].accordionTitle(rootParams.baseModel.format(self.accordionNames.accordionNames[self.productDetails().application().currentApplicationStage.applicantStages[i - 1].name], { applicant: self.accordionNames.accordionNames.coApplicant }));
                } else {
                    self.productDetails().application().currentApplicationStage.applicantStages[i].accordionTitle(rootParams.baseModel.format(self.accordionNames.accordionNames[self.productDetails().application().currentApplicationStage.applicantStages[i].name], { applicant: self.accordionNames.accordionNames.applicant }));
                }
            } else {
                self.productDetails().application().currentApplicationStage.applicantStages[i].accordionTitle(rootParams.baseModel.format(self.accordionNames.accordionNames[self.productDetails().application().currentApplicationStage.applicantStages[i].name], { applicant: "" }));
            }
        }
        for (i = 0; i < self.productDetails().application().currentApplicationStage.stages.length; i++) {
            rootParams.baseModel.registerComponent("payday-" + self.productDetails().application().currentApplicationStage.stages[i].id, "origination");
        }
        for (i = 0; i < self.productDetails().application().currentApplicationStage.applicantStages.length; i++) {
            self.productDetails().application().currentApplicationStage.applicantStages[i].showAlert = ko.observable(false);
        }
        self.checkDataAvailability = function (dataObject, componentName) {
            var editable;
            var tempFields;
            tempFields = ko.utils.arrayFilter(self.extraFieldsJson, function (obj) {
                if (obj.component === componentName) {
                    return obj;
                }
            });
            if (tempFields.length > 0) {
                for (j = 0; j < tempFields[0].fields.length; j++) {
                    editable = self.searchField(dataObject, tempFields[0].fields[j]);
                    if (!editable) {
                        return false;
                    }
                }
                return true;
            }
                return true;

        };
        self.searchField = function (obj, query) {
            if ($.isArray(obj)) {
                for (var k = 0; k < obj.length; k++) {
                    if (self.searchField(obj[k], query)) {
                        return true;
                    }
                }
                return false;
            }
                for (var key in obj) {
                    if (key === query) {
                        if (obj[key]) {
                            return true;
                        }
                            return false;

                    } else if (typeof obj[key] === "object" || $.isArray(obj)[key]) {
                        self.searchField(obj[key], query);
                    }
                }
                return false;

        };
        self.showIcon = function (showComplete, stageObject) {
            if (showComplete) {
                stageObject.isComplete(true);
            } else {
                stageObject.showAlert(true);
            }
        };
        self.fetchExtraFieldsSuccessHandler = function (data) {
            self.extraFieldsJson = data.enumRepresentations[0].data;
        };
        self.initializeAccordion = function () {
            self.productDetails().application().currentApplicationStage.applicantAccordion($("#personalDetailsAccordion").paperAccordion({
                disableOthers: true,
                zoom: false
            }));
            for (i = 0; i < self.productDetails().application().currentApplicationStage.applicantStages.length; i++) {
                if (self.productDetails().application().currentApplicationStage.applicantStages[i].isComplete()) {
                    self.productDetails().application().currentApplicationStage.applicantAccordion().enable(i + 1);
                }
            }
            if (!self.applicantDetails()[0].newApplicant) {
                for (i = self.applicationStages.length; i < self.productDetails().application().currentApplicationStage.applicantStages.length; i++) {
                    self.productDetails().application().currentApplicationStage.applicantAccordion().enable(i + 1);
                }
                PersonalDetailsService.fetchExtraFields(self.fetchExtraFieldsSuccessHandler);
            }
            if (self.productDetails().sectionBeingEdited()) {
                for (i = 0; i < self.productDetails().application().currentApplicationStage.applicantStages.length; i++) {
                    if (self.productDetails().application().currentApplicationStage.applicantStages[i].id === self.productDetails().sectionBeingEdited()) {
                        self.productDetails().application().currentApplicationStage.applicantStages[i].isComplete(true);
                        if (i === self.productDetails().application().currentApplicationStage.applicantStages.length - 1) {
                            self.productDetails().application().currentApplicationStage.applicantAccordion().close(i + 1);
                        } else {
                            self.productDetails().application().currentApplicationStage.applicantAccordion().open(i + 1);
                        }
                        break;
                    }
                }
            }
        };
        self.showMandatoryFieldStatus = function (dataAvailabilityFlag, compName, isEditableField) {
            if (dataAvailabilityFlag) {
                PersonalDetailsService.fetchMandatoryFields(self.productDetails().submissionId.value, compName, self.fetchMandatoryFieldsSuccessHandler, isEditableField);
            } else {
                isEditableField(true);
                var resultObj;
                resultObj = ko.utils.arrayFilter(self.extraFieldsJson, function (obj) {
                    if (obj.component === compName) {
                        return obj;
                    }
                });
                var payload = {
                    sectionId: resultObj[0].component,
                    elementIds: resultObj[0].fields
                };
                PersonalDetailsService.postMandatoryFields(self.productDetails().submissionId.value, ko.toJSON(payload));
            }
        };
        self.fetchMandatoryFieldsSuccessHandler = function (data, isEditableField) {
            if (data.sections) {
                isEditableField(true);
            } else {
                isEditableField(false);
            }
        };
        self.isAlertDisplayed = function (obj) {
            for (var i = 0; i < obj.length; i++) {
                if (!JSON.parse(obj[i].isComplete()) && JSON.parse(obj[i].showAlert())) {
                    return true;
                }
            }
            return false;
        };
        self.continueClick = function () {
            if (!self.applicantDetails()[0].newApplicant) {
                if (self.isAlertDisplayed(self.productDetails().application().currentApplicationStage.applicantStages)) {
                    $("#continueInvalidAlert").trigger("openModal");
                } else if (self.disableFinalContinue(self.productDetails().application().currentApplicationStage.applicantStages)) {
                        $("#continueInvalid").trigger("openModal");
                    } else {
                        self.getNextApplicationStage();
                    }
            } else if (self.disableFinalContinue(self.productDetails().application().currentApplicationStage.applicantStages)) {
                    $("#continueInvalid").trigger("openModal");
                } else {
                    self.getNextApplicationStage();
                }
        };
        self.login = function () {
            var baseUrl = location.pathname.split("/")[1];
            window.location.pathname = baseUrl + "/pages/my-applications.html";
        };
        self.showComponents(true);
    };
});