define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!resources/nls/assets-info",
  "ojs/ojinputnumber",
  "ojs/ojvalidationgroup"
], function (oj, ko, $, AssetsInfoModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function (rootParams) {
    var self = this,
      AssetsInfoModel = new AssetsInfoModelObject(),
      i = 0,
      getNewKoModel = function () {
        var KoModel = AssetsInfoModel.getNewModel();
        KoModel.type = ko.observable(KoModel.type);
        KoModel.value.amount = ko.observable(KoModel.value.amount);
        KoModel.value.currency = rootParams.baseModel.getLocaleValue("localCurrency");
        KoModel.temp_isActive = ko.observable(KoModel.temp_isActive);
        KoModel.temp_selectedValues = ko.observable(KoModel.temp_selectedValues);
        return KoModel;
      },
      transformFetchedData = function (data) {
        var tempAssetsList;
        tempAssetsList = ko.utils.arrayFilter(data.assetDetails, function (assets) {
          if (rootParams.baseModel.getDescriptionFromCode(self.assetTypeData(), assets.type) !== "") {
            return assets;
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
        return tempAssetsList;
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
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.applicantObject = ko.observable(rootParams.applicantObject);
    self.employmentProfileId = rootParams.applicantObject.profileId;
    self.assetTypeData = ko.observableArray([]);
    self.assetDataLoaded = ko.observable(false);
    self.validationTracker = ko.observable();
    self.existingAssetsLoaded = ko.observable(false);
    self.maximumAssetsAllowed = 5;
    rootParams.baseModel.registerElement("amount-input");
    self.applicantObject().assetsInfo = {
      assetsList: ko.observableArray([])
    };
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
    AssetsInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, self.employmentProfileId);
    self.initializeModel = function () {
      AssetsInfoModel.fetchEmployments(self.productDetails().submissionId.value, self.applicantObject().applicantId().value).done(function (data) {
        if (data.employmentProfiles) {
          var profileId = null;
          for (var i = 0; i < data.employmentProfiles.length; i++) {
            if (data.employmentProfiles[i].isPrimary) {
              profileId = data.employmentProfiles[i].id;
              break;
            }
          }
          AssetsInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, profileId);
          self.applicantObject().profileId = profileId;
          self.fetchOtherdetails();
        } else {
          AssetsInfoModel.saveEmployments(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, ko.toJSON(arraypayload)).done(function (data) {
            if (data.employmentProfiles && data.employmentProfiles[0]) {
              AssetsInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, data.employmentProfiles[0].id);
              self.applicantObject().profileId = data.employmentProfiles[0].id;
              self.fetchOtherdetails();
            }
          });
        }
      });
    };
    self.fetchOtherdetails = function () {
      AssetsInfoModel.getAssetTypeList(self.productDetails().productType).then(function (data) {
        if (data.financialTemplateDTOs && data.financialTemplateDTOs.length > 0 && data.financialTemplateDTOs[0].financialTemplateGroupDTOs && data.financialTemplateDTOs[0].financialTemplateGroupDTOs.length > 0 && data.financialTemplateDTOs[0].financialTemplateGroupDTOs[0].financialGroupParameters && data.financialTemplateDTOs[0].financialTemplateGroupDTOs[0].financialGroupParameters.length > 0) {
          self.assetTypeData(data.financialTemplateDTOs[0].financialTemplateGroupDTOs[0].financialGroupParameters);
        }
        self.assetDataLoaded(true);
        AssetsInfoModel.getExistingAssets().done(function (data) {
          if (!self.applicantObject().newApplicant) {
            var showComplete = false;
            if (self.checkDataAvailability(data.assetDetails, rootParams.applicantStages.id)) {
              showComplete = true;
            }
            self.showIcon(showComplete, rootParams.applicantStages);
          }
          self.existingAssetsLoaded(false);
          self.applicantObject().assetsInfo.assetsList(transformFetchedData(data));
          self.existingAssetsLoaded(true);
        });
      });
    };
    self.initializeModel();
    self.addAsset = function (index, data) {
      if (self.applicantObject().assetsInfo.assetsList().length < self.maximumAssetsAllowed) {
        data.assetsList.push(getNewKoModel());
      } else {
        $("#limitExceededAsset").trigger("openModal");
      }
    };
    self.deleteAsset = function (index, data, current) {
      if (current.id) {
        AssetsInfoModel.deleteModel(current.id);
      }
      data.assetsList().splice(index, 1);
      data.assetsList(data.assetsList());
    };
    self.editAssetInfo = function (data, currentAsset) {
      for (i = 0; i < data.assetsList().length; i++) {
        if (data.assetsList()[i].temp_isActive()) {
          return;
        }
      }
      currentAsset.temp_isActive(true);
    };
    self.displayAddAssetButton = function (data) {
      for (i = 0; i < data.assetsList().length; i++) {
        if (data.assetsList()[i].temp_isActive()) {
          return false;
        }
      }
      return true;
    };
    self.displayFinalSubmit = ko.computed(function () {
      for (i = 0; i < self.applicantObject().assetsInfo.assetsList().length; i++) {
        if (self.applicantObject().assetsInfo.assetsList()[i].temp_isActive()) {
          return false;
        }
      }
      return true;
    });
    self.completeAssetsSection = function () {
      self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
    };
    self.submitAssetInfo = function (event, data) {
      var assetsInfoTracker = document.getElementById("assetsInfoTracker");
      if (assetsInfoTracker.valid === "valid") {
        data.type(ko.utils.unwrapObservable(data.type));
        for (var j = 0; j < self.assetTypeData().length; j++) {
          if (data.type === self.assetTypeData()[j].financialParameterDTO.code) {
            data.finacialParameterDescription = self.assetTypeData()[j].financialParameterDTO.description;
          }
        }
        AssetsInfoModel.saveModel(rootParams.baseModel.removeTempAttributes({
          profileId: self.applicantObject().profileId,
          assetDetails: data
        })).done(function (data) {
          for (var i = 0; i < self.applicantObject().assetsInfo.assetsList().length; i++) {
            if (self.applicantObject().assetsInfo.assetsList()[i].temp_isActive()) {
              if (data.assetDetails) {
                self.applicantObject().assetsInfo.assetsList()[i].id = data.assetDetails.id;
              }
              self.applicantObject().assetsInfo.assetsList()[i].temp_selectedValues().type = rootParams.baseModel.getDescriptionFromCode(self.assetTypeData(), self.applicantObject().assetsInfo.assetsList()[i].type());
              self.applicantObject().assetsInfo.assetsList()[i].temp_isActive(false);
            }
          }
        });
      } else {
        assetsInfoTracker.showMessages();
        assetsInfoTracker.focusOn("@firstInvalidShown");
      }
    };
    self.dispose = function () {
      self.displayFinalSubmit.dispose();
    };
  };
});