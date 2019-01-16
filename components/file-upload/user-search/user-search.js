define([
    "knockout",
    "jquery",
    "ojs/ojcore",
    "./model",

    "ojL10n!resources/nls/user-search",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (ko, $, oj, UserSearchModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle.userSearch;
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("party-validate", "common");
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerComponent("user-map", "file-upload");
        rootParams.dashboard.headerName(self.Nls.userfimap);
        self.datasource = ko.observable();
        self.partyDetails = {
            partyName: null,
            partyId: null,
            partyFirstName: null,
            partyLastName: null,
            party: {
                value: null,
                displayValue: null
            },
            partyDetailsFetched: false
        };
        self.partyDetails = ko.mapping.fromJS(self.partyDetails);
        self.additionalDetails = ko.observable();
        self.usersList = ko.observableArray();
        self.mappedUsersList = ko.observableArray();
        self.selectedUser = ko.observable();
        self.isUsersLoaded = ko.observable(false);
        self.selectedUser = ko.observable(null);
        self.isUserSelected = ko.observable(false);
        self.isBankAdmin = ko.observable(false);
        if (!rootParams.dashboard.userData.userProfile.partyId.value) {
            self.isBankAdmin(true);
        } else {
            self.isBankAdmin(false);
        }
        UserSearchModel.fetchMe().done(function (partyId) {
            if (partyId.userProfile.partyId.value) {
                self.partyDetails.party.value(partyId.userProfile.partyId.value);
                self.partyDetails.party.displayValue(partyId.userProfile.partyId.displayValue);
                UserSearchModel.fetchMeWithParty().done(function (dataName) {
                    self.partyDetails.partyName(dataName.party.personalDetails.fullName);
                    self.partyDetails.partyDetailsFetched(true);
                });
            }
        });
        self.fetchUsers = function () {
            UserSearchModel.listMappedUsers(self.partyDetails.party.value()).done(function (data) {
                self.mappedUsersList(data.mappedUsersList);
            });
            UserSearchModel.listUsers(self.generateURL(self.partyDetails.party.value())).done(function (data) {
                self.usersList.removeAll();
                for (var i = 0; i < data.userDTOList.length; i++) {
                    var userData = data.userDTOList[i];
                    userData.isMapped = false;
                    for (var j = 0; j < self.mappedUsersList().length; j++) {
                        if (data.userDTOList[i].username === self.mappedUsersList()[j].userId) {
                            userData.isMapped = true;
                            self.mappedUsersList.remove(self.mappedUsersList()[j]);
                            break;
                        }
                    }
                    self.usersList.push(userData);
                }
                self.datasource(new oj.ArrayTableDataSource(self.usersList, { idAttribute: "username" }));
                self.isUsersLoaded(true);
            });
        };
        self.generateURL = function (data) {
            return "users?partyId=" + data;
        };
        self.onUserSelected = function (data) {
            self.goToMap(data);
        };
        self.goToMap = function (data) {
            self.selectedUser(data);
            rootParams.dashboard.loadComponent("user-map", {}, self);
        };
        self.onUserSelectedInTable = function (event) {
            if (event.detail.value) {
                self.selectedUser(self.usersList()[event.detail.value[0].startIndex.row]);
                rootParams.dashboard.loadComponent("user-map", {}, self);
            }
        };
        self.placeInitials = function (firstName, lastName) {
            var initial = firstName.charAt(0) + lastName.charAt(0);
            return initial.toUpperCase();
        };
        self.back = function () {
            self.partyDetails.partyName("");
            self.partyDetails.partyId("");
            self.partyDetails.partyDetailsFetched(false);
        };
        var partyDetails = self.partyDetails.partyDetailsFetched.subscribe(function (data) {
            if (data) {
                self.fetchUsers();
            } else
                self.isUsersLoaded(false);
        });
        self.dispose = function () {
            partyDetails.dispose();
        };
        $(document).on("keypress", ".search-input", function (e) {
            if (e.which === 13) {
                $("#user-search").trigger("click");
            }
        });
    };
});