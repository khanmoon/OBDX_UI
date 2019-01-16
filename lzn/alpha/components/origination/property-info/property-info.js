define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "ojL10n!lzn/alpha/resources/nls/origination/property-info",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset"
], function(oj, ko, $, PropertyInfoModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.applicantObject = ko.observable(rootParams.applicantObject);
    self.validationTracker = ko.observable();
    self.propertyTypes = ko.observable([]);
    self.propertySubTypes = ko.observable([]);
    self.owners = ko.observable([]);
    self.propertyTypesInfoLoaded = ko.observable(false);
    self.propertySubTypesInfoLoaded = ko.observable(false);
    self.showResidenceButtonset = ko.observable(false);
    self.ownershipDefault = ko.observable("SINGLE");
    self.propertyInfoDataLoaded = ko.observable(false);
    self.primaryResidentDefault = ko.observable("OPTION_YES");
    self.disableInputs = ko.observable(false);
    self.showJointOwnership = ko.observable(true);
    rootParams.baseModel.registerElement("address-input");
    rootParams.baseModel.registerElement("amount-input");
    var getNewKoModel = function() {
      var KoModel = PropertyInfoModel.getNewModel(self.productDetails().currency);
      KoModel.loanApplicationRequirementDTO.propertyDetails.purchasePrice.amount = ko.observable(KoModel.loanApplicationRequirementDTO.propertyDetails.purchasePrice.amount);
      KoModel.loanApplicationRequirementDTO.propertyDetails.ownership[0].partyName = ko.observable(KoModel.loanApplicationRequirementDTO.propertyDetails.ownership[0].partyName);
      return KoModel;
    };
    PropertyInfoModel.fetchPropetyInfo(self.productDetails().submissionId.value).done(function(data) {
      self.productDetails().requirements.applicantId = data.loanApplicationRequirementDTO.applicantId;
      self.productDetails().requirements.facilityId = data.loanApplicationRequirementDTO.facilityId;
      if (data.loanApplicationRequirementDTO.propertyDetails.address) {
        self.productDetails().requirements.propertyDetails.address = data.loanApplicationRequirementDTO.propertyDetails.address;
        self.productDetails().requirements.propertyDetails.isPrimaryResidence = data.loanApplicationRequirementDTO.propertyDetails.isPrimaryResidence;
        self.productDetails().requirements.propertyDetails.propertyType = data.loanApplicationRequirementDTO.propertyDetails.propertyType;
        if (self.productDetails().requirements.propertyDetails.propertyType === "RESIDENTIAL_PROPERTY") {
          self.showResidenceButtonset(true);
          if (self.productDetails().requirements.propertyDetails.isPrimaryResidence) {
            self.primaryResidentDefault("OPTION_YES");
          } else {
            self.primaryResidentDefault("OPTION_NO");
          }
        }
        PropertyInfoModel.fetchSubTypeOfProperty(self.productDetails().requirements.propertyDetails.propertyType).done(function(data) {
          self.propertySubTypes(data.enumRepresentations[0].data);
          self.propertySubTypesInfoLoaded(true);
        });
        self.productDetails().requirements.propertyDetails.propertySubType = data.loanApplicationRequirementDTO.propertyDetails.propertySubType;
        self.productDetails().requirements.propertyDetails.purchasePrice = data.loanApplicationRequirementDTO.propertyDetails.purchasePrice;
        self.productDetails().requirements.propertyDetails.purchasePrice.amount = ko.observable(data.loanApplicationRequirementDTO.propertyDetails.purchasePrice.amount);
        for (var i = 0; i < data.loanApplicationRequirementDTO.propertyDetails.ownership.length; i++) {
          self.productDetails().requirements.propertyDetails.ownership[i].partyName = ko.observable(data.loanApplicationRequirementDTO.propertyDetails.ownership[i].partyName);
        }
      } else {
        self.productDetails().requirements.propertyDetails = getNewKoModel().loanApplicationRequirementDTO.propertyDetails;
        self.fetchSubPropertyType(self.productDetails().requirements.propertyDetails.propertyType);
      }
      PropertyInfoModel.getApplicant(self.productDetails().submissionId.value).done(function(data) {
        self.owners(data.applicants);
        if (self.owners().length === 1) {
          self.productDetails().requirements.propertyDetails.ownership[0].partyName(rootParams.baseModel.format(self.resource.generic.common.name, {
            firstName: data.applicants[0].personalInfo.firstName,
            lastName: data.applicants[0].personalInfo.lastName
          }));
          self.productDetails().requirements.propertyDetails.ownership[0].partyId = data.applicants[0].applicantId.value;
        }
        if (self.productDetails().requirements.noOfCoApplicants > 0) {
          self.showJointOwnership(false);
        } else {
          self.showJointOwnership(true);
        }
        if (self.productDetails().requirements.propertyDetails.ownership.length > 1) {
          self.ownershipDefault("JOINT");
          self.populateOwnershipDtoJoint();
        }
        self.propertyInfoDataLoaded(true);
      });
    });
    self.ownersChangeHandler = function() {
      ko.utils.arrayForEach(self.owners(), function(owner) {
        if (rootParams.baseModel.format(self.resource.generic.common.name, {
            firstName: owner.personalInfo.firstName,
            lastName: owner.personalInfo.lastName
          }) === self.productDetails().requirements.propertyDetails.ownership[0].partyName()) {
          self.productDetails().requirements.propertyDetails.ownership[0].partyId = owner.applicantId.value;
        }
      });
    };
    self.ownershipTypeChange = function(event) {
      if (event.detail.value === "SINGLE") {
        self.ownershipDefault("SINGLE");
      }
      if (event.detail.value === "JOINT") {
        self.ownershipDefault("JOINT");
        self.populateOwnershipDtoJoint();
      }
    };
    self.populateOwnershipDtoJoint = function() {
      for (var i = 0; i < self.owners().length; i++) {
        if (!self.productDetails().requirements.propertyDetails.ownership[i]) {
          self.productDetails().requirements.propertyDetails.ownership[i] = ko.mapping.toJS(ko.mapping.fromJS(self.productDetails().requirements.propertyDetails.ownership[i - 1]));
          self.productDetails().requirements.propertyDetails.ownership[i].partyName = ko.observable(self.productDetails().requirements.propertyDetails.ownership[i].partyName);
        }
        self.productDetails().requirements.propertyDetails.ownership[i].partyName(rootParams.baseModel.format(self.resource.generic.common.name, {
          firstName: self.owners()[i].personalInfo.firstName,
          lastName: self.owners()[i].personalInfo.lastName
        }));
        self.productDetails().requirements.propertyDetails.ownership[i].partyId = self.owners()[i].applicantId.value;
      }
    };
    var i, j, pairs;
    PropertyInfoModel.fetchTypeOfProperty().done(function(data) {
      self.propertyTypes(data.enumRepresentations[0].data);
      for (i = 0; i < self.propertyTypes().length; i++) {
        pairs = self.propertyTypes()[i].value.split("_");
        for (j = 0; j < pairs.length; j++) {
          pairs[j] = pairs[j].substring(0, 1).toUpperCase() + pairs[j].substring(1).toLowerCase();
        }
        self.propertyTypes()[i].value = pairs.join(" ");
      }
      self.propertyTypesInfoLoaded(true);
    });
    self.fetchSubPropertyType = function() {
      PropertyInfoModel.fetchSubTypeOfProperty(self.productDetails().requirements.propertyDetails.propertyType).done(function(data) {
        self.propertySubTypes(data.enumRepresentations[0].data);
        ko.tasks.runEarly();
        self.showResidenceButtonset(true);
        self.primaryResidentDefault("OPTION_YES");
        self.productDetails().requirements.propertyDetails.isPrimaryResidence = true;
        self.propertySubTypesInfoLoaded(true);
      });
    };
    self.setPrimaryResidence = function(event) {
      if (event.detail.value) {
        if (event.detail.value === "OPTION_NO") {
          self.productDetails().requirements.propertyDetails.isPrimaryResidence = false;
        }
        if (event.detail.value === "OPTION_YES") {
          self.productDetails().requirements.propertyDetails.isPrimaryResidence = true;
        }
      }
    };
    self.savePropertyInfo = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      if (!self.productDetails().requirements.selectedValues) {
        self.productDetails().requirements.selectedValues = getNewKoModel().loanApplicationRequirementDTO.selectedValues;
      }
      self.productDetails().requirements.isSettlementRequired=false;
      self.productDetails().requirements.selectedValues.propertySubTypeName = rootParams.baseModel.getDescriptionFromCode(self.propertySubTypes(), self.productDetails().requirements.propertyDetails.propertySubType, "code", "value");
      self.productDetails().requirements.selectedValues.propertyTypeName = rootParams.baseModel.getDescriptionFromCode(self.propertyTypes(), self.productDetails().requirements.propertyDetails.propertyType, "code", "value");
      PropertyInfoModel.savePropetyInfo(ko.mapping.toJSON(self.productDetails().requirements, {
        "ignore": ["productGroupLinkageType", "name", "displayValue","selectedValues"]
      }), self.productDetails().submissionId.value).done(function() {
        self.productDetails().application().currentApplicationStage.applicantStages[rootParams.index].isComplete(false);
        ko.tasks.runEarly();
        self.productDetails().application().currentApplicationStage.applicantStages[rootParams.index].isComplete(true);
        self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
      });
    };
  };
});
