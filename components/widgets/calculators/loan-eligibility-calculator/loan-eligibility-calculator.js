define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "framework/js/constants/constants",
    "ojL10n!resources/nls/loan-eligibility-calculator",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojslider",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, LoanEligibilityModel, Constants, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.baseModel.registerElement([
            "amount-input",
            "page-section",
            "action-widget"
        ]);
        self.validationTracker = ko.observable();
        var getNewKoModel = function () {
            var KoModel = LoanEligibilityModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rootModelInstance = getNewKoModel();
        self.monthlyIncome = ko.observable();
        self.monthlyExpenses = ko.observable();
        self.tenure = ko.observable();
        self.interest = ko.observable(0);
        self.response = ko.observable();
        self.currency = ko.observable();
        self.validAmount = ko.observable(false);
        self.response = ko.observable();
        self.showresponse = ko.observable(false);
        self.dataLoaded1 = ko.observable(false);
        self.dataLoaded = ko.observable(false);
        if (rootParams.dashboard.isDashboard() === false && rootParams.baseModel.small()) {
            rootParams.dashboard.headerName(self.nls.loanEligibilityCalculator.pageHeader);
        }
        $("inputTenure").attr({
            "max": 2,
            "min": 1
        });

        function setData(data) {
            if (data.bankConfigurationDTO) {
                var configuration = data.bankConfigurationDTO;
                if (configuration.localCurrency) {
                    self.currency(configuration.localCurrency);
                    self.dataLoaded(true);
                }
            }
        }
        self.fetchCurrency = function () {
            LoanEligibilityModel.fetchLocalCurrency().done(function (data) {
                setData(data);
            });
        };

        var attributes = ["GROSSMONTHLYINCOME", "INTERESTRATE", "MONTHLYEXPENSES", "TENURE"];
        self.sliderData = {};
        var count = 0;
        for (var i = 0; i < attributes.length; i++) {
            LoanEligibilityModel.fetchCalculatorRange(i, "LOANELIGIBILITYCALCULATOR", attributes[i]).done(function (data, index) {
                self.sliderData[attributes[index]] = {
                    max: Number(data.maximumRange),
                    min: Number(data.minimumRange),
                    value: ko.observable(Number(data.defaultValue)),
                    step: 10
                };
                count++;
                if (count === attributes.length) {
                    self.sliderData.INTERESTRATE.min = self.sliderData.INTERESTRATE.min / 100;
                    self.sliderData.INTERESTRATE.max = self.sliderData.INTERESTRATE.max / 100;
                    self.sliderData.INTERESTRATE.value(self.sliderData.INTERESTRATE.value() / 100);
                    self.sliderData.INTERESTRATE.step = 0.01;
                    self.sliderData.TENURE.step = 1;
                    self.interest(self.sliderData.INTERESTRATE.value());
                    self.fetchCurrency();
                }
            });
        }

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

        self.resetConstant = function () {
            Constants.module = "";
        };
        self.calculateLoan = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("calculateLoanEligibility"))) {
                return;
            }
            self.showresponse(false);
            self.rootModelInstance.grossMonthlyIncomeAmount.amount = self.monthlyIncome();
            self.rootModelInstance.grossMonthlyIncomeAmount.currency = self.currency;
            self.rootModelInstance.monthlyExpenseAmount.amount = self.monthlyExpenses();
            self.rootModelInstance.monthlyExpenseAmount.currency = self.currency;
            self.rootModelInstance.tenure.year = Number(self.tenure());
            self.rootModelInstance.interestRate = Number(self.interest()) * 100;
            LoanEligibilityModel.fetchLoanEligibility(ko.mapping.toJSON(self.rootModelInstance)).done(function (data) {
                self.response(data);
                self.dataLoaded1(true);
                self.showresponse(true);
            });
        };
        self.calculateLoanEligibility = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("calculateLoanEligibility"))) {
                return;
            }
            self.showresponse(false);
            self.rootModelInstance.grossMonthlyIncomeAmount.amount = self.sliderData.GROSSMONTHLYINCOME.value();
            self.rootModelInstance.grossMonthlyIncomeAmount.currency = self.currency;
            self.rootModelInstance.monthlyExpenseAmount.amount = self.sliderData.MONTHLYEXPENSES.value();
            self.rootModelInstance.monthlyExpenseAmount.currency = self.currency;
            self.rootModelInstance.tenure.year = Number(self.sliderData.TENURE.value());
            self.rootModelInstance.interestRate = Number(self.sliderData.INTERESTRATE.value()) * 100;
            LoanEligibilityModel.fetchLoanEligibility(ko.mapping.toJSON(self.rootModelInstance)).done(function (data) {
                self.response(data);
                self.dataLoaded1(true);
                self.showresponse(true);
            });
        };
        var Params = rootParams.dashboardBuilder ? rootParams.dashboardBuilder : null;
        self.getTemplate = function () {
            if (Params && Params.isWidget) {
                return "corpTemplate_eligibility";
            } else if (Constants.userSegment !== "CORP") {
                return "retTemplate_eligibility";
            }
            return "corpTemplate_eligibility";
        };
    };
});