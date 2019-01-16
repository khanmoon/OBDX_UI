define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!resources/nls/account-funding",
  "ojs/ojradioset"
], function(oj, ko, $, AccountFundingModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      AccountFundingModel = new AccountFundingModelObject(),
      count = 0,
      getNewKoModel = function() {
        var KoModel = AccountFundingModel.getNewModel();
        KoModel.selectedLinkedAccount = {
          id: {
            value: "",
            displayValue: ""
          }
        };
        KoModel.interestRate = ko.observable(KoModel.interestRate);
        return KoModel;
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.applicantObject = ko.observable(rootParams.applicantObject);
    rootParams.baseModel.registerComponent("loan-tenure", "origination");
    self.clearfrequency = ko.observable(true);
    self.fundingType = ko.observable("");
    self.fundingOptionsList = ko.observableArray();
    self.fundingOtionsListLoaded = ko.observable(false);
    self.casaOwnAccountList = ko.observableArray();
    self.casaOwnAccountListLoaded = ko.observable(false);
    self.linkedAccountList = ko.observableArray();
    self.linkedAccountListLoaded = ko.observable(false);
    self.changeLinkedAccount = ko.observable(false);
    self.debitCardFormatsList = ko.observableArray();
    self.creditCardFormatsList = ko.observableArray();
    self.cardFormatsListListLoaded = ko.observable(false);
    self.expiryDateMonth = ko.observableArray();
    self.expiryDateYear = ko.observableArray();
    self.currentCardType = ko.observable("");
    self.currentCardformat = "";
    self.minimumAmount = ko.observable("");
    self.frequencyOptionsLoaded = ko.observable(false);
    self.repaymentFrequencyData = ko.observableArray();
    self.cardName = ko.observable("");
    self.aanNumber = ko.observable("");
    self.expiryMonth = ko.observable("");
    self.expiryYear = ko.observable("");
    self.cvv = ko.observable("");
    self.cardOptionsRefreshed = ko.observable(true);
    self.cardTypeRefreshed = ko.observable(true);
    self.fundingOptionsLoaded = ko.observable(false);
    self.mandatoryFlag = ko.observable(true);
    self.minimumAmountLoaded = ko.observable(false);
    self.initialAmount = {
      amount: "",
      currency: rootParams.baseModel.getLocaleValue("localCurrency")
    };
    self.initialAmount.amount = ko.observable(self.initialAmount.amount);
    self.cardMaxLength = ko.observable("19");
    self.cardUnmaskedBits = "0";
    self.selectedFrequency = ko.observable("");
    self.OffersAdditionalDetailsLoaded = ko.observable(false);
    self.validationTracker = ko.observable();
    self.initializeModel = function() {
      AccountFundingModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value);
      self.applicantObject().accountFunding = getNewKoModel();
      AccountFundingModel.getFundingOptionsList().done(function(data) {
        if (data.fundingOptions && data.fundingOptions.length > 0) {
          self.fundingOptionsList(data.fundingOptions);
          var later = {
            "code": "LATER"
          };
          self.fundingOptionsList().push(later);
          self.fundingOtionsListLoaded(true);
          self.fundingOptionsLoaded(true);
        }
        AccountFundingModel.getExistingAccountConfig().done(function(data) {
          if (data.accountConfigDTO) {
            if (data.accountConfigDTO.maturityInformationDTO) {
              self.applicantObject().accountFunding.interestRate(data.accountConfigDTO.maturityInformationDTO.annualEquivalentRate);
            }
            if (data.accountConfigDTO.settlementMode) {
              if (data.accountConfigDTO.settlementMode.txnAmount) {
                self.initialAmount.amount(data.accountConfigDTO.settlementMode.txnAmount.amount);
                self.initialAmount.currency = data.accountConfigDTO.settlementMode.txnAmount.currency;
              }
              if (data.accountConfigDTO.settlementMode.settlementType === "DDAO") {
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType = data.accountConfigDTO.settlementMode.settlementType;
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.internalAccountSettlementDetailDTO.accountNo.value = data.accountConfigDTO.settlementMode.internalAccountSettlementDetailDTO.accountNo.value;
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.internalAccountSettlementDetailDTO.accountNo.displayValue = data.accountConfigDTO.settlementMode.internalAccountSettlementDetailDTO.accountNo.displayValue;
              }
              if (data.accountConfigDTO.settlementMode.settlementType === "COLL") {
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType = data.accountConfigDTO.settlementMode.settlementType;
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.counterPartyAccountNo.value = data.accountConfigDTO.settlementMode.collectionDetails.counterPartyAccountNo.value;
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.counterPartyAccountNo.displayValue = data.accountConfigDTO.settlementMode.collectionDetails.counterPartyAccountNo.displayValue;
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.mandateId = data.accountConfigDTO.settlementMode.collectionDetails.mandateId;
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.institutionId = data.accountConfigDTO.settlementMode.collectionDetails.institutionIdValue;
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.institutionType = data.accountConfigDTO.settlementMode.collectionDetails.institutionType;
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.counterPartyName = data.accountConfigDTO.settlementMode.collectionDetails.counterPartyName;
              }
              if (self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType === "DDAO" || self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType === "COLL") {
                self.fundingType(self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType);
                if (self.fundingType() === "DDAO") {
                  var account1 = self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.internalAccountSettlementDetailDTO.accountNo;
                  if (count === 0) {
                    count = count + 1;
                    AccountFundingModel.getCasaOwnAccountList().done(function(data) {
                      if (data.accounts) {
                        self.casaOwnAccountList(data.accounts);
                        for (var k = 0; k < self.casaOwnAccountList().length; k++) {
                          if (self.casaOwnAccountList()[k].id.value === account1.value) {
                            account1 = self.casaOwnAccountList()[k];
                            break;
                          }
                        }
                        self.applicantObject().accountFunding.selectedLinkedAccount = account1;
                        self.casaOwnAccountListLoaded(true);
                      }
                      count = 0;
                    });
                  }
                }
                if (self.fundingType() === "COLL") {
                  var account = self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.counterPartyAccountNo;
                  if (count === 0) {
                    count = count + 1;
                    AccountFundingModel.getLinkedAccountList().done(function(data) {
                      if (data.accounts) {
                        self.linkedAccountList(data.accounts);
                        for (var i = 0; i < self.linkedAccountList().length; i++) {
                          if (self.linkedAccountList()[i].id.value === account.value) {
                            account = self.linkedAccountList()[i];
                            break;
                          }
                        }
                        self.applicantObject().accountFunding.selectedLinkedAccount = account;
                        self.linkedAccountListLoaded(true);
                        self.changeLinkedAccount(true);
                      }
                      count = 0;
                    });
                  }
                }
              }
            }
            if (data.accountConfigDTO.accountHolderPreferenceDTO) {
              self.applicantObject().accountFunding.savingsAccountConfiguration.accountHolderPreferenceDTO = data.accountConfigDTO.accountHolderPreferenceDTO;
            }
          }
          if (!self.fundingType()) {
            self.fundingType("LATER");
          }
          if (!self.fundingType()) {
            self.fundingType("LATER");
          }
          if (self.productDetails().offers) {
            self.minimumAmount(self.productDetails().offers.offerAdditionalDetails.demandDepositOfferDetails.demandDepositOfferCurrencyParameterResponseDTOs[0].minimumInitialDepositAmount.amount);
          }
          if (self.minimumAmount() === "" || self.minimumAmount() === 0) {
            self.mandatoryFlag(false);
          }
          self.minimumAmountLoaded(true);
        });
      });
      var monthArray = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12
      ];
      self.expiryDateMonth(monthArray);
      var yearArray = [];
      var currentYear = rootParams.baseModel.getDate().getFullYear();
      for (var j = 0; j <= 15; j++) {
        var year = currentYear + j;
        yearArray.push(year);
      }
      self.expiryDateYear(yearArray);
      self.expiryDateMonth(monthArray);
    };
    self.initializeModel();
    if (!self.applicantObject().accountFunding) {
      self.applicantObject().accountFunding = getNewKoModel();
    }
    self.showWhatIsThisText = function(data) {
      if (data === "CARD_CREDIT") {
        $("#whatisThisCredit").trigger("openModal");
      }
      if (data === "CARD_DEBIT") {
        $("#whatisThisDebit").trigger("openModal");
      }
    };
    self.completeAccountFundingSection = function() {
      self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
    };
    self.linkedAccountChanged = function(event) {
      var account = {
        id: {
          value: "",
          displayValue: ""
        }
      };
      var i;
      var linkedAccount = false;
      if (event.detail.value) {
        for (i = 0; i < self.linkedAccountList().length; i++) {
          if (self.linkedAccountList()[i].id.value === event.detail.value) {
            account = self.linkedAccountList()[i];
            linkedAccount = true;
            break;
          }
        }
        for (i = 0; i < self.casaOwnAccountList().length; i++) {
          if (self.casaOwnAccountList()[i].id.value === event.detail.value) {
            account = self.casaOwnAccountList()[i];
            break;
          }
        }
        self.applicantObject().accountFunding.selectedLinkedAccount = account;
        self.changeLinkedAccount(linkedAccount);
      }
    };
    self.checkAccountFundingInfo = function(fundingOption) {
      self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.txnAmount.amount = self.initialAmount.amount();
      self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.txnAmount.currency = self.initialAmount.currency;
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker()) || self.mandatoryFlag()) {
        return false;
      } else if (fundingOption.fundingType() === "CARD_CREDIT" || fundingOption.fundingType() === "CARD_DEBIT") {
        $("#SAVEFUNDINGSOURCE").trigger("openModal");
      } else {
        self.saveAccountFundingInfo(fundingOption);
      }
    };
    var payLoad;
    self.saveAccountFundingInfo = function(data) {
      var accConfig = null;
      if (data.fundingType()) {
        if (data.fundingType() === "CARD_CREDIT" || data.fundingType() === "CARD_DEBIT") {
          if (data.fundingType() === "CARD_CREDIT") {
            self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails.cardType = "CREDIT";
          }
          if (data.fundingType() === "CARD_DEBIT") {
            self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails.cardType = "DEBIT";
          }
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType = "CARD";
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails.cardName = self.cardName();
          self.applicantObject().accountFunding.selectedValues.cardType = self.currentCardType();
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails.cvv = self.cvv();
          var month = ko.utils.unwrapObservable(self.expiryMonth);
          var year = ko.utils.unwrapObservable(self.expiryYear);
          var date_temp = rootParams.baseModel.getDate();
          date_temp.setFullYear(year, month - 1, 1);
          date_temp = oj.IntlConverterUtils.dateToLocalIso(date_temp);
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails.expiryDate = date_temp.substring(0, 10);
          accConfig = ko.mapping.toJS(ko.mapping.fromJS(self.applicantObject().accountFunding.savingsAccountConfiguration));
          accConfig.settlementMode.collectionDetails = null;
          accConfig.settlementMode.internalAccountSettlementDetailDTO = null;
        }
        if (data.fundingType() === "COLL") {
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType = "COLL";
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.counterPartyAccountNo.value = self.applicantObject().accountFunding.selectedLinkedAccount.id.value;
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.counterPartyAccountNo.displayValue = self.applicantObject().accountFunding.selectedLinkedAccount.id.displayValue;
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.mandateId = self.applicantObject().accountFunding.selectedLinkedAccount.mandateId;
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.institutionId = self.applicantObject().accountFunding.selectedLinkedAccount.institutionIdValue;
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.institutionType = self.applicantObject().accountFunding.selectedLinkedAccount.institutionType;
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.counterPartyName = self.applicantObject().accountFunding.selectedLinkedAccount.counterPartyName;
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.fundingDetailsPresent = true;
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.accountHolder = self.applicantObject().accountFunding.selectedLinkedAccount.displayName;
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.bankId = self.applicantObject().accountFunding.selectedLinkedAccount.bankId;
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.branchName = self.applicantObject().accountFunding.selectedLinkedAccount.branchName;
          accConfig = ko.mapping.toJS(ko.mapping.fromJS(self.applicantObject().accountFunding.savingsAccountConfiguration));
          accConfig.settlementMode.cardDetails = null;
          accConfig.settlementMode.internalAccountSettlementDetailDTO = null;
        }
        if (data.fundingType() === "DDAO") {
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType = "DDAO";
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.internalAccountSettlementDetailDTO.accountNo.value = self.applicantObject().accountFunding.selectedLinkedAccount.id.value;
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.internalAccountSettlementDetailDTO.accountNo.displayValue = self.applicantObject().accountFunding.selectedLinkedAccount.id.displayValue;
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.fundingDetailsPresent = true;
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.accountHolder = self.applicantObject().accountFunding.selectedLinkedAccount.displayName;
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.bankId = self.applicantObject().accountFunding.selectedLinkedAccount.bankId;
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.branchName = self.applicantObject().accountFunding.selectedLinkedAccount.branchName;
          accConfig = ko.mapping.toJS(ko.mapping.fromJS(self.applicantObject().accountFunding.savingsAccountConfiguration));
          accConfig.settlementMode.cardDetails = null;
          accConfig.settlementMode.collectionDetails = null;
        }
        if (data.fundingType() === "LATER") {
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType = "LATER";
          accConfig = ko.mapping.toJS(ko.mapping.fromJS(self.applicantObject().accountFunding.savingsAccountConfiguration));
          accConfig.settlementMode.collectionDetails = null;
          accConfig.settlementMode.cardDetails = null;
          accConfig.settlementMode.internalAccountSettlementDetailDTO = null;
          accConfig.settlementMode.fundingDetailsPresent = false;
        }
        if (accConfig) {
          accConfig.offerId = self.productDetails().offers ? self.productDetails().offers.offerId : "";
          accConfig.productGroupSerialNumber = 1;
          accConfig.offerCurrency = rootParams.baseModel.getLocaleValue("localCurrency");
          payLoad = ko.toJSON(accConfig);
          AccountFundingModel.saveModel(payLoad).done(function(data) {
            self.applicantObject().accountFunding.savingsAccountConfiguration.simulationId = data.simulationId;
            var sendData = {
              productGroupSerialNumber: self.applicantObject().accountFunding.savingsAccountConfiguration.productGroupSerialNumber,
              simulationId: self.applicantObject().accountFunding.savingsAccountConfiguration.simulationId
            };
            var validatePayLoad = ko.toJSON(sendData);
            AccountFundingModel.validateAccountConfig(validatePayLoad).done(function(data) {
              self.applicantObject().accountFunding.savingsAccountConfiguration.simulationId = data.simulationId;
              self.completeAccountFundingSection();
            });
          });
        }
      } else if (data.fundingType() === "") {
        self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType = "LATER";
        accConfig = ko.mapping.toJS(ko.mapping.fromJS(self.applicantObject().accountFunding.savingsAccountConfiguration));
        accConfig.settlementMode.collectionDetails = null;
        accConfig.settlementMode.cardDetails = null;
        accConfig.settlementMode.internalAccountSettlementDetailDTO = null;
        accConfig.settlementMode.fundingDetailsPresent = false;
        if (accConfig) {
          accConfig.offerId = self.productDetails().offers ? self.productDetails().offers.offerId : "";
          accConfig.productGroupSerialNumber = 1;
          accConfig.offerCurrency = rootParams.baseModel.getLocaleValue("localCurrency");
          payLoad = ko.toJSON(accConfig);
          AccountFundingModel.saveModel(payLoad).done(function(data) {
            self.applicantObject().accountFunding.savingsAccountConfiguration.simulationId = data.simulationId;
            var sendData = {
              productGroupSerialNumber: self.applicantObject().accountFunding.savingsAccountConfiguration.productGroupSerialNumber,
              simulationId: self.applicantObject().accountFunding.savingsAccountConfiguration.simulationId
            };
            var validatePayLoad = ko.toJSON(sendData);
            AccountFundingModel.validateAccountConfig(validatePayLoad).done(function(data) {
              self.applicantObject().accountFunding.savingsAccountConfiguration.simulationId = data.simulationId;
              self.completeAccountFundingSection();
            });
          });
        }
      }
    };
    self.getAccountFundingList = function(data, event) {
      if (event.detail.value && event.detail.value !== null) {
        self.cardOptionsRefreshed(false);
        self.currentCardType(self.currentCardType());
        self.currentCardType("");
        self.cardName("");
        self.aanNumber("");
        self.expiryMonth("");
        self.expiryYear("");
        if (self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails) {
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails.aanNumber = "";
        }
        self.cvv("");
        ko.tasks.runEarly();
        self.cardOptionsRefreshed(true);
        if (event.detail.value === "COLL" && !self.linkedAccountListLoaded() && count === 0) {
          count = count + 1;
          AccountFundingModel.getLinkedAccountList().done(function(data) {
            if (data.accounts) {
              self.linkedAccountList(data.accounts);
            }
            self.linkedAccountListLoaded(true);
            count = 0;
          });
        }
        if (event.detail.value === "LATER" && self.initialAmount && ko.isObservable(self.initialAmount.amount)) {
          self.initialAmount.amount("");
        }
        if (event.detail.value === "DDAO" && !self.casaOwnAccountListLoaded() && count === 0) {
          count = count + 1;
          AccountFundingModel.getCasaOwnAccountList().done(function(data) {
            if (data.accounts) {
              self.casaOwnAccountList(data.accounts);
            }
            self.casaOwnAccountListLoaded(true);
            count = 0;
          });
        }
        if ((event.detail.value === "CARD_CREDIT" || event.detail.value === "CARD_DEBIT") && !self.cardFormatsListListLoaded() && count === 0) {
          count = count + 1;
          AccountFundingModel.getCardFormatsList().done(function(data) {
            if (data.enumRepresentations) {
              if (data.enumRepresentations[0].type.toUpperCase() === "CREDIT") {
                self.debitCardFormatsList(data.enumRepresentations[1]);
                self.creditCardFormatsList(data.enumRepresentations[0]);
              } else {
                self.debitCardFormatsList(data.enumRepresentations[0]);
                self.creditCardFormatsList(data.enumRepresentations[1]);
              }
            }
            self.cardFormatsListListLoaded(true);
            count = 0;
          });
        }
      }
    };
  };
});
