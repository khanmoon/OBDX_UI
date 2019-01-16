define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojs/ojfilmstrip"
], function (oj, ko, $, FinancialTemplateBaseObject) {
    "use strict";
    return function (rootParams) {
        var self = this, FinancialTemplateBaseModel = new FinancialTemplateBaseObject(), i = 0, batchRequestData = { batchDetailRequestList: [] };
        ko.utils.extend(self, rootParams.rootModel);
        self.productHeadingName(self.productDetails().application().currentApplicationStage.name);
        self.showBaseComponents = ko.observable(false);
        self.enableContinue = ko.observable(false);
        self.productDetails().application().currentApplicationStage.applicantAccordion = ko.observable({});
        self.productDetails().application().currentApplicationStage.coApplicantAccordion = ko.observableArray([]);
        self.finTempSequenceNumber = self.productDetails().application().currentApplicationStage.sequenceNumber;
        self.employmentFinancialTemplates = {};
        self.filmstripLabel = ko.observable();
        self.getFilmstripLabel = function (index) {
            if (self.applicantDetails().length > 1) {
                return rootParams.baseModel.format(self.accordionNames.accordionNames.financialTemplate.name, {
                    index: self.employmentProfileIds().length > 1 ? index + 1 : "",
                    applicantName: rootParams.baseModel.format(self.resource.generic.common.name, {
                        firstName: self.applicantDetails()[self.finTempSequenceNumber - 2].primaryInfo.primaryInfo.firstName(),
                        lastName: self.applicantDetails()[self.finTempSequenceNumber - 2].primaryInfo.primaryInfo.lastName()
                    })
                });
            }
                return rootParams.baseModel.format(self.accordionNames.accordionNames.financialTemplate.name, {
                    index: self.employmentProfileIds().length > 1 ? self.finTempSequenceNumber - 1 : "",
                    applicantName: ""
                });

        };
        FinancialTemplateBaseModel.init(self.productDetails().submissionId.value, self.applicantDetails()[self.finTempSequenceNumber - 2].applicantId().value, self.productGroupSerialNumber());
        self.optionsByFinTemplate = ko.observable(true);
        self.ChangeFinancialProfile = function (event, data) {
            $("#financialPorfile" + data.previousValue).addClass("hide");
            $("#financialPorfile" + data.value).removeClass("hide");
        };
        i = 0;
        var uri;
        while (i < self.applicantDetails()[self.finTempSequenceNumber - 2].financialProfile.length) {
            uri = {
                value: "/submissions/{submissionId}/applicants/{applicantId}/financialParameter?employmentType={empType}",
                params: {
                    submissionId: self.productDetails().submissionId.value,
                    applicantId: self.applicantDetails()[self.finTempSequenceNumber - 2].applicantId().value,
                    empType: self.applicantDetails()[self.finTempSequenceNumber - 2].financialProfile[i].type
                }
            };
            batchRequestData.batchDetailRequestList.push({
                uri: uri,
                methodType: "GET",
                sequenceId: i,
                headers: {
                    "Content-Id": i,
                    "Content-Type": "application/json"
                }
            });
            i++;
        }
        FinancialTemplateBaseModel.fetchFinancialTemplates(batchRequestData).done(function (finData) {
            self.employmentProfileIds = ko.observableArray();
            var i;
            for (i = 0; i < self.applicantDetails()[self.finTempSequenceNumber - 2].financialProfile.length; i++) {
                self.employmentProfileIds().push(self.applicantDetails()[self.finTempSequenceNumber - 2].financialProfile[i].profileId);
                self.employmentFinancialTemplates[self.applicantDetails()[self.finTempSequenceNumber - 2].financialProfile[i].profileId] = JSON.parse(finData.batchDetailResponseDTOList[i].responseText);
            }
            if (self.productDetails().application().currentApplicationStage.id === "financial-template-base") {
                self.productDetails().application().currentApplicationStage = self.productDetails().application().currentApplicationStage.applicantStages[0];
                for (i = 0; i < self.productDetails().application().currentApplicationStage.stages.length; i++) {
                    self.productDetails().application().currentApplicationStage.stages[i].isComplete = ko.observable(false);
                }
            }
            self.showBaseComponents(true);
        });
        rootParams.baseModel.registerComponent("financial-details", "origination");
        self.validateFinaicialDetails = function () {
            FinancialTemplateBaseModel.validateFinTemplate().done(function () {
                self.productDetails().application().currentApplicationStage = self.productDetails().application().stages()[self.finTempSequenceNumber - 1];
                self.productDetails().productApplicationComponentName("row");
                ko.tasks.runEarly();
                self.getNextApplicationStage();
            });
        };
    };
});
