define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/alpha/resources/nls/contact-info",
  "ojs/ojvalidationgroup"
], function (oj, ko, $, ContactInfoModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function (rootParams) {
    var self = this,
      ContactInfoModel = new ContactInfoModelObject(),
      i = 0,
      handlerFunctions = {},
      addressList = [],
      callsMade = {
        applicant: 0
      },
      addressTracker = {
        applicant: 0
      },
      batchRequestData = {
        batchDetailRequestList: []
      },
      getNewKoModel = function () {
        var KoModel = ContactInfoModel.getNewModel();
        KoModel.isCompleting = ko.observable(KoModel.isCompleting);
        KoModel.selectedValues = ko.observable(KoModel.selectedValues);
        KoModel.disableInputs = ko.observable(KoModel.disableInputs);
        return KoModel;
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.groupValid = ko.observable();
    self.pluginCompName("row");
    rootParams.baseModel.registerComponent("contact-number", "inputs");
    self.accommodationDataLoaded = ko.observable(false);
    self.accomodationOptions = ko.observable([]);
    self.validationTracker = ko.observable();
    self.isCopyAddress = ko.observable("OPTION_NO");
    self.addressDataLoaded = ko.observable(false);
    self.batchRequestList = ko.observableArray([]);
    self.landlordDetailsRequired = ko.observable(false);
    self.prevlandlordDetailsRequired = ko.observable(false);
    self.phoneTypeListLoaded = ko.observable(false);
    self.phoneTypeList = ko.observableArray();
    self.phonetypeOne = ko.observableArray();
    self.phonetypeTwo = ko.observableArray();
    self.coApplicant = rootParams.coApplicant;
    self.isAlternatePhoneNumber = ko.observable(false);
    self.previousAddressRequired = ko.observable(false);
    self.addressesIds = {
      applicant: []
    };
    self.showPreviousAddress = ko.observable(false);
    self.emailChanged = ko.observable(-1);
    self.existingContactLoaded = ko.observable(false);
    self.alternateNumber = ko.observable("OPTION_NO");
    self.alternateEmail = ko.observable("OPTION_NO");
    self.enableCopyAddress = ko.observable(true);
    self.stayingSinceMessage = ko.observable("");
    self.applicantObject = ko.observable(rootParams.applicantObject);
    if (!self.applicantObject().contactInfo) {
      self.applicantObject().contactInfo = getNewKoModel();
      for (var index = 0; index < self.applicantObject().contactInfo.emails.length; index++) {
        self.applicantObject().contactInfo.emails[index].email = ko.observable("");
        self.applicantObject().contactInfo.emails[index].preferredEmail = ko.observableArray();
      }
      for (var index1 = 0; index1 < self.applicantObject().contactInfo.contactInfo.contacts.length; index1++) {
        self.applicantObject().contactInfo.contactInfo.contacts[index1].preferredNumber = ko.observableArray();
      }
      self.applicantObject().contactInfo.emails[0].preferredEmail(["true"]);
      self.applicantObject().contactInfo.contactInfo.contacts[0].preferredNumber(["true"]);
      if (!self.isRegistered && self.socialMediaResponse() && self.socialMediaResponse().email) {
        self.applicantObject().contactInfo.emails[0].email(self.socialMediaResponse().email);
      }
    }
    self.applicantObject().contactInfo.consent1 = ko.observableArray();
    self.applicantObject().contactInfo.consent2 = ko.observableArray();
    self.applicantObject().contactInfo.showNumberSelection = ko.observable(false);
    self.applicantObject().contactInfo.alertMobileOptions = ko.observableArray();
    self.applicantObject().contactInfo.selectedMobileNumberForAlert = ko.observableArray();
    rootParams.baseModel.registerElement("address-input");
    self.initializeModel = function () {
      ContactInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value);
      ContactInfoModel.getAccomodationTypeList().then(function (data) {
        self.accomodationOptions(data.enumRepresentations[0].data);
        self.accommodationDataLoaded(true);
      });
      ContactInfoModel.getExistingAddresses().then(function (data) {
        if (data.applicantAddressDTO) {
          self.enableCopyAddress(false);
          for (i = 0; i < data.applicantAddressDTO.length; i++) {
            if (data.applicantAddressDTO[i].landlordAddress && data.applicantAddressDTO[i].landlordAddress.postalCode) {
              if (data.applicantAddressDTO[i].status === "CURRENT") {
                self.landlordDetailsRequired(true);
              } else if (data.applicantAddressDTO[i].status === "PAST") {
                self.prevlandlordDetailsRequired(true);
              }
            }
          }
          for (i = 0; i < data.applicantAddressDTO.length; i++) {
            if (data.applicantAddressDTO[i].accomodationType && data.applicantAddressDTO[i].status === "CURRENT") {
              self.applicantObject().contactInfo.contactInfo.address = data.applicantAddressDTO[i];
              if (data.applicantAddressDTO[i].accomodationType) {
                self.applicantObject().contactInfo.selectedValues().accomodationType = rootParams.baseModel.getDescriptionFromCode(self.accomodationOptions(), data.applicantAddressDTO[i].accomodationType);
              }
              if (data.applicantAddressDTO[i].stayingSince) {
                data.applicantAddressDTO[i].stayingSince = data.applicantAddressDTO[i].stayingSince.substring(0, 10);
              }
            } else if (data.applicantAddressDTO[i].status === "PAST") {
              self.applicantObject().previousContactInfo = getNewKoModel();
              self.showPreviousAddress(true);
              self.applicantObject().previousContactInfo.contactInfo.address = data.applicantAddressDTO[i];
              if (data.applicantAddressDTO[i].accomodationType) {
                self.applicantObject().previousContactInfo.selectedValues().accomodationType = rootParams.baseModel.getDescriptionFromCode(self.accomodationOptions(), data.applicantAddressDTO[i].accomodationType);
              }
              self.previousAddressRequired(true);
            }
          }
          for (i = 0; i < data.applicantAddressDTO.length; i++) {
            self.addressesIds.applicant[i] = data.applicantAddressDTO[i].addressId;
          }
          ContactInfoModel.getPhoneTypeList().done(function (data) {
            self.phoneTypeList(ko.mapping.toJS(ko.mapping.fromJS(data.enumRepresentations[0].data)));
            self.phonetypeOne(ko.mapping.toJS(ko.mapping.fromJS(data.enumRepresentations[0].data)));
            self.phonetypeTwo(ko.mapping.toJS(ko.mapping.fromJS(data.enumRepresentations[0].data)));
            ContactInfoModel.getExistingContacts().then(function (data) {
              handlerFunctions.applicantsContactFetched(data);
              self.existingContactLoaded(true);
              self.phoneTypeListLoaded(true);
              self.addressDataLoaded(true);
            });
          });
        } else if (self.applicantObject().applicantType() !== "customer") {
          ContactInfoModel.getPhoneTypeList().done(function (data) {
            self.phoneTypeList(ko.mapping.toJS(ko.mapping.fromJS(data.enumRepresentations[0].data)));
            self.phonetypeOne(ko.mapping.toJS(ko.mapping.fromJS(data.enumRepresentations[0].data)));
            self.phonetypeTwo(ko.mapping.toJS(ko.mapping.fromJS(data.enumRepresentations[0].data)));
            self.existingContactLoaded(true);
            self.phoneTypeListLoaded(true);
            self.addressDataLoaded(true);
          });
        }
      });
    };
    self.initializeModel();
    handlerFunctions.applicantsContactFetched = function (data) {
      if (data.applicantContacts) {
        self.applicantObject().contactInfo.contactInfo.contacts = [];
        self.phoneTypeListLoaded(false);
        for (i = 0; i < data.applicantContacts.length; i++) {
          if (data.applicantContacts[i].contactType !== "PEM" && data.applicantContacts[i].contactType !== "OEM") {
            self.applicantObject().contactInfo.contactInfo.contacts.push(data.applicantContacts[i]);
            if (i === 0 && (data.applicantContacts[i].contactType !== "PEM" && data.applicantContacts[i].contactType !== "OEM")) {
              self.applicantObject().contactInfo.selectedValues().contactType1 = rootParams.baseModel.getDescriptionFromCode(self.phoneTypeList(), data.applicantContacts[i].contactType);
            } else if (i === 1 && (data.applicantContacts[i].contactType !== "PEM" && data.applicantContacts[i].contactType !== "OEM")) {
              if (self.applicantObject().contactInfo.selectedValues().contactType1) {
                self.applicantObject().contactInfo.selectedValues().contactType2 = rootParams.baseModel.getDescriptionFromCode(self.phoneTypeList(), data.applicantContacts[i].contactType);
              } else {
                self.applicantObject().contactInfo.selectedValues().contactType1 = rootParams.baseModel.getDescriptionFromCode(self.phoneTypeList(), data.applicantContacts[i].contactType);
              }
            } else {
              self.applicantObject().contactInfo.selectedValues().contactType2 = rootParams.baseModel.getDescriptionFromCode(self.phoneTypeList(), data.applicantContacts[i].contactType);
            }
            if (self.applicantObject().contactInfo.contactInfo.contacts[self.applicantObject().contactInfo.contactInfo.contacts.length - 1].preferred) {
              self.applicantObject().contactInfo.contactInfo.contacts[self.applicantObject().contactInfo.contactInfo.contacts.length - 1].preferredNumber = ko.observableArray(["true"]);
            } else {
              self.applicantObject().contactInfo.contactInfo.contacts[self.applicantObject().contactInfo.contactInfo.contacts.length - 1].preferredNumber = ko.observableArray([]);
            }
            if (self.applicantObject().contactInfo.contactInfo.contacts[self.applicantObject().contactInfo.contactInfo.contacts.length - 1].preferredForAlert) {
              self.applicantObject().contactInfo.selectedMobileNumberForAlert(self.applicantObject().contactInfo.contactInfo.contacts[self.applicantObject().contactInfo.contactInfo.contacts.length - 1].phone.number);
            }
          }
          if (data.applicantContacts[i].contactType === "PEM") {
            self.applicantObject().contactInfo.emails[0].email(data.applicantContacts[i].email);
            self.applicantObject().contactInfo.emails[0].preferred = data.applicantContacts[i].preferred;
            self.applicantObject().contactInfo.emails[0].electronicCommunicationConsent = data.applicantContacts[i].electronicCommunicationConsent;
            if (data.applicantContacts[i].preferred) {
              self.applicantObject().contactInfo.emails[0].preferredEmail(["true"]);
            } else {
              self.applicantObject().contactInfo.emails[0].preferredEmail([]);
            }
          }
          if (data.applicantContacts[i].contactType === "OEM") {
            self.applicantObject().contactInfo.emails[1].email(data.applicantContacts[i].email);
            self.applicantObject().contactInfo.emails[1].preferred = data.applicantContacts[i].preferred;
            self.applicantObject().contactInfo.emails[1].electronicCommunicationConsent = data.applicantContacts[i].electronicCommunicationConsent;
            if (data.applicantContacts[i].preferred) {
              self.applicantObject().contactInfo.emails[1].preferredEmail(["true"]);
            } else {
              self.applicantObject().contactInfo.emails[1].preferredEmail([]);
            }
          }
        }
        if (self.applicantObject().contactInfo.contactInfo.contacts.length > 1) {
          self.isAlternatePhoneNumber(true);
          self.alternateNumber("OPTION_YES");
          self.changePhoneOptions(self.applicantObject().contactInfo.contactInfo.contacts[0].contactType, self.applicantObject().contactInfo.contactInfo.contacts[1].contactType);
        } else {
          self.applicantObject().contactInfo.contactInfo.contacts.push({
            contactType: "",
            phone: {
              areaCode: "+1",
              number: ""
            }
          });
          self.changePhoneOptions(self.applicantObject().contactInfo.contactInfo.contacts[0].contactType, null);
        }
        if (self.applicantObject().contactInfo.emails.length > 1) {
          self.alternateEmail("OPTION_YES");
        }
        if (self.applicantObject().contactInfo.emails[0].electronicCommunicationConsent) {
          self.applicantObject().contactInfo.consent1(["true"]);
        }
        if (self.applicantObject().contactInfo.contactInfo.contacts[0].consentForReceivingAlert) {
          self.applicantObject().contactInfo.consent2(["true"]);
        }
        var mobileTypes = ["HMO", "WMO"];
        self.applicantObject().contactInfo.alertMobileOptions([]);
        self.applicantObject().contactInfo.showNumberSelection(false);
        for (var index = 0; index < mobileTypes.length; index++) {
          for (var contactIndex = 0; contactIndex < self.applicantObject().contactInfo.contactInfo.contacts.length; contactIndex++) {
            if (self.applicantObject().contactInfo.contactInfo.contacts[contactIndex].contactType === mobileTypes[index]) {
              self.applicantObject().contactInfo.alertMobileOptions.push(self.applicantObject().contactInfo.contactInfo.contacts[contactIndex]);
            }
          }
        }
        if (self.applicantObject().contactInfo.alertMobileOptions().length > 1) {
          self.applicantObject().contactInfo.showNumberSelection(true);
        }
      } else {
        self.phoneTypeListLoaded(true);
      }
      var payLoad = {
        onlineAccessDTO: {
          value: self.applicantObject().contactInfo.emails[0].email
        }
      };
      payLoad = ko.toJSON(payLoad);
      ContactInfoModel.otherDetails(payLoad);
      ko.tasks.runEarly();
      self.phoneTypeListLoaded(true);
    };
    self.toggleCopyAddress = function (event) {
      if (event.detail.value === "OPTION_NO") {
        self.isCopyAddress("OPTION_NO");
        self.applicantObject().contactInfo.contactInfo.address.type = "";
        self.applicantObject().contactInfo.contactInfo.address.accomodationType = "";
        self.applicantObject().contactInfo.contactInfo.address.stayingSince = "";
        self.applicantObject().contactInfo.contactInfo.address.postalAddress.country = "";
        self.applicantObject().contactInfo.contactInfo.address.postalAddress.state = "";
        self.applicantObject().contactInfo.contactInfo.address.postalAddress.city = "";
        self.applicantObject().contactInfo.contactInfo.address.postalAddress.postalCode = "";
        self.applicantObject().contactInfo.contactInfo.address.postalAddress.line1 = "";
        self.applicantObject().contactInfo.contactInfo.address.postalAddress.line2 = "";
        if (self.applicantObject().contactInfo.contactInfo.address.landlordAddress) {
          self.applicantObject().contactInfo.contactInfo.address.landlordAddress.country = "";
          self.applicantObject().contactInfo.contactInfo.address.landlordAddress.state = "";
          self.applicantObject().contactInfo.contactInfo.address.landlordAddress.city = "";
          self.applicantObject().contactInfo.contactInfo.address.landlordAddress.postalCode = "";
          self.applicantObject().contactInfo.contactInfo.address.landlordAddress.line1 = "";
          self.applicantObject().contactInfo.contactInfo.address.landlordAddress.line2 = "";
          self.applicantObject().contactInfo.contactInfo.address.landlordName = "";
          self.applicantObject().contactInfo.contactInfo.address.landlordPhoneNumber.number = "";
        }
        self.enableCopyAddress(true);
        self.addressDataLoaded(false);
        ko.tasks.runEarly();
        self.addressDataLoaded(true);
      }
      if (event.detail.value === "OPTION_YES") {
        self.isCopyAddress("OPTION_YES");
        self.applicantObject().contactInfo.contactInfo.address = ko.mapping.toJS(ko.mapping.fromJS(self.applicantDetails()[0].contactInfo.contactInfo.address));
        self.applicantObject().contactInfo.contactInfo.address.accomodationType = "";
        self.applicantObject().contactInfo.contactInfo.address.stayingSince = "";
        self.enableCopyAddress(true);
        self.addressDataLoaded(false);
        ko.tasks.runEarly();
        self.addressDataLoaded(true);
      }
    };
    self.saveAlternateNumber = function (event) {
      if (event.detail.value === "OPTION_NO") {
        self.isAlternatePhoneNumber(false);
      }
      if (event.detail.value === "OPTION_YES") {
        self.isAlternatePhoneNumber(true);
      }
    };
    var selectedPhoneType = [{},
      {}
    ];
    self.changePhoneOptions = function (phoneType1, phoneType2) {
      var i;
      for (i = 0; i < self.phonetypeTwo().length; i++) {
        if (self.phonetypeTwo()[i].code === phoneType1) {
          selectedPhoneType[1] = self.phonetypeTwo()[i];
          self.phonetypeTwo().splice(i, 1);
          break;
        }
      }
      if (phoneType2 !== null) {
        for (i = 0; i < self.phonetypeOne().length; i++) {
          if (self.phonetypeOne()[i].code === phoneType2) {
            selectedPhoneType[0] = self.phonetypeOne()[i];
            self.phonetypeOne().splice(i, 1);
            break;
          }
        }
      }
      ko.tasks.runEarly();
      self.phoneTypeListLoaded(true);
    };
    self.phoneTypeChangeHandler = function (event) {
      if (event.detail.value) {
        self.phoneTypeListLoaded(false);
        if (event.currentTarget.id === "phoneType1") {
          for (var i = 0; i < self.phonetypeTwo().length; i++) {
            if (self.phonetypeTwo()[i].code === event.detail.value) {
              if (self.phonetypeTwo().length !== self.phoneTypeList().length) {
                self.phonetypeTwo().push(selectedPhoneType[1]);
              }
              selectedPhoneType[1] = self.phonetypeTwo()[i];
              self.phonetypeTwo().splice(i, 1);
              self.applicantObject().contactInfo.contactInfo.contacts[0].phone.number = "";
              ko.tasks.runEarly();
              self.phoneTypeListLoaded(true);
              break;
            }
          }
        } else {
          for (var j = 0; j < self.phonetypeOne().length; j++) {
            if (self.phonetypeOne()[j].code === event.detail.value) {
              if (self.phonetypeOne().length !== self.phoneTypeList().length) {
                self.phonetypeOne().push(selectedPhoneType[0]);
              }
              selectedPhoneType[0] = self.phonetypeOne()[j];
              self.phonetypeOne().splice(j, 1);
              self.applicantObject().contactInfo.contactInfo.contacts[1].phone.number = "";
              ko.tasks.runEarly();
              self.phoneTypeListLoaded(true);
              break;
            }
          }
        }
      }
    };
    if (self.applicantObject().applicantId() && self.applicantObject().applicantId().value.length > 0) {
      if (self.applicantObject().applicantType() === "customer") {
        self.applicantObject().contactInfo.disableInputs(true);
      } else {
        self.applicantObject().contactInfo.disableInputs(false);
      }
    }
    handlerFunctions.contactCreated = function (data) {
      var j;
      callsMade.applicant++;
      if (data.applicantContacts) {
        if (callsMade.applicant >= 1) {
          for (j = 0; j < self.applicantObject().contactInfo.contactInfo.contacts.length; j++) {
            if (self.applicantObject().contactInfo.contactInfo.contacts[j].contactType === data.applicantContacts[0].contactType) {
              self.applicantObject().contactInfo.contactInfo.contacts[j].contactId = data.applicantContacts[0].contactId;
            }
          }
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
        }
      } else {
        self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
      }
    };
    handlerFunctions.applicantAddressCreated = function (data) {
      if (data.applicantAddressDTO) {
        if (data.applicantAddressDTO[0].stayingSince) {
          data.applicantAddressDTO[0].stayingSince = data.applicantAddressDTO[0].stayingSince.substring(0, 10);
        }
        self.applicantObject().addressCopies[self.applicantObject().applicantId().value][addressTracker.applicant] = data.applicantAddressDTO[0];
        self.applicantObject().contactInfo.contactInfo.address = data.applicantAddressDTO[0];
      }
      addressTracker.applicant++;
    };
    self.alertMobileSelectionChanged = function (event) {
      for (var contactIndex = 0; contactIndex < self.applicantObject().contactInfo.contactInfo.contacts.length; contactIndex++) {
        if (self.applicantObject().contactInfo.contactInfo.contacts[contactIndex].phone.number === event.detail.value) {
          self.applicantObject().contactInfo.contactInfo.contacts[contactIndex].preferredForAlert = true;
        } else {
          self.applicantObject().contactInfo.contactInfo.contacts[contactIndex].preferredForAlert = false;
        }
      }
    };
    self.preferredChangeHandler = function (index, type, event) {
      var index1;
      if (event.detail.value && event.detail.value.indexOf("true") > -1) {
        if (type === "email") {
          for (index1 = 0; index1 < self.applicantObject().contactInfo.emails.length; index1++) {
            if (Number(index) !== index1) {
              self.applicantObject().contactInfo.emails[index1].preferredEmail([]);
            }
          }
        }
        if (type === "phoneNumber") {
          for (index1 = 0; index1 < self.applicantObject().contactInfo.contactInfo.contacts.length; index1++) {
            if (Number(index) !== index1) {
              self.applicantObject().contactInfo.contactInfo.contacts[index1].preferredNumber([]);
            }
          }
        }
      }
    };
    self.electronicConsentChanged = function (event) {
      var index;
      if (event.detail.value && event.detail.value.indexOf("true") > -1) {
        for (index = 0; index < self.applicantObject().contactInfo.emails.length; index++) {
          self.applicantObject().contactInfo.emails[index].electronicCommunicationConsent = true;
        }
      } else {
        for (index = 0; index < self.applicantObject().contactInfo.emails.length; index++) {
          self.applicantObject().contactInfo.emails[index].electronicCommunicationConsent = false;
        }
      }
    };
    self.alertConsentChanged = function (event) {
      var mobileTypes = ["HMO", "WMO"],
        pos, index1;
      if (event.detail.value && event.detail.value.indexOf("true") > -1) {
        self.applicantObject().contactInfo.alertMobileOptions([]);
        self.applicantObject().contactInfo.showNumberSelection(false);
        for (var index = 0; index < mobileTypes.length; index++) {
          for (var contactIndex = 0; contactIndex < self.applicantObject().contactInfo.contactInfo.contacts.length; contactIndex++) {
            if (self.applicantObject().contactInfo.contactInfo.contacts[contactIndex].contactType === mobileTypes[index]) {
              self.applicantObject().contactInfo.alertMobileOptions.push(self.applicantObject().contactInfo.contactInfo.contacts[contactIndex]);
              pos = contactIndex;
            }
          }
        }
        if (self.applicantObject().contactInfo.alertMobileOptions().length === 0) {
          rootParams.baseModel.showMessages(null, [self.resource.messages.noMobilePhoneError], "ERROR");
          self.applicantObject().contactInfo.consent2().splice(0);
        } else if (self.applicantObject().contactInfo.alertMobileOptions().length > 1) {
          self.applicantObject().contactInfo.showNumberSelection(true);
        } else {
          self.applicantObject().contactInfo.contactInfo.contacts[pos].preferredForAlert = true;
        }
        for (index1 = 0; index1 < self.applicantObject().contactInfo.contactInfo.contacts.length; index1++) {
          self.applicantObject().contactInfo.contactInfo.contacts[index1].consentForReceivingAlert = true;
        }
      } else {
        self.applicantObject().contactInfo.showNumberSelection(false);
        for (index1 = 0; index1 < self.applicantObject().contactInfo.contactInfo.contacts.length; index1++) {
          self.applicantObject().contactInfo.contactInfo.contacts[index1].consentForReceivingAlert = false;
        }
      }
    };
    self.submitInformationGeneric = function (data, applicantId) {
      self.batchRequestList([]);
      batchRequestData.batchDetailRequestList = [];
      var t;
      var prevdata;

      data.address.status = "CURRENT";
      if (!self.landlordDetailsRequired()) {
        delete data.address.landlordAddress;
        delete data.address.landlordName;
        delete data.address.landlordPhoneNumber;
      }
      addressList = [];
      addressList.push(data);
      if (self.previousAddressRequired()) {
        self.applicantObject().previousContactInfo.contactInfo.address.status = "PAST";
        prevdata = self.applicantObject().previousContactInfo.contactInfo;

        if (!self.prevlandlordDetailsRequired()) {
          delete prevdata.address.landlordAddress;
          delete prevdata.address.landlordName;
          delete prevdata.address.landlordPhoneNumber;
        }
        addressList.push(prevdata);
      }
      if (!self.applicantObject().addressCopies) {
        self.applicantObject().addressCopies = {};
      }
      if (!self.applicantObject().addressCopies[applicantId]) {
        self.applicantObject().addressCopies[applicantId] = [];
      }
      delete data.address.addressId;
      self.applicantObject().addressCopies[applicantId][0] = addressList;
      self.applicantObject().addressCopies[applicantId][0][0].address.type = "RES";
      if (self.previousAddressRequired()) {
        self.applicantObject().addressCopies[applicantId][0][1].address.type = "RES";
      }
      self.applicantObject().addressCopies[applicantId][0][0].address.addressId = self.addressesIds.applicant[0];
      if (self.previousAddressRequired()) {
        self.applicantObject().addressCopies[applicantId][0][1].address.addressId = self.addressesIds.applicant[0];
      }
      self.applicantObject().addressCopies[applicantId][1] = ko.mapping.fromJS(ko.mapping.toJS(data));
      self.applicantObject().addressCopies[applicantId][1].address.type = "PST";
      self.applicantObject().addressCopies[applicantId][1].address.addressId = self.addressesIds.applicant[1];
      var addressModel;
      var addressesPayload = {
        applicantAddressDTOs: []
      };
      for (i = 0; i < self.applicantObject().addressCopies[applicantId].length; i++) {
        addressModel = self.applicantObject().addressCopies[applicantId][i];
        if (i === 0) {
          addressModel[0].address.postalAddress.postalCode = addressModel[0].address.postalAddress.postalCode.replace(/\D/g, "");
          addressesPayload.applicantAddressDTOs[i] = self.applicantObject().addressCopies[applicantId][0][0].address;
          if (self.previousAddressRequired()) {
            addressModel[1].address.postalAddress.postalCode = addressModel[1].address.postalAddress.postalCode.replace(/\D/g, "");
            addressesPayload.applicantAddressDTOs[i + 1] = self.applicantObject().addressCopies[applicantId][0][1].address;
          }
        } else {
          addressModel.address.postalAddress.postalCode = addressModel.address.postalAddress.postalCode().replace(/\D/g, "");
          if (self.previousAddressRequired()) {
            addressesPayload.applicantAddressDTOs[i + 1] = self.applicantObject().addressCopies[applicantId][i].address;
          } else {
            addressesPayload.applicantAddressDTOs[i] = self.applicantObject().addressCopies[applicantId][i].address;
          }
        }
      }
      self.batchRequestList.push({
        uri: addressModel.address.addressId && addressModel.address.addressId.length > 0 ? {
          value: "/submissions/{submissionId}/applicants/{applicantId}/addresses/{addressId}",
          params: {
            submissionId: self.productDetails().submissionId.value,
            applicantId: self.applicantObject().applicantId().value,
            addressId: addressModel.address.addressId
          }
        } : {
          value: "/submissions/{submissionId}/applicants/{applicantId}/addresses",
          params: {
            submissionId: self.productDetails().submissionId.value,
            applicantId: self.applicantObject().applicantId().value
          }
        },
        methodType: addressModel.address.addressId && addressModel.address.addressId.length > 0 ? "PUT" : "POST",
        payLoad: ko.toJSON(addressesPayload)
      });
      var addOrUpdate = addressModel.address.addressId && addressModel.address.addressId.length;
      var addId = addressModel.address.addressId;
      var contactModel;
      var contactsPayload = {
        contactDTOs: []
      };
      for (t = 0; t < data.contacts.length; t++) {
        contactModel = data.contacts[t];
        if (self.applicantObject().contactInfo.contactInfo.contacts[t].contactType !== "") {
          contactModel.contactType = self.applicantObject().contactInfo.contactInfo.contacts[t].contactType;
        }
        if (contactModel.preferredNumber && contactModel.preferredNumber().length > 0 && contactModel.preferredNumber()[0] === "true") {
          contactModel.preferred = true;
        } else {
          contactModel.preferred = false;
        }
        contactsPayload.contactDTOs[t] = contactModel;
        if (!self.isAlternatePhoneNumber()) {
          break;
        }
      }
      for (var index1 = 0; index1 < self.applicantObject().contactInfo.emails.length; index1++) {
        if (self.applicantObject().contactInfo.emails[index1].email && self.applicantObject().contactInfo.emails[index1].email().length > 0) {
          if (self.applicantObject().contactInfo.emails[index1].preferredEmail && self.applicantObject().contactInfo.emails[index1].preferredEmail().length > 0 && self.applicantObject().contactInfo.emails[index1].preferredEmail()[0] === "true") {
            self.applicantObject().contactInfo.emails[index1].preferred = true;
          } else {
            self.applicantObject().contactInfo.emails[index1].preferred = false;
          }
          contactsPayload.contactDTOs.push(self.applicantObject().contactInfo.emails[index1]);
        }
      }
      ContactInfoModel.saveAddressModel(ko.toJSON(addressesPayload), addOrUpdate, addId).done(function (data) {
        handlerFunctions.applicantAddressCreated(data);
        ContactInfoModel.saveContactModel(ko.mapping.toJSON(contactsPayload, {
          "ignore": ["preferredEmail", "preferredNumber"]
        })).done(function (data) {
          handlerFunctions.contactCreated(data);
        });
      });
    };
    self.equalToEmail = {
      validate: function (value) {
        var compareTo = self.applicantObject().contactInfo.emails[0].email();
        if (!value && !compareTo) {
          return true;
        } else if (value !== compareTo) {
          throw new Error(self.resource.messages.emailAddressMatching);
        }
        return true;
      }
    };
    self.equalToAlternateEmail = {
      validate: function (value) {
        var compareTo = self.applicantObject().contactInfo.emails[1].email();
        if (!value && !compareTo) {
          return true;
        } else if (value !== compareTo) {
          throw new Error(self.resource.messages.emailAddressMatching);
        }
        return true;
      }
    };
    self.notEqualToPrimaryEmail = {
      validate: function (value) {
        var compareTo = self.applicantObject().contactInfo.emails[0].email();
        if (!value && !compareTo) {
          return true;
        } else if (value === compareTo) {
          throw new Error(self.resource.messages.alternateEmailDuplicate);
        } else if (!value.match(rootParams.baseModel.getValidator("EMAIL")[0].options.pattern)) {
          throw new Error(rootParams.baseModel.getValidator("EMAIL")[0].options.messageDetail);
        }
        return true;
      }
    };
    self.notEqualToPrimaryNumber = {
      validate: function (value) {
        var compareTo = self.applicantObject().contactInfo.contactInfo.contacts[0].phone.number;
        if (!value && !compareTo) {
          return true;
        } else if (value === compareTo) {
          throw new Error(self.resource.messages.alternateNumberDuplicate);
        } else if (!value.match(rootParams.baseModel.getValidator("MOBILE_NO")[0].options.pattern)) {
          throw new Error(rootParams.baseModel.getValidator("MOBILE_NO")[0].options.messageDetail);
        }
        return true;
      }
    };
    self.onEmailChange = function (index) {
      $("#confirmEmail" + index).val("");
      self.emailChanged(index);
    };
    self.landlordName = ko.observable();
    self.accomodationtypeChanged = function (event) {
      if (event.detail.value) {
        var accomodationType = event.detail.value;
        self.applicantObject().contactInfo.selectedValues().accomodationType = rootParams.baseModel.getDescriptionFromCode(self.accomodationOptions(), accomodationType);
        if (accomodationType === "REN" || accomodationType === "LEA") {
          if (self.productDetails().productClassName === "LOANS" || self.productDetails().productClassName === "CREDIT_CARD") {
            self.landlordDetailsRequired(true);
            self.applicantObject().contactInfo.contactInfo.address.landlordAddress = {
              country: "",
              state: "",
              city: "",
              postalCode: "",
              line1: "",
              line2: ""
            };
            self.applicantObject().contactInfo.contactInfo.address.landlordName = "";
            self.applicantObject().contactInfo.contactInfo.address.landlordPhoneNumber = {
              number: ""
            };
          } else {
            self.landlordDetailsRequired(false);
          }
        } else {
          self.landlordDetailsRequired(false);
        }
      }
    };
    self.prevaccomodationtypeChanged = function (event) {
      if (event.detail.value) {
        var accomodationType = event.detail.value;
        self.applicantObject().previousContactInfo.selectedValues().accomodationType = rootParams.baseModel.getDescriptionFromCode(self.accomodationOptions(), accomodationType);
        if (accomodationType === "REN" || accomodationType === "LEA") {
          if (self.productDetails().productClassName === "LOANS" || self.productDetails().productClassName === "CREDIT_CARD") {
            self.prevlandlordDetailsRequired(true);
            self.applicantObject().previousContactInfo.contactInfo.address.landlordAddress = {
              country: "",
              state: "",
              city: "",
              postalCode: "",
              line1: "",
              line2: ""
            };
            self.applicantObject().previousContactInfo.contactInfo.address.landlordName = "";
            self.applicantObject().previousContactInfo.contactInfo.address.landlordPhoneNumber = {
              number: ""
            };
          } else {
            self.prevlandlordDetailsRequired(false);
          }
        } else {
          self.prevlandlordDetailsRequired(false);
        }
      }
    };
    self.checkStayingSince = function (event) {
      if (event.detail.value) {
        self.previousAddressRequired(false);
        var dateData = event.detail.value.replace("-", "").replace("-", "");
        ContactInfoModel.checkStayingSinceDate(dateData).fail(function (data) {
          if (data.responseJSON.message && data.responseJSON.message.validationError && data.responseJSON.message.validationError.length > 0 && data.responseJSON.message.validationError[0].errorCode === "DIGX_OR_APCNT_CI_0003") {
            self.previousAddressRequired(true);
            if (!self.applicantObject().previousContactInfo) {
              self.applicantObject().previousContactInfo = getNewKoModel();
              self.showPreviousAddress(true);
            }
          } else {
            self.stayingSinceMessage(data.responseJSON.message && data.responseJSON.message.validationError && data.responseJSON.message.validationError.length > 0 && data.responseJSON.message.validationError[0].errorMessage);
            $("#stayingSinceError").trigger("openModal");
          }
        }).done(function () {
          if (self.applicantObject().previousContactInfo) {
            self.applicantObject().previousContactInfo = null;
            self.showPreviousAddress(false);
          }
        });
      }
    };
    self.submitContactInfo = function () {
      var contactInfoTracker = document.getElementById("contactInfoTracker");
      if (contactInfoTracker.valid === "valid") {
        callsMade = {
          applicant: 0
        };
        addressTracker = {
          applicant: 0
        };
        if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
          return;
        }
        if (self.applicantObject().applicantType() !== "customer") {
          self.submitInformationGeneric(self.applicantObject().contactInfo.contactInfo, self.applicantObject().applicantId().value);
        } else {
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
        }
      } else {
        contactInfoTracker.showMessages();
        contactInfoTracker.focusOn("@firstInvalidShown");
      }
    };
  };
});