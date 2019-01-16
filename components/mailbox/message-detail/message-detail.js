define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "ojL10n!resources/nls/mailbox",
  "ojs/ojtoolbar",
  "ojs/ojnavigationlist",
  "ojs/ojinputtext",
  "ojs/ojpopup",
  "ojs/ojselectcombobox",
  "ojs/ojfilepicker",
  "ojs/ojknockout-validation"
], function(oj, ko, $, MessageDetailModel, resourceBundle) {
  "use strict";
  return function(params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;
    self.subject = ko.observable(params.data.messageDetails().subject);
    self.sentTime = ko.observable(params.data.messageDetails().creationDate);
    self.messageBody = ko.observable(params.data.messageDetails().messageBody);
    self.isMailUpdated = ko.observable();
    self.loadedComponent = ko.observable(params.data.loadedComponent());
    self.conversationFormat = ko.observable(false);
    self.senderName = ko.observable(params.data.messageDetails().senderName);
    var newMailObject = params.data.messageDetails();
    self.previousMails = ko.observable([]);
    self.textvalueVar = ko.observable("");
    self.maxlength = 1000;
    self.mappedDetailMailsUpdate = ko.observableArray();
    self.mappedDetailMailsDelete = ko.observableArray();
    self.updatePayload = ko.observableArray();
    self.deletePayload = ko.observableArray();
    self.replyMessage = ko.observable(false);
    self.replyText = ko.observable("");
    self.replyPayload = ko.observable({});
    self.replyMessageMapping = ko.observable({});
    self.interactionId = ko.observable();
    self.deleteFlag = ko.observable(false);
    self.messageUserMappings = ko.observable([]);
    self.uploadedFiles = ko.observableArray([]);
    self.contentDTO = ko.observableArray([]);
    self.preAttached = ko.observableArray([]);
    self.successfullyAttached = ko.observable(true);
    self.validationTracker = ko.observable();
    var totalAttachments = 0;
    if (params.rootModel.userSegment && params.rootModel.userSegment === "CORP") {
      self.isCorpSegment = ko.observable(true);
    } else {
      self.isCorpSegment = ko.observable(false);
    }
    self.back = function() {
      self.selectMailAllowed(true);
      ko.tasks.runEarly();
      self.showDetailedMessage(false);
      self.refreshMails();
    };
    self.populatePreviousMails = function(newMailObject) {
      while (newMailObject.linkedParent) {
        self.previousMails().push(newMailObject.linkedParent);
        newMailObject = newMailObject.linkedParent;
      }

    };
    self.replyText.subscribe(function(newValue) {
      if (newValue === "") {
        self.textvalueVar("");
      }
    }, self);
    if (ko.utils.unwrapObservable(self.replyText) !== null) {
      self.textvalueVar(ko.utils.unwrapObservable(self.replyText));
    }
    if (params.data.messageDetails().linkedParent) {
      self.conversationFormat(true);
      self.populatePreviousMails(newMailObject);
    }

    self.confirmDelete = function() {
      self.deleteFlag(true);
      $("#deleteMail").trigger("openModal");
    };

    self.closeModal = function() {
      $("#deleteMail").hide();
    };
    self.reply = function() {
      self.replyMessage(true);
      if (self.attachments().length >= 0 && self.loadedComponent() === "sent-mails") {
        for (var i = 0; i < self.attachments().length; i++) {
          var contentId = self.attachments()[i].contentId;
          self.contentDTO.push({
            "contentId": contentId
          });
          self.preAttached.push(self.attachments()[i]);
        }
      }
    };
    self.updateStatus = function() {
      self.toShow(false);
      self.updatePayload = {
        messageId: {
          displayValue: "",
          value: ""
        }
      };
      self.updatePayload.messageId.displayValue = params.data.messageDetails().messageId.displayValue;
      self.updatePayload.messageId.value = params.data.messageDetails().messageId.value;
      self.messageUserMapping = ko.observableArray();
      var statusObject = {
        status: "R",
        deleteStatus: false
      };
      self.messageUserMapping.push(statusObject);
      self.updatePayload.messageUserMappings = self.messageUserMapping();
      var payload = ko.toJSON(self.updatePayload);
      self.mappedDetailMailsUpdate.push({
        methodType: "PUT",
        uri: {
          value: "/mailbox/mails/{mailId}",
          params: {
            mailId: self.updatePayload.messageId.value
          }
        },
        payload: payload,
        headers: {
          "Content-Id": 0,
          "Content-Type": "application/json"
        }
      });
      MessageDetailModel.fireBatch({
        batchDetailRequestList: self.mappedDetailMailsUpdate()
      }).done(function() {
        ko.tasks.runEarly();
        self.refreshMails();
        self.isMailUpdated(true);
        self.showInboxCount(false);
        self.showInboxCount(true);
        params.dashboard.getMailCount();
      });
    };
    self.removeFile = function(file) {
      var index = self.uploadedFiles.indexOf(file) + self.preAttached().length;
      var tempArray = self.contentDTO.splice(index, 1);
      self.uploadedFiles.remove(file);
      MessageDetailModel.deleteDocument(tempArray[0].contentId.value).done();

    };
    self.removePreAttachedFile = function(file) {
      var index = self.preAttached().indexOf(file);
      self.contentDTO.splice(index, 1);
      self.preAttached.remove(file);
    };
    self.fileSelectListenerCallBackFactory = function(file) {
      return function(data) {
        self.uploadedFiles.push(file);
        var contentId = data.contentDTOList[0].contentId;
        self.contentDTO.push({
          "contentId": contentId
        });
        if (self.contentDTO().length === totalAttachments) {
          self.successfullyAttached(true);
        }
      };
    };
    self.fileSelectListenerFailureCallBackFactory = function() {
      return function() {
        totalAttachments--;
        if (self.contentDTO().length === totalAttachments) {
          self.successfullyAttached(true);
        }
      };
    };
    self.fileSelectListener = function(event) {
      self.successfullyAttached(false);
      var files = event.detail.files;
      totalAttachments = files.length + self.contentDTO().length;
      for (var i = 0; i < files.length; i++) {
        var formData = new FormData();
        formData.append("file", files[i]);
        formData.append("transactionType", "IM");
        MessageDetailModel.uploadDocument(formData).done(self.fileSelectListenerCallBackFactory(files[i])).fail(self.fileSelectListenerFailureCallBackFactory());
      }
    };
    self.downloadDocument = function(data) {
      MessageDetailModel.downloadDocument(data.contentId.value);
    };
    if (self.loadedComponent() !== "deleted-mails" && !self.deleteFlag()) {
      self.updateStatus();
    }

    self.submit = function() {
      self.toShow(false);
      $("#deleteMail").hide();
      self.deletePayload = {
        messageId: {
          displayValue: "",
          value: ""
        }
      };
      self.messageUserMapping = ko.observableArray();
      self.deletePayload.messageId.displayValue = params.data.messageDetails().messageId.value;
      self.deletePayload.messageId.value = params.data.messageDetails().messageId.value;

      if (self.loadedComponent() === "deleted-mails") {
        var statusObject = {
          status: "PD",
          deleteStatus: true
        };
        self.messageUserMapping.push(statusObject);
      } else {
        var statusObjectData = {
          status: "R",
          deleteStatus: true
        };
        self.messageUserMapping.push(statusObjectData);
      }
      self.deletePayload.messageUserMappings = self.messageUserMapping();
      var payload = ko.toJSON(self.deletePayload);
      self.mappedDetailMailsDelete.push({
        methodType: "PUT",
        uri: {
          value: "/mailbox/mails/{mailId}",
          params: {
            mailId: self.deletePayload.messageId.value
          }
        },
        payload: payload,
        headers: {
          "Content-Id": 0,
          "Content-Type": "application/json"
        }
      });
      MessageDetailModel.fireBatch({
        batchDetailRequestList: self.mappedDetailMailsDelete()
      }).done(function() {
        ko.tasks.runEarly();
        self.refreshMails();
        self.isMailUpdated(true);
        self.showDetailedMessage(false);
        params.dashboard.getMailCount();
      });
    };
    self.replyMail = function() {
      if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      if (!self.successfullyAttached()) {
        return;
      }
      ko.utils.arrayForEach(params.data.messageDetails().messageUserMappings, function(item) {
        if (item.msgFlag === "F") {
          self.replyMessageMapping().userId = item.userId;
          self.replyMessageMapping().msgFlag = "T";
          self.replyMessageMapping().username = item.username;
          self.replyMessageMapping().status = "U";
        }
      });
      ko.utils.arrayForEach(params.data.messageDetails().messageUserMappings, function(item) {
        delete item.status;
        self.messageUserMappings().userId = item.userId;
        self.messageUserMappings().msgFlag = item.msgFlag;
        self.messageUserMappings().mapId = item.mapId;
        self.messageUserMappings().username = item.username;
        self.messageUserMappings().messageId = params.data.messageDetails().messageId;
        self.messageUserMappings().push(item);
      });
      self.replyPayload().messageType = "M";
      if (params.data.messageDetails().subject.indexOf(self.nls.mailbox.labels.replyPrefix) > -1) {
        self.replyPayload().subject = params.data.messageDetails().subject;
      } else
        self.replyPayload().subject = self.nls.mailbox.labels.replyPrefix + params.data.messageDetails().subject;
      self.replyPayload().messageBody = self.textvalueVar();
      self.replyPayload().expiryDate = null;
      self.replyPayload().subjectId = params.data.messageDetails().subjectId;
      self.replyPayload().messageId = params.data.messageDetails().messageId.value;
      self.replyPayload().contentDTO = self.contentDTO;
      self.replyPayload().linkedParent = {
        "messageId": params.data.messageDetails().messageId.value,
        "messageType": "M",
        "subject": params.data.messageDetails().subject,
        "messageBody": params.data.messageDetails().messageBody,
        "subjectId": params.data.messageDetails().subjectId
      };
      var payload = ko.mapping.toJSON(self.replyPayload());
      MessageDetailModel.replyMail(payload, params.data.messageDetails().messageId.value).done(function(data) {
        if (data.mail.interactionId) {
          self.interactionId(data.mail.interactionId);
        }
        $("#replyMailSuccess").trigger("openModal");
        self.replyPayload([]);
      });

      self.selectMailAllowed(true);
    };


    self.ok = function() {
      self.showDetailedMessage(false);
      $("#replyMailSuccess").hide();
    };

    self.closeHandler = function() {
      self.showDetailedMessage(false);
    };


  };
});
