define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "paperAccordion"
], function (oj, ko, $, FinancialDetailsModelObject) {
    "use strict";
    return function (rootParams) {
        var self = this, FinancialDetailsModel = new FinancialDetailsModelObject(), i, j;
        ko.utils.extend(self, rootParams.rootModel);
        self.finAssetTypeData = ko.observableArray([]);
        self.finLiabilityOptions = ko.observableArray([]);
        self.finExpenditureOptions = ko.observableArray([]);
        self.finIncomeOptions = ko.observableArray([]);
        self.employmentProfileId = rootParams.data ? rootParams.data : 1;
        for (i = 0; i < self.applicantDetails()[self.finTempSequenceNumber - 2].financialProfile.length; i++) {
            if (self.applicantDetails()[self.finTempSequenceNumber - 2].financialProfile[i].profileId === self.employmentProfileId) {
                self.profileIdIndex = i;
                break;
            }
        }
        self.productHeadingName(self.productDetails().application().currentApplicationStage.name);
        self.showComponents = ko.observable(false);
        self.productDetails().application().currentApplicationStage.applicantAccordion = ko.observable({});
        self.productDetails().application().currentApplicationStage.coApplicantAccordion = ko.observableArray([]);
        FinancialDetailsModel.init(self.productDetails().submissionId.value, self.applicantDetails()[self.finTempSequenceNumber - 2].applicantId(), self.productGroupSerialNumber());
        self.optionsByFinTemplate = ko.observable(true);
        self.finTemplateStages = ko.observableArray();
        self.componentIndexToRemove = [];
        self.manINC = [];
        self.optINC = [];
        self.manEXP = [];
        self.optEXP = [];
        self.manAST = [];
        self.optAST = [];
        self.manLIA = [];
        self.optLIA = [];
        self.manCLI = [];
        self.optCLI = [];
        self.manCAS = [];
        self.optCAS = [];
        self.currentEmpProfileTemplate = self.employmentFinancialTemplates[self.employmentProfileId];
        for (i = 0; i < self.currentEmpProfileTemplate.financialTemplateGroupDTOs.length; i++) {
            self.finTemplateStages().push(self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialParameter);
            switch (self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialParameter) {
            case "INCOME": {
                    for (j = 0; j < self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters.length; j++) {
                        if (self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].mandatory) {
                            self.manINC.push(self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].financialParameterDTO);
                        } else {
                            self.optINC.push(self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].financialParameterDTO);
                        }
                        self.finIncomeOptions().push(self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].financialParameterDTO);
                    }
                    break;
                }
            case "EXPENSE": {
                    for (j = 0; j < self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters.length; j++) {
                        if (self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].mandatory) {
                            self.manEXP.push(self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].financialParameterDTO);
                        } else {
                            self.optEXP.push(self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].financialParameterDTO);
                        }
                        self.finExpenditureOptions.push(self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].financialParameterDTO);
                    }
                    break;
                }
            case "ASSET": {
                    for (j = 0; j < self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters.length; j++) {
                        if (self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].mandatory) {
                            self.manAST.push(self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].financialParameterDTO);
                        } else {
                            self.optAST.push(self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].financialParameterDTO);
                        }
                        self.finAssetTypeData.push(self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].financialParameterDTO);
                    }
                    break;
                }
            case "LIABILITY": {
                    for (j = 0; j < self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters.length; j++) {
                        if (self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].mandatory) {
                            self.manLIA.push(self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].financialParameterDTO);
                        } else {
                            self.optLIA.push(self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].financialParameterDTO);
                        }
                        self.finLiabilityOptions.push(self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].financialParameterDTO);
                    }
                    break;
                }
            case "CLI": {
                    for (j = 0; j < self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters.length; j++) {
                        if (self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].mandatory) {
                            self.manCLI.push(self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].financialParameterDTO);
                        } else {
                            self.optCLI.push(self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].financialParameterDTO);
                        }
                    }
                    break;
                }
            case "CAS": {
                    for (j = 0; j < self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters.length; j++) {
                        if (self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].mandatory) {
                            self.manCAS.push(self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].financialParameterDTO);
                        } else {
                            self.optCAS.push(self.currentEmpProfileTemplate.financialTemplateGroupDTOs[i].financialGroupParameters[j].financialParameterDTO);
                        }
                    }
                    break;
                }
            }
        }
        for (i = 0; i < self.productDetails().application().currentApplicationStage.stages.length; i++) {
            if (!(self.finTemplateStages().indexOf(self.productDetails().application().currentApplicationStage.stages[i].type) < 0)) {
                rootParams.baseModel.registerComponent(self.productDetails().application().currentApplicationStage.stages[i].id, "origination");
            } else {
                self.componentIndexToRemove.push(i);
            }
        }
        for (i = self.componentIndexToRemove.length; i > 0; i--) {
            self.productDetails().application().currentApplicationStage.stages.splice(self.componentIndexToRemove[i - 1], 1);
        }
        for (i = 0; i < self.productDetails().application().currentApplicationStage.stages.length; i++) {
            self.productDetails().application().currentApplicationStage.stages[i].sequenceNumber = i + 1;
            if (i === 0) {
                self.productDetails().application().currentApplicationStage.stages[i].previousStage = null;
            } else {
                self.productDetails().application().currentApplicationStage.stages[i].previousStage = self.productDetails().application().currentApplicationStage.stages[i - 1].id;
            }
            if (i + 1 < self.productDetails().application().currentApplicationStage.stages.length) {
                self.productDetails().application().currentApplicationStage.stages[i].nextStagename = self.productDetails().application().currentApplicationStage.stages[i + 1].id;
            } else {
                self.productDetails().application().currentApplicationStage.stages[i].nextStagename = null;
            }
        }
        self.validateFinaicialDetails = function () {
            FinancialDetailsModel.validateFinTemplate().done(function () {
                self.getNextApplicationStage();
            });
        };
        self.initializeAccordion = function () {
            self.productDetails().application().currentApplicationStage.applicantAccordion($("#financialDetailsAccordion" + self.profileIdIndex).paperAccordion({
                disableOthers: true,
                zoom: false
            }));
            for (i = 0; i < self.productDetails().application().currentApplicationStage.stages.length; i++) {
                if (self.productDetails().application().currentApplicationStage.stages[i].isComplete === "true") {
                    self.productDetails().application().currentApplicationStage.applicantAccordion().enable(i + 2);
                }
            }
            if (self.productDetails().sectionBeingEdited() === self.productDetails().application().currentApplicationStage.id) {
                self.productDetails().application().currentApplicationStage.applicantAccordion().enableAll();
            }
            if (self.productDetails().sectionBeingEdited()) {
                for (i = 0; i < self.productDetails().application().currentApplicationStage.stages.length; i++) {
                    if (self.productDetails().application().currentApplicationStage.stages[i].id === self.productDetails().sectionBeingEdited()) {
                        self.productDetails().application().currentApplicationStage.stages[i].isComplete(true);
                        if (i === self.productDetails().application().currentApplicationStage.stages.length - 1) {
                            self.productDetails().application().currentApplicationStage.applicantAccordion().close(i + 1);
                        } else {
                            self.productDetails().application().currentApplicationStage.applicantAccordion().open(i + 1);
                        }
                        break;
                    }
                }
                self.productDetails().application().currentApplicationStage.applicantAccordion().enableAll();
                self.enableContinue(true);
            }
        };
        self.showComponents(true);
    };
});
