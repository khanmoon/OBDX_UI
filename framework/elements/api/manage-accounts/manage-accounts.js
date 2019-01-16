define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/manage-accounts",
  "json!local!./manage-accounts-links",
  "ojs/ojknockout-validation"
], function(oj, ko, $, locale, ManageAccountsJSON) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.currentModule = ManageAccountsJSON[self.params.applicationType];
    self.locale = locale;
    self.selectedTabData = null;
    self.defaultData = null;
    self.isReady = ko.observable(false);
    self.menuSelection = ko.observable();
    self.menuOptions = ko.observableArray();
    self.validationTracker = ko.observable();
    self.accountNumberSelected = ko.observable();
    self.additionalDetails = ko.observable();
    rootParams.baseModel.registerElement("nav-bar");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerElement("account-input");
    self.uiOptions = {
      "menuFloat": "left",
      "fullWidth": false,
      "defaultOption": self.menuSelection
    };
    self.menuSelection(self.params.defaultTab);
    if(self.menuSelection()){
      rootParams.dashboard.headerName(locale.tabs[self.params.applicationType][self.menuSelection()]);
      rootParams.dashboard.helpComponent.componentName(self.menuSelection());
    }
    self.menuSelection.subscribe(function(componentName) {
      document.getElementById("message-box").closeAll();
      ko.components.defaultLoader.getConfig(componentName, function(componentConfig) {
        rootParams.baseModel.currentPage.module = componentConfig.module;
        rootParams.baseModel.currentPage.component = componentName;
      });
      ko.utils.extend(self.params, {
        defaultTab: componentName
      });
      self.selectedTabData = self.currentModule.filter(function(element) {
        return element.component === componentName;
      })[0];
      rootParams.dashboard.helpComponent.componentName(componentName);
    });
    self.changeView = function(txnName, data) {
      self.defaultData = data;
      self.menuSelection(txnName);
    };
    function menuFilter() {
      var itemToRemove = [];
      if (self.params.cardType === "ADDON" && self.params.cardStatus === "ACT") {
        itemToRemove = itemToRemove.concat([
          "card-statement",
          "card-pay",
          "auto-pay",
          "reset-pin",
          "add-on-card"
        ]);
      } else if (self.params.cardType === "PRIMARY" && self.params.cardStatus === "IAT") {
        itemToRemove = itemToRemove.concat([
          "request-pin",
          "auto-pay",
          "reset-pin",
          "add-on-card"
        ]);
      } else if (self.params.cardType === "ADDON" && self.params.cardStatus === "IAT") {
        itemToRemove = itemToRemove.concat([
          "card-statement",
          "card-pay",
          "request-pin",
          "auto-pay",
          "reset-pin",
          "add-on-card"
        ]);
      } else if (self.params.cardType === "PRIMARY" && self.params.cardStatus === "HTL") {
        itemToRemove = itemToRemove.concat([
          "request-pin",
          "block-card",
          "auto-pay",
          "reset-pin",
          "add-on-card"
        ]);
      } else if (self.params.cardType === "ADDON" && self.params.cardStatus === "HTL") {
        itemToRemove = itemToRemove.concat([
          "card-statement",
          "card-pay",
          "request-pin",
          "block-card",
          "auto-pay",
          "reset-pin",
          "add-on-card"
        ]);
      } else if (self.params.cardType === "PRIMARY" && self.params.cardStatus === "CLD") {
        itemToRemove = itemToRemove.concat([
          "card-pay",
          "request-pin",
          "block-card",
          "auto-pay",
          "reset-pin",
          "add-on-card"
        ]);
      } else if (self.params.cardType === "ADDON" && self.params.cardStatus === "CLD") {
        itemToRemove = itemToRemove.concat([
          "card-statement",
          "card-pay",
          "request-pin",
          "block-card",
          "auto-pay",
          "reset-pin",
          "add-on-card"
        ]);
      }
      self.currentModule = self.currentModule.filter(function(item) {
        return itemToRemove.indexOf(item.component) === -1;
      });
      self.currentModule.forEach(function(item) {
        self.menuOptions.push({
          id: item.component,
          label: self.locale.tabs[self.params.applicationType][item.component]
        });
        rootParams.baseModel.registerComponent(item.component, item.module);
      });
      self.menuSelection(self.params.defaultTab || self.menuOptions()[0].id);
      rootParams.dashboard.headerName(locale.tabs[self.params.applicationType][self.menuSelection()]);
    }
    self.selectAccount = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      ko.utils.extend(self.params, self.additionalDetails());
      $("#manageAccountsAccountNumberDropdown").trigger("closeModal");
      menuFilter();
      self.isReady(true);
    };
    self.afterRender = function() {
      if (self.params.moduleURL) {
        $("#manageAccountsAccountNumberDropdown").trigger("openModal");
        ko.utils.extend(self.params, {
          moduleURL: null
        });
      } else {
        menuFilter();
        self.isReady(true);
      }
    };
    self.modalCloseHandler = function() {
      if (!self.additionalDetails()) {
        rootParams.dashboard.openDashboard();
      }
    };
    self.creditCardList = ko.observableArray();
    self.creditCardParser = function(data) {
      data.creditcards.forEach(function(item) {
        if (self.menuSelection() === "card-details") {
          self.creditCardList.push(item);
        }
        if (self.menuSelection() === "card-statement") {
          if (item.cardType === "PRIMARY")
            self.creditCardList.push(item);
        }
        if (self.menuSelection() === "card-pay") {
          if (item.cardType === "PRIMARY" && item.cardStatus !== "CLD")
            self.creditCardList.push(item);
        }
        if (self.menuSelection() === "request-pin") {
          if (item.cardStatus === "ACT")
            self.creditCardList.push(item);
        }
        if (self.menuSelection() === "block-card") {
          if (item.cardStatus === "ACT" || item.cardStatus === "IAT")
            self.creditCardList.push(item);
        }
        if (self.menuSelection() === "auto-pay") {
          if (item.cardType === "PRIMARY" && item.cardStatus === "ACT")
            self.creditCardList.push(item);
        }
        if (self.menuSelection() === "reset-pin") {
          if (item.cardType === "PRIMARY" && item.cardStatus === "ACT")
            self.creditCardList.push(item);
        }
        if (self.menuSelection() === "add-on-card") {
          if (item.cardType === "PRIMARY" && item.cardStatus === "ACT")
            self.creditCardList.push(item);
        }
      });
      data.accounts = self.creditCardList();
      data.accounts.map(function(creditCard) {
        creditCard.id = creditCard.creditCard;
        creditCard.partyId = data.associatedParty;
        creditCard.partyName = creditCard.ownerName;
        creditCard.accountNickname = creditCard.cardNickname;
        creditCard.associatedParty = data.associatedParty;
        return creditCard;
      });
      return data;
    };
  };
});
