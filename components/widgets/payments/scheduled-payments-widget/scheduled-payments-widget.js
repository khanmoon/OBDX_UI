define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/scheduled-payments-widgets",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojselectcombobox"
], function (oj, ko, $, ScheduledPaymentsInfoModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.datasource = null;
        self.upcomingPaymentsData = [];
        self.upcomingPaymentsLoaded = ko.observable(false);
        rootParams.baseModel.registerElement("date-box");
        self.openTab = function (applicationType, defaultTab) {
            self.selectedTab = "";
            rootParams.dashboard.loadComponent("manage-accounts", {
                applicationType: applicationType,
                defaultTab: defaultTab,
                isStandingInstruction: applicationType === "standing-instructions",
                isSuccess: self.params ? self.params.isSuccess : false
            });
        };

        function setData(data) {
            self.upcomingPaymentsLoaded(false);
            if (data.instructionsList) {
                for (var i = 0; i < data.instructionsList.length; i++) {
                    self.upcomingPaymentsData[i] = {
                        externalReferenceNumber: data.instructionsList[i].externalReferenceNumber,
                        date: data.instructionsList[i].nextExecutionDate,
                        amount: data.instructionsList[i].amount.amount,
                        currency: data.instructionsList[i].amount.currency,
                        name: "payeeNickName" in data.instructionsList[i] ? data.instructionsList[i].payeeNickName : "-"
                    };
                }
                self.upcomingPaymentsData.sort(function (a, b) {
                    a = new Date(a.date);
                    b = new Date(b.date);
                    return a < b ? 1 : a > b ? -1 : 0;
                });
                self.datasource = new oj.ArrayTableDataSource(self.upcomingPaymentsData.slice(0, 3) || [], {
                    idAttribute: [
                        "externalReferenceNumber",
                        "name"
                    ]
                });
            } else {
                self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {
                    idAttribute: [
                        "externalReferenceNumber",
                        "name"
                    ]
                }));
            }
            self.upcomingPaymentsLoaded(true);
        }
        self.getData = function (fromDate, toDate) {
            ScheduledPaymentsInfoModel.getUpcomingPaymentsList(fromDate, toDate).done(function (data) {
                setData(data);
            });
        };

        ScheduledPaymentsInfoModel.getHostDate().done(function (data) {
            var date = new Date(data.currentDate.valueDate);
            date.setDate(date.getDate() + 30);
            self.getData(oj.IntlConverterUtils.dateToLocalIso(new Date(data.currentDate.valueDate)), oj.IntlConverterUtils.dateToLocalIso(date));
        });

    };
});