define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/debtor-group-list",
    "ojs/ojinputnumber",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, manageDebtorsModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, i = 0, j = 0;
        ko.utils.extend(self, rootParams.rootModel);
        self.debtors = ResourceBundle.debtors;
        rootParams.dashboard.headerName(self.debtors.managedebtor_header);
        self.isDebtorsListLoaded = ko.observable(false);
        self.debtorsList = ko.observableArray();
        self.debtorListDataSource = ko.observable();
        rootParams.baseModel.registerComponent("add-new-debtor", "debtor");
        rootParams.baseModel.registerElement([
            "confirm-screen",
            "search-box"
        ]);
        rootParams.baseModel.registerComponent("debtor-details", "debtor");
        rootParams.baseModel.registerComponent("payee-card", "payee");
        rootParams.baseModel.registerComponent("debtor-sub-list", "debtor");
        rootParams.baseModel.registerComponent("debtor-money-request", "debtor");
        rootParams.baseModel.registerComponent("payee-data-card", "payee");
        manageDebtorsModel.init();
        manageDebtorsModel.getDebtorsList().done(function (data) {
            self.debtorsList.removeAll();
            for (i = 0; i < data.payerGroups.length; i++) {
                for (j = 0; j < data.payerGroups[i].listPayers.length; j++) {
                    self.debtorsList.push({
                        name: data.payerGroups[i].name,
                        id: data.payerGroups[i].listPayers[j].id,
                        accountNumber: data.payerGroups[i].listPayers[j].sepaDomesticPayer.iban,
                        bankName: data.payerGroups[i].listPayers[j].sepaDomesticPayer.bankDetails.name,
                        address: data.payerGroups[i].listPayers[j].sepaDomesticPayer.bankDetails.city,
                        nickName: data.payerGroups[i].listPayers[j].nickName,
                        bicCode: data.payerGroups[i].listPayers[j].sepaDomesticPayer.bankDetails.code,
                        groupId: data.payerGroups[i].groupId,
                        bankDetails: data.payerGroups[i].listPayers[j].sepaDomesticPayer.bankDetails
                    });
                }
            }
            self.debtorListDataSource(new oj.ArrayTableDataSource(self.debtorsList(), { idAttribute: ["name"] }));
            self.isDebtorsListLoaded(true);
        });
        self.menuItems = [
            {
                id: "request",
                label: self.debtors.labels.requestmoney
            },
            {
                id: "view",
                label: self.debtors.labels.view
            },
            {
                id: "delete",
                label: self.debtors.labels.delete
            }
        ];
        self.debtorData = ko.observable();
        self.confirmDeleteDebtor = function () {
            manageDebtorsModel.deleteDebtor(self.debtorData().groupId, self.debtorData().id).done(function (data, status, jqXHR) {
                manageDebtorsModel.deleteDebtorGroup(self.debtorData().groupId).done(function () {
                    self.closeModal();
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        template: "confirm-screen/payments-template",
                        transactionName: self.debtors.deleteDebtor
                    }, self);
                });
            });
        };
        self.openMenu = function (data, event) {
            $("#menuLauncher-debtorlist-contents-" + data.id).ojMenu("open", event);
        };
        self.closeModal = function () {
            $("#view-debtor").trigger("closeModal");
            $("#delete-debtor").trigger("closeModal");
        };
        self.requestSelectedDebtor = function () {
            if (rootParams.baseModel.small())
                rootParams.dashboard.loadComponent("debtor-money-request", { transferDataDebtor: self.debtorData() }, self);
            else
                rootParams.changeView("debtor-money-request", { transferDataDebtor: self.debtorData() });
        };
        self.menuItemSelect = function (data, event) {
            self.debtorData(data);
            if (event.target.value === "request") {
                self.requestSelectedDebtor();
            } else if (event.target.value === "view") {
                $("#view-debtor").trigger("openModal");
            } else if (event.target.value === "delete") {
                $("#delete-debtor").trigger("openModal");
            }
        };
    };
});