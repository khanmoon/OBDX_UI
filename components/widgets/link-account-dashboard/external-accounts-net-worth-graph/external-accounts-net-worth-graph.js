define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/net-worth-graph",
  "ojs/ojchart"
], function(oj, ko, $, Model, ResourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    self.resource = ResourceBundle;
    self.pieSeriesValueForCredit = ko.observableArray();
    self.pieSeriesValueForDebit = ko.observableArray();
    self.showIHaveGraph = ko.observable(false);
    self.showIOweGraph = ko.observable(false);
    self.amountData = ko.observable(false);
    self.creditCardDetailsLoaded = ko.observable(false);
    self.selectedValue = ko.observable(self.resource.iHave);
    self.TotalAssets = ko.observable();
    self.TotalLiability = ko.observable();
    self.netAssetsValue = ko.observable();
    self.currency = ko.observable();
    self.excessLen = ko.observable(false);

    self.accountList = ko.observableArray();
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
    self.asset = [];
    self.liability = [];
    var summary = [];
    var asset = 0;
    var liability = 0;
    var netasset = 0 ;
	self.bankConfig = "";
	self.exchangecurrency = ko.observableArray();
    self.centerLabelStyle = ko.observable({
      "font-size": "1rem",
      "color": "#fff"
    });
    self.innerRadius = ko.observable("0.9");
    self.dataLabelPosition = ko.observable("none");
    self.legendPosition = ko.observable("auto");
    self.legendRenderer = ko.observable("off");
    self.netWorthLabels = [{
      id: "I Have",
      label: self.resource.iHave
    }, {
      id: "I Owe",
      label: self.resource.iOwe
    }];


    function setexternalbankData(data) {
         var summarydata = data.externalBankAccountDTOs;

         if (summarydata) {
           for (var k = 0; k < summarydata.length; k++) {
             if (summarydata[k].type === "TRD") {

               if (self.bankConfig.localCurrency === summarydata[k].availableBalance.currency) {
                 summary.TRDAmount += summarydata[k].availableBalance.amount;
                 self.currency(self.bankConfig.localCurrency);
               } else {
                 for (var j = 0; j < self.rateArray().length; j++) {
                   if (self.rateArray()[j].toCCY === summarydata[k].availableBalance.currency) {
                     if (self.rateArray()[j].opt === "*") {
                       summary.TRDAmount += (self.rateArray()[j].rate * summarydata[k].availableBalance.amount);
                       self.currency(self.bankConfig.localCurrency);
                     } else {
                       summary.TRDAmount += (summarydata[k].availableBalance.amount / self.rateArray()[j].rate);
                       self.currency(self.bankConfig.localCurrency);
                     }
                   }
                 }
               }
             } else if (summarydata[k].type === "CSA") {

               if (self.bankConfig.localCurrency === summarydata[k].availableBalance.currency) {
                 summary.CSAAmount += summarydata[k].availableBalance.amount;
                 self.currency(self.bankConfig.localCurrency);
               } else {
                 for (var l = 0; l < self.rateArray().length; l++) {
                   if (self.rateArray()[l].toCCY === summarydata[k].availableBalance.currency) {
                     if (self.rateArray()[l].opt === "*") {
                       summary.CSAAmount += (self.rateArray()[l].rate * summarydata[k].availableBalance.amount);
                       self.currency(self.bankConfig.localCurrency);
                     } else {
                       summary.CSAAmount += (summarydata[k].availableBalance.amount / self.rateArray()[l].rate);
                       self.currency(self.bankConfig.localCurrency);
                     }
                   }
                 }
               }
             } else if (summarydata[k].type === "LON") {
               if (self.bankConfig.localCurrency === summarydata[k].outstandingAmount.currency) {
                 summary.LOANAmount += summarydata[k].outstandingAmount.amount;
                 self.currency(self.bankConfig.localCurrency);
               } else {
                 for (var m = 0; m < self.rateArray().length; m++) {
                   if (self.rateArray()[m].toCCY === summarydata[k].outstandingAmount.currency) {
                     if (self.rateArray()[m].opt === "*") {
                       summary.LOANAmount += (self.rateArray()[m].rate * summarydata[k].outstandingAmount.amount);
                       self.currency(self.bankConfig.localCurrency);
                     } else {
                       summary.LOANAmount += (summarydata[k].outstandingAmount.amount / self.rateArray()[m].rate);
                       self.currency(self.bankConfig.localCurrency);
                     }
                   }
                 }
               }
             }
           }
       }

       self.pieSeriesValueForDebit.push({
		items: [summary.CSAODAmount]

       }, {
		items: [summary.LOANAmount]

       });

       if (self.pieSeriesValueForCredit().length !== 0) {
         self.showIHaveGraph(true);
         self.amountData(true);
       }
       self.asset = {
         CASA: rootParams.baseModel.formatCurrency(summary.CSAAmount, self.currency()),
         TD: rootParams.baseModel.formatCurrency(summary.TRDAmount, self.currency())
         };

       asset = summary.CSAAmount + summary.TRDAmount + summary.RDAmount;
       netasset = asset-(summary.CSAODAmount + summary.LOANAmount);
       self.TotalAssets(rootParams.baseModel.formatCurrency(asset, self.currency()));
       self.netAssetsValue(rootParams.baseModel.formatCurrency(netasset, self.currency()));

       self.liability = {
         CSAOD: rootParams.baseModel.formatCurrency(summary.CSAODAmount, self.currency()),
         LOAN: rootParams.baseModel.formatCurrency(summary.LOANAmount, self.currency())

       };
       liability = summary.CSAODAmount + summary.LOANAmount ;
		self.TotalLiability(rootParams.baseModel.formatCurrency(liability, self.currency()));
       }

    function calculateNetWorth(data) {
      var summarydata = data.summary.items;
      ko.utils.arrayForEach(summarydata, function(item) {

        if (item.accountType === "CSA" && item.totalActiveAvailableBalance.amount > 0) {
          self.currency(item.totalActiveAvailableBalance.currency);
          summary.CSAAmount += item.totalActiveAvailableBalance.amount;
        } else if (item.accountType === "CSA" && item.totalActiveAvailableBalance.amount < 0) {
          self.currency(item.totalActiveAvailableBalance.currency);
          summary.CSAODAmount -= item.totalActiveAvailableBalance.amount;
        } else if (item.accountType === "TRD") {
          self.currency(item.totalActiveAvailableBalance.currency);
          summary.TRDAmount += item.totalActiveAvailableBalance.amount;
          summary.RDAmount += item.totalRDActiveAvailableBalance.amount;
        } else if (item.accountType === "LON") {
          self.currency(item.totalActiveOutstandingBalance.currency);
          summary.LOANAmount += item.totalActiveOutstandingBalance.amount;

        }
      });
      self.pieSeriesValueForCredit.push({
        name: self.resource.labels.CSA,
        items: [summary.CSAAmount],
        color: "#0080ff"
      }, {
        name: self.resource.labels.TRD,
        items: [summary.TRDAmount],
        color: "#ff8000"
      });
      self.pieSeriesValueForDebit.push({
        name: self.resource.labels.CSAOD,
        items: [summary.CSAODAmount],
        color: "#40ff00"
      }, {
        name: self.resource.labels.LON,
        items: [summary.LOANAmount],
        color: "#ec4913"
      });

      if (self.pieSeriesValueForCredit().length !== 0) {
        self.showIHaveGraph(true);
        self.amountData(true);
      }
      self.asset = {
        CASA: rootParams.baseModel.formatCurrency(summary.CSAAmount, self.currency()),
        TD: rootParams.baseModel.formatCurrency(summary.TRDAmount, self.currency())
        };

      asset = summary.CSAAmount + summary.TRDAmount + summary.RDAmount;
      netasset = asset-(summary.CSAODAmount + summary.LOANAmount);
      self.TotalAssets(rootParams.baseModel.formatCurrency(asset, self.currency()));
      self.netAssetsValue(rootParams.baseModel.formatCurrency(netasset, self.currency()));

      self.liability = {
        CSAOD: rootParams.baseModel.formatCurrency(summary.CSAODAmount, self.currency()),
        LOAN: rootParams.baseModel.formatCurrency(summary.LOANAmount, self.currency())

      };
		liability = summary.CSAODAmount + summary.LOANAmount ;
		self.TotalLiability(rootParams.baseModel.formatCurrency(liability, self.currency()));

    }

    function setDataForAccounts() {
      self.pieSeriesValueForCredit.removeAll();
      self.pieSeriesValueForDebit.removeAll();
      summary.CSAAmount = 0;
      summary.CSAODAmount = 0;
      summary.TRDAmount = 0;
      summary.RDAmount = 0;
      summary.LOANAmount = 0;
}
	function setData() {
      setDataForAccounts();
      self.styleDefaults = ko.pureComputed(function() {
        return {
          pieInnerRadius: self.innerRadius(),
          dataLabelPosition: self.dataLabelPosition()
        };
      });
      self.legend = ko.pureComputed(function() {
        return {
          position: self.legendPosition(),
          textStyle: self.centerLabelStyle(),
          rendered: self.legendRenderer()
        };
      });
    }
    setData();

    self.CenterLabelIHave = function(dataContext) {
      if(asset>0){
        var pieChartNode = document.createElement("div");
        var outerDiv;

        pieChartNode.innerHTML =
                    "<div style=\"position:absolute;text-align:center;font-size:0.9rem;top:4rem;\">" +
                        "<div data=\"textlabel\">" + self.resource.iHave + "</div>" +
                        "<div data=\"data\">" + self.TotalAssets() + "</div>" +
                    "</div>";
                    outerDiv = pieChartNode.children[0];
                    if(rootParams.baseModel.medium()){
                      outerDiv.style.width = (dataContext.innerBounds.width + 40) + "px";
                      outerDiv.style.top = (dataContext.innerBounds.y + 40) + "px";
                      outerDiv.style.left = (dataContext.innerBounds.x - 20) + "px";
                    }else{
                      outerDiv.style.width = (dataContext.innerBounds.width + 40) + "px";
                      outerDiv.style.top = (dataContext.innerBounds.y + 25) + "px";
                      outerDiv.style.left = (dataContext.innerBounds.x - 20) + "px";
                    }
                    return {"insert" : pieChartNode};
                }
                };

                self.CenterLabelIOwe = function(dataContext) {
                  if(liability>0) {
                    var pieChartNode = document.createElement("div");
                    var outerDiv;
                    pieChartNode.innerHTML =
                    "<div style=\"position:absolute;text-align:center;font-size:0.9rem;top:4rem;\">" +
                    "<div data=\"textlabel\">" + self.resource.iOwe + "</div>" +
                    "<div data=\"data\">" + self.TotalLiability() + "</div>" +
                    "</div>";
                    outerDiv = pieChartNode.children[0];
                    if(rootParams.baseModel.medium()){
                      outerDiv.style.width = (dataContext.innerBounds.width + 40) + "px";
                      outerDiv.style.top = (dataContext.innerBounds.y + 25) + "px";
                      outerDiv.style.left = (dataContext.innerBounds.x - 20) + "px";
                    }else{
                      outerDiv.style.width = (dataContext.innerBounds.width + 40) + "px";
                      outerDiv.style.top = (dataContext.innerBounds.y + 25) + "px";
                      outerDiv.style.left = (dataContext.innerBounds.x - 20) + "px";
                    }
                    return {"insert" : pieChartNode};
                }
                };

                function checkDuplicateCurrency(currency) {
                  var isDuplicate = false;
                  for (var j = 0; j < self.rateArray().length; j++) {
                    if (self.rateArray()[j].toCCY === currency) {
                      isDuplicate = true;
                    }
                  }
                  return isDuplicate;
                }

                function addAccount() {

                  for (var i = 0; i < self.accountList()[1].accounts().length; i++) {
                    var summarydata = self.accountList()[1].accounts()[i].externalBankAccountDTOs;
                    if (summarydata) {
                      var rateData = "";
                      for (var k = 0; k < summarydata.length; k++) {
                        if (summarydata[k].type === "LON") {
                          if (self.bankConfig.localCurrency !== summarydata[k].outstandingAmount.currency) {
                            if (!checkDuplicateCurrency(summarydata[k].outstandingAmount.currency)) {
                              rateData = {
                                "fromCCY": self.bankConfig.localCurrency,
                                "toCCY": summarydata[k].outstandingAmount.currency,
                                "rate": "",
                                "opt": ""
                              };
                              self.rateArray.push(rateData);
                            }
                          }

                        } else if (self.bankConfig.localCurrency !== summarydata[k].availableBalance.currency) {
                          if (!checkDuplicateCurrency(summarydata[k].availableBalance.currency)) {
                            rateData = {
                              "fromCCY": self.bankConfig.localCurrency,
                              "toCCY": summarydata[k].availableBalance.currency,
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
                    var response = Model.fetchExchangeRate(self.bankConfig.homeBranch, self.rateArray()[l].toCCY, self.bankConfig.localCurrency);
                    response.done(function (data) {

                      if (data.exchangeRateDetails) {
                        for (var j = 0; j < self.rateArray().length; j++) {
                          if (self.rateArray()[j].toCCY === data.exchangeRateKey.ccy2Code) {
                            self.rateArray()[j].rate = data.exchangeRateDetails[0].midRate;
                            self.rateArray()[j].opt = "*";
                            self.rateResponseCount.push(i);

                            if (self.rateArray().length === self.rateResponseCount().length) {
                              for (var l = 0; l < self.accountList()[1].accounts().length; l++) {
                                setexternalbankData(self.accountList()[1].accounts()[l]);
                              }
                            }
                          }
                        }
                      } else {
                        var response = Model.fetchExchangeRate(self.bankConfig.homeBranch, self.bankConfig.localCurrency, data.exchangeRateKey.ccy1Code);
                        response.done(function (data) {
                          for (var j = 0; j < self.rateArray().length; j++) {
                            if (self.rateArray()[j].toCCY === data.exchangeRateKey.ccy2Code) {
                              self.rateArray()[j].rate = data.exchangeRateDetails[0].midRate;
                              self.rateArray()[j].opt = "/";
                              self.rateResponseCount.push(i);

                              if (self.rateArray().length === self.rateResponseCount().length) {
                                for (var l = 0; l < self.accountList()[1].accounts().length; l++) {
                                  setexternalbankData(self.accountList()[1].accounts()[l]);
                                }
                              }
                            }
                          }
                        });
                      }
                    });

                    response.fail(function () {
                      self.rateResponseCount.push(i);
                      if (self.rateArray().length === self.rateResponseCount().length) {
                        for (var k = 0; k < self.accountList()[1].accounts().length; k++) {
                          setexternalbankData(self.accountList()[1].accounts()[k]);
                        }
                      }
                    });
                  }
                  calculateNetWorth(self.accountList()[0].accounts()[0]);
                }

                Model.fetchBankConfiguration().done(function (data) {
					self.bankConfig = data.bankConfigurationDTO;
				Model.fetchAccesstoken().done(function (data) {
				if (data.accessTokenDTOs !== undefined) {
				self.excessLen(data.accessTokenDTOs.length + 1);
				for (var j = 0; j < data.accessTokenDTOs.length; j++) {
				var externalResponse = Model.fetchexternalbankAccounts(data.accessTokenDTOs[j].bankCode);

				externalResponse.done(function (extdata) {
				self.responseCount.push(j);
				self.accountList()[1].accounts.push(extdata);
				if (self.responseCount().length === self.excessLen()) {
					addAccount();
				}
				});
				externalResponse.fail(function () {
				self.responseCount.push(j);
				if (self.responseCount().length === self.excessLen()) {
					addAccount();
				}
				});
				}
				}
				var localAccounts = Model.fetchAccounts();
				localAccounts.done(function (data) {
				self.responseCount.push("j");
				self.accountList()[0].accounts.push(data);
				if (self.responseCount().length === self.excessLen()) {
				addAccount();
				}
				});
				localAccounts.fail(function () {
				self.responseCount.push("j");
				if (self.responseCount().length === self.excessLen()) {
				addAccount();
				}

				});
				});
				});
			};
});
