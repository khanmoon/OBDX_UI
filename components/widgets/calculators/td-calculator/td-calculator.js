define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "jquery",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/calculator",
  "ojs/ojknockout-validation",
  "ojs/ojbutton",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup"
], function (oj, ko, TDCalculatorModel, $, Constants, resourceBundle) {
  "use strict";
  return function (rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    var getNewKoModel = function () {
      var KoModel = TDCalculatorModel.getNewModel();
      return ko.mapping.fromJS(KoModel);
    };
    self.rootModelInstance = getNewKoModel();
    rootParams.baseModel.registerElement(["page-section", "amount-input", "action-widget", "help"]);
    self.amount = ko.observable();
    self.years = ko.observable();
    self.months = ko.observable();
    self.dataLoaded1 = ko.observable(false);
    self.days = ko.observable();
    self.interest = ko.observable(0);
    self.textareaValue = ko.observable();
    self.principal_amount = ko.observable();
    self.interest_amount = ko.observable();
    self.tax_amount = ko.observable();
    self.currency = ko.observable();
    self.response = ko.observable();
    self.showresponse = ko.observable(false);
    self.depositTenureCheck = ko.observable("Tenure");
    self.validAmount = ko.observable(false);
    self.validationTracker = ko.observable();
    if (rootParams.dashboard.isDashboard() === false && rootParams.baseModel.small()) {
      rootParams.dashboard.headerName(self.nls.calculator.labels.tdCalcHeader);
    }
    $("inputMonths").attr({
      "max": 12,
      "min": 1
    });
    $("inputDays").attr({
      "max": 31,
      "min": 0
    });
    $("inputYears").attr({
      "max": 120,
      "min": 0
    });
    self.leftClick = function () {
      var value = self.interest();
      value -= 0.0025;
      self.interest(value);
    };
    self.rightClick = function () {
      var value = self.interest();
      value = +value + 0.0025;
      self.interest(value);
    };

    self.tenureChangeHandler = function () {
      if (self.depositTenureCheck() === "Tenure") {
        self.rootModelInstance().maturityData.tenure.days("");
        self.rootModelInstance().maturityData.tenure.months("");
        self.rootModelInstance().maturityData.tenure.years("");
      } else {
        self.rootModelInstance().maturityData.tenure.days(null);
        self.rootModelInstance().maturityData.tenure.months(null);
        self.rootModelInstance().maturityData.tenure.years(null);
      }
    };
    self.fetchCurrency = function () {
      TDCalculatorModel.fetchLocalCurrency().done(function (data) {
        if (data.bankConfigurationDTO) {
          var configuration = data.bankConfigurationDTO;
          if (configuration.localCurrency) {
            self.currency(configuration.localCurrency);
          }
        }
      });
    };
    self.fetchCurrency();
    self.calculate = function () {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("calculateTD"))) {
        return;
      }
      if (!self.validateDateAndInterest()) {
        return;
      }
      self.showresponse(false);
      self.rootModelInstance.initialDepositAmount.amount = self.amount();
      self.rootModelInstance.initialDepositAmount.currency = self.currency();
      self.rootModelInstance.tenure.year = Number(self.years());
      self.rootModelInstance.tenure.month = Number(self.months());
      self.rootModelInstance.tenure.day = Number(self.days());
      self.rootModelInstance.interestRate = Number(self.interest()) * 100;
      TDCalculatorModel.calculateAmount(ko.mapping.toJSON(self.rootModelInstance)).done(function (data) {
        self.response(data);
        self.dataLoaded1(true);
        self.showresponse(true);
        self.flip();
      });
    };
    self.flip = function () {
      $(".flip-card").toggleClass("flipped");
    };
    self.validateDateAndInterest = function () {
      var error = true;
      if (self.years() && isNaN(self.years())) {
        rootParams.baseModel.showMessages(null, [self.nls.calculator.validate.year], "ERROR");
        error = false;
      } else if (!self.years()) {
        rootParams.baseModel.showMessages(null, [self.nls.calculator.validate.emptyYear], "ERROR");
        error = false;
        return error;
      }
      if (self.months() && isNaN(self.months())) {
        rootParams.baseModel.showMessages(null, [self.nls.calculator.validate.month], "ERROR");
        error = false;
      }
      if (self.days() && isNaN(self.days())) {
        rootParams.baseModel.showMessages(null, [self.nls.calculator.validate.day], "ERROR");
        error = false;
      }
      if (!self.interest()) {
        rootParams.baseModel.showMessages(null, [self.nls.calculator.validate.emptyInterest], "ERROR");
        error = false;
      }
      return error;
    };
    var Params = rootParams.dashboardBuilder ? rootParams.dashboardBuilder : null;
    self.getTemplate = function () {
      if (Params && Params.isWidget) {
        return "corpTemplate";
      } else if (Constants.userSegment !== "CORP") {
        return "retTemplate";
      }
      return "corpTemplate";

    };
  };
});