define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "ojL10n!lzn/gamma/resources/nls/review",
  "ojs/ojcheckboxset",
  "ojs/ojbutton",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, ReviewServiceObject, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      i, ReviewService = new ReviewServiceObject();
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.orderDataLoaded = ko.observable(false);
    self.reviewDataLoaded = ko.observable(false);
    self.enableESignDoc = ko.observable(false);
    self.enableAccountAgreementDoc = ko.observable(false);
    self.enablePrivacyPolicyDoc = ko.observable(false);
    self.enableWirelessPolicyDoc = ko.observable(false);
    self.enableAcceptAll = ko.observable(false);
    self.reviewTransactionName = {
      header: self.resource.review,
      reviewHeader: self.resource.beforesubmit
    };
    require([
      "ojL10n!lzn/gamma/resources/nls/requirements",
      "ojL10n!lzn/gamma/resources/nls/primary-registration",
      "ojL10n!lzn/gamma/resources/nls/identity-info",
      "ojL10n!lzn/gamma/resources/nls/contact-info",
      "ojL10n!lzn/gamma/resources/nls/occupation-info",
      "ojL10n!lzn/gamma/resources/nls/income-info",
      "ojL10n!lzn/gamma/resources/nls/expense-info",
      "ojL10n!lzn/gamma/resources/nls/assets-info",
      "ojL10n!lzn/gamma/resources/nls/liabilities-info",
      "ojL10n!lzn/gamma/resources/nls/card-account",
      "ojL10n!lzn/gamma/resources/nls/account-funding",
      "ojL10n!lzn/gamma/resources/nls/account-holder",
      "ojL10n!lzn/gamma/resources/nls/disclosures",
      "ojL10n!lzn/gamma/resources/nls/card-balance-transfer",
      "ojL10n!lzn/gamma/resources/nls/vehicle-info",
      "ojL10n!lzn/gamma/resources/nls/additional-disclosures",
      "ojL10n!lzn/gamma/resources/nls/card-addon",
      "ojL10n!lzn/gamma/resources/nls/account-details"
    ], function(Requirements, PrimaryRegistration, IdentityInfo, ContactInfo, OccupationInfo, IncomeInfo, ExpenseInfo, AssetsInfo, LiabilitiesInfo, CardAccount, AccountFunding, AccountHolder, Disclosures, CardBalanceTransfer, VehicleInfo, AdditionalDisclosures, CardAddOn, AccountDetails) {
      self.resource.requirements = Requirements;
      self.resource.primaryInfo = PrimaryRegistration;
      self.resource.identityInfo = IdentityInfo;
      self.resource.contactInfo = ContactInfo;
      self.resource.occupationInfo = OccupationInfo;
      self.resource.incomeInfo = IncomeInfo;
      self.resource.assetsInfo = AssetsInfo;
      self.resource.expenseInfo = ExpenseInfo;
      self.resource.liabilitiesInfo = LiabilitiesInfo;
      self.resource.cardAccount = CardAccount;
      self.resource.accountFunding = AccountFunding;
      self.resource.accountHolder = AccountHolder;
      self.resource.disclosures = Disclosures;
      self.resource.cardBalanceTransfer = CardBalanceTransfer;
      self.resource.vehicleInfo = VehicleInfo;
      self.resource.addlnDisclousres = AdditionalDisclosures;
      self.resource.addOnCard = CardAddOn;
      self.resource.accountDetails = AccountDetails;
      self.reviewDataLoaded(true);
    });
    self.getFilmstripLabel = function(index, applicantIndex) {
      if (self.applicantDetails().length > 1) {
        return rootParams.baseModel.format(self.accordionNames.accordionNames.financialDetailsReview, {
          index: self.applicantDetails()[applicantIndex].financialProfile.length > 1 ? index + 1 : "",
          applicantName: rootParams.baseModel.format(self.resource.generic.common.name, {
            firstName: self.applicantDetails()[applicantIndex].primaryInfo.primaryInfo.firstName(),
            lastName: self.applicantDetails()[applicantIndex].primaryInfo.primaryInfo.lastName()
          })
        });
      }
        return rootParams.baseModel.format(self.accordionNames.accordionNames.financialTemplate.name, {
          index: self.applicantDetails()[applicantIndex].financialProfile.length > 1 ? index + 1 : "",
          applicantName: ""
        });

    };
    self.getAccordionLabel = function(key, applicantIndex) {
      if (self.applicantDetails().length > 1) {
        return rootParams.baseModel.format(self.accordionNames.accordionNames[key], {
          applicant: rootParams.baseModel.format(self.accordionNames.accordionNames.applicantName, {
            name: rootParams.baseModel.format(self.resource.generic.common.name, {
              firstName: self.applicantDetails()[applicantIndex].primaryInfo.primaryInfo.firstName(),
              lastName: self.applicantDetails()[applicantIndex].primaryInfo.primaryInfo.lastName()
            })
          })
        });
      }
        return rootParams.baseModel.format(self.accordionNames.accordionNames[key], {
          applicant: ""
        });

    };
    self.productHeadingName(self.resource.review);
    self.validationTracker = ko.observable();
    self.disclosureValidationTracker = ko.observable();
    self.accountDocRefId = ko.observable();
    self.eSignDocRefId = ko.observable();
    self.isCoApp = ko.observable(false);
    self.productDetails().applicationId = {
      value: "",
      displayValue: ""
    };
    self.privacyDocRefId = ko.observable();
    self.disableSubmit = ko.observable(true);
    self.eSignValue = ko.observable();
    self.taxValue = ko.observable();
    self.privacyValue = ko.observable();
    self.sectionOrder = ko.observableArray();
    self.enableDisclosure = ko.observable(false);
    rootParams.baseModel.registerComponent("disclosures", "origination");
    self.applicantObject = rootParams.applicantObject;
    var isESignAccountPrivacyBoxChecked = self.enableESignDoc() && self.enableAccountAgreementDoc() && self.enablePrivacyPolicyDoc();
    var isWirelessAcceptAllBoxChecked = self.enableWirelessPolicyDoc() && self.enableAcceptAll();
    if (isESignAccountPrivacyBoxChecked && isWirelessAcceptAllBoxChecked) {
      self.disableSubmit(false);
    }
    self.editRequirementDetails = function() {
      self.productDetails().sectionBeingEdited("requirements");
      self.setCurrentStage("requirements");
    };
    self.getIndex = function(obj, key, searchKey) {
      for (var i = 0; i < obj.length; i++) {
        if (obj[i][searchKey] === key) {
          return i;
        }
      }
    };
    self.searchEditableFields = function(obj) {
      if ($.isArray(obj)) {
        for (var k = 0; k < obj.length; k++) {
          if (self.searchEditableFields(obj[k])) {
            return true;
          }
        }
        return false;
      }
        for (var key in obj) {
          if (key.search("isEditable") > -1 && JSON.parse(obj[key]())) {
            return true;
          }
        }
        return false;

    };
    var index = self.getIndex(self.productDetails().productStages, "application-form", "id");
    for (i = 0; i < self.productDetails().productStages[index].stages[0].stages.length; i++) {
      if (self.productDetails().productStages[index].stages[0].stages[i].id !== "requirements" && self.productDetails().productStages[index].stages[0].stages[i].id !== "vehicle-info") {
        var isStageEditable = $.inArray(self.productDetails().productStages[index].stages[0].stages[i].id, [
          "occupation-info",
          "income-info",
          "contact-info"
        ]) !== -1;
        if (self.productDetails().productStages[index].stages[0].stages[i].stepCategory === "APPLICATION" || self.searchEditableFields(self.applicantDetails()[0][self.productDetails().productStages[index].stages[0].stages[i].object]) || isStageEditable) {
          self.productDetails().productStages[index].stages[0].stages[i].isEditableForCustomer = ko.observable(true);
        }
      } else {
        self.productDetails().productStages[index].stages[0].stages[i].isEditableForCustomer = ko.observable(true);
      }
    }
    self.getSectionOrder = function() {
      for (var i = 0; i < self.productDetails().productStages[index].stages[0].stages.length; i++) {
        self.sectionOrder.push(self.productDetails().productStages[index].stages[0].stages[i]);
      }
    };
    self.getSectionOrder();
    self.orderDataLoaded(true);
    self.editPersonalDetails = function(data) {
      self.productDetails().sectionBeingEdited(data);
      for (var i = 0; i < self.productDetails().productStages.length; i++) {
        if (self.productDetails().productStages[i].id === "application-form") {
          self.productDetails().currentStage = self.productDetails().productStages[i];
          self.productDetails().application().currentApplicationStage = self.productDetails().application().stages()[0];
          self.productDetails().productApplicationComponentName(self.productDetails().application().currentApplicationStage.id);
          self.setCurrentStage(0);
          break;
        }
      }
    };
    self.editFinancialDetails = function(data) {
      self.productDetails().sectionBeingEdited(data);
      for (var i = 0; i < self.productDetails().productStages.length; i++) {
        if (self.productDetails().productStages[i].id === "application-form") {
          self.productDetails().currentStage = self.productDetails().productStages[i];
          self.productDetails().application().currentApplicationStage = self.productDetails().application().stages()[1].applicantStages[0];
          self.productDetails().productApplicationComponentName(self.productDetails().application().stages()[1].id);
          self.setCurrentStage(0);
          break;
        }
      }
    };
    self.downloadDisclosure = function(data, contentId) {
      ReviewService.fetchDocumentsByteArray(data, self.applicantDetails()[0].applicantId().value, contentId);
    };
    self.checkDisclosureType = function(event) {
      if ((event.detail.value) || (event.detail.value === "messagesShown" && event.detail.value.length === 0)) {
        if ($(".oj-messaging-inline-container").length > 1) {
          self.disableSubmit(true);
          return;
        }
        if (event.detail.value[0] === "WIRELESS") {
          self.enableWirelessPolicyDoc(true);
        }
        if (event.detail.value[0] === "ACCEPTALL") {
          self.enableAcceptAll(true);
        }
        for (var i = 0; i < self.productDetails().disclosures.documentsList.length; i++) {
          if (event.detail.value[0] === self.productDetails().disclosures.documentsList[i].disclosureCode) {
            self.productDetails().disclosures.documentsList[i].checked = true;
          }
        }
        if (self.enableWirelessPolicyDoc() && self.enableAcceptAll()) {
          self.disableSubmit(false);
        }
        for (i = 0; i < self.productDetails().disclosures.documentsList.length; i++) {
          if (!self.productDetails().disclosures.documentsList[i].checked && $.inArray(self.productDetails().disclosures.documentsList[i].disclosureCode, [
              "LOANACCOUNTAGREEMENT",
              "ESIGNDISCLOSURE",
              "PRIVACYPOLICY"
            ]) > -1) {
            self.disableSubmit(true);
          }
        }
      } else if (event.detail.option === "messagesShown" && event.detail.value[0] && event.detail.value[0].severity && event.detail.value[0].severity === 4) {
        self.disableSubmit(true);
      }
    };
    self.submitApplicationSuccessHandler = function(data) {
      self.productDetails().sectionBeingEdited("");
      if (data.applicationDetailsDTO[0].applicationId && data.applicationDetailsDTO[0].applicationId.value) {
        self.productDetails().applicationId.value = data.applicationDetailsDTO[0].applicationId.value;
        self.productDetails().applicationId.displayValue = data.applicationDetailsDTO[0].applicationId.displayValue;
        self.appRefNo(data.applicationDetailsDTO[0].applicationId.displayValue);
      }
      self.getNextStage();
    };
    self.fetchRegistrationRequiredSuccessHandler = function(data) {
      self.registrationCompulsory(data.registrationRequired);
      if (self.registrationCompulsory()) {
        self.showPluginComponent("user-creation");
      } else {
        ReviewService.submitApplication(self.productDetails().submissionId.value, self.submitApplicationSuccessHandler);
      }
    };
    self.submitApplication = function() {
      var tracker = document.getElementById("tracker");
      if (tracker.valid === "valid") {

        ReviewService.fetchRegistrationRequired(self.productDetails().submissionId.value, self.fetchRegistrationRequiredSuccessHandler);


      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
  };
});
