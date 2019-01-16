define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/loan-portfolio",
  "ojs/ojinputtext",
  "ojs/ojchart"
], function(ko, $, Model, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerElement("action-widget");
    self.nls = resourceBundle;
    self.accounts = ko.observableArray();
    self.productTypes = ko.observableArray();
    self.productTypeBasedList = ko.observableArray();
    self.productTypeSeries = ko.observableArray();
    self.accountsLoaded = ko.observable(false);
    self.dataLoaded = ko.observable(false);
    self.legendObject = rootParams.baseModel.large() ? {
      position: "end",
      maxSize: "50%"
    } : {
      position: "bottom"
    };

    self.typeOfAccounts = [{
      id: "CON",
      label: self.nls.accountDetails.labels.conventionalAccount
    }, {
      id: "ISL",
      label: self.nls.accountDetails.labels.islamicAccount
    }];

    self.selectedAccountTypeChangedHandler = function(event) {
      self.dataLoaded(false);
      var filteredArray = [];
      self.productTypes.removeAll();
      self.productTypeSeries.removeAll();
      ko.utils.arrayPushAll(filteredArray, self.accounts().filter(function(element) {
        return element.module.indexOf(event.detail.value) > -1;
      }));
      if (filteredArray.length > 0) {
        filteredArray.forEach(function(element) {
          self.productTypes.push(element.productDTO.name);
        });
      }

      self.distinctNames = ko.utils.arrayGetDistinctValues(self.productTypes()).sort();
      ko.utils.arrayForEach(self.productTypes(), function(item) {
        self.productTypeBasedList()[item] = self.productTypeBasedList()[item] || [];
        self.productTypeBasedList()[item].push(item);
      });

      for (var k = 0; k < self.distinctNames.length; k++) {
        self.productTypeSeries.push({
          name: self.distinctNames[k],
          items: [self.productTypeBasedList()[self.distinctNames[k]].length]
        });
      }
      self.dataLoaded(true);
    };

    Model.fetchAccounts().then(function(data) {
      if (data && data.accounts) {
        self.accounts(data.accounts);
        self.accountsLoaded(true);
      }
    });
  };
});
