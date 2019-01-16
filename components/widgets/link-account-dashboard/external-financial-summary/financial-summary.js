define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/ext-financial-summary",
  "text!./externalBankAccounts.json",
  "ojs/ojarraytabledatasource",
  "ojs/ojaccordion",
  "ojs/ojlistview"
], function(oj, ko, $, ListingModel, ResourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    self.resource = ResourceBundle;
    self.dataLoaded = ko.observable(false);
    self.localAccountsLoaded = ko.observable(false);
    self.extAccountsLoaded = ko.observable(false);
    self.excessLen = ko.observable(false);

    self.renderFlipAccount = ko.observable(false);
    var accountType = [
      "CSA",
      "TRD",
      "LON"
    ];
    self.filteredAccount = {};
    self.items = ko.observableArray();
    self.localAccountAggregation = ko.observableArray();
    self.extAccountAggregation = ko.observableArray();
    self.accountList = ko.observableArray();

    self.accountList.push({
      type: "LOCAL",
      accounts: ko.observableArray()
    });

    self.accountList.push({
      type: "EXT",
      accounts: ko.observableArray()
    });


    self.responseCount = ko.observableArray();
    self.rateResponseCount = ko.observableArray();
    self.rateArray = ko.observableArray([]);
    self.type = ko.observable();
    self.bankConfig = "";

    self.dataSource = new oj.ArrayTableDataSource(self.items, {
      idAttribute: "type"
    });
    for (var index = 0; index < accountType.length; index++) {
      self.items.push({
        type: accountType[index],
        value: 0,
        ccy: "",
        loaded: ko.observable(false)
      });
      self.localAccountAggregation.push({
        type: accountType[index],
        value: 0,
        ccy: "",
        loaded: ko.observable(false)
      });
      self.extAccountAggregation.push({
        type: accountType[index],
        value: 0,
        ccy: "",
        loaded: ko.observable(false)
      });
    }
    self.selectedType = ko.observable();
    rootParams.baseModel.registerComponent("flip-external-account", "account-aggregation");
    self.showingFront = true;
    self.openAccount = function(data) {
      if (data.type === "TRD") {
        rootParams.baseModel.registerComponent("td-open", "term-deposits");
        rootParams.dashboard.loadComponent("td-open", {});
      }
    };
    self.turnCard = function(data) {
      var elem = document.getElementById("animatable");
      var startAngle = self.showingFront ? "0deg" : "180deg";
      var endAngle = self.showingFront ? "180deg" : "0deg";
      oj.AnimationUtils.flipOut(elem, {
        "flipTarget": "children",
        "persist": "all",
        "startAngle": startAngle,
        "timingFunction": "cubic-bezier(0.175, 0.885, 0.32, 1.4)",
        "endAngle": endAngle
      });
      self.showingFront = !self.showingFront;
      if (self.showingFront) {
        $("#MyAccountHeading").focus();
        if (rootParams.baseModel.large()) {
          $("#accountResults").addClass("hide");
        }
      } else {
        self.type(data.type);
        $("#flipAccountHeading").focus();
        if (rootParams.baseModel.large()) {
          oj.Context.getContext(document.querySelector("#accountResults")).getBusyContext().whenReady().then(function() {
            $("#accountResults").removeClass("hide");
          });
        }
      }
    };
    self.listClick = function(data) {
      if (!data.loaded()) {
        self.openAccount(data);
      } else {
        self.selectedType(data.type);
        self.turnCard(data);
      }
    };

    function checkAndSave(type, account) {
      if (!self.filteredAccount[type]) {
        self.filteredAccount[type] = ko.observableArray();
      }
      self.filteredAccount[type].push(account);

    }

    function filterAccount(accounts) {
      for (var item = 0; item < accounts.length; item++) {
        accounts[item].bankName = accounts[item].bankName || self.resource.labels.myBankName;
        if (accounts[item].type === "CSA") {
          checkAndSave("CSA", accounts[item]);
        } else if (accounts[item].type === "TRD" && accounts[item].module === "RD") {
          accounts[item].type = "RD";
          checkAndSave("RD", accounts[item]);
        } else if (accounts[item].type === "TRD") {
          checkAndSave("TRD", accounts[item]);
        } else if (accounts[item].type === "LON") {
          checkAndSave("LON", accounts[item]);
        }
      }
      self.renderFlipAccount(true);
    }

    function setData(data) {
      self.renderFlipAccount(false);
      var summarydata = data.summary.items;
      if (summarydata) {
        for (var number = 0; number < summarydata.length; number++) {
          if (summarydata[number].accountType === "TRD") {
            self.localAccountAggregation()[1].value += summarydata[number].totalActiveAvailableBalance.amount + summarydata[number].totalISLActiveAvailableBalance.amount;
            self.localAccountAggregation()[1].ccy = summarydata[number].totalActiveAvailableBalance.currency;
            self.localAccountAggregation()[2].value += summarydata[number].totalRDActiveAvailableBalance.amount;
            self.localAccountAggregation()[2].ccy = summarydata[number].totalRDActiveAvailableBalance.currency;
          } else if (summarydata[number].accountType === "LON") {
            self.localAccountAggregation()[2].value += summarydata[number].totalActiveOutstandingBalance.amount + summarydata[number].totalISLActiveOutstandingBalance.amount;
            self.localAccountAggregation()[2].ccy = summarydata[number].totalActiveOutstandingBalance.currency;
          } else if (summarydata[number].accountType === "CSA") {
            self.localAccountAggregation()[0].value += summarydata[number].totalActiveAvailableBalance.amount + summarydata[number].totalISLActiveAvailableBalance.amount;
            self.localAccountAggregation()[0].ccy = summarydata[number].totalActiveAvailableBalance.currency;
          }
        }
		self.localAccountAggregation.valueHasMutated();
		self.dataSource.reset();
		filterAccount(data.accounts);
    self.localAccountsLoaded(true);
      } else if(!self.localAccountsLoaded()) {
      self.localAccountsLoaded(false);
		}
    self.localAccountAggregation()[0].loaded(true);
    self.localAccountAggregation()[1].loaded(true);
    self.localAccountAggregation()[2].loaded(true);
    }

    function setexternalbankData(data) {
      if (!self.renderFlipAccount())
        self.renderFlipAccount(false);
      var summarydata = data.externalBankAccountDTOs;
      if (summarydata) {
        for (var k = 0; k < summarydata.length; k++) {
          if (summarydata[k].type === "TRD") {

            if (self.bankConfig.localCurrency === summarydata[k].availableBalance.currency) {
              self.extAccountAggregation()[1].value += summarydata[k].availableBalance.amount;
              self.extAccountAggregation()[1].ccy = self.bankConfig.localCurrency;
            } else {
              for (var count = 0; count < self.rateArray().length; count++) {
                if (self.rateArray()[count].toCCY === summarydata[k].availableBalance.currency) {
                  if (self.rateArray()[count].opt === "*") {
                    self.extAccountAggregation()[1].value += (self.rateArray()[count].rate * summarydata[k].availableBalance.amount);
                    self.extAccountAggregation()[1].ccy = self.bankConfig.localCurrency;
                  } else {
                    self.extAccountAggregation()[1].value += (summarydata[k].availableBalance.amount / self.rateArray()[count].rate);
                    self.extAccountAggregation()[1].ccy = self.bankConfig.localCurrency;
                  }
                }
              }
            }
          } else if (summarydata[k].type === "CSA") {

            if (self.bankConfig.localCurrency === summarydata[k].availableBalance.currency) {
              self.extAccountAggregation()[0].value += summarydata[k].availableBalance.amount;
              self.extAccountAggregation()[0].ccy = self.bankConfig.localCurrency;
            } else {
              for (var rateIndex = 0; rateIndex < self.rateArray().length; rateIndex++) {
                if (self.rateArray()[rateIndex].toCCY === summarydata[k].availableBalance.currency) {
                  if (self.rateArray()[rateIndex].opt === "*") {
                    self.extAccountAggregation()[0].value += (self.rateArray()[rateIndex].rate * summarydata[k].availableBalance.amount);
                    self.extAccountAggregation()[0].ccy = self.bankConfig.localCurrency;
                  } else {
                    self.extAccountAggregation()[0].value += (summarydata[k].availableBalance.amount / self.rateArray()[rateIndex].rate);
                    self.extAccountAggregation()[0].ccy = self.bankConfig.localCurrency;
                  }
                }
              }
            }
          } else if (summarydata[k].type === "LON") {

            if (self.bankConfig.localCurrency === summarydata[k].outstandingAmount.currency) {
              self.extAccountAggregation()[2].value += summarydata[k].outstandingAmount.amount;
              self.extAccountAggregation()[2].ccy = self.bankConfig.localCurrency;
            } else {
              for (var m = 0; m < self.rateArray().length; m++) {
                if (self.rateArray()[m].toCCY === summarydata[k].outstandingAmount.currency) {
                  if (self.rateArray()[m].opt === "*") {
                    self.extAccountAggregation()[2].value += (self.rateArray()[m].rate * summarydata[k].outstandingAmount.amount);
                    self.extAccountAggregation()[2].ccy = self.bankConfig.localCurrency;
                  } else {
                    self.extAccountAggregation()[2].value += (summarydata[k].outstandingAmount.amount / self.rateArray()[m].rate);
                    self.extAccountAggregation()[2].ccy = self.bankConfig.localCurrency;
                  }
                }
              }
            }
          }
        }
        self.extAccountAggregation.valueHasMutated();
       filterAccount(summarydata);
        self.extAccountsLoaded(true);
      } else if (!self.extAccountsLoaded()) {
        self.extAccountsLoaded(false);
      }
      self.extAccountAggregation()[0].loaded(true);
      self.extAccountAggregation()[1].loaded(true);
      self.extAccountAggregation()[2].loaded(true);

      if(self.localAccountsLoaded() && self.extAccountsLoaded()){
        var localAccounts = self.localAccountAggregation();
        var externalAccounts = self.extAccountAggregation();
        var counter = -1;
        for(var loc = 0; loc<localAccounts.length; loc++){
          for(var ext=0; ext<externalAccounts.length; ext++){
            if(localAccounts[loc].type === externalAccounts[ext].type){
              counter++;
              self.items()[counter].value = localAccounts[loc].value + externalAccounts[ext].value;
              self.items()[counter].ccy = localAccounts[loc].ccy;
            }
          }
        }
        self.items.valueHasMutated();
        self.dataLoaded(true);
      } else if (!self.dataLoaded()) {
        self.dataLoaded(false);
      }
      self.items()[0].loaded(true);
      self.items()[1].loaded(true);
      self.items()[2].loaded(true);
      }

    function checkDuplicateCurrency(currency) {
      var isDuplicate = false;
      for (var chklen = 0; chklen < self.rateArray().length; chklen++) {
        if (self.rateArray()[chklen].toCCY === currency) {
          isDuplicate = true;
        }
      }
      return isDuplicate;
    }

    function addAccount() {
      self.items()[0].loaded(false);
      self.items()[1].loaded(false);
      self.items()[2].loaded(false);
      for (var i = 0; i < self.accountList()[1].accounts().length; i++) {
        var summarydata = self.accountList()[1].accounts()[i].externalBankAccountDTOs;
        if (summarydata) {
          var rateData = "";
          for (var summaryLen = 0; summaryLen < summarydata.length; summaryLen++) {
            if (summarydata[summaryLen].type === "LON") {
              if (self.bankConfig.localCurrency !== summarydata[summaryLen].outstandingAmount.currency) {
                if (!checkDuplicateCurrency(summarydata[summaryLen].outstandingAmount.currency)) {
                  rateData = {
                    "fromCCY": self.bankConfig.localCurrency,
                    "toCCY": summarydata[summaryLen].outstandingAmount.currency,
                    "rate": "",
                    "opt": ""
                  };
                  self.rateArray.push(rateData);
                }
              }

            } else if (self.bankConfig.localCurrency !== summarydata[summaryLen].availableBalance.currency) {
              if (!checkDuplicateCurrency(summarydata[summaryLen].availableBalance.currency)) {
                rateData = {
                  "fromCCY": self.bankConfig.localCurrency,
                  "toCCY": summarydata[summaryLen].availableBalance.currency,
                  "rate": "",
                  "opt": ""
                };
                self.rateArray.push(rateData);
              }
            }
          }
        }
      }

      for (var l = 0; l < self.rateArray().length; l++) {
        var response = ListingModel.fetchExchangeRate(self.bankConfig.homeBranch, self.rateArray()[l].toCCY, self.bankConfig.localCurrency);
        response.done(function(data) {

          if (data.exchangeRateDetails) {
            for (var indexRate = 0; indexRate < self.rateArray().length; indexRate++) {
              if (self.rateArray()[indexRate].toCCY === data.exchangeRateKey.ccy2Code) {
                self.rateArray()[indexRate].rate = data.exchangeRateDetails[0].midRate;
                self.rateArray()[indexRate].opt = "*";
                self.rateResponseCount.push(i);

                if (self.rateArray().length === self.rateResponseCount().length) {
                  for (var len = 0; l < self.accountList()[1].accounts().length; len++) {
                    setexternalbankData(self.accountList()[1].accounts()[len]);
                  }
                }
              }
            }
          } else {
            var response = ListingModel.fetchExchangeRate(self.bankConfig.homeBranch, self.bankConfig.localCurrency, data.exchangeRateKey.ccy1Code);
            response.done(function(data) {
              for (var rateLen = 0; rateLen < self.rateArray().length; rateLen++) {
                if (self.rateArray()[rateLen].toCCY === data.exchangeRateKey.ccy2Code) {
                  self.rateArray()[rateLen].rate = data.exchangeRateDetails[0].midRate;
                  self.rateArray()[rateLen].opt = "/";
                  self.rateResponseCount.push(i);
                  if (self.rateArray().length === self.rateResponseCount().length) {
                    for (var list = 0; list < self.accountList()[1].accounts().length; list++) {
                      setexternalbankData(self.accountList()[1].accounts()[list]);
                    }
                  }
                }
              }
            });
          }
        });

        response.fail(function() {
          self.rateResponseCount.push(i);
          if (self.rateArray().length === self.rateResponseCount().length) {
            for (var accLen = 0; accLen < self.accountList()[1].accounts().length; accLen++) {
              setexternalbankData(self.accountList()[1].accounts()[accLen]);
            }
          }
        });
      }
      setexternalbankData(self.accountList()[0].accounts()[0]);
      setData(self.accountList()[0].accounts()[0]);


    }

    ListingModel.fetchBankConfiguration().done(function(data) {
      self.bankConfig = data.bankConfigurationDTO;

      ListingModel.fetchAccesstoken().done(function(data) {
        if (data.accessTokenDTOs !== undefined) {
          self.excessLen(data.accessTokenDTOs.length + 1);
          for (var j = 0; j < data.accessTokenDTOs.length; j++) {
            var externalResponse = ListingModel.fetchexternalbankAccounts(data.accessTokenDTOs[j].bankCode);
            self.items()[0].loaded(false);
            self.items()[1].loaded(false);

            externalResponse.done(function(extdata) {
              self.responseCount.push(j);
              self.accountList()[1].accounts.push(extdata);
              if (self.responseCount().length === self.excessLen()) {
                addAccount();
              }
            });
            externalResponse.fail(function() {
              self.responseCount.push(j);
              if (self.responseCount().length === self.excessLen()) {
                addAccount();
              }
            });
          }
        }
        var localAccounts = ListingModel.fetchAccounts();
        localAccounts.done(function(data) {
          self.responseCount.push("j");
          self.accountList()[0].accounts.push(data);
          if (self.responseCount().length === self.excessLen()) {
            addAccount();
          }
        });
        localAccounts.fail(function() {
          self.responseCount.push("j");
          if (self.responseCount().length === self.excessLen()) {
            addAccount();
          }

        });
      });
    });
    self.refreshWidget = function() {
      $("#accordionPage").ojAccordion("refresh");
    };
  };
});
