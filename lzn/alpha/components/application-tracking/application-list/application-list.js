define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!lzn/alpha/resources/nls/application-list",
  "ojs/ojselectcombobox",
  "ojs/ojprogressbar",
  "ojs/ojbutton"
], function(oj, ko, $, ApplicationListModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      i = 0,
      j = 0,
      applicationPayload = {
        batchDetailRequestList: []
      },
      applicationObj, submissionId, url, payload = {
        batchDetailRequestList: []
      },
      applicationId, draftObj, applicationType = "",
      productGroupSerialNumber, submittedapplicationPayload = {
        batchDetailRequestList: []
      },
      successHandlers = {};
    self.sessionStorageData = {};
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
    rootParams.baseModel.registerComponent("product-base", "origination");
    successHandlers.fetchSubmittedApplicationsSuccessHandler = function(data) {
      submittedapplicationPayload.batchDetailRequestList = [];
      for (j = 0; j < data.batchDetailResponseDTOList.length; j++) {
        var submittedApplications = JSON.parse(data.batchDetailResponseDTOList[j].responseText);
        if (Object.getOwnPropertyNames(submittedApplications).length === 0) {
          self.payLoad(false);
        }
        self.applicationsList.push(submittedApplications);
        if (self.draftApplications().length === 0) {
          self.applicationValue("SUBMITTED");
          self.showSubmittedApplications(true);
        }
      }
      for (i = 0; i < self.applicationSubmitted.length; i++) {
        self.applicationsList()[i].progress = ko.observable(0);
        submissionId = self.applicationSubmitted[i].submissionId.value;
        if (submissionId === self.applicationsList()[i].submissionId.value) {
          applicationId = self.applicationsList()[i].applications[0].applicationId.value;
        }
        url = {
          value: "/submissions/" + submissionId + "/applications/" + applicationId + "/progress"
        };
        draftObj = {
          methodType: "GET",
          uri: url,
          sequenceId: i + 1,
          headers: {
            "Content-Id": i + 1,
            "Content-Type": "application/json"
          }
        };
        submittedapplicationPayload.batchDetailRequestList.push(draftObj);
      }
      self.isSubmittedApplicationsDataFetched(true);
      ApplicationListModel.fetchApplicationProgress(submittedapplicationPayload, successHandlers.fetchApplicationProgressSuccessHandler);
    };
    successHandlers.fetchApplicationProgressSuccessHandler = function(data) {
      var progressStage;
      for (j = 0; j < data.batchDetailResponseDTOList.length; j++) {
        progressStage = JSON.parse(data.batchDetailResponseDTOList[j].responseText);
        if (progressStage.overAllProgress) {
          self.applicationsList()[j].progress(progressStage.overAllProgress);
        }
      }
    };
    successHandlers.fetchDraftApplicationsSuccessHandler = function(data) {
      for (i = 0; i < data.batchDetailResponseDTOList.length; i++) {
        self.draftApplications.push(JSON.parse(data.batchDetailResponseDTOList[i].responseText));
        self.applicationValue("DRAFT");
        self.showSubmittedApplications(false);
      }
      self.isDraftApplicationsDataFetched(true);
    };
    for (i = 0; i < self.submissionIdList().length; i++) {
      if (self.submissionIdList()[i].isSubmitted) {
        self.applicationSubmitted.push(self.submissionIdList()[i]);
      } else {
        self.draftsApps.push(self.submissionIdList()[i]);
      }
    }
    if (self.draftsApps.length > 0) {
      payload.batchDetailRequestList = [];
      for (i = 0; i < self.draftsApps.length; i++) {
        if (self.draftsApps[i] !== null) {
          if (self.draftsApps[i].products && self.draftsApps[i].products.length > 0) {
            applicationType = self.draftsApps[i].products[0].type;
            productGroupSerialNumber = self.draftsApps[i].products[0].productGroupSerialNumber;
            self.sessionStorageData.productGroupSerialNumber = productGroupSerialNumber;
          }
          submissionId = self.draftsApps[i].submissionId.value;
        }
        if (applicationType !== "") {
          switch (applicationType) {
            case "DEMAND_DEPOSIT":
              if (productGroupSerialNumber) {
                url = {
                  value: "/submissions/" + submissionId + "/demandDepositApplications?productGroupSerialNo=" + productGroupSerialNumber
                };
              } else {
                url = {
                  value: "/submissions/" + submissionId + "/demandDepositApplications"
                };
              }
              break;
            case "TERM_DEPOSIT":
              url = {
                value: "/submissions/" + submissionId + "/depositApplications?productGroupSerialNo=" + productGroupSerialNumber
              };
              break;
            case "CREDIT_CARD":
              url = {
                value: "/submissions/" + submissionId + "/creditCardApplications?productGroupSerialNo=" + productGroupSerialNumber
              };
              break;
            case "LOAN":
              url = {
                value: "/submissions/" + submissionId + "/loanApplications"
              };
              break;
          }
          draftObj = {
            methodType: "GET",
            uri: url,
            sequenceId: i + 1,
            headers: {
              "Content-Id": i + 1,
              "Content-Type": "application/json"
            }
          };
          payload.batchDetailRequestList.push(draftObj);
        }
      }
      if (payload.batchDetailRequestList.length > 0) {
        ApplicationListModel.fetchDraftApplications(payload, successHandlers.fetchDraftApplicationsSuccessHandler);
      }
    } else {
      self.isDraftApplicationsDataFetched(true);
    }
    if (self.applicationSubmitted.length > 0) {
      applicationPayload.batchDetailRequestList = [];
      self.sessionStorageData.isCustomer = self.isCustomer();
      for (i = 0; i < self.applicationSubmitted.length; i++) {
        submissionId = self.applicationSubmitted[i].submissionId.value;
        var uri = {
          value: "/submissions/" + submissionId + "/applications"
        };
        applicationObj = {
          methodType: "GET",
          uri: uri,
          sequenceId: i + 1,
          headers: {
            "Content-Id": i + 1,
            "Content-Type": "application/json"
          }
        };
        applicationPayload.batchDetailRequestList.push(applicationObj);
      }
      if (applicationPayload.batchDetailRequestList.length > 0) {
        ApplicationListModel.fetchSubmittedApplications(applicationPayload, successHandlers.fetchSubmittedApplicationsSuccessHandler, successHandlers.errorHandler);
      }
    } else {
      self.isSubmittedApplicationsDataFetched(true);
      self.isCustomer(false);
      self.sessionStorageData.isCustomer = self.isCustomer();
    }
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
            component: "product-base",
            module: "origination",
            query: {
              context: "index"
            }
          }
        }, false, true, self.sessionStorageData);
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
      if (requirement.productGroupLinkageType === "CREDIT_CARD") {
        self.sessionStorageData.submissionId = ko.toJSON(data.submissionId);
      } else {
        self.sessionStorageData.submissionId = ko.toJSON(requirement.submissionId);
      }
      self.sessionStorageData.productCode = requirement.productGroupCode;
      self.sessionStorageData.productDescription = requirement.productGroupName;
      self.sessionStorageData.requirements = JSON.stringify(requirement);
      self.sessionStorageData.typeApplication = requirement.productGroupLinkageType;
      ApplicationListModel.fetchProductClassName(requirement.productGroupCode, successHandlers.productClassNameHandler);
    };
    successHandlers.applicantListSucessHandler = function(data) {
      var index;
      if (data && data.applicants) {
        for (index = 0; index < data.applicants.length; index++) {
          if (data.applicants[index].applicantId === self.currentUser().partyId) {
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
    self.clickApplicationSummary = function(data, progress) {
      self.applicationInfo().currentSubmissionId(data.submissionId.value);
      self.applicationInfo().currentApplicationStatus(data.applications[0].applicationStatus);
      self.applicationInfo().currentApplicationId(data.applications[0].applicationId.value);
      self.applicationInfo().currentApplicationIdDisplayValue(data.applications[0].applicationId.displayValue);
      self.applicationInfo().currentSubmissionStatus(data.applications[0].submissionStatus);
      self.applicationInfo().currentApplicationProgress(parseInt(progress));
      self.setProductCode(data.applications[0].productCode);
      if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
        self.currentUser(rootParams.dashboard.userData.userProfile);
        ApplicationListModel.fetchApplicationsDetails(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId(), successHandlers.applicantListSucessHandler);
        self.currentUser().isPrimaryApplicant = ko.observable(true);
        self.currentUser().isNewParty = ko.observable();
      }
      ApplicationListModel.fetchProductClassName(data.applications[0].productCode, successHandlers.productClassNameSummaryHandler);
    };
    self.toggleApplicationsView = function() {
      self.showSubmittedApplications(!self.showSubmittedApplications());
    };
  };
});
