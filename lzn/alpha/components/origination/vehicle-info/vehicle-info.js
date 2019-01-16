define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "ojL10n!lzn/alpha/resources/nls/origination/vehicle-info",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset"
], function(oj, ko, $, VehicleInfoModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.validationTracker = ko.observable();
    self.vehicleTypeLoaded = ko.observable(false);
    self.vehicleMakeLoaded = ko.observable(false);
    self.showResidenceButtonset = ko.observable(false);
    self.ownershipDefault = ko.observable("SINGLE");
    self.vehicleDefault = ko.observable("NEW");
    self.vehicleInfoDataLoaded = ko.observable(false);
    self.isVehicleLoaded = ko.observable(true);
    self.vehicleModelLoaded = ko.observable(false);
    self.vehicleModelLookupLoaded = ko.observable(false);
    self.disableInputs = ko.observable(false);
    self.collateralCategory = ko.observable([]);
    self.vehicleMake = ko.observable([]);
    self.owners = ko.observable([]);
    self.ownerListLoaded = ko.observable(false);
    self.lookupLoaded = ko.observable(true);
    self.IslookupLoaded = ko.observable(true);
    self.otherModelLoaded = ko.observable(false);
    self.IsOwnerList = ko.observable(true);
    self.vehicleType = ko.observable([]);
    self.vehicleModels = ko.observableArray();
    self.estimatedPriceModel = ko.observable([]);
    self.isEstimatePriceLoaded = ko.observable(true);
    self.vehicleCategory = ko.observable();
    self.isUsedVehicle = ko.observable(false);
    self.vehicleCategoryLoaded = ko.observable(false);
    self.optionVehicleYears = ko.observableArray([]);
    rootParams.baseModel.registerElement("address-input");
    rootParams.baseModel.registerElement("amount-input");
    self.validateMileage = ko.pureComputed(function() {
      return [{
        type: "regExp",
        options: {
          pattern: "[0-9]*",
          messageDetail: self.resource.messages.mileage
        }
      }, {
        type: "numberRange",
        options: {
          min: 1,
          max: 125000
        }
      }];
    });
    var getNewKoModel = function() {
      var KoModel = VehicleInfoModel.getNewModel(self.productDetails().currency);
      KoModel.loanApplicationRequirementDTO.vehicleDetails.purchasePrice.amount = ko.observable(KoModel.loanApplicationRequirementDTO.vehicleDetails.purchasePrice.amount);
      KoModel.loanApplicationRequirementDTO.vehicleDetails.ownership[0].partyName = ko.observable(KoModel.loanApplicationRequirementDTO.vehicleDetails.ownership[0].partyName);
      return KoModel;
    };
    VehicleInfoModel.fetchVehicleInfo(self.productDetails().submissionId.value).done(function(data) {
      self.productDetails().requirements.applicantId = data.loanApplicationRequirementDTO.applicantId;
      self.productDetails().requirements.facilityId = data.loanApplicationRequirementDTO.facilityId;
      if (data.loanApplicationRequirementDTO.vehicleDetails && data.loanApplicationRequirementDTO.vehicleDetails.address) {
        self.productDetails().requirements.vehicleDetails.address = data.loanApplicationRequirementDTO.vehicleDetails.address;
        self.productDetails().requirements.state = data.loanApplicationRequirementDTO.vehicleDetails.address.state;
        self.productDetails().requirements.vehicleDetails.isVehicleNew = data.loanApplicationRequirementDTO.vehicleDetails.isVehicleNew;
        if (self.productDetails().requirements.vehicleDetails.isVehicleNew) {
          self.vehicleDefault("NEW");
          self.isUsedVehicle(false);
        } else {
          self.vehicleDefault("USED");
          self.isUsedVehicle(true);
        }
        self.productDetails().requirements.vehicleDetails.purchasePrice = data.loanApplicationRequirementDTO.vehicleDetails.purchasePrice;
        self.productDetails().requirements.vehicleDetails.purchasePrice.amount = ko.observable(data.loanApplicationRequirementDTO.vehicleDetails.purchasePrice.amount > 0 ? data.loanApplicationRequirementDTO.vehicleDetails.purchasePrice.amount : "");
        self.productDetails().requirements.vehicleDetails.purchasePrice.currency = data.loanApplicationRequirementDTO.vehicleDetails.purchasePrice.currency;
        self.productDetails().requirements.vehicleDetails.collateralId = data.loanApplicationRequirementDTO.vehicleDetails.collateralId;
        for (var i = 0; i < data.loanApplicationRequirementDTO.vehicleDetails.ownership.length; i++) {
          self.productDetails().requirements.vehicleDetails.ownership[i].partyName = ko.observable(data.loanApplicationRequirementDTO.vehicleDetails.ownership[i].partyName);
        }
        if (self.productDetails().requirements.vehicleDetails.purchasePrice.positive) {
          self.productDetails().requirements.vehicleDetails.purchasePrice.positive = null;
          self.productDetails().requirements.vehicleDetails.purchasePrice.negative = null;
          self.productDetails().requirements.vehicleDetails.purchasePrice.zero = null;
        }
        self.vehicleModelLookupLoaded(true);
      } else {
        self.productDetails().requirements.vehicleDetails = getNewKoModel().loanApplicationRequirementDTO.vehicleDetails;
      }
      VehicleInfoModel.getApplicant(self.productDetails().submissionId.value).done(function(data) {
        self.ownerListLoaded(true);
        self.owners(data.applicants);
        if (self.owners().length === 1) {
          self.productDetails().requirements.vehicleDetails.ownership[0].partyName(rootParams.baseModel.format(self.resource.generic.common.name, {
            firstName: data.applicants[0].personalInfo.firstName,
            lastName: data.applicants[0].personalInfo.lastName
          }));
          self.productDetails().requirements.vehicleDetails.ownership[0].partyId = data.applicants[0].applicantId.value;
        }
        if (self.productDetails().requirements.vehicleDetails.ownership.length > 1) {
          self.ownershipDefault("JOINT");
          self.populateOwnershipDtoJoint();
        }
        self.vehicleInfoDataLoaded(true);
      });
    });
    self.ownersChangeHandler = function() {
      self.productDetails().requirements.vehicleDetails.ownership[0].partyName(self.productDetails().requirements.vehicleDetails.ownership[0].partyName());
      ko.utils.arrayForEach(self.owners(), function(owner) {
        if (rootParams.baseModel.format(self.resource.generic.common.name, {
            firstName: owner.personalInfo.firstName,
            lastName: owner.personalInfo.lastName
          }) === self.productDetails().requirements.vehicleDetails.ownership[0].partyName()) {
          self.productDetails().requirements.vehicleDetails.ownership[0].partyId = owner.applicantId;
        }
      });
    };
    VehicleInfoModel.fetchCollateralCategory().done(function(data) {
      self.collateralCategory(data.enumRepresentations[0].data);
      self.vehicleCategory(self.collateralCategory()[1].code);
      self.vehicleCategoryLoaded(true);
      VehicleInfoModel.fetchVehicleType(self.productDetails().submissionId.value, self.vehicleCategory()).done(function(data) {
        self.vehicleType(data.vehicleSubTypes);
        self.vehicleTypeLoaded(true);
      });
    });
    VehicleInfoModel.fetchVehicleMake().done(function(data) {
      self.vehicleMake(data.enumRepresentations[0].data);
      self.vehicleMakeLoaded(true);
    });
    var i;
    var today = rootParams.baseModel.getDate();
    for (i = 0; i <= 10; i++) {
      self.optionVehicleYears.push({
        label: today.getFullYear() - i,
        value: today.getFullYear() - i
      });
    }
    self.vehicleMakeChanged = function(event) {
      if (event.detail.value) {
        if (event.detail.value.toUpperCase() !== "OTHERS") {

          VehicleInfoModel.fetchVehicleModel(self.productDetails().submissionId.value, self.productDetails().requirements.vehicleDetails.vehicleSubType[0], event.detail.value).done(function(data) {
            self.vehicleModels([]);
            self.estimatedPriceModel(data.vehicleModels);
            for (var index = 0; index < data.vehicleModels.length; index++) {
              self.vehicleModels().push({
                key: data.vehicleModels[index].vehicleModel,
                description: data.vehicleModels[index].vehicleModel
              });
            }
            self.vehicleModelLoaded(false);
            self.vehicleModelLookupLoaded(false);
            self.productDetails().requirements.vehicleDetails.purchasePrice.amount("");
            ko.tasks.runEarly();
            self.productDetails().requirements.vehicleDetails.vehicleModel = "";
            self.vehicleModelLoaded(true);
          });
        } else {
          self.productDetails().requirements.vehicleDetails.vehicleModel = "";
          self.otherModelLoaded(true);
        }
      }
    };
    self.vehicleModelChanged = function(event) {
      if (event.detail.value) {
        if (event.detail.value.toUpperCase() === "OTHERS") {

          self.productDetails().requirements.vehicleDetails.vehicleModel = "";
          self.otherModelLoaded(true);
        } else {

          self.otherModelLoaded(false);
        }
        self.vehicleModelLookupLoaded(false);
        self.isEstimatePriceLoaded(false);
        for (var index = 0; index < self.estimatedPriceModel().length; index++) {
          if (event.detail.value === self.estimatedPriceModel()[index].vehicleModel) {
            self.productDetails().requirements.vehicleDetails.purchasePrice.amount = ko.observable(self.estimatedPriceModel()[index].purchasePrice.amount > 0 ? self.estimatedPriceModel()[index].purchasePrice.amount : "");
            self.productDetails().requirements.vehicleDetails.purchasePrice.currency = self.estimatedPriceModel()[index].purchasePrice.currency;
            break;
          }
        }
        ko.tasks.runEarly();
        self.isEstimatePriceLoaded(true);
      }
    };
    self.changeVehicleType = function(event) {

      if (event.detail.value === "NEW") {
        self.isVehicleLoaded(false);
        self.productDetails().requirements.vehicleDetails.isVehicleNew = true;
        self.productDetails().requirements.vehicleDetails.vehicleSubType = "";
        self.productDetails().requirements.vehicleDetails.vehicleIdentificationNum = "";
        self.productDetails().requirements.vehicleDetails.vehicleMakeType = "";
        self.productDetails().requirements.vehicleDetails.vehicleYear = "";
        self.productDetails().requirements.vehicleDetails.purchasePrice.amount("");
        self.productDetails().requirements.vehicleDetails.vehicleModel = "";
        self.productDetails().requirements.vehicleDetails.distanceTravelled = "";
        self.vehicleModelLookupLoaded(false);
        self.vehicleModelLoaded(false);
        self.otherModelLoaded(false);
        ko.tasks.runEarly();
        self.isUsedVehicle(false);
        self.isVehicleLoaded(true);
      }
      if (event.detail.value === "USED") {
        self.isVehicleLoaded(false);
        self.productDetails().requirements.vehicleDetails.isVehicleNew = false;
        self.productDetails().requirements.vehicleDetails.vehicleSubType = "";
        self.productDetails().requirements.vehicleDetails.vehicleIdentificationNum = "";
        self.productDetails().requirements.vehicleDetails.vehicleMakeType = "";
        self.productDetails().requirements.vehicleDetails.vehicleYear = "";
        self.productDetails().requirements.vehicleDetails.purchasePrice.amount("");
        self.productDetails().requirements.vehicleDetails.vehicleModel = "";
        self.productDetails().requirements.vehicleDetails.distanceTravelled = "";
        self.vehicleModelLookupLoaded(false);
        self.vehicleModelLoaded(false);
        self.otherModelLoaded(false);
        ko.tasks.runEarly();
        self.isUsedVehicle(true);
        self.isVehicleLoaded(true);
      }

    };
    self.changeOwnership = function(event) {
      if (event.detail.value) {
        if (event.detail.value === "SINGLE") {
          self.ownershipDefault("SINGLE");
        }
        if (event.detail.value === "JOINT") {
          self.ownershipDefault("JOINT");
          self.populateOwnershipDtoJoint();
        }
      }
    };
    self.populateOwnershipDtoJoint = function() {
      for (i = 0; i < self.owners().length; i++) {
        if (!self.productDetails().requirements.vehicleDetails.ownership[i]) {
          self.productDetails().requirements.vehicleDetails.ownership[i] = ko.mapping.toJS(ko.mapping.fromJS(self.productDetails().requirements.vehicleDetails.ownership[i - 1]));
          self.productDetails().requirements.vehicleDetails.ownership[i].partyName = ko.observable(self.productDetails().requirements.vehicleDetails.ownership[i].partyName);
        }
        self.productDetails().requirements.vehicleDetails.ownership[i].partyName(rootParams.baseModel.format(self.resource.generic.common.name, {
          firstName: self.owners()[i].personalInfo.firstName,
          lastName: self.owners()[i].personalInfo.lastName
        }));
        self.productDetails().requirements.vehicleDetails.ownership[i].partyId = self.owners()[i].applicantId;
      }
    };
    self.lookupVehicleInfo = function() {
      if (self.productDetails().requirements.vehicleDetails.vehicleIdentificationNum === "") {
        $("#ERROR_VEHICLENUM").trigger("openModal");
        return;
      }

      VehicleInfoModel.lookupVehicleInfo(self.productDetails().submissionId.value, self.productDetails().requirements.vehicleDetails.vehicleIdentificationNum, self.productDetails().requirements.vehicleDetails.vehicleSubType, self.productDetails().requirements.vehicleDetails.vehicleMakeType, self.productDetails().requirements.vehicleDetails.vehicleModel).done(function(data) {
        self.lookupLoaded(false);
        if (data.lookupVehicles && data.lookupVehicles[0]) {
          self.productDetails().requirements.vehicleDetails.vehicleMakeType = data.lookupVehicles[0].vehicleMakeType;
          self.productDetails().requirements.vehicleDetails.vehicleYear = data.lookupVehicles[0].vehicleYear;
          self.productDetails().requirements.vehicleDetails.vehicleModel = data.lookupVehicles[0].vehicleModel;
          self.productDetails().requirements.vehicleDetails.purchasePrice.amount = ko.observable(data.lookupVehicles[0].purchasePrice.amount > 0 ? data.lookupVehicles[0].purchasePrice.amount : "");
          self.productDetails().requirements.vehicleDetails.purchasePrice.currency = data.lookupVehicles[0].purchasePrice.currency;
          self.productDetails().requirements.vehicleDetails.distanceTravelled = data.lookupVehicles[0].distanceTravelled;
          self.vehicleModelLookupLoaded(false);
          ko.tasks.runEarly();
          self.vehicleModelLookupLoaded(true);
          self.lookupLoaded(true);
        }
      });
    };
    self.saveVehicleInfo = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      self.productDetails().requirements.vehicleDetails.address.state = self.productDetails().requirements.state;

      if (!self.productDetails().requirements.selectedValues) {
        self.productDetails().requirements.selectedValues = getNewKoModel().loanApplicationRequirementDTO.selectedValues;
      }
      self.productDetails().requirements.selectedValues.vehicleMakeType = rootParams.baseModel.getDescriptionFromCode(self.vehicleMake(), self.productDetails().requirements.vehicleDetails.vehicleMakeType);
      self.productDetails().requirements.selectedValues.vehicleSubType = rootParams.baseModel.getDescriptionFromCode(self.vehicleType(), self.productDetails().requirements.vehicleDetails.vehicleSubType, "vehicleSubTypeCode", "vehicleSubTypeDescription");
      if (self.productDetails().requirements.vehicleDetails.purchasePrice.positive) {
        self.productDetails().requirements.vehicleDetails.purchasePrice.positive = null;
        self.productDetails().requirements.vehicleDetails.purchasePrice.negative = null;
        self.productDetails().requirements.vehicleDetails.purchasePrice.zero = null;
      }
      self.productDetails().requirements.isSettlementRequired = false;
      if (self.productDetails().requirements.vehicleDetails.distanceTravelled === "") {
        self.productDetails().requirements.vehicleDetails.distanceTravelled = 0;
      }
      VehicleInfoModel.saveVehicleInfo(ko.mapping.toJSON(self.productDetails().requirements, {
        "ignore": ["selectedValues"]
      }), self.productDetails().submissionId.value).done(function() {
        self.productDetails().application().currentApplicationStage.applicantStages[rootParams.index].isComplete(false);
        ko.tasks.runEarly();
        self.productDetails().application().currentApplicationStage.applicantStages[rootParams.index].isComplete(true);
        self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
      });
    };
  };
});
