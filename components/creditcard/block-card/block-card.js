define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",

  "ojL10n!resources/nls/block-card",
  "ojs/ojknockout",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojvalidation",
  "ojs/ojradioset"
], function(oj, ko, $, BlockCardModel, BaseLogger, ResourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.isDataLoaded = ko.observable(false);
    self.haveReasonsLoaded = ko.observable(false);
    self.cardObject = self.params;
    self.resource = ResourceBundle;
    Params.baseModel.registerComponent("account-nickname", "accounts");
    self.reasonsArray = ko.observableArray();
    self.initiateBlock = ko.observable(true);
    self.verifyBlock = ko.observable(false);
    self.blockFlag = ko.observable(false);
    self.validationTracker = ko.observable();
    self.common = self.resource.common;
    self.selectedReason = ko.observableArray([]);
    self.referenceNumber = ko.observable();
    Params.dashboard.headerName(self.resource.blockCard.cardHeading);
    self.blockingType = ko.observable("Block");
    self.ownerName = ko.observable();
    self.replaceConfirmationType = ko.observable();
    self.valueToSendBlockReview = ko.observable();
    self.valueToSendReplace = ko.observable();
    self.actionType = ko.observable();
    self.reasonType = ko.observable();
    self.smallblockCard = ko.observable();
    var valueToSendReplace, valueToSendBlock, valueToSendBlockReview;
    var context = {};
    self.creditCardId = ko.observable();
    self.creditCardDisplayId = ko.observable();
    self.moduleURL = ko.observable();
    self.additionalCardDetails = ko.observable();
    self.httpStatus = ko.observable();
    self.blockServiceId = ko.observable();
    Params.baseModel.registerComponent("review-block-card", "creditcard");
    Params.baseModel.registerComponent("reset-pin", "creditcard");
    Params.baseModel.registerComponent("auto-pay", "creditcard");
    Params.baseModel.registerComponent("add-on-card", "creditcard");
    Params.baseModel.registerComponent("card-pay", "creditcard");
    Params.baseModel.registerComponent("card-statement", "creditcard");
    Params.baseModel.registerComponent("request-pin", "creditcard");
    self.mode = ko.observable("VIEW");
    self.srNo = ko.observable();
    self.creditCardId.subscribe(function() {
      self.isDataLoaded(false);
      if (Params.baseModel.small()) {
        self.cardObject = self.additionalCardDetails() ? self.additionalCardDetails() : self.cardObject;
        if (self.mode() === "VIEW") {
          self.creditCardDisplayId(self.cardObject.creditCard.displayValue);
        }
      }
      if (self.mode() === "VIEW") {
        self.creditCardDisplayId(self.cardObject.creditCard.displayValue);
      } else {
        self.creditCardDisplayId(self.cardObject.creditCardDisplayId);
      }
      ko.tasks.runEarly();
      self.isDataLoaded(true);
    });
    if (self.params.id) {
      self.creditCardId(self.params.id.value);
      self.creditCardDisplayId(self.params.id.displayValue);
    }
    if (self.params.jsonData) {
      self.moduleURL(self.params.jsonData.moduleURL);
    }

    self.addressDetails = {
      modeofDelivery: ko.observable(null),
      addressType: ko.observable(null),
      addressTypeDescription: ko.observable(null),
      postalAddress: ko.observable({}),
      city: ko.observable(null),
      country: ko.observable(null),
      branch: ko.observable(null)
    };
    Params.baseModel.registerElement("address");
    Params.baseModel.registerElement("confirm-screen");
    Params.baseModel.registerComponent("cancellation", "creditcard");
    self.blockVerify = function() {
      if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      if (self.replaceConfirmationType() === "OPTION_YES") {
        valueToSendBlockReview = {
          actionType: self.blockingType(),
          reasonType: self.selectedReason()[0]
        };
        context.valueToSendReplace = valueToSendReplace;
        context.valueToSendBlockReview = valueToSendBlockReview;
        context.actionType = valueToSendBlockReview.actionType;
        context.reasonType = valueToSendBlockReview.reasonType;
        context.addressDetails = self.addressDetails;
        context.ownerName = self.params.ownerName;
      } else {
        valueToSendBlockReview = {
          actionType: self.blockingType(),
          reasonType: self.selectedReason()[0]
        };
        context.actionType = valueToSendBlockReview.actionType;
        context.reasonType = valueToSendBlockReview.reasonType;
        context.valueToSendBlockReview = valueToSendBlockReview;
      }
      self.verifyBlock(true);
      self.initiateBlock(false);
      context.replaceConfirmationType = self.replaceConfirmationType();
      context.headerName = Params.dashboard.headerName();
      context.creditCardId = self.creditCardId();
      context.creditCardDisplayId = self.creditCardDisplayId();
      context.verifyBlock = self.verifyBlock();
      context.initiateBlock = self.initiateBlock();
      Params.dashboard.loadComponent("review-block-card", context, self);
    };
    self.showFloatingPanel = function () {
        $("#panelCreditCard5").trigger("openFloatingPanel");
    };
    self.blockConfirm = function() {
      valueToSendBlock = {
        "statusType": "HTL",
        "statusUpdateReason": {
          "hotlistReason": self.selectedReason()[0]
        }
      };
      if (self.replaceConfirmationType() === "OPTION_YES") {
        valueToSendReplace = {
          "ownerName": self.cardObject.ownerName,
          "embossName": self.cardObject.ownerName,
          "reason": self.selectedReason()[0],
          "modeOfDel": self.addressDetails.modeofDelivery() === "ACC" ? "COR" : self.addressDetails.modeofDelivery(),
          "brnNam": self.addressDetails.postalAddress.branch,
          "brnCity": self.addressDetails.postalAddress.city,
          "addLine1": self.addressDetails.postalAddress.line1,
          "addLine2": self.addressDetails.postalAddress.line2,
          "addLine3": self.addressDetails.postalAddress.line3,
          "city": self.addressDetails.postalAddress.city,
          "state": self.addressDetails.postalAddress.state,
          "country": self.addressDetails.postalAddress.country,
          "zipCode": self.addressDetails.postalAddress.zipCode,
          "addressType": self.addressDetails.addressType()
        };
        BlockCardModel.blockCard(ko.toJSON(valueToSendBlock), self.creditCardId()).done(function(data, status, jqXhr) {
          self.httpStatus(jqXhr.status);
          if (self.httpStatus() === 200) {
            self.blockFlag(true);
            self.blockServiceId(data.serviceID);
          }
          if (self.blockFlag()) {
            BlockCardModel.replaceCard(ko.toJSON(valueToSendReplace), self.creditCardId()).done(function(data, status, jqXhr) {
              if (self.blockServiceId()) {
                Params.dashboard.loadComponent("confirm-screen", {
                  jqXHR: jqXhr,
                  srNo: data.serviceID,
                  serviceNos: {
                    items: [{
                      label: Params.baseModel.format(self.resource.blockCard.srMessage, {
                        txn: self.resource.blockCard.cardHeading
                      }),
                      value: self.blockServiceId()
                    }]
                  },
                  template: "confirm-screen/casa-template",
                  transactionName: self.resource.blockCard.cardHeading,
                  confirmScreenExtensions: {
                    isSet: true,
                    taskCode: "CC_N_BCCC"
                  }
                }, self);
              } else {
                Params.dashboard.loadComponent("confirm-screen", {
                  jqXHR: jqXhr,
                  srNo: data.serviceID,
                  transactionName: self.resource.blockCard.cardHeading,

                  confirmScreenExtensions: {
                    isSet: true,
                    template: "confirm-screen/cc-template",
                    responseNo: {
                      items: [{
                        label: self.resource.blockCard.status,
                        value: self.resource.blockCard.blockMessage
                      }]
                    },
                    flagBlockCard: true,
                    actionType: context.actionType,
                    reasonType: context.reasonType,
                    taskCode: "CC_N_BCCC"
                  }
                }, self);
              }
              self.verifyBlock(false);
              self.initiateBlock(false);
            });
          }
        });
      } else {
        BlockCardModel.blockCard(ko.toJSON(valueToSendBlock), self.creditCardId()).done(function(data, status, jqXhr) {
          if (data.serviceId) {
            self.srNo(data.serviceId);
            Params.dashboard.loadComponent("confirm-screen", {
              jqXHR: jqXhr,
              sr: true,
              transactionName: self.resource.blockCard.cardHeading,
              srNo: self.srNo(),
              serviceNo: data.serviceId,
              confirmScreenExtensions: {
                isSet: true,
                template: "confirm-screen/cc-template",
                taskCode: "CC_N_BCCC",
                flagBlockCard: true,
                actionType: context.actionType,
                reasonType: context.reasonType
              }
            }, self);
          } else {
            Params.dashboard.loadComponent("confirm-screen", {
              jqXHR: jqXhr,
              transactionName: self.resource.blockCard.cardHeading,

              confirmScreenExtensions: {
                isSet: true,
                taskCode: "CC_N_BCCC",
                template: "confirm-screen/cc-template",
                flagBlockCard: true,
                actionType: context.actionType,
                reasonType: context.reasonType
              }
            }, self);
          }
          self.verifyBlock(false);
          self.initiateBlock(false);
        });
      }
    };
    if (!self.verifyBlock() && self.selectedReason().length === 0) {
      BlockCardModel.getHotlistReasons().done(function(data) {
        for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.reasonsArray().push({
            code: data.enumRepresentations[0].data[i].code,
            description: self.resource.blockCard[data.enumRepresentations[0].data[i].code]
          });
        }
        self.haveReasonsLoaded(true);
      });
    }
    self.creditCardParser = function(data) {
      data.accounts = data.creditcards;
      data.accounts.map(function(creditCard) {
        creditCard.id = creditCard.creditCard;
        creditCard.partyId = data.associatedParty;
        creditCard.accountNickname = creditCard.cardNickname;
        creditCard.associatedParty = data.associatedParty;
        return creditCard;
      });
      return data;
    };
  };
});
