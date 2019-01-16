define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!lzn/beta/resources/nls/occupation-info",
    "ojs/ojdatetimepicker"
], function (oj, ko, $, OccupationInfoModelObject, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, OccupationInfoModel = new OccupationInfoModelObject(), getNewKoModel = function (model) {
                var KoModel = OccupationInfoModel.getNewModel(model);
                KoModel.employmentDTOs[0].temp_isActive = ko.observable(KoModel.employmentDTOs[0].temp_isActive);
                KoModel.employmentDTOs[0].temp_selectedValues = ko.observable(KoModel.employmentDTOs[0].temp_selectedValues);
                KoModel.employmentDTOs[0].temp_setProfileStatus = ko.observable(KoModel.employmentDTOs[0].temp_setProfileStatus);
                KoModel.employmentDTOs[0].temp_isTypeDisable = ko.observable(KoModel.employmentDTOs[0].temp_isTypeDisable);
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
        self.othersLoaded = ko.observable(false);
        self.isCorrectOccupation = ko.observable(false);
        rootParams.baseModel.registerElement("amount-input");
        self.isPrimaryData = ko.observableArray([
            {
                "label": "OPTION_YES",
                "value": "0"
            },
            {
                "label": "OPTION_NO",
                "value": "1"
            }
        ]);
        self.validateEmployerName = ko.pureComputed(function() {
          return [{
            type: "length",
            options: {
              min: 1,
              max: 50
            }
          }];
        });

        self.validateStartDate = ko.pureComputed(function() {
          return [{
            type: "datetimeRange",
            options: {
              max: self.todayIsoDate,
              hint: {},
              displayOptions: {
                validatorHint: "none"
              },
              messageDetail: {
                rangeOverflow: rootParams.baseModel.format(self.resource.messages.employmentStartdateError, {
                  currdate: self.currdate
                })
              }
            }
          }];
        });


        if (!self.applicantObject().occupationInfo) {
            self.applicantObject().occupationInfo = {
                isCompleting: ko.observable(true),
                occupations: ko.observable({ employmentDTOs: [] }),
                applicantId: self.applicantObject().applicantId().value
            };
        } else {
            self.applicantObject().occupationInfo.occupations({ employmentDTOs: [] });
        }
        self.initializeModel = function () {
            OccupationInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value);
            OccupationInfoModel.getCountryList().then(function (data) {
                self.countryOptions(data.enumRepresentations[0].data);
                self.stateOptions(data.enumRepresentations[0].data.states);
                self.countryDataLoaded(true);
                self.statesChanged(true);
            });
            if (!(self.productDetails().productClassName === "CASA" || self.productDetails().productClassName === "TERM_DEPOSITS")) {
                OccupationInfoModel.fetchBankPolicyTemplate().then(function (data) {
                    self.employmentStability = data.employmentStability;
                });
            }
            OccupationInfoModel.fetchOccupationStatusAndType().then(function (data) {
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
                OccupationInfoModel.getExistingOccupations().then(function (data) {
                    var i;
                    if (data.employmentProfiles) {
                        if (!data.employmentProfiles[0].isPrimary) {
                            data.employmentProfiles.reverse();
                        }
                        for (i = 0; i < data.employmentProfiles.length; i++) {
                            data.employmentProfiles[i] = getNewKoModel(data.employmentProfiles[i]).employmentDTOs[0];
                            self.statuses().length = 0;
                            self.currentStatusForType(self.statusTypes[data.employmentProfiles[i].type]);
                            for (index = 0; index < self.currentStatusForType().length; index++) {
                                self.statuses().push({
                                    code: self.currentStatusForType()[index].representation,
                                    description: self.currentStatusForType()[index].name
                                });
                            }
                            data.employmentProfiles[i].temp_isActive(false);
                            data.employmentProfiles[i].startDate = data.employmentProfiles[i].startDate.substring(0, 10);
                            if (data.employmentProfiles[i].type.toUpperCase() === "OTHERS") {
                                self.othersLoaded(true);
                            }
                            if (data.employmentProfiles[i].endDate) {
                                data.employmentProfiles[i].endDate = data.employmentProfiles[i].endDate.substring(0, 10);
                            }
                            data.employmentProfiles[i].temp_setProfileStatus(data.employmentProfiles[i].isPrimary);
                            data.employmentProfiles[i].temp_selectedValues({
                                type: rootParams.baseModel.getDescriptionFromCode(self.occupations(), data.employmentProfiles[i].type),
                                status: rootParams.baseModel.getDescriptionFromCode(self.statuses(), data.employmentProfiles[i].status)
                            });
                            data.employmentProfiles[i].temp_isTypeDisable(false);
                        }
                        self.applicantObject().occupationInfo.occupations().employmentDTOs = data.employmentProfiles;
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
                    self.displayDisclosure(false);
                });
            });
        };
        self.initializeModel();
        self.validateEmploymentProfile = function () {
            OccupationInfoModel.validateEmployment(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, self.successHanldervalidateEmployment);
        };
        self.successHanldervalidateEmployment = function (data) {
            if (data.employmentProfiles) {
                self.applicantObject().financialProfile = [];
                self.employmentProfileIds = ko.observableArray();
                for (var i = 0; i < data.employmentProfiles.length; i++) {
                    self.employmentProfileIds().push(data.employmentProfiles[i].id);
                    self.applicantObject().financialProfile.push({
                        profileId: data.employmentProfiles[i].id,
                        type: data.employmentProfiles[i].type
                    });
                }
            }
            self.completeOccupationsSection();
        };
        self.updateStatuses = function (index, event) {
            var i;
            if (event.detail.value) {
                self.statusLoaded(false);
                self.statuses().length = 0;
                self.currentStatusForType(self.statusTypes[event.detail.value]);
                for (i = 0; i < self.currentStatusForType().length; i++) {
                    self.statuses().push({
                        code: self.currentStatusForType()[i].representation,
                        description: self.currentStatusForType()[i].name
                    });
                }
                if (event.detail.value.toUpperCase() === "OTHERS") {
                    self.othersLoaded(true);
                } else {
                    self.othersLoaded(false);
                }
                self.applicantObject().occupationInfo.occupations().employmentDTOs[index].employerName = "";
                self.applicantObject().occupationInfo.occupations().employmentDTOs[index].startDate = "";
                self.applicantObject().occupationInfo.occupations().employmentDTOs[index].endDate = "";
                self.applicantObject().occupationInfo.occupations().employmentDTOs[index].status = "";
                ko.tasks.runEarly();
                self.statusLoaded(true);
            }
        };
        self.addOccupation = function (index, data) {
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
        self.deleteOccupation = function (index, data, currentData) {
            if (currentData.id) {
                OccupationInfoModel.deleteModel(currentData.id);
            }
            self.existingOccupationsLoaded(false);
            data.occupations().employmentDTOs.splice(index, 1);
            ko.tasks.runEarly();
            self.existingOccupationsLoaded(true);
        };
        self.editOccupationInfo = function (data, currentOccupation) {
            var i;
            for (i = 0; i < data.occupations().employmentDTOs.length; i++) {
                if (data.occupations().employmentDTOs[i].temp_isActive()) {
                    return;
                }
            }
            if (currentOccupation.type.toUpperCase() === "OTHERS") {
                self.isAddressLoaded(false);
            } else {
                self.isAddressLoaded(true);
            }
            currentOccupation.temp_setProfileStatus = ko.observable(currentOccupation.isPrimary);
            if (!currentOccupation.temp_setProfileStatus()) {
                data.endDate = currentOccupation.endDate;
                currentOccupation.isPrimary = false;
            }
            currentOccupation.temp_isActive(true);
        };
        self.displayAddOccupationButton = function (data) {
            for (var i = 0; i < data.occupations().employmentDTOs.length; i++) {
                if (data.occupations().employmentDTOs[i].temp_isActive()) {
                    return false;
                }
            }
            return true;
        };
        self.completeOccupationsSection = function () {
            self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
        };
        self.addOccupationInfo = function (data) {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
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
                    self.applicantObject().occupationInfo.occupations().employmentDTOs[i].temp_selectedValues().status = rootParams.baseModel.getDescriptionFromCode(self.statuses(), self.applicantObject().occupationInfo.occupations().employmentDTOs[i].status);
                    self.applicantObject().occupationInfo.occupations().employmentDTOs[i].temp_isActive(false);
                }
            }
        };
        self.submitOccupationInfo = function (data) {
                for (var i = 0; i < data.occupations().employmentDTOs.length; i++) {
                    if (!data.occupations().employmentDTOs[i].endDate) {
                        data.occupations().employmentDTOs[i].profileStatus = "CURRENT";
                    } else {
                        data.occupations().employmentDTOs[i].profileStatus = "PREVIOUS";
                    }
                    data.occupations().employmentDTOs[i].type = ko.utils.unwrapObservable(data.occupations().employmentDTOs[i].type);
                    data.occupations().employmentDTOs[i].status = ko.utils.unwrapObservable(data.occupations().employmentDTOs[i].status);
                    if (data.occupations().employmentDTOs[i].type.toUpperCase() === "OTHERS") {
                        data.occupations().employmentDTOs[i].employerName = "Not_Applicable";
                    }
                }
                OccupationInfoModel.saveModel(ko.mapping.toJSON(data.occupations(), {"ignore": ["temp_isActive","temp_isTypeDisable","temp_selectedValues","temp_setProfileStatus"]})).then(function (data) {
                    if (data.employmentProfiles) {
                        if (!data.employmentProfiles[0].isPrimary) {
                            data.employmentProfiles.reverse();
                        }
                        for (i = 0; i < data.employmentProfiles.length; i++) {
                            self.applicantObject().occupationInfo.occupations().employmentDTOs[i].id = data.employmentProfiles[i].id;
                            self.applicantObject().occupationInfo.occupations().employmentDTOs[i].temp_isTypeDisable(false);
                        }
                    }
                    self.productDetails().sectionBeingEdited("");
                    self.completeOccupationsSection();
                });
        };
    };
});
