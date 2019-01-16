define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/origination/vehicle-info",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, VehicleInfoModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.groupValid = ko.observable();
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
    self.registrationStates = ko.observableArray([]);
    self.registrationStatesLoaded = ko.observable(false);
    self.yearPolicy = "";
    self.mileagePolicy = "";
    rootParams.baseModel.registerElement("address-input");
    rootParams.baseModel.registerElement("amount-input");
    var getNewKoModel = function() {
      var KoModel = VehicleInfoModel.getNewModel(rootParams.baseModel.getLocaleValue("localCurrency"));
      KoModel.loanApplicationRequirementDTO.vehicleDetails.vehicleIdentificationNum = ko.observable(KoModel.loanApplicationRequirementDTO.vehicleDetails.vehicleIdentificationNum);
      return KoModel;
    };
    VehicleInfoModel.fetchVehicleInfo(self.productDetails().submissionId.value).done(function(data) {
      if (data.loanApplicationRequirementDTO.vehicleDetails) {
        if (!self.productDetails().requirements) {
          self.productDetails().requirements = {};
          self.productDetails().requirements = JSON.parse(JSON.stringify(data.loanApplicationRequirementDTO));
          if (self.productDetails().requirements.requestedAmount) {
            self.productDetails().requirements.requestedAmount.amount = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.requestedAmount.amount));
          }
          if (self.productDetails().requirements.purchasePrice) {
            self.productDetails().requirements.purchasePrice.amount = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.purchasePrice.amount));
          }
          if (self.productDetails().requirements.downpaymentAmount) {
            if (!ko.isObservable(self.productDetails().requirements.downpaymentAmount.amount)) {
              self.productDetails().requirements.downpaymentAmount.amount = ko.observable();
            }
            self.productDetails().requirements.downpaymentAmount.amount(ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.downpaymentAmount.amount)));
          }
          if (self.productDetails().requirements.requestedTenure) {
            self.productDetails().requirements.requestedTenure.years = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.requestedTenure.years));
            self.productDetails().requirements.requestedTenure.months = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.requestedTenure.months));
          }
          self.productDetails().requirements.frequency = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.frequency));
        } else {
          if (!self.productDetails().requirements.purchasePrice && self.productDetails().productType === "AUTOMOBILE") {
            self.productDetails().requirements.purchasePrice = {};
            self.productDetails().requirements.purchasePrice.amount = ko.observable();
            self.productDetails().requirements.purchasePrice.currency = rootParams.baseModel.getLocaleValue("localCurrency");
          }
          if (!self.productDetails().requirements.downpaymentAmount && self.productDetails().productType === "AUTOMOBILE") {
            self.productDetails().requirements.downpaymentAmount = {};
            self.productDetails().requirements.downpaymentAmount.amount = ko.observable();
            self.productDetails().requirements.downpaymentAmount.currency = rootParams.baseModel.getLocaleValue("localCurrency");
          }
        }
        self.productDetails().requirements.vehicleDetails = getNewKoModel().loanApplicationRequirementDTO.vehicleDetails;
        self.productDetails().requirements.vehicleDetails.vehicleType = data.loanApplicationRequirementDTO.vehicleDetails.vehicleType;
        if (data.loanApplicationRequirementDTO.vehicleDetails.vehicleIdentificationNum) {
          self.productDetails().requirements.vehicleDetails.vehicleIdentificationNum(data.loanApplicationRequirementDTO.vehicleDetails.vehicleIdentificationNum);
        }
        self.productDetails().requirements.vehicleDetails.vehicleYear = data.loanApplicationRequirementDTO.vehicleDetails.vehicleYear;
        self.productDetails().requirements.vehicleDetails.vehicleMakeType = data.loanApplicationRequirementDTO.vehicleDetails.vehicleMakeType;
        self.productDetails().requirements.vehicleDetails.vehicleModel = data.loanApplicationRequirementDTO.vehicleDetails.vehicleModel;
        if (data.loanApplicationRequirementDTO.vehicleDetails.distanceTravelled) {
          self.productDetails().requirements.vehicleDetails.distanceTravelled = data.loanApplicationRequirementDTO.vehicleDetails.distanceTravelled;
        }
        self.productDetails().requirements.vehicleDetails.isVehicleNew = data.loanApplicationRequirementDTO.vehicleDetails.isVehicleNew;
        if (self.productDetails().requirements.vehicleDetails.isVehicleNew) {
          self.vehicleDefault("NEW");
          self.isUsedVehicle(false);
        } else {
          self.vehicleDefault("USED");
          self.isUsedVehicle(true);
        }
        self.productDetails().requirements.vehicleDetails.collateralId = data.loanApplicationRequirementDTO.vehicleDetails.collateralId;
        self.vehicleModelLookupLoaded(true);
        if (data.loanApplicationRequirementDTO.downpaymentAmount && data.loanApplicationRequirementDTO.downpaymentAmount.amount) {
          self.productDetails().requirements.downpaymentAmount.amount(data.loanApplicationRequirementDTO.downpaymentAmount.amount);
        }
        if (data.loanApplicationRequirementDTO.purchasePrice) {
          self.productDetails().requirements.purchasePrice.amount(data.loanApplicationRequirementDTO.purchasePrice.amount);
        }
      } else {
        if (!self.productDetails().requirements) {
          self.productDetails().requirements = {};
          self.productDetails().requirements = JSON.parse(JSON.stringify(data.loanApplicationRequirementDTO));
          self.productDetails().requirements.requestedTenure = null;
          self.productDetails().requirements.requestedAmount = null;
        } else {
          var isYearNotPresent = self.productDetails().requirements.requestedTenure && ko.isObservable(self.productDetails().requirements.requestedTenure.years) && !self.productDetails().requirements.requestedTenure.years();
          var isMonthNotPresent = self.productDetails().requirements.requestedTenure && ko.isObservable(self.productDetails().requirements.requestedTenure.months) && !self.productDetails().requirements.requestedTenure.months();
          if (isYearNotPresent && isMonthNotPresent) {
            self.productDetails().requirements.requestedTenure = null;
          }
        }
        self.productDetails().requirements.vehicleDetails = getNewKoModel().loanApplicationRequirementDTO.vehicleDetails;
        self.productDetails().requirements.frequency = "MONTHLY";
      }
      self.productDetails().requirements.productClass = data.loanApplicationRequirementDTO.productClass || "LOANS";
      self.productDetails().requirements.productSubClass = data.loanApplicationRequirementDTO.productSubClass || "AUTOMOBILE";
      self.productDetails().requirements.noOfCoApplicants = 0;
      if (data.loanApplicationRequirementDTO.offerId) {
        self.productDetails().requirements.offerId = data.loanApplicationRequirementDTO.offerId;
      }
      VehicleInfoModel.getApplicant(self.productDetails().submissionId.value).done(function(data) {
        self.ownerListLoaded(true);
        self.owners(data.applicants);
        VehicleInfoModel.fetchVehiclePolicy(self.productDetails().submissionId.value).done(function(data) {
          self.yearPolicy = data.vehicleYearLimit;
          self.mileagePolicy = data.vehicleMileageLimit;
          self.vehicleInfoDataLoaded(true);
        });
      });
    });
    VehicleInfoModel.fetchVehicleMake().done(function(data) {
      self.vehicleMake(data.enumRepresentations[0].data);
      self.vehicleMakeLoaded(true);
    });
    VehicleInfoModel.fetchStates("US").done(function(data) {
      self.registrationStates(data.enumRepresentations[0].data);
      self.registrationStatesLoaded(true);
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
          self.productDetails().requirements.vehicleDetails.vehicleModel = self.productDetails().requirements.vehicleDetails.vehicleModel;
          VehicleInfoModel.fetchVehicleModel(self.productDetails().submissionId.value, "CAR", event.detail.value).done(function(data) {
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
      if (event.detail.value.toUpperCase() === "OTHERS") {
        self.productDetails().requirements.vehicleDetails.vehicleModel = self.productDetails().requirements.vehicleDetails.vehicleModel;
        self.productDetails().requirements.vehicleDetails.vehicleModel = "";
        self.otherModelLoaded(true);
      } else {
        self.productDetails().requirements.vehicleDetails.vehicleModel = self.productDetails().requirements.vehicleDetails.vehicleModel;
        self.otherModelLoaded(false);
      }
      self.vehicleModelLookupLoaded(false);
      self.isEstimatePriceLoaded(false);
      for (var index = 0; index < self.estimatedPriceModel().length; index++) {
        if (event.detail.value === self.estimatedPriceModel()[index].vehicleModel) {
          break;
        }
      }
      ko.tasks.runEarly();
      self.isEstimatePriceLoaded(true);
    };
    self.changeVehicleType = function(event) {
      if (event.detail.value) {
        if (event.detail.value === "NEW") {
          self.isVehicleLoaded(false);
          self.productDetails().requirements.vehicleDetails.isVehicleNew = true;
          self.productDetails().requirements.vehicleDetails.vehicleIdentificationNum("");
          self.productDetails().requirements.vehicleDetails.vehicleMakeType = "";
          self.productDetails().requirements.vehicleDetails.vehicleYear = "";
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
          self.productDetails().requirements.vehicleDetails.vehicleIdentificationNum("");
          self.productDetails().requirements.vehicleDetails.vehicleMakeType = "";
          self.productDetails().requirements.vehicleDetails.vehicleYear = "";
          self.productDetails().requirements.vehicleDetails.vehicleModel = "";
          self.productDetails().requirements.vehicleDetails.distanceTravelled = "";
          self.vehicleModelLookupLoaded(false);
          self.vehicleModelLoaded(false);
          self.otherModelLoaded(false);
          ko.tasks.runEarly();
          self.isUsedVehicle(true);
          self.isVehicleLoaded(true);
        }
      }
    };
    self.lookupVehicleInfo = function() {
      if (self.productDetails().requirements.vehicleDetails.vehicleIdentificationNum === "") {
        $("#ERROR_VEHICLENUM").trigger("openModal");
        return;
      }
      self.productDetails().requirements.vehicleDetails.vehicleMakeType = self.productDetails().requirements.vehicleDetails.vehicleMakeType;
      self.productDetails().requirements.vehicleDetails.vehicleYear = self.productDetails().requirements.vehicleDetails.vehicleYear;
      self.productDetails().requirements.vehicleDetails.vehicleModel = self.productDetails().requirements.vehicleDetails.vehicleModel;
      VehicleInfoModel.lookupVehicleInfo(self.productDetails().submissionId.value, self.productDetails().requirements.vehicleDetails.vehicleIdentificationNum(), self.productDetails().requirements.vehicleDetails.vehicleSubType, self.productDetails().requirements.vehicleDetails.vehicleMakeType, self.productDetails().requirements.vehicleDetails.vehicleModel).done(function(data) {
        self.lookupLoaded(false);
        if (data.lookupVehicles && data.lookupVehicles[0]) {
          self.productDetails().requirements.vehicleDetails.vehicleMakeType = data.lookupVehicles[0].vehicleMakeType;
          self.productDetails().requirements.vehicleDetails.vehicleYear = data.lookupVehicles[0].vehicleYear;
          self.productDetails().requirements.vehicleDetails.vehicleModel = data.lookupVehicles[0].vehicleModel;
          self.productDetails().requirements.vehicleDetails.distanceTravelled = data.lookupVehicles[0].vehicleMileage;
          self.vehicleModelLookupLoaded(false);
          ko.tasks.runEarly();
          self.vehicleModelLookupLoaded(true);
          self.lookupLoaded(true);
        }
      });
    };
    self.saveVehicleInfo = function() {
      var vehicleInfoTracker = document.getElementById("vehicleInfoTracker");
      if (vehicleInfoTracker.valid === "valid") {
        self.productDetails().requirements.vehicleDetails.vehicleMakeType = self.productDetails().requirements.vehicleDetails.vehicleMakeType;
        self.productDetails().requirements.vehicleDetails.vehicleYear = self.productDetails().requirements.vehicleDetails.vehicleYear;
        self.productDetails().requirements.vehicleDetails.vehicleModel = self.productDetails().requirements.vehicleDetails.vehicleModel;
        if (!self.productDetails().requirements.selectedValues) {
          self.productDetails().requirements.selectedValues = getNewKoModel().loanApplicationRequirementDTO.selectedValues;
        }
        if (self.productDetails().requirements.requestedTenure) {
          self.productDetails().requirements.requestedTenure.years(self.productDetails().requirements.requestedTenure.years());
          self.productDetails().requirements.requestedTenure.months(self.productDetails().requirements.requestedTenure.months());
        }
        self.productDetails().requirements.selectedValues.registrationState = rootParams.baseModel.getDescriptionFromCode(self.registrationStates(), self.productDetails().requirements.vehicleDetails.registrationState);
        self.productDetails().requirements.selectedValues.vehicleMakeType = rootParams.baseModel.getDescriptionFromCode(self.vehicleMake(), self.productDetails().requirements.vehicleDetails.vehicleMakeType);
        if (self.productDetails().requirements.vehicleDetails.distanceTravelled === "") {
          self.productDetails().requirements.vehicleDetails.distanceTravelled = 0;
        }
        VehicleInfoModel.saveVehicleInfo(ko.mapping.toJSON(self.productDetails().requirements, {
          "ignore": ["temp_selectedValues", "distanceTravelled", "registrationState", "selectedValues", "displayValue", "value"]
        }), self.productDetails().submissionId.value).done(function() {
          self.isVehicleDetailsSubmitted(true);
          self.vehicleDetails(JSON.parse(ko.toJSON(self.productDetails().requirements.vehicleDetails)));
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
        });
      } else {
        vehicleInfoTracker.showMessages();
        vehicleInfoTracker.focusOn("@firstInvalidShown");
      }
    };
  };
});
