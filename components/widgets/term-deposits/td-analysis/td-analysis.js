define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/td-analysis",
    "ojs/ojbutton"
], function (ko, $, AnalysisModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.checkedOption = ko.observable("conventional");
        self.multipleModules = ko.observable(false);
        self.conventionalAnalysis = ko.observable(true);
        self.dataFetched = ko.observable(false);
        self.totalCurrentBal = ko.observable(0);
        self.totalInvestment = ko.observable(0);
        self.totalMaturityAmount = ko.observable(0);
        self.baseCcy = ko.observable();
        self.noAccounts = ko.observable(true);
        self.noAccountsData = {
            image: "analysis/term-deposits.svg",
            noAccountText: self.resource.TDanalysis.noData,
            bottomText: self.resource.TDanalysis.bottomText
        };
        self.options = [{
                id: "conventional",
                count: 0,
                label: self.resource.accountType.conventional
            },
            {
                id: "islamic",
                count: 0,
                label: self.resource.accountType.islamic
            }
        ];

        var summary;
        var animate = function (max, context) {
            var obj = context;
            var existing = 5;
            var draw = function () {
                if (obj)
                    obj.setAttribute("width", existing);
            };
            var step = function () {
                draw();
                existing = existing + 5;
                if (max >= existing) {
                    requestAnimationFrame(step);
                }
            };
            step();
        };
        self.draw = function () {
            var componentWidth=$(".td-analysis-container>div").width();
            var ratio1 = componentWidth * (self.totalInvestment() / self.totalMaturityAmount());
            var ratio2 = componentWidth * (self.totalCurrentBal() / self.totalMaturityAmount());
            if (self.options[1].count > 0 || self.options[0].count > 0) {
                if (document.getElementById("rect1")) {
                    document.getElementById("rect1").setAttribute("height", 12);
                    document.getElementById("rect1").setAttribute("width", ratio1);
                    document.getElementById("rect1").setAttribute("fill", "#21a0a0");
                }
                if (document.getElementById("rect2")) {
                    document.getElementById("rect2").setAttribute("height", 12);
                    document.getElementById("rect2").setAttribute("width", ratio2);
                    document.getElementById("rect2").setAttribute("fill", "#4b71bc");
                }
                if (self.conventionalAnalysis() && document.getElementById("rect3")) {
                    document.getElementById("rect3").setAttribute("height", 12);
                    document.getElementById("rect3").setAttribute("width", componentWidth);
                    document.getElementById("rect3").setAttribute("fill", "#4b5196");
                }
                animate(ratio1, $("#rect1")[0]);
                animate(ratio2, $("#rect2")[0]);
                if (self.conventionalAnalysis())
                    animate(componentWidth, $("#rect3")[0]);
            }
        };
        var resetData = function (value) {
            if (value === "conventional") {
                self.conventionalAnalysis(true);
                self.totalCurrentBal(summary.totalActiveAvailableBalance.amount);
                self.totalInvestment(summary.totalActiveInvestmentAmount.amount);
                self.totalMaturityAmount(summary.totalActiveMaturityAmount.amount);
                self.baseCcy(summary.totalActiveMaturityAmount.currency);
            } else if (value === "islamic") {
                self.conventionalAnalysis(false);
                self.totalCurrentBal(summary.totalISLActiveAvailableBalance.amount);
                self.totalInvestment(summary.totalISLActiveInvestmentAmount.amount);
                self.totalMaturityAmount(summary.totalISLActiveMaturityAmount.amount);
                self.baseCcy(summary.totalISLActiveMaturityAmount.currency);
            }
            self.draw();
        };
        self.drawGraph=function(){
            self.draw();
        };
        function setData(accountInfoData, bankConfigData) {
            summary = accountInfoData.summary.items[0];
            for (var i = 0; i < accountInfoData.accounts.length; i++) {
                if (accountInfoData.accounts[i].module === "CON" && accountInfoData.accounts[i].status === "ACTIVE") {
                    self.options[0].count += 1;
                } else if (accountInfoData.accounts[i].module === "ISL" && accountInfoData.accounts[i].status === "ACTIVE") {
                    self.options[1].count += 1;
                }
                self.noAccounts(false);
            }
            resetData(self.conventionalAnalysis() ? "conventional" : "islamic");
            if (self.options[1].count > 0 && self.options[0].count === 0) {
                self.conventionalAnalysis(false);
            }
            if (bankConfigData.bankConfigurationDTO.moduleList.length > 1 && self.options[0].count > 0 && self.options[1].count) {
                self.multipleModules(true);
            }
            self.dataFetched(true);
            ko.tasks.runEarly();
            resetData(self.conventionalAnalysis() ? "conventional" : "islamic");
        }

        $.when(AnalysisModel.fetchAccountInfo(), AnalysisModel.fetchBankConfig()).done(function (accountInfoData, bankConfigData) {
            setData(accountInfoData, bankConfigData);
        });

        self.handleButtonChange = function (ui, value) {
            resetData(value.value);
        };
    };
});