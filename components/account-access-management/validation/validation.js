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
    "ojs/ojtable",
    "ojs/ojrowexpander",
    "ojs/ojchart",
    "ojs/ojflattenedtreedatagriddatasource",
    "ojs/ojjsontreedatasource",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, ExclusionModel, BaseLogger, constants, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.showAccountAccess = ko.observable(false);
        self.isAccessCreated = ko.observable(false);
        self.isAccessUpdated = ko.observable();
        self.mappedAccts = ko.observable();
        self.selectedModule = ko.observable();
        self.userList = ko.observableArray([]);
        self.showPartyValidateComponent = ko.observable(false);
        self.casaTransactionList = ko.observable([]);
        self.tdTransactionList = ko.observable([]);
        self.loanTransactionList = ko.observable([]);
        self.totalTransactionList = ko.observableArray();
        self.summarydataSource = ko.observableArray();
        self.loadSummaryTable = ko.observable(false);
        self.isPreferenceExist = ko.observable(false);
        self.isLoaded = ko.observable(false);
        self.casaFullResourceTaskList([]);
        self.tdFullResourceTaskList([]);
        self.loanFullResourceTaskList([]);
        self.fullPartiesCasaAccountList = ko.observableArray();
        self.fullPartiesLoanAccountList = ko.observableArray();
        self.fullPartiesTDAccountList = ko.observableArray();
        self.loadUserListComponent = ko.observable(false);
        self.selectedUserData = ko.observable();
        self.editBackFromReview = ko.observable(false);
        rootParams.baseModel.registerComponent("user-list-details", "common");
        self.isDataRecieved = ko.observable(false);
        self.tableHeading = ko.observable(self.nls.headers.ownAccount);
        self.linkedpartyName = ko.observable();
        self.linkedPartyId = ko.observable();
        self.linkagetableHeading = ko.observable(self.nls.headers.linkedpartyAccount);
        self.indexSelected = ko.observable();
        self.isLinkageExist = ko.observable(false);
        self.partySetUpNotExists = ko.observable(false);
        self.parentChannelAccessNotExists = ko.observable(false);
        self.parentAccessLevel = ko.observable();
        self.tableHeading().toUpperCase();
        self.linkagetableHeading().toUpperCase();
        self.isCorpAdmin = ko.observable(false);
        if (self.accessLevel() === "PARTY" || self.accessLevel() === "LINKAGE") {
            rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, { user: self.nls.navLabels.PartyLevel_title }));
        } else if (self.accessLevel() === "USER" || self.accessLevel() === "USERLINKAGE") {
            rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, { user: self.nls.navLabels.UserLevel_title }));
        }
        var getNewKoModel = function () {
            var KoModel = ExclusionModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.ExclusionModelInstance = ko.observable(getNewKoModel());
        var partyId = {};
        partyId.value = rootParams.dashboard.userData.userProfile.partyId.value;
        partyId.displayValue = rootParams.dashboard.userData.userProfile.partyId.displayValue;
        var roles = rootParams.dashboard.userData.userProfile.roles;
        var userProfile = {};
        userProfile.firstName = rootParams.dashboard.userData.userProfile.firstName;
        var isCorpAdmin = false;
        if (roles) {
            for (var i = 0; i < roles.length; i++) {
                if (roles[i] === "CorporateAdminMaker" || roles[i] === "CorporateAdminViewer" || roles[i] === "CorporateAdminChecker") {
                    isCorpAdmin = true;
                    break;
                } else {
                    isCorpAdmin = false;
                }
            }
        }
        if (isCorpAdmin) {
            self.isCorpAdmin(true);
            ExclusionModel.fetchCorpAdminPartyDetails().done(function (data) {
                self.ExclusionModelInstance().partyDetails.partyName(data.party.personalDetails.fullName);
                self.ExclusionModelInstance().partyDetails.party.value(partyId.value);
                self.ExclusionModelInstance().partyDetails.party.displayValue(partyId.displayValue);
                self.ExclusionModelInstance().partyDetails.partyDetailsFetched(true);
                self.showPartyValidateComponent(false);
                location.hash = "#summary";
            });
        } else {
            self.showPartyValidateComponent(true);
            self.isCorpAdmin(false);
        }
        if (rootParams.rootModel.partyID()) {
            self.ExclusionModelInstance().partyDetails.party.value(rootParams.rootModel.partyID());
            self.ExclusionModelInstance().partyDetails.party.displayValue(rootParams.rootModel.maskedPartyId());
            self.ExclusionModelInstance().partyDetails.partyName(rootParams.rootModel.partyName());
            self.showPartyValidateComponent(false);
        }
        self.selectedUserData.subscribe(function (selectedUserData) {
            self.showUserAccountAccess(selectedUserData);
        });
        self.ExclusionModelInstance().partyDetails.party.value.subscribe(function (updatedPartyID) {
            if (updatedPartyID === null || updatedPartyID === undefined || updatedPartyID === "") {
                self.partyID("");
                self.partyName("");
                self.summarydataSource([]);
                self.showAccountAccess(false);
                self.userListLoaded(false);
            } else {
                self.selectedAccountsResources([]);
                self.partyID(self.ExclusionModelInstance().partyDetails.party.value());
                self.maskedPartyId(self.ExclusionModelInstance().partyDetails.party.displayValue());
                self.partyName(self.ExclusionModelInstance().partyDetails.partyName());
                if (self.accessLevel() === "USER") {
                    rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, { user: self.nls.navLabels.UserLevel_title }));
                    self.loadUserListComponent(false);
                    self.loadUserListComponent(true);
                    location.hash = "userList";
                }
                if (self.accessLevel() === "PARTY" || self.accessLevel() === "LINKAGE") {
                    self.fullCasaAccountList([]);
                    self.fulltdAccountList([]);
                    self.fullloanAccountList([]);
                    self.selectedTdAccounts([]);
                    self.selectedLoanAccounts([]);
                    self.selectedCasaAccounts([]);
                    location.hash = "summary";
                }
            }
        });
        self.getAllAccountsCount = function () {
            if (self.accessLevel() === "PARTY" || self.accessLevel() === "LINKAGE") {
                rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, { user: self.nls.navLabels.PartyLevel_title }));
            } else if (self.accessLevel() === "USER" || self.accessLevel() === "USERLINKAGE") {
                rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, { user: self.nls.navLabels.UserLevel_title }));
            }
            ExclusionModel.readAllAccountDetails(isCorpAdmin ? partyId.value : self.partyID()).done(function (data) {
                self.summarydataSource([]);
                self.parentAccessLevel("PARTY");
                var partyAccounts = data.accounts;
                if (partyAccounts.length > 0) {
                    ko.utils.arrayForEach(partyAccounts, function (partyItem) {
                        self.linkedpartyName("");
                        self.fullCasaAccountList([]);
                        self.fulltdAccountList([]);
                        self.fullloanAccountList([]);
                        self.Loader = false;
                        if (partyItem.setupInformation === "SETUP_EXISTS") {
                            self.isAccessCreated(true);
                            self.showEditableForm(true);
                        } else {
                            self.isAccessCreated(false);
                            self.showEditableForm(false);
                        }
                        if (partyItem.preferenceStatus === "ENABLED") {
                            self.isPreferenceExist(true);
                        } else if (partyItem.preferenceStatus === "NOT_FOUND") {
                            self.isPreferenceExist(false);
                        }
                        if (partyItem.accessLevel === "LINKAGE") {
                            self.isLinkageExist(true);
                            if (partyItem.partyName) {
                                self.linkedpartyName(partyItem.partyName);
                            }
                            self.linkedPartyId(partyItem.party);
                            if (partyItem.preferenceStatus === "DISABLED")
                                self.parentChannelAccessNotExists(true);
                        }
                        self.accessLevel(partyItem.accessLevel);
                        if (partyItem.accountsList) {
                            var casaPayload = [];
                            var tdPayload = [];
                            var loanPayload = [];
                            var x;
                            for (x = 0; x < partyItem.accountsList.length; x++) {
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
                            self.isDataRecieved(true);
                            if (casaPayload) {
                                ko.utils.arrayForEach(casaPayload, function (item) {
                                    self.newCasaObject = {
                                        "accountType": "",
                                        "accountNumber": {
                                            "value": "",
                                            "displayValue": ""
                                        },
                                        "accountStatus": "",
                                        "displayName": "",
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
                                    self.newCasaObject.displayName = item.displayName;
                                    self.newCasaObject.currencyCode = item.currencyCode;
                                    self.newCasaObject.accountStatus = item.accountStatus;
                                    self.resourceListCasa([self.newCasaObject.resourceListCasa]);
                                    self.fullCasaAccountList().push(self.newCasaObject);
                                });
                                self.fullPartiesCasaAccountList().push(self.fullCasaAccountList());
                                self.accountAccessSummaryObject().totalCasaAccts = casaPayload.length;
                                var mappedCasaCount = 0;
                                for (var i = 0; i < casaPayload.length; i++) {
                                    for (var j = 0; j < casaPayload[i].tasks.length; j++) {
                                        for (var y = 0; y < casaPayload[i].tasks[j].childTasks.length; y++) {
                                            if (casaPayload[i].tasks[j].childTasks[y].isAllowed) {
                                                mappedCasaCount++;
                                                j = casaPayload[i].tasks.length;
                                                break;
                                            }
                                        }
                                    }
                                }
                                self.accountAccessSummaryObject().mappedCasaAccts = mappedCasaCount;
                            } else {
                                self.accountAccessSummaryObject().mappedCasaAccts = 0;
                                self.accountAccessSummaryObject().totalCasaAccts = 0;
                            }
                            if (tdPayload) {
                                ko.utils.arrayForEach(tdPayload, function (item) {
                                    self.newTdObject = {
                                        "accountType": "",
                                        "accountNumber": {
                                            "value": "",
                                            "displayValue": ""
                                        },
                                        "accountStatus": "",
                                        "displayName": "",
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
                                    self.newTdObject.displayName = item.displayName;
                                    self.newTdObject.currencyCode = item.currencyCode;
                                    self.newTdObject.accountStatus = item.accountStatus;
                                    self.resourceListTD([self.newTdObject.resourceListTD]);
                                    self.fulltdAccountList().push(self.newTdObject);
                                });
                                self.fullPartiesTDAccountList().push(self.fulltdAccountList());
                                self.accountAccessSummaryObject().totalTrdAccts = tdPayload.length;
                                var mappedtdCount = 0;
                                for (var l = 0; l < tdPayload.length; l++) {
                                    for (var m = 0; m < tdPayload[l].tasks.length; m++) {
                                        for (var n = 0; n < tdPayload[l].tasks[m].childTasks.length; n++) {
                                            if (tdPayload[l].tasks[m].childTasks[n].isAllowed) {
                                                mappedtdCount++;
                                                m = tdPayload[l].tasks.length;
                                                break;
                                            }
                                        }
                                    }
                                }
                                self.accountAccessSummaryObject().mappedTrdAccts = mappedtdCount;
                            } else {
                                self.accountAccessSummaryObject().mappedTrdAccts = 0;
                                self.accountAccessSummaryObject().totalTrdAccts = 0;
                            }
                            if (loanPayload) {
                                ko.utils.arrayForEach(loanPayload, function (item) {
                                    self.newLoanObject = {
                                        "accountType": "",
                                        "accountNumber": {
                                            "value": "",
                                            "displayValue": ""
                                        },
                                        "accountStatus": "",
                                        "displayName": "",
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
                                    self.newLoanObject.displayName = item.displayName;
                                    self.newLoanObject.currencyCode = item.currencyCode;
                                    self.newLoanObject.accountStatus = item.accountStatus;
                                    self.resourceListLON([self.newLoanObject.resourceListLON]);
                                    self.fullloanAccountList().push(self.newLoanObject);
                                });
                                self.fullPartiesLoanAccountList().push(self.fullloanAccountList());
                                self.accountAccessSummaryObject().totalLonAccts = loanPayload.length;
                                var mappedLonCount = 0;
                                for (x = 0; x < loanPayload.length; x++) {
                                    for (var a = 0; a < loanPayload[x].tasks.length; a++) {
                                        for (var z = 0; z < loanPayload[x].tasks[a].childTasks.length; z++) {
                                            if (loanPayload[x].tasks[a].childTasks[z].isAllowed) {
                                                mappedLonCount++;
                                                a = loanPayload[x].tasks.length;
                                                break;
                                            }
                                        }
                                    }
                                }
                                self.accountAccessSummaryObject().mappedLonAccts = mappedLonCount;
                            } else {
                                self.accountAccessSummaryObject().mappedLonAccts = 0;
                                self.accountAccessSummaryObject().totalLonAccts = 0;
                            }
                            var totalMappedAccts = self.accountAccessSummaryObject().mappedLonAccts + self.accountAccessSummaryObject().mappedTrdAccts + self.accountAccessSummaryObject().mappedCasaAccts;
                            self.mappedAccts(totalMappedAccts);
                        } else {
                            self.isDataRecieved(false);
                            self.fullPartiesCasaAccountList().push(self.fullCasaAccountList());
                            self.fullPartiesLoanAccountList().push(self.fullloanAccountList());
                            self.fullPartiesTDAccountList().push(self.fulltdAccountList());
                        }
                        self.createDataSource();
                    });
                }
            }).fail(function () {
                self.isDataRecieved(false);
                self.back();
            });
        };
        self.getAllUsersList = function () {
            rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, { user: self.nls.navLabels.UserLevel_title }));
            ExclusionModel.fetchAssociatedUserForParty(isCorpAdmin ? partyId.value : self.partyID()).done(function (data) {
                self.userList(data.userDTOList);
                self.accessCreatedUserList = ko.observableArray();
                self.nonAccessCreatedUserList = ko.observableArray();
                ko.utils.arrayForEach(self.userList(), function (item) {
                    if (item.isAccountAccessSetup === true) {
                        self.accessCreatedUserList().push(item);
                    } else {
                        self.nonAccessCreatedUserList().push(item);
                    }
                });
                self.accessCreatedUserList.sort(function (left, right) {
                    return left.username === right.username ? 0 : left.username < right.username ? -1 : 1;
                });
                self.nonAccessCreatedUserList.sort(function (left, right) {
                    return left.username === right.username ? 0 : left.username < right.username ? -1 : 1;
                });
                self.userList([]);
                ko.utils.arrayForEach(self.accessCreatedUserList(), function (item) {
                    self.userList().push(item);
                });
                ko.utils.arrayForEach(self.nonAccessCreatedUserList(), function (item) {
                    self.userList().push(item);
                });
                self.userListLoaded(true);
            });
        };
        self.loadAccountMappingComponent = function (index, linkedpartyName, linkedPartyId, isAccessCreated, showEditableForm, accessLevel) {
            self.linkedpartyName(linkedpartyName);
            self.linkedPartyId(linkedPartyId);
            self.isAccessCreated(isAccessCreated);
            self.showEditableForm(showEditableForm);
            self.accessLevel(accessLevel);
            self.fullCasaAccountList(self.fullPartiesCasaAccountList()[index]);
            self.fulltdAccountList(self.fullPartiesTDAccountList()[index]);
            self.fullloanAccountList(self.fullPartiesLoanAccountList()[index]);
            self.indexSelected(index);
            self.selectedCasaAccounts.removeAll();
            self.selectedTdAccounts.removeAll();
            self.selectedLoanAccounts.removeAll();
            if (accessLevel === "PARTY") {
                var params = { isCorpAdmin: isCorpAdmin };
                rootParams.dashboard.loadComponent("party-access-exclusion", params, self);
            } else if (accessLevel === "USER") {
                rootParams.dashboard.loadComponent("user-access-exclusion", {}, self);
            } else if (accessLevel === "LINKAGE") {
                rootParams.dashboard.loadComponent("linked-party-access-exclusion", {}, self);
            } else if (accessLevel === "USERLINKAGE") {
                rootParams.dashboard.loadComponent("linked-user-access-exclusion", {}, self);
            }
        };
        self.loadCasaModule = function (index, linkedpartyName, linkedPartyId, isAccessCreated, showEditableForm, accessLevel) {
            self.selectedModule("CASA");
            self.loadAccountMappingComponent(index, linkedpartyName, linkedPartyId, isAccessCreated, showEditableForm, accessLevel);
        };
        self.loadLoansModule = function (index, linkedpartyName, linkedPartyId, isAccessCreated, showEditableForm, accessLevel) {
            self.selectedModule("LON");
            self.loadAccountMappingComponent(index, linkedpartyName, linkedPartyId, isAccessCreated, showEditableForm, accessLevel);
        };
        self.loadTdModule = function (index, linkedpartyName, linkedPartyId, isAccessCreated, showEditableForm, accessLevel) {
            self.selectedModule("TRD");
            self.loadAccountMappingComponent(index, linkedpartyName, linkedPartyId, isAccessCreated, showEditableForm, accessLevel);
        };
        self.checkAccountAccessForUser = function (selecteduserId) {
            ExclusionModel.readAllUserAccountDetails(isCorpAdmin ? partyId.value : self.partyID(), selecteduserId).done(function (data) {
                self.summarydataSource([]);
                self.parentAccessLevel("USER");
                var userAccounts = data.accounts;
                if (userAccounts.length > 0) {
                    ko.utils.arrayForEach(userAccounts, function (partyItem) {
                        self.linkedpartyName("");
                        self.fullCasaAccountList([]);
                        self.fulltdAccountList([]);
                        self.fullloanAccountList([]);
                        self.isAccessCreated(false);
                        self.showEditableForm(false);
                        self.partySetUpNotExists(false);
                        self.Loader = false;
                        if (partyItem.setupInformation === "SETUP_EXISTS") {
                            self.isAccessCreated(true);
                            self.showEditableForm(true);
                            self.partySetUpNotExists(false);
                        } else if (partyItem.setupInformation === "SETUP_NOT_CREATED") {
                            self.isAccessCreated(false);
                            self.showEditableForm(false);
                            self.partySetUpNotExists(false);
                        } else if (partyItem.setupInformation === "PARTY_SETUP_MISSING") {
                            self.partySetUpNotExists(true);
                            self.isAccessCreated(false);
                            self.showEditableForm(false);
                        }
                        if (partyItem.preferenceStatus === "ENABLED") {
                            self.isPreferenceExist(true);
                        } else if (partyItem.preferenceStatus === "NOT_FOUND") {
                            self.isPreferenceExist(false);
                        }
                        self.accessLevel(partyItem.accessLevel);
                        if (partyItem.accessLevel === "USERLINKAGE") {
                            self.isLinkageExist(true);
                            if (partyItem.partyName) {
                                self.linkedpartyName(partyItem.partyName);
                            }
                            self.linkedPartyId(partyItem.party);
                            if (partyItem.preferenceStatus === "DISABLED")
                                self.parentChannelAccessNotExists(true);
                        }
                        if (partyItem.accountsList) {
                            var casaPayload = [];
                            var tdPayload = [];
                            var loanPayload = [];
                            var x;
                            for (x = 0; x < partyItem.accountsList.length; x++) {
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
                            self.isDataRecieved(true);
                            if (casaPayload) {
                                ko.utils.arrayForEach(casaPayload, function (item) {
                                    self.newCasaObject = {
                                        "accountType": "",
                                        "accountNumber": {
                                            "value": "",
                                            "displayValue": ""
                                        },
                                        "accountStatus": "",
                                        "displayName": "",
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
                                    self.newCasaObject.displayName = item.displayName;
                                    self.newCasaObject.currencyCode = item.currencyCode;
                                    self.newCasaObject.accountStatus = item.accountStatus;
                                    self.resourceListCasa([self.newCasaObject.resourceListCasa]);
                                    self.fullCasaAccountList().push(self.newCasaObject);
                                });
                                self.fullPartiesCasaAccountList().push(self.fullCasaAccountList());
                                self.accountAccessSummaryObject().totalCasaAccts = casaPayload.length;
                                var mappedCasaCount = 0;
                                for (var i = 0; i < casaPayload.length; i++) {
                                    for (var j = 0; j < casaPayload[i].tasks.length; j++) {
                                        for (var y = 0; y < casaPayload[i].tasks[j].childTasks.length; y++) {
                                            if (casaPayload[i].tasks[j].childTasks[y].isAllowed) {
                                                mappedCasaCount++;
                                                j = casaPayload[i].tasks.length;
                                                break;
                                            }
                                        }
                                    }
                                }
                                self.accountAccessSummaryObject().mappedCasaAccts = mappedCasaCount;
                            } else {
                                self.accountAccessSummaryObject().mappedCasaAccts = 0;
                                self.accountAccessSummaryObject().totalCasaAccts = 0;
                            }
                            if (tdPayload) {
                                ko.utils.arrayForEach(tdPayload, function (item) {
                                    self.newTdObject = {
                                        "accountType": "",
                                        "accountNumber": {
                                            "value": "",
                                            "displayValue": ""
                                        },
                                        "accountStatus": "",
                                        "displayName": "",
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
                                    self.newTdObject.displayName = item.displayName;
                                    self.newTdObject.currencyCode = item.currencyCode;
                                    self.newTdObject.accountStatus = item.accountStatus;
                                    self.resourceListTD([self.newTdObject.resourceListTD]);
                                    self.fulltdAccountList().push(self.newTdObject);
                                });
                                self.fullPartiesTDAccountList().push(self.fulltdAccountList());
                                self.accountAccessSummaryObject().totalTrdAccts = tdPayload.length;
                                var mappedtdCount = 0;
                                for (var l = 0; l < tdPayload.length; l++) {
                                    for (var m = 0; m < tdPayload[l].tasks.length; m++) {
                                        for (var n = 0; n < tdPayload[l].tasks[m].childTasks.length; n++) {
                                            if (tdPayload[l].tasks[m].childTasks[n].isAllowed) {
                                                mappedtdCount++;
                                                m = tdPayload[l].tasks.length;
                                                break;
                                            }
                                        }
                                    }
                                }
                                self.accountAccessSummaryObject().mappedTrdAccts = mappedtdCount;
                            } else {
                                self.accountAccessSummaryObject().mappedTrdAccts = 0;
                                self.accountAccessSummaryObject().totalTrdAccts = 0;
                            }
                            if (loanPayload) {
                                ko.utils.arrayForEach(loanPayload, function (item) {
                                    self.newLoanObject = {
                                        "accountType": "",
                                        "accountNumber": {
                                            "value": "",
                                            "displayValue": ""
                                        },
                                        "accountStatus": "",
                                        "displayName": "",
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
                                    self.newLoanObject.displayName = item.displayName;
                                    self.newLoanObject.currencyCode = item.currencyCode;
                                    self.newLoanObject.accountStatus = item.accountStatus;
                                    self.resourceListLON([self.newLoanObject.resourceListLON]);
                                    self.fullloanAccountList().push(self.newLoanObject);
                                });
                                self.fullPartiesLoanAccountList().push(self.fullloanAccountList());
                                self.accountAccessSummaryObject().totalLonAccts = loanPayload.length;
                                var mappedLonCount = 0;
                                for (x = 0; x < loanPayload.length; x++) {
                                    for (var a = 0; a < loanPayload[x].tasks.length; a++) {
                                        for (var z = 0; z < loanPayload[x].tasks[a].childTasks.length; z++) {
                                            if (loanPayload[x].tasks[a].childTasks[z].isAllowed) {
                                                mappedLonCount++;
                                                a = loanPayload[x].tasks.length;
                                                break;
                                            }
                                        }
                                    }
                                }
                                self.accountAccessSummaryObject().mappedLonAccts = mappedLonCount;
                            } else {
                                self.accountAccessSummaryObject().mappedLonAccts = 0;
                                self.accountAccessSummaryObject().totalLonAccts = 0;
                            }
                            var totalMappedAccts = self.accountAccessSummaryObject().mappedLonAccts + self.accountAccessSummaryObject().mappedTrdAccts + self.accountAccessSummaryObject().mappedCasaAccts;
                            self.mappedAccts(totalMappedAccts);
                        } else {
                            self.isDataRecieved(false);
                        }
                        self.createDataSource();
                    });
                }
            });
        };
        self.showUserAccountAccess = function (data) {
            if (data) {
                location.hash = "userlist#summary";
                self.showPartyValidateComponent(false);
                self.selectedUserId(data.username);
                self.selectedUserName(rootParams.baseModel.format(self.nls.generic.common.name, {
                    firstName: data.firstName,
                    lastName: data.lastName
                }));
            }
        };
        function checkHash() {
            if (location.hash === "#partyDetails") {
                self.showAccountAccess(false);
                self.isAccessCreated(false);
                self.userListLoaded(false);
                self.showPartyValidateComponent(true);
            }
            if (location.hash === "#userList") {
                self.loadUserListComponent(true);
                self.selectedUserId(null);
                self.showAccountAccess(false);
                self.isDataRecieved(false);
                self.summarydataSource([]);
                self.loadSummaryTable(false);
                rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, { user: self.nls.navLabels.UserLevel_title }));
            }
            if (location.hash === "#summary") {
                if (self.partyID())
                    self.getAllAccountsCount();
                self.showAccountAccess(true);
            }
            if (location.hash === "#userlist#summary") {
                rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, { user: self.nls.navLabels.UserLevel_title }));
                if (self.selectedUserId())
                    self.checkAccountAccessForUser(self.selectedUserId());
                self.loadUserListComponent(false);
                self.showAccountAccess(true);
            }
            if (location.hash === "") {
                self.showAccountAccess(false);
                self.isAccessCreated(false);
                self.loadSummaryTable(false);
                self.userListLoaded(false);
                if (!self.isCorpAdmin()) {
                    self.showPartyValidateComponent(true);
                }
                self.isDataRecieved(false);
                self.cameBack(true);
                self.ExclusionModelInstance().partyDetails.party.value("");
                self.ExclusionModelInstance().partyDetails.partyName("");
                self.ExclusionModelInstance().partyDetails.partyDetailsFetched(false);
            }
        }
        $(window).on("hashchange", function () {
            checkHash();
        });
        checkHash();
        self.placeInitials = function (firstName, lastName) {
            var initial = firstName.charAt(0) + lastName.charAt(0);
            return initial.toUpperCase();
        };
        self.back = function () {
            self.showAccountAccess(false);
            self.showPartyValidateComponent(true);
            self.fullCasaAccountList([]);
            self.fulltdAccountList([]);
            self.fullloanAccountList([]);
            self.fullPartiesCasaAccountList([]);
            self.fullPartiesTDAccountList([]);
            self.fullPartiesLoanAccountList([]);
            self.loadSummaryTable(false);
            self.loadUserListComponent(false);
            location.hash = "";
            self.ExclusionModelInstance().partyDetails.partyDetailsFetched(false);
            self.ExclusionModelInstance().partyDetails.party.value("");
            self.ExclusionModelInstance().partyDetails.partyName("");
            self.ExclusionModelInstance().partyDetails.additionalDetails("");
            self.isDataRecieved(false);
            if (self.accessLevel() === "PARTY" || self.accessLevel() === "LINKAGE") {
                rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, { user: self.nls.navLabels.PartyLevel_title }));
            } else if (self.accessLevel() === "USER" || self.accessLevel() === "USERLINKAGE") {
                rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, { user: self.nls.navLabels.UserLevel_title }));
            }
        };
        self.createDataSource = function () {
            var summaryData = [
                {
                    id: "CSA",
                    accountType: self.nls.fieldname.casaMapping,
                    isPreferenceExist: self.isPreferenceExist(),
                    totalAccts: self.accountAccessSummaryObject().totalCasaAccts,
                    mappedAccts: self.accountAccessSummaryObject().mappedCasaAccts
                },
                {
                    id: "TD",
                    accountType: self.nls.fieldname.tdMapping,
                    isPreferenceExist: self.isPreferenceExist(),
                    totalAccts: self.accountAccessSummaryObject().totalTrdAccts,
                    mappedAccts: self.accountAccessSummaryObject().mappedTrdAccts
                },
                {
                    id: "LON",
                    accountType: self.nls.fieldname.loansMapping,
                    totalAccts: self.accountAccessSummaryObject().totalLonAccts,
                    mappedAccts: self.accountAccessSummaryObject().mappedLonAccts
                }
            ];
            self.mappingSummary = new oj.ArrayTableDataSource(summaryData, { idAttribute: "id" });
            self.summarydataSource().push({
                dataSource: self.mappingSummary,
                isPreferenceExist: self.isPreferenceExist(),
                isAccessCreated: self.isAccessCreated(),
                totalMappedAccts: self.mappedAccts(),
                linkedPartyName: self.linkedpartyName(),
                linkedPartyId: self.linkedPartyId(),
                accessLevel: self.accessLevel(),
                showEditableForm: self.showEditableForm(),
                partySetUpNotExists: self.partySetUpNotExists(),
                parentAccessLevel: self.parentAccessLevel(),
                parentChannelAccessNotExists: self.parentChannelAccessNotExists()
            });
            self.loadSummaryTable(true);
        };
        self.goBack = function () {
            self.fullCasaAccountList([]);
            self.fulltdAccountList([]);
            self.fullloanAccountList([]);
            self.selectedTdAccounts([]);
            self.selectedLoanAccounts([]);
            self.selectedCasaAccounts([]);
            self.fullPartiesCasaAccountList([]);
            self.fullPartiesTDAccountList([]);
            self.fullPartiesLoanAccountList([]);
            if (self.accessLevel() === "PARTY" || self.accessLevel() === "LINKAGE")
                rootParams.dashboard.loadComponent("access-management-base", {}, self);
            else
                rootParams.dashboard.hideDetails();
        };
        self.onRowClicked = function (index, linkedpartyName, linkedPartyId, isAccessCreated, showEditableForm, accessLevel, event) {
            if (event.id === "CSA") {
                self.loadCasaModule(index, linkedpartyName, linkedPartyId, isAccessCreated, showEditableForm, accessLevel);
            } else if (event.id === "TD") {
                self.loadTdModule(index, linkedpartyName, linkedPartyId, isAccessCreated, showEditableForm, accessLevel);
            } else if (event.id === "LON") {
                self.loadLoansModule(index, linkedpartyName, linkedPartyId, isAccessCreated, showEditableForm, accessLevel);
            }
        };
    };
});
