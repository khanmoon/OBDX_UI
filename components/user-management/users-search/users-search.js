define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",
    "baseLogger",

    "framework/js/constants/constants",
    "ojL10n!resources/nls/user-management",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation"
], function (oj, ko, UsersSearchModel, $, BaseLogger, constants, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.showOptionRecords = ko.observable(false);
        self.partyId = ko.observable();
        self.partyName = ko.observable();
        self.indirectedParty = ko.observable();
        self.selectedUserType = rootParams.rootModel.selectedUserType;
        rootParams.baseModel.registerComponent("party-name-search", "common");
        rootParams.baseModel.registerElement("modal-window");
        if (self.isCorpAdmin) {
            self.indirectedParty(rootParams.dashboard.userData.userProfile.partyId.value);
        }
        self.validationTracker = ko.observable();
        self.emptyPlaceholder = ko.observable(false);
        self.userListSuccesshandler = function (data) {
            self.user().loadSearchData(false);
            self.user().searchedUserList(data.userDTOList);
            self.isLoading(false);
            self.user().loadSearchData(true);
        };
        self.userListErrorHandler = function (data) {
            var msg = data.responseJSON.message.detail;
            self.user().loadSearchData(false);
            self.user().loadSearchData(true);
            self.isLoading(false);
            rootParams.baseModel.showMessages(null, [msg], "ERROR");
        };
        self.resetForm = function () {
            self.username("reset");
            self.firstName("reset");
            self.lastName("reset");
            self.emailId("reset");
            self.mobileNumber("reset");
            self.partyName("reset");
            self.username("");
            self.firstName("");
            self.lastName("");
            self.emailId("");
            self.mobileNumber("");
            self.partyName("");
            if (!self.isCorpAdmin) {
                self.selectedUserType([]);
                self.userTypeSelectionIdle(true);
                self.indirectedParty("");
                self.partyId("reset");
                self.partyId("");
            }
            self.showOptionRecords(false);
            self.user().loadSearchData(false);
            self.cancelButtonFlag(true);
        };
        self.showOptions = function () {
            self.showOptionRecords(true);
        };
        self.showLessOptions = function () {
            self.showOptionRecords(false);
        };
        self.fetchUsers = function () {
            self.user().showCreateUser(false);
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            if (self.partyId()) {
                UsersSearchModel.fetchDetails(self.partyId()).done(function (data) {
                    if (data.parties.length === 0) {
                        self.user().loadSearchData(false);
                        self.partyId("");
                        rootParams.baseModel.showMessages(null, [self.nls.info.invalidInfo], "ERROR");
                    } else if (data.parties[0] !== null && data.parties[0]) {
                        self.indirectedParty(data.parties[0].id.value);
                        self.fetchUsersList();
                    }
                });
            } else {
                self.fetchUsersList();
            }
        };
        self.fetchUsersList = function () {
            if (self.username() === null || self.username() === undefined) {
                self.username("");
            }
            if (self.firstName() === null || self.firstName() === undefined) {
                self.firstName("");
            }
            if (self.lastName() === null || self.lastName() === undefined) {
                self.lastName("");
            }
            if (self.emailId() === null || self.emailId() === undefined) {
                self.emailId("");
            }
            if (self.mobileNumber() === null || self.mobileNumber() === undefined) {
                self.mobileNumber("");
            }
            if (self.partyId() === null || self.partyId() === undefined) {
                self.partyId("");
            }
            var userParameters = {
                "username": self.username(),
                "firstName": self.firstName(),
                "lastName": self.lastName(),
                "emailId": self.emailId().toLowerCase(),
                "mobileNumber": self.mobileNumber(),
                "partyId": self.indirectedParty(),
                "isAccessSetupCheckRequired": false,
                "userType": self.selectedUserType()
            };
            self.usernamesearched(self.username());
            self.firstNamesearched(self.firstName());
            self.lastNamesearched(self.lastName());
            self.emailIdsearched(self.emailId().toLowerCase());
            self.mobileNumbersearched(self.mobileNumber());
            self.user().loadSearchData(false);
            UsersSearchModel.init();
            if (self.username() !== "" || self.firstName() !== "" || self.lastName() !== "" || self.emailId() !== "" || self.mobileNumber() !== "" || self.partyId() !== "") {
                UsersSearchModel.fetchUsersList(userParameters).done(function (data) {
                    self.user().searchedUserList(data.userDTOList);
                    if (data.userDTOList) {
                        if (data.userDTOList.length > 0) {
                            self.user().loadSearchData(true);
                        } else {
                            rootParams.baseModel.showMessages(null, [self.nls.info.recordNotFound], "ERROR");
                        }
                    } else {
                        rootParams.baseModel.showMessages(null, [self.nls.info.recordNotFound], "ERROR");
                    }
                });
            } else if (self.selectedUserType() === undefined) {
                rootParams.baseModel.showMessages(null, [self.nls.info.noUserType], "ERROR");
            } else {
                rootParams.baseModel.showMessages(null, [self.nls.info.dataRequired], "ERROR");
            }
        };
        self.submitIfEnter = function (data, event) {
            if (event.keyCode === 13) {
                self.fetchUsers();
            }
        };
        self.openCreatePanel = function () {
            self.isLoading(false);
            self.user().showCreateUser(true);
            self.user().searchedUserList([]);
            self.user().loadSearchData(false);
        };
        self.cancel = function () {
            rootParams.dashboard.openDashBoard();
        };
        self.showPartySearch = function () {
            $("#partySearch").trigger("openModal");
        };
    };
});
