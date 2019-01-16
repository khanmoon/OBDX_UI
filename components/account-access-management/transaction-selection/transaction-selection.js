define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "framework/js/constants/constants",
    "ojL10n!resources/nls/access-management",
    "ojs/ojinputtext",
    "ojs/ojpopup",
    "ojs/ojradioset",
    "ojs/ojselectcombobox",
    "ojs/ojcheckboxset"
], function (oj, ko, $, TransactionSelectionModel, BaseLogger, constants, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        var getNewKoModel = function () {
            var KoModel = TransactionSelectionModel.getNewModel();
            return KoModel;
        };
        self.key = rootParams.key;
        self.groupingTaskArray = ko.observableArray();
        self.groupJsonData = ko.observable();
        self.rootModelInstance = getNewKoModel();
        self.resourceTaskKeys = ko.observableArray();
        self.nonresourceTaskKeys = ko.observableArray();
        self.copyResourceTaskKeys = ko.observable(rootParams.resoureTaskList()[0]);
        self.isAllTransactionSelected = ko.observable(false);
        self.selectedTransactions = ko.observableArray();
        ko.utils.arrayForEach(self.selectedAccountsResources(), function (item) {
            if (item.accountNumber.value === rootParams.data.accountNumber.value && item.selectedTask.length > 0) {
                self.selectedTransactions(item.selectedTask);
            }
        });
        self.mappedTransactionObject = self.rootModelInstance.transactionMapping;
        self.dataLoaded = ko.observable(false);
        self.mappedTransactionObject.accountNumber = rootParams.data.accountNumber;
        self.mappedTransactionObject.accountType = rootParams.data.accountType;
        self.mappedTransactionObject.nonSelectedTask = rootParams.data.nonSelectedTask;
        self.mappedTransactionObject.selectedTask = rootParams.data.selectedTask;
        self.displayManipulatedCopyResourceKey = ko.observable(false);
        self.resourceTaskKeys(rootParams.data.resoureTaskList);
        self.filterArray = ko.observable();
        self.resourceTaskKeysLength = ko.observable(0);
        ko.utils.arrayForEach(self.resourceTaskKeys(), function (item) {
            self.resourceTaskKeysLength(self.resourceTaskKeysLength() + item.childTasks.length);
        });

        self.rowId = ko.observable(rootParams.data.id);
        if (rootParams.showReviewComponent && rootParams.showReviewComponent()) {
            self.selectedTransactions(rootParams.data.selectedTask);
        }
        self.nonSelectedTransaction = ko.observableArray();
        self.previuosSelectedTasks = ko.observableArray();
        for (var i = 0; i < rootParams.tempTaskArray().length; i++) {
            if (rootParams.tempTaskArray()[i].accountNumber === self.mappedTransactionObject.accountNumber.value) {
                for (var y = 0; y < rootParams.tempTaskArray()[i].taskIds.length; y++) {
                    self.previuosSelectedTasks.push(rootParams.tempTaskArray()[i].taskIds[y]);
                }
                break;
            }
        }
        self.mapAllTransactionsToAllAccounts = ko.observable(rootParams.mapAllTransactionsToAllAccounts());
        if (self.showReviewScreen()) {
            self.mapAllTransactionsToAllAccounts(false);
        }
        if (self.resourceTaskKeys().length > 0) {
            self.dataLoaded(true);
        }
        if (self.mapAllTransactionsToAllAccounts()) {
            if (self.previuosSelectedTasks().length === 0) {
                self.selectedTransactions.removeAll();
                ko.utils.arrayForEach(self.resourceTaskKeys(), function (item) {
                    for (var i = 0; i < item.childTasks.length; i++) {
                        self.selectedTransactions.push(item.childTasks[i].id);
                    }
                });
            } else if (self.previuosSelectedTasks().length > 0) {
                self.selectedTransactions.removeAll();
                ko.utils.arrayForEach(self.previuosSelectedTasks(), function (item) {
                    self.selectedTransactions.push(item);
                });
            }
        }
        var mapAllTransactionsToAllAccountsSubscription = rootParams.mapAllTransactionsToAllAccounts.subscribe(function (newValue) {
            self.mapAllTransactionsToAllAccounts(newValue);
            if (self.mapAllTransactionsToAllAccounts()) {
                self.selectedTransactions.removeAll();
                ko.utils.arrayForEach(self.resourceTaskKeys(), function (item) {
                    for (var i = 0; i < item.childTasks.length; i++) {
                        self.selectedTransactions.push(item.childTasks[i].id);
                    }
                });
            } else {
                self.selectedTransactions.removeAll();
            }
        });
        self.areAllOptionsSelected = ko.computed(function () {
            if (self.selectedTransactions().length === self.resourceTaskKeysLength()) {
                if (rootParams.indicatorArray.indexOf(self.mappedTransactionObject.accountNumber.value) < 0) {
                    rootParams.indicatorArray.push(self.mappedTransactionObject.accountNumber.value);
                }
                return true;
            }
                return false;

        }, self);
        self.areAllOptionsOfModuleSelected = function (data) {
            var FOUND_FLAG = 0;
            ko.utils.arrayForEach(data.childTasks, function (item) {
                if (self.selectedTransactions().indexOf(item.id) < 0) {
                    FOUND_FLAG = 1;
                }
            });
            if (FOUND_FLAG === 0) {
                return true;
            }
                return false;

        };
        ko.observable.fn.beforeAndAfterSubscribe = function (callback, target) {
            var _oldValue;
            this.subscribe(function (oldValue) {
                _oldValue = oldValue;
            }, null, "beforeChange");
            this.subscribe(function (newValue) {
                callback.call(target, _oldValue, newValue);
            });
        };
        self.selectedTransactions.subscribe(function (newTransactionsArray) {
            var updatedNewTransactionArray, filterdUniqueArray;
            if (newTransactionsArray) {
                updatedNewTransactionArray = self.manipulateNewTransactionSelectedArray(newTransactionsArray);
                filterdUniqueArray = self.filterSelectedEquivalentArrray(updatedNewTransactionArray);
                self.mappedTransactionObject.selectedTask = filterdUniqueArray;
                ko.utils.arrayForEach(self.resourceTaskKeys(), function (item) {
                    for (var i = 0; i < item.childTasks.length; i++) {
                        if (filterdUniqueArray.indexOf(item.childTasks[i].id) === -1) {
                            self.nonSelectedTransaction().push(item.childTasks[i].id);
                        }
                    }
                });
                self.mappedTransactionObject.nonSelectedTask = self.nonSelectedTransaction();
                for (var j = 0; j < self.selectedAccountsResources().length; j++) {
                    if (self.selectedAccountsResources()[j].accountNumber.value === self.mappedTransactionObject.accountNumber.value) {
                        self.selectedAccountsResources()[j].selectedTask = filterdUniqueArray;
                        self.selectedAccountsResources()[j].nonSelectedTask = self.nonSelectedTransaction();
                    }
                }
            }
            if (newTransactionsArray.length === self.resourceTaskKeysLength()) {
                if (rootParams.indicatorArray.indexOf(self.mappedTransactionObject.accountNumber.value) < 0) {
                    rootParams.indicatorArray.push(self.mappedTransactionObject.accountNumber.value);
                }
            } else if (rootParams.indicatorArray.indexOf(self.mappedTransactionObject.accountNumber.value) > -1) {
                    rootParams.indicatorArray.remove(self.mappedTransactionObject.accountNumber.value);
                }
            for (var k = 0; k < rootParams.tempTaskArray().length; k++) {
                if (rootParams.tempTaskArray()[k].accountNumber === self.mappedTransactionObject.accountNumber.value) {
                    rootParams.tempTaskArray()[k].taskIds = [];
                    for (var y = 0; y < newTransactionsArray.length; y++) {
                        rootParams.tempTaskArray()[k].taskIds[y] = newTransactionsArray[y];
                    }
                    break;
                }
            }
        });
        self.selectedTransactions.valueHasMutated();
        self.manipulateNewTransactionSelectedArray = function (array) {
            var equivalentTaskIdsPortion = [], tmpArray = [], counter = 0;
            for (var q = 0; q < array.length; q++) {
                if (self.groupingTaskArray().indexOf(array[q]) > -1) {
                    equivalentTaskIdsPortion = self.fetchEquivalentTaskIds(array[q]);
                    if (equivalentTaskIdsPortion && equivalentTaskIdsPortion.length > 0) {
                        for (var w = 0; w < equivalentTaskIdsPortion.length; w++) {
                            tmpArray[counter] = equivalentTaskIdsPortion[w];
                            counter++;
                        }
                    }
                } else {
                    tmpArray[counter] = array[q];
                    counter++;
                }
            }
            return tmpArray;
        };
        self.filterSelectedEquivalentArrray = function (tmpArray) {
            var uniqueFilterdTaskIdArray;
            uniqueFilterdTaskIdArray = tmpArray.filter(function (item, pos) {
                return tmpArray.indexOf(item) === pos;
            });
            return uniqueFilterdTaskIdArray;
        };
        self.fetchEquivalentTaskIds = function (id) {
            for (var x = 0; x < self.groupJsonData().transactionGroups.length; x++) {
                for (var i = 0; i < self.groupJsonData().transactionGroups[x].childs.length; i++) {
                    if (self.groupJsonData().transactionGroups[x].childs[i].taskGrpId === id) {
                        return self.groupJsonData().transactionGroups[x].childs[i].taskIds;
                    }
                }
            }
        };
        var isParentChecked;
        $.extend($.expr[":"], {
            unchecked: function (obj) {
                return (obj.type === "checkbox" || obj.type === "radio") && !$(obj).is(":checked");
            }
        });
        $(document).on("change", "div input:checkbox", function () {
            var currentContext = this;
            var a = $(this).next("label").next("ul").find("input:checkbox");
            if ($(this).prop("checked") === true) {
                $(this).addClass("oj-selected");
                isParentChecked = true;
            } else {
                $(this).removeClass("oj-selected");
                isParentChecked = false;
            }
            $(a).each(function () {
                if (isParentChecked === true) {
                    if ($(this).prop("checked") === false) {
                        $(this).trigger("click");
                    }
                } else if ($(this).prop("checked") === true) {
                        $(this).trigger("click");
                    }
            });
            for (var i = $("div").first("ul").length; i >= 0; i--) {
                $("div").find("ul:eq(" + i + ")").prev("label").prev("input:checkbox").prop("checked", function () {
                    if ($(this).next("label").next("ul").find("input:unchecked").length === 0) {
                        $(this).addClass("oj-selected");
                    } else {
                        $(this).removeClass("oj-selected");
                    }
                    return $(this).next("label").next("ul").find("input:unchecked").length === 0;
                });
            }
            $(currentContext).parent().parent().prev("label").prev("input:checkbox").prop("checked", function () {
                if ($(this).next("label").next("ul").find("input:unchecked").length === 0) {
                    $(this).addClass("oj-selected");
                } else {
                    $(this).removeClass("oj-selected");
                }
                return $(this).next("label").next("ul").find("input:unchecked").length === 0;
            });
            $(currentContext).parent().parent().parent().parent().prev("label").prev("input:checkbox").prop("checked", function () {
                if ($(this).next("label").next("ul").find("input:unchecked").length === 0) {
                    $(this).addClass("oj-selected");
                } else {
                    $(this).removeClass("oj-selected");
                }
                return $(this).next("label").next("ul").find("input:unchecked").length === 0;
            });
        });
        self.dispose = function () {
            self.areAllOptionsSelected.dispose();
            mapAllTransactionsToAllAccountsSubscription.dispose();
        };
    };
});
