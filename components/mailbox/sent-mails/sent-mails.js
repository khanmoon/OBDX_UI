define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "ojL10n!resources/nls/mailbox",
  "ojs/ojknockout",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function(oj, ko, $, SentMailsModel, resourceBundle) {
  "use strict";
  return function(params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;

    self.sentMailsListLoaded = ko.observable(false);
    self.deletePayload = ko.observableArray();
    self.batchDetailRequestList = ko.observableArray();
    self.referenceNoPresent = ko.observable(false);
    params.baseModel.registerElement("modal-window");
    params.baseModel.registerElement("action-header");
    params.baseModel.registerElement("confirm-screen");
    self.messages = ko.observableArray();
    self.s = ko.observable();
    self.sentMailsList = ko.observableArray([]);
    self.moreThanOnePartyExist(false);
    self.selectMailAllowed(true);
    var sentMailsListMap;
    self.mappingDatasource = new oj.ArrayTableDataSource([], {
      idAttribute: "mailid"
    });
    self.renderCheckBox = function(context) {
      var checkBox = $(document.createElement("input"));
      var label = $(document.createElement("label"));
      checkBox.attr("type", "checkbox");
      checkBox.attr("value", context.row.messageId.value);
      checkBox.attr("name", "selection");
      label.attr("class", "oj-checkbox-label hide-label");
      checkBox.attr("id", context.row.messageId.value + "_labelID");
      label.attr("for", context.row.messageId.value + "_labelID");
      label.text(self.nls.mailbox.headers.notification);
      $(context.cellContext.parentElement).append(checkBox);
      $(context.cellContext.parentElement).append(label);
      $("#headerbox_labelID").prop("checked", false);
      self.toShow(false);
    };
    self.renderHeadCheckBox = function(context) {
      var checkBox = $(document.createElement("input"));
      var label = $(document.createElement("label"));
      checkBox.attr("type", "checkbox");
      checkBox.attr("value", "selectAll");
      checkBox.attr("name", "selectionParent");
      checkBox.attr("id", "headerbox_labelID");
      label.attr("class", "oj-checkbox-label hide-label");
      label.attr("for", "headerbox_labelID");
      label.text(self.nls.mailbox.headers.notification);
      $(context.headerContext.parentElement.firstElementChild.firstChild).append(checkBox);
      $(context.headerContext.parentElement.firstElementChild.firstChild).append(label);
    };

    self.closeModal = function() {
      $("#deleteMailsConfirmation").hide();
    };

    self.showModalWindow = function() {
      self.messages($("input[name=selection]:checked").map(function() {
        return this.value;
      }).get());
      if (self.messages()) {
        if (self.messages().length >= 2) {
          self.s("s");
        } else {
          self.s("");
        }
        $("#deleteMailsConfirmation").trigger("openModal");
      }

    };
    self.submit = function() {
      for (var i = 0; i < self.messages().length; i++) {
        self.deletePayload = {
          messageId: {
            displayValue: "",
            value: ""
          }
        };
        self.messageUserMapping = ko.observableArray();
        if (self.messages()) {
          self.deletePayload.messageId.displayValue = self.messages()[i];
          self.deletePayload.messageId.value = self.messages()[i];
          var statusData;
          for (var t = 0; t < self.sentMailsList().length; t++) {
            for (var m = 0; m < self.sentMailsList()[t].messageUserMappings.length; m++) {
              if (self.messages()[i] === self.sentMailsList()[t].mailid && self.sentMailsList()[t].messageUserMappings[m].msgFlag === "F" &&
                self.sentMailsList()[t].messageUserMappings[m].userId === params.dashboard.userData.userProfile.userName) {
                statusData = self.sentMailsList()[t].messageUserMappings[m].status;
              }
            }
          }
          var statusObject = {
            status: statusData,
            deleteStatus: true
          };
          self.messageUserMapping.push(statusObject);
          self.deletePayload.messageUserMappings = self.messageUserMapping();
        }
        var payload = ko.toJSON(self.deletePayload);
        self.batchDetailRequestList.push({
          methodType: "PUT",
          uri: {
            value: "/mailbox/mails/{mailId}",
            params: {
              mailId: self.deletePayload.messageId.value
            }
          },
          payload: payload,
          headers: {
            "Content-Id": i,
            "Content-Type": "application/json"
          }
        });
      }

      SentMailsModel.fireBatch({
        batchDetailRequestList: self.batchDetailRequestList()
      }).done(function() {
        ko.tasks.runEarly();
        self.refreshMails();
        self.toShow(false);
        $("#deleteMailsConfirmation").hide();
        self.batchDetailRequestList([]);
      });
    };

    self.refreshMails = function() {
      SentMailsModel.fetchAllSentMails().done(function(data) {
        self.sentMailsList(self.formatMailsForCustomerID(data.mails, "T", false));
        sentMailsListMap = self.sentMailsList();
        sentMailsListMap = $.map(self.sentMailsList(), function(mail) {
          mail.mailid = mail.messageId.value;
          return mail;
        });
        self.mappingDatasource.reset(sentMailsListMap || [], {
          idAttribute: "mailid"
        });
        self.arrayDataSource = new oj.PagingTableDataSource(self.mappingDatasource);

        self.sentMailsListLoaded(false);
        self.sentMailsListLoaded(true);
        $("#headerbox_labelID").prop("checked", false);
      });

    };

    self.onMessageRowClicked = function(data) {
      if (self.selectMailAllowed()) {
        self.selectMailAllowed(false);
        self.messageDetails(data);
        self.attachments([]);
        var numberOfAttachments = data.contentDTO.length;
        var retrieved = 0;
        if (numberOfAttachments > 0) {
          for (var i = 0; i < numberOfAttachments; i++) {
            SentMailsModel.retrieveAttachment(data.contentDTO[i].contentId.value).done(function(data) {
              if (self.attachments().length < numberOfAttachments && data.contentDTOList[0].contentId.value) {
                self.attachments.push(data.contentDTOList[0]);
              }
            }).always(function() {
              if (++retrieved === numberOfAttachments) {
                self.showDetailedMessage(true);
                self.selectMailAllowed(true);
              }
            });
          }
        } else {
          self.showDetailedMessage(true);
          self.selectMailAllowed(true);
        }
      }
    };
    SentMailsModel.fetchAllSentMails().done(function(data) {
      self.sentMailsList(self.formatMailsForCustomerID(data.mails, "T", false));
      if (self.sentMailsList() && self.sentMailsList()[0] && self.sentMailsList()[0].interactionId) {
        self.referenceNoPresent(true);
      }
      sentMailsListMap = self.sentMailsList();
      sentMailsListMap = $.map(self.sentMailsList(), function(mail) {
        mail.mailid = mail.messageId.value;
        return mail;
      });
      self.mappingDatasource.reset(sentMailsListMap || [], {
        idAttribute: "mailid"
      });
      self.arrayDataSource = new oj.PagingTableDataSource(self.mappingDatasource);
      self.sentMailsListLoaded(true);
    });
  };
});
