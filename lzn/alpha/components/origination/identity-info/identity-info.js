define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/alpha/resources/nls/origination/identity-info",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext",
  "ojs/ojvalidationgroup"
], function (oj, ko, $, IdentityInfoModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function (rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    var IdentityInfoModel = new IdentityInfoModelObject(),
      getNewKoModel = function (model) {
        var KoModel = IdentityInfoModel.getNewModel(model);
        KoModel.selectedValues = ko.observable(KoModel.selectedValues);
        return KoModel;
      };
    self.resource = resourceBundle;
    self.applicantObject = ko.observable(rootParams.applicantObject);
    self.taxIdentificationTypeLoaded = ko.observable(false);
    self.identificationTypesLoaded = ko.observable(false);
    self.existingIdentitiesLoaded = ko.observable(false);
    self.taxExemptionCodeLoaded = ko.observable(false);
    self.identificationTypes = ko.observableArray([]);
    self.taxIdentificationTypes = ko.observableArray([]);
    self.taxIdentificationType = ko.observable();
    self.taxExemptionCodes = ko.observableArray([]);
    self.taxExemptionCode = ko.observable();
    self.tfNumber = ko.observable();
    self.anotherIdentification = ko.observable(false);
    self.selectedTaxIdentificationType = ko.observable();
    self.identificationList = ko.observableArray([]);
    self.enableAddIdentification = ko.observable(true);
    self.editOn = ko.observable(false);
    self.countryFetched = ko.observable(false);
    self.statesFetched = ko.observable(false);
    self.countryCodes = ko.observableArray([]);
    self.stateCodes = ko.observableArray([]);
    var notAvailable = {
      "code": "NA",
      "description": "Not Available"
    };
    if (!self.applicantObject().identityInfo) {
      self.applicantObject().identityInfo = getNewKoModel();
    }
    self.applicantObject().identityInfo.doUpdate = false;
    self.initializeModel = function () {
      IdentityInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value);
      IdentityInfoModel.getIdentificationTypeList().then(function (data) {
        if (data && data.enumRepresentations) {
          self.identificationTypes(data.enumRepresentations[0].data);
        }

        IdentityInfoModel.fetchCountryCodes().done(function (data) {
          for (var k = 0; k < data.enumRepresentations[0].data.length; k++) {
            self.countryCodes().push({
              code: data.enumRepresentations[0].data[k].code,
              description: data.enumRepresentations[0].data[k].description
            });
          }
          self.countryFetched(true);
        });

        IdentityInfoModel.getExistingIdentity().then(function (data) {
          IdentityInfoModel.getTaxIdentificationTypes().done(function (data) {
            if (data && data.enumRepresentations) {
              self.taxIdentificationTypes(data.enumRepresentations[0].data);
              self.taxIdentificationTypes().push(notAvailable);
            }
            self.taxIdentificationTypeLoaded(true);
          });
          IdentityInfoModel.getTaxExemptionCodes().done(function (data) {
            if (data && data.enumRepresentations) {
              self.taxExemptionCodes(data.enumRepresentations[0].data);
            }
            self.taxExemptionCodeLoaded(true);
          });
          var identity;
          if (data.identifications.length > 0) {
            for (var i = 0; i < data.identifications.length; i++) {
              identity = getNewKoModel(data.identifications[i]).identificationDTOs[0];
              if (identity.type === "TEC") {
                self.selectedTaxIdentificationType("TEC");
                self.taxExemptionCode(identity.id);
              } else if (identity.type === "TFN") {
                self.selectedTaxIdentificationType("TFN");
                self.tfNumber(identity.id);
              } else {
                self.selectedTaxIdentificationType("NA");
                self.identificationList()[i] = identity;
                self.identificationList()[i].temp_selectedIdentification = ko.observable(rootParams.baseModel.getDescriptionFromCode(self.identificationTypes(), self.identificationList()[i].type));
                self.identificationList()[i].temp_isActive = ko.observable(true);
                self.anotherIdentification(true);
                if (self.identificationList()[i].type === "DLN") {
                  self.identificationList()[i].temp_selectedCountry = ko.observable(rootParams.baseModel.getDescriptionFromCode(self.countryCodes(), self.identificationList()[i].countryOfIssue));
                  var currentIndex = i;
                  IdentityInfoModel.fetchStateCodes(self.identificationList()[i].countryOfIssue).done(function (data) {
                    self.stateCodes(data.enumRepresentations[0].data);
                    self.statesFetched(true);
                    self.identificationList()[currentIndex].temp_selectedState = ko.observable(rootParams.baseModel.getDescriptionFromCode(self.stateCodes(), self.identificationList()[currentIndex].placeOfIssue));
                  });

                }
              }
            }
            self.applicantObject().identityInfo.doUpdate = true;
          }
          if (self.applicantObject().applicantType() === "customer") {
            self.applicantObject().identityInfo.disableInputs = true;
          } else {
            self.applicantObject().identityInfo.disableInputs = false;
          }
          self.existingIdentitiesLoaded(true);
        });
        self.identificationTypesLoaded(true);
      });
    };
    self.initializeModel();
    self.identitytypeChanged = function (event, data) {
      if (event.type === "valueChanged") {
        if (event.detail.value !== "DLN") {
          data.placeOfIssue = "";
          data.countryOfIssue = "";
        }
        data.currentType(event.detail.value);
        self.existingIdentitiesLoaded(false);
        self.existingIdentitiesLoaded(true);
      }
    };

    self.taxIdentificationChanged = function (event) {
      if (event.type === "valueChanged") {
        self.tfNumber("");
        self.taxExemptionCode("");
      }
    };

    self.submitIdentityInfo = function () {
      var identityTracker = document.getElementById("identityTracker");
      if (identityTracker.valid === "valid") {
        self.applicantObject().identityInfo.identityInfo = [];
        var i;
        for (i = 0; i < self.identificationList().length; i++) {
          self.applicantObject().identityInfo.identityInfo[i] = getNewKoModel().identificationDTOs[0];
          self.applicantObject().identityInfo.identityInfo[i].type = self.identificationList()[i].type;
          self.applicantObject().identityInfo.identityInfo[i].id = self.identificationList()[i].id;
          self.applicantObject().identityInfo.identityInfo[i].expiryDate = self.identificationList()[i].expiryDate;
          self.applicantObject().identityInfo.identityInfo[i].countryOfIssue = self.identificationList()[i].countryOfIssue;
          self.applicantObject().identityInfo.identityInfo[i].placeOfIssue = self.identificationList()[i].placeOfIssue;
        }
        if (self.selectedTaxIdentificationType() !== "NA") {
          var tempIdentification = getNewKoModel().identificationDTOs[0];
          tempIdentification.type = self.selectedTaxIdentificationType();
          if (self.selectedTaxIdentificationType() === "TFN") {
            tempIdentification.id = self.tfNumber();
          } else if (self.selectedTaxIdentificationType() === "TEC") {
            tempIdentification.id = self.taxExemptionCode();
          }
          self.applicantObject().identityInfo.identityInfo.push(tempIdentification);
        }

        if (self.applicantObject().identityInfo.identityInfo.length > 0) {
          var payload = {
            identificationDTOs: self.applicantObject().identityInfo.identityInfo
          };
          if (self.applicantObject().applicantType() !== "customer") {
            IdentityInfoModel.saveModel(ko.toJSON(payload), self.applicantObject().identityInfo.doUpdate).then(function (data) {
              if (data.identifications && data.identifications[0].identificationId) {
                self.applicantObject().identityInfo.doUpdate = true;
              }

              self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
            });
          } else {
            self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
          }
          for (i = 0; i < self.applicantObject().identityInfo.identityInfo.length; i++) {
            if (self.applicantObject().identityInfo.identityInfo[i].type === "TFN" || self.applicantObject().identityInfo.identityInfo[i].type === "TEC") {
              self.applicantObject().identityInfo.identityInfo[i].temp_selectedIdentification = ko.observable(rootParams.baseModel.getDescriptionFromCode(self.taxIdentificationTypes(), self.applicantObject().identityInfo.identityInfo[i].type));
              if (self.applicantObject().identityInfo.identityInfo[i].type === "TEC") {
                self.applicantObject().identityInfo.identityInfo[i].temp_selectedTEC = ko.observable(rootParams.baseModel.getDescriptionFromCode(self.taxExemptionCodes(), self.applicantObject().identityInfo.identityInfo[i].id));
              }
            } else {
              self.applicantObject().identityInfo.identityInfo[i].temp_selectedIdentification = ko.observable(rootParams.baseModel.getDescriptionFromCode(self.identificationTypes(), self.applicantObject().identityInfo.identityInfo[i].type));
            }

            if (self.applicantObject().identityInfo.identityInfo[i].type === "DLN") {
              self.applicantObject().identityInfo.identityInfo[i].temp_selectedCountry = ko.observable(rootParams.baseModel.getDescriptionFromCode(self.countryCodes(), self.applicantObject().identityInfo.identityInfo[i].countryOfIssue));
              self.applicantObject().identityInfo.identityInfo[i].temp_selectedState = ko.observable(rootParams.baseModel.getDescriptionFromCode(self.stateCodes(), self.applicantObject().identityInfo.identityInfo[i].placeOfIssue));
            }
          }
        } else {
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
        }
      } else {
        identityTracker.showMessages();
        identityTracker.focusOn("@firstInvalidShown");
      }
    };

    self.addIdentification = function () {
      self.anotherIdentification(false);
      ko.tasks.runEarly();
      self.identificationList().push(getNewKoModel().identificationDTOs[0]);
      self.identificationList()[self.identificationList().length - 1].temp_isActive = ko.observable(false);
      self.identificationList()[self.identificationList().length - 1].temp_selectedIdentification = ko.observable(rootParams.baseModel.getDescriptionFromCode(self.identificationTypes(), self.identificationList()[self.identificationList().length - 1].type));
      self.identificationList()[self.identificationList().length - 1].temp_selectedCountry = ko.observable("");
      self.identificationList()[self.identificationList().length - 1].temp_selectedState = ko.observable("");
      self.identificationList()[self.identificationList().length - 1].currentType = ko.observable("");

      self.enableAddIdentification(false);
      self.editOn(true);
      self.anotherIdentification(true);
    };

    self.saveIdentity = function (data) {
      var identityTracker = document.getElementById("identityTracker");
      if (identityTracker.valid === "valid") {
        for (var i = 0; i < self.identificationList().length; i++) {
          if (self.identificationList()[i].type === data.type) {
            self.identificationList()[i].temp_isActive(true);
            self.identificationList()[i].temp_selectedIdentification(rootParams.baseModel.getDescriptionFromCode(self.identificationTypes(), data.type));
            self.identificationList()[i].temp_selectedCountry(rootParams.baseModel.getDescriptionFromCode(self.countryCodes(), data.countryOfIssue));
            self.identificationList()[i].temp_selectedState(rootParams.baseModel.getDescriptionFromCode(self.stateCodes(), data.placeOfIssue));
          }
        }
        self.enableAddIdentification(true);
        self.editOn(false);
      } else {
        identityTracker.showMessages();
        identityTracker.focusOn("@firstInvalidShown");
      }
    };

    self.deleteIdentity = function (index) {
      self.anotherIdentification(false);
      ko.tasks.runEarly();
      self.identificationList().splice(index, 1);
      self.editOn(false);
      if (self.identificationList().length === 0) {
        self.anotherIdentification(false);
      } else {
        self.anotherIdentification(true);
      }
    };

    self.editIdentity = function (data, currentIncome) {
      self.anotherIdentification(false);
      ko.tasks.runEarly();
      currentIncome.temp_isActive(false);
      self.editOn(true);
      self.anotherIdentification(true);
    };

    self.countryOfIssueChanged = function (event) {
      if (event.type === "valueChanged") {
        self.statesFetched(false);
        self.stateCodes([]);
        ko.tasks.runEarly();
        IdentityInfoModel.fetchStateCodes(event.detail.value).done(function (data) {
          self.stateCodes(data.enumRepresentations[0].data);
          self.statesFetched(true);
        });
      }
    };
    self.validateTFN = {
      validate: function (value) {
        var result = value.match(/[0-9]/g);
        if (value.length === 9 && value.length === result.length) {
          var tFNSum = self.getTFNSUM(result);
          if (tFNSum % 11 === 0) {
            return true;
          }
          throw new Error(self.resource.messages.validTFN);
        } else {
          throw new Error(self.resource.messages.tFNLength);
        }
      }
    };

    self.getTFNSUM = function (tFNNumber) {
      var sum = 0;
      for (var i = 0; i < 9; i++) {
        switch (i) {
          case 0:
            sum = (tFNNumber[i] * 1) + sum;
            break;
          case 1:
            sum = (tFNNumber[i] * 4) + sum;
            break;
          case 2:
            sum = (tFNNumber[i] * 3) + sum;
            break;
          case 3:
            sum = (tFNNumber[i] * 7) + sum;
            break;
          case 4:
            sum = (tFNNumber[i] * 5) + sum;
            break;
          case 5:
            sum = (tFNNumber[i] * 8) + sum;
            break;
          case 6:
            sum = (tFNNumber[i] * 6) + sum;
            break;
          case 7:
            sum = (tFNNumber[i] * 9) + sum;
            break;
          case 8:
            sum = (tFNNumber[i] * 10) + sum;
            break;
        }
      }
      return sum;
    };

  };
});