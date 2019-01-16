define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!lzn/gamma/resources/nls/application-list",
  "ojs/ojselectcombobox",
  "ojs/ojprogressbar",
  "ojs/ojbutton"
], function(oj, ko, $, ApplicationListModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      i, productGroupSerialNumber, successHandlers = {};
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.applicationsList = ko.observableArray([]);
    self.draftApplications = ko.observableArray([]);
    self.applicationSubmitted = [];
    self.draftsApps = [];
    self.request = $.extend({}, self.baseRequest);
    self.request.party = "";
    self.request.submission = "";
    self.payLoad = ko.observable(true);
    self.applicationValue = ko.observable();
    self.isCustomer = ko.observable(true);
    self.showSubmittedApplications = ko.observable(false);
    self.isSubmittedApplicationsDataFetched = ko.observable(false);
    self.isDraftApplicationsDataFetched = ko.observable(false);
    self.sessionStorageData = {};
    for (i = 0; i < self.submissionIdList().length; i++) {
      if (self.submissionIdList()[i].isSubmitted) {
        self.applicationSubmitted.push(self.submissionIdList()[i]);
      } else {
        self.draftsApps.push(self.submissionIdList()[i]);
      }
    }
    if (self.draftsApps.length > 0) {
      for (i = 0; i < self.draftsApps.length; i++) {
        if (self.draftsApps[i]) {
          if (self.draftsApps[i].products && self.draftsApps[i].products.length > 0) {
            productGroupSerialNumber = self.draftsApps[i].products[0].productGroupSerialNumber;
            self.sessionStorageData.productGroupSerialNumber = productGroupSerialNumber;
          }
        }
      }
      self.draftApplications(self.draftsApps);
      self.applicationValue("DRAFT");
      self.showSubmittedApplications(false);
    }
    self.isDraftApplicationsDataFetched(true);
    if (self.applicationSubmitted.length > 0) {
      self.applicationsList(self.applicationSubmitted);
      for (i = 0; i < self.applicationsList().length; i++) {
        self.applicationsList()[i].applications.applicationStatusDesc = rootParams.baseModel.getDescriptionFromCode(self.applicationStatusStringMap(), self.applicationsList()[i].applications.applicationStatus);
      }
      self.sessionStorageData.isCustomer = self.isCustomer();
      if (self.draftsApps.length === 0) {
        self.applicationValue("SUBMITTED");
        self.showSubmittedApplications(true);
      }
    } else {
      self.isCustomer(false);
      self.sessionStorageData.isCustomer = self.isCustomer();
    }
    if (self.applicationsList().length > 0) {
      ApplicationListModel.fetchApplications(self.applicationsList()[0].submissionId.value);
    }
    self.isSubmittedApplicationsDataFetched(true);
    successHandlers.applicantDetailsHandler = function(data) {
      var applicantId = self.sessionStorageData.applicantId;
      if (data.applicants) {
        for (i = 0; i < data.applicants.length; i++) {
          if (applicantId === data.applicants[i].applicantId.value && data.applicants[i].applicantRelationshipType === "CO_APPLICANT") {
            self.sessionStorageData.loadCoApp = "randomKeys";
          }
        }
        rootParams.baseModel.switchPage({
          homeComponent: {
            component: "product",
            module: "origination",
            query: {
              context: "index"
            }
          }
        }, true, true, self.sessionStorageData);
      }
    };
    successHandlers.productClassNameHandler = function(data) {
      self.sessionStorageData.productClassName = data.productGroup.allowedProductClassName;
      self.sessionStorageData.isCollateralRequired = data.productGroup.isCollateralRequired;
      if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
        self.sessionStorageData.applicantId = rootParams.dashboard.userData.userProfile.partyId.value;
        ApplicationListModel.fetchApplicantDetails(JSON.parse(self.sessionStorageData.submissionId).value, successHandlers.applicantDetailsHandler);
      }
    };
    self.resumeApplication = function(requirement, data) {
      self.sessionStorageData.submissionId = ko.toJSON(data.submissionId);
      if (requirement[0].loanProduct.productSubClass === "AUTOLOANFLL") {
        self.sessionStorageData.productDescription = self.resource.vehicleLoan;
      } else if (requirement[0].loanProduct.productSubClass === "PAYDAY") {
        self.sessionStorageData.productDescription = self.resource.paydayLoan;
      } else {
        self.sessionStorageData.productDescription = requirement.productGroupName;
      }
      if (requirement[0].loanProduct) {
        self.sessionStorageData.productClassName = requirement[0].loanProduct.productClass;
        self.sessionStorageData.productSubClass = requirement[0].loanProduct.productSubClass;
        self.sessionStorageData.productCode = requirement[0].loanProduct.productSubClass;
      }
      self.sessionStorageData.requirements = JSON.stringify(requirement[0].loanProduct);
      self.sessionStorageData.typeApplication = requirement[0].type;
      if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
        self.sessionStorageData.applicantId = rootParams.dashboard.userData.userProfile.partyId.value;
        ApplicationListModel.fetchApplicantDetails(JSON.parse(self.sessionStorageData.submissionId).value, successHandlers.applicantDetailsHandler);
      }
    };
    successHandlers.applicantListSucessHandler = function(data) {
      var index;
      if (data && data.applicants) {
        for (index = 0; index < data.applicants.length; index++) {
          if (data.applicants[index].applicantId === self.currentUser().applicantId) {
            self.currentUser().isNewParty(data.applicants[index].newParty);
            if (data.applicants[index].applicantRelationshipType && data.applicants[index].applicantRelationshipType === "APPLICANT") {
              self.currentUser().isPrimaryApplicant(true);
            } else {
              self.currentUser().isPrimaryApplicant(false);
            }
          }
        }
        self.currentUser().noOfApplicants = data.applicants.length;
      }
    };
    self.flowSuccessHandler = function(data) {
      self.applicationData(data.trackerDetails);
      self.applicationData().currentStage = data.trackerDetails.trackerStages[0].id;
      self.getNextStage();
    };
    successHandlers.productClassNameSummaryHandler = function(data) {
      var className;
      var productClassName;
      if (data.productGroup) {
        productClassName = data.productGroup.allowedProductClassName;
        if (productClassName === "LOANS") {
          if (data.productGroup.isCollateralRequired) {
            className = "collateral-" + productClassName + "-tracker";
          } else {
            className = "non-collateral-" + productClassName + "-tracker";
          }
          self.productClassName(productClassName);
        } else {
          self.productClassName(productClassName);
          className = productClassName.split("_").join("-") + "-tracker";
        }
      } else {
        productClassName = "LOANS";
        className = "non-collateral-" + productClassName + "-tracker";
      }
      ApplicationListModel.fetchFlow(className.toLowerCase(), self.flowSuccessHandler);
    };
    self.clickApplicationSummary = function(data) {
      self.applicationInfo().currentSubmissionId(data.submissionId.value);
      self.applicationInfo().currentApplicationStatus(data.applications.applicationStatus);
      self.applicationInfo().currentApplicationId(data.applications.applicationId.value);
      self.applicationInfo().currentApplicationIdDisplayValue(data.applications.applicationId.displayValue);
      self.applicationInfo().currentSubmissionStatus(data.applications.submissionStatus);
      self.applicationInfo().currentApplicationProgress(0);
      self.applicationInfo().productType(data.applications.productType);
      self.applicationInfo().submissionDate(data.applications.submissionDate);
      self.applicationInfo().remarks(data.applications.remarks);
      if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
        self.currentUser(rootParams.dashboard.userData.userProfile);
        ApplicationListModel.fetchApplicationsDetails(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId(), successHandlers.applicantListSucessHandler);
        self.currentUser().isPrimaryApplicant = ko.observable(true);
        self.currentUser().isNewParty = ko.observable();
      }
      var className = "non-collateral-LOANS-tracker";
      self.productClassName("LOANS");
      self.productSubClassName("PAYDAY");
      ApplicationListModel.fetchFlow(className.toLowerCase(), self.flowSuccessHandler);
    };
    self.toggleApplicationsView = function(event) {
      if (event.detail.value === "SUBMITTED") {
        self.showSubmittedApplications(true);
      } else if (event.detail.value === "DRAFT") {
        self.showSubmittedApplications(false);
      }
    };
  };
});
