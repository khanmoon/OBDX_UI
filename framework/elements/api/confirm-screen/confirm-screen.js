define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/confirm-screen",
  "framework/js/constants/constants",
  "ojs/ojbutton"
], function (ko, $, ConfirmScreenModel, ResourceBundle, Constants) {
  "use strict";
  return function (rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.confirmScreenResources = ResourceBundle;
    self.constants = Constants;
    rootParams.dashboard.isConfirmScreenVisited(true);
    self.headerMessages = ko.observableArray();
    rootParams.baseModel.registerComponent("feedback-capture", "feedback");
    self.image = self.params.imageType || "confirm";
    rootParams.dashboard.backAllowed(false);
    self.enableEReceipt = ko.observable(false);
    self.reason = ko.observable();
    self.renderFeedbackModule = ko.observable(false);
    self.feedbackTemplateDTO = ko.observable();
    rootParams.baseModel.registerElement("action-header");
    self.transactionID = self.params.jqXHR.responseJSON.referenceNumber || self.params.jqXHR.responseJSON.status.referenceNumber;
    self.hostReferenceNumber = self.params.hostReferenceNumber;
    self.httpStatus = self.params.jqXHR.status;
    self.serviceNo = self.params.serviceNo ? self.params.serviceNo : null;
    self.srNo = self.params.srNo ? self.params.srNo : null;
    self.confirmScreenType = self.constants.userSegment === "RETAIL" ? "v1" : "v2";
    self.transactionName = self.params.transactionName;
    self.buttonTemplate = self.params.template;
    self.confirmScreenExtensions = self.params.confirmScreenExtensions && self.params.confirmScreenExtensions.isSet ? self.params.confirmScreenExtensions : null;
    self.enableEReceipt(self.params.jqXHR.responseJSON.status.receiptAvailable);
    if (self.confirmScreenExtensions && self.confirmScreenExtensions.taskCode) {
      if (!self.params.jqXHR.responseJSON.transactionAction) {
        ConfirmScreenModel.fetchFeedbackTemplates(self.confirmScreenExtensions.taskCode).then(function (data) {
          if (data.feedbackEnabled && (data.feedbackTemplateDTO.length > 0) && data.feedbackTemplateDTO[0].definitionDTOs[0].transactionId) {
            if (data.feedbackforTransaction === "ONCE") {
              if (!data.feedbackCaptured) {
                self.feedbackTemplateDTO(data);
              }
            } else {
              self.feedbackTemplateDTO(data);
            }
          }
        });
      }
    }
    var txnName = self.transactionName || self.confirmScreenResources.confirm.DEFAULT_TXN_NAME;
    rootParams.dashboard.headerName(txnName);
    var evaluateStatus = function (jqXHR) {
      var JSONResponse = jqXHR.responseJSON || jqXHR;
      if (JSONResponse.transactionAction && JSONResponse.transactionAction.transactionDTO) {
        var response = JSONResponse.transactionAction.transactionDTO;
        if (response.processingDetails && response.processingDetails.status === "S") {
          return "FINAL_LEVEL_APPROVED";
        } else if (response.processingDetails && response.processingDetails.status === "P") {
          return "MID_LEVEL_APPROVED";
        } else if (response.processingDetails.status === "F" && response.processingDetails.currentStep === "exec") {
          return "REJECT_BY_HOST";
        } else if (response.processingDetails && response.processingDetails.status === "F") {
          return "REJECT";
        }
      } else if (jqXHR.status === 202) {
        return "INITIATED";
      } else if (jqXHR.status === 200 || jqXHR.status === 201) {
        return "AUTO_AUTH";
      } else {
        return "REJECT_BY_HOST";
      }
    };

    self.getStatusMessage = function (jqXHR) {
      var status = evaluateStatus(jqXHR);
      if (self.confirmScreenExtensions && self.confirmScreenExtensions.confirmScreenStatusEval) {
        return self.confirmScreenExtensions.confirmScreenStatusEval(jqXHR, status);
      }
      if (status === "REJECT_BY_HOST" && jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO) {
        self.reason($("<div/>").html(jqXHR.responseJSON.transactionAction.transactionDTO.errors[0].errorMessage).text());
      }
      return self.confirmScreenResources.confirm.status[status];
    };
    self.successMessage = function (jqXHR) {
      var status = evaluateStatus(jqXHR);
      if (self.confirmScreenExtensions && self.confirmScreenExtensions.confirmScreenMsgEval) {
        return self.confirmScreenExtensions.confirmScreenMsgEval(jqXHR, txnName, status, self.transactionID, self.hostReferenceNumber);
      } else if(self.confirmScreenResources.confirm.staticMessages[self.constants.userSegment]){
          return self.confirmScreenResources.confirm.staticMessages[self.constants.userSegment][status];
      }
        var message = (status === "AUTO_AUTH" || status === "FINAL_LEVEL_APPROVED") ? self.confirmScreenResources.confirm[self.constants.userSegment + "_SUCCESS_MESSAGE"] : null;
        return rootParams.baseModel.format( message || self.confirmScreenResources.confirm.defaultSuccessMessage, {
          txnName: txnName,
          status:  self.confirmScreenResources.confirm.status[status],
          transactionID: self.transactionID,
          hostReferenceNumber: self.hostReferenceNumber
        });

    };
    (function (jqXHRs) {
      if (!Array.isArray(jqXHRs)) jqXHRs = [jqXHRs];
      jqXHRs.forEach(function (jqXHR) {
        var currentStatus = evaluateStatus(jqXHR);
        var isRejected = (currentStatus === "REJECT_BY_HOST") || (currentStatus === "REJECT");
        self.headerMessages.push({
          icon: isRejected ? ("dashboard/cancellation.svg") : ("dashboard/confirmation.svg") ,
          headerMessage: isRejected ? self.confirmScreenResources.confirm.errorText : self.confirmScreenResources.confirm.confirmText,
          summaryMessage: self.successMessage(jqXHR),
          headerStyle: isRejected ? "errorHeader" : "successHeader"
        });
      });
    })(self.params.jqXHR.responseJSON.batchDetailResponseDTOList || self.params.jqXHR);
    self.openTransaction = function (compname, applicationType, moduleURL) {
      rootParams.baseModel.registerComponent(compname, applicationType);
      rootParams.dashboard.isConfirmScreenVisited(false);
      if (self.constants.userSegment === "RETAIL") {
        self.selectedTab = null;
        rootParams.dashboard.loadComponent("manage-accounts", {
          defaultTab: compname,
          applicationType: applicationType,
          moduleURL: moduleURL,
          isSuccess: true
        });
      } else {
        rootParams.dashboard.loadComponent(compname);
      }
    };
    self.share = function () {
      window.plugins.sharing.shareWithOptions({
        message: self.params.shareMessage
      });
    };
    self.handleOk = function () {
      if (self.homeComponent) {
        rootParams.dashboard.loadComponent(self.homeComponent, {});
      } else {
        rootParams.dashboard.switchModule(rootParams.dashboard.application());
      }
    };
    self.downloadEreceipt = function () {
      ConfirmScreenModel.downloadEreceipt(self.transactionID);
    };
    self.showFeedbackOverlay = function () {
      self.renderFeedbackModule(true);
    };
    self.dispose = function () {
      document.getElementById("message-box").closeAll();
    };
  };
});
