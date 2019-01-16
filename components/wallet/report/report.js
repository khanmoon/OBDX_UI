define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/report",
    "ojs/ojknockout",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext",
    "ojs/ojinputnumber",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource",
    "ojs/ojdatetimepicker",
    "ojs/ojlistview",

    "ojs/ojpagingcontrol",

    "ojs/ojknockout-validation",
    "ojs/ojvalidation"
], function (oj, ko, $, reportModel, ResourceBundle) {
    "use strict";
    return function viewModel(Params) {
        var self = this, updateRecords = 1, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(reportModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, Params.rootModel);
        self.wallet = ResourceBundle.wallet;
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.stageThree = ko.observable(false);
        self.stageFour = ko.observable(false);
        self.stageFive = ko.observable(false);
        self.updateKYC = ko.observable(false);
        self.templateName = ko.observable();
        self.validationTracker = ko.observable();
        self.kycStatus = ko.observable();
        self.updateModel = getNewKoModel().updateKYC;
        self.reportData = ko.observable();
        self.datasource = ko.observable();
        self.walletData = ko.observable();
        self.reportUpdateDesc = ko.observable("");
        self.searchError = ko.observable(false);
        self.searchErrorMsg = ko.observable("");
        self.reportHeading = ko.observable(self.wallet.report.reports);
        Params.baseModel.registerElement("action-header");
        Params.baseModel.registerElement("modal-window");
        self.reportsListArray = ko.observableArray([
            { name: "kyc-report" },
            { name: "user-activity-report" },
            { name: "open-today-report" },
            { name: "transaction-activity-report" },
            { name: "glhandoff" }
        ]);
        self.transactionTypeArray = ko.observableArray([
            {
                "code": "A",
                "description": self.wallet.report.all
            },
            {
                "code": "D",
                "description": self.wallet.report.debitsOnly
            },
            {
                "code": "C",
                "description": self.wallet.report.creditsOnly
            }
        ]);
        self.statusSearchArray = ko.observableArray([
            {
                "code": "ALL",
                "description": self.wallet.report.all
            },
            {
                "code": "PEN",
                "description": self.wallet.report.pen
            },
            {
                "code": "COM",
                "description": self.wallet.report.com
            }
        ]);
        self.kycStatusArray = ko.observableArray([
            {
                "code": "COM",
                "description": self.wallet.report.com
            },
            {
                "code": "PEN",
                "description": self.wallet.report.pen
            }
        ]);
        self.kycStatus(self.kycStatusArray()[0].code);
        self.searchItems = ko.observable({});
        self.searchItems().status = ko.observable(self.statusSearchArray()[0].code);
        self.searchItems().transactionType = ko.observable(self.transactionTypeArray()[0].code);
        self.searchItems().fromDate = ko.observable(Params.baseModel.getDate().toJSON().slice(0, 10));
        self.searchItems().toDate = ko.observable(Params.baseModel.getDate().toJSON().slice(0, 10));
        self.searchItems().currentDate = Params.baseModel.getDate().toJSON().slice(0, 10);
        self.currentDate = Params.baseModel.getDate(self.searchItems().currentDate);
        self.searchItems().emailId = ko.observable("");
        self.searchItems().userId = ko.observable("");
        self.searchItems().mobileNumber = ko.observable("");
        if (self.kycManagement()) {
            location.hash = "kycmanagement";
            self.stageOne(false);
            self.reportHeading(self.wallet.report.kycManagement);
            self.templateName("wallet/kyc-report");
            self.stageTwo(true);
        } else {
            location.hash = "reports";
        }
        self.actionCardClick = function (componentData) {
            if (componentData === "glhandoff") {
                self.downloadCSV();
                return;
            }
            location.hash = "viewreport";
            self.stageOne(false);
            self.reportHeading(self.wallet.report[componentData]);
            self.templateName("wallet/" + componentData);
            self.stageTwo(true);
        };
        self.fetchKYCReport = function (data) {
            location.hash = "kycupdate";
            self.reportData(data);
            self.updateKYC(true);
            self.stageFour(true);
        };
        Params.baseModel.registerElement("comment-box");
        Params.baseModel.registerComponent("search-report", "wallet");
        self.fetchReport = function (url, reportName) {
            reportModel.getReport(url, self.searchItems()).done(function (data) {
                switch (reportName) {
                case "kyc":
                    self.getKYCReport(data);
                    break;
                case "openToday":
                    self.getWalletsOpened(data);
                    break;
                case "useractivity":
                    self.getAuditReport(data, reportName, url);
                    break;
                case "transactionActivity":
                    self.getUserTransactionReport(data);
                    break;
                default:
                }
            });
        };
        self.getKYCReport = function (data) {
            self.reportData(data.listWallets);
            var reportArray = $.map(self.reportData(), function (u) {
                var obj = {
                    "firstName": u.firstName ? u.firstName : "-",
                    "lastName": u.lastName ? u.lastName : "-",
                    "emailId": u.emailId ? u.emailId : "-",
                    "mobileNo": u.mobileNo ? u.mobileNo : "",
                    "accountOpeningDate": u.accountOpeningDate ? u.accountOpeningDate : "",
                    "kycStatus": u.kycStatus ? u.kycStatus : ""
                };
                return obj;
            });
            self.datasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(reportArray), { idAttribute: "firstName" }));
            self.stageThree(true);
        };
        self.getWalletsOpened = function (data) {
            self.reportData(data.listWallets);
            var walletsOpenedArray = $.map(self.reportData(), function (u) {
                var obj = {
                    "firstName": u.firstName ? u.firstName : "-",
                    "lastName": u.lastName ? u.lastName : "-",
                    "emailId": u.emailId ? u.emailId : "-",
                    "mobileNo": u.mobileNo ? u.mobileNo : "-"
                };
                return obj;
            });
            self.datasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(walletsOpenedArray), { idAttribute: "date" }));
            self.stageThree(true);
        };
        self.getUserTransactionReport = function (data) {
            self.reportData(data.walletFinancialStatementItemDTOs);
            var transactionReportArray = $.map(self.reportData(), function (u) {
                var obj = {
                    "name": u.name ? u.name : "-",
                    "txnRefNumber": u.txnRefNumber ? u.txnRefNumber : "-",
                    "transactionDate": u.transactionDate ? u.transactionDate : "-",
                    "comments": u.comments ? u.comments : "-",
                    "amount": u.amountInTransactionCurrency ? u.amountInTransactionCurrency : "-",
                    "transactionType": u.transactionType ? u.transactionType : "-"
                };
                return obj;
            });
            self.datasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(transactionReportArray), { idAttribute: "date" }));
            self.stageThree(true);
        };
        self.getAuditReport = function (data, reportName, url) {
            if (url === "wallets?emailId={emailId}&mobileNo={mobile}") {
                self.walletData(data.listWallets[0]);
                if (data.listWallets.length > 0) {
                    reportModel.getWalletUserIdType().done(function (data1) {
                        if (data1.configResponseList[0].propertyValue === "MOBILE") {
                            self.searchItems().userId(data.listWallets[0].mobileNo);
                        } else {
                            self.searchItems().userId(data.listWallets[0].emailId);
                        }
                        self.urltemp = "audit/search?auditType=1&userID={userId}&startTime={fromDate}&endTime={toDate}";
                        self.url = "";
                        self.fetchReport(self.urltemp, reportName);
                    });
                } else {
                    var auditReportArray = $.map(self.walletData(), function () {
                        var obj = {};
                        return obj;
                    });
                    self.datasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(auditReportArray), { idAttribute: "date" }));
                    self.stageThree(true);
                }
            } else {
                for (var i = 0; i < data.auditList.length; i++) {
                    if (!("walletId" in data.auditList[i])) {
                        data.auditList[i].walletId = self.walletData().walletId;
                    }
                    if (!("firstName" in data.auditList[i])) {
                        data.auditList[i].firstName = self.walletData().firstName;
                    }
                    if (!("lastName" in data.auditList[i])) {
                        data.auditList[i].lastName = self.walletData().lastName;
                    }
                    if (!("emailId" in data.auditList[i])) {
                        data.auditList[i].emailId = self.walletData().emailId;
                    }
                    if (!("mobileNo" in data.auditList[i])) {
                        data.auditList[i].mobileNo = self.walletData().mobileNo;
                    }
                }
                self.reportData(data.auditList);
                var dataArray = $.map(self.reportData(), function (u) {
                    var obj = {
                        "firstName": u.firstName ? u.firstName : "-",
                        "lastName": u.lastName ? u.lastName : "-",
                        "emailId": u.emailId ? u.emailId : "-",
                        "mobileNo": u.mobileNo ? u.mobileNo : "-",
                        "startTime": u.startTime ? u.startTime : "-",
                        "resourceDesc": u.resourceDesc ? u.resourceDesc : "-",
                        "status": u.status ? u.status : "-"
                    };
                    return obj;
                });
                self.datasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(dataArray), { idAttribute: "date" }));
                self.stageThree(true);
            }
        };
        self.downloadPDF = function (reportName) {
            if (reportName === "kyc") {
                self.pdfURL = "wallets?userId=" + self.searchItems().emailId() + "&fromDate=" + self.searchItems().fromDate() + "&toDate=" + self.searchItems().toDate() + "&kycStatus=" + self.searchItems().status() + "&mobileNo=" + self.searchItems().mobileNumber() + "&reportName=" + reportName + "";
            } else if (reportName === "openToday") {
                self.pdfURL = "wallets?fromDate=" + self.searchItems().currentDate + "&toDate=" + self.searchItems().currentDate + "&reportName=" + reportName + "";
            } else if (reportName === "transactionActivity") {
                self.pdfURL = "wallets/reports/transactionActivity?emailId=" + self.searchItems().emailId() + "&mobileNo=" + self.searchItems().mobileNumber() + "&transactionType=" + self.searchItems().transactionType() + "&fromDate=" + self.searchItems().fromDate() + "&toDate=" + self.searchItems().toDate() + "";
            } else if (reportName === "useractivity") {
                self.pdfURL = "audit/search?auditType=1&userID=" + self.searchItems().userId() + "&startTime=" + self.searchItems().fromDate() + "&endTime=" + self.searchItems().toDate() + "";
            }
            reportModel.fetchPDF(self.pdfURL);
        };
        self.downloadCSV = function () {
            self.csvURL = "wallets/reports/glHandoff?media=text/csv";
            reportModel.downloadCSV(self.csvURL);
        };
        self.updateReport = function () {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            for (var i = 0; i < updateRecords; i++) {
                self.updateModel.updatedWallets()[i].walletId(self.reportData().walletId);
                self.updateModel.updatedWallets()[i].emailId(self.reportData().emailId);
                self.updateModel.updatedWallets()[i].kycStatus(Params.baseModel.getDropDownValue(self.kycStatus()));
                self.updateModel.updatedWallets()[i].kycComments(self.reportUpdateDesc());
            }
            var payload = ko.toJSON(self.updateModel);
            reportModel.updateReport(payload).done(function () {
                self.stageFour(false);
                self.stageFive(true);
            });
        };
        self.cancel = function () {
            history.back();
            self.stageFive(false);
            self.stageFour(false);
            self.stageThree(false);
            self.updateKYC(false);
            self.stageOne(false);
            self.stageTwo(true);
        };
        self.refreshList = function () {
            self.stageFive(false);
            self.stageTwo(true);
            self.updateKYC(false);
            self.stageThree(true);
            self.reportUpdateDesc("");
            self.fetchReport("wallets?emailId={emailId}&fromDate={fromDate}&toDate={toDate}&kycStatus={status}&mobileNo={mobile}", "kyc");
        };
    };
});