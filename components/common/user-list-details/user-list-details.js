define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/user-list-details",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function(oj, ko, $, UserListDetailsModel, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.partyDetails = rootParams.partyDetails;
        self.partyID = rootParams.rootModel.partyID();
        self.nls = resourceBundle;
        self.userList = ko.observableArray();
        self.accessCreatedUserList = ko.observableArray();
        self.nonAccessCreatedUserList = ko.observableArray();
        self.userListLoaded = ko.observable(false);
        self.validateSucces = ko.observable(false);
        UserListDetailsModel.fetchAssociatedUserForParty(self.partyID).done(function(data) {
            if (data.userDTOList && data.userDTOList.length > 0) {
                self.userList(data.userDTOList);
                ko.utils.arrayForEach(self.userList(), function(item) {
                    if (item.isAccountAccessSetup === true) {
                        self.accessCreatedUserList().push({
                            username: item.username,
                            enrolledfor2fa: item.enrolledfor2fa,
                            firstName: item.firstName,
                            isAccountAccessSetup: item.isAccountAccessSetup,
                            lastName: item.lastName,
                            partyID: item.partyId,
                            customer: item.customer
                        });
                    } else {
                        self.nonAccessCreatedUserList().push({
                            username: item.username,
                            enrolledfor2fa: item.enrolledfor2fa,
                            firstName: item.firstName,
                            isAccountAccessSetup: item.isAccountAccessSetup,
                            lastName: item.lastName,
                            partyID: item.partyId,
                            customer: item.customer
                        });
                    }
                });
                self.accessCreatedUserList.sort(function(left, right) {
                    return left.username.toLowerCase().localeCompare(right.username.toLowerCase());
                });
                self.nonAccessCreatedUserList.sort(function(left, right) {
                    return left.username.toLowerCase().localeCompare(right.username.toLowerCase());
                });
                self.userList([]);
                ko.utils.arrayForEach(self.accessCreatedUserList(), function(item) {
                    self.userList().push(item);
                    self.userListDetailsDataSource = new oj.ArrayTableDataSource(self.userList(), {
                        idAttribute: "username"
                    });
                });
                ko.utils.arrayForEach(self.nonAccessCreatedUserList(), function(item) {
                    self.userList().push(item);
                    self.userListDetailsDataSource = new oj.ArrayTableDataSource(self.userList(), {
                        idAttribute: "username"
                    });
                });
                self.userListLoaded(true);
            } else {
                rootParams.baseModel.showMessages(null, [self.nls.info.recordNotFound], "ERROR");
            }
        });
        self.showUserAccountAccess = function(data) {
            self.selectedUserData(data);
        };
        self.placeInitials = function(firstName, lastName) {
            var initial = firstName.charAt(0) + lastName.charAt(0);
            return initial.toUpperCase();
        };
    };
});