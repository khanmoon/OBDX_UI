define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/beta/resources/nls/card-addon",
  "ojs/ojswitch",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext",
  "ojs/ojinputnumber",
  "ojs/ojknockout-validation"
], function(oj, ko, $, CardAddonModel, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var i = 0,
      self = this;
    var CardAddonModelObject = new CardAddonModel();
    var getNewKoModel = function(modelData) {
      var KoModel = CardAddonModelObject.getNewModel(modelData);
      KoModel.addonCard.temp_isActive = ko.observable(KoModel.addonCard.temp_isActive);
      KoModel.addonCard.applicantDTO.personalInfo.salutation = ko.observable(KoModel.addonCard.applicantDTO.personalInfo.salutation);
      KoModel.addonCard.applicantDTO.personalInfo.suffix = ko.observable(KoModel.addonCard.applicantDTO.personalInfo.suffix);
      KoModel.addonCard.applicantDTO.personalInfo.firstName = ko.observable(KoModel.addonCard.applicantDTO.personalInfo.firstName);
      KoModel.addonCard.applicantDTO.personalInfo.middleName = ko.observable(KoModel.addonCard.applicantDTO.personalInfo.middleName);
      KoModel.addonCard.applicantDTO.personalInfo.lastName = ko.observable(KoModel.addonCard.applicantDTO.personalInfo.lastName);
      KoModel.addonCard.applicantDTO.personalInfo.birthDate = ko.observable(KoModel.addonCard.applicantDTO.personalInfo.birthDate);
      KoModel.addonCard.applicantDTO.personalInfo.citizenship = ko.observable(KoModel.addonCard.applicantDTO.personalInfo.citizenship);
      KoModel.addonCard.applicantDTO.personalInfo.isPermanentResidence = ko.observable(KoModel.addonCard.applicantDTO.personalInfo.isPermanentResidence);
      KoModel.addonCard.applicantDTO.personalInfo.residentCountry = ko.observable(KoModel.addonCard.applicantDTO.personalInfo.residentCountry);
      KoModel.addonCard.submissionId = self.productDetails().submissionId.value;
      KoModel.addonCard.temp_showPreviousAddress = ko.observable(KoModel.addonCard.temp_showPreviousAddress);
      KoModel.addonCard.temp_previousAddressRequired = ko.observable(KoModel.addonCard.temp_previousAddressRequired);
      KoModel.addonCard.temp_showAddressSwitch = ko.observable(KoModel.addonCard.temp_showAddressSwitch);
      KoModel.addonCard.facilityId = self.productDetails().facilityId;
      KoModel.addonCard.temp_maskedSSN = ko.observable(KoModel.addonCard.temp_maskedSSN);
      KoModel.addonCard.selectedValues = ko.observable(KoModel.addonCard.selectedValues);
      KoModel.addonCard.temp_permanentResident = ko.observable("OPTION_YES");
      KoModel.addonCard.simulationId = self.productDetails().simulationId();
      KoModel.addonCard.identifications[0].id = ko.observable(KoModel.addonCard.identifications[0].id);
      KoModel.addonCard.applicantDTO.facilityId = ko.observable(KoModel.addonCard.applicantDTO.facilityId);
      KoModel.addonCard.temp_isAddressSameAsPrimary = ko.observable(KoModel.addonCard.temp_isAddressSameAsPrimary);
      KoModel.addonCard.temp_isResAddressSameAsPrimary = ko.observable(KoModel.addonCard.temp_isResAddressSameAsPrimary);
      return KoModel;
    };
    self.validationTracker = ko.observable();
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.isAddon = ko.observable(true);
    self.redraw = ko.observable(false);
    self.addonCards = ko.observable(false);
    self.showAddonAdd = ko.observable(false);
    self.suffixLoaded = ko.observable(true);
    self.suffixOptions = ko.observableArray();
    self.salutationsLoaded = ko.observable(true);
    self.refreshAddresses = ko.observable(true);
    self.salutations = ko.observableArray();
    self.existingAddOnLoaded = ko.observable(false);
    self.addonCards = ko.observableArray();
    self.countriesLoaded = ko.observable(true);
    self.countries = ko.observableArray();
    self.isAddOnTransaction = ko.observable(false);
    self.usedAddonCards = ko.observable(0);
    self.maxAddonCardsAllowed = ko.observable(self.productDetails().offers.offerAdditionalDetails.standardFeature.maximumAddOnCard);
    self.accommodationDataLoaded = ko.observable(false);
    self.accomodationOptions = ko.observable([]);
    self.stateOptions = ko.observable([]);
    self.statesChanged = ko.observable(false);
    self.redrawAddonCards = ko.observable(false);
    self.showAdd = ko.observable(false);

    self.ssnValidate = ko.pureComputed(function() {
      return [{
        type: "regExp",
        options: {
          pattern: "[0-9-xX]{11}",
          messageDetail: self.resource.messages.ssn
        }
      }];
    });
    self.editCard = function(index) {
      self.redrawAddonCards(false);
      self.addonCards()[index].temp_isActive(true);
      self.showContinue(false);
      ko.tasks.runEarly();
      self.redrawAddonCards(true);
    };
    self.removeCard = function(index) {
      self.redrawAddonCards(false);
      self.usedAddonCards(self.usedAddonCards() - 1);
      if (self.addonCards()[index].partyId && self.addonCards()[index].partyId.value) {
        self.deleteAddOn(index);
      }
      self.addonCards().splice(index, 1);
      if (self.usedAddonCards() < self.maxAddonCardsAllowed()) {
        self.showAdd(true);
      } else {
        self.showAdd(false);
      }
      ko.tasks.runEarly();
      self.showContinue(true);
      self.redrawAddonCards(true);
    };
    self.addCard = function() {
      self.redrawAddonCards(false);
      self.usedAddonCards(self.usedAddonCards() + 1);
      var card = getNewKoModel().addonCard;
      card.applicantDTO.personalInfo.citizenship(self.resource.citizenship.toUpperCase());
      self.addonCards().push(card);
      card.temp_isActive(true);
      self.showContinue(false);
      if (self.usedAddonCards() < self.maxAddonCardsAllowed()) {
        self.showAdd(true);
      } else {
        self.showAdd(false);
      }
      ko.tasks.runEarly();
      self.redrawAddonCards(true);
    };
    CardAddonModelObject.getAccomodationTypeList().then(function(data) {
      self.accomodationOptions(data.enumRepresentations[0].data);
      self.accommodationDataLoaded(true);
      CardAddonModelObject.fetchStates("US").done(function(data) {
        self.stateOptions(data.enumRepresentations[0].data);
        self.statesChanged(true);
      });
    });
    self.savePermanentResidence = function(index, event) {
      if (event.detail.value === "OPTION_NO") {
        self.addonCards()[index].applicantDTO.personalInfo.isPermanentResidence(false);
        self.addonCards()[index].temp_permanentResident("OPTION_NO");
      } else if (event.detail.value === "OPTION_YES") {
        self.addonCards()[index].applicantDTO.personalInfo.isPermanentResidence(true);
        self.addonCards()[index].temp_permanentResident("OPTION_YES");
        self.addonCards()[index].applicantDTO.personalInfo.residentCountry("");
      }
    };
    self.getAddonDetails = function() {
      CardAddonModelObject.fetchAddOnCardDetails(self.productDetails().submissionId.value, self.productDetails().facilityId, self.productDetails().simulationId(), self.productDetails().offers.offerId).done(function(data) {
        if (data.addOnCardHolders && data.addOnCardHolders.length > 0) {
          self.productDetails().addonDetails = {};
          self.productDetails().addonDetails.addonCards = data.addOnCardHolders;
          self.addonCards([]);
          for (i = 0; i < self.productDetails().addonDetails.addonCards.length; i++) {
            var card = getNewKoModel(self.productDetails().addonDetails.addonCards[i]).addonCard;
            for (var j = 0; j < card.partyAddresses.length; j++) {
              if (card.partyAddresses[j].status === "PAST") {
                card.temp_showPreviousAddress(true);
                card.temp_previousAddressRequired(true);
              }
              if (card.partyAddresses[j].type === "PST") {
                card.partyAddresses.splice(j, 1);
              }
            }
            self.addonCards().push(card);
            self.addonCards()[i].selectedValues().primaryInfo.suffix = rootParams.baseModel.getDescriptionFromCode(self.suffixOptions(), self.addonCards()[i].applicantDTO.personalInfo.suffix());
            self.addonCards()[i].selectedValues().primaryInfo.salutation = rootParams.baseModel.getDescriptionFromCode(self.salutations(), self.addonCards()[i].applicantDTO.personalInfo.salutation());
            self.addonCards()[i].selectedValues().primaryInfo.citizenship = rootParams.baseModel.getDescriptionFromCode(self.countries(), self.addonCards()[i].applicantDTO.personalInfo.citizenship());
            self.addonCards()[i].selectedValues().primaryInfo.residentCountry = rootParams.baseModel.getDescriptionFromCode(self.countries(), self.addonCards()[i].applicantDTO.personalInfo.residentCountry());
            self.addonCards()[i].selectedValues().currentAddress.accomodationType = rootParams.baseModel.getDescriptionFromCode(self.accomodationOptions(), self.addonCards()[i].partyAddresses[0].accomodationType);
            self.addonCards()[i].selectedValues().currentAddress.state = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.addonCards()[i].partyAddresses[0].postalAddress.state);
            if (self.addonCards()[i].temp_previousAddressRequired()) {
              self.addonCards()[i].selectedValues().previousAddress.accomodationType = rootParams.baseModel.getDescriptionFromCode(self.accomodationOptions(), self.addonCards()[i].partyAddresses[1].accomodationType);
              self.addonCards()[i].selectedValues().previousAddress.state = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.addonCards()[i].partyAddresses[1].postalAddress.state);
            }
            self.addonCards()[i].temp_showAddressSwitch(false);
            if (self.addonCards()[i].identifications[0].id()) {
              self.addonCards()[i].temp_maskedSSN(self.addonCards()[i].identifications[0].id());
            } else {
              self.addonCards()[i].temp_maskedSSN("");
            }
            var cardVal = self.addonCards()[i].identifications[0].id();
            var cardLen = 5;
            self.productDetails().addonDetails.addonCards[i].temp_maskedNumber = self.applyPattern(self.maskValue(cardVal, cardLen), [
              3,
              2,
              4
            ], 0);
            self.addonCards()[i].temp_maskedNumber = self.productDetails().addonDetails.addonCards[i].temp_maskedNumber;
            self.addonCards()[i].temp_maskedSSN(self.applyPattern(self.addonCards()[i].temp_maskedSSN(), [
              3,
              2,
              4
            ], 0));
            self.addonCards()[i].temp_maskedSSN(self.addonCards()[i].temp_maskedSSN().replace(/[^\-]/g, "x"));
            self.productDetails().addonDetails.addonCards[i].temp_maskedSSN = self.addonCards()[i].temp_maskedSSN();
          }
          self.productDetails().addonDetails.addonCards = self.addonCards();
          self.isAddOnTransaction(true);
        } else {
          self.productDetails().addonDetails = {};
        }
        self.showContinue(true);
        if (self.isAddOnTransaction()) {
          self.optedForAddOnHolder("OPTION_YES");
          self.initializeModel();
        } else {
          self.productDetails().addonDetails = {};
          self.isAddOnTransaction(false);
          self.optedForAddOnHolder("OPTION_NO");
        }
        self.existingAddOnLoaded(true);
      });
    };
    self.submitAddOn = function(index) {
      if (self.addonCards() && self.addonCards().length > 0 && !rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      if (!(self.addonCards()[index].partyId && self.addonCards()[index].partyId.value)) {
        self.addonCards()[index].partyId = null;
      }
      if (!self.addonCards()[index].applicantDTO.personalInfo.middleName) {
        self.addonCards()[index].applicantDTO.personalInfo.middleName = null;
      }
      self.addonCards()[index].selectedValues().primaryInfo.suffix = rootParams.baseModel.getDescriptionFromCode(self.suffixOptions(), self.addonCards()[index].applicantDTO.personalInfo.suffix());
      self.addonCards()[index].selectedValues().primaryInfo.salutation = rootParams.baseModel.getDescriptionFromCode(self.salutations(), self.addonCards()[index].applicantDTO.personalInfo.salutation());
      self.addonCards()[index].selectedValues().primaryInfo.citizenship = rootParams.baseModel.getDescriptionFromCode(self.countries(), self.addonCards()[index].applicantDTO.personalInfo.citizenship());
      self.addonCards()[index].selectedValues().primaryInfo.residentCountry = rootParams.baseModel.getDescriptionFromCode(self.countries(), self.addonCards()[index].applicantDTO.personalInfo.residentCountry());
      var isPSTPresent = false;
      for (var i = 0; i < self.addonCards()[index].partyAddresses.length; i++) {
        if (self.addonCards()[index].partyAddresses[i].type === "PST") {
          isPSTPresent = true;
        }
      }
      if (!isPSTPresent) {
        var pstAddress = {
          type: "PST",
          status: "CURRENT",
          postalAddress: {
            line1: self.addonCards()[index].partyAddresses[0].postalAddress.line1,
            line2: self.addonCards()[index].partyAddresses[0].postalAddress.line2,
            city: self.addonCards()[index].partyAddresses[0].postalAddress.city,
            state: self.addonCards()[index].partyAddresses[0].postalAddress.state,
            country: "US",
            postalCode: self.addonCards()[index].partyAddresses[0].postalAddress.postalCode
          },
          accomodationType: self.addonCards()[index].partyAddresses[0].accomodationType
        };
        self.addonCards()[index].partyAddresses.push(pstAddress);
      }
      self.addonCards()[index].productGroupSerialNumber = self.productDetails().requirements.productGroupSerialNumber;
      var addonCards = ko.mapping.toJS(ko.mapping.fromJS(self.addonCards()));
      var payload = {
        addonCards: addonCards[index]
      };

      CardAddonModelObject.updateAddOnCardDetails(self.productDetails().submissionId.value, ko.mapping.toJSON(payload.addonCards, {
        "ignore": ["selectedValues", "temp_isActive", "temp_isAddressSameAsPrimary", "temp_isResAddressSameAsPrimary", "temp_maskedNumber", "temp_maskedSSN", "temp_permanentResident", "simulationId", "temp_previousAddressRequired", "temp_showAddressSwitch", "temp_showPreviousAddress"]
      })).done(function(data) {
        if (self.addonCards() && self.addonCards().length > 0) {
          self.addonCards()[index].temp_isActive(false);
          if (!self.addonCards()[index].partyId) {
            self.addonCards()[index].partyId = {};
          }
          if (data.addOnCardHolders) {
            self.addonCards()[index].partyId.value = data.addOnCardHolders[0].partyId.value;
          }
          var cardVal = self.addonCards()[index].identifications[0].id();
          var cardLen = 5;
          self.addonCards()[index].selectedValues().primaryInfo.suffix = rootParams.baseModel.getDescriptionFromCode(self.suffixOptions(), self.addonCards()[index].applicantDTO.personalInfo.suffix());
          self.addonCards()[index].selectedValues().primaryInfo.salutation = rootParams.baseModel.getDescriptionFromCode(self.salutations(), self.addonCards()[index].applicantDTO.personalInfo.salutation());
          self.addonCards()[index].selectedValues().primaryInfo.citizenship = rootParams.baseModel.getDescriptionFromCode(self.countries(), self.addonCards()[index].applicantDTO.personalInfo.citizenship());
          self.addonCards()[index].selectedValues().primaryInfo.residentCountry = rootParams.baseModel.getDescriptionFromCode(self.countries(), self.addonCards()[index].applicantDTO.personalInfo.residentCountry());
          self.addonCards()[index].selectedValues().currentAddress.accomodationType = rootParams.baseModel.getDescriptionFromCode(self.accomodationOptions(), self.addonCards()[index].partyAddresses[0].accomodationType);
          self.addonCards()[index].selectedValues().currentAddress.state = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.addonCards()[index].partyAddresses[0].postalAddress.state);
          self.productDetails().addonDetails.addonCards = self.addonCards();
          self.productDetails().addonDetails.addonCards[index].temp_maskedNumber = self.applyPattern(self.maskValue(cardVal, cardLen), [
            3,
            2,
            4
          ], 0);
        } else {
          self.productDetails().addonDetails = {};
        }
        self.showContinue(true);
      });
    };
    self.deleteAddOn = function(index) {
      self.addonCards()[index].productGroupSerialNumber = self.productDetails().requirements.productGroupSerialNumber;
      var addonCards = ko.mapping.toJS(ko.mapping.fromJS(self.addonCards()));
      var payload = {
        addonCards: addonCards[index]
      };
      CardAddonModelObject.deleteAddOnCardDetails(self.productDetails().submissionId.value, ko.mapping.toJSON(payload.addonCards, {
        "ignore": ["selectedValues", "temp_isActive", "temp_isAddressSameAsPrimary", "temp_isResAddressSameAsPrimary", "temp_maskedNumber", "temp_maskedSSN", "temp_permanentResident", "simulationId", "temp_previousAddressRequired", "temp_showAddressSwitch", "temp_showPreviousAddress"]
      })).done(function() {
        self.productDetails().addonDetails.addonCards = self.addonCards();
      });
    };
    self.saveAddon = function(event) {
      if (event.detail.value === "OPTION_NO" && event.detail.previousValue === "OPTION_YES") {
        for (var j = 0; j < self.addonCards().length; j++) {
          if (self.addonCards()[j].partyId && self.addonCards()[j].partyId.value) {
            self.deleteAddOn(j);
          }
        }
        self.addonCards([]);
        self.productDetails().addonDetails = {};
        self.usedAddonCards(0);
        self.showContinue(true);
        self.isAddOnTransaction(false);
        self.redrawAddonCards(false);
      }
      if (event.detail.value === "OPTION_YES" && event.detail.previousValue === "OPTION_NO") {
        self.isAddOnTransaction(true);
        self.getAddonDetails();
      }
    };
    self.saveAddress = function(index, event) {
      if (event.detail.value === "OPTION_NO" && event.detail.previousValue === "OPTION_YES") {
        self.refreshAddresses(false);
        self.addonCards()[index].partyAddresses[0] = {
          type: "RES",
          status: "CURRENT",
          postalAddress: {
            line1: "",
            line2: "",
            city: "",
            state: "",
            country: "US",
            postalCode: ""
          },
          accomodationType: "",
          stayingSince: ""
        };
        for (var i = 0; i < self.addonCards()[index].partyAddresses.length; i++) {
          if (self.addonCards()[index].partyAddresses[i].status === "PAST") {
            self.addonCards()[index].temp_showPreviousAddress(false);
            self.addonCards()[index].temp_previousAddressRequired(false);
            self.addonCards()[index].partyAddresses.splice(i, 1);
            break;
          }
        }
        self.addonCards()[index].temp_isResAddressSameAsPrimary(false);
        ko.tasks.runEarly();
        self.refreshAddresses(true);
      }
      if (event.detail.value === "OPTION_YES" && event.detail.previousValue === "OPTION_NO") {
        self.refreshAddresses(false);
        self.addonCards()[index].partyAddresses[0] = self.applicantDetails()[0].contactInfo.contactInfo.address;
        self.addonCards()[index].partyAddresses[0].stayingSince = null;
        self.addonCards()[index].temp_isResAddressSameAsPrimary(true);
        ko.tasks.runEarly();
        self.refreshAddresses(true);
      }
    };
    self.initializeForm = function() {
      if (self.productDetails().addonDetails && self.productDetails().addonDetails.addonCards) {
        if (self.productDetails().addonDetails.addonCards[0].balanceTransferAmount > 0) {
          self.isAddOnTransaction(true);
          for (i = 0; i < self.usedAddonCards(); i++) {
            self.addonCards()[i].currencyCode = self.productDetails().addonDetails.addonCards[i].currencyCode;
            self.addonCards()[i].cardIssuerName(self.productDetails().addonDetails.addonCards[i].cardIssuerName);
          }
        } else {
          self.isAddOnTransaction(false);
          self.optedForAddOnHolder("OPTION_NO");
        }
      } else {
        self.isAddOnTransaction(true);
        self.optedForAddOnHolder("OPTION_YES");
      }
    };
    self.initializeModel = function() {
      if (self.productDetails().addonDetails) {
        if (self.productDetails().addonDetails.addonCards) {
          self.usedAddonCards(self.productDetails().addonDetails.addonCards.length);
        }
      } else {
        self.usedAddonCards(0);
      }
      if (self.usedAddonCards() === 0) {
        var card = getNewKoModel().addonCard;
        card.applicantDTO.personalInfo.citizenship(self.resource.citizenship.toUpperCase());
        card.temp_isActive(true);
        self.showContinue(false);
        self.usedAddonCards(1);
        self.addonCards().push(card);
      }
      self.redrawAddonCards(true);
      self.dataLoaded(true);
      if (self.usedAddonCards() < self.maxAddonCardsAllowed()) {
        self.showAdd(true);
      }
    };
    self.checkStayingSince = function(index, event) {
      if (event.detail.value) {
        self.addonCards()[index].temp_previousAddressRequired(false);
        var dateData = event.detail.value.replace("-", "").replace("-", "");
        CardAddonModelObject.checkStayingSinceDate(self.productDetails().submissionId.value, self.applicantDetails()[0].applicantId().value, dateData).fail(function() {
          var isPASTPresent = false;
          for (var i = 0; i < self.addonCards()[index].partyAddresses.length; i++) {
            if (self.addonCards()[index].partyAddresses[i].status === "PAST") {
              isPASTPresent = true;
              break;
            }
          }
          if (!isPASTPresent) {
            var prevAdd = {
              type: "RES",
              status: "PAST",
              postalAddress: {
                line1: "",
                line2: "",
                city: "",
                state: "",
                country: "US",
                postalCode: ""
              },
              accomodationType: ""
            };
            self.addonCards()[index].partyAddresses.push(prevAdd);
          }
          self.addonCards()[index].temp_previousAddressRequired(true);
          self.addonCards()[index].temp_showPreviousAddress(true);
        }).done(function() {
          for (var i = 0; i < self.addonCards()[index].partyAddresses.length; i++) {
            if (self.addonCards()[index].partyAddresses[i].status === "PAST") {
              self.addonCards()[index].partyAddresses.splice(i, 1);
              break;
            }
          }
        });
      }
    };
    self.accomodationtypeChanged = function(index, event, data) {
      if (data.option === "value" && self.addonCards()[index].partyAddresses[0].accomodationType && self.accommodationDataLoaded()) {
        var accomodationType = self.addonCards()[index].partyAddresses[0].accomodationType;
        self.addonCards()[index].selectedValues().currentAddress.accomodationType = rootParams.baseModel.getDescriptionFromCode(self.accomodationOptions(), accomodationType);
      }
    };
    self.prevaccomodationtypeChanged = function(index, event, data) {
      if (data.option === "value" && self.addonCards()[index].partyAddresses[1].accomodationType && self.accommodationDataLoaded()) {
        var accomodationType = self.addonCards()[index].partyAddresses[1].accomodationType;
        self.addonCards()[index].selectedValues().previousAddress.accomodationType = rootParams.baseModel.getDescriptionFromCode(self.accomodationOptions(), accomodationType);
      }
    };
    CardAddonModelObject.fetchSalutations().then(function(data) {
      self.salutations(data.enumRepresentations[0].data);
      self.salutationsLoaded(true);
    });
    CardAddonModelObject.fetchSuffixes().done(function(data) {
      self.suffixOptions(data.enumRepresentations[0].data);
      self.suffixLoaded(true);
    });
    CardAddonModelObject.fetchCountries().done(function(data) {
      for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.countries().push({
          code: data.enumRepresentations[0].data[i].code,
          description: data.enumRepresentations[0].data[i].description
        });
      }
      self.countriesLoaded(true);
    });
    var enumCallsFinishedDeferred = $.Deferred();
    self.enumCallsFinished = function() {
      $.when(CardAddonModelObject.fetchSuffixes(), CardAddonModelObject.fetchSalutations(), CardAddonModelObject.fetchCountries()).done(function() {
        enumCallsFinishedDeferred.resolve(true);
      });
      return enumCallsFinishedDeferred;
    };
    self.enumCallsFinished().done(function() {
      self.getAddonDetails();
    });
    self.maskedSsnNumberFocusIn = function(event) {
      var id = event.currentTarget.id.replace(/\D/g, "");
      self.addonCards()[id].temp_maskedSSN(self.addonCards()[id].identifications[0].id());
      self.addonCards()[id].temp_maskedSSN(self.applyPattern(self.addonCards()[id].temp_maskedSSN(), [
        3,
        2,
        4
      ], 0));
    };
    self.maskedSsnNumberFocusOut = function(event) {

      var id = event.currentTarget.id.replace(/\D/g, "");
      if (event.target.value === "xxx-xx-xxxx") {
        return;
      }
      var val = event.target.value.replace(/\-|\d/g, "");
      if (val.length > 0) {
        event.target.value = null;
        self.addonCards()[id].identifications[0].id("");
        self.addonCards()[id].temp_maskedSSN("");
      } else {
        self.addonCards()[id].identifications[0].id(event.target.value.replace(/\-/g, ""));
        self.addonCards()[id].temp_maskedSSN(event.target.value.replace(/[^\-]/g, "x"));
        event.target.value = event.target.value.replace(/[^\-]/g, "x");
      }
    };
    self.maskedSsnNumberKeyUp = function(event) {
      var id = event.currentTarget.id.replace(/\D/g, "");
      self.addonCards()[id].temp_maskedSSN(event.target.value);
      self.addonCards()[id].temp_maskedSSN(self.addonCards()[id].temp_maskedSSN().replace(/\-/g, ""));
      self.addonCards()[id].temp_maskedSSN(self.applyPattern(self.addonCards()[id].temp_maskedSSN(), [
        3,
        2,
        4
      ], 0));
    };
  };
});
