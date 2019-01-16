define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "ojL10n!lzn/beta/resources/nls/identity-info",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext",
    "ojs/ojvalidationgroup"
], function(oj, ko, $, IdentityInfoModelObject, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    var IdentityInfoModel = new IdentityInfoModelObject(),
      getNewKoModel = function(model) {
        var KoModel = IdentityInfoModel.getNewModel(model);
        KoModel.selectedValues = ko.observable(KoModel.selectedValues);
        return KoModel;
      };
    self.stateOptions = ko.observable([]);
    self.countryOfIssue = "US";
    self.coAppNo = "";
    if (rootParams.coApplicant) {
      self.coAppNo = rootParams.applicantStages.coappNumber;
    }
    self.stateofIssueRequired = ko.observable(true);
    if (self.applicantType === "PRIMARY") {
      self.applicantObject = ko.observable(rootParams.applicantObject);
    } else if (self.applicantType === "JOINT") {
      self.applicantObject = rootParams.applicantObject()[self.coAppCurrentIndex - 1];
    }
    self.existingIdentitiesLoaded = ko.observable(false);
    self.identificationTypes = ko.observableArray([]);
    self.validationTracker = ko.observable();
    self.statesChanged = ko.observable(false);
    self.ssnNumber = ko.observable("");

    self.ssnValidate = ko.pureComputed(function() {
      return [{
        type: "regExp",
        options: {
          pattern: "[0-9-xX]{11}",
          messageDetail: self.resource.messages.ssn
        }
      }];
    });

    self.validateIdNum = {
      type: "length",
      options: {
        min: 1,
        max: 30
      }
    };
    self.validateExpirydate = ko.pureComputed(function() {
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

    self.productDetails().applicantType = ko.observable("anonymous");
    var identityInfoCopy;
    if (!self.applicantObject().identityInfo) {
      self.applicantObject().identityInfo = getNewKoModel();
    }
    self.initializeModel = function() {
      IdentityInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value);
      IdentityInfoModel.getIdentificationTypeList().then(function(data) {
        self.identificationTypes(data.enumRepresentations[0].data);
        IdentityInfoModel.getStates(self.countryOfIssue).then(function(data) {
          self.stateOptions(data.enumRepresentations[0].data);
          self.statesChanged(true);
          IdentityInfoModel.getExistingIdentity().then(function(data) {
            self.applicantObject().identityInfo.identityInfo = [{},
              {}
            ];
            if (data.identifications) {
              for (var i = 0; i < data.identifications.length; i++) {
                if (data.identifications[i].type === "SSN") {
                  self.applicantObject().identityInfo.identityInfo[0] = getNewKoModel(data.identifications[i]).identificationDTOs[0];
                  self.ssnNumber(self.applicantObject().identityInfo.identityInfo[0].id.replace(/[^\-]/g, "x"));
                  var ssnval = self.applicantObject().identityInfo.identityInfo[0].id;
                  var ssnlen = ssnval.length >= 5 ? 5 : ssnval.length;
                  self.applicantObject().identityInfo.selectedValues().maskedssn = self.applyPattern(self.maskValue(ssnval, ssnlen), [
                    3,
                    2,
                    4
                  ], 0);
                  self.ssnNumber(self.applyPattern(self.maskValue(self.ssnNumber(), 9), [
                    3,
                    2,
                    4
                  ], 0));
                } else {
                  self.applicantObject().identityInfo.identityInfo[1] = getNewKoModel(data.identifications[i]).identificationDTOs[0];
                  self.applicantObject().identityInfo.selectedValues().type = rootParams.baseModel.getDescriptionFromCode(self.identificationTypes(), data.identifications[i].type);
                  self.applicantObject().identityInfo.identityInfo[1].expiryDate = data.identifications[i].expiryDate.substring(0, 10);
                  if (data.identifications[i].type === "MCC") {
                    self.stateofIssueRequired(false);
                  }
                }
              }
            } else {
              self.applicantObject().identityInfo.identityInfo[0] = getNewKoModel().identificationDTOs[0];
              self.applicantObject().identityInfo.identityInfo[0].type = "SSN";
              self.applicantObject().identityInfo.identityInfo[1] = getNewKoModel().identificationDTOs[0];
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
    self.submitIdentityInfo = function() {
      var identityInfoTracker = document.getElementById("identityInfoTracker");
      if (identityInfoTracker.valid === "valid") {
        if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
          return;
        }
        self.applicantObject().identityInfo.selectedValues().type = rootParams.baseModel.getDescriptionFromCode(self.identificationTypes(), self.applicantObject().identityInfo.identityInfo[1].type);
        self.applicantObject().identityInfo.selectedValues().placeOfIssue = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.applicantObject().identityInfo.identityInfo[1].placeOfIssue);
        self.applicantObject().identityInfo.identityInfo[1].type = self.applicantObject().identityInfo.identityInfo[1].type;
        self.applicantObject().identityInfo.identityInfo[1].placeOfIssue = self.applicantObject().identityInfo.identityInfo[1].placeOfIssue;
        self.applicantObject().identityInfo.identityInfo[0].type = "SSN";
        if (self.checkformDataChange(identityInfoCopy, ko.toJSON(self.applicantObject().identityInfo.identityInfo), rootParams.applicantStages)) {
          return true;
        }
        var payload = {
          identificationDTOs: ko.mapping.toJS(ko.mapping.fromJS(self.applicantObject().identityInfo.identityInfo))
        };
        if (!payload.identificationDTOs[0].id) {
          payload.identificationDTOs.splice(0, 1);
        }
        if (self.applicantObject().applicantType() !== "customer") {
          IdentityInfoModel.saveModel(ko.toJSON(payload)).then(function(data) {
            if (data.identifications) {
              self.applicantObject().identityInfo.identityInfo[0].identificationId = data.identifications[0].identificationId;
            }
            self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
            identityInfoCopy = ko.toJSON(self.applicantObject().identityInfo.identityInfo);
          });
        } else {
          for (var i = 0; i < rootParams.applicantStages; i++) {
            if (rootParams.applicantStages[i].id === "identity-info") {
              break;
            }
          }
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
        }
      } else {
        identityInfoTracker.showMessages();
        identityInfoTracker.focusOn("@firstInvalidShown");
      }
    };
    self.identitytypeChanged = function(event, data) {
      if (data.option === "value") {
        self.existingIdentitiesLoaded(false);
        var identityType = self.applicantObject().identityInfo.identityInfo[1].type;
        if (identityType === "MCC") {
          self.stateofIssueRequired(false);
        } else {
          self.stateofIssueRequired(true);
        }
        self.applicantObject().identityInfo.identityInfo[1].id = "";
        self.applicantObject().identityInfo.identityInfo[1].expiryDate = "";
        self.applicantObject().identityInfo.identityInfo[1].placeOfIssue = "";
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
    self.ssnNumberFocusIn = function(event) {
      var val = self.applicantObject().identityInfo.identityInfo[0].id;
      event.target.value = self.applyPattern(val, [
        3,
        2,
        4
      ], 0);
    };

    self.ssnNumberFocusOut = function(event) {

      if (event.target.value === "xxx-xx-xxxx" && self.applicantObject().identityInfo.identityInfo[0].id.length === 9) {
        return true;
      }
      self.applicantObject().identityInfo.identityInfo[0].id = event.target.value.replace(/\-|\D/g, "");
      if (self.applicantObject().identityInfo.identityInfo[0].id.length < 9) {
        event.target.value = self.applicantObject().identityInfo.identityInfo[0].id;
      } else {
        event.target.value = event.target.value.replace(/[^\-]/g, "x");
        var val = self.applicantObject().identityInfo.identityInfo[0].id;
        var len = val.length >= 5 ? 5 : val.length;
        self.applicantObject().identityInfo.selectedValues().maskedssn = self.applyPattern(self.maskValue(val, len), [
          3,
          2,
          4
        ], 0);
      }
    };
    $(document).on("keyup", "#ssn" + self.coAppNo, function(event) {
      var val = event.target.value.replace(/\-/g, "");
      event.target.value = self.applyPattern(val, [
        3,
        2,
        4
      ], 0);
    });
  };
});
