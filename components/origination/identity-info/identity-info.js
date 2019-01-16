define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!resources/nls/origination/identity-info",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, IdentityInfoModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      i;
    ko.utils.extend(self, rootParams.rootModel);

    var IdentityInfoModel = new IdentityInfoModelObject(),
      getNewKoModel = function(model) {
        var KoModel = IdentityInfoModel.getNewModel(model);
        KoModel.selectedValues = ko.observable(KoModel.selectedValues);
        return KoModel;
      };
    self.resource = resourceBundle;
    self.identityValid = ko.observable();
    if (self.applicantType === "PRIMARY") {
      self.applicantObject = ko.observable(rootParams.applicantObject);
    } else if (self.applicantType === "JOINT") {
      self.applicantObject = rootParams.applicantObject()[self.coAppCurrentIndex - 1];
    }

    self.validIssueDate = ko.pureComputed(function() {
      return [{
        type: "datetimeRange",
        options: {
          max: self.todayIsoDate
        }
      }];
    });
    self.validExpiryDate = ko.pureComputed(function() {
      return [{
        type: "datetimeRange",
        options: {
          min: self.todayIsoDate,
          max: self.maxIsoDate,
          hint: {
            inRange: rootParams.baseModel.format(self.resource.messages.expiryDaterange, {
              startDate: self.currdate,
              endDate: self.expdate
            })
          },
          messageDetail: {
            rangeOverflow: rootParams.baseModel.format(self.resource.messages.expiryDateError, {
              expdate: self.expdate
            })
          }
        }
      }];
    });
    self.existingIdentitiesLoaded = ko.observable(false);
    self.identificationTypes = ko.observableArray([]);
    self.countries = ko.observableArray([]);
    self.countriesLoaded = ko.observable(false);
    self.validationTracker = ko.observable();

    self.productDetails().applicantType = ko.observable("anonymous");
    var identityInfoCopy;
    if (!self.applicantObject().identityInfo) {
      self.applicantObject().identityInfo = getNewKoModel();
    }
    self.initializeModel = function() {
      IdentityInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value);
      IdentityInfoModel.getIdentificationTypeList(self.productDetails().productType).then(function(data) {
        self.identificationTypes(data.enumRepresentations[0].data);
        IdentityInfoModel.fetchCountries().done(function(data) {
          for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
            self.countries().push({
              code: data.enumRepresentations[0].data[i].code,
              description: data.enumRepresentations[0].data[i].description
            });
          }
          self.countriesLoaded(true);
          IdentityInfoModel.getExistingIdentity().then(function(data) {
            self.applicantObject().identityInfo.identityInfo = [{}];
            if (!self.applicantObject().newApplicant) {
              var showComplete = false;
              if (self.checkDataAvailability(data.identifications, rootParams.applicantStages.id)) {
                showComplete = true;
              }
              self.showIcon(showComplete, rootParams.applicantStages);
            }
            if (data.identifications) {
              for (var i = 0; i < data.identifications.length; i++) {
                self.applicantObject().identityInfo.identityInfo[0] = getNewKoModel(data.identifications[i]).identificationDTOs[0];
                self.applicantObject().identityInfo.selectedValues().type = rootParams.baseModel.getDescriptionFromCode(self.identificationTypes(), data.identifications[i].type);
                self.applicantObject().identityInfo.selectedValues().maskedId = self.maskValueAll(self.applicantObject().identityInfo.identityInfo[0].id, self.applicantObject().identityInfo.identityInfo[0].id.length - 4);
                if (data.identifications[i].expiryDate) {
                  self.applicantObject().identityInfo.identityInfo[0].expiryDate = data.identifications[i].expiryDate.substring(0, 10);
                }
              }
            } else {
              self.applicantObject().identityInfo.identityInfo[0] = getNewKoModel().identificationDTOs[0];
            }
            if (self.applicantObject().applicantType() === "customer") {
              self.applicantObject().identityInfo.disableInputs = true;
            } else {
              self.applicantObject().identityInfo.disableInputs = false;
            }
            identityInfoCopy = ko.toJSON(self.applicantObject().identityInfo.identityInfo);
            self.existingIdentitiesLoaded(true);
          });
        });
      });
    };
    self.initializeModel();
    self.identitytypeChanged = function(event) {
      if (event.detail.value) {
        self.existingIdentitiesLoaded(false);
        self.applicantObject().identityInfo.identityInfo[0].id = "";
        self.applicantObject().identityInfo.identityInfo[0].expiryDate = "";
        ko.tasks.runEarly();
        self.existingIdentitiesLoaded(true);
      }
    };
    var today = rootParams.baseModel.getDate();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear() + 15;
    var max = new Date(yyyy, mm, dd);
    self.expdate = mm + "/" + dd + "/" + yyyy;
    self.currdate = mm + "/" + dd + "/" + today.getFullYear();
    self.maxIsoDate = oj.IntlConverterUtils.dateToLocalIso(max);
    self.setPrimaryIdFocusOut = function(event) {
      self.applicantObject().identityInfo.identityInfo[0].id = event.target.value;
      event.target.value = self.maskValueAll(event.target.value, event.target.value.length - 4);
    };
    self.setPrimaryIdFocusIn = function(event) {
      if (self.applicantObject().identityInfo.identityInfo[0].id) {
        event.target.value = self.applicantObject().identityInfo.identityInfo[0].id;
      }
    };
    self.submitIdentityInfo = function() {
      var identityTracker = document.getElementById("identityTracker");
      if (identityTracker.valid === "valid") {
        self.applicantObject().identityInfo.identityInfo[0].type = "PAS";
        self.applicantObject().identityInfo.identityInfo[0].countryOfIssue = self.applicantObject().identityInfo.identityInfo[0].countryOfIssue;
        if (self.checkformDataChange(identityInfoCopy, ko.toJSON(self.applicantObject().identityInfo.identityInfo), rootParams.applicantStages)) {
          return true;
        }
        self.applicantObject().identityInfo.selectedValues().type = rootParams.baseModel.getDescriptionFromCode(self.identificationTypes(), self.applicantObject().identityInfo.identityInfo[0].type);
        self.applicantObject().identityInfo.selectedValues().maskedId = self.maskValueAll(self.applicantObject().identityInfo.identityInfo[0].id, self.applicantObject().identityInfo.identityInfo[0].id.length - 4);
        var payload = {
          identificationDTOs: self.applicantObject().identityInfo.identityInfo
        };
        if (self.applicantObject().applicantType() !== "customer") {
          IdentityInfoModel.saveModel(ko.toJSON(payload)).then(function(data) {
            if (data.identifications) {
              self.applicantObject().identityInfo.identityInfo[0].identificationId = data.identifications[0].identificationId;
            }
            self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
            identityInfoCopy = ko.toJSON(self.applicantObject().identityInfo.identityInfo);
          });
        } else {
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
        }
      } else {
        identityTracker.showMessages();
        identityTracker.focusOn("@firstInvalidShown");
      }
    };
  };
});
