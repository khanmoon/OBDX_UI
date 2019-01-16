define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "ojL10n!lzn/gamma/resources/nls/origination/vehicle-info",
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
      KoModel.loanApplicationRequirementDTO.vehicleDetails.registrationState = self.selectedState();
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
            self.productDetails().requirements.downpaymentAmount.amount = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.downpaymentAmount.amount));
          }
          if (self.productDetails().requirements.requestedTenure) {
            self.productDetails().requirements.requestedTenure.years = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.requestedTenure.years));
            self.productDetails().requirements.requestedTenure.months = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.requestedTenure.months));
          }
          self.productDetails().requirements.frequency = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.frequency));
        }
        self.productDetails().requirements.vehicleDetails = getNewKoModel().loanApplicationRequirementDTO.vehicleDetails;
        self.productDetails().requirements.vehicleDetails.vehicleType = data.loanApplicationRequirementDTO.vehicleDetails.vehicleType;
        if (data.loanApplicationRequirementDTO.vehicleDetails.vehicleIdentificationNum) {
          self.productDetails().requirements.vehicleDetails.vehicleIdentificationNum(data.loanApplicationRequirementDTO.vehicleDetails.vehicleIdentificationNum);
        }
        self.productDetails().requirements.vehicleDetails.vehicleYear = data.loanApplicationRequirementDTO.vehicleDetails.vehicleYear;
        self.productDetails().requirements.vehicleDetails.vehicleMakeType = data.loanApplicationRequirementDTO.vehicleDetails.vehicleMakeType;
        self.productDetails().requirements.vehicleDetails.vehicleModel = data.loanApplicationRequirementDTO.vehicleDetails.vehicleModel;
        if (data.loanApplicationRequirementDTO.vehicleDetails.registrationState) {
          self.productDetails().requirements.vehicleDetails.registrationState = data.loanApplicationRequirementDTO.vehicleDetails.registrationState;
        } else {
          self.productDetails().requirements.vehicleDetails.registrationState = self.selectedState();
        }
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
      } else {
        if (!self.productDetails().requirements) {
          self.productDetails().requirements = {};
          self.productDetails().requirements = JSON.parse(JSON.stringify(data.loanApplicationRequirementDTO));
          self.productDetails().requirements.requestedTenure = null;
          self.productDetails().requirements.requestedAmount = null;
          if (!data.loanApplicationRequirementDTO.productClass || !data.loanApplicationRequirementDTO.productSubClass) {
            self.productDetails().requirements.productClass = "LOANS";
            self.productDetails().requirements.productSubClass = "AUTOLOANFLL";
          }
        } else {
          var isYearNotPresent = self.productDetails().requirements.requestedTenure && ko.isObservable(self.productDetails().requirements.requestedTenure.years) && !self.productDetails().requirements.requestedTenure.years();
          var isMonthNotPresent = self.productDetails().requirements.requestedTenure && ko.isObservable(self.productDetails().requirements.requestedTenure.months) && !self.productDetails().requirements.requestedTenure.months();
          if (isYearNotPresent && isMonthNotPresent) {
            self.productDetails().requirements.requestedTenure = null;
          }
        }
        self.productDetails().requirements.vehicleDetails = getNewKoModel().loanApplicationRequirementDTO.vehicleDetails;
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
            break;
          }
        }
        ko.tasks.runEarly();
        self.isEstimatePriceLoaded(true);
      }
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
    self.lookupVehicleInfoUsed = function() {
      if (self.productDetails().requirements.vehicleDetails.vehicleIdentificationNum() === "") {
        $("#ERROR_VEHICLENUM").trigger("openModal");

      }
    };
    self.lookupVehicleInfo = function() {
      if (self.productDetails().requirements.vehicleDetails.vehicleIdentificationNum === "") {
        $("#ERROR_VEHICLENUM").trigger("openModal");
        return;
      }
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
      var tracker = document.getElementById("vehicle-tracker");
      if (tracker.valid === "valid") {

        self.productDetails().requirements.vehicleDetails.registrationState = self.productDetails().requirements.vehicleDetails.registrationState ? self.productDetails().requirements.vehicleDetails.registrationState : self.selectedState();
        if (!self.productDetails().requirements.selectedValues) {
          self.productDetails().requirements.selectedValues = getNewKoModel().loanApplicationRequirementDTO.selectedValues;
        }
        self.productDetails().requirements.selectedValues.registrationState = rootParams.baseModel.getDescriptionFromCode(self.registrationStates(), self.productDetails().requirements.vehicleDetails.registrationState);
        self.productDetails().requirements.selectedValues.vehicleMakeType = rootParams.baseModel.getDescriptionFromCode(self.vehicleMake(), self.productDetails().requirements.vehicleDetails.vehicleMakeType);
        if (self.productDetails().requirements.vehicleDetails.distanceTravelled === "") {
          self.productDetails().requirements.vehicleDetails.distanceTravelled = 0;
        }
        if (self.isUsedVehicle() && self.productDetails().requirements.vehicleDetails.vehicleIdentificationNum() === "") {
          self.lookupVehicleInfoUsed();
        } else {
          if(!self.productDetails().requirements.requestedAmount){
          delete self.productDetails().requirements.requestedAmount;
        }
        if(!self.productDetails().requirements.requestedTenure){
         delete self.productDetails().requirements.requestedTenure;
        }
        if(!self.productDetails().requirements.purposeType){
        delete self.productDetails().requirements.purposeType;
        }
        VehicleInfoModel.saveVehicleInfo(ko.mapping.toJSON(self.productDetails().requirements, {"ignore": ["selectedValues","purpose"]}), self.productDetails().submissionId.value).done(function() {
            self.productDetails().application().currentApplicationStage.applicantStages[rootParams.index].isComplete(false);
            ko.tasks.runEarly();
            self.productDetails().application().currentApplicationStage.applicantStages[rootParams.index].isComplete(true);
            self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
          });
        }

      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }

    };
  };
});
