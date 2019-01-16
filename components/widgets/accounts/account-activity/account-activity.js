define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/account-activity",
  "ojs/ojknockout",
  "ojs/ojlistview",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojcollectiontabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojdatetimepicker",
  "ojs/ojbutton",
  "ojs/ojmenu",
  "ojs/ojradioset"
], function(oj, ko, $, AccountActivity, ResourceBundle) {
  "use strict";
  var vm = function(rootParams) {
    ko.utils.extend(this, rootParams.rootModel);
    var self = this,
      limit = 0;
    self.dataSource = null;
    self.searchCriteria = ko.observable("CPR");
    self.detailsFetched = ko.observable(false);
    self.type = ko.observable("A");
    self.estatementSubscribedAccountNumbersArray = ko.observableArray();
    self.accountNumberAlreadySubscribed = ko.observable(false);
    self.showeStatement = ko.observable(false);
    self.physicalStatement = ko.observable(false);
    self.subscribeConfirmScreen = ko.observable(false);
    self.reviewPhysicalStatement = ko.observable(false);
    self.submitPhysicalStatement = ko.observable(false);
    self.downloadStatement = ko.observable(false);
    self.dataPresent = ko.observable(false);
    self.screenSize = ko.observable();
    self.baseURL = ko.observable();
    self.accountID = ko.observable();
    self.totalRecords = ko.observable();
    self.activityAccountsLoaded = ko.observable(false);
    self.activityAccounts = ko.observableArray([]);
    self.currentBalance = ko.observable();
    self.selectedAccountId = ko.observable();
    self.typeOfTransaction = ko.observable();
    self.showBalance = ko.observable(false);
    self.fromDateSelected = ko.observable();
    self.toDateSelected = ko.observable();
    self.previouValueOfSelectedAccountID = ko.observable();
    self.previousFromDateSelected = ko.observable();
    self.previousToDateSelected = ko.observable();
    self.openingBalance = ko.observable();
    self.closingBalance = ko.observable();
    var accountsData = null;
    self.allAccounts = ko.observable([]);
    self.serviceId = ko.observable();
    self.activeAccounts = ko.observableArray();
    self.displayAccountList = ko.observableArray();

    self.transactionUrl = ko.observable();
    self.selectedAccountId = ko.observable();
    self.productName = ko.observable();
    self.componentName = ko.observable("date-box");
    self.pdfURL = ko.observable();
    self.screenSize = ko.observable();
    self.limit = 200;
    self.offset = 1;
    self.resource = ResourceBundle;
    self.disableSave = ko.observable(false);

    if (rootParams.rootModel.params) {
      self.screenSize(rootParams.rootModel.params.mode);
      self.baseURL(rootParams.rootModel.params.baseUrl);
    } else if (rootParams.data.data) {
      self.screenSize(rootParams.data.data.mode);
      self.baseURL(rootParams.data.data.baseUrl);
    }

    if (!rootParams.dashboard.isDashboard()) {
      rootParams.baseModel.setwebhelpID(rootParams.dashboard.application() + "-account-activity");
      self.screenSize(self.mode);
      rootParams.dashboard.headerName(self.resource.compName.statement);
    }

    self.validationTracker = ko.observable();
    if (self.baseURL().indexOf("?") > 0) {
      self.baseURL(self.baseURL().substring(0, self.baseURL().indexOf("?")));
      self.baseURL(self.baseURL() + "/");
    }
    self.fromDate = ko.observable();
    self.toDate = ko.observable();
    rootParams.baseModel.registerComponent("virtual-paging", "base-components");
    self.loanOrTdLoaded = ko.observable(false);
    self.dateRange = ko.observable(false);
    self.todayDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));
    if (self.baseURL() === "accounts/loan/" || self.baseURL() === "accounts/deposit/") {
      self.loanOrTdLoaded(true);
    }
    self.searchCriteria = ko.observable("CPR");
    self.searchCriteriaOption = ko.observable(self.resource.currentPeriod);
    self.summaryLoaded = ko.observable(false);
    self.loadTemplate = ko.observable();
    self.maskedAccountNumber = ko.observable();
    self.accountId = ko.observable();
    self.primaryEmailID = ko.observable();
    self.partyName = ko.observable();
    self.sortedTransactionArray = ko.observableArray([]);
    self.debitTransactionArray = ko.observableArray([]);
    self.sortDirection = ko.observable();
    self.sortCriteriaChanged = ko.observable(false);
    var criteriaMap = {};
    self.activity = ko.observable(true);
    self.filter = ko.observable(false);
    rootParams.baseModel.registerElement(["date-box", "confirm-screen", "modal-window", "page-section", "row"]);
    rootParams.baseModel.registerComponent("electronic-statement", "accounts");
    rootParams.baseModel.registerComponent("physical-statement", "accounts");
    self.checkEmpty = function(obj) {
      if (typeof obj === "undefined" || obj === null || obj === "") {
        return false;
      }
        return true;

    };
    /**
     * This function converts the response after fetching from server to collection
     * sets the array for headerDetail as well
     * @function getCollectionData
     * @memberOf AccountActivity
     **/
    var Thiscollection;
    self.getCollectionData = function() {
      self.datafetched = null;
      self.detailsFetched(false);
      self.openingBalance(null);
      self.closingBalance(null);
      if (self.activityAccountsLoaded() === true || accountsData) {
        var atIndex = 0;
        for (var i = 0; i < self.activeAccounts().length; i++) {
          if (self.accountID()[0] === self.activeAccounts()[i].id.value) {
            atIndex = i;
            break;
          }
        }
        if (self.activeAccounts().length > 0) {
          self.maskedAccountNumber(self.activeAccounts()[atIndex].id.displayValue);
          self.partyName(self.activeAccounts()[atIndex].partyName);
          self.productName(self.activeAccounts()[atIndex].productDTO.description);
        }
      }
      if (self.transactionUrl()) {
        var model = oj.Model.extend({
          idAttribute: "key.transactionReferenceNumber,key.subSequenceNumber"
        });
        Thiscollection = new oj.Collection(null, {
          url: self.transactionUrl(),
          model: model
        });
        self.filter(false);
        self.activity(true);
        self.disableSave(true);
        AccountActivity.fetchTransactionDetails(limit, self.transactionUrl()).then(function(data) {
          self.convertingFunction(data);
          self.disableSave(false);
        });
      }
    };
    self.sortedItems = ko.observableArray([]);
    self.convertingFunction = function(data) {
      self.detailsFetched(false);
      Thiscollection.reset();
      self.datafetched = data;
      /*
          	In case of LNT we are getting sorted data,
          	handling in other cases, just reversing the response array

          	*/
      if (self.screenSize() !== "compact") {
        if (typeof self.datafetched === "object") {
          if (self.datafetched.items) {
            if (self.sortedItems().length > 0) {
              self.sortedItems.removeAll();
            }
            var length = self.datafetched.items.length;
            for (var i = length - 1; i >= 0; i--) {
              self.sortedItems.push(self.datafetched.items[i]);
            }
            self.datafetched.items = self.sortedItems();
          }
        }
      }
      Thiscollection.set(data.items);
      if (self.datafetched.items[0].key) {
        self.dataPresent(true);
      }
      self.createDataSource();
      this.currentDate = "";
      this.currentSort = "default";
    };
    self.createDataSource = function() {
      if (self.dataPresent()) {
        self.dataSource = new oj.PagingTableDataSource(new oj.CollectionTableDataSource(Thiscollection));
      } else {
        self.dataSource = null;
      }
      if (self.datafetched.summary && self.type() === "A") {
        self.openingBalance(rootParams.baseModel.formatCurrency(self.datafetched.summary.openingBalance.amount, self.datafetched.summary.openingBalance.currency));
        self.closingBalance(rootParams.baseModel.formatCurrency(self.datafetched.summary.closingBalance.amount, self.datafetched.summary.closingBalance.currency));
        self.summaryLoaded(true);
      }
      if (self.datafetched && self.datafetched.items && self.datafetched.items[0] && self.datafetched.items[0].runningBalance) {
        self.showBalance(true);
      } else {
        self.showBalance(false);
      }
      self.filter(false);
      self.activity(true);
      self.detailsFetched(true);
    };
    /**
     * This computed function to search for specified search criteria
     * @function URL
     * returns new updated URL
     * @memberOf AccountActivity
     **/
    self.URL = ko.computed(function() {
      var url;
      if (self.selectedAccountId()) {
        if (self.type() === "A") {
          self.typeOfTransaction("All");
        } else if (self.type() === "D") {
          self.typeOfTransaction(self.resource.Debit);
        } else if (self.type() === "C") {
          self.typeOfTransaction(self.resource.Credit);
        }
        if (self.screenSize() === "compact") {
          url = self.baseURL() + self.selectedAccountId() + "/transactions?searchBy=LNT&noOfTransactions=4";
        } else {
          if (self.type() !== "A") {

            url = self.baseURL() + self.selectedAccountId() + "/transactions?searchBy=" + self.searchCriteria() + "&transactionType=" + self.type();

          } else {

            url = self.baseURL() + self.selectedAccountId() + "/transactions?searchBy=" + self.searchCriteria();

          }
          if (self.searchCriteria() === "SPD") {
            if (self.checkEmpty(rootParams.baseModel.getDropDownValue(self.fromDateSelected())) && self.checkEmpty(rootParams.baseModel.getDropDownValue(self.toDateSelected()))) {

              url += "&fromDate=" + self.fromDateSelected() + "&toDate=" + self.toDateSelected();

            }
            self.previouValueOfSelectedAccountID(self.selectedAccountId.peek());
          }
        }
        self.selectedAccountId(undefined);
        self.transactionUrl(url);
        self.pdfURL(url);
      }
    });
    self.DateValueChanged = ko.computed(function() {
      if (self.checkEmpty(self.fromDateSelected()) && self.checkEmpty(self.toDateSelected())) {
        self.searchCriteria("SPD");
        var selectedDateRange = rootParams.baseModel.formatDate(new Date(self.fromDateSelected())) + " TO " + rootParams.baseModel.formatDate(new Date(self.toDateSelected()));
        self.searchCriteriaOption(selectedDateRange);
        if (self.screenSize() === "fullScreen") {
          if (self.fromDateSelected() !== self.previousFromDateSelected() || self.toDateSelected() !== self.previousToDateSelected()) {
            self.previouValueOfSelectedAccountID(undefined);
            if (typeof self.accountID() === "object") {
              if (self.previouValueOfSelectedAccountID() !== self.accountID()[0]) {
                self.selectedAccountId(self.accountID()[0]);
              }
            } else if (self.previouValueOfSelectedAccountID() !== self.accountID()) {
                self.selectedAccountId(self.accountID());
              }
            self.previousFromDateSelected(self.fromDateSelected());
            self.previousToDateSelected(self.toDateSelected());
          } else if (typeof self.accountID() === "object") {
              if (self.previouValueOfSelectedAccountID() !== self.accountID()[0]) {
                self.selectedAccountId(self.accountID()[0]);
              }
            } else if (self.previouValueOfSelectedAccountID() !== self.accountID()) {
                self.selectedAccountId(self.accountID());
              }
        }
      }
    });
    self.transactionUrl.subscribe(function() {
      if (self.transactionUrl()) {
        if (typeof self.searchCriteria() === "object") {
          self.searchCriteria(self.searchCriteria()[0]);
        }
        self.getCollectionData();
      }
    });
    /**
     * This function to create an array which will be used to render view
     * accepts params {data} - either its fetched data from service
     * or passed data from previous screen
     * @function loadData
     * @memberOf AccountActivity
     **/
    self.loadData = function(data) {
      if (data.accounts)
        self.allAccounts(rootParams.baseModel.sortLib(data.accounts, "accountNickname"));
      if (self.allAccounts() && self.activeAccounts().length === 0) {
        for (var i = 0; i < self.allAccounts().length; i++) {
          if (self.allAccounts()[i].status === "ACTIVE") {
            self.activeAccounts().push(self.allAccounts()[i]);
          }
        }
      }

      self.activeAccounts(rootParams.baseModel.sortLib(self.activeAccounts(), "partyName"));

      self.activeAccounts(self.activeAccounts().map(function(item) {
        item.label = self.getDisplayText(item.id.displayValue, item.accountNickname);
        item.value = item.id.value;
        return item;
      }));

      var activeAccounts = rootParams.baseModel.groupBy(self.activeAccounts(), ["partyId.value", "module"], function(item) {
        return [item.partyName, self.resource[item.module]];
      });
      if (activeAccounts.length === 1 && activeAccounts[0].children.length === 1) {
        activeAccounts = [activeAccounts[0].children[0]];
      }

      ko.utils.arrayPushAll(self.displayAccountList, activeAccounts);

      if (self.accountID() === undefined && self.activeAccounts().length > 0) {
        self.accountID(self.activeAccounts()[0].id.value);
      }

      self.selectedAccountId(self.accountID());

      self.activityAccountsLoaded(true);
      if ($.inArray(self.selectedAccountId(), self.estatementSubscribedAccountNumbersArray()) > 0) {
        self.accountNumberAlreadySubscribed(true);
      } else {
        self.accountNumberAlreadySubscribed(false);
      }
    };

    self.getDisplayText = function(accountNumber, nickName) {
      if (nickName) {
        return rootParams.baseModel.format(self.resource.displayContent, {
          displayValue: accountNumber,
          nickname: nickName
        });
      }
        return accountNumber;

    };
    AccountActivity.fetchAccounts().then(function(data){
      if(data){
        self.loadData(data);
      }else{
        AccountActivity.fetchActivitiesDetails(self.baseURL()).then(function(data) {
          self.loadData(data);
        });
      }
      accountsData = data;
    });

    self.searchForAccount = function(event) {
      if (event.detail.value) {
        self.detailsFetched(false);
        self.dataPresent(false);
        self.physicalStatement(false);
        self.showeStatement(false);
        if (self.searchCriteria() !== "SPD") {
          self.selectedAccountId(event.detail.value);
        }
        if ($.inArray(self.selectedAccountId(), self.estatementSubscribedAccountNumbersArray()) > 0) {
          self.accountNumberAlreadySubscribed(true);
        } else {
          self.accountNumberAlreadySubscribed(false);
        }
      }
    };
    /**
     * This function gets fired on selecting of any index
     * specified transaction searched
     * @function searchCriteriaChangedHandler
     * @memberOf AccountActivity
     **/
    self.searchCriteriaChangedHandler = function(event) {
      if (event.detail.value) {
        if (event.detail.value !== event.detail.previousValue) {
          self.fromDateSelected(null);
          self.toDateSelected(null);
          if (!self.loanOrTdLoaded()) {
            if (self.type() !== "A") {
              self.summaryLoaded(false);
            } else {
              self.summaryLoaded(true);
            }
          } else {
            self.summaryLoaded(false);
          }
          self.previousFromDateSelected(null);
          self.previousToDateSelected(null);
          if (event.detail.value === "SPD") {

            self.dateRange(true);
          } else {
            self.dateRange(false);
            if (typeof self.accountID() === "object") {
              self.selectedAccountId(self.accountID()[0]);
            } else {
              self.selectedAccountId(self.accountID());
            }
          }
        }
        self.searchCriteria(event.detail.value);
      }
      if (event.detail.value === "CPR") {
        self.searchCriteriaOption(self.resource.currentPeriod);
      } else if (event.detail.value === "PQT") {
        self.searchCriteriaOption(self.resource.PrevQuarter);
      } else if (event.detail.value === "PMT") {
        self.searchCriteriaOption(self.resource.PrevMonth);
      }
    };
    /**
     * This function sorts the listed transaction based on the transatiobType Value
     * @function transactionOptionChangeHandler
     * @memberOf AccountActivity
     **/
    self.transactionOptionChangeHandler = function(event) {
      if (event.detail.value) {
        self.summaryLoaded(false);
        self.searchCriteria(self.searchCriteria());
        self.type(event.detail.value);
        if (typeof self.accountID() === "object") {
          self.selectedAccountId(self.accountID()[0]);
        } else {
          self.selectedAccountId(self.accountID());
        }
      }
    };
    /**
     * This function gets fired on selecting of filter button
     * @function showFilter
     * @memberOf AccountActivity
     **/
    self.showFilter = function() {
      self.activity(false);
      self.filter(true);
      self.showeStatement(false);
      self.showPhysicalStatement(false);
      if (!rootParams.baseModel.large()) {
        location.hash = "filter";
      }
      $("#filterDilog").trigger("openModal");
      rootParams.dashboard.backAllowed(true);
    };
    /* This function gets fired on selecting for subscribing for the eStatements
     * @function showFilter
     * @memberOf AccountActivity
     **/
    self.eStatementSubsciption = function() {
      self.activity(false);
      self.filter(false);
      self.showeStatement(false);
      self.showPhysicalStatement(false);
      self.physicalStatement(false);
      self.reviewPhysicalStatement(false);
      self.subscribeConfirmScreen(false);
      self.submitPhysicalStatement(false);
      self.showeStatement(true);
      $("#statementDialog").trigger("openModal");
      if (!rootParams.baseModel.large()) {
        location.hash = "eStatement";
      }
      rootParams.dashboard.backAllowed(true);
    };
    /**
     * This function gets fired on selecting of physicalStatement
     * @function physicalStatementRequest
     * @memberOf AccountActivity
     **/
    self.showPhysicalStatement = ko.observable(false);
    self.physicalStatementRequest = function() {
      if (!rootParams.baseModel.large()) {
        location.hash = "physicalStatement";
      }
      self.activity(false);
      self.filter(false);
      self.showeStatement(false);
      self.physicalStatement(true);
      self.reviewPhysicalStatement(false);
      self.subscribeConfirmScreen(false);
      self.submitPhysicalStatement(false);
      self.showPhysicalStatement(true);
      self.fromDate(undefined);
      self.toDate(undefined);
      $("#statementDialog").trigger("openModal");
      rootParams.dashboard.backAllowed(true);
    };
    self.showDateRange = function(event) {
      self.screenSize("Mobile");
      if (event.detail.value) {
        if (event.detail.value === "SPD") {
          self.dateRange(true);
        } else {
          self.dateRange(false);
          self.fromDateSelected(undefined);
          self.toDateSelected(undefined);
        }
        if (event.detail.value === "CPR") {
          self.searchCriteriaOption(self.resource.currentPeriod);
        } else if (event.detail.value === "PQT") {
          self.searchCriteriaOption(self.resource.PrevQuarter);
        } else if (event.detail.value === "PMT") {
          self.searchCriteriaOption(self.resource.PrevMonth);
        }
      }
    };
    /**
     * This function shows the full screen view of account-activity
     * in which only template file name is changed
     * @function showDashboardView
     * @memberOf AccountActivity
     **/
    self.showDashboardView = function() {
      self.type("A");
      var params = {
        "baseUrl": self.baseURL(),
        "mode": "fullScreen"
      };
      rootParams.dashboard.loadComponent("account-activity", params);
    };
    /**
     * This function opens the pdf view of searched
     * transactions in new window Tab
     * @function saveStatement
     * @memberOf AccountActivity
     **/
    self.saveStatement = function() {
      if (!self.disableSave()) {
        if (self.searchCriteria() === "SPD") {
          AccountActivity.fetchPDF(self.pdfURL());
        } else {
          AccountActivity.fetchPDF(self.transactionUrl());
        }
      }
    };
    /**
     * This function sorts the transaction list by date
     * @function sortByDate
     * @memberOf AccountActivity
     **/
    self.sortByDate = function() {
      self.sortCriteriaChanged(!self.sortCriteriaChanged());
      if (!self.sortCriteriaChanged()) {
        $("#sortButton").removeClass("icon-sort-asc");
        $("#sortButton").addClass("icon-sort-desc");
        self.sortDirection("descending");
      } else {
        self.sortDirection("ascending");
        $("#sortButton").addClass("icon-sort-asc");
        $("#sortButton").removeClass("icon-sort-desc");
      }
      criteriaMap.date = {
        key: "transactionDate",
        direction: self.sortDirection()
      };
      var criteria = criteriaMap.date;
      self.dataSource.sort(criteria);
    };
    /**
     * This function filters the list based on selected option and closes the drawer afer that
     * @function filterTransaction
     * @memberOf AccountActivity
     **/
    self.filterTransaction = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      if (self.searchCriteria() === "SPD") {
        var selectedDateRange = rootParams.baseModel.formatDate(new Date(self.fromDateSelected())) + " TO " + rootParams.baseModel.formatDate(new Date(self.toDateSelected()));
        self.searchCriteriaOption(selectedDateRange);
      }
      if (!self.loanOrTdLoaded()) {
        if (self.type() !== "A") {
          self.summaryLoaded(false);
        } else {
          self.summaryLoaded(true);
        }
      } else {
        self.summaryLoaded(false);
      }
      self.filter(false);
      self.activity(true);
      rootParams.dashboard.backAllowed(true);
      self.selectedAccountId(self.accountID());
    };
    /**
     * This function dismisses the dialoge opened on click of menu button
     * @function ok
     * @memberOf eStatementModel
     **/
    self.ok = function() {
      self.subscribeConfirmScreen(false);
      self.showeStatement(false);
      self.showPhysicalStatement(false);
      self.reviewPhysicalStatement(false);
      self.submitPhysicalStatement(false);
      self.physicalStatement(false);
      $("#statementDialog").hide();
      rootParams.dashboard.headerName(self.resource.compName.statement);
      self.activity(true);
      self.filter(false);
      rootParams.dashboard.backAllowed(true);
    };
    self.etaPiSigma = function() {
      $(".oj-pagingcontrol-nav-arrow").css("width", "7.286rem");
      $(".oj-component-icon").css("font-size", "20px");
    };
    $(window).on("hashchange", function() {
      if (location.hash === "") {
        self.activity(true);
        self.filter(false);
        self.showeStatement(false);
        self.showPhysicalStatement(false);
      }
      if (location.hash === "#filter") {
        self.activity(false);
        self.filter(true);
        self.showeStatement(false);
        self.showPhysicalStatement(false);
      }
      if (location.hash === "#eStatement") {
        self.activity(false);
        self.filter(false);
        self.showeStatement(true);
        self.showPhysicalStatement(false);
      }
      if (location.hash === "#physicalStatement") {
        self.activity(false);
        self.filter(false);
        self.showeStatement(false);
        self.showPhysicalStatement(true);
        self.physicalStatement(true);
        self.reviewPhysicalStatement(false);
        self.submitPhysicalStatement(false);
      }
    });
  };
  vm.prototype.dispose = function() {
    this.DateValueChanged.dispose();
    this.URL.dispose();
  };
  return vm;
});
