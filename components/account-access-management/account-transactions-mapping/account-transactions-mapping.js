define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/access-management",
  "ojs/ojinputtext",
  "ojs/ojpopup",
  "ojs/ojradioset",
  "ojs/ojselectcombobox",
  "ojs/ojtable",
  "ojs/ojrowexpander",
  "ojs/ojflattenedtreedatagriddatasource",
  "ojs/ojjsontreedatasource",
  "ojs/ojflattenedtreetabledatasource"
], function(oj, ko, $, TransactionMappingModel, BaseLogger, constants, resourceBundle) {
  "use strict";
  return function viewModel(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    $("#tabGroups-select").css("display", "block");
    self.highlightedTabTrans("CASA");
    if (self.accessLevel() === "PARTY" || self.accessLevel() === "LINKAGE") {
      rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, {
        user: self.nls.navLabels.PartyLevel_title
      }));
    } else if (self.accessLevel() === "USER" || self.accessLevel() === "USERLINKAGE") {
      rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, {
        user: self.nls.navLabels.UserLevel_title
      }));
    }
    self.ok = function() {
      window.location = "account-access-management.html";
    };
    var getNewKoModel = function() {
      var KoModel = TransactionMappingModel.getNewModel();
      return ko.mapping.fromJS(KoModel);
    };
    self.rootModelInstance = getNewKoModel();
    self.showReviewScreen = ko.observable(false);
    self.reloadCasaTable = ko.observable(false);
    self.reloadTDTable = ko.observable(false);
    self.reloadLoanTable = ko.observable(false);
    self.mapAllTransactionsToAllAccountCasa = ko.observable(false);
    self.mapAllTransactionsToAllAccountTrd = ko.observable(false);
    self.mapAllTransactionsToAllAccountLon = ko.observable(false);
    self.mapAllTransactionsCasaFlag = ko.observableArray();
    self.mapAllTransactionsTdFlag = ko.observableArray();
    self.mapAllTransactionsLonFlag = ko.observableArray();
    self.fullCasaAccountListSorted = ko.observable([]);
    self.fulltdAccountListSorted = ko.observable([]);
    self.fullloanAccountListSorted = ko.observable([]);
    self.casaMapAllTransactionIndicatorArray = ko.observableArray();
    self.trdMapAllTransactionIndicatorArray = ko.observableArray();
    self.loanMapAllTransactionIndicatorArray = ko.observableArray();
    self.tmpTransactionCodeArray = ko.observableArray();
    self.tmpTransactionCodeTrdArray = ko.observableArray();
    self.tmpTransactionCodeLonArray = ko.observableArray();
    self.showTransactionMsg = ko.observable(true);
    self.closeDisclaimerMsg = ko.observable(false);
    self.activateTab = function() {
      $("#tabs-container-select #tabGroups-select").ojTabs({
        "selected": self.highlightedTabTrans()
      });
    };
    self.tabLists = ko.observableArray([{
        id: "CASA",
        text: self.nls.navLabels.CASA,
        template: "casa-transaction-access"
      },
      {
        id: "TRD",
        text: self.nls.navLabels.TD,
        template: "td-transaction-access"
      },
      {
        id: "LON",
        text: self.nls.navLabels.Loans,
        template: "loan-transaction-access"
      }
    ]);
    ko.utils.arrayForEach(self.selectedCasaAccounts(), function(item) {
      self.taskCodeObj = {
        accountNumber: "",
        taskIds: []
      };
      self.taskCodeObj.accountNumber = item;
      self.taskCodeObj.taskIds = [];
      self.tmpTransactionCodeArray.push(self.taskCodeObj);
    });
    ko.utils.arrayForEach(self.selectedTdAccounts(), function(item) {
      self.taskCodeObj = {
        accountNumber: "",
        taskIds: []
      };
      self.taskCodeObj.accountNumber = item;
      self.taskCodeObj.taskIds = [];
      self.tmpTransactionCodeTrdArray.push(self.taskCodeObj);
    });
    ko.utils.arrayForEach(self.selectedLoanAccounts(), function(item) {
      self.taskCodeObj = {
        accountNumber: "",
        taskIds: []
      };
      self.taskCodeObj.accountNumber = item;
      self.taskCodeObj.taskIds = [];
      self.tmpTransactionCodeLonArray.push(self.taskCodeObj);
    });
    self.casaMapAllTransactionIndicatorArray.subscribe(function(newSelectedArray) {
      if (newSelectedArray.length === self.selectedCasaAccounts().length) {
        self.mapAllTransactionsCasaFlag(["MAP_ALL"]);
      } else {
        self.mapAllTransactionsCasaFlag.removeAll();
      }
    });
    self.trdMapAllTransactionIndicatorArray.subscribe(function(newSelectedArray) {
      if (newSelectedArray.length === self.selectedTdAccounts().length) {
        self.mapAllTransactionsTdFlag.push("MAP_ALL");
      } else {
        self.mapAllTransactionsTdFlag.removeAll();
      }
    });
    self.loanMapAllTransactionIndicatorArray.subscribe(function(newSelectedArray) {
      if (newSelectedArray.length === self.selectedLoanAccounts().length) {
        self.mapAllTransactionsLonFlag.push("MAP_ALL");
      } else {
        self.mapAllTransactionsLonFlag.removeAll();
      }
    });


    self.cancel = function() {
      rootParams.dashboard.openDashBoard(self.nls.common.cancelConfirm);
    };
    rootParams.baseModel.registerElement("confirm-screen");
    $(window).scroll(function() {
      if ($(document).scrollTop() >= $(document).height() / 10)
        $("#disclaimer-container").fadeIn("slow");
      else
        $("#disclaimer-container").fadeOut("slow");
    });
    self.closeSPopup = function() {
      self.closeDisclaimerMsg(true);
      $("#disclaimer-container").fadeOut("slow");
    };
    if (self.highlightedTabTrans() === "CASA" || self.highlightedTabTrans() === undefined) {
      self.casaTransactionTabVisited(true);
    } else if (self.highlightedTabTrans() === "TRD") {
      self.tdTransactionTabVisited(true);
    } else if (self.highlightedTabTrans() === "LON") {
      self.loanTransactionTabVisited(true);
    }
    self.selectedTaskTabChangeHandler = function(event) {
      if (event.detail.value === 0) {
        self.casaTransactionTabVisited(true);
        self.highlightedTabTrans("CASA");
        self.closeDisclaimerMsg(false);
      }
      if (event.detail.value === 1) {
        self.tdTransactionTabVisited(true);
        self.highlightedTabTrans("TRD");
        self.closeDisclaimerMsg(false);
      }
      if (event.detail.value === 2) {
        self.loanTransactionTabVisited(true);
        self.highlightedTabTrans("LON");
        self.closeDisclaimerMsg(false);
      }
    };
    self.showReview = function() {
      self.showReviewScreen(true);
      self.showEditableForm(true);
    };
    if (self.fullCasaAccountList().length > 0) {
      self.selectedCasaAccounts().sort(function(left, right) {
        return left.value === right.value ? 0 : left.value < right.value ? -1 : 1;
      });
      self.fullCasaAccountList().sort(function(left, right) {
        return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
      });
      for (var i = 0; i < self.selectedCasaAccounts().length; i++) {
        ko.utils.arrayForEach(self.fullCasaAccountList(), function(item) {
          if (item.accountNumber.value === self.selectedCasaAccounts()[i]) {
            if (!(self.fullCasaAccountListSorted().filter(function(e) {
                return e.accountNumber.value === self.selectedCasaAccounts()[i];
              }).length > 0)) {
              if (item.accountStatus === "ACTIVE")
                self.fullCasaAccountListSorted().push(item);
            }
          }
        });
      }
      self.fullCasaAccountListSorted().sort(function(left, right) {
        return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
      });
      self.fullCasaAccountListSorted().sort(function(left, right) {
        return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
      });
      ko.utils.arrayForEach(self.fullCasaAccountList(), function(item) {
        if (self.selectedCasaAccounts().indexOf(item.accountNumber.value) === -1) {
          if (item.accountStatus === "ACTIVE")
            self.fullCasaAccountListSorted().push(item);
        }
      });
      ko.utils.arrayForEach(self.fullCasaAccountList(), function(item) {
        if (self.selectedCasaAccounts().indexOf(item.accountNumber.value) === -1) {
          if (item.accountStatus !== "ACTIVE")
            self.fullCasaAccountListSorted().push(item);
        }
      });
      self.fullCasaAccountList([]);
      ko.utils.arrayForEach(self.fullCasaAccountListSorted(), function(item) {
        self.fullCasaAccountList().push(item);
      });
      self.fullCasaAccountListSorted([]);
      self.casaData = $.map(ko.utils.unwrapObservable(self.fullCasaAccountList()), function(val) {
        val.attr = {
          accountNumber: {
            displayValue: val.accountNumber.displayValue,
            value: val.accountNumber.value
          },
          accountStatus: val.accountStatus ? val.accountStatus : "-",
          displayName: val.displayName ? val.displayName : "-",
          accountID: val.accountNumber.displayValue,
          accountType: val.accountType,
          mappingPolicy: val.isAllowed,
          currency: val.currencyCode ? val.currencyCode : "-"
        };
        val.children = [{
          attr: {
            accountNumber: {
              displayValue: val.accountNumber.displayValue,
              value: val.accountNumber.value
            },
            accountStatus: val.accountStatus ? val.accountStatus : "-",
            displayName: val.displayName ? val.displayName : "-",
            selectedTask: val.selectedTask,
            nonSelectedTask: val.nonSelectedTask,
            accountType: val.accountType,
            resoureTaskList: val.resourceListCasa
          }
        }];
        return val;
      });
      self.casaTransactionDatasource = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.casaData)));
      self.reloadCasaTable(true);
    }
    if (self.fulltdAccountList().length > 0) {
      self.selectedTdAccounts().sort(function(left, right) {
        return left.value === right.value ? 0 : left.value < right.value ? -1 : 1;
      });
      self.fulltdAccountList().sort(function(left, right) {
        return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
      });
      var j;
      for (j = 0; j < self.selectedTdAccounts().length; j++) {
        ko.utils.arrayForEach(self.fulltdAccountList(), function(item) {
          if (item.accountNumber.value === self.selectedTdAccounts()[j]) {
            if (!(self.fulltdAccountListSorted().filter(function(e) {
                return e.accountNumber.value === self.selectedTdAccounts()[j];
              }).length > 0)) {
              if (item.accountStatus === "ACTIVE")
                self.fulltdAccountListSorted().push(item);
            }
          }
        });
      }
      self.fulltdAccountListSorted().sort(function(left, right) {
        return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
      });
      self.fulltdAccountListSorted().sort(function(left, right) {
        return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
      });
      for (j = 0; j < self.selectedTdAccounts().length; j++) {
        ko.utils.arrayForEach(self.fulltdAccountList(), function(item) {
          if (item.accountNumber.value === self.selectedTdAccounts()[j]) {
            if (!(self.fulltdAccountListSorted().filter(function(e) {
                return e.accountNumber.value === self.selectedTdAccounts()[j];
              }).length > 0)) {
              if (item.accountStatus !== "ACTIVE")
                self.fulltdAccountListSorted().push(item);
            }
          }
        });
      }
      ko.utils.arrayForEach(self.fulltdAccountList(), function(item) {
        if (self.selectedTdAccounts().indexOf(item.accountNumber.value) === -1) {
          if (item.accountStatus === "ACTIVE")
            self.fulltdAccountListSorted().push(item);
        }
      });
      ko.utils.arrayForEach(self.fulltdAccountList(), function(item) {
        if (self.selectedTdAccounts().indexOf(item.accountNumber.value) === -1) {
          if (item.accountStatus !== "ACTIVE")
            self.fulltdAccountListSorted().push(item);
        }
      });
      self.fulltdAccountList([]);
      ko.utils.arrayForEach(self.fulltdAccountListSorted(), function(item) {
        self.fulltdAccountList().push(item);
      });
      self.tdData = $.map(ko.utils.unwrapObservable(self.fulltdAccountList()), function(val) {
        val.attr = {
          accountNumber: {
            displayValue: val.accountNumber.displayValue,
            value: val.accountNumber.value
          },
          accountStatus: val.accountStatus ? val.accountStatus : "-",
          displayName: val.displayName ? val.displayName : "-",
          accountID: val.accountNumber.value,
          accountType: val.accountType,
          mappingPolicy: val.isAllowed,
          currency: val.currencyCode ? val.currencyCode : "-"
        };
        val.children = [{
          attr: {
            accountNumber: {
              displayValue: val.accountNumber.displayValue,
              value: val.accountNumber.value
            },
            accountStatus: val.accountStatus ? val.accountStatus : "-",
            displayName: val.displayName ? val.displayName : "-",
            selectedTask: val.selectedTask,
            nonSelectedTask: val.nonSelectedTask,
            accountType: val.accountType,
            resoureTaskList: val.resourceListTD
          }
        }];
        return val;
      });
      self.tdTransactionDatasource = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.tdData)));
      self.reloadTDTable(true);
    }
    if (self.fullloanAccountList().length > 0) {
      self.selectedLoanAccounts().sort(function(left, right) {
        return left.value === right.value ? 0 : left.value < right.value ? -1 : 1;
      });
      self.fullloanAccountList().sort(function(left, right) {
        return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
      });
      var k;
      for (k = 0; k < self.selectedLoanAccounts().length; k++) {
        ko.utils.arrayForEach(self.fullloanAccountList(), function(item) {
          if (item.accountNumber.value === self.selectedLoanAccounts()[k]) {
            if (!(self.fullloanAccountListSorted().filter(function(e) {
                return e.accountNumber.value === self.selectedLoanAccounts()[k];
              }).length > 0)) {
              if (item.accountStatus === "ACTIVE")
                self.fullloanAccountListSorted().push(item);
            }
          }
        });
      }
      self.fullloanAccountListSorted().sort(function(left, right) {
        return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
      });
      self.fullloanAccountListSorted().sort(function(left, right) {
        return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
      });
      for (k = 0; k < self.selectedLoanAccounts().length; k++) {
        ko.utils.arrayForEach(self.fullloanAccountList(), function(item) {
          if (item.accountNumber.value === self.selectedLoanAccounts()[k]) {
            if (!(self.fullloanAccountListSorted().filter(function(e) {
                return e.accountNumber.value === self.selectedLoanAccounts()[k];
              }).length > 0)) {
              if (item.accountStatus !== "ACTIVE")
                self.fullloanAccountListSorted().push(item);
            }
          }
        });
      }
      ko.utils.arrayForEach(self.fullloanAccountList(), function(item) {
        if (self.selectedLoanAccounts().indexOf(item.accountNumber.value) === -1) {
          if (item.accountStatus === "ACTIVE")
            self.fullloanAccountListSorted().push(item);
        }
      });
      ko.utils.arrayForEach(self.fullloanAccountList(), function(item) {
        if (self.selectedLoanAccounts().indexOf(item.accountNumber.value) === -1) {
          if (item.accountStatus !== "ACTIVE")
            self.fullloanAccountListSorted().push(item);
        }
      });
      self.fullloanAccountList([]);
      ko.utils.arrayForEach(self.fullloanAccountListSorted(), function(item) {
        self.fullloanAccountList().push(item);
      });
      self.loanData = $.map(ko.utils.unwrapObservable(self.fullloanAccountList()), function(val) {
        val.attr = {
          accountNumber: {
            displayValue: val.accountNumber.displayValue,
            value: val.accountNumber.value
          },
          accountStatus: val.accountStatus ? val.accountStatus : "-",
          displayName: val.displayName ? val.displayName : "-",
          accountID: val.accountNumber.value,
          accountType: val.accountType,
          mappingPolicy: val.isAllowed,
          currency: val.currencyCode ? val.currencyCode : "-"
        };
        val.children = [{
          attr: {
            accountNumber: {
              displayValue: val.accountNumber.displayValue,
              value: val.accountNumber.value
            },
            accountStatus: val.accountStatus ? val.accountStatus : "-",
            displayName: val.displayName ? val.displayName : "-",
            selectedTask: val.selectedTask,
            nonSelectedTask: val.nonSelectedTask,
            accountType: val.accountType,
            resoureTaskList: val.resourceListLON
          }
        }];
        return val;
      });
      self.loanTransactionDatasource = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.loanData)));
      self.reloadLoanTable(true);
    }
    self.setMapAllTransactionsToAllAccount = function(module) {
        if (module === "CASA") {
          self.mapAllTransactionsToAllAccountCasa(!self.mapAllTransactionsToAllAccountCasa());
          if (self.mapAllTransactionsToAllAccountCasa()) {
            self.mapAllTransactionsCasaFlag(["MAP_ALL"]);
            self.openRowExpander("CASA");
          } else {
            self.mapAllTransactionsCasaFlag.removeAll();
          }
        } else if (module === "LON") {
          self.mapAllTransactionsToAllAccountLon(!self.mapAllTransactionsToAllAccountLon());
          if (self.mapAllTransactionsToAllAccountLon()) {
            self.mapAllTransactionsLonFlag(["MAP_ALL"]);
            self.openRowExpander("LON");
          } else {
            self.mapAllTransactionsLonFlag.removeAll();
          }
        } else if (module === "TRD") {
          self.mapAllTransactionsToAllAccountTrd(!self.mapAllTransactionsToAllAccountTrd());
          if (self.mapAllTransactionsToAllAccountTrd()) {
            self.mapAllTransactionsTdFlag(["MAP_ALL"]);
            self.openRowExpander("TRD");
          } else {
            self.mapAllTransactionsTdFlag.removeAll();
          }
        }
    };
    self.openRowExpander = function(token) {
      var myTokenClass = "";
      if (token === "CASA") {
          myTokenClass = "casa-token";
      } else if (token === "LON") {
          myTokenClass = "lon-token";
      } else if (token === "TRD") {
          myTokenClass = "trd-token";
      }
      var a = $("." + myTokenClass + " div .oj-rowexpander-touch-area ").find("a");
      $(a).each(function() {
          if ($(this).attr("aria-expanded") === "false") {
              $(this).trigger("click");
          }
      });
    };
  };
});
