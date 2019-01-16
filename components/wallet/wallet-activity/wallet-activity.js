define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/wallet-activity",
  "ojs/ojknockout",
  "ojs/ojlistview",
  "ojs/ojmodel",
  "ojs/ojselectcombobox",
  "ojs/ojpagingcontrol",

  "ojs/ojdatetimepicker",
  "ojs/ojfilmstrip",
  "ojs/ojbutton",
  "ojs/ojradioset",
  "ojs/ojknockout-validation"
], function(oj, ko, $, activityModel, ResourceBundle) {
  "use strict";
  var vm = function viewModel(rootParams) {
    ko.utils.extend(this, rootParams.rootModel);
    var self = this,
      array, obj, dual = false;
    self.transactionType = ko.observable();
    self.componentIdentifier = self.identifier;
    self.typeOfTransaction = ko.observable("");
    self.wallet = ResourceBundle.wallet;
    self.validationTracker = ko.observable();
    self.dateRange = ko.observable(false);
    if (self.componentIdentifier === "unclaimedFunds") {
      self.baseurl = "wallets/{walletId}/claims";
      rootParams.dashboard.headerName(self.wallet.activity.unclaimedfunds);
      self.typeOfTransaction(self.wallet.activity.unclaimedlabel);
      self.type = ko.observable("ALL");
    } else if (self.componentIdentifier === "requestFunds") {
      self.baseurl = "wallets/{walletId}/requests";
      rootParams.dashboard.headerName(self.wallet.activity.requestfunds);
      self.typeOfTransaction(self.wallet.activity.requestfundslabel);
      self.type = ko.observable("AL");
    } else {
      self.componentIdentifier = "activity";
      self.baseurl = "wallets/{walletId}/transactions";
      rootParams.dashboard.headerName(self.wallet.activity.activity);
      self.typeOfTransaction(self.wallet.activity.activitylabel);
      self.type = ko.observable("A");
    }
    self.detailsFetched = ko.observable(false);
    self.dateSweep = ko.observable();
    self.searchCriteria = ko.observable("LNT");
    self.fromDateSelected = ko.observable();
    self.toDateSelected = ko.observable();
    self.transactionUrl = ko.observable();
    self.sortedTransactionArray = ko.observableArray([]);
    self.currentNavArrowPlacement = ko.observable("adjacent");
    self.currentNavArrowVisibility = ko.observable("auto");
    self.dataPresent = ko.observable(false);
    self.dataJson = ko.observable();
    self.showBalanceInfo(true);
    self.todayDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));
    rootParams.baseModel.registerElement("date-box");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerElement("row");
    self.showFilterDialog = function() {
      $("#filterCriteriaSelectionDialog").trigger("openModal");
    };
    activityModel.init(rootParams.dashboard.dataToBePassed().walletId.value);
    self.activityData = ko.observable();
    self.fireTransactionsRest = function(url) {
      self.detailsFetched(false);
      dual = true;
      activityModel.fetchTransactions(url).done(function(data) {
        if (self.componentIdentifier === "unclaimedFunds") {
          self.activityData(data.responseDTO);
        } else if (self.componentIdentifier === "requestFunds") {
          self.activityData(data.responseDTO);
        } else {
          self.activityData(data.walletFinancialStatementItemDTOs);
        }
        array = $.map(self.activityData(), function(u) {
          if (self.componentIdentifier === "unclaimedFunds" || self.componentIdentifier === "activity") {
            obj = {
              "transactionDate": u.transactionDate ? u.transactionDate : u.creationDate ? u.creationDate : "",
              "txnRefNumber": u.txnRefNumber ? u.txnRefNumber : u.hostRefNo ? u.hostRefNo : "-",
              "comments": u.comments ? u.comments : "-",
              "name": u.name ? u.name : u.transferMode === "EMAIL" ? u.emailId : u.mobileNo,
              "amountInTransactionCurrency": u.amountInTransactionCurrency ? u.amountInTransactionCurrency : u.amount,
              "transactionType": u.transactionType ? u.transactionType : "-",
              "status": u.earmarkStatus ? u.earmarkStatus : "-"
            };
          } else if (self.componentIdentifier === "requestFunds") {
            obj = {
              "transactionDate": u.timestamp ? u.timestamp : "",
              "comments": u.comments ? u.comments : "-",
              "name": u.payeeDetails ? u.payeeDetails : "-",
              "amountInTransactionCurrency": u.amount ? u.amount : "-",
              "status": u.requestStatus ? u.requestStatus : "-"
            };
          }
          return obj;
        });
        array.sort(function(a, b) {
          a = new Date(a.transactionDate);
          b = new Date(b.transactionDate);
          return a < b ? 1 : a > b ? -1 : 0;
        });
        self.dataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(array), {
          idAttribute: "date"
        });
        self.detailsFetched(true);
        dual = false;
      });
    };
    if (self.componentIdentifier === "unclaimedFunds") {
      self.fireTransactionsRest(self.baseurl + "?noOfTransactions=10");
    } else if (self.componentIdentifier === "requestFunds") {
      self.fireTransactionsRest(self.baseurl + "?noOfTransactions=6");
    } else {
      self.fireTransactionsRest(self.baseurl + "?noOfTransactions=10");
    }
    self.optionChangedHandler = function(event) {
      if (event.detail.value && !dual) {
        self.formURL(rootParams.baseModel.getDropDownValue(self.searchCriteria()), rootParams.baseModel.getDropDownValue(self.type()));
      }
    };
    self.filterTransaction = function(searchBy, type) {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      $("#filterCriteriaSelectionDialog").hide();
      self.formURL(searchBy, type);
    };
    self.toggleDateRange = function(event) {
      if (event.detail.value) {
        if (self.searchCriteria() === "SPD") {
          self.dateRange(true);
        } else if (self.searchCriteria() === "LNT") {
          self.dateRange(false);
          self.fromDateSelected(null);
          self.toDateSelected(null);
        }
      }
    };
    self.formURL = function(searchBy, type) {
      if (searchBy === "LNT") {
        self.dateRange(false);
        self.fromDateSelected(null);
        self.toDateSelected(null);
        if (type === "A") {
          self.url = self.baseurl + "?noOfTransactions=10&transactionType=A";
        } else if (type === "D") {
          self.url = self.baseurl + "?noOfTransactions=10&transactionType=D";
        } else if (type === "C") {
          self.url = self.baseurl + "?noOfTransactions=10&transactionType=C";
        } else if (type === "ALL") {
          self.url = self.baseurl + "?noOfTransactions=10";
        } else if (type === "P") {
          self.url = self.baseurl + "?noOfTransactions=10&claimStatus=Active";
        } else if (type === "E") {
          self.url = self.baseurl + "?noOfTransactions=10&claimStatus=Expired";
        } else if (type === "AL") {
          self.url = self.baseurl + "?noOfTransactions=10";
        } else if (type === "DEC") {
          self.url = self.baseurl + "?noOfTransactions=10&requestStatus=DEC";
        } else if (type === "SNT") {
          self.url = self.baseurl + "?noOfTransactions=10&requestStatus=SNT";
        }
        self.fireTransactionsRest(self.url);
      } else if (searchBy === "SPD") {
        if (type === "A") {
          self.dateRange(true);
          if (!rootParams.baseModel.large()) {
            self.url = self.baseurl + "?fromDate=" + self.fromDateSelected() + "&toDate=" + self.toDateSelected() + "&transactionType=" + rootParams.baseModel.getDropDownValue(self.type());
            self.fireTransactionsRest(self.url);
          } else {
            dual = true;
          }
        } else if (type === "D") {
          self.dateRange(true);
          if (!rootParams.baseModel.large()) {
            self.url = self.baseurl + "?fromDate=" + self.fromDateSelected() + "&toDate=" + self.toDateSelected() + "&transactionType=" + rootParams.baseModel.getDropDownValue(self.type());
            self.fireTransactionsRest(self.url);
          } else {
            dual = true;
          }
        } else if (type === "C") {
          self.dateRange(true);
          if (!rootParams.baseModel.large()) {
            self.url = self.baseurl + "?fromDate=" + self.fromDateSelected() + "&toDate=" + self.toDateSelected() + "&transactionType=" + rootParams.baseModel.getDropDownValue(self.type());
            self.fireTransactionsRest(self.url);
          } else {
            dual = true;
          }
        } else if (type === "ALL") {
          self.dateRange(true);
          if (!rootParams.baseModel.large()) {
            self.url = self.baseurl + "?fromDate=" + self.fromDateSelected() + "&toDate=" + self.toDateSelected() + "&claimStatus=" + rootParams.baseModel.getDropDownValue(self.type());
            self.fireTransactionsRest(self.url);
          } else {
            dual = true;
          }
        } else if (type === "P") {
          self.dateRange(true);
          if (!rootParams.baseModel.large()) {
            self.url = self.baseurl + "?fromDate=" + self.fromDateSelected() + "&toDate=" + self.toDateSelected() + "&claimStatus=" + rootParams.baseModel.getDropDownValue(self.type());
            self.fireTransactionsRest(self.url);
          } else {
            dual = true;
          }
        } else if (type === "E") {
          self.dateRange(true);
          if (!rootParams.baseModel.large()) {
            self.url = self.baseurl + "?fromDate=" + self.fromDateSelected() + "&toDate=" + self.toDateSelected() + "&claimStatus=" + rootParams.baseModel.getDropDownValue(self.type());
            self.fireTransactionsRest(self.url);
          } else {
            dual = true;
          }
        } else if (type === "AL") {
          self.dateRange(true);
          if (!rootParams.baseModel.large()) {
            self.url = self.baseurl + "?fromDate=" + self.fromDateSelected() + "&toDate=" + self.toDateSelected() + "&requestStatus=" + rootParams.baseModel.getDropDownValue(self.type());
            self.fireTransactionsRest(self.url);
          } else {
            dual = true;
          }
        } else if (type === "DEC") {
          self.dateRange(true);
          if (!rootParams.baseModel.large()) {
            self.url = self.baseurl + "?fromDate=" + self.fromDateSelected() + "&toDate=" + self.toDateSelected() + "&requestStatus=" + rootParams.baseModel.getDropDownValue(self.type());
            self.fireTransactionsRest(self.url);
          } else {
            dual = true;
          }
        } else if (type === "SNT") {
          self.dateRange(true);
          if (!rootParams.baseModel.large()) {
            self.url = self.baseurl + "?fromDate=" + self.fromDateSelected() + "&toDate=" + self.toDateSelected() + "&requestStatus=" + rootParams.baseModel.getDropDownValue(self.type());
            self.fireTransactionsRest(self.url);
          } else {
            dual = true;
          }
        }
      }
    };
    self.selectedDateRange = ko.computed(function() {
      if (self.fromDateSelected() !== null && self.toDateSelected() !== null) {
        if (rootParams.baseModel.getDropDownValue(self.type()) === "C" || rootParams.baseModel.getDropDownValue(self.type()) === "D" || rootParams.baseModel.getDropDownValue(self.type()) === "A") {
          self.url = self.baseurl + "?fromDate=" + self.fromDateSelected() + "&toDate=" + self.toDateSelected() + "&transactionType=" + rootParams.baseModel.getDropDownValue(self.type());
        } else if (rootParams.baseModel.getDropDownValue(self.type()) === "ALL" || rootParams.baseModel.getDropDownValue(self.type()) === "AL") {
          self.url = self.baseurl + "?fromDate=" + self.fromDateSelected() + "&toDate=" + self.toDateSelected();
        } else if (rootParams.baseModel.getDropDownValue(self.type()) === "P") {
          self.url = self.baseurl + "?fromDate=" + self.fromDateSelected() + "&toDate=" + self.toDateSelected() + "&claimStatus=Active";
        } else if (rootParams.baseModel.getDropDownValue(self.type()) === "E") {
          self.url = self.baseurl + "?fromDate=" + self.fromDateSelected() + "&toDate=" + self.toDateSelected() + "&claimStatus=Expired";
        } else if (rootParams.baseModel.getDropDownValue(self.type()) === "DEC" || rootParams.baseModel.getDropDownValue(self.type()) === "SNT") {
          self.url = self.baseurl + "?fromDate=" + self.fromDateSelected() + "&toDate=" + self.toDateSelected() + "&requestStatus=" + rootParams.baseModel.getDropDownValue(self.type());
        }
        if (rootParams.baseModel.large()) {
          self.fireTransactionsRest(self.url);
        }
      }
    });
    self.sortByDate = function() {
      self.detailsFetched(false);
      if ($("#sortButton").hasClass("icon-sort")) {
        $("#sortButton").removeClass("icon-sort").addClass("icon-sort-asc");
        self.activityData().sort(function(a, b) {
          a = new Date(a.transactionDate);
          b = new Date(b.transactionDate);
          return a > b ? 1 : a < b ? -1 : 0;
        });
        self.dataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.activityData()), {
          idAttribute: "date"
        });
      } else if ($("#sortButton").hasClass("icon-sort-asc")) {
        $("#sortButton").removeClass("icon-sort-asc").addClass("icon-sort-desc");
        self.activityData().sort(function(a, b) {
          a = new Date(a.transactionDate);
          b = new Date(b.transactionDate);
          return a < b ? 1 : a > b ? -1 : 0;
        });
        self.dataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.activityData()), {
          idAttribute: "date"
        });
      } else if ($("#sortButton").hasClass("icon-sort-desc")) {
        $("#sortButton").removeClass("icon-sort-desc").addClass("icon-sort-asc");
        self.activityData().sort(function(a, b) {
          a = new Date(a.transactionDate);
          b = new Date(b.transactionDate);
          return a > b ? 1 : a < b ? -1 : 0;
        });
        self.dataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.activityData()), {
          idAttribute: "date"
        });
      }
      self.detailsFetched(true);

    };
  };
  vm.prototype.dispose = function() {
    this.selectedDateRange.dispose();
  };
  return vm;
});