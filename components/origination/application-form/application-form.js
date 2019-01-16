define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "ojL10n!resources/nls/application-form",
  "framework/js/constants/application-form-generic",
  "ojs/ojradioset",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojtrain",
  "ojs/ojdatetimepicker"
], function(oj, ko, $, ApplicationFormModel, resourceBundle, ApplicationFormGeneric) {
  "use strict";
  return function(rootParams) {
    var self = this,
      i, j, successHandlers = {};
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.applicantType = "PRIMARY";
    self.dataLoaded = ko.observable(false);
    self.firstAccordionSubmitted = ko.observable(false);
    self.employmentSubmitted = ko.observable(false);
    if (self.productDetails().requirements && self.productDetails().requirements.requestedAmount) {
      self.loanAmount(rootParams.baseModel.formatCurrency(self.productDetails().requirements.requestedAmount.amount, self.productDetails().requirements.requestedAmount.currency));
    }
    successHandlers.successHandlerfetchApplcantList = function(data) {
      if (data.applicants && data.applicants.length > 0) {
        data.applicants.reduce(function(a, e) {
          if (e.applicantRelationshipType === "CO_APPLICANT") {
            self.applicantDetails()[1].applicantId(e.applicantId);
          }
          if (e.applicantRelationshipType === "APPLICANT") {
            self.applicantDetails()[0].applicantId(e.applicantId);
            self.applicantDetails()[0].applicantRefId = e.applicantId;
            if (!e.newApplicant) {
              self.applicantDetails()[0].applicantType("customer");
            }
          }
          return a;
        }, []);
      }
      self.applicantDetails()[0].newApplicant = data.applicants[0].newApplicant;
      self.dataLoaded(true);
    };
    ApplicationFormModel.fetchpplicantList(self.productDetails().submissionId.value, successHandlers.successHandlerfetchApplcantList);
    if (!self.applicantDetails()[0].applicantType) {
      self.applicantDetails()[0].applicantType = ko.observable("anonymous");
      self.applicantDetails()[0].channelUser = ko.observable(false);
      if (self.productDetails().requirements) {
        for (i = 1; i <= self.productDetails().requirements.noOfCoApplicants; i++) {
          self.applicantDetails()[i].applicantType = ko.observable("anonymous");
          self.applicantDetails()[i].channelUser = ko.observable(false);
        }
      }
    }
    if (self.productDetails().requirements) {
      if (self.productDetails().requirements.requestedTenure && self.productDetails().requirements.requestedTenure.years() !== 0) {
        self.tenure(self.tenure() + self.productDetails().requirements.requestedTenure.years() + self.resource.years);
      }
      if (self.productDetails().requirements.requestedTenure && self.productDetails().requirements.requestedTenure.months() !== 0) {
        self.tenure(self.tenure() + self.productDetails().requirements.requestedTenure.months() + self.resource.months);
      }
    }
    self.disableFinalContinue = function(obj) {
      for (var i = 0; i < obj.length; i++) {
        if (!JSON.parse(obj[i].isComplete())) {
          return true;
        }
      }
      return false;
    };
    if (!self.productDetails().application) {
      self.productDetails().applicantList = ko.observableArray([]);
      self.productDetails().application = ko.observable({
        stages: ko.observableArray([])
      });
      rootParams.baseModel.registerComponent(self.productDetails().currentStage.stages[0].id, "origination");
      self.productDetails().productApplicationComponentName = ko.observable(self.productDetails().currentStage.stages[0].id);
      for (i = 0; i < self.productDetails().currentStage.stages.length; i++) {
        self.productDetails().application().stages.push(self.productDetails().currentStage.stages[i]);
        if (self.productDetails().application().stages()[i].stages !== null) {
          self.productDetails().application().stages()[i].applicantStages = JSON.parse(ko.toJSON(self.productDetails().application().stages()[i].stages));
          for (j = 0; j < self.productDetails().application().stages()[i].stages.length; j++) {
            self.productDetails().application().stages()[i].applicantStages[j].isComplete = ko.observable(false);
          }
        }
      }
      self.productDetails().application().currentApplicationStage = self.productDetails().application().stages()[0];
    }
    self.saveApplicationCustomer = function(stage) {
      var payload = {
        isIPA: false,
        noOfCoApplicants: "0",
        productGroupCode: self.productDetails().productCode,
        productGroupName: self.productDetails().productDescription,
        productGroupSerialNumber: self.productGroupSerialNumber(),
        productClass: self.productDetails().productClassName,
        productSubClass: self.productDetails().productType,
        productId: self.productDetails().productCode
      };
      var url;
      if (self.productDetails().productClassName === "LOANS") {
        payload.requestedAmount = {
          currency: rootParams.baseModel.getLocaleValue("localCurrency"),
          amount: 0
        };
        payload.requestedTenure = {
          days: 0,
          months: 0,
          years: 0
        };
        payload.purpose = {
          code: ""
        };
        payload.facilityId = self.productDetails().facilityId;
        url = "submissions/{submissionId}/loanApplications/validation";
      } else if (self.productDetails().productClassName === "CASA") {
        if (self.productDetails().offers) {
          payload.offerId = self.productDetails().offers.offerId;
        }
        url = "submissions/{submissionId}/demandDepositApplications/validation";
      }
      var validateLoanDeferred = $.Deferred();
      if (stage.sequenceNumber === 1 && !self.applicationStartedFromDraft && !(stage.id === "requirements" || stage.id === "vehicle-info")) {
        ApplicationFormModel.validateLoan(self.productDetails().submissionId.value, url, payload, validateLoanDeferred);
        self.firstAccordionSubmitted(true);
      } else if (stage.sequenceNumber === 1) {
        self.firstAccordionSubmitted(true);
      }
    };
    ko.utils.extend(self, new ApplicationFormGeneric(self));
  };
});
