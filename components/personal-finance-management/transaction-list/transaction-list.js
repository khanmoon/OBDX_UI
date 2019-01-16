define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/transaction-list",
    "ojL10n!resources/nls/amount-input",
    "promise",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource",
    "ojs/ojbutton",
    "ojs/ojtoolbar",
    "ojs/ojoffcanvas",
    "ojs/ojcheckboxset",
    "ojs/ojselectcombobox",
    "ojs/ojlistview",
    "ojs/ojnavigationlist",
    "ojs/ojradioset",
    "ojs/ojinputtext",
    "ojs/ojvalidationgroup",
    "ojs/ojmenu",
    "ojs/ojoption",
    "ojs/ojknockout-validation"
], function(oj, ko, $, TransactionList, ResourceBundle, amountInputlocale) {
    "use strict";

    var vm = function(Params) {
        var self = this;

        ko.utils.extend(self, Params.rootModel);

        self.resource = ResourceBundle;
        self.transactionsDataSource = ko.observable();

        self.categoriesLoaded = ko.observable(false);
        self.accountsLoaded = ko.observable(false);

        self.transactionsLoaded = ko.observable(false);
        self.onlyCategoryChanged = ko.observable(true);

        self.refreshSubCategories = ko.observable(true);
        self.refreshSplitModalWindow = ko.observable(false);
        self.tickAllCheckBoxes = ko.observable(false);
        self.flag = true;

        self.selectedSubCategories = ko.observableArray();
        self.selectedCategory = "";

        self.categoryList = ko.observableArray();
        self.subcategoryList = ko.observableArray();

        self.categorizedTransactionList = ko.observable();
        self.validationTracker = ko.observable();

        self.selectedDuration = ko.observable("0");
        self.selectedAccount = ko.observable("all");
        self.durationFilter = ko.observable("");
        self.accountFilter = ko.observable("");

        self.selectedAccountLabel = ko.observable();
        self.selectedDurationLabel = ko.observable(self.resource.filter.l30days);

        self.selectedDurationRadio = ko.observable("0");
        self.selectedAccountRadio = ko.observable("all");

        self.categoryFilter = "";
        self.dateFilterResorce = "fromDate={fyear}-{fmonth}-{fdate}&toDate={tyear}-{tmonth}-{tdate}";

        Params.baseModel.registerElement(["amount-input", "modal-window", "search-box", "nav-bar", "date-box"]);
        Params.baseModel.registerComponent("spend-category-create", "personal-finance-management");
        Params.baseModel.registerComponent("manage-spend-categories", "personal-finance-management");
        Params.baseModel.registerComponent("spend-transaction-card", "personal-finance-management");

        Params.dashboard.headerName(self.resource.title);

        self.successMsg = ko.observable();
        self.splitDetails = ko.observableArray();
        self.showActivitySuccessMsg = ko.observable(false);

        var nameRegEx = /^[a-zA-Z0-9 \&\:\$\,\.\_]+$/;

        self.validateName = {
            validate: function(value) {

                if ((!nameRegEx.test(value) || value.length > 40) && value !== "") {
                    throw new oj.ValidatorError("", self.resource.recategorize.validationmsg);
                }

                return true;
            }
        };

        self.validateSplitAmount = {
            validate: function(value) {
                if (ko.utils.unwrapObservable(self.selectedTransactionForSplit().transactionAmount.currency) === "") {
                    throw new oj.ValidatorError("", amountInputlocale.currencyValidation);
                }
                if (value !== null && (isNaN(value) || value <= 0)) {
                    throw new oj.ValidatorError("", amountInputlocale.amountValidation);
                }
                if (value) {
                    var numberfractional = value.toString().split(".");
                    if ((numberfractional[0]) && (numberfractional[0].length > 13 || numberfractional[1]) && (numberfractional[1].length > 2)) {
                        throw new oj.ValidatorError("", amountInputlocale.amountValidation);
                    }
                }
                return true;
            }
        };

        var getSplitObjectInstance = function() {
                var KoModel = ko.mapping.fromJS(TransactionList.getNewModel());
                return KoModel.splitObject;
            },

            getSplitPayloadElement = function() {
                var KoModel = ko.mapping.fromJS(TransactionList.getNewModel());
                return KoModel.splitPayloadElement;
            },

            getSplitPayload = function() {
                var KoModel = ko.mapping.fromJS(TransactionList.getNewModel());
                return KoModel.splitPayload;
            };

        self.filterDrawer = {
            "selector": "#filterDrawer",
            "content": "#txnMainContent",
            "modality": "modal",
            "displayMode": "overlay",
            "edge": "end"
        };

        self.toggleFilter = function() {
            oj.OffcanvasUtils.toggle(self.filterDrawer);
        };

        self.addSplitCategory = function() {
            self.refreshSplitModalWindow(false);
            self.splitDetails().push(getSplitObjectInstance());
            ko.tasks.runEarly();
            self.refreshSplitModalWindow(true);

        };

        self.removeSplitCategory = function(index) {
            self.refreshSplitModalWindow(false);
            self.splitDetails().splice(index, 1);
            ko.tasks.runEarly();
            self.refreshSplitModalWindow(true);
        };

        function filterApplied(filter) {
            if (!filter || filter === "" || filter === null) {
                return false;
            }
            return true;
        }

        function applyFilter(_a, d, scl) {

            /**
                Variable represents string which will be appended to URL for applying category filter
            */
            var c = self.selectedCategory;

            /**
                Variable represents string which will be appended to URL for applying sub-category filter
            */
            var sc = "";

            /**
                Variable represents string which will be appended to URL for applying account filter
            */
            var a = (_a === "accountId=all") ? "" : _a;

            /**
                Variable represents final filter string which will be appended to URL for applying user selected filters
            */
            var filter = "";

            if ((filterApplied(self.selectedCategory) && scl.length < 1)) {
                c = "";
            }

            if (scl.indexOf("all") < 0) {
                for (var i = 0; i < scl.length; i++) {
                    sc += ((i !== scl.indexOf("OTHER-U")) ? ("&subCategoryId=" + scl[i]) : "!OTH!");
                }
            }

            if (filterApplied(c)) {
                filter = filterApplied(filter) ? ("&" + filter + (c === "UN-CATEGORIZED" ? "fetchUncategorizedTransactions=true" : ("categoryId=" + c)) + (filterApplied(sc) ? sc.replace("!OTH!", "") + ((scl.indexOf("OTHER-U") < 0) ? "" : "&fetchUnsubcategorizedTransactions=true") : "")) : (filter + (c === "UN-CATEGORIZED" ? "fetchUncategorizedTransactions=true" : ("categoryId=" + c)) + (filterApplied(sc) ? sc.replace("!OTH!", "") + ((scl.indexOf("OTHER-U") < 0) ? "" : "&fetchUnsubcategorizedTransactions=true") : ""));
            }

            if (filterApplied(a)) {
                filter = filterApplied(filter) ? (filter + "&" + a) : (filter + a);
            }

            if (filterApplied(d)) {
                filter = filterApplied(filter) ? (filter + "&" + d) : (filter + d);
            }

            self.listTransactions(filterApplied(filter) ? ("?" + filter) : "");

        }

        self.saveSplitTransaction = function() {
            if (document.getElementById("splitTransactionTracker")) {
                if (!Params.baseModel.showComponentValidationErrors(document.getElementById("splitTransactionTracker")))
                    return;
            }
            var payload = getSplitPayload();

            for (var i = 0; i < self.splitDetails().length; i++) {
                var payloadElement = getSplitPayloadElement();
                payloadElement.categoryId = self.splitDetails()[i].categoryId();
                payloadElement.subcategoryId = self.splitDetails()[i].subcategoryId()[0];
                payloadElement.transactionAmount.amount = self.splitDetails()[i].amount();
                payloadElement.transactionAmount.currency = self.selectedTransactionForSplit().transactionAmount.currency;

                payload.splitTransactions().push(payloadElement);

            }

            TransactionList.splitxn(ko.toJSON(payload), self.selectedTransactionForSplit().transactionId, self.selectedTransactionForSplit().subSequenceId).done(function() {
                self.successMsg(self.resource.split.successMsg);
                self.showActivitySuccessMsg(true);
                applyFilter(self.accountFilter(), self.durationFilter(), self.selectedSubCategories());
                setTimeout(function() {
                    self.showActivitySuccessMsg(false);
                }, 4000);
                $("#split-transaction").hide();
                self.refreshSplitModalWindow(false);
                self.splitDetails([getSplitObjectInstance(), getSplitObjectInstance()]);
                self.selectedTransactionForSplit({
                    transactionAmount: {
                        currency: ""
                    }
                });
            });
        };

        self.splitCategoryChangeHandler = function(index, event) {
            if (event.detail.value && event.detail.trigger && event.detail.value !== event.detail.previousValue) {
                self.refreshSplitModalWindow(false);
                self.splitDetails()[index].categoryId(event.detail.value);
                var obj = ko.utils.arrayFirst(self.categoryList(), function(element) {
                    return element.categoryId === self.splitDetails()[index].categoryId();
                });

                self.splitDetails()[index].subcategoryList(obj.subcategoryList);
                ko.tasks.runEarly();
                self.refreshSplitModalWindow(true);

            }

        };

        self.selectedTransactionForSplit = ko.observable({
            transactionAmount: {
                currency: ""
            }
        });

        self.split = function(data) {
            self.showActivitySuccessMsg(false);
            self.splitDetails([getSplitObjectInstance(), getSplitObjectInstance()]);
            self.selectedTransactionForSplit(ko.utils.arrayFirst(self.categorizedTransactionList(), function(element) {
                return ((element.subSequenceId === data.subSequenceId) && (element.transactionId === data.transactionId));
            }));
            self.refreshSplitModalWindow(true);
            $("#split-transaction").trigger("openModal");

        };

        self.closeSplitWindow = function() {
            $("#split-transaction").hide();
            self.refreshSplitModalWindow(false);

        };
        self.filter = ko.computed(function() {
            if (!self.onlyCategoryChanged()) {
                applyFilter(self.accountFilter(), self.durationFilter(), self.selectedSubCategories());
                self.onlyCategoryChanged(true);
            }
        });

        function setDurationFilter(days) {
            var today = self.today;
            var priorDate = new Date(new Date(today).setDate(today.getDate() - Number(days)));

            self.durationFilter(Params.baseModel.format(self.dateFilterResorce, {
                fyear: priorDate.getFullYear(),
                fmonth: priorDate.getMonth() + 1,
                fdate: priorDate.getDate(),
                tyear: today.getFullYear(),
                tmonth: today.getMonth() + 1,
                tdate: today.getDate()
            }));
            self.onlyCategoryChanged(false);
        }

        self.resetFilter = function() {
            self.selectedSubCategories([]);
            self.accountFilter("");
            setDurationFilter(self.today.getDate() - 1);
            self.selectedAccountLabel(self.resource.filter.allaccounts);
            self.selectedDurationLabel(self.resource.filter.l30days);
            self.selectedAccount("all");
            self.selectedDuration("0");
        };

        self.resetCategoryFilter = function() {
            if (self.selectedSubCategories().length > 0) {
                self.tickAllCheckBoxes(false);
                self.selectedSubCategories([]);
            } else {
                self.onlyCategoryChanged(false);
            }

        };

        self.durationChangeHandler = function(event) {
            self.selectedDurationLabel(event.target.value.label);
            setDurationFilter(event.target.value.value !== "0" ? event.target.value.value : (self.today.getDate() - 1));
        };

        self.accountChangeHandler = function(event) {
            self.selectedAccountLabel(event.target.value.label);
            self.accountFilter("accountId=" + event.target.value.value);
            self.onlyCategoryChanged(false);
        };

        self.durationRadioChanged = function(event) {
            if (event.detail.value)
                self.selectedDurationLabel(event.target.value);
            setDurationFilter(event.target.value !== "0" ? event.target.value : (self.today.getDate() - 1));

        };

        self.accountRadioChanged = function(event) {
            if (event.detail.value)
                self.selectedAccountLabel(event.target.value);
            self.accountFilter("accountId=" + event.target.value);
            self.onlyCategoryChanged(false);
        };

        self.filterOptions = ko.observableArray([{

        }, {
            id: true,
            label: self.resource.filter.duration,
            filterList: [{
                label: self.resource.filter.thisMonth,
                value: "0"
            }, {
                label: self.resource.filter.l30days,
                value: "30"
            }, {
                label: self.resource.filter.l60days,
                value: "60"
            }, {
                label: self.resource.filter.l90days,
                value: "90"
            }]
        }]);

        self.categoryFilterChangeHandler = function(data) {
            if (self.subcategoryList() !== data.subcategoryList || !data.subcategoryList) {

                if (!Params.baseModel.small()) {
                    for (var i = 0; i < self.categoryList().length; i++) {
                        if (data.categoryId === self.categoryList()[i].categoryId) {
                            self.selectedCategory = self.categoryList()[i].categoryId;
                            $("#arrow" + self.categoryList()[i].categoryId.replace(/[_.,:\$\s]/g, "")).addClass("offcanvas-box__menu__option__selected");
                        } else {
                            $("#arrow" + self.categoryList()[i].categoryId.replace(/[_.,:\$\s]/g, "")).removeClass("offcanvas-box__menu__option__selected");
                        }
                    }
                }
                self.onlyCategoryChanged(true);
                self.refreshSubCategories(false);
                self.tickAllCheckBoxes(false);
                self.selectedSubCategories([]);
                self.subcategoryList(data.subcategoryList || []);
                ko.tasks.runEarly();
                self.refreshSubCategories(true);

            }

        };

        self.recategorizationSubCategoryList = ko.observableArray();
        self.selectedRecategorizationCategory = ko.observable([]);
        self.selectedRecategorizationSubCategory = ko.observable([]);

        self.newRecategorizationCategory = ko.observable();
        self.newRecategorizationSubCategory = ko.observable();
        self.transactionKey = {
            subSequenceId: "",
            transactionId: "",
            splitId: null

        };

        self.refreshModalWindow = ko.observable(false);
        self.loadCategoryCreateTemplate = ko.observable(false);

        var getRecategorizationPayload = function() {
                var KoModel = ko.mapping.fromJS(TransactionList.getNewModel());
                return KoModel.recategorizationPayload;
            },
            getcreateSpendCategoryPayload = function() {
                var KoModel = ko.mapping.fromJS(TransactionList.getNewModel());
                return KoModel.createSpendCategoryPayload;
            };

        self.recategorize = function(data) {

            self.transactionKey = {
                subSequenceId: data.subSequenceId,
                transactionId: data.transactionId,
                splitId: data.splitId || null
            };
            self.showActivitySuccessMsg(false);
            self.selectedRecategorizationCategory([]);
            self.selectedRecategorizationSubCategory([]);
            self.newRecategorizationCategory("");
            self.newRecategorizationSubCategory("");
            self.recategorizationSubCategoryList([]);
            self.refreshModalWindow(true);
            self.loadCategoryCreateTemplate(false);

            $("#recategorize").trigger("openModal");

        };

        self.closeWindow = function() {
            $("#recategorize").hide();
            self.refreshModalWindow(false);

        };

        self.saveRecategorization = function() {
            var createRecategorizationTracker = document.getElementById("createRecategorizationTracker");
            var createCategoryTracker = document.getElementById("createCategoryTracker");
            if (document.getElementById("transRecategorizationTracker")) {
                if (!Params.baseModel.showComponentValidationErrors(document.getElementById("transRecategorizationTracker")))
                    return;
            }
            if (createRecategorizationTracker && createCategoryTracker) {
                var createCategoryFailed = !Params.baseModel.showComponentValidationErrors(createCategoryTracker);
                var createRecategorizationFailed = !Params.baseModel.showComponentValidationErrors(createRecategorizationTracker);
                if (createCategoryFailed || createRecategorizationFailed)
                    return;
            }
            if (self.refreshModalWindow()) {
                self.fireRecategorizationRequest();

            } else if (self.loadCategoryCreateTemplate()) {

                var createSpendCategoryPayload = getcreateSpendCategoryPayload();
                createSpendCategoryPayload.code(self.newRecategorizationCategory() + "_U");
                createSpendCategoryPayload.name(self.newRecategorizationCategory());
                createSpendCategoryPayload.description(self.newRecategorizationCategory());

                if (self.newRecategorizationSubCategory() && self.newRecategorizationSubCategory() !== "") {
                    createSpendCategoryPayload.subCategoryList()[0] = {
                        code: self.newRecategorizationSubCategory(),
                        name: self.newRecategorizationSubCategory,
                        description: self.newRecategorizationSubCategory
                    };
                }

                TransactionList.addCategory(ko.toJSON(createSpendCategoryPayload)).done(function(data) {
                    self.selectedRecategorizationCategory()[0] = data.categoryId;
                    self.selectedRecategorizationSubCategory()[0] = data.subCategoryIdList[0];
                    self.fireRecategorizationRequest();
                });

            }
        };

        self.fireRecategorizationRequest = function() {
            var payload = getRecategorizationPayload();

            payload.transactionReferenceId(self.transactionKey.transactionId);
            payload.subSequenceId(self.transactionKey.subSequenceId);
            payload.splitId(self.transactionKey.splitId);
            payload.categoryId(self.selectedRecategorizationCategory());
            payload.subCategoryId(self.selectedRecategorizationSubCategory() ? self.selectedRecategorizationSubCategory() : null);

            TransactionList.recategorizeTransaction(ko.toJSON([payload])).done(function() {
                if (self.loadCategoryCreateTemplate())
                    self.listAllCategories();
                self.closeWindow();
                self.successMsg(self.resource.recategorize.successMsg);
                self.showActivitySuccessMsg(true);
                applyFilter(self.accountFilter(), self.durationFilter(), self.selectedSubCategories());
                setTimeout(function() {
                    self.showActivitySuccessMsg(false);
                }, 4000);
            });
        };

        self.recategorizationCategoryChangeHandler = function(event) {
            if (event.detail.value && event.detail.value !== event.detail.previousValue) {
                self.selectedRecategorizationCategory(event.detail.value);
                self.refreshModalWindow(false);
                var obj = ko.utils.arrayFirst(self.categoryList(), function(element) {
                    return element.categoryId === self.selectedRecategorizationCategory();
                });

                self.recategorizationSubCategoryList(obj.subcategoryList);
                ko.tasks.runEarly();
                self.refreshModalWindow(true);

            }
        };

        self.addNewCategory = function() {
            self.refreshModalWindow(false);
            self.loadCategoryCreateTemplate(true);
        };

        self.cancelcategoryadd = function() {
            self.refreshModalWindow(true);
            self.loadCategoryCreateTemplate(false);
        };

        self.checkBoxModeChangeHandler = function(event) {
            if (event.detail.value) {
                if (self.selectedSubCategories().indexOf("all") > -1) {
                    self.tickAllCheckBoxes(true);
                }

                if ((event.detail.previousValue.indexOf("all") > -1) && (event.detail.value.indexOf("all") === -1)) {
                    self.selectedSubCategories([]);
                    self.tickAllCheckBoxes(false);
                } else if (self.selectedSubCategories().length === self.subcategoryList().length) {
                    self.tickAllCheckBoxes(true);
                }

                if ((event.detail.previousValue.indexOf("all") > -1) && (event.detail.value.indexOf("all") > -1)) {
                    self.selectedSubCategories().splice(self.selectedSubCategories().indexOf("all"), 1);
                    self.tickAllCheckBoxes(false);
                } else if (self.tickAllCheckBoxes()) {
                    if (self.selectedSubCategories().indexOf("all") === -1) {
                        self.selectedSubCategories().push("all");
                    }
                    for (var i = 0; i < self.subcategoryList().length; i++) {
                        if (self.selectedSubCategories().indexOf(self.subcategoryList()[i].categoryId) === -1) {
                            self.selectedSubCategories().push(self.subcategoryList()[i].categoryId);
                        }
                    }
                }
                self.onlyCategoryChanged(false);
            }
        };

        self.beforeExpand = function(event) {
            if (event.detail.key.indexOf("li-filter-on-category-subcategory-") > -1) {
                var expandedItems = $("#ojNavigationList-filter").ojNavigationList("getExpanded");
                for (var i = 0; i < expandedItems.length; i++) {
                    if (expandedItems[i].indexOf("li-filter-on-category-subcategory-") > -1) {
                        self.tickAllForCategoryMap()[expandedItems[i].split("li-filter-on-category-subcategory-")[1]](false);
                        $("#ojNavigationList-filter").ojNavigationList("collapse", expandedItems[i], false);
                    }
                }
            }

        };

        self.checkBoxModeChangeHandlerSmall = function(event) {
            if (event.detail.value) {

                if (event.detail.value && event.detail.value.indexOf("-") > -1) {
                    self.selectedCategory = event.detail.value.split("-").length > 2 ? "UN-CATEGORIZED" : event.detail.value.split("-")[1];
                    event.detail.value = "all";
                }

                if ((event.detail.previousValue.indexOf("all") > -1) && (event.detail.value.indexOf("all") === -1)) {
                    self.selectedSubCategories([]);
                } else if ((event.detail.previousValue.indexOf("all") > -1) && (event.detail.value.indexOf("all") > -1)) {
                    self.selectedSubCategories().splice(self.selectedSubCategories().indexOf("all"), 1);
                    self.tickAllForCategoryMap()[self.selectedCategory](false);
                    ko.tasks.runEarly();

                } else if (self.tickAllForCategoryMap()[self.selectedCategory]()) {
                    for (var i = 0; i < self.subcategoryList().length; i++) {
                        if (self.selectedSubCategories().indexOf(self.subcategoryList()[i].categoryId) === -1) {
                            self.selectedSubCategories().push(self.subcategoryList()[i].categoryId);
                        }
                    }
                }
                self.onlyCategoryChanged(false);
            }
        };

        var categoryFilterSizeSet = false;
        self.setCategoryFilterSize = function() {
            if (!categoryFilterSizeSet && !Params.baseModel.small()) {
                setTimeout(function() {
                    var ULelement = document.getElementById("categories-filter-wrapper"),
                        length = self.longestName.length;
                    ULelement.style.width = ((length * 22) - Math.exp(length - (length * 0.85))).toString() + "px";
                    categoryFilterSizeSet = true;
                }, 1);
            }
        };

        self.afterRender = function() {
            $("#arrow" + self.categoryList()[0].categoryId.replace(/[_.,:\$\s]/g, "")).addClass("offcanvas-box__menu__option__selected");
        };

        self.tickAllForCategoryMap = ko.observable({});
        self.listAllCategories = function() {
            TransactionList.listAllCategories().done(function(data) {
                self.longestName = (self.resource.uncategorized).length > (self.resource.filter.all).length ? self.resource.uncategorized : self.resource.filter.all;

                if (data.spendCategoryList) {
                    for (var i = 0; i < data.spendCategoryList.length; i++) {
                        if (((!data.spendCategoryList[i].parentId) || (data.spendCategoryList[i].parentId === null))) {

                            if (data.spendCategoryList[i].subCategoryList) {
                                data.spendCategoryList[i].subCategoryList[data.spendCategoryList[i].subCategoryList.length] = {
                                    categoryId: "OTHER-U",
                                    code: "OTHER-U",
                                    description: self.resource.other,
                                    name: self.resource.other
                                };
                            } else {
                                data.spendCategoryList[i].subCategoryList = [{
                                    categoryId: "OTHER-U",
                                    code: "OTHER-U",
                                    description: self.resource.other,
                                    name: self.resource.other
                                }];
                            }

                            self.categoryList().push({
                                categoryId: data.spendCategoryList[i].categoryId,
                                name: data.spendCategoryList[i].name,
                                subcategoryList: data.spendCategoryList[i].subCategoryList
                            });
                            self.tickAllForCategoryMap()[data.spendCategoryList[i].categoryId] = ko.observable(false);
                            if (data.spendCategoryList[i].name.length > self.longestName.length) {
                                self.longestName = data.spendCategoryList[i].name;
                            }

                            if (data.spendCategoryList[i].subCategoryList) {
                                for (var k = 0; k < data.spendCategoryList[i].subCategoryList.length; k++) {
                                    if (data.spendCategoryList[i].subCategoryList[k].name.length > self.longestName.length) {
                                        self.longestName = data.spendCategoryList[i].subCategoryList[k].name;
                                    }
                                }

                            }

                        }
                    }
                }

                self.tickAllForCategoryMap()["UN-CATEGORIZED"] = ko.observable(false);

                self.categoryList().push({
                    categoryId: "UN-CATEGORIZED",
                    name: self.resource.uncategorized,
                    subcategoryList: []
                });

                self.selectedCategory = self.categoryList()[0].categoryId;
                self.subcategoryList(self.categoryList()[0].subcategoryList);
                ko.tasks.runEarly();
                self.categoriesLoaded(true);
            });
        };

        self.listAllCategories();

        TransactionList.listAccounts().done(function(data) {

            self.selectedAccountLabel(self.resource.filter.allaccounts);

            var filterList = [{
                label: self.resource.filter.allaccounts,
                value: "all"
            }];

            for (var i = 1; i <= data.accounts.length; i++) {
                filterList[i] = {
                    label: data.accounts[i - 1].id.displayValue,
                    value: data.accounts[i - 1].id.value
                };
            }

            self.filterOptions()[0] = {
                id: false,
                label: self.resource.filter.accounts,
                filterList: filterList
            };

            self.accountsLoaded(true);

        });

        var sortAscending = true;

        function sortTxnByDate(a, b) {
            if (a.valueDateObject < b.valueDateObject)
                return sortAscending ? -1 : 1;
            else if (a.valueDateObject > b.valueDateObject)
                return sortAscending ? 1 : -1;
            return 0;
        }

        self.sortcallback = function(event, ui) {
            sortAscending = ui.direction === "ascending";
            if (ui.header === "valueDateObject") {
                self.categorizedTransactionList().sort(sortTxnByDate);
                self.transactionsDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.categorizedTransactionList())));
            }

        };

        self.listTransactions = function(filter) {

            TransactionList.listTransactions(filter).done(function(data) {
                self.transactionsLoaded(false);
                self.categorizedTransactionList([]);

                if (data.categorizedTransactionList) {
                    for (var i = 0; i < data.categorizedTransactionList.length; i++) {
                        var element = data.categorizedTransactionList[i];
                        var isSplittedTxn = element.splitTransactions ? element.splitTransactions : null;

                        if (isSplittedTxn) {
                            for (var j = 0; j < element.splitTransactions.length; j++) {
                                if (((filterApplied(self.selectedCategory)) && ((self.selectedCategory === element.splitTransactions[j].categoryId) && ((self.selectedSubCategories().indexOf("all") > -1) || (self.selectedSubCategories().indexOf(element.splitTransactions[j].subcategoryId) > -1) || (self.selectedSubCategories().indexOf("OTHER-U") > -1 && !element.splitTransactions[j].subcategoryId)))) || (self.selectedSubCategories().length === 0)) {
                                    self.categorizedTransactionList().push({
                                        valueDateObject: new Date(element.valueDate),
                                        categoryName: element.splitTransactions[j].categoryName || self.resource.uncategorized,
                                        subcategoryName: element.splitTransactions[j].subcategoryName || "",
                                        transactionDescription: element.transactionDescription || "",
                                        accountId: element.accountId,
                                        transactionAmount: element.splitTransactions[j].transactionAmount,
                                        amount: element.splitTransactions[j].transactionAmount.amount,
                                        isSplittedTxn: isSplittedTxn,
                                        subSequenceId: element.subSequenceId,
                                        transactionId: element.transactionReferenceId,
                                        splitId: element.splitTransactions[j].splitId
                                    });

                                }

                            }
                        } else {
                            self.categorizedTransactionList().push({
                                valueDateObject: new Date(element.valueDate),
                                categoryName: element.categoryName || self.resource.uncategorized,
                                subcategoryName: element.subcategoryName || "",
                                transactionDescription: element.transactionDescription || "",
                                accountId: element.accountId,
                                transactionAmount: element.transactionAmount,
                                amount: element.transactionAmount.amount,
                                isSplittedTxn: isSplittedTxn,
                                subSequenceId: element.subSequenceId,
                                transactionId: element.transactionReferenceId,
                                splitId: undefined
                            });

                        }
                    }

                }

                sortAscending = false;
                self.categorizedTransactionList().sort(sortTxnByDate);
                sortAscending = true;
                self.transactionsDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.categorizedTransactionList(), { idAttribute: "categoryName" }) || []));

                /*, {
                        idAttribute: [
                            'categoryName',
                            'transactionDescription'
                        ]
                    }*/

                self.transactionsLoaded(true);

            });

        };

        self.today = null;
        TransactionList.getHostDate().done(function(data) {
            self.today = new Date(data.currentDate.valueDate);
            setDurationFilter(30);
        });

        self.goBack = function() {
            history.back();
        };
    };
    vm.prototype.dispose = function() {
        if (this.filter)
            this.filter.dispose();
    };
    return vm;
});