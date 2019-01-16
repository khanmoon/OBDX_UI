define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "./model",
  "ojL10n!resources/nls/alerts",
  "ojs/ojselectcombobox",
  "ojs/ojpopup",
  "promise",
  "ojs/ojdatagrid",
  "ojs/ojdatetimepicker",
  "ojs/ojvalidation",
  "ojs/ojbutton",
  "ojs/ojknockout-validation",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojaccordion"
], function(oj, ko, $, BaseLogger, AlertsMaintenanceModel, resourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.mode = ko.observable(Params.rootModel.params.mode);
    self.alertName = ko.observable();
    self.descriptionValue = ko.observable(null);
    self.templateId = ko.observable(null);
    self.eventActivityList = ko.observable();
    self.eventActivityData = ko.observable();
    self.eventActivityDataLoaded = ko.observable(false);
    self.selectedData = ko.observable();
    self.invalidTracker = ko.observable();
    self.alertTypeList = ko.observable();
    self.alertTypeLoaded = ko.observable(false);
    self.alertNatureList = ko.observable();
    self.alertNatureLoaded = ko.observable(false);
    self.alertDispatchList = ko.observable();
    self.alertDispatchLoaded = ko.observable(false);
    self.recipientCategoryList = ko.observable();
    self.recipientCategoryLoaded = ko.observable();
    self.recipientList = ko.observable();
    self.recipientLoaded = ko.observable(false);
    self.deliveryModesList = ko.observable();
    self.eventDescription = ko.observable();
    self.alertType = ko.observable();
    self.deliveryModesLoaded = ko.observable(false);
    self.confirmationMsg = ko.observable();
    self.moduleType = ko.observable();
    self.filterList=ko.observableArray();
    var nexDayinMs = Params.baseModel.getDate();
    self.tomorrow = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(nexDayinMs)));
    Params.baseModel.registerComponent("message-template-maintenance", "alerts");
    self.eventDescriptionUpdated = ko.observable(false);
    self.isContentDisabled = ko.observable(false);
    self.messageTemplateList = ko.observableArray();
    self.nls = resourceBundle;
    self.showMessageTemplateSection = ko.observable(false);
    self.updateTemplate = ko.observable(false);
    self.actionHeaderheading = ko.observable();
    self.activityId = ko.observable();
    self.eventId = ko.observable();
    self.actionId = ko.observable();
    self.prevMode = ko.observable();
    self.alertDetailsLoaded = ko.observable(false);
    self.eventDetails = ko.observable();
    self.approverReview = ko.observable(false);
    Params.dashboard.headerName(self.nls.alerts.labels.heading);
    self.transactionName = ko.observable();
    self.transactionStatus = ko.observable();
    self.statusMessage = ko.observable();
    self.httpStatus = ko.observable();
    self.showDropDown = ko.observable(false);
    self.actionAndEventId = ko.observable();
    self.reviewEditflag = ko.observable(false);
    self.prevReviewMode = ko.observable();
    self.validateEmail = ko.observable();
    self.validateSecure = ko.observable();
    self.validateSms = ko.observable();
    self.editorValidator = ko.observableArray();
    self.space = " ";
    if (self.mode() === "CREATE" && self.prevMode() === "REVIEW") {
      self.eventDescriptionUpdated(false);
    }
    Params.baseModel.registerElement("row");
    Params.baseModel.registerElement("confirm-screen");
    Params.baseModel.registerElement("modal-window");
    self.getNewKoModel = function() {
      var KoModel = AlertsMaintenanceModel.getNewModel();
      return KoModel;
    };
    self.getNewRecipientMessageTemplateModel = function() {
      var koRecipientMessageTemplateModel = AlertsMaintenanceModel.getNewRecipientMessageTemplateModel();
      return koRecipientMessageTemplateModel;
    };
    self.getNewMessageTemplateModel = function() {
      var koMessageTemplateModel = AlertsMaintenanceModel.getNewMessageTemplateModel();
      return koMessageTemplateModel;
    };
    self.payload = ko.observable(self.getNewKoModel());
    self.deleteModal = function() {
      $("#deleteAlert").trigger("openModal");
    };
    self.closeDialogBox = function() {
      $("#deleteAlert").hide();
    };

    if (self.transactionId) {
      self.mode("REVIEW");
      self.payload(ko.mapping.toJS(Params.rootModel.params.data));
      self.alertType(self.payload().alertType);
      self.messageTemplateList(self.payload().recipientMessageTemplates);
      for (var i = 0; i < self.messageTemplateList().length; i++) {
        self.messageTemplateList()[i] = ko.mapping.fromJS(self.messageTemplateList()[i]);
      }
      AlertsMaintenanceModel.fetchDescriptionEventActivityList(self.moduleType(), self.payload().alertKeyDTO.activityId, self.payload().alertKeyDTO.eventId).done(function(alertDetails) {
        self.eventActivityList(alertDetails.activityEvents);
        self.moduleType(self.eventActivityList()[0].moduleType);
        self.eventDescription(self.eventActivityList()[0].activityEventDescription);
        self.alertDetailsLoaded(true);
      });
      self.approverReview(true);
    }
    self.actionHeaderheading(self.nls.headers[self.mode()]);
    self.addNewTemplate = function() {
      self.showMessageTemplateSection(false);
      var koRecipientMessageTemplateModel = self.getNewRecipientMessageTemplateModel();
      koRecipientMessageTemplateModel.keyDTO.activityId = self.activityId;
      koRecipientMessageTemplateModel.keyDTO.eventId = self.eventId;
      var RecipientObservableModel = ko.mapping.fromJS(koRecipientMessageTemplateModel);
      self.messageTemplateList.push(ko.observable(RecipientObservableModel));
      self.editorValidator.push({
        validateEmail: self.validateEmail,
        validateSecure: self.validateSecure,
        validateSms: self.validateSms
      });
      self.showMessageTemplateSection(true);
    };

    function serviceCalls() {
      AlertsMaintenanceModel.fetchAlertType().done(function(data) {
        self.alertTypeList(data.enumRepresentations[0].data);
        self.alertTypeLoaded(true);
      });
    }
    if (self.mode() === "CREATE") {
      AlertsMaintenanceModel.fetchDescriptionEventActivityList(self.moduleType(), self.activityId(), self.eventId()).done(function(data) {
        self.eventActivityList(data.activityEvents);
        self.eventActivityData(data);
        self.eventActivityDataLoaded(true);
        self.showDropDown(true);
      });
      serviceCalls();
    }
    $("#msgTemplate").hide();
    self.addMessageTemplate = function() {
      $("#msgTemplate").trigger("openModal");
    };
    self.selectedDeletion = ko.observable(false);
    self.count = ko.observable(0);
    self.deleteTemplate = function(index) {
      self.showMessageTemplateSection(false);
      var i = 0;
      self.messageTemplateList.remove(function() {
        if (index === i) {
          i = i + 1;
          return true;
        }
          i = i + 1;
          return false;

      });
      i = 0;
      self.editorValidator.remove(function() {
        if (index === i) {
          i = i + 1;
          return true;
        }
          i = i + 1;
          return false;

      });
      if (self.messageTemplateList().length === 0) {
        self.showMessageTemplateSection(false);
      } else {
        self.showMessageTemplateSection(true);
      }
      self.count(self.messageTemplateList().length);
      self.selectedDeletion(true);
    };
    self.confirm = function() {
      self.payload().alertDispatchType = "I";
      self.payload().alertTemplate.keyDTO.id = "1";
      self.payload().alertTemplate.name = self.nls.alerts.labels.emailTemplate;
      self.payload().alertTemplate.urgency = "H";
      self.payload().alertTemplate.language = "ENG";
      self.payload().alertTemplate.importance = "C";
      if (self.prevMode() === "CREATE") {
        self.transactionName(self.nls.alerts.labels.createAlert);
        AlertsMaintenanceModel.createAlert(ko.toJSON(self.payload())).done(function(data, status, jqXhr) {
          self.httpStatus(jqXhr.status);
          if (self.httpStatus() === 202) {
            self.statusMessage(self.nls.common.successfullyInitiated);
          } else if (self.httpStatus() === 200) {
            self.statusMessage(self.nls.common.savedSuccessfully);
          } else if (self.httpStatus() === 201) {
            self.statusMessage(self.nls.common.savedSuccessfully);
          }
          self.transactionStatus(data.status);
          self.mode("SUCCESS");
          self.actionHeaderheading(self.nls.headers[self.mode()]);
          self.confirmationMsg(self.nls.alerts.labels.successMessage);
          Params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.transactionName()
          }, self);
        });
      }
      if (self.prevMode() === "EDIT") {
        self.transactionName(self.nls.alerts.labels.modifyAlert);
        AlertsMaintenanceModel.updateAlert(ko.toJSON(self.payload()), self.payload().alertName).done(function(data, status, jqXhr) {
          self.httpStatus(jqXhr.status);
          if (self.httpStatus() === 202) {
            self.statusMessage(self.nls.common.successfullyInitiated);
          } else if (self.httpStatus() === 200) {
            self.statusMessage(self.nls.common.savedSuccessfully);
          } else if (self.httpStatus() === 201) {
            self.statusMessage(self.nls.common.savedSuccessfully);
          }
          self.transactionStatus(data);
          self.mode("SUCCESS");
          self.actionHeaderheading(self.nls.headers[self.mode()]);
          self.confirmationMsg(self.nls.alerts.labels.successMessage);
          Params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.transactionName()
          }, self);
        });
      }
    };
    self.getRecipientLabel = function(index, keyDTO) {
      if (keyDTO.recipientCategory() === null)
        return Params.baseModel.format(self.nls.alerts.labels.addMessageTemplate, {
          index: index + 1
        });

        return self.nls.alerts.recipientCategory[keyDTO.recipientCategory()] + " - " + self.nls.alerts.recipient[keyDTO.recipient()] + (keyDTO.locale() ? " - " + self.nls.alerts.locale[keyDTO.locale()] : "");

    };

    self.save = function() {
      if (self.messageTemplateList().length === 0) {
        if (!Params.baseModel.showComponentValidationErrors(self.invalidTracker())) {
          return;
        }
        Params.baseModel.showMessages(null, [self.nls.alerts.labels.noRecipientSelected], "ERROR");
        return;
      }
      self.payload().recipientMessageTemplates = ko.mapping.toJS(self.messageTemplateList);
      var flag = false;
      var i;
      var id;
      for (i = 0; i < self.payload().recipientMessageTemplates.length; i++) {
        if (self.payload().recipientMessageTemplates[i].messageTemplateDTO.length === 0) {
          if (!Params.baseModel.showComponentValidationErrors(self.invalidTracker())) {
            id = "collapsibleDiv" + i;
            $("#accordionPage").ojAccordion("option", "expanded", [id]);
            return;
          }
          flag = true;
          break;
        }
        ko.utils.arrayForEach(self.payload().recipientMessageTemplates[i].messageTemplateDTO, function(messageTemplateDTO) {
          if (messageTemplateDTO.destinationType === null || messageTemplateDTO.destinationType === undefined || messageTemplateDTO.destinationType === "") {
            if (!Params.baseModel.showComponentValidationErrors(self.invalidTracker())) {
              var id = "collapsibleDiv" + i;
              $("#accordionPage").ojAccordion("option", "expanded", [id]);
              return;
            }
            flag = true;

          }
        });
        if (flag === true)
          break;
      }
      if (flag === true) {
        Params.baseModel.showMessages(null, [self.nls.alerts.labels.noDeliveryTypeSelected], "ERROR");
        return;
      }
      self.alertDetailsLoaded(true);
      self.payload().alertKeyDTO.eventId = self.eventId;
      self.payload().alertKeyDTO.activityId = self.activityId;
      self.payload().alertKeyDTO.actionId = "A";
      self.payload().alertType = self.alertType();
      for (i = 0; i < self.payload().recipientMessageTemplates.length; i++) {
        if (!Params.baseModel.showComponentValidationErrors(self.invalidTracker())) {
          self.editorValidator()[i].validateEmail()();
          self.editorValidator()[i].validateSecure()();
          self.editorValidator()[i].validateSms()();
          id = "collapsibleDiv" + i;
          $("#accordionPage").ojAccordion("option", "expanded", [id]);
          return;
        }
        self.payload().recipientMessageTemplates[i].keyDTO.eventId = self.eventId;
        self.payload().recipientMessageTemplates[i].keyDTO.activityId = self.activityId;
        self.payload().recipientMessageTemplates[i].keyDTO.actionId = "A";
        if (self.payload().alertType === "M") {
          self.payload().recipientMessageTemplates[i].alertType = self.payload().alertType;
        }
        ko.utils.arrayForEach(self.payload().recipientMessageTemplates[i].messageTemplateDTO, function(messageTemplateDTO) {
          var dataAttributeIndex = 0;
          var dataAttributeArray;
          if (self.mode() === "CREATE" && messageTemplateDTO.dataAttributes) {
            messageTemplateDTO.id = null;
            dataAttributeArray = messageTemplateDTO.dataAttributes;
          } else if (self.mode() === "EDIT" && messageTemplateDTO.dataAttributes) {
            if (messageTemplateDTO.id === "" || messageTemplateDTO.id === undefined)
              messageTemplateDTO.id = null;
            dataAttributeArray = messageTemplateDTO.dataAttributes;
          }
          if (dataAttributeArray && dataAttributeArray.length > 0) {
            ko.utils.arrayForEach(dataAttributeArray, function(dataAttribute) {
              messageTemplateDTO.dataAttributes[dataAttributeIndex].attributeId = dataAttribute.attributeId;
              messageTemplateDTO.dataAttributes[dataAttributeIndex].attributeMask = dataAttribute.attributeMask;
              if (dataAttribute.dataSources.serviceAttributeId) {
                messageTemplateDTO.dataAttributes[dataAttributeIndex].dataSources[0].serviceAttributeId = dataAttribute.dataSources()[0].serviceAttributeId();
                messageTemplateDTO.dataAttributes[dataAttributeIndex].dataSources[0].activityId = dataAttribute.dataSources()[0].activityId;
                messageTemplateDTO.dataAttributes[dataAttributeIndex].dataSources[0].attributeId = dataAttribute.attributeId;
              }
              dataAttributeIndex = dataAttributeIndex + 1;
            });
          } else {
            messageTemplateDTO.dataAttributes = null;
          }
        });
      }
      self.prevMode(self.mode());
      self.prevReviewMode(self.prevMode());
      self.mode("REVIEW");
      self.actionHeaderheading(self.nls.headers[self.mode()]);
    };
    self.editAlert = function() {
      self.mode("EDIT");
      serviceCalls();
      self.eventDescriptionUpdated(false);
      self.eventDescriptionUpdated(true);
      self.actionHeaderheading(self.nls.headers[self.mode()]);
    };
    self.editReviewAlert = function() {
      if (self.prevReviewMode() === "EDIT") {
        self.prevMode(self.mode());
        self.mode("EDIT");
      } else {
        self.reviewEditflag(true);
        self.prevMode(self.mode());
        self.mode("CREATE");
      }
      self.eventDescriptionUpdated(false);
      self.eventDescriptionUpdated(true);
      self.actionHeaderheading(self.nls.headers[self.mode()]);
    };
    self.deleteAlert = function() {
      AlertsMaintenanceModel.deleteAlert(self.payload().alertName).done(function(data, status, jqXhr) {
        self.httpStatus(jqXhr.status);
        if (self.httpStatus() === 202) {
          self.statusMessage(self.nls.common.successfullyInitiated);
        } else if (self.httpStatus() === 200) {
          self.statusMessage(self.nls.common.savedSuccessfully);
        } else if (self.httpStatus() === 201) {
          self.statusMessage(self.nls.common.savedSuccessfully);
        }
        self.transactionStatus(data);
        self.mode("SUCCESS");
        self.actionHeaderheading(self.nls.headers[self.mode()]);
        self.confirmationMsg(self.nls.alerts.labels.successDeleteMessage);
        Params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.transactionName()
        }, self);
      }).fail(function() {
        $("#deleteAlert").hide();
      });
    };
    self.back = function() {
      history.back();
    };
    self.moduleType.subscribe(function(newValue) {
      if (self.mode() !== "VIEW" && self.mode() !== "REVIEW") {
        self.showDropDown(false);
        AlertsMaintenanceModel.fetchDescriptionEventActivityList(newValue).done(function(data) {
          self.eventActivityList(data.activityEvents);
          self.showDropDown(true);
          self.eventActivityData(data);
          self.eventDescription("");
          $(".random").ojSelect("reset");
        });
      }
    });

    self.optionChangeHandler = function(event) {
      if (event.detail.value && event.detail.trigger === "option_selected") {
        self.filterList = ko.computed(function() {
          return ko.utils.arrayFilter(self.eventActivityList(), function(events) {
            return events.activityEventDescription === event.detail.value;
          });

        });
        self.dispose = function() {
          self.filterList.dispose();
        };
        self.selectedData = self.filterList()[0];
        self.activityId = self.selectedData.activityId;
        self.eventId = self.selectedData.eventId;
        self.eventDescription(self.selectedData.activityEventDescription);
        self.eventDescriptionUpdated(true);
        if (self.reviewEditflag === true) {
          self.messageTemplateList.removeAll();
        }
        self.reviewEditflag(false);
      }
    };
    self.cancelConfirmation = function(){
      Params.dashboard.openDashBoard(self.nls.alerts.labels.confirmationMessage);
    };
    self.closeDialogBox = function() {
      $("#cancelDialog").hide();
    };
    if (self.mode() === "VIEW") {
      self.activityId(Params.rootModel.params.alertDTO.alertKeyDTO.activityId);
      self.eventId(Params.rootModel.params.alertDTO.alertKeyDTO.eventId);
      self.alertName(Params.rootModel.params.alertDTO.alertName);
      self.moduleType(Params.rootModel.params.moduleType);
      self.eventDescription(Params.rootModel.params.activityEventDescription);
      AlertsMaintenanceModel.fetchAlert(self.alertName()).done(function(alertDetails) {
        self.payload(alertDetails.alertDTO);
        self.alertType(self.payload().alertType);
        self.messageTemplateList(self.payload().recipientMessageTemplates);
        for (var i = 0; i < self.messageTemplateList().length; i++) {
          self.messageTemplateList()[i] = ko.mapping.fromJS(self.messageTemplateList()[i]);
          self.editorValidator.push({
            validateEmail: self.validateEmail,
            validateSecure: self.validateSecure,
            validateSms: self.validateSms
          });
        }
        self.alertDetailsLoaded(false);
        self.alertDetailsLoaded(true);
      });
    }
      };
});
