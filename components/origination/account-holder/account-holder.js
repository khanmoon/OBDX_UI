define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!resources/nls/account-holder",
  "ojs/ojinputtext",
  "ojs/ojbutton"
], function(oj, ko, $, AccountHolderModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      AccountHolderModel = new AccountHolderModelObject(),
      i = 0,
      getNewKoModel = function() {
        var KoModel = AccountHolderModel.getNewModel();
        KoModel.answer = ko.observable("");
        KoModel.savingsHolderConfiguration.accountHolderPreferenceDTO[0].embossName = ko.observable("");
        KoModel.savingsHolderConfiguration.accountHolderPreferenceDTO[0].chequeBookLeaves = ko.observable("");
        KoModel.savingsHolderConfiguration.accountHolderPreferenceDTO[0].statementFrequency = ko.observable("");
        KoModel.savingsHolderConfiguration.accountHolderPreferenceDTO[0].cardType = ko.observable("");
        return KoModel;
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.applicantObject = ko.observable(rootParams.applicantObject);
    self.isChequeBookNeeded = ko.observable("OPTION_NO");
    self.isDebitCardNeeded = ko.observable("OPTION_NO");
    self.existingAccountConfig = ko.observable();
    self.existingAccountConfigLoaded = ko.observable(false);
    self.existingDebitPreferences = ko.observable(false);
    self.dialogTitle = ko.observable("");
    self.dialogMessage = ko.observable("");
    self.validationTracker = ko.observable();
    self.numberOfLeaves = ko.observable();
    self.statementFrequency = ko.observable();
    self.isStatementNeeded = ko.observable("OPTION_NO");
    self.showAcccountHolderPref = ko.observable(false);
    self.statementFrequencyData = ko.observableArray([]);
    self.numberOfLeavesOptions = ko.observableArray();
    self.cardDesignList = ko.observableArray([]).extend({
      loaded: false
    });


    self.isDebitCardNeededShowHide = function(event) {
      if (event.detail.value === "OPTION_NO") {
        self.isDebitCardNeeded("OPTION_NO");
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].debitCardRequired = false;
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].embossName("");
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].cardType("");
      }
      if (event.detail.value === "OPTION_YES") {
        self.isDebitCardNeeded("OPTION_YES");
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].debitCardRequired = true;
      }
    };
    self.isChequeBookNeededShowHide = function(event) {
      if (event.detail.value === "OPTION_NO") {
        self.isChequeBookNeeded("OPTION_NO");
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].chequeBookRequired = false;
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].chequeBookLeaves("");
      }
      if (event.detail.value === "OPTION_YES") {
        self.isChequeBookNeeded("OPTION_YES");
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].chequeBookRequired = true;
      }
    };
    self.isStatementNeededShowHide = function(event) {
      if (event.detail.value === "OPTION_NO") {
        self.isStatementNeeded("OPTION_NO");
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].statementRequired = false;
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].statementFrequency("");
      }
      if (event.detail.value === "OPTION_YES") {
        self.isStatementNeeded("OPTION_YES");
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].statementRequired = true;
      }
    };
    self.initializeModel = function() {
      AccountHolderModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value);
      AccountHolderModel.getNumberOfLeavesList().done(function(data) {
        self.numberOfLeavesOptions(data.enumRepresentations[0].data);
        AccountHolderModel.getExistingAccountConfig(self.productDetails().submissionId.value, self.applicantObject().applicantId().value).then(function(data) {
          if (data.accountConfigDTO) {
            self.existingAccountConfig(data.accountConfigDTO);
            if (!self.applicantObject().accountHolder) {
              self.applicantObject().accountHolder = getNewKoModel();
            }
            if (self.existingAccountConfig().accountHolderPreferenceDTO) {
              for (var j = 0; j < self.existingAccountConfig().accountHolderPreferenceDTO.length; j++) {
                if (self.existingAccountConfig().accountHolderPreferenceDTO[j]) {
                  if (self.existingAccountConfig().accountHolderPreferenceDTO[0].embossName) {
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].embossName(self.existingAccountConfig().accountHolderPreferenceDTO[0].embossName);
                  }
                  if (self.existingAccountConfig().accountHolderPreferenceDTO[0].chequeBookLeaves) {
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].chequeBookLeaves(JSON.stringify(self.existingAccountConfig().accountHolderPreferenceDTO[0].chequeBookLeaves));
                  }
                  if (self.existingAccountConfig().accountHolderPreferenceDTO[0].statementFrequency) {
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].statementFrequency(self.existingAccountConfig().accountHolderPreferenceDTO[0].statementFrequency);
                  }
                  if (self.existingAccountConfig().accountHolderPreferenceDTO[0].debitCardRequired === true) {
                    self.isDebitCardNeeded("OPTION_YES");
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].debitCardRequired = true;
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].cardType(self.existingAccountConfig().accountHolderPreferenceDTO[0].cardType);
                  } else {
                    self.isDebitCardNeeded("OPTION_NO");
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].debitCardRequired = false;
                  }
                  if (self.existingAccountConfig().accountHolderPreferenceDTO[0].chequeBookRequired === true) {
                    self.isChequeBookNeeded("OPTION_YES");
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].chequeBookRequired = true;
                  } else {
                    self.isChequeBookNeeded("OPTION_NO");
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].chequeBookRequired = false;
                  }
                  if (self.existingAccountConfig().accountHolderPreferenceDTO[0].statementRequired === true) {
                    self.isStatementNeeded("OPTION_YES");
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].statementRequired = true;
                  } else {
                    self.isStatementNeeded("OPTION_NO");
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].statementRequired = false;
                  }
                }
              }
            }
            AccountHolderModel.getStatementFrequencyType().done(function(data) {
              for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.statementFrequencyData().push({
                  code: data.enumRepresentations[0].data[i].code,
                  description: data.enumRepresentations[0].data[i].description
                });
              }
              if (self.existingAccountConfig().accountHolderPreferenceDTO && self.existingAccountConfig().accountHolderPreferenceDTO[0] && self.existingAccountConfig().accountHolderPreferenceDTO[0].statementFrequency) {
                self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].statementFrequency(self.existingAccountConfig().accountHolderPreferenceDTO[0].statementFrequency);
              }
              AccountHolderModel.getCardDesignList().done(function(data) {
                self.cardDesignList(data.enumRepresentations[0].data);
                self.showAcccountHolderPref(true);
              });
            });
          }
        });
      });
    };
    self.initializeModel();
    self.saveAccountHolderInfo = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      self.applicantObject().accountHolder.savingsHolderConfiguration.partyId.value = self.applicantObject().applicantId().value;
      self.applicantObject().accountHolder.savingsHolderConfiguration.submissionId = self.productDetails().submissionId.value;
      self.applicantObject().accountHolder.savingsHolderConfiguration.offerCurrency = rootParams.baseModel.getLocaleValue("localCurrency");
      if (self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].chequeBookLeaves) {
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].chequeBookLeaves(self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].chequeBookLeaves());
      }
      if (self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].statementFrequency) {
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].statementFrequency(self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].statementFrequency());
        self.applicantObject().accountHolder.selectedValues.statementFrequency = rootParams.baseModel.getDescriptionFromCode(self.statementFrequencyData(), self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].statementFrequency());
      }
      if (self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].debitCardRequired === "OPTION_YES" || self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].debitCardRequired) {
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].debitCardRequired = true;
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].cardType(self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].cardType());
        self.applicantObject().accountHolder.selectedValues.cardType = rootParams.baseModel.getDescriptionFromCode(self.cardDesignList(), self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].cardType());
      } else {
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].debitCardRequired = false;
      }
      if (self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].chequeBookRequired === "OPTION_YES" || self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].chequeBookRequired) {
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].chequeBookRequired = true;
      } else {
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].chequeBookRequired = false;
      }
      if (self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].statementRequired === "OPTION_YES" || self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].statementRequired) {
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].statementRequired = true;
      } else {
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].statementRequired = false;
      }
      AccountHolderModel.saveAccountConfiguration(self.applicantObject().accountHolder.savingsHolderConfiguration.submissionId, self.applicantObject().accountHolder.savingsHolderConfiguration.partyId.value, ko.toJSON(self.applicantObject().accountHolder.savingsHolderConfiguration)).done(function() {
        self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
      });
    };
    self.errorHandler = function() {
      self.dialogTitle(self.resource.error);
      self.dialogMessage(self.resource.errorContacting);
      self.handleOpen();
    };
    self.handleOpen = function() {
      $("#dialog").ojDialog("open");
    };
  };
});
