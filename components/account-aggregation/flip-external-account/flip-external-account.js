define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/aggregate-flip-account",
  "./model",
  "json!local!./flip-external-account-links",
  "ojs/ojlistview",
  "ojs/ojarraytabledatasource",
  "ojs/ojselectcombobox",
  "ojs/ojbutton",
  "ojs/ojmenu",
  "ojs/ojoption"
], function(oj, ko, $, ResourceBundle, Model, LinksJSON) {
  "use strict";
  return function(rootParams) {
    var self = this;
    self.resource = ResourceBundle;
    self.options = LinksJSON;
    self.bankRelatedData = ko.observableArray();
    rootParams.baseModel.registerComponent("account-transactions", "accounts");
    self.statusSelected = ko.observable("ACTIVE");
    self.menuOptionsArray = ko.observableArray([]);
    self.totalAccount = ko.observable(0);
    self.loadAccounts = ko.observable(false);
    self.type = rootParams.type;
    self.turnCard = rootParams.turnCard;
    self.parentObject = {};
    var filteredData = ko.computed(function() {
      if (rootParams.type() && rootParams.filteredAccount[rootParams.type()]) {
        return ko.utils.arrayFilter(rootParams.filteredAccount[rootParams.type()](), function(account) {
          account.accountId = account.id.value;
          return true;
        });
      }
      return [];
    }, self);
    var typeSubcription = rootParams.type.subscribe(function() {
      self.statusSelected("ACTIVE");
    });
    filteredData.subscribe(function(value) {
      self.loadAccounts(false);
      self.parentObject = {};
      var counter = 0;
      value.forEach(function(account) {
        if (!self.parentObject[account.bankName]) self.parentObject[account.bankName] = [];
        self.parentObject[account.bankName].push(account);
        counter = counter + 1;
      });
      if (Object.keys(self.parentObject).length > 0) {
        ko.tasks.runEarly();
        self.loadAccounts(true);
      }
      self.totalAccount(counter);
    });
    self.accountMap = {
      "CSA": "accounts/demandDeposit?status=CLOSED&status=DORMANT",
      "TRD": "accounts/deposit?module=CON&module=ISL&status=CLOSED&status=DORMANT",
      "LON": "accounts/loan?status=CLOSED&status=DORMANT",
      "RD": "accounts/deposit?module=RD&status=CLOSED&status=DORMANT"
    };
    var fetchInactiveAccounts = function(type) {
      var module = self.accountMap[type];
      if (module) {
        Model.getInactiveAccounts(module).done(function(data) {
          data.accounts.forEach(function(element) {
            element.type = rootParams.type();
          });
          ko.utils.arrayPushAll(rootParams.filteredAccount[rootParams.type()], data.accounts);
          self.accountMap[type] = null;
          rootParams.type.valueHasMutated();
        });
      }
    };
    self.optionChangedHandler = function(event) {
      if (event.detail.value) {
        var status = event.detail.value,
          type = rootParams.type();
        self.statusSelected(status);
        if (status === "INACTIVE" && type) {
          fetchInactiveAccounts(type);
        }
      }
    };

    self.accountsTypes = [{
        value: "ACTIVE",
        label: self.resource.activeAccounts
      },
      {
        value: "INACTIVE",
        label: self.resource.inactiveAccounts
      }
    ];
    self.openMenu = function(model, event) {
      var launcherId = event.currentTarget.attributes.id.nodeValue;
      self.launcherId = launcherId;
      document.getElementById(self.launcherId + "-container").open();

    };
    self.menuItemSelect = function(event, data) {
      if (self.statusSelected() === "ACTIVE" || self.type === "CCA") {
        rootParams.dashboard.loadComponent("manage-accounts", ko.utils.extend(data, {
          defaultTab: event.target.value,
          applicationType: self.options[rootParams.type()].module
        }));
      } else {
        rootParams.baseModel.registerComponent(event.target.value, self.options[rootParams.type()].module);
        rootParams.dashboard.loadComponent(event.target.value, data);
      }
    };
    self.linkClick = function(data) {
      rootParams.baseModel.registerComponent(data.id, data.module);
      if (data.applicationType) {
        rootParams.dashboard.loadComponent("manage-accounts", ko.utils.extend(data, {
          defaultTab: data.id,
          applicationType: data.applicationType
        }));
      } else {
        rootParams.dashboard.loadComponent(data.id);
      }
    };


    var countname = "";
    self.checkbankName = function(data) {
      var returndata = "";

      if (countname) {
        if (countname === data) {
          returndata = null;
        } else if (countname !== data) {
          countname = data;
          returndata = data;
        }
      } else {
        countname = data;
        return data;
      }
      return returndata;
    };

    self.evaluateMenu = function(data) {
      if (data.type === "CCA") {
        if (data.cardType === "PRIMARY" && data.cardStatus === "ACT") {
          return self.options[data.type].menuActivePrimary;
        } else if (data.cardType === "ADDON" && data.cardStatus === "ACT") {
          return self.options[data.type].menuActiveAddon;
        } else if (data.cardType === "PRIMARY" && data.cardStatus === "IAT") {
          return self.options[data.type].menuInactivePrimary;
        } else if (data.cardType === "ADDON" && data.cardStatus === "IAT") {
          return self.options[data.type].menuInactiveAddon;
        } else if (data.cardType === "PRIMARY" && data.cardStatus === "HTL") {
          return self.options[data.type].menuHotlistedPrimary;
        } else if (data.cardType === "ADDON" && data.cardStatus === "HTL") {
          return self.options[data.type].menuHotlistedAddon;
        } else if (data.cardType === "PRIMARY" && data.cardStatus === "CLD") {
          return self.options[data.type].menuCancelledPrimary;
        } else if (data.cardType === "ADDON" && data.cardStatus === "CLD") {
          return self.options[data.type].menuCancelledAddon;
        }
      } else if (data.status === "ACTIVE")
        return self.options[data.type].menuOptions;
      else
        return self.options[data.type].menuClosedOptions;
    };
    if (!rootParams.baseModel.small() || rootParams.baseModel.small()) {
      rootParams.type.valueHasMutated();
    }
    self.dispose = function() {
      filteredData.dispose();
      typeSubcription.dispose();
    };
  };
});
