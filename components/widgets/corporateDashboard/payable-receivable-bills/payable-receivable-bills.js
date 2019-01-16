define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/payable-receivable-bills",
    "./model",
    "ojs/ojchart",
    "ojs/ojlegend"
], function (oj, ko, $, resourceBundle, PayableBillsModel) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.nls = resourceBundle;
        self.receivable = self.nls.payableReceivableBillsDetails.labels.receivable;
        self.payable = self.nls.payableReceivableBillsDetails.labels.payable;
        self.standaloneSeries = ko.observableArray();
        self.underLCSeries = ko.observableArray();
        self.billsLegendSections = ko.observableArray();
        self.groups = ko.observableArray();
        self.chartRendered = ko.observable(false);
        var receivableColor = "#e40004";
        var payableColor = "#3caf85";
        self.currency = ko.observable();
        self.stackValue = ko.observable("on");
        self.stackValueChart = ko.observable("on");
        self.labelPosition = ko.observable("outsideBarEdge");

        function setBills(data) {
            var standaloneReceivableAmount, standalonePayableAmount, underLCReceivableAmount, underLCPayableAmount;
            for (var i = 0; i < data.billDTOs.length; i++) {
                self.currency = data.billDTOs[i].totalAmount.currency;
                switch (data.billDTOs[i].type) {
                    case "STANDALONE_BILLS_RECEIVABLE":
                        standaloneReceivableAmount = data.billDTOs[i].totalAmount.amount;
                        break;
                    case "STANDALONE_BILLS_PAYABLE":
                        standalonePayableAmount = data.billDTOs[i].totalAmount.amount;
                        break;
                    case "UNDERLC_BILLS_RECEIVABLE":
                        underLCReceivableAmount = data.billDTOs[i].totalAmount.amount;
                        break;
                    default:
                        underLCPayableAmount = data.billDTOs[i].totalAmount.amount;
                }
            }
            ko.utils.arrayPushAll(self.standaloneSeries, [{
                items: [{
                        y: standaloneReceivableAmount,
                        color: receivableColor,
                        label: standaloneReceivableAmount
                    },
                    {
                        y: standalonePayableAmount,
                        color: payableColor,
                        label: standalonePayableAmount
                    }
                ]
            }]);
            ko.utils.arrayPushAll(self.underLCSeries, [{
                items: [{
                        y: underLCReceivableAmount,
                        color: receivableColor,
                        label: underLCReceivableAmount
                    },
                    {
                        y: underLCPayableAmount,
                        color: payableColor,
                        label: underLCPayableAmount
                    }
                ]
            }]);
            ko.utils.arrayPushAll(self.billsLegendSections, [{
                items: [{
                        color: receivableColor,
                        text: rootParams.baseModel.format(self.nls.payableReceivableBillsDetails.labels.receivableLegendText, {
                            currency: self.currency
                        })
                    },
                    {
                        color: payableColor,
                        text: rootParams.baseModel.format(self.nls.payableReceivableBillsDetails.labels.payableLegendText, {
                            currency: self.currency
                        })
                    }
                ]
            }]);
            self.chartRendered(true);
        }

        function fetchBills() {
                PayableBillsModel.fetchPayableBills().then(function (data) {
                    setBills(data);
                });
        }
        fetchBills();
        self.groups = [
            self.receivable,
            self.payable
        ];
        self.tooltip = {
            renderer: function (dataContext) {
              var pieChartNode = document.createElement("div");

              pieChartNode.innerHTML =
                "<div>" +
                  "<div data=\"group\">" + rootParams.baseModel.format(self.nls.payableReceivableBillsDetails.tooltip.group, {group: dataContext.group}) + "</div>" +
                  "<div data=\"data\">" + rootParams.baseModel.format(self.nls.payableReceivableBillsDetails.tooltip.value, {value: rootParams.baseModel.formatCurrency(dataContext.y || 0, self.currency)}) + "</div>" +
                "</div>";

                return {"insert" : pieChartNode};
            }
        };
    };
});
