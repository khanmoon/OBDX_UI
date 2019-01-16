define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/credit-line",
    "ojs/ojchart",
    "ojs/ojselectcombobox",
    "ojs/ojvalidation",
    "ojs/ojlegend"
], function (oj, ko, $, CreditLineUsageModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.nls = resourceBundle;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement([
            "action-header",
            "action-widget"
        ]);
        rootParams.baseModel.registerComponent("search-credit-line", "credit-line-limit");
        self.series = ko.observableArray();
        self.selectedPartyID = ko.observableArray();
        self.lines = ko.observableArray();
        self.segregatedData = ko.observableArray();
        self.currency = ko.observable();
        self.originalData = null;
        self.stackValue = ko.observable("on");
        self.barGapRatio = ko.observable(0.6);
        self.maxBarWidth = ko.observable(10);
        self.creditCardLineLimitLoaded = ko.observable(false);
        self.legendObject = rootParams.baseModel.large() ? [{
                position: "end",
                maxSize: "50%"
            }] : [{ position: "bottom" }];
        self.mainFunction = function (data) {
            var utilizedLimit = [], remainingLimit = [], totalLimit = [];
            self.lines.removeAll();
            self.series.removeAll();
            data.lineLimitsDTOs = data.lineLimitsDTOs.sort(function (left, right) {
                return left.totalLimit.amount < right.totalLimit.amount;
            });
            if (data.lineLimitsDTOs.length > 5)
                data.lineLimitsDTOs.length = 5;
            for (var i = 0; i < data.lineLimitsDTOs.length; i++) {
                utilizedLimit.push(data.lineLimitsDTOs[i].utilizedLimit.amount);
                remainingLimit.push(data.lineLimitsDTOs[i].totalLimit.amount - data.lineLimitsDTOs[i].utilizedLimit.amount);
                self.lines.push({
                    name: data.lineLimitsDTOs[i].lineId,
                    labelStyle: "font-size: 0.5rem !important"
                });
                self.currency = data.lineLimitsDTOs[i].currencyCode;
                totalLimit.push(data.lineLimitsDTOs[i].totalLimit.amount);
            }
            ko.utils.arrayPushAll(self.series, [
                {
                    name: rootParams.baseModel.format(self.nls.utilizedAmount),
                    items: utilizedLimit,
                    currencyCode: self.currency,
                    color: "#e40004"
                },
                {
                    name: rootParams.baseModel.format(self.nls.remainingAmount),
                    items: remainingLimit,
                    currencyCode: self.currency,
                    color: "#3caf85"
                }
            ]);
        };
        var groupBy = function (array, callback) {
            var groups = {};
            array.forEach(function (item) {
                var group = JSON.stringify(callback(item));
                groups[group] = groups[group] || [];
                groups[group].push(item);
            });
            return Object.keys(groups).map(function (group) {
                return {
                    id: JSON.parse(group).shift(),
                    accounts: groups[group],
                    name: JSON.parse(group).pop()
                };
            });
        };

        function setData(data){
          if (data.lineLimitsDTOs.length > 0) {
              var result = groupBy(data.lineLimitsDTOs, function (item) {
                  return [
                      item.partyId.value,
                      item.partyName
                  ];
              });
              ko.utils.arrayPushAll(self.segregatedData, result);
              self.segregatedData.unshift({
                  accounts: data.lineLimitsDTOs,
                  id: "all",
                  name: self.nls.all
              });
              self.originalData = data;
              self.mainFunction(data);
              self.creditCardLineLimitLoaded(true);
          } else {
              self.creditCardLineLimitLoaded(false);
          }
        }
        CreditLineUsageModel.fetchLines().then(function (data) {
        setData(data);
      });

        self.selectedPartyID.subscribe(function (newValue) {
            if (newValue[0] === "all") {
                self.mainFunction(self.originalData);
            } else {
                var partyLineLimit = self.segregatedData().filter(function (element) {
                    return element.id === newValue[0];
                });
                self.mainFunction({ lineLimitsDTOs: partyLineLimit[0].accounts });
            }
        });
        self.styleDefaults = ko.pureComputed(function () {
            return {
                barGapRatio: self.barGapRatio(),
                maxBarWidth: self.maxBarWidth()
            };
        });
        self.tooltip = {
            renderer: function (dataContext) {
              var pieChartNode = document.createElement("div");

              pieChartNode.innerHTML =
                "<div>" +
                    "<div data=\"series\">" + rootParams.baseModel.format(self.nls.tooltip.series, { seriesType: dataContext.series }) + "</div>" +
                  "<div data=\"group\">" + rootParams.baseModel.format(self.nls.tooltip.group, { groupType: dataContext.group }) + "</div>" +
                  "<div data=\"data\">" + rootParams.baseModel.format(self.nls.tooltip.value, { value: rootParams.baseModel.formatCurrency(dataContext.data, dataContext.seriesData.currencyCode)}) + "</div>" +
                "</div>";

                return {"insert" : pieChartNode};
            }
        };
    };
});
