define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!lzn/gamma/resources/nls/occupation-info",
    "ojs/ojdatetimepicker",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, OccupationInfoModelObject, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, OccupationInfoModel = new OccupationInfoModelObject(), getNewKoModel = function (model) {
                var KoModel = OccupationInfoModel.getNewModel(model);
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
        self.othersLoaded = ko.observable(false);
        self.isCorrectOccupation = ko.observable(false);
        self.employmentStatusToggle = ko.observable(true);
        self.employmentStatusDefault = ko.observable("OPTION_YES");
        self.existingContactLoaded = ko.observable(false);
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
        if (!self.applicantObject().occupationInfo) {
            self.applicantObject().occupationInfo = {
                isCompleting: ko.observable(true),
                occupations: ko.observable({ employmentDTOs: [] }),
                applicantId: self.applicantObject().applicantId().value
            };
        } else {
            self.applicantObject().occupationInfo.occupations({ employmentDTOs: [] });
        }
        self.applicantObject().occupationInfo.workPhoneIndex = -1;
        var contactsPayload = {
            contactDTOs: [{
                    contactType: "WPH",
                    phone: {
                        areaCode: "+1",
                        number: ""
                    }
                }]
        };
        self.applicantObject().occupationInfo.occupations().contactInfo = getNewKoModel().contactInfo;
        self.initializeModel = function () {
            OccupationInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value);
            OccupationInfoModel.getExistingOccupations().then(function (data) {
                var empData = data;
                self.applicantObject().occupationInfo.occupations().primaryEmp = 0;
                if (data.employmentProfiles) {
                    self.applicantObject().occupationInfo.occupations().employmentDTOs = data.employmentProfiles;
                    if (!self.applicantObject().occupationInfo.occupations().employmentDTOs[0].type) {
                        self.applicantObject().occupationInfo.occupations().employmentDTOs[0].type = "EM";
                    } else {
                        for (var j = 0; j < data.employmentProfiles.length; j++) {
                            if (data.employmentProfiles[j].isPrimary) {
                                self.applicantObject().occupationInfo.occupations().primaryEmp = j;
                                if (self.applicantObject().occupationInfo.occupations().employmentDTOs[j].type === "EM" || self.applicantObject().occupationInfo.occupations().employmentDTOs[j].type === "SE") {
                                    self.employmentStatusDefault("OPTION_YES");
                                    self.employmentStatusToggle(true);
                                } else {
                                    self.employmentStatusDefault("OPTION_NO");
                                    self.employmentStatusToggle(false);
                                }
                            }
                        }
                    }
                } else {
                    self.applicantObject().occupationInfo.occupations().employmentDTOs.push(getNewKoModel().employmentDTOs[0]);
                }
                OccupationInfoModel.getExistingContacts().done(function (data) {
                    if (data.applicantContacts) {
                        self.applicantObject().occupationInfo.occupations().contactInfo.contactDTOs = data.applicantContacts;
                        for (var o = 0; o < data.applicantContacts.length; o++) {
                            if (data.applicantContacts[o].contactType === "WPH") {
                                self.applicantObject().occupationInfo.workPhoneIndex = o;
                            }
                        }
                        if (self.applicantObject().occupationInfo.workPhoneIndex === -1) {
                            self.applicantObject().occupationInfo.occupations().contactInfo.contactDTOs.push(contactsPayload.contactDTOs[0]);
                            self.applicantObject().occupationInfo.workPhoneIndex = self.applicantObject().occupationInfo.occupations().contactInfo.contactDTOs.length - 1;
                        } else {
                            self.applicantObject().occupationInfo.occupations().contactInfo.contactDTOs[self.applicantObject().occupationInfo.workPhoneIndex].phone.number = self.formatPhoneNumber(self.applicantObject().occupationInfo.occupations().contactInfo.contactDTOs[self.applicantObject().occupationInfo.workPhoneIndex].phone.number);
                        }
                    } else {
                        self.applicantObject().occupationInfo.occupations().contactInfo.contactDTOs = [];
                        self.applicantObject().occupationInfo.occupations().contactInfo.contactDTOs.push(contactsPayload.contactDTOs[0]);
                        self.applicantObject().occupationInfo.workPhoneIndex = 0;
                    }
                    if (!self.applicantObject().newApplicant) {
                        if (self.employmentStatusToggle() === true) {
                            var showComplete = false;
                            var isWorkPhonePresent = data.applicantContacts && data.applicantContacts[self.applicantObject().occupationInfo.workPhoneIndex] && data.applicantContacts[self.applicantObject().occupationInfo.workPhoneIndex].phone;
                            if (empData.employmentProfiles && isWorkPhonePresent && data.applicantContacts[self.applicantObject().occupationInfo.workPhoneIndex].phone.number) {
                                showComplete = true;
                            }
                            self.showIcon(showComplete, rootParams.applicantStages);
                        } else {
                            self.showIcon(true, rootParams.applicantStages);
                        }
                    }
                    self.existingContactLoaded(true);
                });
                self.existingOccupationsLoaded(true);
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
        self.editOccupationInfo = function (data, currentOccupation) {
            var i;
            for (i = 0; i < data.occupations().employmentDTOs.length; i++) {
                if (data.occupations().employmentDTOs[i].temp_isActive()) {
                    return;
                }
            }
            if (currentOccupation.type.toUpperCase() === "OTHER") {
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
        self.completeOccupationsSection = function () {
            self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
        };
        self.addOccupationInfo = function () {
            rootParams.baseModel.showComponentValidationErrors(self.validationTracker());
        };
        self.currentEmploymentStatus = function (event) {
            if (event.detail.value === "OPTION_NO") {
                self.employmentStatusToggle(false);
                self.applicantObject().occupationInfo.occupations().employmentDTOs[self.applicantObject().occupationInfo.occupations().primaryEmp].type = "UN";
                self.applicantObject().occupationInfo.occupations().employmentDTOs[self.applicantObject().occupationInfo.occupations().primaryEmp].employerName = "";
                self.applicantObject().occupationInfo.occupations().contactInfo.contactDTOs[self.applicantObject().occupationInfo.workPhoneIndex].phone.number = "";
            }
            if (event.detail.value=== "OPTION_YES") {
                self.employmentStatusToggle(true);
                self.applicantObject().occupationInfo.occupations().employmentDTOs[self.applicantObject().occupationInfo.occupations().primaryEmp].type = "EM";
            }
        };
        self.formatPhoneNumber = function (val) {
            var newVal = "";
            var count = 0;
            while (val.length > 0) {
                if (count === 0) {
                    if (val.length > 3) {
                        newVal += "(" + val.substr(0, 3) + ")";
                    } else {
                        newVal += "(" + val.substr(0, 3);
                    }
                    count++;
                    val = val.substr(3);
                } else if (count === 1) {
                    if (val.length > 3) {
                        newVal += val.substr(0, 3) + "-";
                    } else {
                        newVal += val.substr(0, 3);
                    }
                    count++;
                    val = val.substr(3);
                    break;
                }
            }
            newVal += val;
            return newVal;
        };
        $(document).on("keyup", "#workPhoneNumber", function () {
            var val = this.value.replace(/\D/g, "");
            $("#workPhoneNumber").attr("maxlength", 13);
            this.value = self.formatPhoneNumber(val);
        });
        self.submitOccupationInfo = function (data) {
          var tracker = document.getElementById("payday-occupation-tracker");
  if (tracker.valid === "valid") {
    if (data.occupations().employmentDTOs.length > 0) {
        var employmentDTOsTemp;
        employmentDTOsTemp = data.occupations().employmentDTOs;
        var payload = { employmentDTOs: employmentDTOsTemp };
        var payloadUpdate = data.occupations().employmentDTOs[self.applicantObject().occupationInfo.occupations().primaryEmp];
        if (self.applicantObject().occupationInfo.occupations().employmentDTOs[self.applicantObject().occupationInfo.occupations().primaryEmp].id) {
            OccupationInfoModel.updateModel(ko.toJSON(payloadUpdate), self.applicantObject().occupationInfo.occupations().employmentDTOs[self.applicantObject().occupationInfo.occupations().primaryEmp].id).then(function () {
                self.completeOccupationsSection();
            });
        } else {
          OccupationInfoModel.saveModel(ko.mapping.toJSON(payload, {"ignore": ["contactInfo","primaryEmp"]})).then(function(data) {
                if (data.employmentProfiles) {
                    if (!data.employmentProfiles[0].isPrimary) {
                        data.employmentProfiles.reverse();
                    }
                    for (var i = 0; i < data.employmentProfiles.length; i++) {
                        self.applicantObject().occupationInfo.occupations().employmentDTOs[i].id = data.employmentProfiles[i].id;
                    }
                }
                self.completeOccupationsSection();
            });
        }
        var contactsPayload = { contactDTOs: [] };
        OccupationInfoModel.getExistingContacts().done(function (data) {
            var mobilePhoneObject = ko.utils.arrayFilter(data.applicantContacts, function (contact) {
                if (contact.contactType === "HMO") {
                    return contact;
                }
            });
            var homePhoneObject = ko.utils.arrayFilter(data.applicantContacts, function (contact) {
                if (contact.contactType === "HPH") {
                    return contact;
                }
            });
            var emailObject = ko.utils.arrayFilter(data.applicantContacts, function (contact) {
                if (contact.contactType === "PEM") {
                    return contact;
                }
            });
            if (mobilePhoneObject.length > 0 && mobilePhoneObject[0].phone.number) {
                contactsPayload.contactDTOs.push(mobilePhoneObject[0]);
            }
            if (homePhoneObject.length > 0 && homePhoneObject[0].phone.number) {
                contactsPayload.contactDTOs.push(homePhoneObject[0]);
            }
            if (emailObject.length > 0 && emailObject[0].email) {
                contactsPayload.contactDTOs.push(emailObject[0]);
            }
            if (self.applicantObject().occupationInfo.occupations().contactInfo.contactDTOs[self.applicantObject().occupationInfo.workPhoneIndex].phone.number) {
                self.applicantObject().occupationInfo.occupations().contactInfo.contactDTOs[self.applicantObject().occupationInfo.workPhoneIndex].phone.number = self.applicantObject().occupationInfo.occupations().contactInfo.contactDTOs[self.applicantObject().occupationInfo.workPhoneIndex].phone.number.replace(/\D/g, "");
                contactsPayload.contactDTOs.push(self.applicantObject().occupationInfo.occupations().contactInfo.contactDTOs[self.applicantObject().occupationInfo.workPhoneIndex]);
            }
            OccupationInfoModel.saveContactModel(ko.toJSON(contactsPayload));
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
