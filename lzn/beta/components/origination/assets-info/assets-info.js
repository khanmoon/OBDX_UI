define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/beta/resources/nls/assets-info",
  "ojs/ojinputnumber",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, AssetsInfoModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      AssetsInfoModel = new AssetsInfoModelObject(),
      i = 0,
      getNewKoModel = function() {
        var KoModel = AssetsInfoModel.getNewModel();
        KoModel.type = ko.observable(KoModel.type);
        KoModel.value.amount = ko.observable(KoModel.value.amount);
        KoModel.value.currency = self.productDetails().currency;
        KoModel.temp_isActive = ko.observable(KoModel.temp_isActive);
        KoModel.temp_selectedValues = ko.observable(KoModel.temp_selectedValues);
        return KoModel;
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
    self.assetTypeData = ko.observableArray([]);
    self.assetTypeData(self.finAssetTypeData());
    self.assetDataLoaded = ko.observable(false);
    self.validationTracker = ko.observable();
    self.existingAssetsLoaded = ko.observable(false);
    rootParams.baseModel.registerElement("amount-input");
    if (!self.applicantObject().financialProfile[self.profileIdIndex].assetsInfo) {
      self.applicantObject().financialProfile[self.profileIdIndex].assetsInfo = {
        isCompleting: ko.observable(true),
        assetsList: ko.observableArray([])
      };
    } else {
      self.applicantObject().financialProfile[self.profileIdIndex].assetsInfo.assetsList([]);
    }
    AssetsInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, self.employmentProfileId);
    if (self.assetTypeData().length !== 0)
      self.assetDataLoaded(true);
    AssetsInfoModel.getExistingAssets().done(function(data) {
      var tempAssetsList;
      self.existingAssetsLoaded(false);
      tempAssetsList = ko.utils.arrayFilter(data.assetDetails, function(asset) {
        if (rootParams.baseModel.getDescriptionFromCode(self.assetTypeData(), asset.type) !== "") {
          return asset;
        }
      });
      for (i = 0; i < tempAssetsList.length; i++) {
        tempAssetsList[i].type = ko.observable(tempAssetsList[i].type);
        tempAssetsList[i].value.amount = ko.observable(tempAssetsList[i].value.amount);
        tempAssetsList[i].temp_isActive = ko.observable(false);
        tempAssetsList[i].temp_selectedValues = ko.observable({
          type: rootParams.baseModel.getDescriptionFromCode(self.assetTypeData(), tempAssetsList[i].type())
        });
      }
      self.applicantObject().financialProfile[self.profileIdIndex].assetsInfo.assetsList(tempAssetsList);
      self.existingAssetsLoaded(true);
    });
    self.addAsset = function(data) {
      data.assetsList.push(getNewKoModel());
    };
    self.deleteAsset = function(index, data, current) {
      if (current.id) {
        AssetsInfoModel.deleteModel(current.id);
      }
      data.assetsList().splice(index, 1);
      data.assetsList(data.assetsList());
    };
    self.editAssetInfo = function(data, currentAsset) {
      for (i = 0; i < data.assetsList().length; i++) {
        if (data.assetsList()[i].temp_isActive()) {
          return;
        }
      }
      currentAsset.temp_isActive(true);
    };
    self.displayAddAssetButton = function(data) {
      for (i = 0; i < data.assetsList().length; i++) {
        if (data.assetsList()[i].temp_isActive()) {
          return false;
        }
      }
      return true;
    };
    self.displayFinalSubmit = ko.computed(function() {
      for (i = 0; i < self.applicantObject().financialProfile[self.profileIdIndex].assetsInfo.assetsList().length; i++) {
        if (self.applicantObject().financialProfile[self.profileIdIndex].assetsInfo.assetsList()[i].temp_isActive()) {
          return false;
        }
      }
      return true;
    });
    self.completeAssetsSection = function() {
      self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
    };
    self.submitAssetInfo = function(event, data) {
      var assetsInfoTracker = document.getElementById("assetsInfoTracker");
      if (assetsInfoTracker.valid === "valid") {
        data.type(ko.utils.unwrapObservable(data.type()));
        data.finacialParameterDescription = rootParams.baseModel.getDescriptionFromCode(self.assetTypeData(), ko.utils.unwrapObservable(data.type()));
        AssetsInfoModel.saveModel(rootParams.baseModel.removeTempAttributes({
          profileId: self.employmentProfileId,
          assetDetails: data
        })).done(function(data) {
          var i = 0;
          for (i = 0; i < self.applicantObject().financialProfile[self.profileIdIndex].assetsInfo.assetsList().length; i++) {
            if (self.applicantObject().financialProfile[self.profileIdIndex].assetsInfo.assetsList()[i].temp_isActive()) {
              if (data.assetDetails) {
                self.applicantObject().financialProfile[self.profileIdIndex].assetsInfo.assetsList()[i].id = data.assetDetails.id;
              }
              self.applicantObject().financialProfile[self.profileIdIndex].assetsInfo.assetsList()[i].temp_selectedValues().type = rootParams.baseModel.getDescriptionFromCode(self.assetTypeData(), self.applicantObject().financialProfile[self.profileIdIndex].assetsInfo.assetsList()[i].type());
              self.applicantObject().financialProfile[self.profileIdIndex].assetsInfo.assetsList()[i].temp_isActive(false);
            }
          }
        });
      } else {
        assetsInfoTracker.showMessages();
        assetsInfoTracker.focusOn("@firstInvalidShown");
      }
    };
    self.dispose = function() {
      self.displayFinalSubmit.dispose();
    };
  };
});
