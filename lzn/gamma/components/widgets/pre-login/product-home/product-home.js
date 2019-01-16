define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!lzn/gamma/resources/nls/product-home",
  "framework/js/constants/constants",
  "baseService",
  "ojs/ojbutton",
  "ojs/ojselectcombobox"
], function(oj, ko, $, ProductHomeModel, resourceBundle, Constants, BaseService) {
  "use strict";
  return function(Params) {
    var self = this;
    var baseService = BaseService.getInstance();
    self.dataLoaded = ko.observable(false);
    ko.utils.extend(self, Params.rootModel);
    self.userData = Params.dashboard.userData;
    self.dataLoaded(true);
    self.resource = resourceBundle;
    self.showPage = ko.observable(false);
    Params.baseModel.registerComponent("layout", "home");
    Params.baseModel.registerComponent("bank-products", "home");
    self.compName = ko.observable();
    self.compName("bank-products");
    self.productHeaderImage = ko.observable("");
    self.homePage = ko.observable(true);
    self.userLoggedIn = ko.observable(false);
    self.label = ko.observable();
    self.context = ko.observable();
    self.userRoles = ko.observableArray();
    self.isLogin = ko.observable(false);
    self.isStatesLoaded = ko.observable(false);
    self.stateOptions = ko.observableArray();
    self.selectedState = ko.observable("");
    self.isStateSelected = ko.observable(false);
    self.selectedStateText = ko.observable("");

    self.goToBack = function() {
      history.back();
    };
    self.actionCardData = ko.observable();
    self.type = ko.observable();
    self.className = ko.observable();
    self.productGroupData = ko.observable();
    self.showComponent = ko.observable(true);
    self.userProfile = ko.observable();
    self.actionData = ko.observable();
    self.stateReload = ko.observable(true);
    self.refreshState = ko.observable(true);

    Params.baseModel.registerComponent("tooltip", "home");
    Params.baseModel.registerComponent("login-carousal", "home");
    Params.baseModel.registerComponent("product-groups-carousal", "home");
    Params.baseModel.registerComponent("product-groups-list", "home");
    Params.baseModel.registerComponent("user-information", "forgot-password");
    Params.baseModel.registerComponent("reset-password", "forgot-password");
    Params.baseModel.registerComponent("user-credentials", "registration");
    Params.baseModel.registerComponent("locator", "location");
    Params.baseModel.registerComponent("branch-details", "location");
    Params.baseModel.registerComponent("otp-verification", "base-components");
    Params.baseModel.registerElement("modal-window");
    Params.baseModel.registerElement("row");
    Params.baseModel.registerComponent("product-groups", "home");
    Params.baseModel.registerElement("page-section");
    Params.baseModel.registerComponent("origination-header", "login");
    Params.baseModel.registerComponent("mobile-landing", "home");
    Params.baseModel.registerComponent("search-vehicle", "home");

    self.context = ko.observable();
    self.loadComponentName = function(compName, label, context) {
      self.maintainHistory(compName);
      self.label(label);
      self.compName(compName);
      self.context(context);
    };

    Params.baseModel.registerComponent("page-banner", "widgets/pre-login");
    Params.baseModel.registerComponent("tools-n-calculators", "home");
    Params.baseModel.registerComponent("contact-us", "home");
    Params.baseModel.registerComponent("company-links", "home");

    self.products = ko.observable("bank-products");
    var tempSessionStorageData = self.applicationArguments;
    var sessionStorageData = tempSessionStorageData ? JSON.parse(tempSessionStorageData) : {};
    var applicantId;
    var productGroupData = {
      "PAYDAY": {
        allowedProductClassName: "LOANS",
        creditPolicyTemplate: "USCP01",
        description: null,
        id: "LOAN-UN",
        isCollateralRequired: false,
        maxTerm: 84,
        minTerm: 12,
        productTypeConstants: "PAYDAY"
      },
      "AUTOLOANFLL": {
        allowedProductClassName: "LOANS",
        creditPolicyTemplate: "USCP03",
        description: null,
        id: "USPG03",
        isCollateralRequired: true,
        maxTerm: 84,
        minTerm: 12,
        productTypeConstants: "AUTOLOANFLL"
      }
    };

    self.switchPageProduct = function() {
      productGroupData[self.actionCardData().productType].description = self.resource.productGroupDescription[self.actionCardData().productType];
      if (self.actionCardData().productType === "PAYDAY") {
        self.actionCardData().module = "payday";
      } else if (self.actionCardData().productType === "AUTOLOANFLL") {
        self.actionCardData().module = "autoloan";
      }
      if (!self.userLoggedIn()) {
        $("#stateSelection").show().trigger("openModal");
      } else if (self.actionCardData().productType === "PAYDAY") {
        if (self.selectedState()) {
          ProductHomeModel.validateState(self.actionCardData().productClass, self.actionCardData().productType, self.selectedState()).done(function() {
            self.createSessionAndLoadProduct();
          });
        }
      } else if (self.actionCardData().productType === "AUTOLOANFLL") {
        ProductHomeModel.fetchDealerList().done(function(data) {
          if (data.listDealers.length > 0) {
            self.dealerDetails = data.listDealers;
            Params.dashboard.loadComponent("search-vehicle", {}, self);
            self.compName("search-vehicle");
          } else {
            self.createSessionAndLoadProduct();
          }
        });
      }
    };
    self.createSessionAndLoadProduct = function() {
      ProductHomeModel.createSession().done(function() {
        self.loadProduct(productGroupData[self.actionCardData().productType]);
      });
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
        self.selectedStateText(Params.baseModel.getDescriptionFromCode(self.stateOptions(), self.selectedState()));
      }
      if (self.userData && self.userData.userProfile) {
        self.isStateChangeAllowed(false);
        applicantId = self.userData.userProfile.partyId.value;
        self.fetchSubmissions();
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
        var isToBeSynchedAfterLoginRedirection = self.isToBeSynched && sessionStorageData && sessionStorageData.loginRedirection && JSON.parse(sessionStorageData.loginRedirection);
        if (isToBeSynchedAfterLoginRedirection) {
          self.synchWithHost("123", applicantId);
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
    self.synchWithHost = function(submissionId, applicantId) {
      var params = {
        "submissionId": submissionId,
        "partyId": applicantId
      };
      var options = {
        url: "submissions/{submissionId}/applicants/{partyId}/sync",
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
      if (Constants.host === "ofsll") {
        options.url = "submissions/{submissionId}/applicants/{applicantId}/addresses?type=PST";
      }
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
      if (self.isStateSelected()) {
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
        self.selectedStateText(Params.baseModel.getDescriptionFromCode(self.stateOptions(), self.selectedState()));
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

    self.stateModalCancel = function() {
      self.selectedState("");
      self.refreshState(false);
      $("#stateSelection").hide();
      ko.tasks.runEarly();
      self.refreshState(true);
    };

    self.sessionStorageData = {};
    self.loadProduct = function(productGroupData) {
      self.sessionStorageData.productCode = productGroupData.id;
      self.sessionStorageData.productDescription = productGroupData.description;
      self.sessionStorageData.productClassName = productGroupData.allowedProductClassName;
      self.sessionStorageData.productGroupMaxTerm = productGroupData.maxTerm;
      if (self.selectedState()) {
        self.sessionStorageData.selectedState = self.selectedState();
        self.selectedState("");
      }
      if (productGroupData.allowedProductClassName === "LOANS") {
        self.sessionStorageData.isCollateralRequired = productGroupData.isCollateralRequired;
      }
      if (productGroupData.productTypeConstants) {
        self.sessionStorageData.productType = productGroupData.productTypeConstants;
      }
      Params.baseModel.switchPage({
        homeComponent: {
          component: "product",
          module: "origination",
          query: {
            context: "index"
          }
        }
      }, false, true, self.sessionStorageData);
    };

    self.actionCardClick = function(data, cardData) {
      self.homePage(false);
      self.type(data);
      self.actionCardData(cardData);
      self.className(cardData.productClass);
      self.switchPageProduct();
    };

    self.stateNotSelected = ko.observable(true);
    self.stateChangeHandler = function(event) {
      if (event.detail.value) {
        self.stateNotSelected(false);
      } else {
        self.stateNotSelected(true);
      }
    };
    ProductHomeModel.checkLoginStatus().done(function() {
      if (self.userData && self.userData.userProfile) {
        self.userProfile(self.userData.userProfile);
        self.userLoggedIn(true);
      }
    });

    self.hideStateSelectionPopUp = function() {
      self.isStateSelected(true);
      self.selectedStateText(Params.baseModel.getDescriptionFromCode(self.stateOptions(), self.selectedState()));
      if (self.actionCardData().productType === "PAYDAY") {
        ProductHomeModel.validateState(self.actionCardData().productClass, self.actionCardData().productType, self.selectedState()).done(function() {
          self.createSessionAndLoadProduct();
        });
      } else if (self.actionCardData().productType === "AUTOLOANFLL") {
        ProductHomeModel.fetchDealerList().done(function(data) {
          if (data.listDealers.length > 0) {
            self.dealerDetails = data.listDealers;
            Params.dashboard.loadComponent("search-vehicle", {}, self);
            self.compName("search-vehicle");
          } else {
            self.createSessionAndLoadProduct();
          }
        });
      } else {
        Params.dashboard.loadComponent("product-groups", {}, self);
        self.compName("product-groups");
      }
      $("#stateSelection").hide();
    };
  };
});
