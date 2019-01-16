define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/record-list-non-financial",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojmodel",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojcollectiontabledatasource"
], function (oj, ko, $, recordListNonFinancialModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle.recordListNonFinancial;
        rootParams.baseModel.registerComponent("record-view-non-financial", "file-upload");
        self.showBackButton = ko.observable(true);
        if (rootParams.rootModel.transactionDetails) {
            if (rootParams.rootModel.transactionDetails().discriminator === "NON_FINANCIAL_BULK_FILE") {
                self.showBackButton(false);
                self.selectedFile = rootParams.data[0];
            }
        } else
            self.selectedFile = ko.observable(ko.utils.unwrapObservable(rootParams.rootModel.params)[0]);
        self.selectedPayeeType = ko.observable();
        self.selectedRStatus = ko.observable();
        self.selectedAccountType = ko.observable();
        self.accountTypeList = ko.observableArray();
        self.isAccountTypeListLoaded = ko.observable(false);
        self.payeeTypeList = ko.observableArray();
        self.isPayeeTypeListLoaded = ko.observable(false);
        self.pageNumber = ko.observable(1);
        self.totalCount = ko.observable();
        self.rStatusListMap = {};
        self.rStatusList = ko.observableArray();
        self.isRStatusListLoaded = ko.observable(false);
        self.datasource = ko.observable();
        self.searchClicked = ko.observable(false);
        self.recordDetails = ko.observableArray();
        self.selectedRecord = ko.observable();
        self.recordDetailsMap = {};
        self.searchData = {
            payeeType: "",
            accountType: "",
            payeeName: "",
            rStatus: ""
        };
        self.isRecordsFetched = ko.observable(false);
        self.searchData = ko.mapping.fromJS(self.searchData);
        self.searchEnable = function () {
            $("#search").slideToggle();
        };
        self.closeSearch = function () {
            $("#search").slideToggle();
        };
        self.refreshSearch = function () {
            self.searchData.payeeType([]);
            self.searchData.accountType([]);
            self.searchData.payeeName("");
            self.searchData.rStatus([]);
        };
        self.payeeTypeValueChangeHandler = function (event) {
            if (event.detail.value) {
                self.selectedPayeeType(self.searchData.payeeType());
            }
        };
        self.accountTypeValueChangeHandler = function (event) {
            if (event.detail.value) {
                self.selectedAccountType(self.searchData.accountType());
            }
        };
        self.rStatusValueChangeHandler = function (event) {
            if (event.detail.value) {
                self.selectedRStatus(self.rStatusListMap[self.searchData.rStatus()]);
            }
        };
        self.accountTypeList().push({
            code: self.Nls.internal,
            description: self.Nls.internal
        }, {
            code: self.Nls.domestic,
            description: self.Nls.domestic
        }, {
            code: self.Nls.international,
            description: self.Nls.international
        });
        self.payeeTypeList().push({
            code: self.Nls.bankAccount,
            description: self.Nls.bankAccount
        }, {
            code: self.Nls.demandDraft,
            description: self.Nls.demandDraft
        });
        self.generateURL = function () {
            if (self.searchClicked()) {
                var params = (self.searchData.payeeName() ? "&beneName=" + encodeURIComponent(self.searchData.payeeName()) : "") + (self.searchData.payeeType() ? "&payeeType=" + encodeURIComponent(self.searchData.payeeType()) : "") + (self.searchData.rStatus() ? "&recordStatus=" + self.searchData.rStatus() : "") + (self.searchData.accountType() ? "&accountType=" + encodeURIComponent(self.searchData.accountType()) : "") + ("&transactionType=" + self.selectedFile().transaction);
                self.searchParameters(params);
                return "fileUploads/files/" + self.selectedFile().fileId + "/records?pageSize=10&pageNumber=" + self.pageNumber() + params;
            }
                return "fileUploads/files/" + self.selectedFile().fileId + "/records?pageSize=10&pageNumber=" + self.pageNumber() + "&transactionType=" + self.selectedFile().transaction;

        };
        self.searchRecord = function () {
            self.searchData.payeeType(self.searchData.payeeType() + "");
            self.searchData.rStatus(self.searchData.rStatus() + "");
            self.searchData.accountType(self.searchData.accountType() + "");
            if (!self.searchData.payeeType() && !self.searchData.accountType() && !self.searchData.payeeName() && !self.searchData.rStatus()) {
                rootParams.baseModel.showMessages(null, [self.Nls.recordViewErrorMsg], "INFO");
                return;
            }
            self.searchClicked(true);
            self.pageNumber(1);
            self.screenType();
        };
        self.screenType = function () {
            if (rootParams.baseModel.large())
                self.recordDetailsCol().reset();
            else
                self.recordDetailsCol().refresh();
        };
        self.createTableSource = function () {
            self.recordDetailsCol = ko.observable();
            self.recordDetail = oj.Model.extend({
                idAttribute: "recRefId",
                sync: self.myFetch
            });
            self.myRecordDetail = new self.recordDetail();
            self.recordDetailsCollection = oj.Collection.extend({
                model: self.myRecordDetail,
                sync: self.myFetch,
                fetchSize: 10,
                hasMore: true
            });
            self.recordDetailsCol(new self.recordDetailsCollection());
            self.datasource(new oj.PagingTableDataSource(new oj.CollectionTableDataSource(self.recordDetailsCol(), { idAttribute: "recRefId" })));
            self.screenType();
        };
        self.listRecords = function (options, model) {
            self.pageNumber(Math.floor(options.startIndex / 10) + 1);
            self.isRecordsFetched(false);
            recordListNonFinancialModel.listRecords(self.generateURL()).done(function (data) {
                self.recordDetails.removeAll();
                self.totalCount(data.totalCount);
                if (data.recordDetails) {
                    for (var i = 0; i < data.recordDetails.length; i++) {
                        var recordData = data.recordDetails[i];
                        recordData.statusDesc = self.rStatusListMap[recordData.status];
                        self.recordDetailsMap[recordData.recRefId] = recordData;
                        self.recordDetails.push(recordData);
                    }
                }
                options.success(self.recordDetails());
                model.totalResults = self.totalCount();
                self.isRecordsFetched(true);
            });
        };
        self.myFetch = function (method, model, options) {
            if (method === "read" && model instanceof oj.Collection) {
                self.listRecords(options, model);
            }
        };
        self.onUserSelected = function (event) {
            if (event.detail.value) {
                if (event.detail.value.startKey.row) {
                    self.selectedRecord(self.recordDetailsMap[event.detail.value.startKey.row]);
                    rootParams.dashboard.loadComponent("record-view-non-financial", self.selectedRecord(), self);
                }
            }
        };
        self.onUserListSelected = function (data) {
            self.selectedRecord(data);
            rootParams.dashboard.loadComponent("record-view-non-financial", self.selectedRecord(), self);
        };
        recordListNonFinancialModel.getRecordStatus().done(function (data) {
            self.rStatusList(data.enumRepresentations[0].data);
            for (var i = 0; i < self.rStatusList().length; i++) {
                self.rStatusListMap[self.rStatusList()[i].code] = self.rStatusList()[i].description;
            }
            self.isRStatusListLoaded(true);
            self.createTableSource();
        });
        self.back = function () {
            history.go(-1);
        };
    };
});