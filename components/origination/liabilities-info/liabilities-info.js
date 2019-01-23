define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!resources/nls/liabilities-info",
  "framework/js/constants/constants",
  "ojs/ojinputnumber",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, LiabilitiesInfoModelObject, BaseLogger, resourceBundle, Constants) {
  "use strict";
  return function(rootParams) {
    var self = this,
      LiabilitiesInfoModel = new LiabilitiesInfoModelObject(),
      i = 0,
      getNewKoModel = function(model) {
        var KoModel = LiabilitiesInfoModel.getNewModel(model);
        KoModel.type = ko.observable(KoModel.type);
        KoModel.original.amount = ko.observable(KoModel.original.amount);
        KoModel.original.currency = self.localCurrency;
        KoModel.outstanding.amount = ko.observable(KoModel.outstanding.amount);
        KoModel.outstanding.currency = self.localCurrency;
        KoModel.temp_isActive = ko.observable(KoModel.temp_isActive);
        KoModel.temp_selectedValues = ko.observable(KoModel.temp_selectedValues);
        return KoModel;
      },
      transformFetchedData = function(data) {
        var tempLiabilityList;
        tempLiabilityList = ko.utils.arrayFilter(data.liabilityDetails, function(liability) {
          if (rootParams.baseModel.getDescriptionFromCode(self.liabilityOptions(), liability.type) !== "") {
            return liability;
          }
        });
        for (i = 0; i < tempLiabilityList.length; i++) {
          tempLiabilityList[i].type = ko.observable(tempLiabilityList[i].type);
          tempLiabilityList[i].original.amount = ko.observable(tempLiabilityList[i].original.amount);
          tempLiabilityList[i].outstanding.amount = ko.observable(tempLiabilityList[i].outstanding.amount);
          tempLiabilityList[i].temp_isActive = ko.observable(false);
          tempLiabilityList[i].temp_selectedValues = ko.observable({
            type: rootParams.baseModel.getDescriptionFromCode(self.liabilityOptions(), tempLiabilityList[i].type())
          });
          tempLiabilityList[i].temp_selectedValues().repaymentFrequency = rootParams.baseModel.getDescriptionFromCode(self.frequencyOptions(), tempLiabilityList[i].repaymentFrequency);
        }
        return tempLiabilityList;
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.groupValid = ko.observable();
    self.host = Constants.host;
    self.displayFinalSubmit = ko.observable(true);
    self.frequencyOptions = ko.observableArray([]);
    self.frequencyOptionsLoaded = ko.observable(false);
    self.maximumLiabilitiesAllowed = 5;
    if (self.applicantType === "PRIMARY") {
      self.applicantObject = ko.observable(rootParams.applicantObject);
    } else if (self.applicantType === "JOINT") {
      self.applicantObject = rootParams.applicantObject()[self.coAppCurrentIndex - 1];
      self.employmentProfileId(rootParams.empProfileIds()[0]);
    }
    self.isNotFromReview = ko.observable(true);
    var payloadEmployments = {
      status: "",
      employerName: "",
      isPrimary: true
    };
    var empDTOs = [];
    empDTOs.push(payloadEmployments);
    var arraypayload = {
      employmentDTOs: empDTOs
    };
    self.liabilityOptionsLoaded = ko.observable(false);
    self.liabilityOptions = ko.observableArray([]);
    self.existingLiabilititesLoaded = ko.observable(false);
    self.validationTracker = ko.observable();
    rootParams.baseModel.registerElement("amount-input");
    if (!self.applicantObject().liabilitiesInfo) {
      self.applicantObject().liabilitiesInfo = {
        liabilitiesList: ko.observableArray([])
      };
    }
    self.initializeModel = function() {
      LiabilitiesInfoModel.fetchEmployments(self.productDetails().submissionId.value, self.applicantObject().applicantId().value).done(function(data) {
        if (data.employmentProfiles && !$.isEmptyObject(data.employmentProfiles)) {
          var profileId = null;
          for (var i = 0; i < data.employmentProfiles.length; i++) {
            if (data.employmentProfiles[i].isPrimary) {
              profileId = data.employmentProfiles[i].id;
              break;
            }
          }
          self.employmentProfileId = profileId;
          LiabilitiesInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, profileId);
          self.applicantObject().profileId = profileId;
          self.fetchOtherdetails();
        } else {
          LiabilitiesInfoModel.saveEmployments(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, ko.toJSON(arraypayload)).done(function(data) {
            if (data.employmentProfiles && data.employmentProfiles[0]) {
              self.employmentProfileId = data.employmentProfiles[0].id;
              LiabilitiesInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, data.employmentProfiles[0].id);
              self.applicantObject().profileId = data.employmentProfiles[0].id;
              self.fetchOtherdetails();
            }
          });
        }
      });
    };
    self.initializeModel();
    self.fetchOtherdetails = function() {
      LiabilitiesInfoModel.getRepaymentFrequency().then(function(data) {
        if (data.enumRepresentations[0]) {
          self.frequencyOptions(data.enumRepresentations[0].data);
        }
        self.frequencyOptionsLoaded(true);
        LiabilitiesInfoModel.getLiabilitiesList(self.productDetails().productType).then(function(data) {
          if (data.financialLiabilityType) {
            self.liabilityOptions(data.financialLiabilityType);
          }
          self.liabilityOptionsLoaded(true);
          LiabilitiesInfoModel.getExistingLiabilities().then(function(data) {
            if (!self.applicantObject().newApplicant) {
              var showComplete = false;
              if (self.checkDataAvailability(data.liabilityDetails, rootParams.applicantStages.id)) {
                showComplete = true;
              }
              self.showIcon(showComplete, rootParams.applicantStages);
            }
            self.applicantObject().liabilitiesInfo.liabilitiesList(transformFetchedData(data));
            self.existingLiabilititesLoaded(true);
          });
        });
      });
    };
    self.addLiability = function(index, data) {
      if (self.applicantObject().liabilitiesInfo.liabilitiesList().length < self.maximumLiabilitiesAllowed) {
        data.liabilitiesList.push(getNewKoModel());
        self.displayFinalSubmit(false);
      } else {
        $("#limitExceededLiability").trigger("openModal");
      }
    };
    self.deleteLiability = function(index, data, current) {
      if (current.id && current.id) {
        LiabilitiesInfoModel.deleteModel(current.id);
      }
      data.liabilitiesList().splice(index, 1);
      data.liabilitiesList(data.liabilitiesList());
      self.displayFinalSubmit(true);
    };
    self.editLiabilityInfo = function(data, currentLiability) {
      for (i = 0; i < data.liabilitiesList().length; i++) {
        if (data.liabilitiesList()[i].temp_isActive()) {
          return;
        }
      }
      self.displayFinalSubmit(false);
      currentLiability.temp_isActive(true);
    };
    self.displayAddLiabilityButton = function(data) {
      for (i = 0; i < data.liabilitiesList().length; i++) {
        if (data.liabilitiesList()[i].temp_isActive()) {
          return false;
        }
      }
      return true;
    };
    self.completeLiabilitiesSection = function() {
      self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
    };
    self.submitLiabilityInfo = function(event, data) {
      var liabilityInfoTracker = document.getElementById("liabilityInfoTracker");
      if (liabilityInfoTracker.valid === "valid") {
        if (parseInt(data.outstanding.amount(), 10) > parseInt(data.original.amount(), 10)) {
          $("#ERROR_LIABLILITY").trigger("openModal");
          return;
        }
        data.type = ko.utils.unwrapObservable(data.type);
        data.repaymentFrequency = ko.utils.unwrapObservable(data.repaymentFrequency);
        data.finacialParameterDescription = rootParams.baseModel.getDescriptionFromCode(self.liabilityOptions(), ko.utils.unwrapObservable(data.type));
        LiabilitiesInfoModel.saveModel(rootParams.baseModel.removeTempAttributes({
          profileId: self.applicantObject().profileId,
          liabilityDetails: data
        })).then(function(data) {
          for (i = 0; i < self.applicantObject().liabilitiesInfo.liabilitiesList().length; i++) {
            if (self.applicantObject().liabilitiesInfo.liabilitiesList()[i].temp_isActive()) {
              if (data.liabilityDetails) {
                self.applicantObject().liabilitiesInfo.liabilitiesList()[i].id = data.liabilityDetails.id;
              }
              self.displayFinalSubmit(true);
              self.applicantObject().liabilitiesInfo.liabilitiesList()[i].temp_selectedValues().type = rootParams.baseModel.getDescriptionFromCode(self.liabilityOptions(), self.applicantObject().liabilitiesInfo.liabilitiesList()[i].type);
              self.applicantObject().liabilitiesInfo.liabilitiesList()[i].temp_selectedValues().repaymentFrequency = rootParams.baseModel.getDescriptionFromCode(self.frequencyOptions(), self.applicantObject().liabilitiesInfo.liabilitiesList()[i].repaymentFrequency);
              self.applicantObject().liabilitiesInfo.liabilitiesList()[i].temp_isActive(false);
            }
          }
        });
      } else {
        liabilityInfoTracker.showMessages();
        liabilityInfoTracker.focusOn("@firstInvalidShown");
      }
    };
  };
});
