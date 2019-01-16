define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/transaction-group",
  "ojs/ojinputtext",
  "ojs/ojknockout",
  "ojs/ojknockout-validation",
  "ojs/ojlistview",
  "ojs/ojarraytabledatasource",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, TransactionGroupUpdateModel, Constants, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerComponent("review-transaction-group-update", "transaction-group");
    rootParams.dashboard.headerName(self.nls.headers.transactiongroupheader);
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerElement("action-header");
    self.updateReviewFlag = ko.observable(false);
    self.groupValid = ko.observable();
    self.updateConfirmFlag = ko.observable(false);
    self.transactionGroupCode = rootParams.rootModel.readtransactionGroupCode;
    self.transactionGroupDesc = rootParams.rootModel.readtransactionGroupDesc;
    self.transactionName = ko.observable(self.nls.headers.transactiongroupheader);
    self.validationTracker = ko.observable();
    self.transactionStatus = ko.observable();
    self.httpStatus = ko.observable();
    self.selectedTransactionGroupValues = ko.observableArray();
    rootParams.baseModel.registerComponent("transaction-group-read", "transaction-group");
    self.tempArray = ko.observableArray();

    for (var i = 0; i < rootParams.rootModel.transactionList().length; i++) {
      self.selectedTransactionGroupValues.push(rootParams.rootModel.transactionList()[i].name);
    }

    self.transactionList = ko.observableArray();
    self.showTransactionList = ko.observable(false);

    self.cancel = function() {
      rootParams.dashboard.openDashBoard(self.nls.common.confirmationMessage);
    };

    self.back = function() {
      history.back();
    };

    self.backOnUpdateReview = function() {
      self.updateReviewFlag(false);
    };

    self.updateTransactionGroup = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      var data = {
        "description": self.transactionGroupDesc(),
        "id": self.transactionGroupId(),
        "name": self.transactionGroupCode(),
        "taskDTOs": [],
        "taskAspect": "limit",
        "version": self.transactionGroupVersion()
      };

      self.setTaskList(data);
      var promise = TransactionGroupUpdateModel.updateTransactionGroup(ko.toJSON(data), self.transactionGroupId());
      promise.done(function(data, status, jqXhr) {
        self.updateReviewFlag(false);
        self.httpStatus(jqXhr.status);
        self.transactionStatus(data);
        self.updateConfirmFlag(true);
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.transactionName()
        }, self);
      });

    };

    self.updateReviewTransactionGroup = function() {
      var tracker = document.getElementById("tracker");
      if (tracker.valid === "valid") {
        var data = {
          "description": self.transactionGroupDesc(),
          "id": self.transactionGroupId(),
          "name": self.transactionGroupCode(),
          "taskDTOs": [],
          "taskAspect": "limit",
          "version": self.transactionGroupVersion(),
          "selectedTransactionGroupValues": self.selectedTransactionGroupValues()

        };

        self.setTaskList(data);
        $.extend(self.params, {
          reviewData: data
        });
        self.updateReviewFlag(true);
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.setTaskList = function(data) {
      data.taskDTOs = [];
      self.tempArray.removeAll();

      for (var i = 0; i < self.selectedTransactionGroupValues().length; i++) {
        for (var m = 0; m < self.transactionList().length; m++) {
          if (self.transactionList()[m].name === self.selectedTransactionGroupValues()[i]) {
            self.tempArray.push(self.transactionList()[m].id);
            break;
          }
        }
      }

      for (var j = 0; j < self.tempArray().length; j++) {
        data.taskDTOs.push({
          id: self.tempArray()[j]
        });
      }
    };

    var promise1 = TransactionGroupUpdateModel.fetchTransactionList();
    promise1.then(function(data) {
      self.transactionList(data.taskList);
      self.showTransactionList(true);
    });

  };
});
