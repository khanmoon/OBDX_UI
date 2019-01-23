define([
  "knockout",
  "jquery",

  "./model",
  "ojL10n!resources/nls/batch-process-approvals",
  "ojs/ojbutton",
  "ojs/ojinputtext"
], function (ko, $, BatchProcessApprovalModel, resourceBundle) {
  "use strict";
  var vm = function (rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerElement("confirm-screen");
    self.toShow = ko.observable(self.forceShow ? self.forceShow() : false);
    self.hostReferenceNumber = ko.observable();
    self.transactions = ko.observableArray();
    self.natureOfTask = ko.observable();
    self.remarks = ko.observable();
    self.transactionSuccess = ko.observable(false);
    self.responseData = ko.observable();
    self.successfulTransactions = ko.observable(0);
    self.erroneousTransaction = ko.observable(0);
    self.typeOfTransaction = ko.observable();
    self.transactionTaskCode = ko.observable();
    self.graceFlag = ko.observable(false);
    self.graceWindow = ko.observable(false);
    self.referenceIDs = ko.observableArray();
    self.showModalWindow = function (nature) {
      self.natureOfTask(nature);
      self.remarks("");
      self.transactions($("input[name=selection]:checked").map(function () {
        return this.value;
      }).get());
      self.typeOfTransaction(self.nls.batchProcessApprovals[self.loadModule().toUpperCase().replace(/\-/g, "_")]);
      self.referenceIDs([]);
      if (self.transactionList().length) {
        for (var i = 0; i < self.transactions().length; i++) {
          for (var j = 0; j < self.transactionList().length; j++) {
            if (self.transactionList()[j].transactionId === self.transactions()[i] && self.transactionList()[j].maxApprovalDate !== null && self.transactionList()[j].maxApprovalDate) {
              self.graceFlag(true);
              self.referenceIDs.push(self.transactions()[i]);
              break;
            }
          }
        }
        if (self.transactions().length === 0 && self.transactionDetails().maxApprovalDate !== null && self.transactionDetails().maxApprovalDate) {
          self.referenceIDs.push(self.transactionDetails().transactionId);
          self.graceFlag(true);
        }

        if (nature === "approve" && self.graceFlag() && self.referenceIDs().length) {
          self.graceWindow(true);
          $("#graceTransactionsApproval").trigger("openModal", "textarea");
        } else {
          $("#otherTransactionsApproval").trigger("openModal", "textarea");
          self.graceWindow(false);
          self.graceFlag(false);
        }

      }

    };
    self.closeGraceModel = function () {
      self.graceFlag(false);
      $("#graceTransactionsApproval").hide().trigger("closeModal");
    };
    self.ok = function () {
      self.graceFlag(false);
      self.graceWindow(false);
      $("#graceTransactionsApproval").hide().trigger("closeModal");
      $("#otherTransactionsApproval").trigger("openModal", "textarea");
      self.referenceIDs([]);
    };

    self.submit = function () {
      var resolvedDeferred = $.Deferred();
      resolvedDeferred.resolve();
      $("#otherTransactionsApproval").hide().trigger("closeModal");
      if (self.forceShow && self.forceShow()) {
        self.fireTransactions(self.transactionId, false);
      } else {
        self.transactions().reduce(function (lastTxn, currentTxn) {
          return lastTxn.then(function () {
            return self.fireTransactions(currentTxn, true);
          });
        }, resolvedDeferred);
      }
    };

    self.close = function () {
      self.toShow(false);
      self.referenceIDs([]);
      self.graceWindow(false);
      self.transactionSuccess(false);
    };

    self.loadModuleSubscription = null;

    if (self.loadModule) {
      self.loadModuleSubscription = self.loadModule.subscribe(function () {
        self.toShow(false);
        self.transactionSuccess(false);
      });
    }

    /*
     *This function sets host reference number in case it is set any path otehr than processingDetails
     */
    self.setCustomHostRefNo = function (response, customHostReferenceNumberPath) {
      var xpath = customHostReferenceNumberPath.split(".");
      var hostReferenceNumber = response;
      for (var i = 0; i < xpath.length; i++) {
        hostReferenceNumber = hostReferenceNumber[xpath[i]];
      }
      return hostReferenceNumber;
    };
    self.fireTransactions = function (id, ignore2FA) {
      return BatchProcessApprovalModel.respondApprovalRequest(id, self.remarks(), self.natureOfTask(), ignore2FA).done(function (data, status, jqXhr) {
        self.responseData(data.transactionAction);
        self.transactionTaskCode(data.transactionAction.transactionDTO.taskDTO.id);
        if (self.responseData().transactionDTO.processingDetails.status === "F" && self.responseData().transactionDTO.processingDetails.currentStep === "exec") {
          self.erroneousTransaction(self.erroneousTransaction() + 1);
        } else if (self.responseData().transactionDTO.processingDetails.currentStep === "exec") {
          if (self.taskForApproval && self.taskForApproval.initComponent.hostReferenceNumber) {
            self.hostReferenceNumber(self.setCustomHostRefNo(data, self.taskForApproval.initComponent.hostReferenceNumber));
          } else if (data.transactionAction.transactionDTO.processingDetails && data.transactionAction.transactionDTO.processingDetails.referenceNumber) {
            self.hostReferenceNumber(data.transactionAction.transactionDTO.processingDetails.referenceNumber);
          }
          self.successfulTransactions(self.successfulTransactions() + 1);
        } else {
          self.successfulTransactions(self.successfulTransactions() + 1);
        }
        if (self.hideOnSuccess) {
          self.hideOnSuccess(false);
        }
        self.toShow(false);
        self.transactionCompleted(jqXhr);
      }).fail(function (jqXhr) {
        self.erroneousTransaction(self.erroneousTransaction() + 1);
        self.transactionCompleted(jqXhr);
      });
    };

    self.transactionCompleted = function (jqXhr) {
      self.transactionSuccess(true);
      if (self.forceShow && self.forceShow()) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.params.type,
          hostReferenceNumber: self.hostReferenceNumber(),
          imageType: self.responseData() && self.responseData().transactionDTO.processingDetails.status === "F" && self.responseData().transactionDTO.processingDetails.currentStep === "exec" ? "reject" : self.responseData() ? null : "reject",
          confirmScreenExtensions: self.confirmScreenExtensions
        }, self);
      }
      $("input[name^=\"selection\"]").prop("checked", false);
      if ((!self.forceShow || !self.forceShow()) && (self.erroneousTransaction() + self.successfulTransactions() === self.transactions().length)) {
        self.fetchCount(self.loadModule().toUpperCase().replace(/\-/g, "_") + "_PENDING");
        self.refreshTable(self.loadModule().toUpperCase().replace(/\-/g, "_") + "_PENDING");
      }
    };
    $(document).ready(function () {
      $(document).on("change", "input[name=selection]", function () {
        self.toShow(!!$("input[name=selection]:checked").length);
        self.successfulTransactions(0);
        self.erroneousTransaction(0);
        $("input[name=selectionParent]").prop("checked", $("input[name=selection]:checked").length === $("input[name=selection]").length);
        self.transactionSuccess(false);
      });
      $(document).on("change", "input[name=selectionParent]", function () {
        $("input[name=selection]").prop("checked", $("input[name=selectionParent]").prop("checked"));
        self.successfulTransactions(0);
        self.erroneousTransaction(0);
        self.toShow(!!$("input[name=selection]").length && !!$("input[name=selectionParent]").prop("checked"));
        self.transactionSuccess(false);
      });
      $(document).on("ojready", "table#table", function () {
        $("input[name^=\"selection\"]").prop("checked", false);
      });
    });
  };
  vm.prototype.dispose = function () {
    if (this.loadModuleSubscription) this.loadModuleSubscription.dispose();
  };
  return vm;
});