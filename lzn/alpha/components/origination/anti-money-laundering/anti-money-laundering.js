define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "ojL10n!lzn/alpha/resources/nls/anti-money-laundering",
  "ojs/ojselectcombobox",
  "ojs/ojarraydataprovider",
  "ojs/ojlistdataproviderview",
  "ojs/ojradioset"
], function (oj, ko, $, AMLModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function (rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.groupValid = ko.observable();
    self.resource = resourceBundle;
    self.selectedSourceOfFunds = ko.observableArray();
    self.selectedSourceOfWeath = ko.observableArray();
    self.selectedPurposeOfRelationship = ko.observableArray();
    self.wealthSources = ko.observableArray([]);
    self.sourceOfFunds = ko.observableArray([]);
    self.relationshipPurposes = ko.observableArray([]);
    self.sourceOfWealthLoaded = ko.observable(false);
    self.sourceOfFundsLoaded = ko.observable(false);
    self.purposeOfRelationshipLoaded = ko.observable(false);
    self.dataLoaded = ko.observable(false);
    self.applicantObject = ko.observable(rootParams.applicantObject);
    self.isAMLExists = false;
    self.consentList = ko.observable();
    self.consentOption = [{
      id: true,
      description: self.resource.origination.common.yes
    }, {
      id: false,
      description: self.resource.origination.common.no
    }];
    self.amlDetailsMetaData = {
      submissionId: self.productDetails().submissionId.value,
      applicantId: self.applicantObject().applicantId().value,
      aMLId: "",
      consentId: ""
    };
    self.createAMLData = {};
    var getNewKoModel = function () {
      var KoModel = AMLModelObject.getNewModel();
      return KoModel;
    };

    self.fetchWealthSourceList = function () {
      AMLModelObject.fetchWealthSources().done(function (data) {
        if (data) {
          for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
            self.wealthSources.push({
              id: data.enumRepresentations[0].data[i].code,
              description: data.enumRepresentations[0].data[i].description
            });
          }
        }
        self.sourceOfWealthLoaded(true);
      });
    };

    self.fetchFundSourcesList = function () {
      AMLModelObject.fetchFundSources().done(function (data) {
        if (data) {
          for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
            self.sourceOfFunds.push({
              id: data.enumRepresentations[0].data[i].code,
              description: data.enumRepresentations[0].data[i].description
            });
          }
        }
        self.sourceOfFundsLoaded(true);
      });
    };

    self.fetchRelationshipPurposesList = function () {
      AMLModelObject.fetchRelationshipPurposes().done(function (data) {
        if (data) {
          for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
            self.relationshipPurposes.push({
              id: data.enumRepresentations[0].data[i].code,
              description: data.enumRepresentations[0].data[i].description
            });
          }
        }
        self.purposeOfRelationshipLoaded(true);
      });
    };
    self.fetchWealthSourceList();
    self.fetchFundSourcesList();
    self.fetchRelationshipPurposesList();

    self.fetchAMLDetails = function () {
      AMLModelObject.fetchAMLDetails(self.amlDetailsMetaData).done(function (data) {
        if (data && data.amlDataDTOs && data.amlDataDTOs[0]) {
          if (data.amlDataDTOs[0].id && data.amlDataDTOs[0].id.value) {
            self.isAMLExists = true;
            var i;
            self.amlDetailsMetaData.aMLId = data.amlDataDTOs[0].id.value;
            if (data.amlDataDTOs[0].purposeOfRelationships) {
              for (i = 0; i < data.amlDataDTOs[0].purposeOfRelationships.length; i++) {
                self.selectedPurposeOfRelationship.push(data.amlDataDTOs[0].purposeOfRelationships[i].amlCode);
              }
            }
            if (data.amlDataDTOs[0].sourceOfWealths) {
              for (i = 0; i < data.amlDataDTOs[0].sourceOfWealths.length; i++) {
                self.selectedSourceOfWeath.push(data.amlDataDTOs[0].sourceOfWealths[i].amlCode);
              }
            }
            if (data.amlDataDTOs[0].sourceOfFunds) {
              for (i = 0; i < data.amlDataDTOs[0].sourceOfFunds.length; i++) {
                self.selectedSourceOfFunds.push(data.amlDataDTOs[0].sourceOfFunds[i].amlCode);
              }
            }
          }
        }
      });
    };
    self.fetchAMLDetails();
    self.submitAdditionalInfo = function () {
      var additionalInfoTracker = document.getElementById("additionalInfoTracker");
      if (additionalInfoTracker.valid === "valid") {
        self.createAMLData.sourceOfFunds = [];
        self.createAMLData.purposeOfRelationships = [];
        self.createAMLData.sourceOfWealths = [];
        var i = 0;
        for (i = 0; i < self.selectedSourceOfFunds().length; i++) {
          self.createAMLData.sourceOfFunds[i] = getNewKoModel().amlDetailsDTO;
          self.createAMLData.sourceOfFunds[i].amlCharacteristicType = "SOURCE_OF_FUNDS";
          self.createAMLData.sourceOfFunds[i].amlCode = self.selectedSourceOfFunds()[i];
        }
        for (i = 0; i < self.selectedPurposeOfRelationship().length; i++) {
          self.createAMLData.purposeOfRelationships[i] = getNewKoModel().amlDetailsDTO;
          self.createAMLData.purposeOfRelationships[i].amlCharacteristicType = "PURPOSE_OF_RELATIONSHIP";
          self.createAMLData.purposeOfRelationships[i].amlCode = self.selectedPurposeOfRelationship()[i];
        }
        for (i = 0; i < self.selectedSourceOfWeath().length; i++) {
          self.createAMLData.sourceOfWealths[i] = getNewKoModel().amlDetailsDTO;
          self.createAMLData.sourceOfWealths[i].amlCharacteristicType = "SOURCE_OF_WEALTH";
          self.createAMLData.sourceOfWealths[i].amlCode = self.selectedSourceOfWeath()[i];
        }
        var payload = ko.toJSON(self.createAMLData);
        if (!self.isAMLExists) {
          AMLModelObject.saveAMLDetails(self.amlDetailsMetaData, payload).then(function (data) {
            if (data && data.amlDataDTO && data.amlDataDTO.id) {
              self.amlDetailsMetaData.aMLId = data.amlDataDTO.id.value;
              self.isAMLExists = true;
            }
            self.saveConsents();
          });
        } else {
          AMLModelObject.updateAMLDetails(self.amlDetailsMetaData, payload).then(function (data) {
            if (data && data.amlDataDTO && data.amlDataDTO.id) {
              self.amlDetailsMetaData.aMLId = data.amlDataDTO.id.value;
            }
            self.saveConsents();
          });
        }
      } else {
        additionalInfoTracker.showMessages();
        additionalInfoTracker.focusOn("@firstInvalidShown");
      }
    };

    self.saveConsents = function () {
      var consentPayload = {
        consentDTOs: JSON.parse(JSON.stringify(self.consentList()))
      };
      for (var i = 0; i < self.consentList().length; i++) {
        consentPayload.consentDTOs[i].answer = self.consentList()[i].answer();
      }
      self.applicantObject().amlData = {
        selectedSourceOfFunds: self.selectedSourceOfFunds(),
        selectedPurposeOfRelationship: self.selectedPurposeOfRelationship(),
        selectedSourceOfWealth: self.selectedSourceOfWeath(),
        sourceOfFunds: self.sourceOfFunds(),
        relationshipPurposes: self.relationshipPurposes(),
        wealthSources: self.wealthSources()
      };
      self.applicantObject().consents = consentPayload;
      if (self.consentResponse.id.value) {
        self.amlDetailsMetaData.consentId = self.consentResponse.id.value;
        AMLModelObject.updateConsents(self.amlDetailsMetaData, ko.toJSON(consentPayload)).done(function () {
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
        });
      } else {
        AMLModelObject.saveConsents(self.amlDetailsMetaData, ko.toJSON(consentPayload)).done(function () {
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
        });
      }
    };

    self.fetchConsent = function () {
      AMLModelObject.fetchConsent(self.amlDetailsMetaData).done(function (data) {
        if (data && data.consentDetailsDTOs && data.consentDetailsDTOs.length > 0) {
          self.consentResponse = data.consentDetailsDTOs[0];
          if (self.consentResponse.consentDTOs && self.consentResponse.consentDTOs.length > 0) {
            self.consentList(JSON.parse(JSON.stringify(self.consentResponse.consentDTOs)));
            for (var i = 0; i < self.consentList().length; i++) {
              self.consentList()[i].answer = ko.observable(self.consentList()[i].answer);
            }
          }
        }
        self.dataLoaded(true);
      });
    };
    self.fetchConsent();
  };
});