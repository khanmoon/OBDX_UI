define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/alpha/resources/nls/liabilities-info",
  "ojs/ojinputnumber",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, LiabilitiesInfoModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      LiabilitiesInfoModel = new LiabilitiesInfoModelObject(),
      i = 0,
      getNewKoModel = function(model) {
        var KoModel = LiabilitiesInfoModel.getNewModel(model);
        KoModel.type = ko.observable(KoModel.type);
        KoModel.original.amount = ko.observable(KoModel.original.amount);
        KoModel.original.currency = self.productDetails().currency;
        KoModel.outstanding.amount = ko.observable(KoModel.outstanding.amount);
        KoModel.outstanding.currency = self.productDetails().currency;
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
        }
        return tempLiabilityList;
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.groupValid = ko.observable();
    if (self.applicantType === "PRIMARY") {
      self.applicantObject = ko.observable(rootParams.applicantObject);
    } else if (self.applicantType === "JOINT") {
      self.applicantObject = rootParams.applicantObject()[self.coAppCurrentIndex - 1];
      self.employmentProfileId(rootParams.empProfileIds()[0]);
    }
    self.liabilityOptionsLoaded = ko.observable(false);
    self.liabilityOptions = ko.observableArray([]);
    self.liabilityOptions(self.finLiabilityOptions());
    self.existingLiabilititesLoaded = ko.observable(false);
    self.validationTracker = ko.observable();
    rootParams.baseModel.registerElement("amount-input");
    LiabilitiesInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, self.employmentProfileId);
    if (!self.applicantObject().financialProfile[self.profileIdIndex].liabilitiesInfo) {
      self.applicantObject().financialProfile[self.profileIdIndex].liabilitiesInfo = {
        isCompleting: ko.observable(true),
        liabilitiesList: ko.observableArray([])
      };
    } else {
      self.applicantObject().financialProfile[self.profileIdIndex].liabilitiesInfo.liabilitiesList([]);
    }
    if (self.liabilityOptions().length !== 0)
      self.liabilityOptionsLoaded(true);
    LiabilitiesInfoModel.getExistingLiabilities().then(function(data) {
      self.existingLiabilititesLoaded(false);
      self.applicantObject().financialProfile[self.profileIdIndex].liabilitiesInfo.liabilitiesList(transformFetchedData(data));
      self.existingLiabilititesLoaded(true);
    });
    self.addLiability = function(index, data) {
      data.liabilitiesList.push(getNewKoModel());
    };
    self.deleteLiability = function(index, data, current) {
      if (current.id) {
        LiabilitiesInfoModel.deleteModel(current.id);
      }
      data.liabilitiesList().splice(index, 1);
      data.liabilitiesList(data.liabilitiesList());
    };
    self.editLiabilityInfo = function(data, currentLiability) {
      for (i = 0; i < data.liabilitiesList().length; i++) {
        if (data.liabilitiesList()[i].temp_isActive()) {
          return;
        }
      }
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
    self.displayFinalSubmit = ko.computed(function() {
      for (i = 0; i < self.applicantObject().financialProfile[self.profileIdIndex].liabilitiesInfo.liabilitiesList().length; i++) {
        if (self.applicantObject().financialProfile[self.profileIdIndex].liabilitiesInfo.liabilitiesList()[i].temp_isActive()) {
          return false;
        }
      }
      return true;
    });
    self.completeLiabilitiesSection = function() {
      self.enableContinue(true);
      self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
    };
    self.submitLiabilityInfo = function(data) {
      var liabilityInfoTracker = document.getElementById("liabilityInfoTracker");
      if (liabilityInfoTracker.valid === "valid") {
        if (parseInt(data.outstanding.amount(), 10) > parseInt(data.original.amount(), 10)) {
          $("#ERROR_LIABLILITY").trigger("openModal");
          return;
        }
        data.type = ko.utils.unwrapObservable(data.type);
        data.finacialParameterDescription = rootParams.baseModel.getDescriptionFromCode(self.liabilityOptions(), ko.utils.unwrapObservable(data.type));
        LiabilitiesInfoModel.saveModel(rootParams.baseModel.removeTempAttributes({
          profileId: self.employmentProfileId,
          liabilityDetails: data
        })).then(function(data) {
          for (i = 0; i < self.applicantObject().financialProfile[self.profileIdIndex].liabilitiesInfo.liabilitiesList().length; i++) {
            if (self.applicantObject().financialProfile[self.profileIdIndex].liabilitiesInfo.liabilitiesList()[i].temp_isActive()) {
              if (data.liabilityDetails) {
                self.applicantObject().financialProfile[self.profileIdIndex].liabilitiesInfo.liabilitiesList()[i].id = data.liabilityDetails.id;
              }
              self.applicantObject().financialProfile[self.profileIdIndex].liabilitiesInfo.liabilitiesList()[i].temp_selectedValues().type = rootParams.baseModel.getDescriptionFromCode(self.liabilityOptions(), self.applicantObject().financialProfile[self.profileIdIndex].liabilitiesInfo.liabilitiesList()[i].type);
              self.applicantObject().financialProfile[self.profileIdIndex].liabilitiesInfo.liabilitiesList()[i].temp_isActive(false);
            }
          }
        });
      } else {
        liabilityInfoTracker.showMessages();
        liabilityInfoTracker.focusOn("@firstInvalidShown");
      }
    };
    self.dispose = function() {
      self.displayFinalSubmit.dispose();
    };
  };
});
