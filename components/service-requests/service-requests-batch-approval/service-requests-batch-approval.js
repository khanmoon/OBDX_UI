define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/service-requests-configuration",
  "./model",
  "jqueryui-amd/widgets/sortable",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojpagingcontrol",
  "ojs/ojselectcombobox",
  "ojs/ojtable",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function(oj, ko, $, BaseLogger, constants, ResourceBundle, ServiceRequestsListModel) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.model = Params.model;
    self.validationTracker = ko.observable();
    self.resource = ResourceBundle;
    Params.dashboard.headerName(self.resource.serviceRequest.header);
    self.natureOfTask = ko.observable();
    self.remarks = ko.observable();
    self.transactions = ko.observableArray([]);
    self.successfulTransactions = ko.observable(0);
    self.erroneousTransaction = ko.observable(0);
    self.successfulTransactionsCounter = 0;
    self.erroneousTransactionCounter = 0;
    self.transactionSuccess = ko.observable(false);
    if (self.showApprovalButtonset && !self.backFromDetails) {
      self.transactions()[0] = self.serviceRequest ? JSON.parse(JSON.stringify(self.serviceRequest())) : null;
    }
    self.disableApproveRejectButton = ko.observable(true);
    self.showModal = ko.observable(false);
    Params.baseModel.registerComponent("service-requests-detail", "service-requests");
    Params.baseModel.registerElement("confirm-screen");
    self.showModalWindow = function(nature) {
      self.natureOfTask(nature);
      self.remarks("");
      if (!self.showApprovalButtonset || (self.showApprovalButtonset && self.backFromDetails)) {
        self.transactions($("input[name*=selection]:checked").map(function() {
          return this.value;
        }).get());
      }
      if (self.transactions().length === 0) {
        return;
      }
      self.showModal(true);
      $("#otherTransactionsApproval").trigger("openModal", "textarea");
    };
    $(document).off("keyup", "#remarksBox");
    $(document).on("keyup", "#remarksBox", function() {
      if ($("#remarksBox").val().length > 0) {
        self.disableApproveRejectButton(false);
      } else {
        self.disableApproveRejectButton(true);
      }
    });
    self.submit = function() {
      if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      self.erroneousTransaction(0);
      self.successfulTransactions(0);
      self.transactionSuccess(false);
      $("#otherTransactionsApproval").hide().trigger("closeModal");
      for (var i = 0; i < self.transactions().length; i++) {
        self.fireTransactions(self.transactions()[i], true);
      }
    };
    self.close = function() {
      self.erroneousTransaction(0);
      self.successfulTransactions(0);
      self.transactionSuccess(false);
    };
    self.fireTransactions = function(id) {
      var status = "";
      if (self.natureOfTask() === "approve") {
        self.approvalStatus = "CO";
        status = "CO";
      } else if (self.natureOfTask() === "reject") {
        status = "RE";
        self.approvalStatus = "RE";
      }
      ServiceRequestsListModel.approveRejectSR(id, self.remarks(), status).done(function(data, status, jqXhr) {
        self.successfulTransactionsCounter += 1;
        self.transactionCompleted(jqXhr);
      }).fail(function(jqXhr) {
        self.erroneousTransactionCounter += 1;
        self.transactionCompleted(jqXhr);
      });
    };
    self.transactionCompleted = function(jqXhr) {
      if (self.erroneousTransactionCounter + self.successfulTransactionsCounter === self.transactions().length) {
        if (self.showApprovalButtonset && !self.backFromDetails) {
          self.backFromDetails = ko.observable(true);
          Params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            srNo: self.serviceRequest(),
            transactionName: self.resource.serviceRequest.header,
            transactionStatus: self.resource.serviceRequest.status[self.approvalStatus]
          }, self);
        } else {
          self.erroneousTransaction(self.erroneousTransaction() + self.erroneousTransactionCounter);
          self.successfulTransactions(self.successfulTransactions() + self.successfulTransactionsCounter);
          self.transactionSuccess(true);
          self.erroneousTransactionCounter = 0;
          self.successfulTransactionsCounter = 0;
          self.search();
        }
      }
    };
  };
});
