define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "./model",
    "framework/js/constants/constants",
    "ojL10n!resources/nls/access-management",
    "ojs/ojinputtext",
    "ojs/ojtable",
    "ojs/ojpopup",
    "ojs/ojradioset",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation",
    "ojs/ojswitch",
    "ojs/ojtabs",
    "ojs/ojbutton",
    "ojs/ojcheckboxset",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojrowexpander",
    "ojs/ojflattenedtreedatagriddatasource",
    "ojs/ojjsontreedatasource"
], function (oj, ko, $, BaseLogger, MappingModule, constants, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this, uniqueCasaSelectedArray, uniqueTdSelectedArray, uniqueLoanSelectedArray;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        $("#tabGroups").css("display", "block");
        $("#optionset").css("display", "block");
        self.highlightedTab = rootParams.rootModel.selectedModule;
        self.isAllCasaSelected = ko.observable();
        self.loadCasaTemplate = ko.observable(true);
        self.isAllTdSelected = ko.observable();
        self.loadTdTemplate = ko.observable(true);
        self.isAllLoansSelected = ko.observable();
        self.loadLoansTemplate = ko.observable(true);
        self.mapAllCasaAccounts = ko.observableArray([]);
        self.mapAllTdAccounts = ko.observableArray([]);
        self.mapAllLoanAccounts = ko.observableArray([]);
        self.fullCasaAccountListCopy = ko.observable([]);
        self.fullCasaAccountListNotActive = ko.observable([]);
        self.fulltdAccountListCopy = ko.observable([]);
        self.fulltdAccountListNotActive = ko.observable([]);
        self.fullloanAccountListCopy = ko.observable([]);
        self.fullloanAccountListNotActive = ko.observable([]);
        self.showDisclaimer = ko.observable(true);
        self.closeDisclaimer = ko.observable(false);
        rootParams.baseModel.registerElement("confirm-screen");
        if (self.accessLevel() === "PARTY" || self.accessLevel() === "LINKAGE") {
            rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, { user: self.nls.navLabels.PartyLevel_title }));
        } else if (self.accessLevel() === "USER" || self.accessLevel() === "USERLINKAGE") {
            rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, { user: self.nls.navLabels.UserLevel_title }));
        }
        self.tabLists = ko.observableArray([
            {
                id: "CASA",
                text: self.nls.navLabels.CASA,
                template: "casa-account-access"
            },
            {
                id: "TRD",
                text: self.nls.navLabels.TD,
                template: "td-account-access"
            },
            {
                id: "LON",
                text: self.nls.navLabels.Loans,
                template: "loan-account-access"
            }
        ]);
        if (self.highlightedTab() === "CASA" || self.highlightedTab() === undefined) {
            self.casaAccountTabVisited(true);
        } else if (self.highlightedTab() === "TRD") {
            self.tdAccountTabVisited(true);
        } else if (self.highlightedTab() === "LON") {
            self.loanAccountTabVisited(true);
        }
        uniqueCasaSelectedArray = self.selectedCasaAccounts().filter(function (item, pos) {
            return self.selectedCasaAccounts().indexOf(item) === pos;
        });
        self.selectedCasaAccounts.removeAll();
        ko.utils.arrayPushAll(self.selectedCasaAccounts(), uniqueCasaSelectedArray);
        uniqueTdSelectedArray = self.selectedTdAccounts().filter(function (item, pos) {
            return self.selectedTdAccounts().indexOf(item) === pos;
        });
        self.selectedTdAccounts.removeAll();
        ko.utils.arrayPushAll(self.selectedTdAccounts(), uniqueTdSelectedArray);
        uniqueLoanSelectedArray = self.selectedLoanAccounts().filter(function (item, pos) {
            return self.selectedLoanAccounts().indexOf(item) === pos;
        });
        self.selectedLoanAccounts.removeAll();
        ko.utils.arrayPushAll(self.selectedLoanAccounts(), uniqueLoanSelectedArray);
        self.selectedAccountTabChangeHandler = function (event) {
                if (event.detail.value === 0) {
                    self.casaAccountTabVisited(true);
                    self.highlightedTab("CASA");
                    self.closeDisclaimer(false);
                }
                if (event.detail.value === 1) {
                    self.tdAccountTabVisited(true);
                    self.highlightedTab("TRD");
                    self.closeDisclaimer(false);
                }
                if (event.detail.value === 2) {
                    self.loanAccountTabVisited(true);
                    self.highlightedTab("LON");
                    self.closeDisclaimer(false);
                }
        };
        self.cancel = function () {
            rootParams.dashboard.openDashBoard(self.nls.common.cancelConfirm);
        };
        $(window).scroll(function () {
            if ($(document).scrollTop() >= $(document).height() / 10)
                $("#disclaimer-container").fadeIn("slow");
            else
                $("#disclaimer-container").fadeOut("slow");
        });
        self.closeSPopup = function () {
            self.closeDisclaimer(true);
            $("#disclaimer-container").fadeOut("slow");
        };
        self.fullCasaAccountList().sort(function (left, right) {
            return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
        });
        self.fulltdAccountList().sort(function (left, right) {
            return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
        });
        self.fullloanAccountList().sort(function (left, right) {
            return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
        });
        if (!self.isAccessCreated()) {
            ko.utils.arrayForEach(self.fullCasaAccountList(), function (item) {
                if (item.accountStatus === "ACTIVE")
                    self.fullCasaAccountListCopy().push(item);
                else {
                    self.fullCasaAccountListNotActive().push(item);
                }
            });
            self.fullCasaAccountListCopy().sort(function (left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });
            self.fullCasaAccountListNotActive().sort(function (left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });
            self.fullCasaAccountList([]);
            ko.utils.arrayForEach(self.fullCasaAccountListCopy(), function (item) {
                self.fullCasaAccountList().push(item);
            });
            ko.utils.arrayForEach(self.fullCasaAccountListNotActive(), function (item) {
                self.fullCasaAccountList().push(item);
            });
            ko.utils.arrayForEach(self.fulltdAccountList(), function (item) {
                if (item.accountStatus === "ACTIVE")
                    self.fulltdAccountListCopy().push(item);
                else {
                    self.fulltdAccountListNotActive().push(item);
                }
            });
            self.fulltdAccountListCopy().sort(function (left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });
            self.fulltdAccountListNotActive().sort(function (left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });
            self.fulltdAccountList([]);
            ko.utils.arrayForEach(self.fulltdAccountListCopy(), function (item) {
                self.fulltdAccountList().push(item);
            });
            ko.utils.arrayForEach(self.fulltdAccountListNotActive(), function (item) {
                self.fulltdAccountList().push(item);
            });
            ko.utils.arrayForEach(self.fullloanAccountList(), function (item) {
                if (item.accountStatus === "ACTIVE")
                    self.fullloanAccountListCopy().push(item);
                else {
                    self.fullloanAccountListNotActive().push(item);
                }
            });
            self.fullloanAccountListCopy().sort(function (left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });
            self.fullloanAccountListNotActive().sort(function (left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });
            self.fullloanAccountList([]);
            ko.utils.arrayForEach(self.fullloanAccountListCopy(), function (item) {
                self.fullloanAccountList().push(item);
            });
            ko.utils.arrayForEach(self.fullloanAccountListNotActive(), function (item) {
                self.fullloanAccountList().push(item);
            });
        }
        if (self.isAccessCreated()) {
            if (self.selectedCasaAccounts().length !== 0) {
                self.selectedCasaAccounts().sort(function (left, right) {
                    return left.value === right.value ? 0 : left.value < right.value ? -1 : 1;
                });
                self.fullCasaAccountList().sort(function (left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });
                var i;
                for (i = 0; i < self.selectedCasaAccounts().length; i++) {
                    ko.utils.arrayForEach(self.fullCasaAccountList(), function (item) {
                        if (item.accountNumber.value === self.selectedCasaAccounts()[i]) {
                            if (!(self.fullCasaAccountListCopy().filter(function (e) {
                                    return e.accountNumber.value === self.selectedCasaAccounts()[i];
                                }).length > 0)) {
                                if (item.accountStatus === "ACTIVE")
                                    self.fullCasaAccountListCopy().push(item);
                            }
                        }
                    });
                }
                self.fullCasaAccountListCopy().sort(function (left, right) {
                    return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
                });
                self.fullCasaAccountListCopy().sort(function (left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });
                for (i = 0; i < self.selectedCasaAccounts().length; i++) {
                    ko.utils.arrayForEach(self.fullCasaAccountList(), function (item) {
                        if (item.accountNumber.value === self.selectedCasaAccounts()[i]) {
                            if (!(self.fullCasaAccountListCopy().filter(function (e) {
                                    return e.accountNumber.value === self.selectedCasaAccounts()[i];
                                }).length > 0)) {
                                if (item.accountStatus !== "ACTIVE")
                                    self.fullCasaAccountListCopy().push(item);
                            }
                        }
                    });
                }
                var flagCASA, flagCASACopy;
                ko.utils.arrayForEach(self.fullCasaAccountList(), function (item) {
                    if (self.selectedCasaAccounts().indexOf(item.accountNumber.value) === -1) {
                        for (i = 0; i < self.fullCasaAccountListCopy().length; i++) {
                            flagCASA = false;
                            if (item.accountNumber.value === self.fullCasaAccountListCopy()[i].accountNumber.value) {
                                flagCASA = true;
                                break;
                            }
                        }
                        if (flagCASA === false)
                            if (item.accountStatus === "ACTIVE")
                                self.fullCasaAccountListCopy().push(item);
                    }
                });
                ko.utils.arrayForEach(self.fullCasaAccountList(), function (item) {
                    if (self.selectedCasaAccounts().indexOf(item.accountNumber.value) === -1) {
                        for (var i = 0; i < self.fullCasaAccountListCopy().length; i++) {
                            flagCASACopy = false;
                            if (item.accountNumber.value === self.fullCasaAccountListCopy()[i].accountNumber.value) {
                                flagCASACopy = true;
                                break;
                            }
                        }
                        if (flagCASACopy === false)
                            if (item.accountStatus !== "ACTIVE")
                                self.fullCasaAccountListCopy().push(item);
                    }
                });
                self.fullCasaAccountList([]);
                ko.utils.arrayForEach(self.fullCasaAccountListCopy(), function (item) {
                    self.fullCasaAccountList().push(item);
                });
            }
        }
        if (self.isAccessCreated()) {
            if (self.selectedTdAccounts().length !== 0) {
                self.selectedTdAccounts().sort(function (left, right) {
                    return left.value === right.value ? 0 : left.value < right.value ? -1 : 1;
                });
                self.fulltdAccountList().sort(function (left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });
                var j;
                for (j = 0; j < self.selectedTdAccounts().length; j++) {
                    ko.utils.arrayForEach(self.fulltdAccountList(), function (item) {
                        if (item.accountNumber.value === self.selectedTdAccounts()[j]) {
                            if (!(self.fulltdAccountListCopy().filter(function (e) {
                                    return e.accountNumber.value === self.selectedTdAccounts()[j];
                                }).length > 0)) {
                                if (item.accountStatus === "ACTIVE")
                                    self.fulltdAccountListCopy().push(item);
                            }
                        }
                    });
                }
                self.fulltdAccountListCopy().sort(function (left, right) {
                    return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
                });
                self.fulltdAccountListCopy().sort(function (left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });
                for (j = 0; j < self.selectedTdAccounts().length; j++) {
                    ko.utils.arrayForEach(self.fulltdAccountList(), function (item) {
                        if (item.accountNumber.value === self.selectedTdAccounts()[j]) {
                            if (!(self.fulltdAccountListCopy().filter(function (e) {
                                    return e.accountNumber.value === self.selectedTdAccounts()[j];
                                }).length > 0)) {
                                if (item.accountStatus !== "ACTIVE")
                                    self.fulltdAccountListCopy().push(item);
                            }
                        }
                    });
                }
                var flagTD, flagTDCopy;
                ko.utils.arrayForEach(self.fulltdAccountList(), function (item) {
                    if (self.selectedTdAccounts().indexOf(item.accountNumber.value) === -1) {
                        for (j = 0; j < self.fulltdAccountListCopy().length; j++) {
                            flagTD = false;
                            if (item.accountNumber.value === self.fulltdAccountListCopy()[j].accountNumber.value) {
                                flagTD = true;
                                break;
                            }
                        }
                        if (flagTD === false)
                            if (item.accountStatus === "ACTIVE")
                                self.fulltdAccountListCopy().push(item);
                    }
                });
                ko.utils.arrayForEach(self.fulltdAccountList(), function (item) {
                    if (self.selectedTdAccounts().indexOf(item.accountNumber.value) === -1) {
                        for (j = 0; j < self.fulltdAccountListCopy().length; j++) {
                            flagTDCopy = false;
                            if (item.accountNumber.value === self.fulltdAccountListCopy()[j].accountNumber.value) {
                                flagTDCopy = true;
                                break;
                            }
                        }
                        if (flagTDCopy === false)
                            if (item.accountStatus !== "ACTIVE")
                                self.fulltdAccountListCopy().push(item);
                    }
                });
                self.fulltdAccountList([]);
                ko.utils.arrayForEach(self.fulltdAccountListCopy(), function (item) {
                    self.fulltdAccountList().push(item);
                });
            }
        }
        if (self.isAccessCreated()) {
            if (self.selectedLoanAccounts().length !== 0) {
                self.selectedLoanAccounts().sort(function (left, right) {
                    return left.value === right.value ? 0 : left.value < right.value ? -1 : 1;
                });
                self.fullloanAccountList().sort(function (left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });
                var k;
                for (k = 0; k < self.selectedLoanAccounts().length; k++) {
                    ko.utils.arrayForEach(self.fullloanAccountList(), function (item) {
                        if (item.accountNumber.value === self.selectedLoanAccounts()[k]) {
                            if (!(self.fullloanAccountListCopy().filter(function (e) {
                                    return e.accountNumber.value === self.selectedLoanAccounts()[k];
                                }).length > 0)) {
                                if (item.accountStatus === "ACTIVE")
                                    self.fullloanAccountListCopy().push(item);
                            }
                        }
                    });
                }
                self.fullloanAccountListCopy().sort(function (left, right) {
                    return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
                });
                self.fullloanAccountListCopy().sort(function (left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });
                for (k = 0; k < self.selectedLoanAccounts().length; k++) {
                    ko.utils.arrayForEach(self.fullloanAccountList(), function (item) {
                        if (item.accountNumber.value === self.selectedLoanAccounts()[k]) {
                            if (!(self.fullloanAccountListCopy().filter(function (e) {
                                    return e.accountNumber.value === self.selectedLoanAccounts()[k];
                                }).length > 0)) {
                                if (item.accountStatus !== "ACTIVE")
                                    self.fullloanAccountListCopy().push(item);
                            }
                        }
                    });
                }
                var flagLoan, flagLoanCopy;
                ko.utils.arrayForEach(self.fullloanAccountList(), function (item) {
                    if (self.selectedLoanAccounts().indexOf(item.accountNumber.value) === -1) {
                        for (k = 0; k < self.fullloanAccountListCopy().length; k++) {
                            flagLoan = false;
                            if (item.accountNumber.value === self.fullloanAccountListCopy()[k].accountNumber.value) {
                                flagLoan = true;
                                break;
                            }
                        }
                        if (flagLoan === false)
                            if (item.accountStatus === "ACTIVE")
                                self.fullloanAccountListCopy().push(item);
                    }
                });
                ko.utils.arrayForEach(self.fullloanAccountList(), function (item) {
                    if (self.selectedLoanAccounts().indexOf(item.accountNumber.value) === -1) {
                        for (k = 0; k < self.fullloanAccountListCopy().length; k++) {
                            flagLoanCopy = false;
                            if (item.accountNumber.value === self.fullloanAccountListCopy()[k].accountNumber.value) {
                                flagLoan = true;
                                break;
                            }
                        }
                        if (flagLoanCopy === false)
                            if (item.accountStatus !== "ACTIVE")
                                self.fullloanAccountListCopy().push(item);
                    }
                });
                self.fullloanAccountList([]);
                ko.utils.arrayForEach(self.fullloanAccountListCopy(), function (item) {
                    self.fullloanAccountList().push(item);
                });
            }
        }
        function filterArray(array, item, i) {
            var counter = 0;
            for (var x = 0; x < array.length; x++) {
                if (item.accountNumber.value === array[x].accountNumber.value) {
                    if (counter !== i) {
                        return false;
                    }
                        return true;

                }
                counter++;
            }
        }
        if (self.fullCasaAccountList()) {
            var uniqueFullCasaList = $.grep(self.fullCasaAccountList(), function (item, i) {
                return filterArray(self.fullCasaAccountList(), item, i);
            });
            self.fullCasaAccountList([]);
            ko.utils.arrayForEach(uniqueFullCasaList, function (item) {
                self.fullCasaAccountList().push(item);
            });
        }
        if (self.fullloanAccountList()) {
            var uniquefullloanAccountList = $.grep(self.fullloanAccountList(), function (item, i) {
                return filterArray(self.fullloanAccountList(), item, i);
            });
            self.fullloanAccountList([]);
            ko.utils.arrayForEach(uniquefullloanAccountList, function (item) {
                self.fullloanAccountList().push(item);
            });
        }
        if (self.fulltdAccountList()) {
            var uniquefulltdAccountList = $.grep(self.fulltdAccountList(), function (item, i) {
                return filterArray(self.fulltdAccountList(), item, i);
            });
            self.fulltdAccountList([]);
            ko.utils.arrayForEach(uniquefulltdAccountList, function (item) {
                self.fulltdAccountList().push(item);
            });
        }
        var parsedDataForCasa = $.map(ko.utils.unwrapObservable(self.fullCasaAccountList()), function (val) {
            val.ID = val.accountNumber.displayValue;

            val.mappingPolicy = val.isAllowed;
            val.currency = val.currencyCode ? val.currencyCode : "-";
            val.displayName = val.displayName ? val.displayName : "-";
            val.accountStatus = val.accountStatus ? val.accountStatus : "-";
            return val;
        });
        self.casaAccountdataSource = new oj.ArrayTableDataSource(parsedDataForCasa, { idAttribute: "ID" });
        var parsedDataForTd = $.map(ko.utils.unwrapObservable(self.fulltdAccountList()), function (val) {
            val.ID = val.accountNumber.displayValue;

            val.mappingPolicy = val.isAllowed;
            val.currency = val.currencyCode ? val.currencyCode : "-";
            val.displayName = val.displayName ? val.displayName : "-";
            val.accountStatus = val.accountStatus ? val.accountStatus : "-";
            return val;
        });
        self.tdAccountdataSource = new oj.ArrayTableDataSource(parsedDataForTd, { idAttribute: "ID" });
        var parsedDataForLoan = $.map(ko.utils.unwrapObservable(self.fullloanAccountList()), function (val) {
            val.ID = val.accountNumber.displayValue;

            val.mappingPolicy = val.isAllowed;
            val.currency = val.currencyCode ? val.currencyCode : "-";
            val.displayName = val.displayName ? val.displayName : "-";
            val.accountStatus = val.accountStatus ? val.accountStatus : "-";
            return val;
        });
        self.loanAccountdataSource = new oj.ArrayTableDataSource(parsedDataForLoan, { idAttribute: "ID" });
        self.activateTab = function () {
            $("#tabs-container #tabGroups").ojTabs({ "selected": self.highlightedTab() });
        };
        ko.utils.arrayForEach(self.fullCasaAccountList(), function (item) {
            self.casaTransactionMappedObject = {
                accountNumber: {
                    displayValue: "",
                    value: ""
                },
                accountStatus: "",
                displayName: "",
                currencyCode: "",
                selectedTask: [],
                accountType: "",
                nonSelectedTask: [],
                resourceListCasa: []
            };
            self.casaTransactionMappedObject.accountNumber.displayValue = item.accountNumber.displayValue;
            self.casaTransactionMappedObject.accountStatus = item.accountStatus;
            self.casaTransactionMappedObject.accountNumber.value = item.accountNumber.value;
            self.casaTransactionMappedObject.accountType = item.accountType;
            self.casaTransactionMappedObject.nonSelectedTask = item.nonSelectedTask;
            self.casaTransactionMappedObject.selectedTask = item.selectedTask;
            self.casaTransactionMappedObject.currencyCode = item.currencyCode;
            self.casaTransactionMappedObject.displayName = item.displayName;
            self.casaTransactionMappedObject.resourceListCasa = item.resourceListCasa;
            if (!(self.selectedAccountsResources().filter(function (e) {
                    return e.accountNumber.value === item.accountNumber.value;
                }).length > 0)) {
                self.selectedAccountsResources().push(self.casaTransactionMappedObject);
            }
        });
        ko.utils.arrayForEach(self.fulltdAccountList(), function (item) {
            self.tdTransactionMappedObject = {
                accountNumber: {
                    displayValue: "",
                    value: ""
                },
                accountStatus: "",
                displayName: "",
                currencyCode: "",
                selectedTask: [],
                accountType: "",
                nonSelectedTask: [],
                resourceListTD: []
            };
            self.tdTransactionMappedObject.accountNumber.displayValue = item.accountNumber.displayValue;
            self.tdTransactionMappedObject.accountStatus = item.accountStatus;
            self.tdTransactionMappedObject.displayName = item.displayName;
            self.tdTransactionMappedObject.accountNumber.value = item.accountNumber.value;
            self.tdTransactionMappedObject.accountType = item.accountType;
            self.tdTransactionMappedObject.nonSelectedTask = item.nonSelectedTask;
            self.tdTransactionMappedObject.selectedTask = item.selectedTask;
            self.tdTransactionMappedObject.currencyCode = item.currencyCode;
            self.tdTransactionMappedObject.resourceListTD = item.resourceListTD;
            if (!(self.selectedAccountsResources().filter(function (e) {
                    return e.accountNumber.value === item.accountNumber.value;
                }).length > 0)) {
                self.selectedAccountsResources().push(self.tdTransactionMappedObject);
            }
        });
        ko.utils.arrayForEach(self.fullloanAccountList(), function (item) {
            self.loanTransactionMappedObject = {
                accountNumber: {
                    displayValue: "",
                    value: ""
                },
                accountStatus: "",
                displayName: "",
                currencyCode: "",
                selectedTask: [],
                accountType: "",
                nonSelectedTask: [],
                resourceListLON: []
            };
            self.loanTransactionMappedObject.accountNumber.displayValue = item.accountNumber.displayValue;
            self.loanTransactionMappedObject.accountNumber.value = item.accountNumber.value;
            self.loanTransactionMappedObject.accountStatus = item.accountStatus;
            self.loanTransactionMappedObject.displayName = item.displayName;
            self.loanTransactionMappedObject.accountType = item.accountType;
            self.loanTransactionMappedObject.nonSelectedTask = item.nonSelectedTask;
            self.loanTransactionMappedObject.selectedTask = item.selectedTask;
            self.loanTransactionMappedObject.currencyCode = item.currencyCode;
            self.loanTransactionMappedObject.resourceListLON = item.resourceListLON;
            if (!(self.selectedAccountsResources().filter(function (e) {
                    return e.accountNumber.value === item.accountNumber.value;
                }).length > 0)) {
                self.selectedAccountsResources().push(self.loanTransactionMappedObject);
            }
        });
        var isCasaAllowedSubscription = self.isCasaAllowed.subscribe(function (newValue) {
            if (newValue === true) {
                self.selectedCasaPolicy("casaAuto");
                self.selectedCasaPolicyChecked(["casaAuto"]);
            } else {
                self.selectedCasaPolicy("casaManual");
                self.selectedCasaPolicyChecked(["casaManual"]);
            }
        });
        self.isTDAllowed.subscribe(function (newValue) {
            if (newValue === true) {
                self.selectedTdPolicy("tdAuto");
                self.selectedTdPolicyChecked(["tdAuto"]);
            } else {
                self.selectedTdPolicy("tdManual");
                self.selectedTdPolicyChecked(["tdManual"]);
            }
        });
        self.isLoanAllowed.subscribe(function (newValue) {
            if (newValue === true) {
                self.selectedLoanPolicy("loanAuto");
                self.selectedLoanPolicyChecked(["loanAuto"]);
            } else {
                self.selectedLoanPolicy("loanManual");
                self.selectedLoanPolicyChecked(["loanManual"]);
            }
        });
        self.cancelAccess = function () {
            rootParams.dashboard.loadComponent("validation", {}, self);
        };
        self.casaDefaultPolicyChangeHandler = function (event) {
                if (event.detail.value[0] === "casaAuto") {
                    self.isCasaAllowed(true);
                } else {
                    self.isCasaAllowed(false);
                }
                self.casaAllowedButtonsPressed(true);

        };
        self.tdDefaultPolicyChangeHandler = function (event) {
          if (event.detail.value[0] === "tdAuto") {
              self.isTDAllowed(true);
          } else {
              self.isTDAllowed(false);
          }
          self.tdAllowedButtonsPressed(true);
        };
        self.loanDefaultPolicyChangeHandler = function (event) {
          if (event.detail.value[0] === "loanAuto") {
              self.isLoanAllowed(true);
          } else {
              self.isLoanAllowed(false);
          }
          self.loanAllowedButtonsPressed(true);
        };
        self.toggleAllCheckbox = function () {
                if (!self.showEditableForm()) {
                    self.isAllCasaSelected(!self.isAllCasaSelected());
                    if (self.isAllCasaSelected()) {
                        self.selectedCasaAccounts.removeAll();
                        for (var i = 0; i < self.fullCasaAccountList().length; i++) {
                            self.selectedCasaAccounts.push(self.fullCasaAccountList()[i].accountNumber.value);
                        }
                        self.loadCasaTemplate(false);
                        self.loadCasaTemplate(true);
                        return false;
                    }
                        self.selectedCasaAccounts.removeAll();
                        self.loadCasaTemplate(false);
                        self.loadCasaTemplate(true);
                        return false;
                }
        };
        self.toggleAllCheckboxTd = function () {
                if (!self.showEditableForm()) {
                    self.isAllTdSelected(!self.isAllTdSelected());
                    if (self.isAllTdSelected()) {
                        self.selectedTdAccounts.removeAll();
                        for (var i = 0; i < self.fulltdAccountList().length; i++) {
                            self.selectedTdAccounts.push(self.fulltdAccountList()[i].accountNumber.value);
                        }
                        self.loadTdTemplate(false);
                        self.loadTdTemplate(true);
                        return false;
                    }
                        self.selectedTdAccounts.removeAll();
                        self.loadTdTemplate(false);
                        self.loadTdTemplate(true);
                        return false;
                }
        };
        self.toggleAllLoansCheckbox = function () {
                if (!self.showEditableForm()) {
                    self.isAllLoansSelected(!self.isAllLoansSelected());
                    if (self.isAllLoansSelected()) {
                        self.selectedLoanAccounts.removeAll();
                        for (var i = 0; i < self.fullloanAccountList().length; i++) {
                            self.selectedLoanAccounts.push(self.fullloanAccountList()[i].accountNumber.value);
                        }
                        self.loadLoansTemplate(false);
                        self.loadLoansTemplate(true);
                        return false;
                    }
                        self.selectedLoanAccounts.removeAll();
                        self.loadLoansTemplate(false);
                        self.loadLoansTemplate(true);
                        return false;
                }
        };
        self.selectedCasaAccounts.subscribe(function (newSelectedArray) {
            if (newSelectedArray && newSelectedArray.length > 0) {
                if (newSelectedArray.length === self.fullCasaAccountList().length) {
                    self.isAllCasaSelected(true);
                } else {
                    self.isAllCasaSelected(false);
                }
                if (self.isAccessCreated() && !self.editBackFromReview()) {
                    ko.utils.arrayForEach(self.selectedAccountsResources(), function (item) {
                        if (self.selectedCasaAccounts().indexOf(item.accountNumber.value) === -1) {
                            ko.utils.arrayForEach(self.fullCasaAccountList(), function (thisItem) {
                                if (thisItem.accountNumber.value === item.accountNumber.value && thisItem.accountType === item.accountType) {
                                    self.selectedAccountsResources.remove(item);
                                    self.newObject = {
                                        accountNumber: {
                                            displayValue: "",
                                            value: ""
                                        },
                                        accountStatus: "",
                                        displayName: "",
                                        currencyCode: "",
                                        selectedTask: [],
                                        accountType: "CSA",
                                        nonSelectedTask: [],
                                        resourceListCasa: []
                                    };
                                    self.newObject.currencyCode = item.currencyCode;
                                    self.newObject.accountNumber.displayValue = item.accountNumber.displayValue;
                                    self.newObject.accountNumber.value = item.accountNumber.value;
                                    self.newObject.accountStatus = item.accountStatus;
                                    self.newObject.displayName = item.displayName;
                                    self.newObject.nonSelectedTask = thisItem.fullResourceTaskList;
                                    self.newObject.resourceListCasa = item.resourceListCasa;
                                    self.selectedAccountsResources().push(self.newObject);
                                }
                            });
                        }
                    });
                }
            }
        });
        self.selectedTdAccounts.subscribe(function (newSelectedArray) {
            if (newSelectedArray && newSelectedArray.length > 0) {
                if (newSelectedArray.length === self.fulltdAccountList().length) {
                    self.isAllTdSelected(true);
                } else {
                    self.isAllTdSelected(false);
                }
                if (self.isAccessCreated() && !self.editBackFromReview()) {
                    ko.utils.arrayForEach(self.selectedAccountsResources(), function (item) {
                        if (self.selectedTdAccounts().indexOf(item.accountNumber.value) === -1) {
                            ko.utils.arrayForEach(self.fulltdAccountList(), function (thisItem) {
                                if (thisItem.accountNumber.value === item.accountNumber.value && thisItem.accountType === item.accountType) {
                                    self.selectedAccountsResources.remove(item);
                                    self.newObject = {
                                        accountNumber: {
                                            displayValue: "",
                                            value: ""
                                        },
                                        displayName: "",
                                        accountStatus: "",
                                        currencyCode: "",
                                        selectedTask: [],
                                        accountType: "TRD",
                                        nonSelectedTask: [],
                                        resourceListTD: []
                                    };
                                    self.newObject.accountNumber.displayValue = item.accountNumber.displayValue;
                                    self.newObject.accountNumber.value = item.accountNumber.value;
                                    self.newObject.accountStatus = item.accountStatus;
                                    self.newObject.displayName = item.displayName;
                                    self.newObject.currencyCode = item.currencyCode;
                                    self.newObject.nonSelectedTask = item.fullResourceTaskList;
                                    self.newObject.resourceListTD = item.resourceListTD;
                                    self.selectedAccountsResources().push(self.newObject);
                                }
                            });
                        }
                    });
                }
            }
        });
        self.selectedLoanAccounts.subscribe(function (newSelectedArray) {
            if (newSelectedArray && newSelectedArray.length > 0) {
                if (newSelectedArray.length === self.fullloanAccountList().length) {
                    self.isAllLoansSelected(true);
                } else {
                    self.isAllLoansSelected(false);
                }
                if (self.isAccessCreated() && !self.editBackFromReview()) {
                    ko.utils.arrayForEach(self.selectedAccountsResources(), function (item) {
                        if (self.selectedLoanAccounts().indexOf(item.accountNumber.value) === -1) {
                            ko.utils.arrayForEach(self.fullloanAccountList(), function (thisItem) {
                                if (thisItem.accountNumber.value === item.accountNumber.value && thisItem.accountType === item.accountType) {
                                    self.selectedAccountsResources.remove(item);
                                    self.newObject = {
                                        accountNumber: {
                                            displayValue: "",
                                            value: ""
                                        },
                                        accountStatus: "",
                                        displayName: "",
                                        currencyCode: "",
                                        selectedTask: [],
                                        accountType: "LON",
                                        nonSelectedTask: [],
                                        resourceListLON: []
                                    };
                                    self.newObject.accountNumber.value = item.accountNumber.value;
                                    self.newObject.accountNumber.displayValue = item.accountNumber.displayValue;
                                    self.newObject.accountStatus = item.accountStatus;
                                    self.newObject.currencyCode = item.currencyCode;
                                    self.newObject.nonSelectedTask = item.fullResourceTaskList;
                                    self.newObject.resourceListLON = item.resourceListLON;
                                    self.newObject.displayName = item.displayName;
                                    self.selectedAccountsResources().push(self.newObject);
                                }
                            });
                        }
                    });
                }
            }
        });
        self.isAllCasaSelected.subscribe(function (newValue) {
            if (newValue === true) {
                self.mapAllCasaAccounts(["ALL"]);
            } else {
                self.mapAllCasaAccounts.removeAll();
            }
        });
        self.isAllTdSelected.subscribe(function (newValue) {
            if (newValue === true) {
                self.mapAllTdAccounts(["ALL"]);
            } else {
                self.mapAllTdAccounts.removeAll();
            }
        });
        self.isAllLoansSelected.subscribe(function (newValue) {
            if (newValue === true) {
                self.mapAllLoanAccounts(["ALL"]);
            } else {
                self.mapAllLoanAccounts.removeAll();
            }
        });
        self.LoadTransactionMappingComponent = function () {
            self.disableAccountSelection(true);
            rootParams.dashboard.loadComponent("account-transactions-mapping", {}, self);
        };
        self.isDataModified = function () {
            if (self.selectedTdAccounts().length > 0 || self.selectedLoanAccounts().length > 0 || self.selectedCasaAccounts().length > 0) {
                $("#backConfirmationModal").trigger("openModal");
            } else
                self.backFirst();
        };
        self.backFirst = function () {
            self.fullCasaAccountList([]);
            self.fulltdAccountList([]);
            self.fullloanAccountList([]);
            self.selectedTdAccounts([]);
            self.selectedLoanAccounts([]);
            self.selectedCasaAccounts([]);
            rootParams.dashboard.hideDetails();
            self.editButtonPressed(false);
        };
        self.deleteClicked = function () {
            $("#deleteConfirmationModal").trigger("openModal");
        };
        self.backOnEdit = function () {
            $("#backConfirmationModal").trigger("openModal");
        };
        self.hideDelete = function(){
          $("#deleteConfirmationModal").hide();
        };

        self.hideBack = function(){
          $("#backConfirmationModal").hide();
        };

        $(document).on("change", "div input:checkbox", function () {
            if ($(this).prop("checked") === true) {
                $(this).addClass("oj-selected");
            } else {
                $(this).removeClass("oj-selected");
            }
        });
        self.dispose = function () {
            isCasaAllowedSubscription.dispose();
        };
    };
});
