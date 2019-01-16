define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "./model",
  "ojL10n!resources/nls/upgrade-card",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojcheckboxset"
], function(oj, ko, $, BaseLogger, UpgradeCardModel, ResourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    /**
     * getNewKoModel - to get new model
     *
     * @return {type}  description
     */
    var getNewKoModel = function() {
      var KoModel = UpgradeCardModel.getNewModel();
      return KoModel;
    };
    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.dataLoaded = ko.observable(false);
    self.detailsDisplayed = ko.observable(false);
    self.accountId = ko.observable(self.params.accountId.value);
    self.currentCardNo = ko.observable(self.params.cardNo.value);
    self.reviewEnable = ko.observable(false);
    self.cardTypes = ko.observableArray();
    self.upcardCardModel = self.previousState && self.previousState.upcardCardModel?self.previousState.upcardCardModel:ko.observable(getNewKoModel().upcardCardModel);
    self.addressDetails = self.previousState && self.previousState.addressDetails ? self.previousState.addressDetails:ko.mapping.fromJS(getNewKoModel().addressDetails);
    self.debitCardDetailsObject = self.previousState && self.previousState.debitCardDetailsObject ? ko.observable(self.previousState.debitCardDetailsObject):ko.observable(self.params);
    self.cardHolderDetails = {
      cardHolderName: self.debitCardDetailsObject().cardHolderName,
      cardHolderEmailId: Params.dashboard.userData.userProfile.emailId.displayValue,
      cardHolderPhoneNo: Params.dashboard.userData.userProfile.phoneNumber.displayValue
    };
    self.termsAndConditions = ko.observableArray([]);
    Params.baseModel.registerElement("address");
    Params.baseModel.registerComponent("review-upgrade-card", "demand-deposits");
    Params.dashboard.headerName(self.resource.upgradeDebitCard);
    var generateBenefitsArray = function(arr) {
      for (var i = 0; i < arr.length; i++) {
        arr[i].domestic = ko.observableArray();
        arr[i].international = ko.observableArray();
        arr[i].other = ko.observableArray();
        for (var j = 0; j < arr[i].debitCardBenefits.length; j++) {
          if (arr[i].debitCardBenefits[j].isDomesticLimit) {
            arr[i].domestic.push(arr[i].debitCardBenefits[j]);
          }
          if (arr[i].debitCardBenefits[j].isInternationalLimit) {
            arr[i].international.push(arr[i].debitCardBenefits[j]);
          }
          if (!arr[i].debitCardBenefits[j].isDomesticLimit && !arr[i].debitCardBenefits[j].isInternationalLimit) {
            arr[i].other.push(arr[i].debitCardBenefits[j]);
          }
        }
      }
    };

    UpgradeCardModel.fetchCardTypes(self.currentCardNo()).done(function(data) {
      self.cardTypes(data.debitCardTypeList);
      generateBenefitsArray(self.cardTypes());
      UpgradeCardModel.fetchCardTypeBenefits().done(function(data) {
        for (var i = 0; i < self.cardTypes().length; i++) {
          self.cardTypes()[i].offers = data.cardTypes[0].offers;
          self.cardTypes()[i].rewards = data.cardTypes[0].rewards;
        }
        self.dataLoaded(true);
      });
    });

    self.viewDetailsClick = function() {
      self.detailsDisplayed(!self.detailsDisplayed());
    };

    self.getCardTypeIndex = function(cardType) {
      for (var i = 0; i < self.cardTypes().length; i++) {
        if (cardType === self.cardTypes()[i].debitCardType) {
          return i;
        }
      }
    };

    self.cardTypeChangeHandler = function() {
      if (event.detail.value && self.detailsDisplayed()) {
        self.detailsDisplayed(false);
        ko.tasks.runEarly();
        self.detailsDisplayed(true);
      }
    };

    /**
     * function to laod review page
     *
     * @return {void}  description
     */
    self.review = function() {
      self.common = self.resource;
      var context = {};
      context.addressDetails = self.addressDetails;
      context.upcardCardModel={};
      context.upcardCardModel.cardType = self.upcardCardModel.cardType;
      context.accountId = self.accountId();
      context.cardNo = self.currentCardNo();
      context.debitCardDetailsObject = self.debitCardDetailsObject();
      Params.dashboard.loadComponent("review-upgrade-card", context, self);
    };
    self.showTermsAndConditions = function() {
      $("#passwordDialog").trigger("openModal");
    };
    self.ok = function(){
      $("#passwordDialog").trigger("closeModal");
    };
    self.showFloatingPanel = function() {
      $("#panelDebitCard3").trigger("openFloatingPanel");
    };
  };
});
