define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/consolidated-analysis"
], function (ko, $, CardListingModel, locale) {
    "use strict";
    return function (rootParams) {
        var self = this, profitIndicator = false;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        self.dataFetched = ko.observable(false);
        self.totalCASAPositiveAmount = ko.observable();
        self.totalCASANegativeAmount = ko.observable();
        self.totalTDAmount = ko.observable();
        self.totalLoanAmount = ko.observable();
        self.totalCreditCardAmount = ko.observable();
        self.totalProfit = ko.observable();
        self.loss = ko.observable();
        self.lossIndicator = ko.observable();
        self.loansCards = ko.observableArray();
        self.checkedOption = ko.observable("have");
        self.baseCcy = ko.observable();
        self.analysis = ko.observableArray();
        self.moneyIhave = ko.observable(0);
        self.moneyIowe = ko.observable(0);
        CardListingModel.fetchAccounts().then(function(data){
          ko.utils.arrayForEach(data.summary.items, function (item) {
              if (item.accountType === "CSA") {
                  self.totalCASAPositiveAmount(item.totalActiveAvailableBalance.amount + item.totalISLActiveAvailableBalance.amount);
                  self.totalCASANegativeAmount((item.totalActiveNegativeBalance.amount + item.totalISLActiveNegativeBalance.amount) * -1);
                  if (!self.baseCcy() && item.totalActiveAvailableBalance.currency) {
                      self.baseCcy(item.totalActiveAvailableBalance.currency);
                  }
                  if (!self.baseCcy() && item.totalActiveNegativeBalance.currency) {
                      self.baseCcy(item.totalActiveNegativeBalance.currency);
                  }
              }
              if (item.accountType === "TRD") {
                  self.totalTDAmount(item.totalActiveAvailableBalance.amount + item.totalISLActiveAvailableBalance.amount);
                  if (!self.baseCcy() && item.totalActiveAvailableBalance.currency) {
                      self.baseCcy(item.totalActiveAvailableBalance.currency);
                  }
              }
              if (item.accountType === "LON") {
                  self.totalLoanAmount(item.totalActiveOutstandingBalance.amount + item.totalISLActiveOutstandingBalance.amount);
                  if (!self.baseCcy() && item.totalActiveOutstandingBalance.currency) {
                      self.baseCcy(item.totalActiveOutstandingBalance.currency);
                  }
              }
          });
        });

        self.totalProfit = self.totalCASAPositiveAmount() + self.totalTDAmount();
        self.nameParser = function (data) {
            if (data === "CCA") {
                return "cards";
            }
        };
        var animate = function (max, context, identifier) {
            var obj = context, incrementValue = max / 116, existing = incrementValue, draw = function () {
                    obj.setAttribute("width", existing);
                }, step = function () {
                    draw();
                    existing += incrementValue;
                    if (max > existing) {
                        requestAnimationFrame(step);
                        if (identifier) {
                            self.moneyIowe(self.loss * (existing / max));
                        } else {
                            self.moneyIhave(self.totalProfit * (existing / max));
                        }
                    } else {
                        obj.setAttribute("width", max);
                        self.moneyIowe(self.loss);
                        self.moneyIhave(self.totalProfit);
                    }
                };
            step();
        };
        self.afterRender = function () {
            var data = self.analysis;
            for (var i = 0; i < data.length; i++) {
                var svgElement = document.getElementById("svg_" + data[i].id), rectElement = document.getElementById("rect_" + data[i].id), rectWidth = svgElement.clientWidth;
                if ((i === 0 && profitIndicator) || (i === 1 && !profitIndicator)) {
                    rectWidth *= 1;
                } else if (i === 0 && !profitIndicator && self.totalProfit && self.loss) {
                    rectWidth *= self.totalProfit / self.loss;
                } else if (i === 1 && profitIndicator && self.totalProfit && self.loss) {
                    rectWidth *= self.loss / self.totalProfit;
                }
                rectElement.setAttribute("height", svgElement.clientHeight);
                rectElement.setAttribute("fill", "url(#grd_" + data[i].id + ")");
                animate(rectWidth, $("#rect_" + data[i].id)[0], i);
            }
        };
        CardListingModel.fetchCardInfo().then(function (data) {
            var count = 0;
            ko.utils.arrayForEach(data.creditcards, function (item) {
                if (item.cardStatus === "ACT") {
                    count += 1;
                }
            });
            if (data.sumOfEquivalentDue.amount) {
                self.totalCreditCardAmount(data.sumOfEquivalentDue.amount);
                self.loansCards.push({
                    url: self.nameParser("CCA"),
                    count: count,
                    totalBalance: {
                        amount: data.sumOfEquivalentDue.amount,
                        currency: data.sumOfEquivalentDue.currency
                    }
                });
            } else {
                self.loansCards.push({
                    url: self.nameParser("CCA"),
                    count: 0,
                    totalBalance: {
                        amount: 0,
                        currency: data.domesticCurrency
                    }
                });
            }
        }).fail(function (data) {
            self.loansCards.push({
                url: self.nameParser("CCA"),
                count: 0,
                totalBalance: {
                    amount: 0,
                    currency: data.domesticCurrency
                }
            });
        });
        var totalCreditAmount = 0;
        for (var len = 0; len < self.loansCards().length; len++) {
            totalCreditAmount = totalCreditAmount + self.loansCards()[len].totalBalance.amount;
        }
        self.loss = self.totalLoanAmount() + self.totalCASANegativeAmount() + totalCreditAmount;
        self.analysis = [
            {
                id: "ihave",
                label: self.locale.dashboard.iHave,
                value: self.totalProfit,
                currency: self.baseCcy(),
                percentage: self.totalProfit - self.loss,
                startColor: "#89c33d",
                stopColor: "#b8fc22"
            },
            {
                id: "iowe",
                label: self.locale.dashboard.iOwe,
                value: self.loss,
                currency: self.baseCcy(),
                percentage: self.loss - self.totalProfit,
                startColor: "#89c33d",
                stopColor: "#b8fc22"
            }
        ];
        profitIndicator = self.totalProfit > self.loss;
        self.dataFetched(true);
    };
});
