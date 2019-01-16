define([
  "knockout",
  "jquery",

  "ojL10n!resources/nls/debit-card",
  "./model"
], function(ko, $, ResourceBundle, DebitCardModel) {
  "use strict";
  return function(rootParams) {
    var self = this,
      getNewKoModel = function() {
        var KoModel = DebitCardModel.getNewModel();
        return ko.mapping.fromJS(KoModel);
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.cardData = rootParams.data;
    self.nls = ResourceBundle;
    self.cardParam = rootParams.dataParam;
    self.cardData.isActive = ko.observable(false);
    self.cardData.action = ko.observable(self.nls.block);
    rootParams.baseModel.registerElement("modal-window");
    if (self.params.jsonData)
      self.cardParam.jsonData = self.params.jsonData;
    if (self.cardData.status === "ACTIVATED") {
      self.cardData.isActive(true);
      self.cardData.action(self.nls.active);
    }
    self.openCardDetailsTab = function(selectedTab) {
      self.selectedTab = selectedTab;
      self.cardParam.defaultTab = selectedTab;
      rootParams.dashboard.loadComponent("manage-accounts", ko.utils.extend(self.cardParam, {
        applicationType: "debit-card"
      }), self);
    };
    self.onSwitchChange = function() {
      if (self.cardData.isActive()) {
        $("#debitCardBlockAlert" + self.cardParam.cardNo.value).trigger("openModal");
      } else {
        $("#debitCardUnblockAlert" + self.cardParam.cardNo.value).trigger("openModal");
      }
    };
    self.unblockCard = function() {
      var requestdata = {
        elements: []
      };
      var elementsData = [];
      elementsData[0] = getNewKoModel().requestData;
      elementsData[0].label = "accountId";
      elementsData[0].values = [];
      elementsData[0].values[0] = self.cardParam.accountId.value;
      elementsData[0].displayValues = [];
      elementsData[0].displayValues[0] = self.cardParam.accountId.displayValue;
      elementsData[0].indirectionTypes = [];
      elementsData[0].indirectionTypes[0] = self.cardParam.accountId.value;
      elementsData[1] = getNewKoModel().requestData;
      elementsData[1].label = "cardNo";
      elementsData[1].values = [];
      elementsData[1].values[0] = self.cardParam.cardNo.value;
      elementsData[1].displayValues = [];
      elementsData[1].displayValues[0] = self.cardParam.cardNo.displayValue;
      elementsData[1].indirectionTypes = [];
      elementsData[1].indirectionTypes[0] = self.cardParam.cardNo.value;
      requestdata.elements = elementsData;
      var payload;
      self.activateDebitCardRequest = getNewKoModel().activateDebitCard;
      self.activateDebitCardRequest.requestType = "UNBLOCKED_DEBIT_CARD";
      self.activateDebitCardRequest.requestData = JSON.stringify(requestdata);
      self.activateDebitCardRequest.requestData = self.activateDebitCardRequest.requestData.replace(/"/g, "\"");
      self.activateDebitCardRequest.entityTypeIdentifier = self.cardParam.cardNo.value;
      self.activateDebitCardRequest.status = "PE";
      self.activateDebitCardRequest.entityTypeIdentifierKey = "DE";
      self.activateDebitCardRequest.priorityType = "M";
      self.activateDebitCardRequest.entityType = "DE";
      self.activateDebitCardRequest.definition.id = "SRX000000020";
      payload = ko.toJSON(self.activateDebitCardRequest);
      rootParams.baseModel.registerElement("confirm-screen");
      DebitCardModel.createActivateDebitCardRequest(payload).done(function(data, status, jqXhr) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          sr: true,
          transactionName: self.nls.transactionName,
          template: "confirm-screen/casa-template",
          serviceNo: data.serviceId,
          confirmScreenExtensions: {
            isSet: true,
            taskCode: "SR_N_CRT"
          }
        }, self);
      });
      self.cardData.isActive(false);
      $("#debitCardUnblockAlert" + self.cardParam.cardNo.value).trigger("closeModal");
    };

    self.closeHandler = function(modalWindowId) {
      if (modalWindowId === "debitCardUnblockAlert") {
        self.cardData.isActive(false);
      } else {
        self.cardData.isActive(true);
      }
    };
  };
});
