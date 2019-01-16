define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/beta/resources/nls/contact-info",
  "ojs/ojbutton",
    "ojs/ojvalidationgroup"
], function(oj, ko, $, ContactInfoModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
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
      getNewKoModel = function() {
        var KoModel = ContactInfoModel.getNewModel();
        KoModel.isCompleting = ko.observable(KoModel.isCompleting);
        KoModel.selectedValues = ko.observable(KoModel.selectedValues);
        KoModel.disableInputs = ko.observable(KoModel.disableInputs);
        KoModel.email = ko.observable(KoModel.email);
        KoModel.contactInfo.address.postalAddress.state = self.productDetails().selectedState;
        return KoModel;
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.coAppNo = "";
    self.isCoAppState = ko.observable(false);
    self.selectedStateText = ko.observable();
    if (rootParams.coApplicant) {
      self.coAppNo = rootParams.applicantStages.coappNumber;
      self.isCoAppState(true);
    }
    self.applicantObject = ko.observable(rootParams.applicantObject);
    rootParams.baseModel.registerComponent("contact-number", "inputs");
    self.accommodationDataLoaded = ko.observable(false);
    self.accomodationOptions = ko.observable([]);
    self.validationTracker = ko.observable();
    self.addressDataLoaded = ko.observable(false);
    self.landlordDetailsRequired = ko.observable(false);
    self.prevlandlordDetailsRequired = ko.observable(false);
    self.previousAddressRequired = ko.observable(false);
    self.addressesIds = {
      applicant: []
    };
    self.showPreviousAddress = ko.observable(false);
    self.isAlternatePhoneNumber = ko.observable(false);
    self.phoneTypeList = ko.observableArray();
    self.phonetypeOne = ko.observableArray();
    self.phonetypeTwo = ko.observableArray();
    self.phoneTypeListLoaded = ko.observable(false);
    self.existingContactLoaded = ko.observable(false);
    self.stateOptions = ko.observable([]);
    self.statesChanged = ko.observable(false);
    self.emailChanged = ko.observable(false);
    self.alternateNumber = ko.observable("OPTION_NO");
    self.enableCopyAddress = ko.observable(true);
    self.coApplicant = rootParams.coApplicant;
    self.isCopyAddress = ko.observable("OPTION_NO");
    self.stayingSinceMessage = ko.observable("");
    self.zipCodeforUsValidate = ko.pureComputed(function() {
      return [{
        type: "regExp",
        options: {
          pattern: "[0-9-]{5}|[0-9-]{10}",
          messageDetail: self.resource.messages.zipcode
        }
      }];
    });
    var selectedPhoneType = [{},
      {}
    ];
    if (!self.applicantObject().contactInfo) {
      self.applicantObject().contactInfo = getNewKoModel();
    }
    rootParams.baseModel.registerComponent("address-input", "origination");
    self.pluginCompName("row");
    self.initializeModel = function() {
      ContactInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value);
      ContactInfoModel.getAccomodationTypeList().then(function(data) {
        self.accomodationOptions(data.enumRepresentations[0].data);
        self.accommodationDataLoaded(true);
      });
      ContactInfoModel.getExistingAddresses().then(function(data) {
        if (data.applicantAddressDTO) {
          self.enableCopyAddress(false);
          for (i = 0; i < data.applicantAddressDTO.length; i++) {
            if (data.applicantAddressDTO[i].type === "RES" && data.applicantAddressDTO[i].status === "CURRENT") {
              self.applicantObject().contactInfo.contactInfo.address = data.applicantAddressDTO[i];
              self.applicantObject().contactInfo.contactInfo.address.postalAddress.postalCode = data.applicantAddressDTO[i].postalAddress.postalCode;
              if (data.applicantAddressDTO[i].accomodationType) {
                self.applicantObject().contactInfo.selectedValues().accomodationType = rootParams.baseModel.getDescriptionFromCode(self.accomodationOptions(), data.applicantAddressDTO[i].accomodationType);
              }
              if (data.applicantAddressDTO[i].stayingSince) {
                data.applicantAddressDTO[i].stayingSince = data.applicantAddressDTO[i].stayingSince.substring(0, 10);
              }
            } else if (data.applicantAddressDTO[i].status === "PAST") {
              self.applicantObject().previousContactInfo = getNewKoModel();
              self.applicantObject().previousContactInfo.contactInfo.address.postalAddress.state = "";
              self.showPreviousAddress(true);
              self.applicantObject().previousContactInfo.contactInfo.address = data.applicantAddressDTO[i];
              if (data.applicantAddressDTO[i].accomodationType) {
                self.applicantObject().previousContactInfo.selectedValues().accomodationType = rootParams.baseModel.getDescriptionFromCode(self.accomodationOptions(), data.applicantAddressDTO[i].accomodationType);
              }
              if (data.applicantAddressDTO[i].stayingSince) {
                data.applicantAddressDTO[i].stayingSince = data.applicantAddressDTO[i].stayingSince.substring(0, 10);
              }
              self.previousAddressRequired(true);
            }
          }
          for (i = 0; i < data.applicantAddressDTO.length; i++) {
            self.addressesIds.applicant[i] = data.applicantAddressDTO[i].addressId;
          }
          ContactInfoModel.getPhoneTypeList().done(function(data) {
            self.phoneTypeList(ko.mapping.toJS(ko.mapping.fromJS(data.enumRepresentations[0].data)));
            self.phonetypeOne(ko.mapping.toJS(ko.mapping.fromJS(data.enumRepresentations[0].data)));
            self.phonetypeTwo(ko.mapping.toJS(ko.mapping.fromJS(data.enumRepresentations[0].data)));
            ContactInfoModel.getExistingContacts().then(function(data) {
              handlerFunctions.applicantsContactFetched(data);
              self.existingContactLoaded(true);
              self.phoneTypeListLoaded(true);
              self.addressDataLoaded(true);
            });
          });
        } else if (self.applicantObject().applicantType() !== "customer") {
          ContactInfoModel.getPhoneTypeList().done(function(data) {
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
    handlerFunctions.applicantsContactFetched = function(data) {
      if (data.applicantContacts) {
        self.applicantObject().contactInfo.contactInfo.contacts = [];
        self.phoneTypeListLoaded(false);
        for (i = 0; i < data.applicantContacts.length; i++) {
          if (data.applicantContacts[i].contactType !== "PEM") {
            data.applicantContacts[i].phone.number = self.formatPhoneNumber(data.applicantContacts[i].phone.number);
            self.applicantObject().contactInfo.contactInfo.contacts.push(data.applicantContacts[i]);
            if (i === 0 && data.applicantContacts[i].contactType !== "PEM") {
              self.applicantObject().contactInfo.selectedValues().contactType1 = rootParams.baseModel.getDescriptionFromCode(self.phoneTypeList(), data.applicantContacts[i].contactType);
            } else if (i === 1 && data.applicantContacts[i].contactType !== "PEM") {
              if (self.applicantObject().contactInfo.selectedValues().contactType1) {
                self.applicantObject().contactInfo.selectedValues().contactType2 = rootParams.baseModel.getDescriptionFromCode(self.phoneTypeList(), data.applicantContacts[i].contactType);
              } else {
                self.applicantObject().contactInfo.selectedValues().contactType1 = rootParams.baseModel.getDescriptionFromCode(self.phoneTypeList(), data.applicantContacts[i].contactType);
              }
            } else {
              self.applicantObject().contactInfo.selectedValues().contactType2 = rootParams.baseModel.getDescriptionFromCode(self.phoneTypeList(), data.applicantContacts[i].contactType);
            }
          }
          if (data.applicantContacts[i].contactType === "PEM") {
            self.applicantObject().contactInfo.email = ko.observable(data.applicantContacts[i].email);
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
      } else {
        self.phoneTypeListLoaded(true);
      }
      var payLoad = {
        onlineAccessDTO: {
          value: self.applicantObject().contactInfo.email
        }
      };
      payLoad = ko.toJSON(payLoad);
      ContactInfoModel.otherDetails(payLoad);
      ko.tasks.runEarly();
      self.phoneTypeListLoaded(true);
    };
    self.saveAlternateNumber = function(event) {
      if (event.detail.value === "OPTION_NO") {
        self.applicantObject().contactInfo.contactInfo.contacts[1] = {
          contactType: "",
          phone: {
            areaCode: "1",
            number: ""
          }
        };
        self.isAlternatePhoneNumber(false);
      }
      if (event.detail.value === "OPTION_YES") {
        self.isAlternatePhoneNumber(true);
      }
    };
    self.changePhoneOptions = function(phoneType1, phoneType2) {
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
    if (self.applicantObject().applicantId().value && self.applicantObject().applicantId().value.length > 0) {
      if (self.applicantObject().applicantType() === "customer") {
        self.applicantObject().contactInfo.disableInputs(true);
      } else {
        self.applicantObject().contactInfo.disableInputs(false);
      }
    }
    handlerFunctions.contactCreated = function(data) {
      var j;
      callsMade.applicant++;
      if (data.applicantContacts) {
        if (callsMade.applicant >= 1) {
          for (j = 0; j < self.applicantObject().contactInfo.contactInfo.contacts.length; j++) {
            if (self.applicantObject().contactInfo.contactInfo.contacts[j].contactType === data.applicantContacts[0].contactType) {
              self.applicantObject().contactInfo.contactInfo.contacts[j].contactId = data.applicantContacts[0].contactId;
            }
          }
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
        }
      } else {
        self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
      }
    };
    handlerFunctions.applicantAddressCreated = function(data) {
      if (data.applicantAddressDTO) {
        if (data.applicantAddressDTO[0].stayingSince) {
          data.applicantAddressDTO[0].stayingSince = data.applicantAddressDTO[0].stayingSince.substring(0, 10);
        }
        self.applicantObject().addressCopies[self.applicantObject().applicantId().value][addressTracker.applicant] = data.applicantAddressDTO[0];
        self.applicantObject().contactInfo.contactInfo.address.addressId = data.applicantAddressDTO[0].addressId;
        self.applicantObject().contactInfo.contactInfo.address.postalAddress.postalCode = self.formatzipCode(data.applicantAddressDTO[0].postalAddress.postalCode);
      }
      addressTracker.applicant++;
    };
    self.submitInformationGeneric = function(data, applicantId) {
      addressList = [];
      var t;
      var prevdata;
      data.address.postalAddress.state = data.address.postalAddress.state ? data.address.postalAddress.state : self.productDetails().selectedState;
      self.applicantObject().contactInfo.selectedValues().state = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), data.address.postalAddress.state);
      self.selectedStateText(self.applicantObject().contactInfo.selectedValues().state);
      data.address.status = "CURRENT";
      if (self.landlordDetailsRequired()) {
        data.address.landlordAddress.zipCode = data.address.landlordAddress.postalCode;
        delete data.address.landlordAddress.postalCode;
      }
      addressList.push(data);
      if (self.previousAddressRequired()) {
        self.applicantObject().previousContactInfo.contactInfo.address.status = "PAST";
        prevdata = self.applicantObject().previousContactInfo.contactInfo;
        if (self.prevlandlordDetailsRequired()) {
          prevdata.address.landlordAddress.zipCode = prevdata.address.landlordAddress.postalCode;
          delete prevdata.address.landlordAddress.postalCode;
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
      } else {
        self.applicantObject().previousContactInfo = null;
      }
      self.applicantObject().addressCopies[applicantId][0][0].address.addressId = null;
      if (self.previousAddressRequired()) {
        self.applicantObject().addressCopies[applicantId][0][1].address.addressId = null;
      }
      self.applicantObject().addressCopies[applicantId][1] = ko.mapping.fromJS(ko.mapping.toJS(data));
      self.applicantObject().addressCopies[applicantId][1].address.type = "PST";
      self.applicantObject().addressCopies[applicantId][1].address.addressId = null;
      var addressModel;
      var addressesPayload = {
        applicantAddressDTOs: []
      };
      for (i = 0; i < self.applicantObject().addressCopies[applicantId].length; i++) {
        addressModel = self.applicantObject().addressCopies[applicantId][i];
        if (!i) {
          addressesPayload.applicantAddressDTOs[i] = self.applicantObject().addressCopies[applicantId][0][0].address;
          if (self.previousAddressRequired()) {
            if (self.applicantObject().addressCopies[applicantId][0][2] && self.applicantObject().addressCopies[applicantId][0][2].address) {
              addressesPayload.applicantAddressDTOs[i + 1] = self.applicantObject().addressCopies[applicantId][0][2].address;
            } else {
              addressesPayload.applicantAddressDTOs[i + 1] = self.applicantObject().addressCopies[applicantId][0][1].address;
            }
            addressesPayload.applicantAddressDTOs[i + 1].type = self.applicantObject().addressCopies[applicantId][0][0].address.type;
          }
        } else if (self.previousAddressRequired()) {
          addressesPayload.applicantAddressDTOs[i + 1] = self.applicantObject().addressCopies[applicantId][i].address;
        } else {
          addressesPayload.applicantAddressDTOs[i] = self.applicantObject().addressCopies[applicantId][i].address;
        }
      }
      var addOrUpdate;
      var addId;
      if (addressModel) {
        addOrUpdate = addressModel.address.addressId && addressModel.address.addressId.length;
        addId = addressModel.address.addressId;
      }
      var contactModel;
      var contactsPayload = {
        contactDTOs: []
      };
      for (t = 0; t < data.contacts.length; t++) {
        contactModel = data.contacts[t];
        contactModel.phone.areaCode = "+1";
        contactModel.phone.number = contactModel.phone.number.replace(/\D/g, "");
        if (self.applicantObject().contactInfo.contactInfo.contacts[t].contactType !== "") {
          contactModel.contactType = self.applicantObject().contactInfo.contactInfo.contacts[t].contactType;
        }
        contactsPayload.contactDTOs[t] = contactModel;
        if (!self.isAlternatePhoneNumber()) {
          break;
        }
      }
      var emailContact = {
        contactType: "PEM",
        email: self.applicantObject().contactInfo.email()
      };
      contactsPayload.contactDTOs.push(emailContact);
      ContactInfoModel.saveAddressModel(ko.toJSON(addressesPayload), addOrUpdate, addId).done(function(data) {
        handlerFunctions.applicantAddressCreated(data);
        ContactInfoModel.saveContactModel(ko.toJSON(contactsPayload)).done(function(data) {
          handlerFunctions.contactCreated(data);
          ContactInfoModel.getExistingContacts().then(function(data) {
            handlerFunctions.applicantsContactFetched(data);
          });
        });
      });
    };
    self.equalToEmail = {
      validate: function(value) {
        var compareTo = self.applicantObject().contactInfo.email();
        if (!value && !compareTo) {
          return true;
        } else if (value !== compareTo) {
          throw new Error(self.resource.messages.emailAddressMatching);
        }
        return true;
      }
    };
    self.landlordName = ko.observable();
    self.accomodationtypeChanged = function(event) {
      if (event.detail.value) {
        var accomodationType = event.detail.value;
        self.applicantObject().contactInfo.selectedValues().accomodationType = rootParams.baseModel.getDescriptionFromCode(self.accomodationOptions(), accomodationType);
      }
    };
    self.toggleCopyAddress = function(event) {
      if (event.detail.value === "OPTION_NO") {
        self.isCopyAddress("OPTION_NO");
        self.applicantObject().contactInfo.contactInfo.address.type = "";
        self.applicantObject().contactInfo.contactInfo.address.accomodationType = "";
        self.applicantObject().contactInfo.contactInfo.address.stayingSince = "";
        self.applicantObject().contactInfo.contactInfo.address.postalAddress.country = "";
        self.applicantObject().contactInfo.contactInfo.address.postalAddress.city = "";
        self.applicantObject().contactInfo.contactInfo.address.postalAddress.postalCode = "";
        self.applicantObject().contactInfo.contactInfo.address.postalAddress.line1 = "";
        self.applicantObject().contactInfo.contactInfo.address.postalAddress.line2 = "";
        if (self.applicantObject().contactInfo.contactInfo.address.landlordAddress) {
          self.applicantObject().contactInfo.contactInfo.address.landlordAddress.country = "";
          self.applicantObject().contactInfo.contactInfo.address.landlordAddress.city = "";
          self.applicantObject().contactInfo.contactInfo.address.landlordAddress.zipCode = "";
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
    self.prevaccomodationtypeChanged = function(event) {
      if (event.detail.value) {
        var accomodationType = event.detail.value;
        self.applicantObject().previousContactInfo.selectedValues().accomodationType = rootParams.baseModel.getDescriptionFromCode(self.accomodationOptions(), accomodationType);
      }
    };
    self.phoneNumberValidate = ko.pureComputed(function() {
       return [{
        type: "regExp",
        options: {
          pattern: "^\\(\\d{1,3}\\)\\d{1,3}[-]\\d{4}$",
          messageDetail: self.resource.messages.mobileNumber
        }
      }];
    });
    self.checkStayingSince = function(event) {
      if (event.detail.value) {
        self.previousAddressRequired(false);
        var dateData = event.detail.value.replace("-", "").replace("-", "");
        ContactInfoModel.checkStayingSinceDate(dateData).fail(function(data) {
          if (data.responseJSON.message && data.responseJSON.message.validationError && data.responseJSON.message.validationError.length > 0 && data.responseJSON.message.validationError[0].errorCode === "DIGX_OR_APCNT_CI_0003") {
            self.previousAddressRequired(true);
            if (!self.applicantObject().previousContactInfo) {
              self.applicantObject().previousContactInfo = getNewKoModel();
              self.applicantObject().previousContactInfo.contactInfo.address.postalAddress.state = self.applicantObject().contactInfo.contactInfo.address.postalAddress.state;
              self.showPreviousAddress(true);
            }
          } else {
            self.stayingSinceMessage(data.responseJSON.message && data.responseJSON.message.validationError && data.responseJSON.message.validationError.length > 0 && data.responseJSON.message.validationError[0].errorMessage);
            $("#stayingSinceError").trigger("openModal");
          }
        });
      }
    };
    self.formatzipCode = function(val) {
      var newVal = "";
      if (!val.includes("-")) {
        while (val.length > 5) {
          newVal += val.substr(0, 5) + "-";
          val = val.substr(5);
        }
        newVal += val;
      } else {
        newVal = val;
      }
      return newVal;
    };
    $(document).on("keyup", "#zipCode1", function() {
      var val = event.target.value.replace(/\D/g, "");
      event.target.value = self.formatzipCode(val);
    });
    $(document).on("keyup", "#zipCode2", function() {
      var val = event.target.value.replace(/\D/g, "");
      event.target.value = self.formatzipCode(val);
    });
    self.formatPhoneNumber = function(val) {
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
    $(document).on("keyup", "#mobile1" + self.coAppNo, function() {
      var val = event.target.value.replace(/\D/g, "");
      $("#mobile1" + self.coAppNo).attr("maxlength", 13);
      event.target.value = self.formatPhoneNumber(val);
    });
    $(document).on("keyup", "#mobile2" + self.coAppNo, function() {
      var val = event.target.value.replace(/\D/g, "");
      $("#mobile2" + self.coAppNo).attr("maxlength", 13);
      event.target.value = self.formatPhoneNumber(val);
    });
    self.submitContactInfo = function() {
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
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
        }
      } else {
        contactInfoTracker.showMessages();
        contactInfoTracker.focusOn("@firstInvalidShown");
      }
    };
    self.onEmailChange = function() {
      $("#confirmEmail").val("");
      self.emailChanged(true);
    };
    self.phoneTypeChangeHandler = function(event) {
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
    ContactInfoModel.fetchStates("US").done(function(data) {
      self.stateOptions(data.enumRepresentations[0].data);
      self.selectedStateText(rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.productDetails().selectedState));
      self.statesChanged(true);
    });
  };
});
