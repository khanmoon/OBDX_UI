define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",

  "ojL10n!resources/nls/debit-card-hotlisting",
  "ojs/ojknockout",
  "ojs/ojselectcombobox",
  "ojs/ojradioset"
], function(oj, ko, $, HotlistModel, BaseLogger, locale) {
  "use strict";
  return function(Params) {
    var self = this,
      getNewKoModel = function() {
        var KoModel = HotlistModel.getNewModel();
        return ko.mapping.fromJS(KoModel);
      },
      selectedValueArray;
    ko.utils.extend(self, Params.rootModel);
    self.showAddressComponent = ko.observable(false);
    self.locale = locale;
    self.showFunction = self.loadComponent;
    self.loadConfirm = ko.observable(false);
    self.cardObject = self.params;
    self.data = self.cardObject;
    self.common = locale.common;
    Params.dashboard.headerName(self.locale.header.blockCard);
    self.replaceConfirmationType = self.previousState && self.previousState.replaceConfirmationType ? ko.observable(self.previousState.replaceConfirmationType) : ko.observable();
    self.addressReviewEnable = ko.observable(false);
    self.rootModelInstance = getNewKoModel();
    self.hotlistData = self.rootModelInstance.hotListModel;
    self.replaceCardPayload = self.rootModelInstance.replaceModel;
    self.addressDetails = self.previousState && self.previousState.addressDetails ? self.previousState.addressDetails : self.rootModelInstance.addressDetails;
    self.serviceRequestNumber = ko.observable();
    self.validationTracker = ko.observable();
    self.selectedReason = self.previousState && self.previousState.selectedReason ? self.previousState.selectedReason : ko.observable();
    self.reasonsArray = ko.observableArray();
    self.isDataLoaded = ko.observable(false);
    self.stageOne = ko.observable(true);
    self.stageTwo = ko.observable(false);
    self.stageThree = ko.observable(false);
    self.stageFour = ko.observable(false);
    self.serviceId = ko.observable();
    self.srNo = ko.observable();
    self.loadReview = ko.observable(false);
    self.reasonReview = self.reasonReview || ko.observable();
    self.currentCardNo = ko.observable();
    self.submitDisabled = ko.observable(true);
    self.accountId = ko.observable();
    self.blockTypeList = ko.observableArray([{
        code: "TEM",
        description: self.locale.blockType.temp
      },
      {
        code: "HOTLIST",
        description: self.locale.blockType.hotlist
      }
    ]);
    self.selectBlockType = self.previousState && self.previousState.selectBlockType ? ko.observable(self.previousState.selectBlockType.code) : ko.observable();
    if (self.params.cardStatus === "ACTIVATED") {
      self.cardTypeStatus = self.locale.active;
    } else {
      self.cardTypeStatus = self.locale.inactive;
    }
    self.currentCardNo(self.cardObject.cardNo.value);
    self.accountId(self.cardObject.accountId.value);
    Params.baseModel.registerElement("confirm-screen");
    Params.baseModel.registerElement("address");
    self.nextStage = function(event) {
      if (event.detail.value) {
        selectedValueArray = self.selectedReason().split("-");
        self.reasonReview(selectedValueArray[1]);
        var context = {};
        context.reasonReview = self.reasonReview();
        context.headerName = self.locale.header.blockCard;
        context.mode = "REVIEW";
        context.accountId = self.accountId();
        context.currentCardNo = self.currentCardNo();
        context.selectedValueArray = selectedValueArray;
        Params.dashboard.loadComponent("review-debit-card-hotlisting", context, self);
      }
    };
    Params.baseModel.registerComponent("review-debit-card-hotlisting", "demand-deposits");

    self.reviewAddress = function() {
      if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      self.stageOne(false);
      self.stageTwo(false);
      self.stageThree(false);
      self.stageFour(false);
      self.loadReview(false);
      self.loadConfirm(false);
      self.showAddressComponent(false);
      self.addressReviewEnable(true);
      location.hash = "review";
    };
    self.cancel = function() {
      self.addressReviewEnable(false);
      self.showAddressComponent(true);
    };
    HotlistModel.fetchHotlistReasons().done(function(data) {
      for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.reasonsArray.push({
          description: data.enumRepresentations[0].data[i].description,
          code: data.enumRepresentations[0].data[i].code
        });
      }
      self.isDataLoaded(true);
    });
    self.requestNewCard = function() {
      self.stageTwo(false);
      self.stageOne(false);
      self.stageThree(false);
      self.showAddressComponent(true);
    };
    self.submit = function() {
      if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      var context = {};
      context.headerName = self.locale.header.blockCard;
      context.mode = "REVIEW";
      context.accountId = self.accountId();
      context.currentCardNo = self.currentCardNo();
      context.displayAccountNo = self.params.accountId.displayValue;
      context.dispalyCardNo = self.cardObject.cardNo.displayValue;
      if (self.selectBlockType() === "HOTLIST") {
        selectedValueArray = self.selectedReason().split("-");
        self.reasonReview(selectedValueArray[1]);
        context.reasonReview = self.reasonReview();
        context.selectedValueArray = selectedValueArray;
        context.replaceConfirmationType = self.replaceConfirmationType();
        context.addressDetails = self.addressDetails;
        context.selectedReason = self.selectedReason();
      }
      for (var k = 0; k < self.blockTypeList().length; k++) {
        if (self.selectBlockType() === self.blockTypeList()[k].code) {
          context.selectBlockType = self.blockTypeList()[k];
          break;
        }
      }
      Params.dashboard.loadComponent("review-debit-card-hotlisting", context, self);
    };
    self.redirect = function() {
      window.location.href = "demand-deposits.html";
    };
    self.ok = function() {
      self.stageOne(false);
      self.stageTwo(false);
      self.stageThree(false);
      self.stageFour(false);
      self.loadReview(false);
      self.loadConfirm(false);
      self.showAddressComponent(false);
      self.addressReviewEnable(false);
      history.back();
    };
    self.showFloatingPanel = function() {
      $("#panelDebitCard5").trigger("openFloatingPanel");
    };
  };
});
