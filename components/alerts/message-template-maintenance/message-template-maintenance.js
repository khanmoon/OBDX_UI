define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "ojL10n!resources/nls/message-template-maintenance",
  "ojs/ojinputtext",
  "ojs/ojknockout",
  "ojs/ojselectcombobox",
  "ojs/ojpopup",
  "ojs/ojdialog",
  "ojs/ojcheckboxset",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, TemplateCycleModel, BaseLogger, resourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.messageTemplate = Params.messageTemplateModel;
    self.getNewAttributeKoModel = function() {
      var KoModel = TemplateCycleModel.getNewAttributeModel();
      return KoModel;
    };
    self.getNewDataSourceKoModel = function() {
      var KoModel = TemplateCycleModel.getNewDataSourceModel();
      return KoModel;
    };
    var emailTemplateId;
    var secureEmailId;
    var smsTemplateId;
    var pushTemplateId;
    self.templateId = self.messageTemplate.messageTemplateDTO.id;
    self.templateName = self.messageTemplate.messageTemplateDTO.name;
    self.templateDescription = self.messageTemplate.messageTemplateDTO.description;
    self.destinationTypes = ko.observableArray();
    self.checkSelect = ko.observable(false);
    self.recipientTypes = ko.observableArray();
    self.recipients = ko.observableArray();
    self.recipientCategories = ko.observableArray();
    self.selectedDestination = ko.observableArray();
    self.selectedCategory = ko.observableArray();
    self.selectedRecipient = ko.observableArray();
    self.selectedRecipientType = ko.observable();
    self.recipientAlertType = ko.observable();
    self.locales = ko.observableArray();
    self.index = Params.index;
    self.attributeMaskArray = ko.observableArray();
    Params.baseModel.registerElement("text-editor");
    Params.baseModel.registerElement("action-header");
    self.isContentDisabled = ko.observable();
    self.nls = resourceBundle;
    self.showSubject = ko.observable(true);
    TemplateCycleModel.init(self.templateId);
    self.mode = ko.observable(Params.mode());
    self.dataAttributes = ko.observable(true);
    self.attributeMask = ko.observable(true);
    self.dataAttributeList = ko.observableArray();
    self.serviceAttributeList = ko.observableArray();
    self.emailSubject = ko.observable();
    self.pushTitle = ko.observable();
    self.secureMailSubject = ko.observable();
    self.emailContent = ko.observable("");
    self.secureMailContent = ko.observable("");
    self.smsContent = ko.observable("");
    self.pushContent = ko.observable("");
    self.space = " ";
    var emailVersion = null;
    var secureVersion = null;
    var smsVersion = null;
    var pushVersion = null;
    self.emailAttributeList = ko.observableArray();
    self.secureMailAttributeList = ko.observableArray();
    self.smsAttributeList = ko.observableArray();
    self.pushAttributeList = ko.observableArray();
    self.emailAttributes = ko.observableArray();
    self.secureAttributes = ko.observableArray();
    self.smsAttributes = ko.observableArray();
    self.pushAttributes = ko.observableArray();
    self.emailAttributeId = ko.observable();
    self.secureAttributeId = ko.observable();
    self.smsAttributeId = ko.observable();
    self.pushAttributeId = ko.observable();
    self.emailAttributeMask = ko.observable();
    self.secureAttributeMask = ko.observable();
    self.smsAttributeMask = ko.observable();
    self.pushAttributeMask = ko.observable();
    self.templates = ko.observableArray();
    self.copyContent = ko.observableArray();
    self.showTemplateEmail = ko.observable(false);
    self.showTemplateSecure = ko.observable(false);
    self.showTemplateSms = ko.observable(false);
    self.showTemplatePush = ko.observable(false);
    self.saveEditEmail = ko.observable(false);
    self.saveEditSecure = ko.observable(false);
    self.saveEditSms = ko.observable(false);
    self.saveEditPush = ko.observable(false);
    self.copyVar = ko.observable();
    self.buttonToDropDownEmail = ko.observable(false);
    self.buttonToDropDownSecure = ko.observable(false);
    self.buttonToDropDownSms = ko.observable(false);
    self.buttonToDropDownPush = ko.observable(false);
    self.emailDisable = ko.observable(false);
    self.secureDisable = ko.observable(false);
    self.smsDisable = ko.observable(false);
    self.pushDisable = ko.observable(false);
    self.showAttributeLabel = ko.observable(false);
    self.showEmailAttributeLabel = ko.observable(false);
    self.showSecureAttributeLabel = ko.observable(false);
    self.showSmsAttributeLabel = ko.observable(false);
    self.showPushAttributeLabel = ko.observable(false);
    self.localeLoaded = ko.observable(false);
    self.localeSelected = ko.observableArray();
    self.attributeMaskEnable = ko.observableArray();
    self.attributeSelectionOrder = -1;
    self.messageTransmissionMode = "";
    self.validationTracker = ko.observable();
    self.groupValid = ko.observable();
    self.groupValidEmail = ko.observable();
    self.groupValidPush = ko.observable();
    self.groupValidMailBox = ko.observable();
    self.groupValidSms = ko.observable();

    var notString = [];
    var populate = false;
    if (self.mode() === "CREATE") {
      if (self.prevMode() === "REVIEW") {
        populate = true;
      } else {
        populate = false;
      }
    } else {
      populate = true;
    }
    if (self.selectedDeletion() === true) {
      populate = true;
      self.count(self.count() - 1);
      if (self.count() === "0") {
        self.selectedDeletion(false);
      }
    }
    self.activityId = self.messageTemplate.keyDTO.activityId;

    function populateFields() {
      if (self.messageTemplate.keyDTO.recipientCategory() !== null && self.messageTemplate.keyDTO.recipient() !== null)
        self.selectedRecipientType(self.messageTemplate.keyDTO.recipientCategory() + "-" + self.messageTemplate.keyDTO.recipient());
      if (self.alertType("M"))
        self.recipientAlertType("M");
      else
        self.recipientAlertType(self.messageTemplate.alertType());
      self.localeSelected(self.messageTemplate.keyDTO.locale());
      for (var j = 0; j < self.messageTemplate.messageTemplateDTO().length; j++) {
        if (self.messageTemplate.messageTemplateDTO()[j].destinationType() === "EMAIL") {
          if (self.messageTemplate.messageTemplateDTO()[j].id)
            emailTemplateId = self.messageTemplate.messageTemplateDTO()[j].id();
          if (self.messageTemplate.messageTemplateDTO()[j].version)
            emailVersion = self.messageTemplate.messageTemplateDTO()[j].version();
          self.emailSubject(self.messageTemplate.messageTemplateDTO()[j].subjectBuffer());
          self.emailContent(self.messageTemplate.messageTemplateDTO()[j].templateBuffer());
          if (self.messageTemplate.messageTemplateDTO()[j].dataAttributes) {
            self.emailAttributeList(self.messageTemplate.messageTemplateDTO()[j].dataAttributes());
            self.showEmailAttributeLabel(true);
          }
          if (self.mode() === "EDIT" || self.mode() === "CREATE") {
            self.saveEditEmail(true);
            self.templates.push("EMAIL");
          }
        } else if (self.messageTemplate.messageTemplateDTO()[j].destinationType() === "SECURE_MAIL_BOX") {
          if (self.messageTemplate.messageTemplateDTO()[j].id)
            secureEmailId = self.messageTemplate.messageTemplateDTO()[j].id();
          if (self.messageTemplate.messageTemplateDTO()[j].version)
            secureVersion = self.messageTemplate.messageTemplateDTO()[j].version();
          self.secureMailSubject(self.messageTemplate.messageTemplateDTO()[j].subjectBuffer());
          self.secureMailContent(self.messageTemplate.messageTemplateDTO()[j].templateBuffer());
          if (self.messageTemplate.messageTemplateDTO()[j].dataAttributes) {
            self.secureMailAttributeList(self.messageTemplate.messageTemplateDTO()[j].dataAttributes());
            self.showSecureAttributeLabel(true);
          }
          if (self.mode() === "EDIT" || self.mode() === "CREATE") {
            self.saveEditSecure(true);
            self.templates.push("SECURE_MAIL_BOX");
          }
        } else if (self.messageTemplate.messageTemplateDTO()[j].destinationType() === "SMS") {
          if (self.messageTemplate.messageTemplateDTO()[j].id)
            smsTemplateId = self.messageTemplate.messageTemplateDTO()[j].id();
          if (self.messageTemplate.messageTemplateDTO()[j].version)
            smsVersion = self.messageTemplate.messageTemplateDTO()[j].version();
          self.smsContent(self.messageTemplate.messageTemplateDTO()[j].templateBuffer());
          if (self.messageTemplate.messageTemplateDTO()[j].dataAttributes) {
            self.smsAttributeList(self.messageTemplate.messageTemplateDTO()[j].dataAttributes());
            self.showSmsAttributeLabel(true);
          }
          if (self.mode() === "EDIT" || self.mode() === "CREATE") {
            self.saveEditSms(true);
            self.templates.push("SMS");
          }
        } else if (self.messageTemplate.messageTemplateDTO()[j].destinationType() === "PUSH_NOTIFICATION") {
          if (self.messageTemplate.messageTemplateDTO()[j].id)
            pushTemplateId = self.messageTemplate.messageTemplateDTO()[j].id();
          if (self.messageTemplate.messageTemplateDTO()[j].version)
            pushVersion = self.messageTemplate.messageTemplateDTO()[j].version();
          self.pushTitle(self.messageTemplate.messageTemplateDTO()[j].subjectBuffer());
          self.pushContent(self.messageTemplate.messageTemplateDTO()[j].templateBuffer());
          if (self.messageTemplate.messageTemplateDTO()[j].dataAttributes) {
            self.pushAttributeList(self.messageTemplate.messageTemplateDTO()[j].dataAttributes());
            self.showPushAttributeLabel(true);
          }
          if (self.mode() === "EDIT" || self.mode() === "CREATE") {
            self.saveEditPush(true);
            self.templates.push("PUSH_NOTIFICATION");
          }
        }
      }
    }

    self.recipientTypeChangeHandler = function(event) {
      if (event.detail.value && event.detail.trigger === "option_selected") {
        self.messageTemplate.keyDTO.recipientCategory(event.detail.value.split("-")[0]);
        self.messageTemplate.keyDTO.recipient(event.detail.value.split("-")[1]);
        self.templates.removeAll();
        self.recipientAlertType("");
        self.localeSelected("");
        self.emailAttributeList.removeAll();
        self.secureMailAttributeList.removeAll();
        self.smsAttributeList.removeAll();
        emailTemplateId = null;
        secureEmailId = null;
        smsTemplateId = null;
        pushTemplateId = null;
      }
    };
    self.recipientAlertTypeChangeHandler = function(event) {
      if (event.detail.value && event.detail.trigger === "option_selected") {
        self.messageTemplate.alertType(event.detail.value);
      }
    };
    self.localeChangeHandler = function(event) {
      if (event.detail.value && event.detail.trigger === "option_selected") {
        self.messageTemplate.keyDTO.locale(event.detail.value);
        self.templates.removeAll();
        self.recipientAlertType("");
        self.emailAttributeList.removeAll();
        self.secureMailAttributeList.removeAll();
        self.smsAttributeList.removeAll();
        emailTemplateId = null;
        secureEmailId = null;
        smsTemplateId = null;
        pushTemplateId = null;
      }
    };
    var node = {
      label: "Select",
      value: "Select",
      children: []
    };
    self.checkCompletion = ko.observable(1);
    var checkCompletionDispose = self.checkCompletion.subscribe(function(newValue) {
      if (newValue === 0) {
        self.recipientTypes.push(node);
        self.checkSelect(true);
      }
    });
    var getChildArray = function(recipientObjects) {
      var objectToPopulate = [];
      if (recipientObjects) {
        TemplateCycleModel.getRecipient(recipientObjects).done(function(datarec) {
          if (datarec.enumRepresentations[0].data.length > 0) {
            for (var a = 0; a < datarec.enumRepresentations.length; a++) {
              for (var b = 0; b < datarec.enumRepresentations[a].data.length; b++) {
                objectToPopulate.push({
                  label: datarec.enumRepresentations[a].data[b].description,
                  value: recipientObjects + "-" + datarec.enumRepresentations[a].data[b].code
                });
              }
              self.checkCompletion(self.checkCompletion() - 1);
            }
          } else {
            self.checkCompletion(self.checkCompletion() - 1);
          }
        });
      }
      return objectToPopulate;
    };

    function messageServiceCalls() {
      TemplateCycleModel.getRecipientCategory().done(function(data) {
        for (var i = 0; i < data.enumRepresentations.length; i++) {
          self.checkCompletion(data.enumRepresentations[i].data.length);
          for (var j = 0; j < data.enumRepresentations[i].data.length; j++) {
            node.children.push({
              label: data.enumRepresentations[i].data[j].description,
              children: getChildArray(data.enumRepresentations[i].data[j].code, data.enumRepresentations[i].data[j].description)
            });
          }
        }
      });
      TemplateCycleModel.getDestinationType().done(function(data) {
        self.destinationTypes.removeAll();
        for (var i = 0; i < data.enumRepresentations.length; i++) {
          for (var j = 0; j < data.enumRepresentations[i].data.length; j++) {
            self.destinationTypes.push({
              description: data.enumRepresentations[i].data[j].description,
              code: data.enumRepresentations[i].data[j].code,
              template: data.enumRepresentations[i].data[j].code + "-template"
            });
          }
        }
      });
      TemplateCycleModel.getLocale().done(function(data) {
        self.locales.removeAll();
        for (var i = 0; i < data.enumRepresentations.length; i++) {
          for (var j = 0; j < data.enumRepresentations[i].data.length; j++) {
            self.locales.push({
              description: data.enumRepresentations[i].data[j].description,
              code: data.enumRepresentations[i].data[j].code
            });
          }
        }
        self.localeLoaded(true);
      });
      TemplateCycleModel.fetchDataAttributeList(self.activityId()).done(function(data) {
        var serviceAttributeDTOS = data.serviceAttributeDTOs;
        ko.utils.arrayForEach(serviceAttributeDTOS, function(serviceAttributeDTO) {
          var model = self.getNewAttributeKoModel();
          if (serviceAttributeDTO.genericAttribute.dataType !== "java.lang.String") {
            notString.push(serviceAttributeDTO.genericAttribute.keyDTO.id);
          }
          model.serviceAttributeId = serviceAttributeDTO.keyDTO.id;
          model.attributeName = serviceAttributeDTO.genericAttribute.name;
          model.attributeId = serviceAttributeDTO.genericAttribute.keyDTO.id;
          self.dataAttributeList.push(model);
          self.emailAttributes.push(model);
          self.secureAttributes.push(model);
          self.smsAttributes.push(model);
          self.pushAttributes.push(model);
        });
      });
    }
    if (self.mode() === "CREATE" || self.mode() === "EDIT") {
      messageServiceCalls();
    }

    self.payload = ko.observable(self.getNewAttributeKoModel());
    self.destinationChangeHandler = function(event) {
      if (event.detail.value) {
        self.messageTemplate.messageTemplateDTO.destinationType = event.detail.value;
        self.messageTemplate.keyDTO.destinationType = event.detail.value;
        if (event.detail.value === "SMS") {
          self.showSubject(false);
          self.subject("");
        } else {
          self.showSubject(true);
        }
      }
    };
    self.recipientCategoryChangeHandler = function(event) {
      if (event.detail.value) {
        TemplateCycleModel.getRecipient(event.detail.value).done(function(data) {
          self.selectedRecipient.removeAll();
          self.recipients.removeAll();
          for (var i = 0; i < data.enumRepresentations.length; i++) {
            for (var j = 0; j < data.enumRepresentations[i].data.length; j++) {
              self.recipients.push({
                description: data.enumRepresentations[i].data[j].description,
                code: data.enumRepresentations[i].data[j].code
              });
            }
          }
        });
        self.messageTemplate.keyDTO.recipientCategory = event.detail.value;
      }
    };
    self.recipientChangeHandler = function(event) {
      if (event.detail.value) {
        self.messageTemplate.keyDTO.recipient = event.detail.value;
      }
    };

    self.add = function(destinationAttribute, value) {
      var tracker = document.getElementById("tracker");
      if (tracker.valid === "valid") {

      self.attributeSelectionOrder = self.attributeSelectionOrder + 1;
      self.attributeMaskEnable.push(false);
      if (!Params.baseModel.showComponentValidationErrors(self.invalidTracker())) {
        return;
      }
      var model = self.getNewAttributeKoModel();
      var dataSourceModel = self.getNewDataSourceKoModel();
      var attributeId;
      if (value === "EMAIL") {
        model.attributeMask = self.emailAttributeMask();
        model.attributeId = self.emailAttributeId();
        attributeId = self.emailAttributeId();
        self.templateId = emailTemplateId;
      } else if (value === "SECURE") {
        model.attributeMask = self.secureAttributeMask();
        model.attributeId = self.secureAttributeId();
        attributeId = self.secureAttributeId();
        self.templateId = secureEmailId;
      } else if (value === "SMS") {
        model.attributeMask = self.smsAttributeMask();
        model.attributeId = self.smsAttributeId();
        attributeId = self.smsAttributeId();
        self.templateId = smsTemplateId;
      } else if (value === "PUSH_NOTIFICATION") {
        model.attributeMask = self.pushAttributeMask();
        model.attributeId = self.pushAttributeId();
        attributeId = self.pushAttributeId();
        self.templateId = pushTemplateId;
      }
      model.messageTemplateId = self.templateId;
      dataSourceModel.serviceAttributeId = ko.observable("");
      dataSourceModel.activityId = "";
      dataSourceModel.attributeId = model.attributeId;
      dataSourceModel.messageTemplateId = model.messageTemplateId;
      model.dataSources = ko.observableArray();
      model.dataSources.push(dataSourceModel);
      ko.utils.arrayForEach(self.dataAttributeList(), function(attribute) {
        if (attribute.attributeId === attributeId) {
          model.attributeId = attributeId;
          model.messageTemplateId = self.templateId;
          model.dataSources()[0].serviceAttributeId(attribute.serviceAttributeId);
          model.dataSources()[0].activityId = self.activityId();
          model.dataSources()[0].attributeId = attributeId;
          model.dataSources()[0].messageTemplateId = self.templateId;
        }
      });
      destinationAttribute.push(model);
      if (value === "EMAIL")
        self.buttonToDropDownEmail(false);
      else if (value === "SECURE")
        self.buttonToDropDownSecure(false);
      else if (value === "SMS")
        self.buttonToDropDownSms(false);
      else if (value === "PUSH_NOTIFICATION")
        self.buttonToDropDownPush(false);

      }else{
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
    self.attributeSelected = function(event) {
      if (event.detail.value && event.detail.trigger === "option_selected") {
        if (notString.includes(event.detail.value)) {
          self.attributeMaskEnable.push(true);
          if (self.messageTransmissionMode === "EMAIL")
            self.emailAttributeMask("D");
          else if (self.messageTransmissionMode === "SECURE")
            self.secureAttributeMask("D");
          else
            self.smsAttributeMask("D");
          self.attributeSelectionOrder = self.attributeSelectionOrder + 1;
        }
      }
    };
    self.addRow = function(attributes, attributeModel, value) {
      self.attributeSelectionOrder = self.attributeSelectionOrder + 1;
      self.attributeMaskEnable.push(false);
      self.attributesFilter = ko.computed(function() {
        attributes.removeAll();
        var temp;
        return ko.utils.arrayFilter(self.dataAttributeList(), function(dataItem) {
          temp = true;
          ko.utils.arrayForEach(attributeModel(), function(attributeAdded) {
            if (typeof attributeAdded.attributeId === "function") {
              if (dataItem.attributeId === attributeAdded.attributeId())
                temp = false;
            } else if (dataItem.attributeId === attributeAdded.attributeId)
              temp = false;
          });
          if (temp)
            attributes.push(dataItem);
        });
      }, this);
      self.messageTransmissionMode = value;
      if (value === "EMAIL") {
        self.showEmailAttributeLabel(true);
        self.emailAttributeId("");
        self.emailAttributeMask("");
        self.buttonToDropDownEmail(true);
      } else if (value === "SECURE") {
        self.showSecureAttributeLabel(true);
        self.secureAttributeId("");
        self.secureAttributeMask("");
        self.buttonToDropDownSecure(true);
      } else if (value === "SMS") {
        self.showSmsAttributeLabel(true);
        self.smsAttributeId("");
        self.smsAttributeMask("");
        self.buttonToDropDownSms(true);
      } else if (value === "PUSH_NOTIFICATION") {
        self.showPushAttributeLabel(true);
        self.pushAttributeId("");
        self.pushAttributeMask("");
        self.buttonToDropDownPush(true);
      }
    };
    self.deleteAttribute = function(index, value, data) {
      if (value === "EMAIL") {
        self.emailAttributeList.remove(function(serviceAttribute) {
          return serviceAttribute === data;
        });
        if (self.emailAttributeList().length === 0) {
          self.showEmailAttributeLabel(false);
        }
      } else if (value === "SECURE") {
        self.secureMailAttributeList.remove(function(serviceAttribute) {
          return serviceAttribute === data;
        });
        if (self.secureMailAttributeList().length === 0) {
          self.showSecureAttributeLabel(false);
        }
      } else if (value === "SMS") {
        self.smsAttributeList.remove(function(serviceAttribute) {
          return serviceAttribute === data;
        });
        if (self.smsAttributeList().length === 0) {
          self.showSmsAttributeLabel(false);
        }
      } else if (value === "PUSH_NOTIFICATION") {
        self.pushAttributeList.remove(function(serviceAttribute) {
          return serviceAttribute === data;
        });
        if (self.pushAttributeList().length === 0) {
          self.showPushAttributeLabel(false);
        }
      }
    };
    var enableAll = false;
    var templatesDispose = self.templates.subscribe(function(newValue) {
      var messageDto;
      var messageListDTO = ko.observableArray();
      self.messageTemplate.messageTemplateDTO = messageListDTO;
      self.showTemplateEmail(false);
      self.showTemplateSecure(false);
      self.showTemplateSms(false);
      self.showTemplatePush(false);
      enableAll = true;
      for (var i = 0; i < newValue.length; i++) {
        if (newValue[i] === "EMAIL") {
          messageDto = TemplateCycleModel.getNewModel();
          if (emailTemplateId)
            messageDto.id = ko.observable(emailTemplateId);
          if (emailVersion)
            messageDto.version = ko.observable(emailVersion);
          messageDto.destinationType = ko.observable("EMAIL");
          messageDto.subjectBuffer = self.emailSubject;
          messageDto.templateBuffer = self.emailContent;
          messageDto.dataAttributes = self.emailAttributeList;
          messageListDTO.push(messageDto);
          self.messageTemplate.messageTemplateDTO = messageListDTO;
          self.showTemplateEmail(true);
          if (self.saveEditEmail())
            enableAll = true;
          else
            enableAll = false;
          self.emailDisable(false);
          self.secureDisable(true);
          self.smsDisable(true);
        } else if (newValue[i] === "SECURE_MAIL_BOX") {
          messageDto = TemplateCycleModel.getNewModel();
          if (secureEmailId)
            messageDto.id = ko.observable(secureEmailId);
          if (secureVersion)
            messageDto.version = ko.observable(secureVersion);
          messageDto.destinationType = ko.observable("SECURE_MAIL_BOX");
          messageDto.subjectBuffer = self.secureMailSubject;
          messageDto.templateBuffer = self.secureMailContent;
          messageDto.dataAttributes = self.secureMailAttributeList;
          messageListDTO.push(messageDto);
          self.messageTemplate.messageTemplateDTO = messageListDTO;
          self.showTemplateSecure(true);
          if (self.saveEditSecure())
            enableAll = true;
          else
            enableAll = false;
          self.emailDisable(true);
          self.secureDisable(false);
          self.smsDisable(true);
        } else if (newValue[i] === "SMS") {
          messageDto = TemplateCycleModel.getNewModel();
          if (smsTemplateId)
            messageDto.id = ko.observable(smsTemplateId);
          if (smsVersion)
            messageDto.version = ko.observable(smsVersion);
          messageDto.destinationType = ko.observable("SMS");
          messageDto.templateBuffer = self.smsContent;
          messageDto.dataAttributes = self.smsAttributeList;
          messageListDTO.push(messageDto);
          self.messageTemplate.messageTemplateDTO = messageListDTO;
          self.showTemplateSms(true);
          if (self.saveEditSms())
            enableAll = true;
          else
            enableAll = false;
          self.emailDisable(true);
          self.secureDisable(true);
          self.smsDisable(false);
        } else if (newValue[i] === "PUSH_NOTIFICATION") {
          messageDto = TemplateCycleModel.getNewModel();
          if (pushTemplateId)
            messageDto.id = ko.observable(pushTemplateId);
          if (pushVersion)
            messageDto.version = ko.observable(pushVersion);
          messageDto.destinationType = ko.observable("PUSH_NOTIFICATION");
          messageDto.subjectBuffer = self.pushTitle;
          messageDto.templateBuffer = self.pushContent;
          messageDto.dataAttributes = self.pushAttributeList;
          messageListDTO.push(messageDto);
          self.messageTemplate.messageTemplateDTO = messageListDTO;
          self.showTemplatePush(true);
          if (self.saveEditPush())
            enableAll = true;
          else
            enableAll = false;
          self.emailDisable(true);
          self.secureDisable(true);
          self.smsDisable(true);
          self.pushDisable(false);
        }
      }
      if (enableAll) {
        self.emailDisable(false);
        self.secureDisable(false);
        self.smsDisable(false);
        self.pushDisable(false);
      }
      if (!self.showTemplateEmail()) {
        self.emailSubject("");
        self.emailContent("");
        self.emailAttributeList.removeAll();
        self.saveEditEmail(false);
      }
      if (!self.showTemplateSecure()) {
        self.secureMailSubject("");
        self.secureMailContent("");
        self.secureMailAttributeList.removeAll();
        self.saveEditSecure(false);
        self.copyContent.push("");
      }
      if (!self.showTemplateSms()) {
        self.smsContent("");
        self.smsAttributeList.removeAll();
        self.saveEditSms(false);
      }
      if (!self.showTemplatePush()) {
        self.pushContent("");
        self.pushTitle("");
        self.pushAttributeList.removeAll();
        self.saveEditPush(false);
      }
    });
    if (populate) {
      populateFields();
    }
    var copyContentDispose = self.copyContent.subscribe(function(newValue) {
      if (newValue[0] === "checked") {
        self.secureMailSubject(self.emailSubject());
        self.copyVar(self.emailContent());
      } else if (newValue.length === 0) {
        self.secureMailSubject("");
        self.copyVar("");
      }
    });
    self.saveEmail = function() {
      var trackeremail = document.getElementById("emailtracker");
      if (trackeremail.valid === "valid") {

        var temp= self.emailContent().replace(/\s/g, "").replace(/<p>/g, "").replace(/<\/p>/g, "");
        if(!temp.length)
        {
          Params.baseModel.showMessages(null, [self.nls.message_template.messageTextError], "ERROR");
          return;
        }
      if (!Params.baseModel.showComponentValidationErrors(self.invalidTracker())) {
        self.editorValidator()[self.index].validateEmail()();
        return;
      }
      self.saveEditEmail(true);
      self.emailDisable(false);
      self.secureDisable(false);
      self.smsDisable(false);
      self.pushDisable(false);

    }
    else {
      trackeremail.showMessages();
      trackeremail.focusOn("@firstInvalidShown");
    }
    };
    self.saveSecure = function() {
      var securetracker = document.getElementById("mailboxtracker");
      if (securetracker.valid === "valid") {

        var temp= self.secureMailContent().replace(/\s/g, "").replace(/<p>/g, "").replace(/<\/p>/g, "");

        if(!temp.length)
        {
          Params.baseModel.showMessages(null, [self.nls.message_template.messageTextError], "ERROR");
          return;
        }
      if (!Params.baseModel.showComponentValidationErrors(self.invalidTracker())) {
        self.editorValidator()[self.index].validateSecure()();
        return;
      }
      self.saveEditSecure(true);
      self.emailDisable(false);
      self.secureDisable(false);
      self.smsDisable(false);
      self.pushDisable(false);
    }else {
      securetracker.showMessages();
      securetracker.focusOn("@firstInvalidShown");
    }
    };
    self.saveSms = function() {
      var smstracker = document.getElementById("smstracker");
      if (smstracker.valid === "valid") {
        var temp= self.smsContent().replace(/\s/g, "").replace(/<p>/g, "").replace(/<\/p>/g, "");

        if(!temp.length)
        {
          Params.baseModel.showMessages(null, [self.nls.message_template.messageTextError], "ERROR");
          return;
        }
      if (!Params.baseModel.showComponentValidationErrors(self.invalidTracker())) {
        self.editorValidator()[self.index].validateSms()();
        return;
      }
      self.saveEditSms(true);
      self.emailDisable(false);
      self.secureDisable(false);
      self.smsDisable(false);
      self.pushDisable(false);
    }else{
      smstracker.showMessages();
      smstracker.focusOn("@firstInvalidShown");
    }
    };
    self.savePush = function() {
      var pushtracker = document.getElementById("pushtracker");
      if (pushtracker.valid === "valid") {
        var temp= self.pushContent().replace(/\s/g, "").replace(/<p>/g, "").replace(/<\/p>/g, "");

        if(!temp.length)
        {
          Params.baseModel.showMessages(null, [self.nls.message_template.messageTextError], "ERROR");
          return;
        }
      self.saveEditPush(true);
      self.emailDisable(false);
      self.secureDisable(false);
      self.smsDisable(false);
      self.pushDisable(false);
    }
    else{
      pushtracker.showMessages();
      pushtracker.focusOn("@firstInvalidShown");
    }
    };
    self.editEmail = function() {
      self.saveEditEmail(false);
      self.saveEditSecure(true);
      self.saveEditSms(true);
      self.saveEditPush(true);
      self.emailDisable(false);
      self.secureDisable(true);
      self.smsDisable(true);
      self.pushDisable(true);
    };
    self.editSecure = function() {
      self.saveEditEmail(true);
      self.saveEditSecure(false);
      self.saveEditSms(true);
      self.saveEditPush(true);
      self.emailDisable(true);
      self.secureDisable(false);
      self.smsDisable(true);
      self.pushDisable(true);
    };
    self.editSms = function() {
      self.saveEditEmail(true);
      self.saveEditSecure(true);
      self.saveEditPush(true);
      self.saveEditSms(false);
      self.emailDisable(true);
      self.secureDisable(true);
      self.smsDisable(false);
      self.pushDisable(true);
    };
    self.editPush = function() {
      self.saveEditEmail(true);
      self.saveEditSecure(true);
      self.saveEditSms(true);
      self.saveEditPush(false);
      self.emailDisable(true);
      self.secureDisable(true);
      self.smsDisable(true);
      self.pushDisable(false);
    };
    self.dispose = function() {
      if (self.attributesFilter)
        self.attributesFilter.dispose();
      checkCompletionDispose.dispose();
      templatesDispose.dispose();
      copyContentDispose.dispose();
    };
  };
});
