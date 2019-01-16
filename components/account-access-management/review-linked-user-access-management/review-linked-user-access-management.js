define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/access-management",
    "ojs/ojswitch",
    "ojs/ojtabs",
    "ojs/ojbutton",
    "ojs/ojcheckboxset",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojrowexpander",
    "ojs/ojflattenedtreedatagriddatasource",
    "ojs/ojjsontreedatasource",
    "ojs/ojflattenedtreetabledatasource"
], function (oj, ko, $, reviewLinkedUserAccountAccessModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.rootParams = rootParams.rootModel.params.data;
        self.nls = resourceBundle;
        self.showReviewComponent = ko.observable(true);
        self.reviewCasaList = ko.observableArray([]);
        self.reviewTDList = ko.observableArray([]);
        self.reviewLoanList = ko.observableArray([]);
        self.accessLevel1 = ko.observable();
        self.isAccessCreated1 = ko.observable();
        self.showEditableForm1 = ko.observable();
        self.fullCasaAccountListSorted = ko.observable([]);
        self.fulltdAccountListSorted = ko.observable([]);
        self.fullloanAccountListSorted = ko.observable([]);
        self.reloadCasaTable = ko.observable(false);
        self.reloadTDTable = ko.observable(false);
        self.reloadLoanTable = ko.observable(false);
        self.loadSummaryTable = ko.observable(false);
        self.isPreferenceExist = ko.observable(false);
        self.indexSelected = ko.observable();
        self.isLinkageExist = ko.observable(false);
        self.partySetUpNotExists = ko.observable(false);
        self.fullPartiesCasaAccountList = ko.observableArray();
        self.fullPartiesLoanAccountList = ko.observableArray();
        self.fullPartiesTDAccountList = ko.observableArray();
        self.fullCasaAccountListReview = ko.observable([]);
        self.fulltdAccountListReview = ko.observable([]);
        self.fullloanAccountListReview = ko.observable([]);
        rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, { user: self.nls.navLabels.UserLevel_title }));
        var options = {
            "expanded": "all",
            "columns": [
                "accountID",
                "currency",
                "displayValue",
                "accountStatus"
            ]
        };
        self.activateTab = function() {
          $("#tabs-container-select #tabGroups-select").ojTabs({
            "selected": self.highlightedTabTrans()
          });
        };
        if (self.rootParams && self.rootParams.linkedUserAccountAccessDTOs) {
            self.mapAllTransactionsCasaFlag = ko.observableArray();
            self.mapAllTransactionsTdFlag = ko.observableArray();
            self.mapAllTransactionsLonFlag = ko.observableArray();
            self.selectedUserName = ko.observable();
            self.highlightedTabTrans = ko.observable("CASA");
            self.party = self.rootParams.linkedUserAccountAccessDTOs()[0].partyId;
            self.partyID = ko.observable(self.rootParams.linkedUserAccountAccessDTOs()[0].partyId.value());
            self.selectedUserId = ko.observable(self.rootParams.linkedUserAccountAccessDTOs()[0].userId());
            self.partyName = ko.observable(rootParams.rootModel.transactionDetails().partyName.fullName);
            reviewLinkedUserAccountAccessModel.readUserDetails(self.selectedUserId()).done(function (data) {
                if (data) {
                    self.selectedUserName(rootParams.baseModel.format(self.nls.fieldname.fullName, {
                        firstName: data.userDTO.firstName,
                        lastName: data.userDTO.lastName
                    }));
                }
            });
            self.relatedPartyId = ko.observable(self.rootParams.linkedUserAccountAccessDTOs()[0].linkedPartyId);
            self.relatedPartyName = ko.observable();
            self.accessLevel = ko.observable(self.rootParams.linkedUserAccountAccessDTOs()[0].accessLevel());
            self.accessStatus = ko.observable(self.rootParams.linkedUserAccountAccessDTOs()[0].accessStatus());
            self.showConfirmationForCreate = ko.observable(false);
            self.parentAccessLevel = ko.observable();
            self.parentAccessLevel("USER");
            self.showEditableForm = ko.observable(false);
            self.disableAccountSelection = ko.observable(true);
            self.selectedCasaPolicyChecked = ko.observable([]);
            self.selectedTdPolicyChecked = ko.observable([]);
            self.selectedLoanPolicyChecked = ko.observable([]);
            self.transactionNames = {
                casa: "CASA",
                loan: self.nls.navLabels.Loan,
                td: self.nls.navLabels.TD
            };
            self.showEditableForm = ko.observable(true);
            for (var z = 0; z < self.rootParams.linkedUserAccountAccessDTOs().length; z++) {
                if (self.rootParams.linkedUserAccountAccessDTOs()[z].accountType() === "CSA") {
                    if (self.rootParams.linkedUserAccountAccessDTOs()[z].accessStatus() === true) {
                        self.selectedCasaPolicy = ko.observable("casaAuto");
                        self.selectedCasaPolicyChecked(["casaAuto"]);
                    } else {
                        self.selectedCasaPolicy = ko.observable("casaManual");
                        self.selectedCasaPolicyChecked(["casaManual"]);
                    }
                }
                if (self.rootParams.linkedUserAccountAccessDTOs()[z].accountType() === "TRD") {
                    if (self.rootParams.linkedUserAccountAccessDTOs()[z].accessStatus() === true) {
                        self.selectedTdPolicy = ko.observable("tdAuto");
                        self.selectedTdPolicyChecked = ko.observable(["tdAuto"]);
                    } else {
                        self.selectedTdPolicy = ko.observable("tdManual");
                        self.selectedTdPolicyChecked = ko.observable(["tdManual"]);
                    }
                }
                if (self.rootParams.linkedUserAccountAccessDTOs()[z].accountType() === "LON") {
                    if (self.rootParams.linkedUserAccountAccessDTOs()[z].accessStatus() === true) {
                        self.selectedLoanPolicy = ko.observable("loanAuto");
                        self.selectedLoanPolicyChecked = ko.observable(["loanAuto"]);
                    } else {
                        self.selectedLoanPolicy = ko.observable("loanManual");
                        self.selectedLoanPolicyChecked = ko.observable(["loanManual"]);
                    }
                }
            }
            self.selectedCasaAccounts = ko.observableArray();
            self.selectedTdAccounts = ko.observableArray();
            self.selectedLoanAccounts = ko.observableArray();
            self.casaExclusionAccountNumberList = ko.observable([]);
            self.tdExclusionAccountNumberList = ko.observable([]);
            self.loanExclusionAccountNumberList = ko.observable([]);
            self.updatedCASAExclusionNumberList = ko.observable([]);
            self.updatedTDExclusionNumberList = ko.observable([]);
            self.updatedLOANExclusionNumberList = ko.observable([]);
            self.showReviewComponent = ko.observable(true);
            self.reviewCasaList = ko.observableArray([]);
            self.reviewTDList = ko.observableArray([]);
            self.reviewLoanList = ko.observableArray([]);
            self.fullCasaAccountListSorted = ko.observable([]);
            self.fulltdAccountListSorted = ko.observable([]);
            self.fullloanAccountListSorted = ko.observable([]);
            self.selectedAccountsResources = ko.observableArray();
            self.fullCasaAccountList = ko.observable([]);
            self.fulltdAccountList = ko.observable([]);
            self.fullloanAccountList = ko.observable([]);
            self.resourceListCasa = ko.observable([]);
            self.resourceListTD = ko.observable([]);
            self.resourceListLON = ko.observable([]);
            self.showConfirmation = ko.observable(false);
            self.casaTransactionTabVisited = ko.observable(false);
            self.tdTransactionTabVisited = ko.observable(false);
            self.loanTransactionTabVisited = ko.observable(false);
            self.showReviewScreen = ko.observable(true);
            self.tmpTransactionCodeArray = ko.observableArray();
            self.tmpTransactionCodeTrdArray = ko.observableArray();
            self.tmpTransactionCodeLonArray = ko.observableArray();
            self.mapAllTransactionsToAllAccountCasa = ko.observable(false);
            self.mapAllTransactionsToAllAccountTrd = ko.observable(false);
            self.mapAllTransactionsToAllAccountLon = ko.observable(false);
            self.casaMapAllTransactionIndicatorArray = ko.observableArray();
            self.trdMapAllTransactionIndicatorArray = ko.observableArray();
            self.loanMapAllTransactionIndicatorArray = ko.observableArray();
            self.tmpTransactionCodeArray = ko.observableArray();
            self.tmpTransactionCodeTrdArray = ko.observableArray();
            self.tmpTransactionCodeLonArray = ko.observableArray();
            self.isCasaAllowed = ko.observable();
            self.isTDAllowed = ko.observable();
            self.isLoanAllowed = ko.observable();
            self.casaAccountAccessId = ko.observable();
            self.tdAccountAccessId = ko.observable();
            self.loanAccountAccessId = ko.observable();
            self.casaAccountNumbersArray = ko.observable([]);
            self.tdAccountNumbersArray = ko.observable([]);
            self.loanAccountNumbersArray = ko.observable([]);
        }
        rootParams.baseModel.registerComponent("transaction-selection", "account-access-management");
        rootParams.baseModel.registerComponent("confirmation", "account-access-management");
        self.selectedTaskTabChangeHandler = function (event) {
                if (event.detail.value === 0) {
                    self.casaTransactionTabVisited(true);
                    self.highlightedTabTrans("CASA");
                }
                if (event.detail.value === 1) {
                    self.tdTransactionTabVisited(true);
                    self.highlightedTabTrans("TRD");
                }
                if (event.detail.value === 2) {
                    self.loanTransactionTabVisited(true);
                    self.highlightedTabTrans("LON");
                }
        };
        self.populateSelectedAccounts = function () {
            self.casaExclusionAccountNumberList([]);
            self.tdExclusionAccountNumberList([]);
            self.loanExclusionAccountNumberList([]);
            self.updatedCASAExclusionNumberList([]);
            self.updatedTDExclusionNumberList([]);
            self.updatedLOANExclusionNumberList([]);
            if (self.rootParams && self.rootParams.linkedUserAccountAccessDTOs) {
                if (self.rootParams.linkedUserAccountAccessDTOs().length > 0) {
                    for (var x = 0; x < self.rootParams.linkedUserAccountAccessDTOs().length; x++) {
                        if (self.rootParams.linkedUserAccountAccessDTOs()[x].accountExclusionDTOs()) {
                            if (self.rootParams.linkedUserAccountAccessDTOs()[x].accountType() === "CSA") {
                                self.isCasaAllowed(self.rootParams.linkedUserAccountAccessDTOs()[x].accessStatus());
                                if (self.rootParams.linkedUserAccountAccessDTOs()[x].accountAccessId) {
                                    self.casaAccountAccessId(self.rootParams.linkedUserAccountAccessDTOs()[x].accountAccessId());
                                }
                                self.updatedCASAExclusionNumberList(self.rootParams.linkedUserAccountAccessDTOs()[x].accountExclusionDTOs());
                                ko.utils.arrayForEach(self.updatedCASAExclusionNumberList(), function (item) {
                                    self.casaAccountNumbersArray().push(item.accountNumber.value());
                                });
                                if (self.isCasaAllowed()) {
                                    ko.utils.arrayForEach(self.fullCasaAccountListReview(), function (item) {
                                        if (self.casaAccountNumbersArray().indexOf(item.accountNumber.value) > -1) {
                                            for (var i = 0; i < self.updatedCASAExclusionNumberList().length; i++) {
                                                if (self.updatedCASAExclusionNumberList()[i].accountNumber.value() === item.accountNumber.value && item.fullResourceTaskList.length !== self.updatedCASAExclusionNumberList()[i].taskIds().length) {
                                                    self.selectedCasaAccounts.push(item.accountNumber.value);
                                                }
                                            }
                                        } else {
                                            self.selectedCasaAccounts.push(item.accountNumber.value);
                                        }
                                    });
                                } else {
                                    ko.utils.arrayForEach(self.updatedCASAExclusionNumberList(), function (item) {
                                        self.selectedCasaAccounts.push(item.accountNumber.value());
                                    });
                                }
                            } else if (self.rootParams.linkedUserAccountAccessDTOs()[x].accountType() === "TRD") {
                                self.isTDAllowed(self.rootParams.linkedUserAccountAccessDTOs()[x].accessStatus());
                                if (self.rootParams.linkedUserAccountAccessDTOs()[x].accountAccessId) {
                                    self.tdAccountAccessId(self.rootParams.linkedUserAccountAccessDTOs()[x].accountAccessId());
                                }
                                self.updatedTDExclusionNumberList(self.rootParams.linkedUserAccountAccessDTOs()[x].accountExclusionDTOs());
                                ko.utils.arrayForEach(self.updatedTDExclusionNumberList(), function (item) {
                                    self.tdAccountNumbersArray().push(item.accountNumber.value());
                                });
                                if (self.isTDAllowed()) {
                                    ko.utils.arrayForEach(self.fulltdAccountListReview(), function (item) {
                                        if (self.tdAccountNumbersArray().indexOf(item.accountNumber.value) > -1) {
                                            for (var i = 0; i < self.updatedTDExclusionNumberList().length; i++) {
                                                if (self.updatedTDExclusionNumberList()[i].accountNumber.value() === item.accountNumber.value && item.fullResourceTaskList.length !== self.updatedTDExclusionNumberList()[i].taskIds().length) {
                                                    self.selectedTdAccounts.push(item.accountNumber.value);
                                                }
                                            }
                                        } else {
                                            self.selectedTdAccounts.push(item.accountNumber.value);
                                        }
                                    });
                                } else {
                                    ko.utils.arrayForEach(self.updatedTDExclusionNumberList(), function (item) {
                                        self.selectedTdAccounts.push(item.accountNumber.value());
                                    });
                                }
                            } else if (self.rootParams.linkedUserAccountAccessDTOs()[x].accountType() === "LON") {
                                self.isLoanAllowed(self.rootParams.linkedUserAccountAccessDTOs()[x].accessStatus());
                                if (self.rootParams.linkedUserAccountAccessDTOs()[x].accountAccessId) {
                                    self.loanAccountAccessId(self.rootParams.linkedUserAccountAccessDTOs()[x].accountAccessId());
                                }
                                self.updatedLOANExclusionNumberList(self.rootParams.linkedUserAccountAccessDTOs()[x].accountExclusionDTOs());
                                ko.utils.arrayForEach(self.updatedLOANExclusionNumberList(), function (item) {
                                    self.loanAccountNumbersArray().push(item.accountNumber.value);
                                });
                                if (self.isLoanAllowed()) {
                                    ko.utils.arrayForEach(self.fullloanAccountListReview(), function (item) {
                                        if (self.loanAccountNumbersArray().indexOf(item.accountNumber.value) > -1) {
                                            for (var i = 0; i < self.updatedLOANExclusionNumberList().length; i++) {
                                                if (self.updatedLOANExclusionNumberList()[i].accountNumber.value() === item.accountNumber.value && item.fullResourceTaskList.length !== self.updatedLOANExclusionNumberList()[i].taskIds().length) {
                                                    self.selectedLoanAccounts.push(item.accountNumber.value);
                                                }
                                            }
                                        } else {
                                            self.selectedLoanAccounts.push(item.accountNumber.value);
                                        }
                                    });
                                } else {
                                    ko.utils.arrayForEach(self.updatedLOANExclusionNumberList(), function (item) {
                                        self.selectedLoanAccounts.push(item.accountNumber.value());
                                    });
                                }
                            }
                        }
                    }
                    self.createBaseForDataSource(self.rootParams.linkedUserAccountAccessDTOs());
                }
            }
        };
        self.getAllAccountsCount = function (selecteduserId) {
            self.fullCasaAccountList([]);
            self.fulltdAccountList([]);
            self.fullloanAccountList([]);
            reviewLinkedUserAccountAccessModel.readAllUserAccountDetails(self.partyID(), selecteduserId).done(function (data) {
                if (data.accounts.length > 0) {
                    ko.utils.arrayForEach(data.accounts, function (partyItem) {
                        self.Loader = false;
                        self.fullCasaAccountList([]);
                        self.fulltdAccountList([]);
                        self.fullloanAccountList([]);
                        if (partyItem.setupInformation === "SETUP_EXISTS") {
                            self.isAccessCreated1(true);
                            self.showEditableForm1(true);
                        } else {
                            self.isAccessCreated1(false);
                            self.showEditableForm1(false);
                        }
                        if (partyItem.preferenceStatus === "ENABLED") {
                            self.isPreferenceExist(true);
                        } else {
                            self.isPreferenceExist(false);
                        }
                        self.accessLevel1(partyItem.accessLevel);
                        self.accessLevel(partyItem.accessLevel);
                        if (partyItem.accountsList) {
                            var casaPayload = [];
                            var tdPayload = [];
                            var loanPayload = [];
                            for (var x = 0; x < partyItem.accountsList.length; x++) {
                                if (partyItem.accountsList[x].accountType === "CSA") {
                                    casaPayload.push(partyItem.accountsList[x]);
                                }
                                if (partyItem.accountsList[x].accountType === "LON") {
                                    loanPayload.push(partyItem.accountsList[x]);
                                }
                                if (partyItem.accountsList[x].accountType === "TRD") {
                                    tdPayload.push(partyItem.accountsList[x]);
                                }
                            }
                            if (casaPayload) {
                                ko.utils.arrayForEach(casaPayload, function (item) {
                                    self.newCasaObject = {
                                        "accountType": "",
                                        "accountNumber": {
                                            "value": "",
                                            "displayValue": ""
                                        },
                                        "displayName": "",
                                        "accountStatus": "",
                                        "resourceListCasa": [],
                                        "selectedTask": [],
                                        "nonSelectedTask": [],
                                        "currencyCode": "",
                                        "fullResourceTaskList": []
                                    };
                                    ko.utils.arrayForEach(item.tasks, function (thisChildTaskItem) {
                                        self.newResourceObject = {
                                            "childTasks": [],
                                            "name": ""
                                        };
                                        ko.utils.arrayForEach(thisChildTaskItem.childTasks, function (thisItem) {
                                            self.newTaskObject = {
                                                "id": "",
                                                "name": "",
                                                "supportedAccountTypes": [],
                                                "approvalSupported": "",
                                                "limitRequired": "",
                                                "moduleType": "",
                                                "type": "",
                                                "isAllowed": ""
                                            };
                                            self.newTaskObject.id = thisItem.childTask.id;
                                            self.newTaskObject.name = thisItem.childTask.name;
                                            self.newTaskObject.supportedAccountTypes = thisItem.childTask.supportedAccountTypes;
                                            self.newTaskObject.approvalSupported = thisItem.childTask.approvalSupported;
                                            self.newTaskObject.limitRequired = thisItem.childTask.limitRequired;
                                            self.newTaskObject.moduleType = thisItem.childTask.moduleType;
                                            self.newTaskObject.type = thisItem.childTask.type;
                                            self.newTaskObject.isAllowed = thisItem.isAllowed;
                                            if (thisItem.isAllowed) {
                                                self.newCasaObject.selectedTask.push(thisItem.childTask.id);
                                            } else {
                                                self.newCasaObject.nonSelectedTask.push(thisItem.childTask.id);
                                            }
                                            self.newCasaObject.fullResourceTaskList.push(thisItem.childTask.id);
                                            self.newResourceObject.childTasks.push(self.newTaskObject);
                                            self.newResourceObject.name = thisChildTaskItem.name;
                                        });
                                        self.newCasaObject.resourceListCasa.push(self.newResourceObject);
                                    });
                                    self.newCasaObject.accountType = item.accountType;
                                    self.newCasaObject.accountNumber.value = item.accountNumber.value;
                                    self.newCasaObject.accountNumber.displayValue = item.accountNumber.displayValue;
                                    self.newCasaObject.currencyCode = item.currencyCode;
                                    self.newCasaObject.accountStatus = item.accountStatus;
                                    self.newCasaObject.displayName = item.displayName;
                                    self.resourceListCasa([self.newCasaObject.resourceListCasa]);
                                    self.fullCasaAccountList().push(self.newCasaObject);
                                });
                                self.fullPartiesCasaAccountList().push(self.fullCasaAccountList());
                            }
                            if (tdPayload) {
                                ko.utils.arrayForEach(tdPayload, function (item) {
                                    self.newTdObject = {
                                        "accountType": "",
                                        "accountNumber": {
                                            "value": "",
                                            "displayValue": ""
                                        },
                                        "displayName": "",
                                        "accountStatus": "",
                                        "resourceListTD": [],
                                        "selectedTask": [],
                                        "nonSelectedTask": [],
                                        "currencyCode": "",
                                        "fullResourceTaskList": []
                                    };
                                    ko.utils.arrayForEach(item.tasks, function (thisChildTaskItem) {
                                        self.newResourceObject = {
                                            "childTasks": [],
                                            "name": ""
                                        };
                                        ko.utils.arrayForEach(thisChildTaskItem.childTasks, function (thisItem) {
                                            self.newTaskObject = {
                                                "id": "",
                                                "name": "",
                                                "supportedAccountTypes": [],
                                                "approvalSupported": "",
                                                "limitRequired": "",
                                                "moduleType": "",
                                                "type": "",
                                                "isAllowed": ""
                                            };
                                            self.newTaskObject.id = thisItem.childTask.id;
                                            self.newTaskObject.name = thisItem.childTask.name;
                                            self.newTaskObject.supportedAccountTypes = thisItem.childTask.supportedAccountTypes;
                                            self.newTaskObject.approvalSupported = thisItem.childTask.approvalSupported;
                                            self.newTaskObject.limitRequired = thisItem.childTask.limitRequired;
                                            self.newTaskObject.moduleType = thisItem.childTask.moduleType;
                                            self.newTaskObject.type = thisItem.childTask.type;
                                            self.newTaskObject.isAllowed = thisItem.isAllowed;
                                            if (thisItem.isAllowed) {
                                                self.newTdObject.selectedTask.push(thisItem.childTask.id);
                                            } else {
                                                self.newTdObject.nonSelectedTask.push(thisItem.childTask.id);
                                            }
                                            self.newTdObject.fullResourceTaskList.push(thisItem.childTask.id);
                                            self.newResourceObject.childTasks.push(self.newTaskObject);
                                            self.newResourceObject.name = thisChildTaskItem.name;
                                        });
                                        self.newTdObject.resourceListTD.push(self.newResourceObject);
                                    });
                                    self.newTdObject.accountType = item.accountType;
                                    self.newTdObject.accountNumber.value = item.accountNumber.value;
                                    self.newTdObject.accountNumber.displayValue = item.accountNumber.displayValue;
                                    self.newTdObject.currencyCode = item.currencyCode;
                                    self.newTdObject.accountStatus = item.accountStatus;
                                    self.newTdObject.displayName = item.displayName;
                                    self.resourceListTD([self.newTdObject.resourceListTD]);
                                    self.fulltdAccountList().push(self.newTdObject);
                                });
                                self.fullPartiesTDAccountList().push(self.fulltdAccountList());
                            }
                            if (loanPayload) {
                                ko.utils.arrayForEach(loanPayload, function (item) {
                                    self.newLoanObject = {
                                        "accountType": "",
                                        "accountNumber": {
                                            "value": "",
                                            "displayValue": ""
                                        },
                                        "displayName": "",
                                        "accountStatus": "",
                                        "resourceListLON": [],
                                        "selectedTask": [],
                                        "nonSelectedTask": [],
                                        "currencyCode": "",
                                        "fullResourceTaskList": []
                                    };
                                    ko.utils.arrayForEach(item.tasks, function (thisChildTaskItem) {
                                        self.newResourceObject = {
                                            "childTasks": [],
                                            "name": ""
                                        };
                                        ko.utils.arrayForEach(thisChildTaskItem.childTasks, function (thisItem) {
                                            self.newTaskObject = {
                                                "id": "",
                                                "name": "",
                                                "supportedAccountTypes": [],
                                                "approvalSupported": "",
                                                "limitRequired": "",
                                                "moduleType": "",
                                                "type": "",
                                                "isAllowed": ""
                                            };
                                            self.newTaskObject.id = thisItem.childTask.id;
                                            self.newTaskObject.name = thisItem.childTask.name;
                                            self.newTaskObject.supportedAccountTypes = thisItem.childTask.supportedAccountTypes;
                                            self.newTaskObject.approvalSupported = thisItem.childTask.approvalSupported;
                                            self.newTaskObject.limitRequired = thisItem.childTask.limitRequired;
                                            self.newTaskObject.moduleType = thisItem.childTask.moduleType;
                                            self.newTaskObject.type = thisItem.childTask.type;
                                            self.newTaskObject.isAllowed = thisItem.isAllowed;
                                            if (thisItem.isAllowed) {
                                                self.newLoanObject.selectedTask.push(thisItem.childTask.id);
                                            } else {
                                                self.newLoanObject.nonSelectedTask.push(thisItem.childTask.id);
                                            }
                                            self.newLoanObject.fullResourceTaskList.push(thisItem.childTask.id);
                                            self.newResourceObject.childTasks.push(self.newTaskObject);
                                            self.newResourceObject.name = thisChildTaskItem.name;
                                        });
                                        self.newLoanObject.resourceListLON.push(self.newResourceObject);
                                    });
                                    self.newLoanObject.accountType = item.accountType;
                                    self.newLoanObject.accountNumber.value = item.accountNumber.value;
                                    self.newLoanObject.accountNumber.displayValue = item.accountNumber.displayValue;
                                    self.newLoanObject.currencyCode = item.currencyCode;
                                    self.newLoanObject.accountStatus = item.accountStatus;
                                    self.newLoanObject.displayName = item.displayName;
                                    self.resourceListLON([self.newLoanObject.resourceListLON]);
                                    self.fullloanAccountList().push(self.newLoanObject);
                                });
                                self.fullPartiesLoanAccountList().push(self.fullloanAccountList());
                            }
                        } else {
                            self.fullPartiesCasaAccountList().push(self.fullCasaAccountList());
                            self.fullPartiesLoanAccountList().push(self.fullloanAccountList());
                            self.fullPartiesTDAccountList().push(self.fulltdAccountList());
                        }
                        if (self.rootParams && self.rootParams.linkedUserAccountAccessDTOs) {
                            if (partyItem.party.value === self.relatedPartyId().value()) {
                                self.fullCasaAccountListReview(self.fullCasaAccountList());
                                self.fullloanAccountListReview(self.fullloanAccountList());
                                self.fulltdAccountListReview(self.fulltdAccountList());
                                if (partyItem.accessLevel === "USERLINKAGE") {
                                    if (partyItem.partyName) {
                                        self.relatedPartyName(partyItem.partyName);
                                    }
                                }
                            }
                            self.populateSelectedAccounts();
                        } else
                            self.createDataSource();
                    });
                }
            });
        };
        self.getAllAccountsCount(self.selectedUserId());
        self.createCASADatasource = function (dataDTO) {
            self.accountExclusionCasaAccountNumberItem = ko.observable([]);
            self.filteredCasaTask = ko.observableArray([]);
            self.casaAcessStatus = ko.observable(dataDTO.accessStatus());
            ko.utils.arrayForEach(dataDTO.accountExclusionDTOs(), function (accountExclusionItem) {
                self.accountExclusionCasaAccountNumberItem().push(accountExclusionItem.accountNumber.value());
            });
            ko.utils.arrayForEach(self.fullCasaAccountListReview(), function (item) {
                self.casaTransactionMappedObject = {
                    accountNumber: {
                        value: "",
                        displayValue: ""
                    },
                    displayName: "",
                    accountStatus: "",
                    currencyCode: "",
                    selectedTask: [],
                    accountType: "",
                    nonSelectedTask: [],
                    resourceListCasa: []
                };
                self.casaTransactionMappedObject.accountNumber.displayValue = item.accountNumber.displayValue;
                self.casaTransactionMappedObject.accountStatus = item.accountStatus;
                self.casaTransactionMappedObject.displayName = item.displayName;
                self.casaTransactionMappedObject.accountNumber.value = item.accountNumber.value;
                self.casaTransactionMappedObject.accountType = item.accountType;
                self.casaTransactionMappedObject.currencyCode = item.currencyCode;
                self.casaTransactionMappedObject.resourceListCasa = item.resourceListCasa;
                if (self.accountExclusionCasaAccountNumberItem().indexOf(item.accountNumber.value) > -1) {
                    for (var i = 0; i < dataDTO.accountExclusionDTOs().length; i++) {
                        self.filteredCasaTask([]);
                        var exclusionItem = dataDTO.accountExclusionDTOs()[i];
                        for (var j = 0; j < item.fullResourceTaskList.length; j++) {
                            if (exclusionItem.accountNumber.value() === item.accountNumber.value) {
                                if (self.casaAcessStatus()) {
                                    if (exclusionItem.taskIds().indexOf(item.fullResourceTaskList[j]) === -1) {
                                        self.filteredCasaTask().push(item.fullResourceTaskList[j]);
                                        self.casaTransactionMappedObject.nonSelectedTask = exclusionItem.taskIds();
                                        self.casaTransactionMappedObject.selectedTask = self.filteredCasaTask();
                                    }
                                } else if (exclusionItem.taskIds().indexOf(item.fullResourceTaskList[j]) !== -1) {
                                        self.filteredCasaTask().push(item.fullResourceTaskList[j]);
                                        self.casaTransactionMappedObject.nonSelectedTask = [];
                                        self.casaTransactionMappedObject.selectedTask = exclusionItem.taskIds();
                                    }
                            }
                        }
                    }
                } else if (self.casaAcessStatus()) {
                        self.casaTransactionMappedObject.nonSelectedTask = [];
                        self.casaTransactionMappedObject.selectedTask = item.fullResourceTaskList;
                    } else {
                        self.casaTransactionMappedObject.nonSelectedTask = [];
                        self.casaTransactionMappedObject.selectedTask = [];
                    }
                if (!(self.selectedAccountsResources().filter(function (e) {
                        return e.accountNumber.value === item.accountNumber.value;
                    }).length > 0)) {
                    self.selectedAccountsResources().push(self.casaTransactionMappedObject);
                }
            });
        };
        self.createLONDataSource = function (dataDTO) {
            self.loanAcessStatus = ko.observable(dataDTO.accessStatus());
            self.filteredLoanTask = ko.observableArray([]);
            self.accountExclusionLONAccountNumberItem = ko.observable([]);
            ko.utils.arrayForEach(dataDTO.accountExclusionDTOs(), function (accountExclusionItem) {
                self.accountExclusionLONAccountNumberItem().push(accountExclusionItem.accountNumber.value());
            });
            ko.utils.arrayForEach(self.fullloanAccountListReview(), function (item) {
                self.loanTransactionMappedObject = {
                    accountNumber: {
                        value: "",
                        displayValue: ""
                    },
                    displayName: "",
                    accountStatus: "",
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
                self.loanTransactionMappedObject.currencyCode = item.currencyCode;
                self.loanTransactionMappedObject.resourceListLON = item.resourceListLON;
                if (self.accountExclusionLONAccountNumberItem().indexOf(item.accountNumber.value) > -1) {
                    for (var i = 0; i < dataDTO.accountExclusionDTOs().length; i++) {
                        self.filteredLoanTask([]);
                        var exclusionItem = dataDTO.accountExclusionDTOs()[i];
                        for (var j = 0; j < item.fullResourceTaskList.length; j++) {
                            if (exclusionItem.accountNumber.value() === item.accountNumber.value) {
                                if (self.loanAcessStatus()) {
                                    if (exclusionItem.taskIds().indexOf(item.fullResourceTaskList[j]) === -1) {
                                        self.filteredLoanTask().push(item.fullResourceTaskList[j]);
                                        self.loanTransactionMappedObject.nonSelectedTask = exclusionItem.taskIds();
                                        self.loanTransactionMappedObject.selectedTask = self.filteredLoanTask();
                                    }
                                } else if (exclusionItem.taskIds().indexOf(item.fullResourceTaskList[j]) !== -1) {
                                        self.filteredLoanTask().push(item.fullResourceTaskList[j]);
                                        self.loanTransactionMappedObject.nonSelectedTask = [];
                                        self.loanTransactionMappedObject.selectedTask = exclusionItem.taskIds();
                                    }
                            }
                        }
                    }
                } else if (self.loanAcessStatus()) {
                        self.loanTransactionMappedObject.nonSelectedTask = [];
                        self.loanTransactionMappedObject.selectedTask = item.fullResourceTaskList;
                    } else {
                        self.loanTransactionMappedObject.nonSelectedTask = [];
                        self.loanTransactionMappedObject.selectedTask = [];
                    }
                if (!(self.selectedAccountsResources().filter(function (e) {
                        return e.accountNumber.value === item.accountNumber.value;
                    }).length > 0)) {
                    self.selectedAccountsResources().push(self.loanTransactionMappedObject);
                }
            });
        };
        self.createTDDatasource = function (dataDTO) {
            self.accountExclusionTDAccountNumberItem = ko.observable([]);
            self.filteredTDTask = ko.observableArray([]);
            self.tdAcessStatus = ko.observable(dataDTO.accessStatus());
            ko.utils.arrayForEach(dataDTO.accountExclusionDTOs(), function (accountExclusionItem) {
                self.accountExclusionTDAccountNumberItem().push(accountExclusionItem.accountNumber.value());
            });
            ko.utils.arrayForEach(self.fulltdAccountListReview(), function (item) {
                self.tdTransactionMappedObject = {
                    accountNumber: {
                        value: "",
                        displayValue: ""
                    },
                    displayName: "",
                    accountStatus: "",
                    currencyCode: "",
                    selectedTask: [],
                    accountType: "",
                    nonSelectedTask: [],
                    resourceListTD: []
                };
                self.tdTransactionMappedObject.accountNumber.displayValue = item.accountNumber.displayValue;
                self.tdTransactionMappedObject.accountNumber.value = item.accountNumber.value;
                self.tdTransactionMappedObject.accountStatus = item.accountStatus;
                self.tdTransactionMappedObject.displayName = item.displayName;
                self.tdTransactionMappedObject.accountType = item.accountType;
                self.tdTransactionMappedObject.currencyCode = item.currencyCode;
                self.tdTransactionMappedObject.resourceListTD = item.resourceListTD;
                if (self.accountExclusionTDAccountNumberItem().indexOf(item.accountNumber.value) > -1) {
                    for (var i = 0; i < dataDTO.accountExclusionDTOs().length; i++) {
                        self.filteredTDTask([]);
                        var exclusionItem = dataDTO.accountExclusionDTOs()[i];
                        for (var j = 0; j < item.fullResourceTaskList.length; j++) {
                            if (exclusionItem.accountNumber.value() === item.accountNumber.value) {
                                if (self.tdAcessStatus()) {
                                    if (exclusionItem.taskIds().indexOf(item.fullResourceTaskList[j]) === -1) {
                                        self.filteredTDTask().push(item.fullResourceTaskList[j]);
                                        self.tdTransactionMappedObject.nonSelectedTask = exclusionItem.taskIds();
                                        self.tdTransactionMappedObject.selectedTask = self.filteredTDTask();
                                    }
                                } else if (exclusionItem.taskIds().indexOf(item.fullResourceTaskList[j]) !== -1) {
                                        self.filteredTDTask().push(item.fullResourceTaskList[j]);
                                        self.tdTransactionMappedObject.nonSelectedTask = [];
                                        self.tdTransactionMappedObject.selectedTask = exclusionItem.taskIds();
                                    }
                            }
                        }
                    }
                } else if (self.tdAcessStatus()) {
                        self.tdTransactionMappedObject.nonSelectedTask = [];
                        self.tdTransactionMappedObject.selectedTask = item.fullResourceTaskList;
                    } else {
                        self.tdTransactionMappedObject.nonSelectedTask = [];
                        self.tdTransactionMappedObject.selectedTask = [];
                    }
                if (!(self.selectedAccountsResources().filter(function (e) {
                        return e.accountNumber.value === item.accountNumber.value;
                    }).length > 0)) {
                    self.selectedAccountsResources().push(self.tdTransactionMappedObject);
                }
            });
        };
        self.createDataSource = function () {
            ko.utils.arrayForEach(self.selectedAccountsResources(), function (item) {
                if (item.accountType === "CSA") {
                    self.reviewCasaList().push(item);
                } else if (item.accountType === "TRD") {
                    self.reviewTDList().push(item);
                } else if (item.accountType === "LON") {
                    self.reviewLoanList().push(item);
                }
            });
            for (var i = 0; i < self.selectedCasaAccounts().length; i++) {
                ko.utils.arrayForEach(self.reviewCasaList(), function (item) {
                    if (item.accountNumber.value === self.selectedCasaAccounts()[i]) {
                        if (!(self.fullCasaAccountListSorted().filter(function (e) {
                                return e.accountNumber.value === self.selectedCasaAccounts()[i];
                            }).length > 0)) {
                            self.fullCasaAccountListSorted().push(item);
                        }
                    }
                });
            }
            self.fullCasaAccountListSorted().sort(function (left, right) {
                return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
            });
            ko.utils.arrayForEach(self.reviewCasaList(), function (item) {
                if (self.selectedCasaAccounts().indexOf(item.accountNumber.value) === -1) {
                    self.fullCasaAccountListSorted().push(item);
                }
            });
            self.reviewCasaList([]);
            ko.utils.arrayForEach(self.fullCasaAccountListSorted(), function (item) {
                if (!(self.reviewCasaList().filter(function (e) {
                        return e.accountNumber.value === item.accountNumber.value;
                    }).length > 0)) {
                    self.reviewCasaList().push(item);
                }
            });
            for (var j = 0; j < self.selectedTdAccounts().length; j++) {
                ko.utils.arrayForEach(self.reviewTDList(), function (item) {
                    if (item.accountNumber.value === self.selectedTdAccounts()[j]) {
                        if (!(self.fulltdAccountListSorted().filter(function (e) {
                                return e.accountNumber.value === self.selectedTdAccounts()[j];
                            }).length > 0)) {
                            self.fulltdAccountListSorted().push(item);
                        }
                    }
                });
            }
            self.fulltdAccountListSorted().sort(function (left, right) {
                return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
            });
            ko.utils.arrayForEach(self.reviewTDList(), function (item) {
                if (self.selectedTdAccounts().indexOf(item.accountNumber.value) === -1) {
                    self.fulltdAccountListSorted().push(item);
                }
            });
            self.reviewTDList([]);
            ko.utils.arrayForEach(self.fulltdAccountListSorted(), function (item) {
                if (!(self.reviewTDList().filter(function (e) {
                        return e.accountNumber.value === item.accountNumber.value;
                    }).length > 0)) {
                    self.reviewTDList().push(item);
                }
            });
            for (var k = 0; k < self.selectedLoanAccounts().length; k++) {
                ko.utils.arrayForEach(self.reviewLoanList(), function (item) {
                    if (item.accountNumber.value === self.selectedLoanAccounts()[k]) {
                        if (!(self.fullloanAccountListSorted().filter(function (e) {
                                return e.accountNumber.value === self.selectedLoanAccounts()[k];
                            }).length > 0)) {
                            self.fullloanAccountListSorted().push(item);
                        }
                    }
                });
            }
            self.fullloanAccountListSorted().sort(function (left, right) {
                return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
            });
            ko.utils.arrayForEach(self.reviewLoanList(), function (item) {
                if (self.selectedLoanAccounts().indexOf(item.accountNumber.value) === -1) {
                    self.fullloanAccountListSorted().push(item);
                }
            });
            self.reviewLoanList([]);
            ko.utils.arrayForEach(self.fullloanAccountListSorted(), function (item) {
                if (!(self.reviewLoanList().filter(function (e) {
                        return e.accountNumber.value === item.accountNumber.value;
                    }).length > 0)) {
                    self.reviewLoanList().push(item);
                }
            });
            if (self.showReviewScreen() === true) {
                self.casaReviewData = $.map(ko.utils.unwrapObservable(self.reviewCasaList()), function (val) {
                    val.attr = {
                        accountNumber: {
                            displayValue: val.accountNumber.displayValue,
                            value: val.accountNumber.value
                        },
                        accountStatus: val.accountStatus ? val.accountStatus : "-",
                        displayName: val.displayName ? val.displayName : "-",
                        accountID: val.accountNumber.value,
                        accountType: val.accountType,
                        mappingPolicy: val.isAllowed,
                        currency: val.currencyCode ? val.currencyCode : "-"
                    };
                    val.children = [{
                            attr: {
                                accountNumber: {
                                    displayValue: val.accountNumber.displayValue,
                                    value: val.accountNumber.value
                                },
                                accountStatus: val.accountStatus ? val.accountStatus : "-",
                                displayName: val.displayName ? val.displayName : "-",
                                selectedTask: val.selectedTask,
                                nonSelectedTask: val.nonSelectedTask,
                                accountType: val.accountType,
                                resoureTaskList: val.resourceListCasa
                            }
                        }];
                    return val;
                });
                self.casaReviewDatasource = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.casaReviewData), options));
                self.tdData = $.map(ko.utils.unwrapObservable(self.reviewTDList()), function (val) {
                    val.attr = {
                        accountNumber: {
                            displayValue: val.accountNumber.displayValue,
                            value: val.accountNumber.value
                        },
                        accountStatus: val.accountStatus ? val.accountStatus : "-",
                        displayName: val.displayName ? val.displayName : "-",
                        accountID: val.accountNumber.value,
                        accountType: val.accountType,
                        mappingPolicy: val.isAllowed,
                        currency: val.currencyCode ? val.currencyCode : "-"
                    };
                    val.children = [{
                            attr: {
                                accountNumber: {
                                    displayValue: val.accountNumber.displayValue,
                                    value: val.accountNumber.value
                                },
                                accountStatus: val.accountStatus ? val.accountStatus : "-",
                                displayName: val.displayName ? val.displayName : "-",
                                selectedTask: val.selectedTask,
                                nonSelectedTask: val.nonSelectedTask,
                                accountType: val.accountType,
                                resoureTaskList: val.resourceListTD
                            }
                        }];
                    return val;
                });
                self.tdTransactionDatasource = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.tdData), options));
                self.reloadTDTable(true);
                self.loanData = $.map(ko.utils.unwrapObservable(self.reviewLoanList()), function (val) {
                    val.attr = {
                        accountNumber: {
                            displayValue: val.accountNumber.displayValue,
                            value: val.accountNumber.value
                        },
                        accountStatus: val.accountStatus ? val.accountStatus : "-",
                        displayName: val.displayName ? val.displayName : "-",
                        accountID: val.accountNumber.value,
                        accountType: val.accountType,
                        mappingPolicy: val.isAllowed,
                        currency: val.currencyCode ? val.currencyCode : "-"
                    };
                    val.children = [{
                            attr: {
                                accountNumber: {
                                    displayValue: val.accountNumber.displayValue,
                                    value: val.accountNumber.value
                                },
                                accountStatus: val.accountStatus ? val.accountStatus : "-",
                                displayName: val.displayName ? val.displayName : "-",
                                selectedTask: val.selectedTask,
                                nonSelectedTask: val.nonSelectedTask,
                                accountType: val.accountType,
                                resoureTaskList: val.resourceListLON
                            }
                        }];
                    return val;
                });
                self.loanTransactionDatasource = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.loanData), options));
                self.reloadLoanTable(true);
                self.createTaskCodeArray();
            }
        };
        self.createBaseForDataSource = function (responseDTOs) {
            for (var x = 0; x < responseDTOs.length; x++) {
                if (responseDTOs[x].accountType() === "CSA") {
                    self.createCASADatasource(responseDTOs[x]);
                }
                if (responseDTOs[x].accountType() === "TRD") {
                    self.createTDDatasource(responseDTOs[x]);
                }
                if (responseDTOs[x].accountType() === "LON") {
                    self.createLONDataSource(responseDTOs[x]);
                }
                self.createDataSource();
            }
        };
        self.cancel = function () {
            rootParams.dashboard.openDashBoard(self.nls.common.cancelConfirm);
        };
        self.editAccountAccess = function () {
            self.showEditableForm(false);
            self.editBackFromReview(true);
            rootParams.dashboard.hideDetails();
        };
        self.createTaskCodeArray = function () {
            ko.utils.arrayForEach(self.selectedCasaAccounts(), function (item) {
                self.taskCodeObj = {
                    accountNumber: "",
                    taskIds: []
                };
                self.taskCodeObj.accountNumber = item;
                self.taskCodeObj.taskIds = [];
                self.tmpTransactionCodeArray.push(self.taskCodeObj);
            });
            ko.utils.arrayForEach(self.selectedTdAccounts(), function (item) {
                self.taskCodeObj = {
                    accountNumber: "",
                    taskIds: []
                };
                self.taskCodeObj.accountNumber = item;
                self.taskCodeObj.taskIds = [];
                self.tmpTransactionCodeTrdArray.push(self.taskCodeObj);
            });
            ko.utils.arrayForEach(self.selectedLoanAccounts(), function (item) {
                self.taskCodeObj = {
                    accountNumber: "",
                    taskIds: []
                };
                self.taskCodeObj.accountNumber = item;
                self.taskCodeObj.taskIds = [];
                self.tmpTransactionCodeLonArray.push(self.taskCodeObj);
            });
            self.casaMapAllTransactionIndicatorArray.subscribe(function (newSelectedArray) {
                if (newSelectedArray.length === self.selectedCasaAccounts().length) {
                    self.mapAllTransactionsCasaFlag.push("MAP_ALL");
                } else {
                    self.mapAllTransactionsCasaFlag.removeAll();
                }
            });
            self.trdMapAllTransactionIndicatorArray.subscribe(function (newSelectedArray) {
                if (newSelectedArray.length === self.selectedTdAccounts().length) {
                    self.mapAllTransactionsTdFlag.push("MAP_ALL");
                } else {
                    self.mapAllTransactionsTdFlag.removeAll();
                }
            });
            self.loanMapAllTransactionIndicatorArray.subscribe(function (newSelectedArray) {
                if (newSelectedArray.length === self.selectedLoanAccounts().length) {
                    self.mapAllTransactionsLonFlag.push("MAP_ALL");
                } else {
                    self.mapAllTransactionsLonFlag.removeAll();
                }
            });
            self.reloadCasaTable(false);
            self.reloadCasaTable(true);
        };
    };
});
