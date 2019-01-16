define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/list-budget",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton",
    "ojs/ojmenu",
    "ojs/ojselectcombobox",
    "ojs/ojradioset",
    "ojs/ojgauge"
], function(oj, ko, $, BudgetListModel, ResourceBundle) {
    "use strict";
    return function(Params) {
        var self = this,
            categoriesUsed = true,
            categoriesLoaded = false,
            getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(BudgetListModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, Params.rootModel);
        self.budgetPayload = getNewKoModel().Budget;
        self.resource = ResourceBundle;
        self.dataLoaded = ko.observable(false);
        self.periodicityLabels = ko.observableArray();
        self.budgetDetails = ko.observable("");
        Params.dashboard.headerName(self.resource.budget.title);
        Params.dashboard.headerCaption();
        self.categoryId = ko.observable();
        self.categoryName = ko.observable();
        self.periodicity = ko.observable("Once");
        self.customPeriodicityValue = ko.observable();
        self.frequency = ko.observable("Monthly");
        self.amount = ko.observable();
        self.confirmMessage = ko.observable(false);
        self.noBudgets = ko.observable(false);
        self.localCurrency = ko.observable();
        self.categoryList = ko.observableArray();
        self.validationTracker = ko.observable();
        self.controls = ko.observable({
            createBudget: false,
            updateBudget: false,
            deleteBudget: false
        });
        self.disableFormControls = ko.observable(false);
        Params.baseModel.registerElement([
            "amount-input",
            "modal-window"
        ]);
        Params.baseModel.registerComponent("budget-data-card", "personal-finance-management");
        Params.baseModel.registerComponent("percentage-graph", "personal-finance-management");
        self.date = null;
        self.fromDateMonth = ko.observableArray();
        self.toDateMonth = ko.observableArray();
        self.fromDateYear = ko.observableArray();
        self.toDateYear = ko.observableArray();
        self.monthNames = ko.observableArray();
        self.year = ko.observableArray();
        self.dateLoaded = ko.observable(false);
        self.categoryIdsWhichAreAlreadyUsed = ko.observableArray();
        self.localCurrency("GBP");
        self.showCreateBudgetWindow = ko.observable(false);
        self.showUpdateBudgetWindow = ko.observable(false);
        self.periodicityLabels.push({
            label: self.resource.budget.create.thismonth,
            value: "Once"
        }, {
            label: self.resource.budget.create.recurring,
            value: "Recursive"
        }, {
            label: self.resource.budget.create.specific,
            value: "Custom"
        });
        var localeMonthNames = oj.LocaleData.getMonthNames("abbreviated");
        for (var m = 0; m < localeMonthNames.length; m++) {
            self.monthNames.push({
                label: localeMonthNames[m],
                value: m + 1
            });
        }
        BudgetListModel.getHostDate().done(function(data) {
            self.date = new Date(data.currentDate.valueDate);
            self.fromDateMonth([(self.date.getMonth() + 1).toString()]);
            self.toDateMonth([(self.date.getMonth() + 2).toString()]);
            self.fromDateYear([self.date.getFullYear().toString()]);
            self.toDateYear([self.date.getFullYear().toString()]);
            var currentYear = self.date.getFullYear();
            self.year.push({
                label: currentYear.toString(),
                value: currentYear
            }, {
                label: (currentYear + 1).toString(),
                value: currentYear + 1
            }, {
                label: (currentYear + 2).toString(),
                value: currentYear + 2
            });
            self.dateLoaded(true);
        });
        self.menuItems = [{
                id: "update",
                label: self.resource.budget.menu.update,
                disabled: false
            },
            {
                id: "delete",
                label: self.resource.budget.menu.delete,
                disabled: false
            }
        ];
        self.openMenu = function(model, event) {
            var launcherId = event.currentTarget.attributes.id.nodeValue;
            self.launcherId = launcherId;
            var menuVisible = $("#" + launcherId + "-container")[0].style.display === "block";
            if (!menuVisible) {
                try {
                    setTimeout(function(model, event) {
                        self.open(model, event);
                    }, 0.1);
                } catch (e) {
                    $("#" + launcherId + "-container")[0].style.display = "block";
                }
            } else {
                $("#" + launcherId + "-container")[0].style.display = "none";
            }
        };
        self.open = function(model, event) {
            $("#" + self.launcherId + "-container").ojMenu("open", event);
        };

        self.menuItemSelect = function(data, event) {
            self.budgetDetails(data.data);

            if (event.target.value === "update") {
                self.frequency(self.budgetDetails().frequency).amount(self.budgetDetails().amount.amount).periodicity(self.budgetDetails().periodicity).localCurrency(self.budgetDetails().amount.currency).categoryId(self.budgetDetails().categoryId).categoryName(self.budgetDetails().categoryName);
                if (self.budgetDetails().periodicity === "Custom") {
                    var startDate = new Date(self.budgetDetails().startDate);
                    var endDate = new Date(self.budgetDetails().endDate);
                    self.fromDateMonth([(startDate.getMonth() + 1).toString()]).toDateMonth([(endDate.getMonth() + 1).toString()]);
                    self.fromDateYear([startDate.getFullYear().toString()]).toDateYear([endDate.getFullYear().toString()]);
                } else {
                    self.fromDateMonth([(self.date.getMonth() + 1).toString()]).toDateMonth([(self.date.getMonth() + 2).toString()]).fromDateYear([self.date.getFullYear().toString()]).toDateYear([self.date.getFullYear().toString()]);
                }
                self.updateBudgetInitiate();

            } else {
                self.deleteBudgetInitiate();
            }
        };
        self.createBudgetCloseHandler = function() {
            $("#createbudget").hide();
            self.showCreateBudgetWindow(false);
        };
        self.updateBudgetCloseHandler = function() {
            $("#updatebudget").hide();
            self.showUpdateBudgetWindow(false);
        };
        self.deleteBudgetCloseHandler = function() {
            $("#deletebudget").hide();
        };
        self.launchMenu = function(data, event) {
            $("#budgetMenuMenu" + data.categoryId).ojMenu("open", event);
        };
        var barTooltip = document.createElement("div");
        self.budgetTooltipCallback = function(dataContext) {
            var consumed = Params.baseModel.formatCurrency(Number(dataContext.label.replace(/[,]/g, "")), self.baseCurrency);
            if (consumed && consumed !== "") {
                require(["text!../partials/pfm/budget/budget-progress-tool-tip.html"], function(barTooltipLocal) {
                    var tooltip = {
                        title: Params.baseModel.format(self.resource.budget.consumedtitletooltip, { value: consumed }),
                        consumedTitle: Params.baseModel.format(self.resource.budget.consumedtitletooltip, { value: consumed })
                    };
                    $(barTooltip).html(barTooltipLocal);
                    ko.cleanNode(barTooltip);
                    ko.applyBindings(tooltip, barTooltip);
                });
                return barTooltip;
            }
        };
        self.getBudgets = function() {
            self.dataLoaded(false);
            ko.tasks.runEarly();
            BudgetListModel.budgetList().done(function(data) {
                if (data.budgetDTOs) {
                    self.baseCurrency = data.budgetDTOs[0].amount.currency;
                    self.categoryIdsWhichAreAlreadyUsed.removeAll();
                    if (data.budgetDTOs) {
                        for (var i = 0; i < data.budgetDTOs.length; i++) {
                            self.categoryIdsWhichAreAlreadyUsed.push({ categoryId: data.budgetDTOs[i].categoryId });
                        }
                    }
                    if (data.budgetDTOs && data.budgetDTOs.length > 0) {
                        BudgetListModel.spendList(data.budgetDTOs[0].startDate.substring(0, 10), data.budgetDTOs[0].endDate.substring(0, 10)).done(function(spendCategoryList) {
                            if (spendCategoryList.spendAnalysis) {
                                for (var i = 0; i < data.budgetDTOs.length; i++) {
                                    for (var j = 0; j < spendCategoryList.spendAnalysis.length; j++) {
                                        if (data.budgetDTOs[i].categoryId === spendCategoryList.spendAnalysis[j].categoryId) {
                                            data.budgetDTOs[i].categoryName = spendCategoryList.spendAnalysis[j].categoryName;
                                            data.budgetDTOs[i].consumedAmount = spendCategoryList.spendAnalysis[j].totalSpent;
                                            var budgetConsumed = spendCategoryList.spendAnalysis[j].totalSpent / data.budgetDTOs[i].amount.amount * 100;
                                            data.budgetDTOs[i].consumed = Math.floor(budgetConsumed * 100) / 100;
                                        }
                                    }
                                }
                            }
                            var array = $.map(data.budgetDTOs, function(u) {
                                u.consumed = Number(u.consumed ? u.consumed.toFixed(2) : 0);
                                var obj = {
                                    "data": u,
                                    "categoryName": u.categoryName || "-",
                                    "categoryId": u.categoryId || "-",
                                    "amount": u.amount || "-",
                                    "consumed": u.consumed,
                                    "consumedAmount": Math.round(u.consumedAmount || 0),
                                    "thresholdValues": [{
                                            max: Math.round(u.amount.amount / 2),
                                            color: "#2E7D32"
                                        },
                                        { color: "#D54215" }
                                    ]
                                };
                                return obj;
                            });
                            self.budgetListDataSource = new oj.ArrayTableDataSource(array, { idAttribute: "categoryName" });
                            self.dataLoaded(true);
                            self.noBudgets(false);
                        });
                    } else {
                        self.noBudgets(true);
                    }
                } else {
                    self.noBudgets(true);
                }
            });
        };
        self.getBudgets();
        self.getspendCategoryList = function() {
            BudgetListModel.spendCategoryList().done(function(data) {
                categoriesUsed = false;
                if (data.spendCategoryList) {
                    self.categoryList.removeAll();
                    for (var k = 0; k < data.spendCategoryList.length; k++) {
                        var isThere = false;
                        for (var i = 0; i < self.categoryIdsWhichAreAlreadyUsed().length; i++) {
                            if (self.categoryIdsWhichAreAlreadyUsed()[i].categoryId === data.spendCategoryList[k].categoryId) {
                                isThere = true;
                            }
                        }
                        if (!isThere) {
                            self.categoryList.push({
                                "name": data.spendCategoryList[k].name,
                                "categoryId": data.spendCategoryList[k].categoryId
                            });
                        }
                    }
                    if (data.spendCategoryList.length === self.categoryIdsWhichAreAlreadyUsed().length)
                        categoriesUsed = true;
                    categoriesLoaded = true;
                }
            });
        };
        self.getspendCategoryList();
        self.done = function() {
            $("#warning").hide();
        };
        self.createBudgetInitiate = function() {
            self.getspendCategoryList();

            if (categoriesLoaded) {
                if (categoriesUsed) {
                    Params.baseModel.showMessages(null, [self.resource.budget.msg], "INFO");
                    return;
                }
                Params.baseModel.incrementIdCount();
                self.frequency("Monthly").amount("").periodicity("Once").localCurrency("GBP").categoryId("").categoryName("");
                self.disableFormControls(true);
                self.categoryName("");
                ko.tasks.runEarly();
                self.disableFormControls(false);
                self.fromDateMonth([(self.date.getMonth() + 1).toString()]).toDateMonth([(self.date.getMonth() + 2).toString()]).fromDateYear([self.date.getFullYear().toString()]).toDateYear([self.date.getFullYear().toString()]);
                self.disableFormControls(false);
                self.budgetDetails({});
                self.showCreateBudgetWindow(true);
                $("#createbudget").trigger("openModal");

                self.confirmMessage(false);
                categoriesLoaded = false;
            }
        };
        self.createBudgetConfirm = function() {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("budgetTracker"))) {
                return;
            }
            if (self.periodicity() === "Custom") {
                self.customPeriodicityValue(((parseInt(self.toDateYear()) - parseInt(self.fromDateYear()) - 1) * 12) + (12 - parseInt(self.fromDateMonth())) + parseInt(self.toDateMonth()) + 1);
            }
            self.budgetPayload.categoryId(self.categoryId());
            self.budgetPayload.amount.amount(self.amount());
            self.budgetPayload.amount.currency(self.localCurrency());
            self.budgetPayload.frequency(self.frequency());
            self.budgetPayload.periodicity(self.periodicity());
            self.budgetPayload.customPeriodicityValue(self.customPeriodicityValue());
            var payload = ko.toJSON(self.budgetPayload);
            BudgetListModel.createBudget(payload).done(function() {
                self.successMsg = self.resource.budget.create.successMsg;
                self.confirmMessage(true);
                self.cancelModalWindow();
                self.getBudgets();
            });
            self.getspendCategoryList();
        };
        self.updateBudgetInitiate = function() {
            self.disableFormControls(true);
            self.showUpdateBudgetWindow(true);
            $("#updatebudget").trigger("openModal");
            self.confirmMessage(false);
        };
        self.updateBudgetConfirm = function() {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("budgetTracker"))) {
                return;
            }
            self.budgetPayload.categoryId(self.categoryId());
            self.budgetPayload.amount.amount(self.amount());
            self.budgetPayload.amount.currency(self.localCurrency());
            self.budgetPayload.frequency(self.frequency());
            self.budgetPayload.periodicity(self.periodicity());
            if (self.periodicity() === "Custom") {
                self.customPeriodicityValue(((parseInt(self.toDateYear()) - parseInt(self.fromDateYear()) - 1) * 12) + (12 - parseInt(self.fromDateMonth())) + parseInt(self.toDateMonth()) + 1);
            }
            self.budgetPayload.customPeriodicityValue(self.customPeriodicityValue());
            var payload = ko.toJSON(self.budgetPayload);
            BudgetListModel.updateBudget(payload, self.budgetDetails().categoryId, self.budgetDetails().versionId, self.budgetDetails().budgetId).done(function() {
                self.successMsg = self.resource.budget.update.successMsg;
                self.confirmMessage(true);
                self.cancelModalWindow();
                self.getBudgets();
            });
        };
        self.deleteBudgetInitiate = function() {
            $("#deletebudget").trigger("openModal");
            self.confirmMessage(false);
        };
        self.deleteBudgetConfirm = function() {
            BudgetListModel.deleteBudget(self.budgetDetails().budgetId).done(function() {
                self.successMsg = self.resource.budget.delete.successMsg;
                self.confirmMessage(true);
                self.cancelModalWindow();
                self.getBudgets();
                categoriesUsed = false;
            });
        };
        self.cancelModalWindow = function() {
            $("#createbudget").hide();
            self.showCreateBudgetWindow(false);
            $("#updatebudget").hide();
            self.showUpdateBudgetWindow(false);
            $("#deletebudget").hide();
        };
    };
});