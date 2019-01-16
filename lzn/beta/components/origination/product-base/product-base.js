define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseModel",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/origination-generic",
  "baseService",
  "knockout-mapping",
  "ojs/ojknockout",
  "knockout-helper",
  "ojs/ojbutton"
], function(oj, ko, $, BaseModel, Constants, resourceBundle, BaseService) {
  "use strict";
  return function(rootParams) {
    var self = this,
      applicantId,
      baseService;
    Constants.region = "us";
    Constants.module = "ORIGINATION";
    ko.utils.extend(self, rootParams.rootModel);
    self.overrideProperties = resourceBundle;
    baseService = BaseService.getInstance();
    self.todayIsoDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));
    self.homePage = ko.observable(false);
    self.userRoles = ko.observableArray();
    self.label = ko.observable();
    self.isToBeSynched = true;
    self.selectedStateText = ko.observable("");
    self.selectedState = ko.observable("");
    self.isStateSelected = ko.observable(false);
    self.isStateChangeAllowed = ko.observable(true);
    self.stateOptions = ko.observableArray();
    self.isStatesLoaded = ko.observable(false);
    self.componentName = ko.observable("product");
    self.compName = ko.observable("Credit Card");
    rootParams.baseModel.registerComponent("pop-up", "login");
    rootParams.baseModel.registerComponent("address-input", "origination");
    self.dataLoaded = ko.observable(false);
    self.productComponentName = ko.observable();
    self.submissionIdExists = ko.observable(false);
    self.pluginCompName = ko.observable("row");
    self.productflowComponent = ko.observable(true);
    self.productHeadingName = ko.observable();
    self.hideBackButton = ko.observable(false);
    self.constants = Constants;
    self.productDetails = ko.observable({
      applicantList: ko.observableArray([]),
      baseCurrency: rootParams.baseModel.getLocaleValue("localCurrency"),
      applicantDetailsFetched: ko.observable(false),
      sectionBeingEdited: ko.observable(),
      collabData: ko.observable({}),
      isUserAssociated: false,
      isRegistered: false,
      repaymentAmount: ko.observable()
    });
    self.initQueryMap = function(root) {
      self.queryMap = root.queryMap;
      self.applicationArguments = root.applicationArguments;
    };
    self.stateValidationDeferred = $.Deferred();
    if (!rootParams.dashboard.userData || $.isEmptyObject(rootParams.dashboard.userData)) {
      self.stateValidationDeferred.resolve();
    }

    self.showToolTip = function(id, holder) {
      var p = $("#" + holder),
        toolTipHeight, toolTipWidth;
      var position = p.position();
      toolTipHeight = $("#" + id).outerHeight();
      toolTipWidth = $("#" + id).outerWidth();
      if (self.large()) {
        $("#" + id).css("position", "absolute");
        $("#" + id).css("top", position.top - toolTipHeight);
        $("#" + id).css("left", position.left - (toolTipWidth / 2));
        $("#" + id).css("display", "block");
      }
    };
    // eslint-disable-next-line no-storage/no-browser-storage
    if (sessionStorage.sessionStorageData) {
      // eslint-disable-next-line no-storage/no-browser-storage
      var sessionStorageData = JSON.parse(sessionStorage.sessionStorageData);
    }

    self.hideToolTip = function(id) {
      $("#" + id).css("display", "none");
    };
    var options = {
      showMessage: false,
      url: "enumerations/country/US/state",
      success: function(data) {
        self.fetchStatesHandler(data);
      }
    };
    baseService.fetch(options);

    self.fetchStatesHandler = function(data) {
      self.stateOptions(data.enumRepresentations[0].data);
      self.isStatesLoaded(true);
      if (sessionStorageData && sessionStorageData.selectedState) {
        self.isStateSelected(true);
        self.isStateChangeAllowed(false);
        self.selectedState(sessionStorageData.selectedState);
        self.selectedStateText(rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.selectedState()));
      }
      if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
        self.isStateChangeAllowed(false);
        applicantId = rootParams.dashboard.userData.userProfile.partyId.value;
        self.fetchSubmissions();
        if (rootParams && rootParams.baseModel && self.productDetails()) {
          self.productDetails().currency = rootParams.baseModel.getLocaleValue("localCurrency");
        }
      }
    };
    self.fetchSubmissionsHandler = function(data) {
      if (data.submissions) {
        for (var i = 0; i < data.submissions.length; i++) {
          if (!(data.submissions[i].isSubmitted && JSON.parse(data.submissions[i].isSubmitted))) {
            self.isToBeSynched = false;
            break;
          }
        }
        var isToBeSynchedWithoutProductDetails = self.isToBeSynched && !self.productDetails();
        var isToBeSynchedAfterLoginRedirection = self.isToBeSynched && sessionStorageData && sessionStorageData.loginRedirection && JSON.parse(sessionStorageData.loginRedirection);
        if (isToBeSynchedWithoutProductDetails || isToBeSynchedAfterLoginRedirection) {
          self.findStateFromContact(applicantId);
        } else {
          self.findStateFromContact(applicantId);
        }
      } else {
        self.findStateFromContact(applicantId);
      }
    };

    self.fetchSubmissions = function() {
      var options = {
        url: "submissions",
        success: function(data) {
          self.fetchSubmissionsHandler(data);
        }
      };
      baseService.fetch(options);
    };

    self.synchWithHostHandler = function(data, applicantId) {
      self.findStateFromContact(applicantId);
    };
    self.synchWithHost = function(applicantId) {
      var params = {
        "partyId": applicantId
      };
      var options = {
        url: "parties/{partyId}/synch",
        success: function(data) {
          self.synchWithHostHandler(data, applicantId);
        }
      };
      baseService.update(options, params);
    };

    self.findStateFromContact = function(applicantId) {
      var params = {
        "applicantId": applicantId,
        submissionId: "123"
      };
      var options = {
        showMessage: false,
        url: "parties/{applicantId}/addresses?type=PST",
        success: function(data) {
          self.findStateFromContactHandler(data);
        }
      };
      baseService.fetch(options, params);
    };

    self.findStateFromContactHandler = function(data) {
      var state = null;
      var i;
      if (data.partyAddressDTO) {
        for (i = 0; i < data.partyAddressDTO.length; i++) {
          if (data.partyAddressDTO[i].type === "RES" && data.partyAddressDTO[i].status === "CURRENT") {
            state = data.partyAddressDTO[i].postalAddress.state;
            break;
          }
        }
        self.verifyState(state);
      } else if (data.applicantAddressDTO) {
        for (i = 0; i < data.applicantAddressDTO.length; i++) {
          if (data.applicantAddressDTO[i].type === "RES" && data.applicantAddressDTO[i].status === "CURRENT") {
            state = data.applicantAddressDTO[i].postalAddress.state;
            break;
          }
        }
        self.verifyState(state);
      } else {
        self.findStateFromSubmissions();
      }
    };

    self.getSubmission = function() {
      var options = {
        showMessage: false,
        url: "submissions",
        success: function(data) {
          if (data.submissions && data.submissions[0]) {
            self.getSubmissionHandler(data);
          }
        }
      };
      baseService.fetch(options);
    };

    self.getSubmissionHandler = function(data) {
      var params = {
        "submissionId": data.submissions[0].submissionId.value
      };
      var options = {
        showMessage: false,
        url: "submissions/{submissionId}/summary",
        success: function(data) {
          self.findStateFromSubmissionsHandler(data);
        }
      };

      baseService.fetch(options, params);
    };
    self.findStateFromSubmissions = function() {
      self.getSubmission();
    };

    self.findStateFromSubmissionsHandler = function(data) {
      self.verifyState(data.state);
    };
    self.verifyState = function(state) {
      if (self.isStateSelected() && self.productDetails() && self.productDetails().productClassName !== "CREDIT_CARD") {
        if (self.selectedState() !== state) {
          $("#wrongStateSelection").trigger("openModal");
          self.stateValidationDeferred.reject();
        } else {
          self.stateValidationDeferred.resolve();
        }
      } else {
        self.isStateSelected(true);
        self.isStateChangeAllowed(false);
        self.selectedState(state);
        self.selectedStateText(rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.selectedState()));
        self.stateValidationDeferred.resolve();
      }
    };

    self.applyPattern = function(input, pattern, position) {
      var x = input;
      var output = "";
      if (x.length > pattern[position] && position < pattern.length) {
        x = x.substr(pattern[position]);
        output = self.applyPattern(x, pattern, position + 1);
        output = input.substr(0, pattern[position]) + "-" + output;
        return output;
      }
      output += x;
      return output;

    };

    self.maskValue = function(val, len) {
      var a = val.substring(0, len);
      return a.replace(/\d|\D/g, "x") + val.substring(len);
    };

    rootParams.baseModel.registerComponent("product", "origination", self.componentLoader);
    self.dataLoaded(true);
  };
});
