define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/wallet-dashboard-activity",
    "ojs/ojknockout",
    "ojs/ojlistview",
    "ojs/ojmodel",
    "ojs/ojselectcombobox",
    "ojs/ojpagingcontrol",

    "ojs/ojdatetimepicker",
    "ojs/ojfilmstrip",
    "ojs/ojbutton"
], function (oj, ko, $, activityModel, ResourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        ko.utils.extend(this, rootParams.rootModel);
        var self = this;
        self.detailsFetched = ko.observable(false);
        self.wallet = ResourceBundle.wallet;
        self.fromDateSelected = ko.observable();
        self.toDateSelected = ko.observable();
        self.transactionUrl = ko.observable();
        self.currentNavArrowPlacement = ko.observable("adjacent");
        self.currentNavArrowVisibility = ko.observable("auto");
        self.dataPresent = ko.observable(false);
        activityModel.init(rootParams.dashboard.dataToBePassed().walletId.value);
        self.activityData = ko.observable();
        activityModel.fetchTransactions().done(function (data) {
            if (data.walletFinancialStatementItemDTOs) {
                for (var i = 0; i < data.walletFinancialStatementItemDTOs.length; i++) {
                    if (!("transferMode" in data.walletFinancialStatementItemDTOs[i])) {
                        data.walletFinancialStatementItemDTOs[i].transferMode = "";
                    }
                    if (!("name" in data.walletFinancialStatementItemDTOs[i])) {
                        data.walletFinancialStatementItemDTOs[i].name = "test";
                    }
                    if (!("description" in data.walletFinancialStatementItemDTOs[i])) {
                        data.walletFinancialStatementItemDTOs[i].description = "test";
                    }
                    if (!("comments" in data.walletFinancialStatementItemDTOs[i])) {
                        data.walletFinancialStatementItemDTOs[i].comments = "test";
                    }
                }
                self.activityData(data.walletFinancialStatementItemDTOs);
                self.activityData().sort(function (a, b) {
                    a = new Date(a.transactionDate);
                    b = new Date(b.transactionDate);
                    return a < b ? 1 : a > b ? -1 : 0;
                });
                self.dataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.activityData()), { idAttribute: "date" });
                self.detailsFetched(true);
            } else {
                self.detailsFetched(true);
            }
        });
        self.loadSelectedComponent = function (component) {
            self.componentSelected(component);
        };
        self.showDashboardView = function () {
            self.openComponent = ko.observable("wallet-activity");
            rootParams.baseModel.registerComponent("wallet-activity", "wallet");
            rootParams.dashboard.headerName(self.wallet.dashboardActivity.header);
            rootParams.dashboard.loadComponent(self.openComponent(), {}, {});
        };
    };
});