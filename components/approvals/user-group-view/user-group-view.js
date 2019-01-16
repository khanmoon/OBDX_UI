define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "framework/js/constants/constants",
    "ojL10n!resources/nls/user-group",
    "ojs/ojinputtext",
    "ojs/ojknockout",
    "ojs/ojknockout-validation",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojselectcombobox"
], function (oj, ko, $, PaneViewModel, Constants, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.nls = resourceBundle;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("user-group-list", "approvals");
        self.koUserGroupUserModel = ko.observableArray();
        self.datasource = new oj.ArrayTableDataSource([]);
        self.userID = ko.observable("");
        rootParams.dashboard.backAllowed(false);
        rootParams.dashboard.headerName(self.nls.userGroup.userGroupDetails);
        self.actionHeaderheading = ko.observable();
        self.statusMessage = ko.observable();
        self.httpStatus = ko.observable();
        self.partyId = {};
        self.backLabel = self.nls.common.back;
        if (self.params.users && self.params.users.length > 0) {
            ko.utils.arrayForEach(self.params.users, function (users) {
                PaneViewModel.validateUser(users.userId).then(function (data) {
                    var usermodel = PaneViewModel.getUserModel();
                    usermodel.userID = data.userDTO.username;
                    usermodel.userName = rootParams.baseModel.format(self.nls.common.name, {
                        firstName: data.userDTO.firstName,
                        lastName: data.userDTO.lastName
                    });
                    self.koUserGroupUserModel.push(usermodel);
                    self.datasource.reset(self.koUserGroupUserModel(), { idAttribute: "userID" });
                }).fail(function () {
                    rootParams.baseModel.showMessages(null, [self.nls.common.invalidError], "ERROR");
                });
            });
        }
        self.modeSelection = function () {
            if (self.mode() === "CREATE") {
                self.actionHeaderheading(self.nls.common[self.mode().toLowerCase()]);
                rootParams.dashboard.headerName(self.nls.userGroup.userGroupDetails);
            } else if (self.mode() === "VIEW") {
                self.viewDetails();
                self.actionHeaderheading(self.nls.headers[self.mode()]);
                rootParams.dashboard.headerName(self.nls.userGroup.userGroupDetails);
            } else if (self.mode() === "EDIT") {
                self.actionHeaderheading(self.nls.common[self.mode().toLowerCase()]);
                rootParams.dashboard.headerName(self.nls.userGroup.userGroupDetails);
            }
            if (self.mode() === "REVIEW") {
                self.mode("REVIEW");
                self.actionHeaderheading(self.nls.headers[self.mode()]);
                rootParams.dashboard.headerName(self.nls.userGroup.userGroupDetails);
            }
        };
        var modeSubscribtions = self.mode.subscribe(function (newValue) {
            if (newValue) {
                self.modeSelection();
            }
        });
        self.dispose = function () {
            modeSubscribtions.dispose();
        };
        self.viewDetails = function () {
            PaneViewModel.fetchUserGroup(self.params.id).done(function (dataResponse) {
                ko.utils.extend(self, dataResponse.userGroup);
                self.version = dataResponse.userGroup.version;
                if (self.users && self.users.length > 0) {
                    self.koUserGroupUserModel.removeAll();
                    ko.utils.arrayForEach(self.users, function (users) {
                        PaneViewModel.validateUser(users.userId).then(function (data) {
                            var usermodel = PaneViewModel.getUserModel();
                            usermodel.userID = data.userDTO.username;
                            usermodel.userName = rootParams.baseModel.format(self.nls.common.name, {
                                firstName: data.userDTO.firstName,
                                lastName: data.userDTO.lastName
                            });
                            self.koUserGroupUserModel.push(usermodel);
                            self.datasource.reset(self.koUserGroupUserModel(), { idAttribute: "userID" });
                        }).fail(function () {
                            rootParams.baseModel.showMessages(null, [self.nls.userGroup.invalidError], "ERROR");
                        });
                    });
                }
                self.groupCode(self.params.name);
                self.version = self.params.version;
                self.groupDescription(self.params.description);
            });
        };
        self.partyName = self.partyDetails.partyName();
        self.partyId.value = self.partyDetails.party.value();
        self.partyId.displayValue = self.partyDetails.party.displayValue();
        if (self.mode() === "APPROVALREVIEW") {
            if (self.partyId.value) {
                PaneViewModel.fetchPartyDetails(self.partyId.value()).done(function (data) {
                    self.partyName = data.party.personalDetails.fullName;
                });
            }
            self.actionHeaderheading(self.nls.headers[self.mode()]);
        } else if (self.mode() !== "CREATE") {
                self.mode = ko.observable(self.params.mode());
            }
        self.groupCode = ko.observable(self.params.name);
        self.groupDescription = ko.observable(self.params.description);
        self.prevMode = ko.observable();
        self.userList = ko.observableArray();
        self.userListLoaded = ko.observable(false);
        self.buttonToDropDown = ko.observable(false);
        self.selectedUser = ko.observable();
        self.userListNull = ko.observable(false);
        self.validationTracker = ko.observable();
        self.transactionStatus = ko.observable();
        self.version = null;
        self.transactionName = ko.observable();
        self.editReview = function () {
            self.mode("EDIT");
            history.back();
        };
        self.back = function () {
            if (self.mode() === "VIEW" || self.mode() === "CREATE") {
                history.back();
            } else
                history.back();
        };
        var getNewKoModel = function () {
            var KoModel = PaneViewModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.confirm = function () {
            if (self.prevMode() === "EDIT") {
                self.transactionName(self.nls.userGroup.modifyUserGroup);
                self.rootModelInstance().UserGroup.id = self.params.id;
                self.rootModelInstance().UserGroup.name = self.groupCode();
                self.rootModelInstance().UserGroup.type = self.partyDetails.userType();
                self.rootModelInstance().UserGroup.description = self.groupDescription();
                self.rootModelInstance().UserGroup.partyId = self.partyId.value;
                self.rootModelInstance().UserGroup.unary = self.params.unary;
                self.rootModelInstance().UserGroup.version = self.params.version;
                self.rootModelInstance().UserGroup.users.removeAll();
                ko.utils.arrayForEach(self.koUserGroupUserModel(), function (users) {
                    self.rootModelInstance().UserGroup.users.push({ "userId": users.userID });
                });
                PaneViewModel.saveModel(ko.toJSON(self.rootModelInstance().UserGroup), self.rootModelInstance().UserGroup.id).done(function (data, status, jqXhr) {
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.nls.userGroup.modifyUserGroup
                    }, self);
                });
            } else if (self.prevMode() === "CREATE") {
                self.transactionName(self.nls.userGroup.createUserGroup);
                self.rootModelInstance().UserGroup.name = self.groupCode();
                self.rootModelInstance().UserGroup.type = "CUSTOMER";
                self.rootModelInstance().UserGroup.partyId = self.partyId.value;
                self.rootModelInstance().UserGroup.description = self.groupDescription();
                self.rootModelInstance().UserGroup.unary = false;
                self.rootModelInstance().UserGroup.users.removeAll();
                ko.utils.arrayForEach(self.koUserGroupUserModel(), function (users) {
                    self.rootModelInstance().UserGroup.users.push({ "userId": users.userID });
                });
                PaneViewModel.createUserGroup(ko.toJSON(self.rootModelInstance().UserGroup)).done(function (data, status, jqXhr) {
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.nls.userGroup.createUserGroup
                    }, self);
                });
            }
        };
        self.save = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            if (self.koUserGroupUserModel().length === 0) {
                self.userListNull(true);
                rootParams.baseModel.showMessages(null, [self.nls.userGroup.userListNull], "ERROR");
            } else {
                self.prevMode(self.mode());
                self.mode("REVIEW");
                self.actionHeaderheading(self.nls.headers[self.mode()]);
            }
        };
        self.deleteUserFromGroup = function (userID) {
            ko.utils.arrayForEach(self.koUserGroupUserModel(), function (usersAdded) {
                if (usersAdded && usersAdded.userID === userID) {
                    self.koUserGroupUserModel.remove(usersAdded);
                    self.datasource.reset(self.koUserGroupUserModel(), { idAttribute: "userID" });
                    self.selectedUser();
                    self.userID("");
                }
            });
        };
        self.deleteUserGroup = function (userDTO) {
            PaneViewModel.deleteUserGroup(userDTO.id).done(function () {
                self.ruleSearch(false);
                self.ruleSearch(true);
            });
        };
        self.editUserGroup = function () {
            self.mode("EDIT");
            self.actionHeaderheading(self.nls.common[self.mode().toLowerCase()]);
        };
        self.addNew = function () {
            PaneViewModel.fetchUserList(self.partyId.value).done(function (data) {
                self.userListLoaded(false);
                self.usersFilter = ko.computed(function () {
                    self.userList.removeAll();
                    var temp;
                    return ko.utils.arrayFilter(data.userDTOList, function (dataItem) {
                        temp = true;
                        ko.utils.arrayForEach(self.koUserGroupUserModel(), function (usersAdded) {
                            if (dataItem.username === usersAdded.userID)
                                temp = false;
                        });
                        if (temp)
                            self.userList.push(dataItem);
                    });
                }, this);
                self.dispose = function () {
                    self.usersFilter.dispose();
                };
                self.userListLoaded(true);
            });
            self.buttonToDropDown(true);
        };
        self.addNew();
        self.showUserId = ko.computed(function () {
            if (self.selectedUser())
                return self.userID(self.selectedUser().split("~")[2]);
        }, this);
        self.dispose = function () {
            self.showUserId.dispose();
        };
        self.addRow = function () {
            var usermodel = PaneViewModel.getUserModel();
            usermodel.userID = self.selectedUser().split("~")[2];
            self.userID(self.selectedUser().split("~")[2]);
            usermodel.userName = rootParams.baseModel.format(self.nls.common.name, {
                firstName: self.selectedUser().split("~")[0],
                lastName: self.selectedUser().split("~")[1]
            });
            self.koUserGroupUserModel.push(usermodel);
            self.datasource.reset(self.koUserGroupUserModel(), { idAttribute: "userID" });
            self.selectedUser(null);
            self.userID("");
            self.userListLoaded(false);
            self.buttonToDropDown(false);
        };
        self.cancelConfirmation = function () {
            rootParams.dashboard.openDashBoard(self.nls.common.cancelMaintenanceMsg);
        };
    };
});
