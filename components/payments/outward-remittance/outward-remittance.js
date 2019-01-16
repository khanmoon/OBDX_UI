define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/outward-remittance",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojdatetimepicker",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, outwardRemittanceModel, ResourceBundle, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.dashboard.headerName(self.resource.outwardRemittance.header);
        self.userSegment = Constants.userSegment;
        self.isDateLoaded = ko.observable(false);
        self.fromDate = ko.observable();
        self.toDate = ko.observable();
        self.accountId = ko.observable();
        self.accountList = ko.observableArray();
        self.isAccountListLoaded = ko.observable(true);
        self.additionalDetails = ko.observable();
        self.fromAmount = ko.observable();
        self.toAmount = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.searchData = ko.observable("");
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        rootParams.baseModel.registerElement("modal-window");
        self.debitAccountNumber = ko.observable();
        self.debitAccountBranch = ko.observable();
        self.transDate = ko.observable();
        self.refNumber = ko.observable();
        self.debitAmount = ko.observable();
        self.bankCharges = ko.observable();
        self.remittedAmount = ko.observable();
        self.purposeText = ko.observable();
        self.description = ko.observable();
        self.payeeName = ko.observable();
        self.accountNumber = ko.observable();
        self.bankName = ko.observable();
        self.bankAddress = ko.observable();
        self.branches = ko.observableArray();
        self.isAdviceLoaded = ko.observable(false);
        self.currentTask = ko.observable("PC_I_OUTRL");
        self.accountList = ko.observableArray();
        self.accountFetched = ko.observable(false);
        self.validator = ko.observable();
        self.closeDialog = function () {
            $("#noaccount").hide();
        };
        self.fetchAccountList = function () {
            self.accountList.removeAll();
            outwardRemittanceModel.fetchAccountData(self.currentTask()).done(function (data) {
                if (data.accounts) {
                    self.accountList.push({
                        id: {
                            value: "all",
                            displayValue: self.resource.outwardRemittance.allAccounts
                        }
                    });
                    ko.utils.arrayPushAll(self.accountList, data.accounts);
                    self.accountFetched(true);
                }
            });
        };
        self.fetchAccountList();
        self.getHostDate = function () {
            outwardRemittanceModel.getHostDate().done(function (data) {
                var date = new Date(data.currentDate.valueDate);
                self.currentDate(rootParams.baseModel.formatDate(date));
                self.isDateLoaded(true);
            });
        };
        self.reset = function () {
            self.accountId("all");
            self.fromDate("");
            self.toDate("");
            self.fromAmount("");
            self.toAmount("");
        };
        self.searchAccounts = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("amountTracker"))) {
                return;
            }
            self.baseURL = "payments/outwardRemittances";
            if (self.fromDate() || self.toDate() || self.fromAmount() || self.toAmount()) {
                self.baseURL = self.baseURL + "?";
                if (self.fromDate()) {
                    if (self.baseURL.indexOf("=") > -1) {
                        self.baseURL = self.baseURL + "&fromDate=" + self.fromDate();
                    } else {
                        self.baseURL = self.baseURL + "fromDate=" + self.fromDate();
                    }
                }
                if (self.toDate()) {
                    if (self.baseURL.indexOf("=") > -1) {
                        self.baseURL = self.baseURL + "&toDate=" + self.toDate();
                    } else {
                        self.baseURL = self.baseURL + "toDate=" + self.toDate();
                    }
                }
                if (self.fromAmount()) {
                    if (self.baseURL.indexOf("=") > -1) {
                        self.baseURL = self.baseURL + "&fromAmount=" + self.fromAmount();
                    } else {
                        self.baseURL = self.baseURL + "fromAmount=" + self.fromAmount();
                    }
                }
                if (self.toAmount()) {
                    if (self.baseURL.indexOf("=") > -1) {
                        self.baseURL = self.baseURL + "&toAmount=" + self.toAmount();
                    } else {
                        self.baseURL = self.baseURL + "toAmount=" + self.toAmount();
                    }
                }
            }
            if (self.accountId() && self.accountId()[0] !== "all") {
                if (self.baseURL.indexOf("=") > -1) {
                    self.baseURL = self.baseURL + "&accountId=" + self.accountId();
                } else {
                    self.baseURL = self.baseURL + "?accountId=" + self.accountId();
                }
            }
            self.dataLoaded(false);
            outwardRemittanceModel.getTransactions(self.baseURL).done(function (data) {
                var array = [];
                if (data.outwardRemittances) {
                    self.searchData(data.outwardRemittances);
                    array = $.map(self.searchData(), function (u) {
                        var obj = {
                            "transDate": u.transactionDate ? rootParams.baseModel.formatDate(u.transactionDate) : "-",
                            "refNumber": u.txnReferenceNo ? u.txnReferenceNo : "-",
                            "remittedAmount": u.transactionAmount ? rootParams.baseModel.formatCurrency(u.transactionAmount.amount, u.transactionAmount.currency) : "-",
                            "debitAccount": u.debitAccount.id ? u.debitAccount.id.displayValue : "-",
                            "debitAmount": u.outwardRemittanceDetailsDTO.debitAmount ? rootParams.baseModel.formatCurrency(u.outwardRemittanceDetailsDTO.debitAmount.amount, u.outwardRemittanceDetailsDTO.debitAmount.currency) : "-",
                            "payee": u.outwardRemittanceDetailsDTO.payeeName ? u.outwardRemittanceDetailsDTO.payeeName : "-"
                        };
                        return obj;
                    });
                }
                self.dataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(array), { idAttribute: "refNumber" });
                self.dataLoaded(true);
            });
        };
        self.getBranches = function (debitBranchCode) {
            outwardRemittanceModel.getBranches().done(function (data) {
                for (var i = 0; i < data.branchAddressDTO.length; i++) {
                    self.branches.push({
                        text: data.branchAddressDTO[i].branchName,
                        value: data.branchAddressDTO[i].id
                    });
                    if (debitBranchCode === data.branchAddressDTO[i].id) {
                        self.debitAccountBranch(data.branchAddressDTO[i].branchName);
                        self.stageTwo(true);
                        break;
                    }
                }
            });
        };
        self.getPurpose = function (purposeCode) {
            outwardRemittanceModel.getPurpose().done(function (data) {
                if (data.purposeList !== null && data.purposeList.length > 0) {
                    for (var i = 0; i < data.purposeList.length; i++) {
                        if (purposeCode === data.purposeList[i].code) {
                            self.purposeText(data.purposeList[i].description);
                            break;
                        }
                    }
                }
            });
        };
        self.transactionSelected = function (data) {
            var refNo = data.refNumber;
            outwardRemittanceModel.getDetail(refNo).done(function (data) {
                var debitBranchCode = data.outwardRemittanceDTO.debitAccount.branchCode;
                var purposeCode = data.outwardRemittanceDTO.remittancePurpose;
                self.stageOne(false);
                self.getBranches(debitBranchCode);
                self.getPurpose(purposeCode);
                self.debitAccountNumber(data.outwardRemittanceDTO.debitAccount.id.displayValue);
                self.transDate(rootParams.baseModel.formatDate(data.outwardRemittanceDTO.transactionDate));
                self.refNumber(refNo);
                self.debitAmount(rootParams.baseModel.formatCurrency(data.outwardRemittanceDTO.outwardRemittanceDetailsDTO.debitAmount.amount, data.outwardRemittanceDTO.outwardRemittanceDetailsDTO.debitAmount.currency));
                self.bankCharges(data.outwardRemittanceDTO.bankCharges ? rootParams.baseModel.formatCurrency(data.outwardRemittanceDTO.bankCharges.amount, data.outwardRemittanceDTO.bankCharges.currency) : "-");
                self.remittedAmount(rootParams.baseModel.formatCurrency(data.outwardRemittanceDTO.transactionAmount.amount, data.outwardRemittanceDTO.transactionAmount.currency));
                self.description(data.outwardRemittanceDTO.remarks);
                self.payeeName(data.outwardRemittanceDTO.outwardRemittanceDetailsDTO.payeeName);
                self.accountNumber(data.outwardRemittanceDTO.creditAccount.id.displayValue);
                self.bankName(data.outwardRemittanceDTO.outwardRemittanceDetailsDTO.payeeBankName);
                self.bankAddress(data.outwardRemittanceDTO.outwardRemittanceDetailsDTO.payeeBankAddress);
                rootParams.dashboard.headerName(self.resource.outwardRemittance.headerDetail);
                location.hash = "detail";
                if (typeof data.outwardRemittanceDTO.adviceList !== "undefined" && data.outwardRemittanceDTO.adviceList) {
                    self.isAdviceLoaded(true);
                }
            });
        };
        self.back = function () {
            rootParams.dashboard.headerName(self.resource.outwardRemittance.header);
            self.stageTwo(false);
            self.stageOne(true);
        };
        self.cancel = function () {
            history.back();
        };
        self.validateFromAmount = {
            "validate": function (value) {
                if (isNaN(value) || value.length > 15 || value < 0) {
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resource.outwardRemittance.amountValidation));
                }
                if (self.toAmount()) {
                    var from = oj.Components.getWidgetConstructor($("#toAmount"));
                    if (typeof from === "function") {
                        from("validate");
                    }
                }
            }
        };
        self.validateToAmount = {
            "validate": function (value) {
                if (isNaN(value) || value.length > 15 || value < 0) {
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resource.outwardRemittance.amountValidation));
                }
                if (self.fromAmount()) {
                    if (Number(value) < Number(self.fromAmount())) {
                        throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resource.outwardRemittance.toAmountValidation));
                    }
                }
            }
        };
        self.generatePDF = function () {
            outwardRemittanceModel.fetchPDF(self.refNumber());
        };
    };
});