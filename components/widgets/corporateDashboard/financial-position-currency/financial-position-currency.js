define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/financial-position-currency",
  "framework/js/constants/constants",
  "ojs/ojinputtext",
  "ojs/ojchart"
], function(ko, $, Model, resourceBundle, Constants) {
  "use strict";
  return function(rootParams) {
    var self = this;
    self.nls = resourceBundle;
    rootParams.baseModel.registerElement([
      "action-header",
      "action-widget"
    ]);
    self.accountsData = ko.observable();
    self.creditCardsData = ko.observable();
    self.isAccountsDataLoaded = ko.observable(false);
    self.isCreditCardsDataLoaded = ko.observable(false);
    self.liability = ko.observableArray();
    self.assets = ko.observableArray();
    self.barSeriesValue = ko.observableArray();
    self.barGroupsValue = ko.observableArray();
    self.resultObj = ko.observableArray();
    self.showChart = ko.observable(false);
    self.selectedPartyID = ko.observableArray();
    self.segregatedData = ko.observableArray();
    self.conventionalAccountsAvailable = ko.observable(false);
    self.islamicAccountsAvailable = ko.observable(false);
    self.selectedValue = ko.observable();
    self.isAccountsDataLoaded = ko.observable(false);
    self.accountDataSource = ko.observableArray();
    self.creditCardInfo = ko.observableArray();
    self.legendObject = rootParams.baseModel.large() ? {
      position: "end",
      maxSize: "50%"
    } : {
      position: "bottom"
    };

    self.typeOfAccounts = [{
        id: "CON",
        label: self.nls.financialPositionDetails.labels.conventionalAccount
    }, {
        id: "ISL",
        label: self.nls.financialPositionDetails.labels.islamicAccount
    }];
    self.stackValue = ko.observable("on");
    self.stackValueChart = ko.observable("on");
    self.legendSections = [{
      title: self.nls.financialPositionDetails.labels.liabilityLabel.type,
      items: [{
          color: "#3caf85",
          text: self.nls.financialPositionDetails.labels.assetsLabel,
          id: self.nls.financialPositionDetails.labels.assetsLabel
        },
        {
          color: "#e40004",
          text: self.nls.financialPositionDetails.labels.liabilityLabel,
          id: self.nls.financialPositionDetails.labels.liabilityLabel
        }
      ]
    }];
    self.getSum = function(array) {
      var sum = 0;
      if (array && array.length > 0) {
        for (var j = 0; j < array.length; j++) {
          if (array[j].type === "LON") {
            sum = sum + array[j].outstandingAmount.amount;
          } else if (array[j].type === "CSA" || array[j].type === "TRD") {
            sum = sum + array[j].availableBalance.amount;
          } else if (array[j].type === "CCA") {
            if (array[j].cardType === "PRIMARY") {
              sum = sum + array[j].due.equivalentBilledAmount.amount;
            }
          }
        }
      }
      return sum;
    };

    function chartData(accountsData, cardsData) {
      self.showChart(false);
      self.assetItems = [];
      self.liabilityItems = [];
      self.currencyList = [];
      self.liability([]);
      self.assets([]);
      self.resultObj([]);
      self.currency = [];
      self.barSeriesValue.removeAll();
      self.barGroupsValue.removeAll();
      ko.utils.arrayForEach(accountsData, function(item) {
        if (item.type === "CSA" || item.type === "TRD") {
          if (item.availableBalance.amount > 0) {
            self.assets()[item.currencyCode] = self.assets()[item.currencyCode] || [];
            self.currencyList.push(item.currencyCode);
            self.assets()[item.currencyCode].push(item);
          } else {
            self.liability()[item.currencyCode] = self.liability()[item.currencyCode] || [];
            self.currencyList.push(item.currencyCode);
            self.liability()[item.currencyCode].push(item);
          }
        } else if (item.type === "LON") {
          self.liability()[item.currencyCode] = self.liability()[item.currencyCode] || [];
          self.currencyList.push(item.currencyCode);
          self.liability()[item.currencyCode].push(item);
        }
      });
      if (cardsData) {
        ko.utils.arrayForEach(cardsData.creditcards, function(item) {
          item.type = "CCA";
          self.liability()[item.cardCurrency] = self.liability()[item.cardCurrency] || [];
          self.currencyList.push(item.cardCurrency);
          self.liability()[item.cardCurrency].push(item);
        });
      }


      if (self.currencyList.length > 0) {
        self.currency = ko.utils.arrayGetDistinctValues(self.currencyList).sort();
        ko.utils.arrayForEach(self.currency, function(item) {
          self.resultObj.push({
            currency: item,
            assets: self.getSum(self.assets()[item], item),
            liabilities: -self.getSum(self.liability()[item], item)
          });
        });
        ko.utils.arrayForEach(self.resultObj(), function(item) {
          self.assetItems.push(item.assets);
          self.liabilityItems.push(item.liabilities);
        });
        var barSeries = [{
          name: self.nls.financialPositionDetails.labels.assetsLabel,
          categories: [self.nls.financialPositionDetails.labels.assetsLabel],
          color: "#3caf85",
          displayInLegend: "off",
          items: self.assetItems
        }, {
          name: self.nls.financialPositionDetails.labels.liabilityLabel,
          categories: [self.nls.financialPositionDetails.labels.liabilityLabel],
          color: "#e40004",
          displayInLegend: "off",
          items: self.liabilityItems
        }];
        self.barSeriesValue(barSeries);
        var barGroups = self.currency;
        self.barGroupsValue(barGroups);
        self.showChart(true);
      }
    }
    self.mainFunction = function(value) {
      var partyAccountData;
      if (value) {
        partyAccountData = self.segregatedData().filter(function(element) {
          return element.id === value[0];
        });
      }
      if (rootParams.dashboard.isDashboard()) {
        self.accountsData(value ? partyAccountData[0] : self.accountsData());
      }

    };
    var groupBy = function(array, callback) {
      var groups = {};
      array.forEach(function(item) {
        var group = JSON.stringify(callback(item));
        groups[group] = groups[group] || [];
        groups[group].push(item);
      });
      return Object.keys(groups).map(function(group) {
        return {
          id: JSON.parse(group).shift(),
          accounts: groups[group],
          name: JSON.parse(group).pop()
        };
      });
    };

    self.selectedAccountTypeChangedHandler = function(event) {
      self.accountDataSource.removeAll();
      if (self.isAccountsDataLoaded()) {
        self.accountDataSource(self.accountsData());
        self.creditCardInfo(self.creditCardsData());
        self.accountDataSource(self.accountDataSource().accounts.filter(function(item) {
          return item.module.indexOf(event.detail.value) > -1;
        }));
      }
      chartData(self.accountDataSource(), self.creditCardInfo());

    };

    function setData(data) {
      self.isAccountsDataLoaded(false);
      self.accountsData(data);
      var result = groupBy(data.accounts, function(item) {
        return [
          item.partyId.value,
          item.partyName
        ];
      });
      ko.utils.arrayPushAll(self.segregatedData, result);

      self.segregatedData.unshift({
        accounts: data.accounts,
        id: "all",
        name: self.nls.financialPositionDetails.labels.all
      });

      ko.utils.arrayForEach(self.accountsData().accounts, function(item) {
        if (item.module === "CON") {
          self.conventionalAccountsAvailable(true);
        } else {
          self.islamicAccountsAvailable(true);
        }
      });
      if (self.conventionalAccountsAvailable() && self.islamicAccountsAvailable()) {
        self.isAccountsDataLoaded(true);
      } else {
        chartData(self.accountsData().accounts, self.creditCardsData());
      }
      self.isAccountsDataLoaded(true);
    }
    self.selectedPartyID.subscribe(function(newValue) {
      if (newValue[0] === "all") {
        self.mainFunction();
      } else {
        self.mainFunction(newValue);
      }
    });
    Promise.all([Model.fetchAccountsDetails(), Constants.userSegement === "RETAIL" ? Model.fetchCreditCardsDetails() : Promise.resolve(null)]).then(function(response) {
      setData(response[0]);
      self.creditCardsData(response[1]);
      self.mainFunction();
    });
    self.tooltip = {
      renderer: function(dataContext) {
        var pieChartNode = document.createElement("div");

        pieChartNode.innerHTML =
          "<div>" +
          "<div data=\"series\">" + rootParams.baseModel.format(self.nls.financialPositionDetails.labels.tooltip.series, {
            series: dataContext.series
          }) + "</div>" +
          "<div data=\"group\">" + rootParams.baseModel.format(self.nls.financialPositionDetails.labels.tooltip.group, {
            group: dataContext.group
          }) + "</div>" +
          "<div data=\"data\">" + rootParams.baseModel.format(self.nls.financialPositionDetails.labels.tooltip.value, {
            value: rootParams.baseModel.formatCurrency(dataContext.y || 0, dataContext.group)
          }) + "</div>" +
          "</div>";

        return {
          "insert": pieChartNode
        };
      }
    };
  };
});
