define([
    "knockout",
    "jquery",
    "baseModel",
    "ojL10n!resources/nls/goal-calculator",
    "./model",
    "ojL10n!resources/nls/goal-calculator",
    "framework/js/constants/constants",
    "ojs/ojbutton",
    "ojs/ojinputnumber",
    "ojs/ojinputtext",
    "ojs/ojslider",
    "ojs/ojradiocheckbox",
    "ojs/ojchart",
    "ojs/ojgauge",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation",
    "ojs/ojcheckboxset"
], function(ko, $, BaseModel, labels, goalCalculatorViewModel, ResourceBundle, constants) {
    "use strict";
    return function(rootParams) {
        var self = this,
            getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(goalCalculatorViewModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        ko.utils.extend(self, labels.root);
        constants.module = "GOAL";
        self.validationTracker = ko.observable();
        self.transferData = rootParams.rootModel.params;
        self.goal = ResourceBundle.goal;
        rootParams.dashboard.headerName(self.goal.calculator.header);
        rootParams.dashboard.headerCaption(null);
        self.goalAmount = ko.observable(self.transferData.goalAmount);
        self.initialAmount = ko.observable(self.transferData.initialAmount ?self.transferData.initialAmount : self.transferData.productDetails.goalAmountParameters[0].minAmount.amount);
        self.remainingAmount = ko.observable(self.goalAmount() - self.initialAmount());
        self.paymentSchedule = ko.observable("Monthly");
        self.contributionAmount = ko.observable();
        self.yearValue = ko.observable("0");
        self.monthValue = ko.observable("0");
        self.youPay = ko.observable();
        self.wePay = ko.observable();
        self.isCalculated = ko.observable(false);
        self.productYears = ko.observableArray();
        self.productMonths = ko.observableArray();
        self.calculatePayload = getNewKoModel().goalCalculatorModel;
        self.calculationId = ko.observable();
        rootParams.baseModel.registerElement([
            "amount-input",
            "action-header"
        ]);
        rootParams.baseModel.registerComponent("create-goal", "goals");
        var paymentSchedule = self.paymentSchedule.subscribe(function() {
            if (self.initialAmount() && self.goalAmount() && (self.yearValue()!== "0" || self.monthValue()!== "0")) {
                self.calculate();
            } else if (self.yearValue() === "0" && self.monthValue() === "0") {
                    rootParams.baseModel.showMessages(null, [self.goal.calculator.tenureError], "ERROR");
                    self.isCalculated(false);
                }
        });
        for (var k = 0; k <= self.transferData.productDetails.goalTenureParameter.maxTenure.years; k++) {
            self.productYears.push({
                "year": k.toString(),
                "value": k.toString()
            });
        }
        for (var l = 0; l <= 11; l++) {
            self.productMonths.push({
                "month": l.toString(),
                "value": l.toString()
            });
        }
        self.back = function() {
            history.back(-1);
        };
        self.cancel = function() {
            rootParams.dashboard.hideDetails();
        };
        var initialAmount = self.initialAmount.subscribe(function() {
            self.remainingAmount(self.goalAmount() - self.initialAmount());
            if (self.paymentSchedule() && self.goalAmount() && (self.yearValue()!== "0" || self.monthValue()!== "0")) {
                self.calculate();
            } else if (self.yearValue() === "0" && self.monthValue() === "0") {
                    rootParams.baseModel.showMessages(null, [self.goal.calculator.tenureError], "ERROR");
                    self.isCalculated(false);
                }
        });
        var goalAmount = self.goalAmount.subscribe(function() {
            self.remainingAmount(self.goalAmount() - self.initialAmount());
            if (self.initialAmount() && self.paymentSchedule() && (self.yearValue()!== "0" || self.monthValue()!== "0")) {
                self.calculate();
            } else if (self.yearValue() === "0" && self.monthValue() === "0") {
                    rootParams.baseModel.showMessages(null, [self.goal.calculator.tenureError], "ERROR");
                    self.isCalculated(false);
                }
        });
        self.yearValueChanged = function(event) {
            if (event.detail.value && event.detail.trigger === "option_selected") {
                if (self.initialAmount() && self.paymentSchedule() && (self.yearValue() !== "0" || self.monthValue() !== "0")) {
                    self.calculate();
                } else if (self.yearValue() === "0" && self.monthValue() === "0") {
                    rootParams.baseModel.showMessages(null, [self.goal.calculator.tenureError], "ERROR");
                    self.isCalculated(false);
                }
            }
        };
        self.monthValueChanged = function() {
            if (event.detail.value && event.detail.trigger === "option_selected") {
                if (self.initialAmount() && self.paymentSchedule() && (self.yearValue() !== "0" || self.monthValue() !== "0")) {
                    self.calculate();
                } else if (self.yearValue() === "0" && self.monthValue() === "0") {
                    rootParams.baseModel.showMessages(null, [self.goal.calculator.tenureError], "ERROR");
                    self.isCalculated(false);
                }
            }
        };

        var calculationId, payload;
        self.calculate = function() {
            self.isCalculated(false);
            ko.tasks.runEarly();
            self.calculatePayload.categoryId(self.transferData.categoryId);
            self.calculatePayload.targetAmount.currency(self.transferData.productDetails.goalAmountParameters[0].currency);
            self.calculatePayload.targetAmount.amount(self.goalAmount());
            self.calculatePayload.initialDepositAmount.currency(self.transferData.productDetails.goalAmountParameters[0].currency);
            self.calculatePayload.initialDepositAmount.amount(self.initialAmount());
            self.calculatePayload.tenure.year(Number(self.yearValue()));
            self.calculatePayload.tenure.month(Number(self.monthValue()));
            self.calculatePayload.subCategoryId(self.transferData.subCategoryId);
            self.calculatePayload.frequency(self.paymentSchedule());
            self.transferData.initialAmount = self.initialAmount();
            self.transferData.goalAmount = self.goalAmount();
            payload = ko.toJSON(self.calculatePayload);
            goalCalculatorViewModel.calculate(payload).done(function(data) {
                calculationId = data.goalCalculatorDetails;
                self.contributionAmount(Math.round(data.goalCalculatorDetails.contributionAmount.amount));
                self.youPay((self.goalAmount() - data.goalCalculatorDetails.interestAmount.amount) / self.goalAmount() * 100);
                self.wePay(100 - self.youPay());
                self.youPay(Math.floor(self.youPay() * 10) / 10);
                var wePay = Math.round((100 - self.youPay()) * 10) / 10;
                self.wePay(wePay);
                self.isCalculated(true);
            });
        };
        self.setGoal = function() {
            if (typeof Storage !== "undefined") {
                if (self.loginRequired) {
                    rootParams.baseModel.switchPage({
                        homeComponent: {
                            component: "create-goal",
                            module: "goals",
                            query: {
                                content: self.transferData.content,
                                dataCalculated: true,
                                calculationId: calculationId,
                                user: "ldap"
                            }
                        }
                    }, true);
                } else {
                    rootParams.dashboard.loadComponent("create-goal", { transferDTO: ko.mapping.fromJS(self.transferData) }, self);
                }
            }
        };
        self.scheduleTypes = [{
                id: "Quarterly",
                label: self.goal.calculator.quarterly
            },
            {
                id: "Monthly",
                label: self.goal.calculator.monthly
            },
            {
                id: "Weekly",
                label: self.goal.calculator.weekly
            }
        ];
        self.dispose = function() {
            initialAmount.dispose();
            paymentSchedule.dispose();
            goalAmount.dispose();
        };
    };

});