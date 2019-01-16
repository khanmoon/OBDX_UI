define([
  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/file-identifier-create",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojradioset"
], function(ko, $, FiRegistrationModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.Nls = resourceBundle.fileIdentifierCreate;
    rootParams.baseModel.registerComponent("review-file-identifier-create", "file-upload");
    var getNewKoModel = function() {
      var KoModel = FiRegistrationModel.getNewModel();
      return ko.mapping.fromJS(KoModel);
    };
    rootParams.dashboard.headerName(self.Nls.fIMaintenance);
    self.partyId = ko.observable();
    self.validationTracker = ko.observable();
    var clause = true;
    if (self.fiRegistrationPayload)
      clause = false;
    self.templates = self.templates || ko.observableArray();
    self.debitAccountNumbers = self.debitAccountNumbers || ko.observableArray();
    self.templatesMap = self.templatesMap || {};
    self.isTemplateChanged = self.isTemplateChanged || ko.observable(false);
    self.selectedTemplate = self.selectedTemplate || ko.observable();
    self.isTemplatesLoaded = self.isTemplatesLoaded || ko.observable(false);
    self.isFileFormatTypesLoaded = self.isFileFormatTypesLoaded || ko.observable(false);
    self.isAccountTypesLoaded = self.isAccountTypesLoaded || ko.observable(false);
    self.isFileTypesLoaded = self.isFileTypesLoaded || ko.observable(false);
    self.fileFormatTypesMap = self.fileFormatTypesMap || {};
    self.accountTypesMap = self.accountTypesMap || {};
    self.fileTypesMap = self.fileTypesMap || {};
    self.isDisabled = self.isDisabled || ko.observable(false);
    self.isDebitAccountsLoaded = self.isDebitAccountsLoaded || ko.observable(true);
    self.debitAccountsMap = self.debitAccountsMap || {};
    self.isTemplateValid = self.isTemplateValid || ko.observable(false);
    self.isAccountTypeValid = self.isAccountTypeValid || ko.observable(false);
    self.admin = ko.observable();
    self.headers = [
      self.Nls.fuid,
      self.Nls.review,
      self.Nls.success
    ];
    self.fiRegistrationPayload = self.fiRegistrationPayload || getNewKoModel().partyFiRegistrationModel;
    if (clause) {
      FiRegistrationModel.getFileTypes().done(function(data) {
        for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.fileTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
        }
        self.isFileTypesLoaded(true);
      });
      FiRegistrationModel.getFileFormatTypes().done(function(data) {
        for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.fileFormatTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
        }
        self.isFileFormatTypesLoaded(true);
      });
      FiRegistrationModel.getAccountingTypes().done(function(data) {
        for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.accountTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
        }
        self.isAccountTypesLoaded(true);
      });
      self.getCorpTemplate = function() {
        FiRegistrationModel.listTemplates().done(function(data) {
          for (var i = 0; i < data.listResponseDTO.length; i++) {
            self.templates.push(data.listResponseDTO[i].templateDTO);
            self.templatesMap[data.listResponseDTO[i].templateDTO.templateId] = data.listResponseDTO[i].templateDTO;
          }
          self.isTemplatesLoaded(true);
        });
      };

      self.getAdminTemplate = function() {
        FiRegistrationModel.listAdminTemplates().done(function(data) {
          for (var i = 0; i < data.listResponseDTO.length; i++) {
            self.templates.push(data.listResponseDTO[i].templateDTO);
            self.templatesMap[data.listResponseDTO[i].templateDTO.templateId] = data.listResponseDTO[i].templateDTO;
          }
          self.isTemplatesLoaded(true);
        });
      };
      if (self.partyDetail) {
        self.getCorpTemplate();
        self.admin(false);
      } else {
        self.getAdminTemplate();
        self.admin(true);
      }

      if (self.partyDetail) {
        FiRegistrationModel.listDebitAccountNumbers(self.partyDetail.party.value()).done(function(data) {
          self.isDebitAccountsLoaded(false);
          for (var i = 0; i < data.accounts[0].accountsList.length; i++) {
            self.debitAccountsMap[data.accounts[0].accountsList[i].accountNumber.value] = data.accounts[0].accountsList[i].accountNumber.displayValue;
            self.debitAccountNumbers.push({
              displayValue: data.accounts[0].accountsList[i].accountNumber.displayValue,
              code: data.accounts[0].accountsList[i].accountNumber.value
            });
          }
          self.isDebitAccountsLoaded(true);
        });
      }
    }
    self.onTemplateChanged = function(event) {
      if (event.detail.value) {
        self.selectedTemplate(self.templatesMap[event.detail.value]);
        self.fiRegistrationPayload.approvalType(null);
        self.isDisabled(false);
        self.isAccountTypeValid(true);
        if (self.selectedTemplate().fiLevelAcct === "Y") {
          self.isTemplateValid(true);
        } else {
          self.isTemplateValid(false);
        }
        if (self.selectedTemplate().accountingType === "SDMC") {
          self.isAccountTypeValid(false);
          self.fiRegistrationPayload.approvalType("F");
          self.isDisabled(true);
        }
        if (self.selectedTemplate().accountingType === "MDMC") {
          self.fiRegistrationPayload.approvalType("R");
          self.isDisabled(true);
        }
        if (self.selectedTemplate().financial === false) {
          self.isAccountTypesLoaded(false);
        } else {
          self.isAccountTypesLoaded(true);
        }
        self.isTemplateChanged(true);
      }
    };
    self.initiate = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      if (self.fiRegistrationPayload.approvalType() === null) {
        rootParams.baseModel.showMessages(null, [self.Nls.selectAprrovalType], "INFO");
        return;
      }
      self.fiRegistrationPayload.templateId(self.fiRegistrationPayload.templateId() + "");
      if (self.partyDetail) {
        self.fiRegistrationPayload.partyId(self.partyDetail.party.value());
      }
      self.fiRegistrationPayload.approvalType(self.fiRegistrationPayload.approvalType() + "");
      if (self.fiRegistrationPayload.debitAccountNumber())
        self.fiRegistrationPayload.debitAccountNumber(self.fiRegistrationPayload.debitAccountNumber() + "");
      self.fiRegistrationPayloadToSend = ko.mapping.toJS(self.fiRegistrationPayload);
      rootParams.dashboard.loadComponent("review-file-identifier-create", {
        mode: "review",
        data: self.fiRegistrationPayloadToSend
      }, self);
    };
    self.submit = function() {
      var partyId = null;
      if (self.partyDetail) {
        partyId = self.fiRegistrationPayload.partyId();
      } else {
        partyId = "ADMIN";
      }
      var fiRegistrationPayload = ko.toJSON(self.fiRegistrationPayloadToSend);
      FiRegistrationModel.registerFiPayment(fiRegistrationPayload, partyId).done(function(data, status, jqXhr) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.Nls.transactionName
        }, self);
      });
    };
    self.clearData = function() {
      self.fiRegistrationPayload = getNewKoModel().partyFiRegistrationModel;
      self.isTemplateChanged(false);
      self.selectedTemplate(null);
    };
    self.back = function() {
      history.go(-1);
    };

    if (self.partyDetails) {
      if (!self.partyDetail.partyId()) {
        self.clearData();
      }
    }
  };
});
