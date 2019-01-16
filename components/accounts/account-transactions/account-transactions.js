define([
    "knockout",
    "./model",
    "jquery",
    "ojL10n!resources/nls/account-transactions",
    "ojs/ojcore",
    "framework/js/constants/constants",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojknockout",
    "ojs/ojbutton",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojcollectiontabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation",
    "ojs/ojvalidation",
    "ojs/ojarraytabledatasource",
    "ojs/ojradioset"
], function (ko, componentModel, $, resourceBundle, oj, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.hideAmount = ko.observable(false);
        self.nls = resourceBundle;
        var module;
        self.transactionHeading = ko.observable(self.nls.pageHeader);
        self.showSearch = ko.observable(false);
        self.type = rootParams.type || self.params.type;
        self.filter = ko.observable(!!self.params.fullPage);
        self.openingBalance = ko.observable();
        self.closingBalance = ko.observable();
        var subscription = null;
        self.showPagination = ko.observable();
        self.showeStatement = ko.observable(false);
        self.showPhysicalStatement = ko.observable(false);
        self.showeStatementDownload = ko.observable(false);
        self.accountNumberAlreadySubscribed = ko.observable(false);
        self.dateRange = ko.observable(false);
        self.dateValid = ko.observable();
        self.items = ko.observableArray();
        self.validationTracker = ko.observable();
        self.menuItems = ko.observableArray();
        self.mediatypeLoaded = ko.observable(false);
        self.mediaTypeSelected = ko.observable();
        self.mediaFormat = ko.observable();
        self.statementsFetched = ko.observable(false);
        self.selectedStatementYear = ko.observable();
        self.selectedStatementMonth = ko.observable();
        self.selectedAccount = ko.observable();
        self.accountNoSelected = ko.observable();
        self.additionalDetails = ko.observable();
        self.arrowType = ko.observable("icon-arrow-right");
        self.isDisabled = ko.observable(false);
        self.pagingDatasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.items, { idAttribute: "id" }));
        var isOpen = false;
        function setPageData(data) {
            var tempData = $.map(data.items, function (v) {
                var newObj = {};
                self.items.removeAll();
                newObj.date = v.valueDate;
                newObj.description = v.description ? v.description : "";
                newObj.reference_no = v.key.transactionReferenceNumber || "";
                newObj.tempAmount = v.amountInAccountCurrency.amount ? rootParams.baseModel.formatCurrency(v.amountInAccountCurrency.amount,v.amountInAccountCurrency.currency) : "";
                newObj.amount = v.amountInAccountCurrency.amount ? v.transactionType === "C" ? rootParams.baseModel.format(self.nls.searchFields.labels.creditType, { amt: rootParams.baseModel.formatCurrency(v.amountInAccountCurrency.amount, v.amountInAccountCurrency.currency) }) : rootParams.baseModel.format(self.nls.searchFields.labels.deditType, { amt: rootParams.baseModel.formatCurrency(v.amountInAccountCurrency.amount, v.amountInAccountCurrency.currency) }) : "";
                newObj.amountClass = v.amountInAccountCurrency.amount ? v.transactionType === "C" ? "" : "debit" : "";
                newObj.balance = v.runningBalance ? rootParams.baseModel.formatCurrency(v.runningBalance.amount, v.runningBalance.currency) : "";
                newObj.id = v.key.subSequenceNumber + "-" + v.key.transactionReferenceNumber;
                newObj.transactionType = v.transactionType;
                return newObj;
            });
            if (data.summary) {
                if (data.summary.openingBalance) {
                    self.openingBalance(rootParams.baseModel.formatCurrency(data.summary.openingBalance.amount, data.summary.openingBalance.currency));
                }
                if (data.summary.closingBalance) {
                    self.closingBalance(rootParams.baseModel.formatCurrency(data.summary.closingBalance.amount, data.summary.closingBalance.currency));
                }
            }
            if (self.type === "demandDeposit") {
                self.hideAmount(false);
            } else {
                self.hideAmount(true);
            }
            if (self.searchParameters.referenceNo() || self.searchParameters.transactionType()[0] !== "A" || self.searchParameters.fromAmount() || self.searchParameters.toAmount()) {
                self.hideAmount(true);
            }
            self.showPagination(false);
            ko.utils.arrayPushAll(self.items, tempData);
            self.showPagination(true);
        }
        function fetchData(search) {
            if (self.selectedAccount()) {
                if (search) {
                    search = ko.toJSON(self.searchParameters);
                } else {
                    search = { searchBy: "CPR" };
                    search = JSON.stringify(search);
                }
                componentModel.fetchTransactionDetails(ko.utils.unwrapObservable(self.selectedAccount()), self.type, self.mediaTypeSelected(), self.mediaFormat(), module,search).done(function (data) {
                  if(data && data.items.length > 0){
                    var items = data.items.reverse();
                    data.items = items;
                    setPageData(data);
                  }else{
                    self.items.removeAll();
                    self.showPagination(false);
                  }
                });
            }
        }
        self.toggleDiv = function () {
            if (!isOpen) {
                self.openSlider();
                self.arrowType("icon-arrow-left");
            } else {
                self.closeSlider();
                self.arrowType("icon-arrow-right");
            }
            isOpen = !isOpen;
        };
        self.closeSlider = function () {
            $("#slider").fadeOut();
            oj.AnimationUtils.slideOut($("#slider"), { direction: "left" });
        };
        self.openSlider = function () {
            $("#slider").fadeIn();
            oj.AnimationUtils.slideIn($("#slider"), { direction: "right" });
        };
        var search = null;
        if (self.params.id) {
            self.selectedAccount(self.params.id.value);
            self.accountNoSelected(self.params.id.displayValue);
            module = self.params.module;
        }
        if (rootParams.account) {
            self.selectedSettlementAccount = rootParams.account;
            subscription = self.selectedSettlementAccount.subscribe(function (newValue) {
                self.selectedAccount(newValue);
            });
        }
        var typeMap = {
            CSA: "demandDeposit",
            TRD: "deposit",
            LON: "loan",
            RD : "deposit"
        };
        var moduleUrl = {
          CSA: "demandDeposit?taskCode=CH_I_AA",
          TRD: "deposit?module=CON&module=ISL&taskCode=TD_I_AA",
          LON: "loan?taskCode=LN_I_LA",
          RD : "deposit?module=RD&taskCode=TD_I_AA_RD"
        };
        if (typeMap[self.params.type]) {
            self.type = typeMap[self.params.type];
            if(self.params.module==="RD"){
               self.moduleUrl = moduleUrl[self.params.module];
             }
             else{
            self.moduleUrl = moduleUrl[self.params.type];
            }
        }
        if (self.params.fullPage) {
            self.showSearch(true);
            rootParams.dashboard.headerName(self.nls.pageHeader);
            self.transactionHeading("");
            fetchData(false);
        }
        if (Constants.userSegment === "RETAIL") {
            rootParams.dashboard.headerName(self.nls.headerName);
            self.transactionHeading("");
            fetchData(false);
        }else{
          fetchData(false);
        }
        self.period = [
            {
                key: "CPR",
                value: self.nls.dropDownValues.CPR
            },
            {
                key: "PMT",
                value: self.nls.dropDownValues.PMT
            },
            {
                key: "PQT",
                value: self.nls.dropDownValues.PQT
            },
            {
                key: "SPD",
                value: self.nls.dropDownValues.SPD
            }
        ];
        self.transactionNames = [
            {
                key: "A",
                value: self.nls.dropDownValues.a
            },
            {
                key: "C",
                value: self.nls.dropDownValues.c
            },
            {
                key: "D",
                value: self.nls.dropDownValues.d
            }
        ];
        rootParams.baseModel.registerElement("action-widget");
        rootParams.baseModel.registerElement("amount-input");
        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerComponent("physical-statement", "accounts");
        rootParams.baseModel.registerComponent("electronic-statement", "accounts");
        rootParams.baseModel.registerComponent("electronic-statement-download", "accounts");
        self.showFloatingPanel = function () {
            $("#panelViewStatement").trigger("openFloatingPanel");
        };
        self.pagingDatasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.items, { idAttribute: "id" }));
        self.todayDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));
        self.searchParameters = {
            referenceNo: ko.observable(),
            searchBy: ko.observable("CPR"),
            transactionType: ko.observable("A"),
            timeFrom: ko.observable(),
            timeTo: ko.observable(),
            fromAmount: ko.observable(),
            toAmount: ko.observable(),
            fromDate: ko.observable(),
            toDate: ko.observable()
        };
        self.hideTransactions = function () {
            self.showSearch(false);
            $("#searchSection").hide();
            location.hash = "";
        };
        self.searchTransaction = function () {
          var dateTracker = document.getElementById("dateTracker");
          if (dateTracker && dateTracker.valid !== "valid") {
              dateTracker.showMessages();
              dateTracker.focusOn("@firstInvalidShown");
              return;
          }
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.showSearch(true);
            self.showPagination(false);
            fetchData(true);
            self.filter(false);
        };
        self.showSearchSection = function () {
            rootParams.dashboard.loadComponent("account-transactions", {
                "id": self.params.id,
                "type": self.type,
                fullPage: true
            }, self);
        };
        componentModel.fetchMediaType().done(function (data) {
            self.mediatypeLoaded(false);
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.menuItems.push({
                    text: data.enumRepresentations[0].data[i].code,
                    value: data.enumRepresentations[0].data[i].value,
                    description: data.enumRepresentations[0].data[i].description
                });
            }
            self.mediatypeLoaded(true);
        });
        self.resetFilter = function () {
            self.searchParameters.referenceNo(null);
            self.searchParameters.transactionType("A");
            self.searchParameters.searchBy("CPR");
            self.searchParameters.toAmount(null);
            self.searchParameters.fromAmount(null);
            self.searchParameters.fromDate(null);
            self.searchParameters.toDate(null);
            self.showPagination(false);
        };

        self.toggleFilter = function () {
            self.filter(!self.filter());
            self.resetFilter();
            if(!self.filter()){
              self.showPagination(true);
            }
              self.showeStatement(false);
              self.showPhysicalStatement(false);
        };
        self.showDateRange = function (event) {
            if (event.detail.value) {
                self.searchParameters.searchBy("");
                self.searchParameters.searchBy(event.detail.value);
                if (self.searchParameters.searchBy() === "SPD") {
                    self.dateRange(true);
                } else {
                    self.dateRange(false);
                }
            }
        };
        self.selectedAccount.subscribe(function () {
            if (!self.params.fullPage) {
                self.showPagination(false);
                fetchData(false);
            }
        });
        self.searchBy = function(event){
          if (event.detail.value === "SPD") {
              self.dateRange(true);
          } else {
              self.dateRange(false);
          }
        };
        self.downloadStatement = function (event) {
          if(event.target.value){
            self.mediaFormat(event.target.value);
            var mediaTypeValue = ko.utils.arrayFirst(self.menuItems(), function(element) {
                 return event.target.value === element.value;
              });
            self.mediaTypeSelected(mediaTypeValue.description);
            search = ko.toJSON(self.searchParameters);
            if (self.mediaFormat() === "pdf")
                $("#passwordDialog").trigger("openModal");
            componentModel.downloadStatement(ko.utils.unwrapObservable(self.selectedAccount()), self.type, self.mediaTypeSelected(), self.mediaFormat(), module,search);
        }
      };
        self.ok = function () {
            $("#passwordDialog").trigger("closeModal");
        };
        self.eStatementSubsciption = function () {
            self.showPhysicalStatement(false);
            componentModel.fetchEStatementStatus(self.type, self.selectedAccount(),module).done(function (data) {
                if (data.eStatementsPreferencesDetailsDTO.status === "S") {
                    self.accountNumberAlreadySubscribed(true);
                } else {
                    self.accountNumberAlreadySubscribed(false);
                }
                self.showeStatement(true);
            });
            self.showeStatementDownload(false);
            $("#panelViewStatement").trigger("closeFloatingPanel");
            $("#statementDialog").trigger("openModal");
            rootParams.dashboard.backAllowed(true);
        };
        self.physicalStatementRequest = function () {
            self.showeStatement(false);
            self.showPhysicalStatement(true);
            self.showeStatementDownload(false);
            $("#panelViewStatement").trigger("closeFloatingPanel");
            $("#statementDialog").trigger("openModal");
            rootParams.dashboard.backAllowed(true);
        };
        self.downloadeStatement = function () {
            self.showPhysicalStatement(false);
            self.showeStatementDownload(true);
            self.showeStatement(false);
            $("#panelViewStatement").trigger("closeFloatingPanel");
            $("#statementDialog").trigger("openModal");
            rootParams.dashboard.backAllowed(true);
        };
        self.closeHandler = function () {
            self.showeStatement(false);
            self.statementsFetched(false);
            self.selectedStatementYear([]);
            self.selectedStatementMonth([]);
        };
        self.getTemplate = function() {
            if (Constants.userSegment !== "CORP") {
                return "retTemplate";
            }
                return "corpTemplate";

        };
        self.dispose = function () {
            if (subscription)
                subscription.dispose();
        };
    };
});
