define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",

  "ojL10n!resources/nls/mailbox",
  "ojs/ojinputtext",
  "ojs/ojpopup",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojfilepicker"
], function(oj, ko, $, ComposeMailModel, BaseLogger, resourceBundle) {
  "use strict";
  return function(params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;
    self.textvalue = ko.observable("");
    self.categoryOptionValue = ko.observable();
    self.interactionId = ko.observable();
    self.validationTracker = ko.observable();
    self.textvalueVar = ko.observable("");
    self.categoryOptionList = ko.observableArray();
    self.categoryOptionValueName = ko.observable();
    self.updatePayload = ko.observable({});
    self.partyvalue = ko.observable({});
    self.maxlength = 1000;
    self.othersTextFlag = ko.observable(false);
    self.otherRemark = ko.observable();
    self.uploadedFiles = ko.observableArray([]);
    self.contentDTO = ko.observableArray([]);
    self.successfullyAttached = ko.observable(true);
    var totalAttachments = 0;
    params.baseModel.registerElement("modal-window");

    self.textvalue.subscribe(function(newValue) {
      if (newValue === "") {
        self.textvalueVar("");
      }
    }, self);
    if (ko.utils.unwrapObservable(self.textvalue) !== null) {
      self.textvalueVar(ko.utils.unwrapObservable(self.textvalue));
    }
    self.categoryOptionChangeHandler = function(event) {
      if (event.detail.value) {

        if (event.detail.value) {
          self.categoryOptionValue(event.detail.value);
        }
        for (var i = 0; i <= self.categoryOptionList().length; i++) {

          ko.utils.arrayForEach(self.categoryOptionList(), function(item) {
            for (var j = 0; j < item.children.length; j++) {

              if (item.children[j].value === event.detail.value) {

                self.categoryOptionValueName(item.children[j].label);
                if (self.categoryOptionValueName().toUpperCase() === "OTHERS") {
                  self.othersTextFlag(true);
                } else {
                  self.othersTextFlag(false);
                }

              }
            }
          });
        }
      }
    };

    var promise1 = ComposeMailModel.fetchPartyOptions1();
    var promise2 = ComposeMailModel.fetchPartyOptions2();
    ComposeMailModel.fetchCategoryOptions().then(function(data3) {
      if (data3.mailCategoryDTOs) {
        ko.utils.arrayForEach(data3.mailCategoryDTOs, function(item) {
          self.categoryOption = {
            "label": "",
            "children": []
          };
          self.categoryOption.label = item.name;
          if (item.subjects.length > 0) {
            ko.utils.arrayForEach(item.subjects, function(thisItem) {
              self.categoryOptionChild = {
                "value": "",
                "label": ""
              };
              self.categoryOptionChild.value = thisItem.subjectId;
              self.categoryOptionChild.label = thisItem.subject;
              self.categoryOption.children.push(self.categoryOptionChild);
            });
            self.categoryOptionList.push(self.categoryOption);
          }
        });
      }
    });

    Promise.all([promise1, promise2]).then(function(data1) {

      self.partyOptionChildPri = {
        "value": "",
        "label": ""
      };

      self.partyOptionChildPri.value = data1[0].party.id.value;
      self.partyOptionChildPri.label = data1[0].party.personalDetails.fullName;
      self.partyOptionList.push(self.partyOptionChildPri);
      if (data1[1].partyToPartyRelationship && data1[1].partyToPartyRelationship.length > 0) {
        self.moreThanOnePartyExist(true);
        ko.utils.arrayForEach(data1[1].partyToPartyRelationship, function(thisItem) {
          self.partyOptionChild = {
            "value": "",
            "label": ""
          };
          self.partyOptionChild.value = thisItem.relatedParty.value;
          self.partyOptionChild.label = thisItem.relatedPartyName;
          self.partyOptionList.push(self.partyOptionChild);
        });
      } else {
        //put primary party as hidden value
        self.partyvalue = {
          value: data1[0].party.id.value
        };
      }
    });
    self.sendMail = function() {
      if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      if (!self.successfullyAttached()) {
        return;
      }
      self.updatePayload().interactionId = null;
      self.updatePayload().messageId = null;
      self.updatePayload().messageType = "M";
      self.updatePayload().subject = self.categoryOptionValueName().toUpperCase() === "OTHERS" ? self.otherRemark() : self.categoryOptionValueName();
      self.updatePayload().messageBody = self.textvalueVar();
      self.updatePayload().creationDate = null;
      self.updatePayload().expiryDate = null;
      self.updatePayload().messageUserMappings = null;
      self.updatePayload().subjectId = self.categoryOptionValue();
      self.updatePayload().linkedParent = null;
      self.updatePayload().contentDTO = self.contentDTO();
      if (self.moreThanOnePartyExist()) {
        self.updatePayload().party = {
          value: self.partyOptionValue()[0]
        };
      } else {
        self.updatePayload().party = self.partyvalue;
      }
      var payload = ko.toJSON(self.updatePayload());
      ComposeMailModel.sendMail(payload).then(function(data) {
        if (data.mail.interactionId) {
          self.interactionId(data.mail.interactionId);
        }
        $("#sentMailSuccess").trigger("openModal");
      });
    };

    self.ok = function() {
      self.loadedComponent("inbox");
      $("#sentMailSuccess").hide();
    };
    self.removeFile = function(file) {
      var index = self.uploadedFiles.indexOf(file);
      var tempArray = self.contentDTO.splice(index, 1);
      self.uploadedFiles.remove(file);
      ComposeMailModel.deleteDocument(tempArray[0].contentId.value).done();
    };
    self.closeHandler = function() {
      self.loadedComponent("inbox");
    };

    self.fileSelectListenerSuccessCallBackFactory = function(file) {
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
        ComposeMailModel.uploadDocument(formData).done(self.fileSelectListenerSuccessCallBackFactory(files[i])).fail(self.fileSelectListenerFailureCallBackFactory());
      }
    };
  };
});
