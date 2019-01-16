define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/financial-position",
  "framework/js/constants/constants",
  "ojs/ojsunburst",
  "ojs/ojlegend"
], function(ko, $, Model, resourceBundle, Constants) {
  "use strict";
  return function(rootParams) {
    var self = this;
    self.accountsData = ko.observable();
    self.creditCardDetails = ko.observable();
    self.totalCASAPositiveAmount = ko.observable();
    self.totalCASANegativeAmount = ko.observable();
    self.totalCreditCardAmount = ko.observable(0);
    self.totalTDAmount = ko.observable();
    self.totalLoanAmount = ko.observable();
    self.baseCcy = ko.observable();
    self.assetsAmount = 0;
    self.liabilitiesAmount = 0;
    self.netWorth = ko.observable(0);
    self.selectedPartyID = ko.observableArray();
    self.nls = resourceBundle;
    self.numLayers = ko.observable(3);
    self.nodeValues = ko.observableArray([]);
    self.assestLegendSections = ko.observableArray();
    self.liabilitiesLegendSections = ko.observableArray();
    self.cardDetailsloaded = ko.observable(false);
    self.netWorthLabel = self.nls.accountDetails.labels.netWorth;
    self.assestsLabel = self.nls.accountDetails.labels.assets;
    self.liabilitiesLabel = self.nls.accountDetails.labels.liabilities;
    self.casaLabel = self.nls.accountDetails.labels.demandDepositsText;
    self.loanLabel = self.nls.accountDetails.labels.loansText;
    self.tdLabel = self.nls.accountDetails.labels.termDepositsText;
    self.assestsLegendTitleStyle = ko.observable("font-weight:600;");
    self.liabilitiesLegendTitleStyle = ko.observable("font-weight:600;");
    self.dataLoaded = ko.observable(false);
    self.accountDataSource = ko.observableArray();
    self.accountsLoaded = ko.observable(false);
    self.checkEmpty = function(obj) {
      for (var prop in obj) {
        if (obj[prop]) {
          return false;
        }
      }
      return true;
    };

    self.typeOfAccounts = [{
      id: "CON",
      label: self.nls.accountDetails.labels.conventionalAccount
    }, {
      id: "ISL",
      label: self.nls.accountDetails.labels.islamicAccount
    }];

    function getDetails(name, ratio, amount, colorValue) {
      var color = colorValue;
      var perAmount = rootParams.baseModel.formatNumber(ratio, "percent", 2, 1);
      return {
        label: name,
        color: color,
        value: perAmount,
        fraction: rootParams.baseModel.formatNumber(ratio, "decimal", 4) * 100,
        amount: rootParams.baseModel.formatCurrency(amount, self.baseCcy())
      };
    }

    function getLabelDesc(label) {
      if (label === 0) {
        return getDetails(self.netWorthLabel, 1, self.netWorth(), "#267db3");
      } else if (label === 1) {
        return getDetails(self.liabilitiesLabel, self.liabilitiesAmount / (self.assetsAmount + self.liabilitiesAmount), self.liabilitiesAmount, "#5fefef");
      } else if (label === 2) {
        return getDetails(self.assestsLabel, self.assetsAmount / (self.assetsAmount + self.liabilitiesAmount), self.assetsAmount, "#8561c8");
      } else if (label === 3) {
        return getDetails(self.loanLabel, self.totalLoanAmount() / self.liabilitiesAmount, self.totalLoanAmount(), "#ed6647");
      } else if (label === 4) {
        return getDetails(self.casaLabel, Math.abs(self.totalCASANegativeAmount() / self.liabilitiesAmount), Math.abs(self.totalCASANegativeAmount()), "#68c182");
      } else if (label === 5) {
        return getDetails(self.casaLabel, self.totalCASAPositiveAmount() / self.assetsAmount, self.totalCASAPositiveAmount(), "#68c182");
      } else if (label === 6) {
        return getDetails(self.tdLabel, self.totalTDAmount() / self.assetsAmount, self.totalTDAmount(), "#fad55c");
      }
    }

    function createNode(label) {
      var labelDescription = getLabelDesc(label);
      return {
        label: labelDescription.label,
        id: label.toString(),
        value: (labelDescription.fraction > 2 || labelDescription.fraction === 0) ? labelDescription.fraction : 2,
        labelDisplay: "off",
        color: labelDescription.color,
        percent: labelDescription.value,
        amount: labelDescription.amount
      };
    }

    function generateNewChildren(numChildren, layer, index) {
      var childArray = [];
      for (var i = 0; i < numChildren; i++) {
        childArray.push(createNode(index + i + 1, layer + 1));
      }
      return childArray;
    }

    function addChildNodes(parent, childNodes) {
      parent.nodes = [];
      for (var i = 0; i < childNodes.length; i++) {
        parent.nodes.push(childNodes[i]);
      }
    }

    function generateData(numLayers, parent, index) {
      if (numLayers > 1) {
        var children = generateNewChildren(2, Math.abs(numLayers - self.numLayers()) + 1, index);
        addChildNodes(parent, children);
        for (var i = 0; i < children.length; i++) {
          generateData(numLayers - 1, children[i], (index + i + 1) * 2);
        }
      }
    }

    function getConventionalAccounts(accountData) {
      self.assetsAmount = (0);
      self.liabilitiesAmount = (0);
      self.totalCASAPositiveAmount(0);
      self.totalCASANegativeAmount(0);
      self.totalCreditCardAmount(0);
      self.totalTDAmount(0);
      self.totalLoanAmount(0);
      self.netWorth(0);
      ko.utils.arrayForEach(accountData.summary.items, function(item) {

        if (item.accountType === "CSA") {
          self.totalCASAPositiveAmount(self.totalCASAPositiveAmount() + item.totalActiveAvailableBalance.amount);
          self.totalCASANegativeAmount(self.totalCASANegativeAmount() + (item.totalActiveNegativeBalance.amount * -1));
          if (!self.baseCcy() && item.totalActiveAvailableBalance.currency) {
            self.baseCcy(item.totalActiveAvailableBalance.currency);
          }
          if (!self.baseCcy() && item.totalActiveNegativeBalance.currency) {
            self.baseCcy(item.totalActiveNegativeBalance.currency);
          }
        }
        if (item.accountType === "TRD") {
          self.totalTDAmount(self.totalTDAmount() + item.totalActiveAvailableBalance.amount);
          if (!self.baseCcy() && item.totalActiveAvailableBalance.currency) {
            self.baseCcy(item.totalActiveAvailableBalance.currency);
          }
        }
        if (item.accountType === "LON") {
          self.totalLoanAmount(self.totalLoanAmount() + item.totalActiveOutstandingBalance.amount);
          if (!self.baseCcy() && item.totalActiveOutstandingBalance.currency) {
            self.baseCcy(item.totalActiveOutstandingBalance.currency);
          }
        }
      });
      if (!self.checkEmpty(self.creditCardDetails())) {
        self.totalCreditCardAmount(self.creditCardDetails.sumOfEquivalentDue.amount);
        if (!self.baseCcy() && self.creditCardDetails.sumOfEquivalentDue.currency) {
          self.baseCcy(self.creditCardDetails.sumOfEquivalentDue.currency);
        }
      }

      self.assetsAmount = self.totalCASAPositiveAmount() + self.totalTDAmount();

      self.liabilitiesAmount = self.totalLoanAmount() + self.totalCreditCardAmount() + self.totalCASANegativeAmount();

      self.netWorth((self.assetsAmount - self.liabilitiesAmount));
    }

    function getIslamicAccounts(accountData) {
      self.assetsAmount = (0);
      self.liabilitiesAmount = (0);
      self.totalCASAPositiveAmount(0);
      self.totalCASANegativeAmount(0);
      self.totalCreditCardAmount(0);
      self.totalTDAmount(0);
      self.totalLoanAmount(0);
      self.netWorth(0);
      ko.utils.arrayForEach(accountData.summary.items, function(item) {
        if (item.accountType === "CSA") {
          self.totalCASAPositiveAmount(self.totalCASAPositiveAmount() + item.totalISLActiveAvailableBalance.amount);
          self.totalCASANegativeAmount(self.totalCASANegativeAmount() + (item.totalISLActiveNegativeBalance.amount * -1));

          if (!self.baseCcy() && item.totalISLActiveAvailableBalance.currency) {
            self.baseCcy(item.totalISLActiveAvailableBalance.currency);
          }

          if (!self.baseCcy() && item.totalISLActiveNegativeBalance.currency) {
            self.baseCcy(item.totalISLActiveNegativeBalance.currency);
          }
        }

        if (item.accountType === "TRD") {
          self.totalTDAmount(self.totalTDAmount() + item.totalISLActiveAvailableBalance.amount);

          if (!self.baseCcy() && item.totalISLActiveAvailableBalance.currency) {
            self.baseCcy(item.totalISLActiveAvailableBalance.currency);
          }
        }

        if (item.accountType === "LON") {
          self.totalLoanAmount(self.totalLoanAmount() + item.totalISLActiveOutstandingBalance.amount);

          if (!self.baseCcy() && item.totalISLActiveOutstandingBalance.currency) {
            self.baseCcy(item.totalISLActiveOutstandingBalance.currency);
          }
        }
      });

      if (!self.checkEmpty(self.creditCardDetails())) {
        self.totalCreditCardAmount(self.creditCardDetails.sumOfEquivalentDue.amount);
        if (!self.baseCcy() && self.creditCardDetails.sumOfEquivalentDue.currency) {
          self.baseCcy(self.creditCardDetails.sumOfEquivalentDue.currency);
        }
      }
      self.assetsAmount = self.totalCASAPositiveAmount() + self.totalTDAmount();

      self.liabilitiesAmount = self.totalLoanAmount() + self.totalCreditCardAmount() + self.totalCASANegativeAmount();

      self.netWorth((self.assetsAmount - self.liabilitiesAmount));
    }

    self.selectedAccountTypeChangedHandler = function(event) {
      self.accountDataSource(self.accountsData);
      self.dataLoaded(false);
      self.nodeValues.removeAll();
      if (self.accountsLoaded()) {
        if (event.detail.value === "CON") {
          getConventionalAccounts(self.accountsData());
        } else {
          getIslamicAccounts(self.accountsData());
        }

        var root = createNode(0, 1);
        generateData(self.numLayers(), root, 0);
        self.nodeValues = ko.observableArray([root]);
        self.numLayers.subscribe(function(newValue) {
          var root = createNode(0, 1);
          generateData(newValue, root, 0);
          self.nodeValues([root]);
        });

        self.assestLegendSections = ko.observableArray([{
          items: [{
              text: getLabelDesc(5).label,
              color: getLabelDesc(5).color
            },
            {
              text: getLabelDesc(6).label,
              color: getLabelDesc(6).color
            }
          ]
        }]);
        self.liabilitiesLegendSections = ko.observableArray([{
          items: [{
            text: getLabelDesc(3).label,
            color: getLabelDesc(3).color
          }, {
            text: self.nls.accountDetails.labels.demandDepositsOD,
            color: getLabelDesc(5).color
          }]
        }]);

      }
      ko.tasks.runEarly();
      self.dataLoaded(true);
    };

    self.mainFunction = function() {

      Model.fetchAccountsDetails().then(function(data) {
        if (data && data.summary) {
          self.accountsData(data);
          self.accountsLoaded(true);
        }

        if (Constants.userSegement === "RETAIL") {
          Model.fetchCreditCardsDetails().then(function(data) {
            self.creditCardDetails(data);
            self.cardDetailsloaded(true);
          });
        }
        self.dataLoaded(true);
      });
    };
    self.mainFunction();


    self.tooltip = {
      renderer: function(dataContext) {
        var pieChartNode = document.createElement("div");
        var data = dataContext.data;

        pieChartNode.innerHTML =
          "<div>" +
          "<div data=\"label\">" + data.label + "</div>" +
          "<div data=\"amount\">" + data.amount + "</div>" +
          "<div data=\"percent\">" + data.percent + "</div>" +
          "</div>";

        return {
          "insert": pieChartNode
        };
      }
    };
  };
});
