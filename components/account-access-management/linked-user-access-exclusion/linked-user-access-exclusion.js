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
    "ojs/ojselectcombobox"
], function (oj, ko, $, ExclusionModel, BaseLogger, constants, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.party = rootParams.rootModel.ExclusionModelInstance().partyDetails.party;
        self.fullCasaAccountList(self.fullPartiesCasaAccountList()[self.indexSelected()]);
        self.fulltdAccountList(self.fullPartiesTDAccountList()[self.indexSelected()]);
        self.fullloanAccountList(self.fullPartiesLoanAccountList()[self.indexSelected()]);
        self.relatedPartyId = ko.observable(rootParams.rootModel.linkedPartyId());
        self.relatedPartyName = ko.observable(rootParams.rootModel.linkedpartyName());
        self.transactionName(self.nls.headers.userAcctSetupTransactionName);
        if (rootParams.rootModel.isTDAllowed() === undefined)
            self.isTDAllowed(false);
        else
            self.isTDAllowed(rootParams.rootModel.isTDAllowed());
        if (rootParams.rootModel.isCasaAllowed() === undefined)
            self.isCasaAllowed(false);
        else
            self.isCasaAllowed(rootParams.rootModel.isCasaAllowed());
        if (rootParams.rootModel.isLoanAllowed() === undefined)
            self.isLoanAllowed(false);
        else
            self.isLoanAllowed(rootParams.rootModel.isLoanAllowed());
        self.showConfirmation = ko.observable(false);
        self.showConfirmationForCreate = ko.observable(false);
        self.refreshed = ko.observable(false);
        self.httpStatus = ko.observable();
        self.transactionStatus = ko.observable();
        self.finalPayLoadArray = ko.observableArray();
        self.finalPayload = { linkedUserAccountAccessDTOs: "" };
        var getNewKoModel = function () {
            var KoModel = ExclusionModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rootModelInstance = getNewKoModel();
        self.enableFormToUpdate = function () {
            self.showEditableForm(false);
            self.isAccessCreated(true);
            self.isAccessUpdated(false);
            self.editButtonPressed(true);
        };
        self.casaPayloadExclusionList = ko.observable([]);
        self.getCasaPayload = function () {
            self.casaPayloadExclusionList([]);
            self.casaExclusionAccountNumberList([]);
            self.casaRequestPayload.accountExclusionDTOs = [];
            self.casaRequestPayload.partyId = {
                value: self.party.value(),
                displayValue: self.party.displayValue()
            };
            self.casaRequestPayload.linkedPartyId = {
                value: self.relatedPartyId().value,
                displayValue: self.relatedPartyId().displayValue
            };
            self.casaRequestPayload.userId = self.selectedUserId();
            self.casaRequestPayload.accountType = "CSA";
            self.casaRequestPayload.accessLevel = self.accessLevel();
            self.casaRequestPayload.accessStatus = self.isCasaAllowed();
            if (self.isAccessCreated()) {
                self.casaRequestPayload.accountAccessId = self.casaAccountAccessId();
            } else {
                delete self.casaRequestPayload.accountAccessId;
            }
            var exclusionObject;
            for (var y = 0; y < self.selectedAccountsResources().length; y++) {
                exclusionObject = self.selectedAccountsResources()[y];
                if (exclusionObject.accountType === "CSA") {
                    if (self.isCasaAllowed() === true) {
                        if (exclusionObject.nonSelectedTask && exclusionObject.nonSelectedTask.length > 0) {
                            self.casaExclusionAccountNumberList().push(exclusionObject);
                        }
                    } else {
                        self.casaExclusionAccountNumberList().push(exclusionObject);
                    }
                }
            }
            self.nonSelectedCasaAccounts = ko.observable([]);
            if (self.isCasaAllowed() === true) {
                ko.utils.arrayForEach(self.fullCasaAccountList(), function (item) {
                    if (self.selectedCasaAccounts().indexOf(item.accountNumber.value) === -1) {
                        self.nonSelectedCasaAccounts().push(item.accountNumber.value);
                    }
                });
                ko.utils.arrayForEach(self.casaExclusionAccountNumberList(), function (item) {
                    self.newExclusionArray = {
                        accountNumber: {
                            displayValue: "",
                            value: ""
                        },
                        taskIds: []
                    };
                    self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
                    self.newExclusionArray.accountNumber.value = item.accountNumber.value;
                    self.newExclusionArray.taskIds = item.nonSelectedTask;
                    if (!(self.casaPayloadExclusionList().filter(function (e) {
                            return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
                        }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
                        self.casaPayloadExclusionList().push(self.newExclusionArray);
                    }
                });
                ko.utils.arrayForEach(self.fullCasaAccountList(), function (item) {
                    if (self.nonSelectedCasaAccounts().length > 0 && self.nonSelectedCasaAccounts().indexOf(item.accountNumber.value) !== -1) {
                        for (var a = 0; a < self.nonSelectedCasaAccounts().length; a++) {
                            self.newExclusionArray = {
                                accountNumber: {
                                    displayValue: "",
                                    value: ""
                                },
                                taskIds: []
                            };
                            self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
                            self.newExclusionArray.accountNumber.value = item.accountNumber.value;
                            self.newExclusionArray.taskIds = item.fullResourceTaskList;
                            if (!(self.casaPayloadExclusionList().filter(function (e) {
                                    return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
                                }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
                                self.casaPayloadExclusionList().push(self.newExclusionArray);
                            }
                        }
                    }
                });
            } else {
                ko.utils.arrayForEach(self.casaExclusionAccountNumberList(), function (item) {
                    self.newExclusionArray = {
                        accountNumber: {
                            displayValue: "",
                            value: ""
                        },
                        taskIds: []
                    };
                    if (self.selectedCasaAccounts().length > 0) {
                        if (self.selectedCasaAccounts().indexOf(item.accountNumber.value) !== -1) {
                            self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
                            self.newExclusionArray.accountNumber.value = item.accountNumber.value;
                            self.newExclusionArray.taskIds = item.selectedTask;
                            if (!(self.casaPayloadExclusionList().filter(function (e) {
                                    return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
                                }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
                                self.casaPayloadExclusionList().push(self.newExclusionArray);
                            }
                        }
                    }
                });
            }
            if (self.updatedCASAExclusionNumberList().length > 0) {
                ko.utils.arrayForEach(self.updatedCASAExclusionNumberList(), function (item) {
                    for (var i = 0; i < self.casaPayloadExclusionList().length; i++) {
                        if (self.casaPayloadExclusionList()[i].accountNumber.value === item.accountNumber.value) {
                            self.casaPayloadExclusionList()[i].accountExclusionId = item.accountExclusionId;
                        }
                    }
                });
            }
            for (var j = 0; j < self.casaPayloadExclusionList().length; j++) {
                self.casaRequestPayload.accountExclusionDTOs.push({
                    "accountNumber": self.casaPayloadExclusionList()[j].accountNumber,
                    "accountExclusionId": self.casaPayloadExclusionList()[j].accountExclusionId,
                    "taskIds": self.casaPayloadExclusionList()[j].taskIds
                });
            }
            if (self.isBatchEnable()) {
                var payload = ko.mapping.toJSON(self.casaRequestPayload);
                return payload;
            }
                return self.casaRequestPayload;

        };
        self.tdPayloadExclusionList = ko.observable([]);
        self.getTDPayload = function () {
            self.tdExclusionAccountNumberList([]);
            self.tdPayloadExclusionList([]);
            self.tdRequestPayload.accountExclusionDTOs = [];
            self.tdRequestPayload.partyId = {
                value: self.party.value(),
                displayValue: self.party.displayValue()
            };
            self.tdRequestPayload.linkedPartyId = {
                value: self.relatedPartyId().value,
                displayValue: self.relatedPartyId().displayValue
            };
            self.tdRequestPayload.userId = self.selectedUserId();
            self.tdRequestPayload.accountType = "TRD";
            self.tdRequestPayload.accessLevel = self.accessLevel();
            self.tdRequestPayload.accessStatus = self.isTDAllowed();
            if (self.isAccessCreated()) {
                self.tdRequestPayload.accountAccessId = self.tdAccountAccessId();
            } else {
                delete self.tdRequestPayload.accountAccessId;
            }
            var exclusionObject;
            for (var y = 0; y < self.selectedAccountsResources().length; y++) {
                exclusionObject = self.selectedAccountsResources()[y];
                if (exclusionObject.accountType === "TRD") {
                    if (self.isTDAllowed() === true) {
                        if (exclusionObject.nonSelectedTask && exclusionObject.nonSelectedTask.length > 0) {
                            self.tdExclusionAccountNumberList().push(exclusionObject);
                        }
                    } else {
                        self.tdExclusionAccountNumberList().push(exclusionObject);
                    }
                }
            }
            self.nonSelectedTdAccounts = ko.observable([]);
            if (self.isTDAllowed() === true) {
                ko.utils.arrayForEach(self.fulltdAccountList(), function (item) {
                    if (self.selectedTdAccounts().indexOf(item.accountNumber.value) === -1) {
                        self.nonSelectedTdAccounts().push(item.accountNumber.value);
                    }
                });
                ko.utils.arrayForEach(self.tdExclusionAccountNumberList(), function (item) {
                    self.newExclusionArray = {
                        accountNumber: {
                            displayValue: "",
                            value: ""
                        },
                        taskIds: []
                    };
                    self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
                    self.newExclusionArray.accountNumber.value = item.accountNumber.value;
                    self.newExclusionArray.taskIds = item.nonSelectedTask;
                    if (!(self.tdPayloadExclusionList().filter(function (e) {
                            return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
                        }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
                        self.tdPayloadExclusionList().push(self.newExclusionArray);
                    }
                });
                ko.utils.arrayForEach(self.fulltdAccountList(), function (item) {
                    if (self.nonSelectedTdAccounts().length > 0 && self.nonSelectedTdAccounts().indexOf(item.accountNumber.value) !== -1) {
                        for (var a = 0; a < self.nonSelectedTdAccounts().length; a++) {
                            self.newExclusionArray = {
                                accountNumber: {
                                    displayValue: "",
                                    value: ""
                                },
                                taskIds: []
                            };
                            self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
                            self.newExclusionArray.accountNumber.value = item.accountNumber.value;
                            self.newExclusionArray.taskIds = item.fullResourceTaskList;
                            if (!(self.tdPayloadExclusionList().filter(function (e) {
                                    return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
                                }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
                                self.tdPayloadExclusionList().push(self.newExclusionArray);
                            }
                        }
                    }
                });
            } else {
                ko.utils.arrayForEach(self.tdExclusionAccountNumberList(), function (item) {
                    self.newExclusionArray = {
                        accountNumber: {
                            displayValue: "",
                            value: ""
                        },
                        taskIds: []
                    };
                    if (self.selectedTdAccounts().length > 0) {
                        if (self.selectedTdAccounts().indexOf(item.accountNumber.value) !== -1) {
                            self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
                            self.newExclusionArray.accountNumber.value = item.accountNumber.value;
                            self.newExclusionArray.taskIds = item.selectedTask;
                        }
                        if (!(self.tdPayloadExclusionList().filter(function (e) {
                                return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
                            }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
                            self.tdPayloadExclusionList().push(self.newExclusionArray);
                        }
                    }
                });
            }
            if (self.updatedTDExclusionNumberList().length > 0) {
                ko.utils.arrayForEach(self.updatedTDExclusionNumberList(), function (item) {
                    for (var i = 0; i < self.tdPayloadExclusionList().length; i++) {
                        if (self.tdPayloadExclusionList()[i].accountNumber.value === item.accountNumber.value) {
                            self.tdPayloadExclusionList()[i].accountExclusionId = item.accountExclusionId;
                        }
                    }
                });
            }
            for (var j = 0; j < self.tdPayloadExclusionList().length; j++) {
                self.tdRequestPayload.accountExclusionDTOs.push({
                    "accountNumber": self.tdPayloadExclusionList()[j].accountNumber,
                    "accountExclusionId": self.tdPayloadExclusionList()[j].accountExclusionId,
                    "taskIds": self.tdPayloadExclusionList()[j].taskIds
                });
            }
            if (self.isBatchEnable()) {
                var payload = ko.mapping.toJSON(self.tdRequestPayload);
                return payload;
            }
                return self.tdRequestPayload;

        };
        self.loanPayloadExclusionList = ko.observable([]);
        self.getLoanPayload = function () {
            self.loanPayloadExclusionList([]);
            self.loanExclusionAccountNumberList([]);
            self.loanRequestPayload.accountExclusionDTOs = [];
            self.loanRequestPayload.partyId = {
                value: self.party.value(),
                displayValue: self.party.displayValue()
            };
            self.loanRequestPayload.linkedPartyId = {
                value: self.relatedPartyId().value,
                displayValue: self.relatedPartyId().displayValue
            };
            self.loanRequestPayload.userId = self.selectedUserId();
            self.loanRequestPayload.accountType = "LON";
            self.loanRequestPayload.accessLevel = self.accessLevel();
            self.loanRequestPayload.accessStatus = self.isLoanAllowed();
            if (self.isAccessCreated()) {
                self.loanRequestPayload.accountAccessId = self.loanAccountAccessId();
            } else {
                delete self.loanRequestPayload.accountAccessId;
            }
            var exclusionObject;
            for (var y = 0; y < self.selectedAccountsResources().length; y++) {
                exclusionObject = self.selectedAccountsResources()[y];
                if (exclusionObject.accountType === "LON") {
                    if (self.isLoanAllowed() === true) {
                        if (exclusionObject.nonSelectedTask && exclusionObject.nonSelectedTask.length > 0) {
                            self.loanExclusionAccountNumberList().push(exclusionObject);
                        }
                    } else {
                        self.loanExclusionAccountNumberList().push(exclusionObject);
                    }
                }
            }
            self.nonSelectedLoanAccounts = ko.observable([]);
            if (self.isLoanAllowed() === true) {
                ko.utils.arrayForEach(self.fullloanAccountList(), function (item) {
                    if (self.selectedLoanAccounts().indexOf(item.accountNumber.value) === -1) {
                        self.nonSelectedLoanAccounts().push(item.accountNumber.value);
                    }
                });
                ko.utils.arrayForEach(self.loanExclusionAccountNumberList(), function (item) {
                    self.newExclusionArray = {
                        accountNumber: {
                            displayValue: "",
                            value: ""
                        },
                        taskIds: []
                    };
                    self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
                    self.newExclusionArray.accountNumber.value = item.accountNumber.value;
                    self.newExclusionArray.taskIds = item.nonSelectedTask;
                    if (!(self.loanPayloadExclusionList().filter(function (e) {
                            return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
                        }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
                        self.loanPayloadExclusionList().push(self.newExclusionArray);
                    }
                });
                ko.utils.arrayForEach(self.fullloanAccountList(), function (item) {
                    if (self.nonSelectedLoanAccounts().length > 0 && self.nonSelectedLoanAccounts().indexOf(item.accountNumber.value) !== -1) {
                        for (var a = 0; a < self.nonSelectedLoanAccounts().length; a++) {
                            self.newExclusionArray = {
                                accountNumber: {
                                    displayValue: "",
                                    value: ""
                                },
                                taskIds: []
                            };
                            self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
                            self.newExclusionArray.accountNumber.value = item.accountNumber.value;
                            self.newExclusionArray.taskIds = item.fullResourceTaskList;
                            if (!(self.loanPayloadExclusionList().filter(function (e) {
                                    return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
                                }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
                                self.loanPayloadExclusionList().push(self.newExclusionArray);
                            }
                        }
                    }
                });
            } else {
                ko.utils.arrayForEach(self.loanExclusionAccountNumberList(), function (item) {
                    self.newExclusionArray = {
                        accountNumber: {
                            displayValue: "",
                            value: ""
                        },
                        taskIds: []
                    };
                    if (self.selectedLoanAccounts().length > 0) {
                        if (self.selectedLoanAccounts().indexOf(item.accountNumber.value) !== -1) {
                            self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
                            self.newExclusionArray.accountNumber.value = item.accountNumber.value;
                            self.newExclusionArray.taskIds = item.selectedTask;
                        }
                        if (!(self.loanPayloadExclusionList().filter(function (e) {
                                return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
                            }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
                            self.loanPayloadExclusionList().push(self.newExclusionArray);
                        }
                    }
                });
            }
            if (self.updatedLOANExclusionNumberList().length > 0) {
                ko.utils.arrayForEach(self.updatedLOANExclusionNumberList(), function (item) {
                    for (var i = 0; i < self.loanPayloadExclusionList().length; i++) {
                        if (self.loanPayloadExclusionList()[i].accountNumber.value === item.accountNumber.value) {
                            self.loanPayloadExclusionList()[i].accountExclusionId = item.accountExclusionId;
                        }
                    }
                });
            }
            for (var j = 0; j < self.loanPayloadExclusionList().length; j++) {
                self.loanRequestPayload.accountExclusionDTOs.push({
                    "accountNumber": self.loanPayloadExclusionList()[j].accountNumber,
                    "accountExclusionId": self.loanPayloadExclusionList()[j].accountExclusionId,
                    "taskIds": self.loanPayloadExclusionList()[j].taskIds
                });
            }
            if (self.isBatchEnable()) {
                var payload = ko.mapping.toJSON(self.loanRequestPayload);
                return payload;
            }
                return self.loanRequestPayload;

        };
        self.createAccess = function () {
            self.casaExclusionAccountNumberList([]);
            self.tdExclusionAccountNumberList([]);
            self.loanExclusionAccountNumberList([]);
            self.updatedCASAExclusionNumberList([]);
            self.updatedTDExclusionNumberList([]);
            self.updatedLOANExclusionNumberList([]);
            self.fullCasaAccountList(self.fullPartiesCasaAccountList()[self.indexSelected()]);
            self.fulltdAccountList(self.fullPartiesTDAccountList()[self.indexSelected()]);
            self.fullloanAccountList(self.fullPartiesLoanAccountList()[self.indexSelected()]);
            if ([
                    self.selectedCasaPolicy(),
                    self.selectedTdPolicy(),
                    self.selectedLoanPolicy()
                ].includes(null) || [
                    self.selectedCasaPolicy(),
                    self.selectedTdPolicy(),
                    self.selectedLoanPolicy()
                ].includes(undefined)) {
                rootParams.baseModel.showMessages(null, [self.nls.info.accountTransactionSetup], "INFO");
            } else {
                self.finalPayLoadArray.push(self.getCasaPayload());
                self.finalPayLoadArray.push(self.getLoanPayload());
                self.finalPayLoadArray.push(self.getTDPayload());
                self.finalPayload.linkedUserAccountAccessDTOs = self.finalPayLoadArray();
                ExclusionModel.createAccessClone(ko.toJSON(self.finalPayload), self.selectedUserId()).done(function (data, status, jqXhr) {
                    self.showDeleteButton(true);
                    self.isAccessCreated(true);
                    self.showEditableForm(true);
                    self.httpStatus(jqXhr.status);
                    self.transactionStatus(data.status);
                    self.showConfirmationForCreate(true);
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.transactionName()
                    }, self);
                });
            }
        };
        self.updateAccess = function () {
            self.fullCasaAccountList(self.fullPartiesCasaAccountList()[self.indexSelected()]);
            self.fulltdAccountList(self.fullPartiesTDAccountList()[self.indexSelected()]);
            self.fullloanAccountList(self.fullPartiesLoanAccountList()[self.indexSelected()]);
            self.finalPayLoadArray.push(self.getCasaPayload());
            self.finalPayLoadArray.push(self.getLoanPayload());
            self.finalPayLoadArray.push(self.getTDPayload());
            self.finalPayload.linkedUserAccountAccessDTOs = self.finalPayLoadArray();
            ExclusionModel.updateAccessClone(ko.toJSON(self.finalPayload), self.selectedUserId()).done(function (data, status, jqXhr) {
                self.isAccessUpdated(true);
                self.httpStatus(jqXhr.status);
                self.transactionStatus(data);
                self.showConfirmation(true);
                self.readAccess();
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName()
                }, self);
            });
        };
        function accountTypeCSA() {
            if (self.isCasaAllowed()) {
                ko.utils.arrayForEach(self.fullCasaAccountList(), function (item) {
                    if (self.casaAccountNumbersArray().indexOf(item.accountNumber.value) > -1) {
                        for (var i = 0; i < self.updatedCASAExclusionNumberList().length; i++) {
                            if (self.updatedCASAExclusionNumberList()[i].accountNumber.value === item.accountNumber.value && item.fullResourceTaskList.length !== self.updatedCASAExclusionNumberList()[i].taskIds.length) {
                                self.selectedCasaAccounts.push(item.accountNumber.value);
                            }
                        }
                    } else {
                        self.selectedCasaAccounts.push(item.accountNumber.value);
                    }
                });
            } else {
                ko.utils.arrayForEach(self.updatedCASAExclusionNumberList(), function (item) {
                    self.selectedCasaAccounts.push(item.accountNumber.value);
                });
            }
        }
        function accountTypeTRD() {
            if (self.isTDAllowed()) {
                ko.utils.arrayForEach(self.fulltdAccountList(), function (item) {
                    if (self.tdAccountNumbersArray().indexOf(item.accountNumber.value) > -1) {
                        for (var i = 0; i < self.updatedTDExclusionNumberList().length; i++) {
                            if (self.updatedTDExclusionNumberList()[i].accountNumber.value === item.accountNumber.value && item.fullResourceTaskList.length !== self.updatedTDExclusionNumberList()[i].taskIds.length) {
                                self.selectedTdAccounts.push(item.accountNumber.value);
                            }
                        }
                    } else {
                        self.selectedTdAccounts.push(item.accountNumber.value);
                    }
                });
            } else {
                ko.utils.arrayForEach(self.updatedTDExclusionNumberList(), function (item) {
                    self.selectedTdAccounts.push(item.accountNumber.value);
                });
            }
        }
        function accountTypeLON() {
            if (self.isLoanAllowed()) {
                ko.utils.arrayForEach(self.fullloanAccountList(), function (item) {
                    if (self.loanAccountNumbersArray().indexOf(item.accountNumber.value) > -1) {
                        for (var i = 0; i < self.updatedLOANExclusionNumberList().length; i++) {
                            if (self.updatedLOANExclusionNumberList()[i].accountNumber.value === item.accountNumber.value && item.fullResourceTaskList.length !== self.updatedLOANExclusionNumberList()[i].taskIds.length) {
                                self.selectedLoanAccounts.push(item.accountNumber.value);
                            }
                        }
                    } else {
                        self.selectedLoanAccounts.push(item.accountNumber.value);
                    }
                });
            } else {
                ko.utils.arrayForEach(self.updatedLOANExclusionNumberList(), function (item) {
                    self.selectedLoanAccounts.push(item.accountNumber.value);
                });
            }
        }
        self.readAccess = function () {
            self.casaExclusionAccountNumberList([]);
            self.tdExclusionAccountNumberList([]);
            self.loanExclusionAccountNumberList([]);
            self.updatedCASAExclusionNumberList([]);
            self.updatedTDExclusionNumberList([]);
            self.updatedLOANExclusionNumberList([]);
            ExclusionModel.readAccess(self.selectedUserId(), self.relatedPartyId().value, self.party.value()).done(function (data) {
                self.showModuleToMap(true);
                if (data.linkedUserAccountAccessDTOs) {
                    for (var i = 0; i < data.linkedUserAccountAccessDTOs.length; i++) {
                        if (data.linkedUserAccountAccessDTOs[i].accountType === "CSA") {
                            self.isCasaAllowed(data.linkedUserAccountAccessDTOs[i].accessStatus);
                            self.casaAccountAccessId(data.linkedUserAccountAccessDTOs[i].accountAccessId);
                            self.updatedCASAExclusionNumberList(data.linkedUserAccountAccessDTOs[i].accountExclusionDTOs);
                            ko.utils.arrayForEach(self.updatedCASAExclusionNumberList(), function (item) {
                                self.casaAccountNumbersArray().push(item.accountNumber.value);
                            });
                            accountTypeCSA();
                        } else if (data.linkedUserAccountAccessDTOs[i].accountType === "TRD") {
                            self.isTDAllowed(data.linkedUserAccountAccessDTOs[i].accessStatus);
                            self.tdAccountAccessId(data.linkedUserAccountAccessDTOs[i].accountAccessId);
                            self.updatedTDExclusionNumberList(data.linkedUserAccountAccessDTOs[i].accountExclusionDTOs);
                            ko.utils.arrayForEach(self.updatedTDExclusionNumberList(), function (item) {
                                self.tdAccountNumbersArray().push(item.accountNumber.value);
                            });
                            accountTypeTRD();
                        } else if (data.linkedUserAccountAccessDTOs[i].accountType === "LON") {
                            self.isLoanAllowed(data.linkedUserAccountAccessDTOs[i].accessStatus);
                            self.loanAccountAccessId(data.linkedUserAccountAccessDTOs[i].accountAccessId);
                            self.updatedLOANExclusionNumberList(data.linkedUserAccountAccessDTOs[i].accountExclusionDTOs);
                            ko.utils.arrayForEach(self.updatedLOANExclusionNumberList(), function (item) {
                                self.loanAccountNumbersArray().push(item.accountNumber.value);
                            });
                            accountTypeLON();
                        }
                    }
                    self.showDeleteButton(true);
                    self.isAccessCreated(true);
                } else {
                    self.showDeleteButton(false);
                    self.isAccessCreated(false);
                }
                self.refreshed(false);
                self.refreshed(true);
            });
        };
        self.deleteAccess = function () {
            self.casaExclusionAccountNumberList([]);
            self.tdExclusionAccountNumberList([]);
            self.loanExclusionAccountNumberList([]);
            self.updatedCASAExclusionNumberList([]);
            self.updatedTDExclusionNumberList([]);
            self.updatedLOANExclusionNumberList([]);
            $("#deleteConfirmationModal").hide();
            self.fullCasaAccountList(self.fullPartiesCasaAccountList()[self.indexSelected()]);
            self.fulltdAccountList(self.fullPartiesTDAccountList()[self.indexSelected()]);
            self.fullloanAccountList(self.fullPartiesLoanAccountList()[self.indexSelected()]);
            self.finalPayLoadArray.push(self.getCasaPayload());
            self.finalPayLoadArray.push(self.getLoanPayload());
            self.finalPayLoadArray.push(self.getTDPayload());
            self.finalPayload.linkedUserAccountAccessDTOs = self.finalPayLoadArray();
            ExclusionModel.deleteAccess(ko.toJSON(self.finalPayload), self.selectedUserId()).done(function (data, status, jqXhr) {
                self.showDeleteButton(true);
                self.httpStatus(jqXhr.status);
                self.transactionStatus(data);
                self.showConfirmationForCreate(true);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName()
                }, self);
            });
        };
        self.payloadChanged = function () {
            ko.utils.arrayForEach(self.updatedCASAExclusionNumberList(), function (item) {
                self.casaTransactionMappedObject = {
                    accountNumber: "",
                    selectedTask: [],
                    accountType: "CSA",
                    nonSelectedTask: []
                };
                self.casaTransactionMappedObject.accountNumber = item.accountNumber.value;
                self.casaTransactionMappedObject.nonSelectedTask = item.taskIds;
                self.selectedAccountsResources().push(self.casaTransactionMappedObject);
            });
            ko.utils.arrayForEach(self.updatedTDExclusionNumberList(), function (item) {
                self.tdTransactionMappedObject = {
                    accountNumber: "",
                    selectedTask: [],
                    accountType: "TRD",
                    nonSelectedTask: []
                };
                self.tdTransactionMappedObject.accountNumber = item.accountNumber.value;
                self.tdTransactionMappedObject.nonSelectedTask = item.taskIds;
                self.selectedAccountsResources().push(self.tdTransactionMappedObject);
            });
            ko.utils.arrayForEach(self.updatedLOANExclusionNumberList(), function (item) {
                self.loanTransactionMappedObject = {
                    accountNumber: "",
                    selectedTask: [],
                    accountType: "LON",
                    nonSelectedTask: []
                };
                self.loanTransactionMappedObject.accountNumber = item.accountNumber.value;
                self.loanTransactionMappedObject.nonSelectedTask = item.taskIds;
                self.selectedAccountsResources().push(self.loanTransactionMappedObject);
            });
        };
        self.LoadTransactionMappingComponent = function () {
            self.disableAccountSelection(true);
            rootParams.dashboard.loadComponent("account-transactions-mapping", {}, self);
        };
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
        self.showSavedData = function () {
            self.selectedCasaAccounts(rootParams.rootModel.selectedCasaAccounts());
            self.selectedTdAccounts(rootParams.rootModel.selectedTdAccounts());
            self.selectedLoanAccounts(rootParams.rootModel.selectedLoanAccounts());
            self.isAccessCreated(true);
            self.refreshed(false);
            self.refreshed(true);
            self.isAccessCreated(true);
            self.refreshed(false);
            self.refreshed(true);
        };
        if (self.isAccessCreated() === true) {
            if (self.editBackFromReview())
                self.showSavedData();
            else
                self.readAccess();
        }
        self.backOnEdit = function () {
            self.selectedCasaAccounts([]);
            self.selectedTdAccounts([]);
            self.selectedLoanAccounts([]);
            self.readAccess();
            self.showEditableForm(true);
            self.editButtonPressed(false);
        };
        self.dispose = function () {
            isCasaAllowedSubscription.dispose();
        };
    };
});