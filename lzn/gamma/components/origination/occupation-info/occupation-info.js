define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/gamma/resources/nls/occupation-info",
  "ojs/ojdatetimepicker",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, OccupationInfoModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      OccupationInfoModel = new OccupationInfoModelObject(),
      getNewKoModel = function(model) {
        var KoModel = OccupationInfoModel.getNewModel(model);
        KoModel.employmentDTOs[0].temp_isActive = ko.observable(KoModel.employmentDTOs[0].temp_isActive);
        KoModel.employmentDTOs[0].temp_startDateMonths = ko.observable(KoModel.employmentDTOs[0].temp_startDateMonths);
        KoModel.employmentDTOs[0].temp_startDateYears = ko.observable(KoModel.employmentDTOs[0].temp_startDateYears);
        KoModel.employmentDTOs[0].temp_selectedValues = ko.observable(KoModel.employmentDTOs[0].temp_selectedValues);
        KoModel.employmentDTOs[0].temp_setProfileStatus = ko.observable(KoModel.employmentDTOs[0].temp_setProfileStatus);
        KoModel.employmentDTOs[0].temp_isStatusEligible = ko.observable(KoModel.employmentDTOs[0].temp_isStatusEligible);
        if (model && model.id) {
          KoModel.employmentDTOs[0].id = model.id;
        }
        return KoModel;
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.applicantObject = ko.observable(rootParams.applicantObject);
    self.resource = resourceBundle;
    rootParams.baseModel.registerElement("address-input");
    self.statusTypes = {};
    self.groupValid = ko.observable();
    self.currentStatusForType = ko.observable();
    self.occupations = ko.observableArray([]);
    self.statuses = ko.observableArray([]);
    self.countryOptions = ko.observableArray([]);
    self.stateOptions = ko.observableArray([]);
    self.occupationLoaded = ko.observable(false);
    self.statusLoaded = ko.observable(false);
    self.employmentStability = "";
    self.statesChanged = ko.observable(false);
    self.countryDataLoaded = ko.observable(false);
    self.validationTracker = ko.observable();
    self.displayOccupationList = ko.observable(true);
    self.existingOccupationsLoaded = ko.observable(false);
    self.isAddressLoaded = ko.observable(true);
    self.isCorrectOccupation = ko.observable(false);
    self.years = 100;
    rootParams.baseModel.registerComponent("tenure-since", "autoloan");
    rootParams.baseModel.registerElement("amount-input");
    self.isPrimaryData = ko.observableArray([{
        "label": "OPTION_YES",
        "value": "0"
      },
      {
        "label": "OPTION_NO",
        "value": "1"
      }
    ]);
    if (!self.applicantObject().occupationInfo) {
      self.applicantObject().occupationInfo = {
        isCompleting: ko.observable(true),
        occupations: ko.observable({
          employmentDTOs: []
        }),
        applicantId: self.applicantObject().applicantId().value
      };
    } else {
      self.applicantObject().occupationInfo.occupations({
        employmentDTOs: []
      });
    }
    self.initializeModel = function() {
      OccupationInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value);
      OccupationInfoModel.getCountryList().then(function(data) {
        self.countryOptions(data.enumRepresentations[0].data);
        self.stateOptions(data.enumRepresentations[0].data.states);
        self.countryDataLoaded(true);
        self.statesChanged(true);
      });
      OccupationInfoModel.fetchBankPolicyTemplate().then(function(data) {
        self.employmentStability = data.employmentStability;
      });
      OccupationInfoModel.fetchOccupationStatusAndType().then(function(data) {
        var index = 0;
        self.statusLoaded(false);
        for (index = 0; index < data.employmentTypeDTOs.length; index++) {
          self.occupations().push({
            "ordinal": data.employmentTypeDTOs[index].ordinalNumber,
            "value": data.employmentTypeDTOs[index].value,
            "description": data.employmentTypeDTOs[index].name,
            "code": data.employmentTypeDTOs[index].representation
          });
          self.statusTypes[data.employmentTypeDTOs[index].representation] = data.employmentTypeDTOs[index].employmentStatusDTO;
        }
        self.occupationLoaded(true);
        OccupationInfoModel.getExistingOccupations().then(function(data) {
          if (!self.applicantObject().newApplicant) {
            if ((data.employmentProfiles[0].type === "EM" || data.employmentProfiles[0].type === "SE") && !data.employmentProfiles[0].startDate) {
              self.showIcon(false, rootParams.applicantStages);
            } else {
              self.showIcon(true, rootParams.applicantStages);
            }
          }
          var i;
          if (data.employmentProfiles) {
            if (!data.employmentProfiles[0].isPrimary) {
              data.employmentProfiles.reverse();
            }
            for (i = 0; i < data.employmentProfiles.length; i++) {
              data.employmentProfiles[i] = getNewKoModel(data.employmentProfiles[i]).employmentDTOs[0];
              if (data.employmentProfiles[i].type) {
                self.statuses()[i] = [];
                self.currentStatusForType(self.statusTypes[data.employmentProfiles[i].type]);
                for (index = 0; index < self.currentStatusForType().length; index++) {
                  self.statuses()[i].push({
                    code: self.currentStatusForType()[index].representation,
                    description: self.currentStatusForType()[index].name
                  });
                }
                data.employmentProfiles[i].temp_isActive(false);
                data.employmentProfiles[i].temp_setProfileStatus(data.employmentProfiles[i].isPrimary);
                data.employmentProfiles[i].temp_selectedValues({
                  type: rootParams.baseModel.getDescriptionFromCode(self.occupations(), data.employmentProfiles[i].type),
                  status: rootParams.baseModel.getDescriptionFromCode(self.statuses()[i], data.employmentProfiles[i].status)
                });
              }
              if (data.employmentProfiles[i].startDate) {
                data.employmentProfiles[i].startDate = data.employmentProfiles[i].startDate.substring(0, 10);
                data.employmentProfiles[i].temp_startDateYears(data.employmentProfiles[i].startDate.substring(0, 4));
                data.employmentProfiles[i].temp_startDateMonths(data.employmentProfiles[i].startDate.substring(5, 7));
              }
              if (data.employmentProfiles[i].endDate) {
                data.employmentProfiles[i].endDate = data.employmentProfiles[i].endDate.substring(0, 10);
              }
            }
            self.applicantObject().occupationInfo.occupations().employmentDTOs = data.employmentProfiles;
            for (var j = 0; j < self.applicantObject().occupationInfo.occupations().employmentDTOs.length; j++) {
              if (self.applicantObject().occupationInfo.occupations().employmentDTOs[j].type === "EM" || self.applicantObject().occupationInfo.occupations().employmentDTOs[j].type === "SE") {
                self.applicantObject().occupationInfo.occupations().employmentDTOs[j].temp_isStatusEligible(true);
              } else {
                self.applicantObject().occupationInfo.occupations().employmentDTOs[j].temp_isStatusEligible(false);
              }
            }
            self.statusLoaded(true);
          } else {
            self.applicantObject().occupationInfo.occupations().employmentDTOs.push(getNewKoModel().employmentDTOs[0]);
            if (self.applicantObject().occupationInfo.occupations().employmentDTOs.length === 1) {
              self.applicantObject().occupationInfo.occupations().employmentDTOs[0].temp_setProfileStatus(true);
              self.applicantObject().occupationInfo.occupations().employmentDTOs[0].isPrimary = true;
            } else {
              self.applicantObject().occupationInfo.occupations().employmentDTOs[self.applicantObject().occupationInfo.occupations().employmentDTOs.length - 1].temp_setProfileStatus(false);
            }
          }
          self.existingOccupationsLoaded(true);
        });
      });
    };
    self.initializeModel();
    self.checkEmploymentStartDate = function(index, event) {
      if (event.detail.value && index === 0 && self.applicantObject().occupationInfo.occupations().employmentDTOs[index].temp_startDateMonths() && self.applicantObject().occupationInfo.occupations().employmentDTOs[index].temp_startDateYears()) {
        var dateData = self.applicantObject().occupationInfo.occupations().employmentDTOs[index].temp_startDateYears() + self.applicantObject().occupationInfo.occupations().employmentDTOs[index].temp_startDateMonths() + "01";
        OccupationInfoModel.checkEmploymentStartDate(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, dateData).fail(function(data) {
          if (data.responseJSON && data.responseJSON.message && data.responseJSON.message.validationError && data.responseJSON.message.validationError[0].errorCode === "DIGX_PI_0107") {
            self.addOccupation(0, self.applicantObject().occupationInfo);
          }
        }).done(function() {
          if (self.applicantObject().occupationInfo.occupations().employmentDTOs[1]) {
            self.deleteOccupation(1, self.applicantObject().occupationInfo);
          }
        });
      }
    };
    self.deleteOccupation = function(index, data) {
      if (data.occupations().employmentDTOs[index].id) {
        OccupationInfoModel.deleteModel(data.occupations().employmentDTOs[index].id);
      }
      self.existingOccupationsLoaded(false);
      data.occupations().employmentDTOs.splice(index, 1);
      ko.tasks.runEarly();
      self.existingOccupationsLoaded(true);
    };
    self.updateStatuses = function(index, event) {
      var i;
      if (event.detail.value) {
        self.statusLoaded(false);
        self.statuses()[index] = [];
        self.currentStatusForType(self.statusTypes[event.detail.value]);
        for (i = 0; i < self.currentStatusForType().length; i++) {
          self.statuses()[index].push({
            code: self.currentStatusForType()[i].representation,
            description: self.currentStatusForType()[i].name
          });
        }
        self.applicantObject().occupationInfo.occupations().employmentDTOs[index].employerName = "";
        self.applicantObject().occupationInfo.occupations().employmentDTOs[index].startDate = "";
        self.applicantObject().occupationInfo.occupations().employmentDTOs[index].temp_startDateYears("");
        self.applicantObject().occupationInfo.occupations().employmentDTOs[index].temp_startDateMonths("");
        self.applicantObject().occupationInfo.occupations().employmentDTOs[index].endDate = "";
        self.applicantObject().occupationInfo.occupations().employmentDTOs[index].status = "";
        self.applicantObject().occupationInfo.occupations().employmentDTOs[index].type = self.applicantObject().occupationInfo.occupations().employmentDTOs[index].type;
        if (event.detail.value === "EM" || event.detail.value === "SE") {
          self.applicantObject().occupationInfo.occupations().employmentDTOs[index].temp_isStatusEligible(true);
        } else {
          self.applicantObject().occupationInfo.occupations().employmentDTOs[index].temp_isStatusEligible(false);
        }
        ko.tasks.runEarly();
        self.statusLoaded(true);
      }
    };
    self.addOccupation = function(index, data) {
      self.existingOccupationsLoaded(false);
      data.occupations().employmentDTOs.push(getNewKoModel().employmentDTOs[0]);
      if (data.occupations().employmentDTOs.length === 1) {
        data.occupations().employmentDTOs[0].temp_setProfileStatus(true);
        data.occupations().employmentDTOs[0].isPrimary = true;
      } else {
        data.occupations().employmentDTOs[data.occupations().employmentDTOs.length - 1].temp_setProfileStatus(false);
      }
      ko.tasks.runEarly();
      self.existingOccupationsLoaded(true);
    };
    self.displayAddOccupationButton = function(data) {
      for (var i = 0; i < data.occupations().employmentDTOs.length; i++) {
        if (data.occupations().employmentDTOs[i].temp_isActive()) {
          return false;
        }
      }
      return true;
    };
    self.completeOccupationsSection = function() {
      self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
    };
    self.addOccupationInfo = function(data) {
      var tracker = document.getElementById("tracker");
      if (tracker.valid === "valid") {
        for (var i = 0; i < data.occupations().employmentDTOs.length; i++) {
          if (!data.occupations().employmentDTOs[i].endDate) {
            data.occupations().employmentDTOs[i].profileStatus = "CURRENT";
          } else {
            data.occupations().employmentDTOs[i].profileStatus = "PREVIOUS";
          }
          data.occupations().employmentDTOs[i].type = ko.utils.unwrapObservable(data.occupations().employmentDTOs[i].type);
          data.occupations().employmentDTOs[i].status = ko.utils.unwrapObservable(data.occupations().employmentDTOs[i].status);
          if (self.applicantObject().occupationInfo.occupations().employmentDTOs[i].temp_isActive()) {
            self.applicantObject().occupationInfo.occupations().employmentDTOs[i].temp_selectedValues().type = rootParams.baseModel.getDescriptionFromCode(self.occupations(), self.applicantObject().occupationInfo.occupations().employmentDTOs[i].type);
            self.applicantObject().occupationInfo.occupations().employmentDTOs[i].temp_selectedValues().status = rootParams.baseModel.getDescriptionFromCode(self.statuses()[i], self.applicantObject().occupationInfo.occupations().employmentDTOs[i].status);
            self.applicantObject().occupationInfo.occupations().employmentDTOs[i].temp_isActive(false);
          }
        }

      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }

    };
    self.submitOccupationInfo = function(data) {
      var tracker = document.getElementById("occupation-tracker");
      if (tracker.valid === "valid") {
        if (data.occupations().employmentDTOs.length > 0 || (self.productDetails().productClassName === "LOANS" || self.productDetails().productClassName === "CREDIT_CARD")) {
          for (var i = 0; i < data.occupations().employmentDTOs.length; i++) {
            data.occupations().employmentDTOs[i].id=self.applicantObject().occupationInfo.occupations().employmentDTOs[i].id;
            if (!data.occupations().employmentDTOs[i].endDate) {
              data.occupations().employmentDTOs[i].profileStatus = "CURRENT";
            } else {
              data.occupations().employmentDTOs[i].profileStatus = "PREVIOUS";
            }
            data.occupations().employmentDTOs[i].type = ko.utils.unwrapObservable(data.occupations().employmentDTOs[i].type);
            data.occupations().employmentDTOs[i].status = ko.utils.unwrapObservable(data.occupations().employmentDTOs[i].status);
            data.occupations().employmentDTOs[i].temp_selectedValues().type = rootParams.baseModel.getDescriptionFromCode(self.occupations(), data.occupations().employmentDTOs[i].type);
            data.occupations().employmentDTOs[i].temp_selectedValues().status = rootParams.baseModel.getDescriptionFromCode(self.statuses()[i], data.occupations().employmentDTOs[i].status);
            if (data.occupations().employmentDTOs[i].type.toUpperCase() === "OTHERS") {
              data.occupations().employmentDTOs[i].employerName = "Not_Applicable";
            }
            if (data.occupations().employmentDTOs[i].temp_startDateYears() && data.occupations().employmentDTOs[i].temp_startDateMonths()) {
              data.occupations().employmentDTOs[i].startDate = rootParams.baseModel.format(self.resource.date, {
                yyyy: data.occupations().employmentDTOs[i].temp_startDateYears(),
                mm: data.occupations().employmentDTOs[i].temp_startDateMonths(),
                dd: "01"
              });
            } else {
              data.occupations().employmentDTOs[i].startDate = "";
            }
          }
          OccupationInfoModel.saveModel(ko.mapping.toJSON(data.occupations(), {"ignore": ["temp_isActive","temp_isStatusEligible","temp_selectedValues","temp_setProfileStatus","temp_startDateMonths","temp_startDateYears"]})).then(function(data) {
            if (data.employmentProfiles) {
              if (!data.employmentProfiles[0].isPrimary) {
                data.employmentProfiles.reverse();
              }
              for (i = 0; i < data.employmentProfiles.length; i++) {
                self.applicantObject().occupationInfo.occupations().employmentDTOs[i].id = data.employmentProfiles[i].id;
              }
            }
            self.productDetails().sectionBeingEdited("");
            self.completeOccupationsSection();
          }).fail(function(data) {
            if (data.responseJSON && data.responseJSON.message && data.responseJSON.message.validationError && data.responseJSON.message.validationError[0].errorCode === "DIGX_PI_0107") {
              self.addOccupation(0, self.applicantObject().occupationInfo);
            }
          });
        } else {
          self.completeOccupationsSection();
        }

      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }

    };
  };
});
