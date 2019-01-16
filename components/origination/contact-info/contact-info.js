define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "ojL10n!resources/nls/contact-info",
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
        KoModel.monthlyMortgage.amount = ko.observable(KoModel.monthlyMortgage.amount);
        KoModel.monthlyMortgage.currency = rootParams.baseModel.getLocaleValue("localCurrency");
        KoModel.monthlyRent.currency = rootParams.baseModel.getLocaleValue("localCurrency");
        KoModel.monthlyRent.amount = ko.observable(KoModel.monthlyRent.amount);
        return KoModel;
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.groupValid = ko.observable();
    if (self.applicantType === "PRIMARY") {
      self.applicantObject = ko.observable(rootParams.applicantObject);
    } else if (self.applicantType === "JOINT") {
      self.applicantObject = rootParams.applicantObject()[self.coAppCurrentIndex - 1];
    }
    self.pluginCompName("row");
    rootParams.baseModel.registerComponent("contact-number", "inputs");
    self.accommodationDataLoaded = ko.observable(false);
    self.accomodationOptions = ko.observable([]);
    self.validationTracker = ko.observable();
    self.isCopyAddress = ko.observable("OPTION_NO");
    self.addressDataLoaded = ko.observable(false);
    self.landlordDetailsRequired = ko.observable(false);
    self.prevlandlordDetailsRequired = ko.observable(false);
    self.phoneTypeListLoaded = ko.observable(false);
    self.phoneTypeList = ko.observableArray();
    self.phonetypeOne = ko.observableArray();
    self.phonetypeTwo = ko.observableArray();
    self.ISDCodeList = ko.observableArray();
    self.coApplicant = rootParams.coApplicant;
    self.payRentSelected = ko.observable();
    self.showMortgageAmount = ko.observable(true);
    self.payMortgage = ko.observable("OPTION_YES");
    self.isAlternatePhoneNumber = ko.observable(false);
    self.previousAddressRequired = ko.observable(false);
    self.addressesIds = {
      applicant: []
    };
    self.showPreviousAddress = ko.observable(false);
    self.emailChanged = ko.observable(false);
    self.existingContactLoaded = ko.observable(false);
    self.alternateNumber = ko.observable("OPTION_NO");
    self.postalAddressSameAsCurrent = ko.observable("OPTION_YES");
    self.enableCopyAddress = ko.observable(true);
    self.selectedCountry = ko.observable("");
    self.selectedCountryMailing = ko.observable("");
    self.hideState = true;
    self.updateExistingContacts = ko.observable();
    self.countryOptions = ko.observableArray([]);
    if (!self.applicantObject().contactInfo) {
      self.applicantObject().contactInfo = getNewKoModel();
      if (!self.isRegistered && self.socialMediaResponse() && self.socialMediaResponse().email) {
        self.applicantObject().contactInfo.email(self.socialMediaResponse().email);
      }
    }
    rootParams.baseModel.registerElement("address-input");
    self.initializeModel = function() {
      ContactInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value);
      ContactInfoModel.getAccomodationTypeList().then(function(data) {
        self.accomodationOptions(data.accommodationType);
        self.accommodationDataLoaded(true);
      });
      ContactInfoModel.fetchCountryList().done(function(data) {
        if (data.enumRepresentations && data.enumRepresentations.length > 0 && data.enumRepresentations[0].data) {
          self.countryOptions(data.enumRepresentations[0].data);
        }
        ContactInfoModel.getExistingAddresses().then(function(addressData) {
          if (addressData.applicantAddressDTO) {
            self.enableCopyAddress(false);
            for (i = 0; i < addressData.applicantAddressDTO.length; i++) {
              if (addressData.applicantAddressDTO[i].landlordAddress && addressData.applicantAddressDTO[i].landlordAddress.postalCode) {
                if (addressData.applicantAddressDTO[i].status === "CURRENT") {
                  self.landlordDetailsRequired(true);
                } else if (addressData.applicantAddressDTO[i].status === "PAST") {
                  self.prevlandlordDetailsRequired(true);
                }
              }
            }
            for (i = 0; i < addressData.applicantAddressDTO.length; i++) {
              if (addressData.applicantAddressDTO[i].type === "RES" && addressData.applicantAddressDTO[i].status === "CURRENT") {
                self.applicantObject().contactInfo.contactInfo.address = addressData.applicantAddressDTO[i];
                if (addressData.applicantAddressDTO[i].accomodationType) {
                  self.applicantObject().contactInfo.selectedValues().accomodationType = rootParams.baseModel.getDescriptionFromCode(self.accomodationOptions(), addressData.applicantAddressDTO[i].accomodationType);
                }
                if (addressData.applicantAddressDTO[i].postalAddress && addressData.applicantAddressDTO[i].postalAddress.country) {
                  self.applicantObject().contactInfo.selectedValues().country = rootParams.baseModel.getDescriptionFromCode(self.countryOptions(), addressData.applicantAddressDTO[i].postalAddress.country);
                }
                if (addressData.applicantAddressDTO[i].stayingSince) {
                  addressData.applicantAddressDTO[i].stayingSince = addressData.applicantAddressDTO[i].stayingSince.substring(0, 10);
                }
              } else if (addressData.applicantAddressDTO[i].status === "PAST") {
                self.applicantObject().previousContactInfo = getNewKoModel();
                self.showPreviousAddress(true);
                self.applicantObject().previousContactInfo.contactInfo.address = addressData.applicantAddressDTO[i];
                if (addressData.applicantAddressDTO[i].accomodationType) {
                  self.applicantObject().previousContactInfo.selectedValues().accomodationType = rootParams.baseModel.getDescriptionFromCode(self.accomodationOptions(), addressData.applicantAddressDTO[i].accomodationType);
                }
                self.previousAddressRequired(true);
              } else {
                self.applicantObject().contactInfo.contactInfo.mailingAddress = addressData.applicantAddressDTO[i];
                if (addressData.applicantAddressDTO[i].postalAddress && addressData.applicantAddressDTO[i].postalAddress.country) {
                  self.applicantObject().contactInfo.selectedValues().countryMailing = rootParams.baseModel.getDescriptionFromCode(self.countryOptions(), addressData.applicantAddressDTO[i].postalAddress.country);
                }
                if (!addressData.applicantAddressDTO[i].sameAsCurrent) {
                  self.postalAddressSameAsCurrent("OPTION_NO");
                }
              }
            }
            for (i = 0; i < addressData.applicantAddressDTO.length; i++) {
              self.addressesIds.applicant[i] = addressData.applicantAddressDTO[i].addressId;
            }
            ContactInfoModel.getPhoneTypeList().done(function(data) {
              self.phoneTypeList(ko.mapping.toJS(ko.mapping.fromJS(data.enumRepresentations[0].data)));
              self.phonetypeOne(ko.mapping.toJS(ko.mapping.fromJS(data.enumRepresentations[0].data)));
              self.phonetypeTwo(ko.mapping.toJS(ko.mapping.fromJS(data.enumRepresentations[0].data)));
              ContactInfoModel.getISDCodeList().done(function(data) {
                self.ISDCodeList(data.enumRepresentations[0].data);
                ContactInfoModel.getExistingContacts().then(function(data) {
                  if (!self.applicantObject().newApplicant) {
                    var showComplete = false;
                    if (self.checkDataAvailability(addressData.applicantAddressDTO, rootParams.applicantStages.id) && self.checkDataAvailability(data.applicantContacts, rootParams.applicantStages.id)) {
                      showComplete = true;
                    }
                    self.showIcon(showComplete, rootParams.applicantStages);
                  }
                  handlerFunctions.applicantsContactFetched(data);
                  self.existingContactLoaded(true);
                  self.phoneTypeListLoaded(true);
                  self.addressDataLoaded(true);
                });
              });
            });
          } else if (self.applicantObject().applicantType() !== "customer") {
            ContactInfoModel.getPhoneTypeList().done(function(data) {
              self.phoneTypeList(ko.mapping.toJS(ko.mapping.fromJS(data.enumRepresentations[0].data)));
              self.phonetypeOne(ko.mapping.toJS(ko.mapping.fromJS(data.enumRepresentations[0].data)));
              self.phonetypeTwo(ko.mapping.toJS(ko.mapping.fromJS(data.enumRepresentations[0].data)));
              ContactInfoModel.getISDCodeList().done(function(data) {
                self.ISDCodeList(data.enumRepresentations[0].data);
                self.existingContactLoaded(true);
                self.phoneTypeListLoaded(true);
                self.addressDataLoaded(true);
              });
            });
          }
        });
      });
    };
    self.initializeModel();
    handlerFunctions.applicantsContactFetched = function(data) {
      if (data.applicantContacts) {
        self.applicantObject().contactInfo.contactInfo.contacts = [];
        self.phoneTypeListLoaded(false);
        for (i = 0; i < data.applicantContacts.length; i++) {
          if (data.applicantContacts[i].contactType !== "PEM") {
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
              areaCode: "",
              number: ""
            }
          });
          self.changePhoneOptions(self.applicantObject().contactInfo.contactInfo.contacts[0].contactType, null);
        }
      } else {
        self.phoneTypeListLoaded(true);
      }
      ko.tasks.runEarly();
      self.phoneTypeListLoaded(true);
    };
    self.postalAddressOptionChange = function(event) {
      if (event.detail.value) {
        if (event.detail.value === "OPTION_YES" && event.detail.previousValue === "OPTION_NO") {
          self.applicantObject().contactInfo.contactInfo.mailingAddress = self.applicantObject().contactInfo.contactInfo.address;
          self.applicantObject().contactInfo.contactInfo.mailingAddress.sameAsCurrent = true;
          self.applicantObject().contactInfo.contactInfo.address.sameAsCurrent = true;
          self.postalAddressSameAsCurrent("OPTION_YES");
        } else if (event.detail.value === "OPTION_NO" && event.detail.previousValue === "OPTION_YES") {
          self.applicantObject().contactInfo.contactInfo.mailingAddress = getNewKoModel().contactInfo.mailingAddress;
          self.applicantObject().contactInfo.contactInfo.mailingAddress.sameAsCurrent = false;
          self.applicantObject().contactInfo.contactInfo.address.sameAsCurrent = false;
          self.postalAddressSameAsCurrent("OPTION_NO");
        }
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
    self.saveAlternateNumber = function(event) {
      if (event.detail.value === "OPTION_NO") {
        self.isAlternatePhoneNumber(false);
        self.applicantObject().contactInfo.contactInfo.contacts.splice(-1);
      }
      if (event.detail.value === "OPTION_YES") {
        self.isAlternatePhoneNumber(true);
        if (!self.applicantObject().contactInfo.contactInfo.contacts[1]) {
          self.applicantObject().contactInfo.contactInfo.contacts.push({
            contactType: "",
            phone: {
              areaCode: "",
              number: ""
            }
          });
        }
      }
    };
    var selectedPhoneType = [{},
      {}
    ];
    self.changePhoneOptions = function(phoneType1, phoneType2) {
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
              break;
            }
          }
          self.phoneTypeListLoaded(true);
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
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
        }
      } else {
        self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
      }
    };
    handlerFunctions.applicantAddressCreated = function(data) {
      if (data.applicantAddressDTO) {
        if (data.applicantAddressDTO[0].stayingSince) {
          data.applicantAddressDTO[0].stayingSince = data.applicantAddressDTO[0].stayingSince.substring(0, 10);
        }
        self.applicantObject().addressCopies[self.applicantObject().applicantId().value][addressTracker.applicant] = data.applicantAddressDTO[0];
        self.applicantObject().contactInfo.contactInfo.address = data.applicantAddressDTO[0];
      }
      addressTracker.applicant++;
    };
    self.updateExistingContacts = function(data, data1) {
      var j, k;
      for (i = 0; i < data.applicantContacts.length; i++) {
        if (data.applicantContacts[i].contactType === "PEM") {
          j = i;
        }
        if (data1.applicantContacts[i].contactType === "PEM") {
          k = i;
        }
      }
      data1.applicantContacts[k].email = data.applicantContacts[j].email;
      return data1;
    };
    self.submitInformationGeneric = function(data, applicantId) {
      var t;
      if (self.selectedCountry()) {
        self.applicantObject().contactInfo.selectedValues().country = self.selectedCountry();
      }
      if (self.selectedCountryMailing()) {
        self.applicantObject().contactInfo.selectedValues().countryMailing = self.selectedCountryMailing();
      }
      data.address.status = "CURRENT";
      if (!self.landlordDetailsRequired()) {
        delete data.address.landlordAddress;
        delete data.address.landlordName;
        delete data.address.landlordPhoneNumber;
      }
      delete data.address.postalAddress.state;
      addressList = [];
      addressList.push(data);
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
      self.applicantObject().addressCopies[applicantId][1] = ko.mapping.fromJS(ko.mapping.toJS(data));
      self.applicantObject().addressCopies[applicantId][1].mailingAddress.type = "PST";
      self.applicantObject().addressCopies[applicantId][1].mailingAddress.addressId = null;
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
            if (self.applicantObject().contactInfo.contactInfo.mailingAddress.sameAsCurrent) {
              addressesPayload.applicantAddressDTOs[i + 1] = self.applicantObject().addressCopies[applicantId][i].address;
              addressesPayload.applicantAddressDTOs[i + 1].sameAsCurrent = self.applicantObject().addressCopies[applicantId][i].mailingAddress.sameAsCurrent;
              addressesPayload.applicantAddressDTOs[i + 1].type = self.applicantObject().addressCopies[applicantId][i].mailingAddress.type;
            } else {
              addressesPayload.applicantAddressDTOs[i + 1] = self.applicantObject().addressCopies[applicantId][i].mailingAddress;
            }
          } else if (self.applicantObject().contactInfo.contactInfo.mailingAddress.sameAsCurrent) {
            addressesPayload.applicantAddressDTOs[i] = self.applicantObject().addressCopies[applicantId][i].address;
            addressesPayload.applicantAddressDTOs[i].sameAsCurrent = self.applicantObject().addressCopies[applicantId][i].mailingAddress.sameAsCurrent;
            addressesPayload.applicantAddressDTOs[i].type = self.applicantObject().addressCopies[applicantId][i].mailingAddress.type;
          } else {
            addressesPayload.applicantAddressDTOs[i] = self.applicantObject().addressCopies[applicantId][i].mailingAddress;
          }
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
        if (self.applicantObject().contactInfo.contactInfo.contacts[t].contactType !== "") {
          contactModel.contactType = self.applicantObject().contactInfo.contactInfo.contacts[t].contactType;
        }
        if (self.applicantObject().contactInfo.contactInfo.contacts[t].phone.areaCode) {
          contactModel.phone.areaCode = self.applicantObject().contactInfo.contactInfo.contacts[t].phone.areaCode;
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
        ContactInfoModel.saveContactModel(ko.toJSON(contactsPayload)).done(function(data1) {
          handlerFunctions.contactCreated(data1);
          ContactInfoModel.getExistingContacts().then(function(data) {
            data1 = self.updateExistingContacts(data, data1);
            handlerFunctions.applicantsContactFetched(data1);
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
    self.onEmailChange = function() {
      $("#confirmEmail").val("");
      self.emailChanged(true);
    };
    self.landlordName = ko.observable();
    self.prevaccomodationtypeChanged = function(event) {
      if (event.detail.value) {
        var accomodationType = self.applicantObject().previousContactInfo.contactInfo.address.accomodationType;
        self.applicantObject().previousContactInfo.selectedValues().accomodationType = rootParams.baseModel.getDescriptionFromCode(self.accomodationOptions(), accomodationType);
        if (accomodationType === "REN" || accomodationType === "LEA") {
          if (self.productDetails().productClassName === "LOANS" || self.productDetails().productClassName === "CREDIT_CARD") {
            self.prevlandlordDetailsRequired(true);
            self.applicantObject().previousContactInfo.contactInfo.address.landlordAddress = {
              country: "",
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
    self.payMortgageOptionChange = function(event) {
      if (event.detail.value) {
        if (event.detail.value === "OPTION_YES") {
          self.applicantObject().contactInfo.monthlyMortgage.amount(null);
          self.showMortgageAmount(true);
        } else {
          self.applicantObject().contactInfo.monthlyMortgage.amount(0);
          self.showMortgageAmount(false);
        }
      }
    };
    self.submitContactInfo = function() {
      var contactInfoTracker = document.getElementById("contactInfoTracker");
      if (contactInfoTracker.valid === "valid") {
        callsMade = {
          applicant: 0
        };
        addressTracker = {
          applicant: 0
        };
        if (self.applicantObject().applicantType() !== "customer") {
          self.applicantObject().contactInfo.selectedValues().accomodationType = rootParams.baseModel.getDescriptionFromCode(self.accomodationOptions(), self.applicantObject().contactInfo.contactInfo.address.accomodationType);
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
