define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/admin-user-group",
    "ojs/ojinputtext",
    "ojs/ojknockout",
    "ojs/ojknockout-validation",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable",
    "ojs/ojselectcombobox"
], function (oj, ko, $, PaneViewModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.dashboard.headerName(self.nls.userGroup.adminUserGroupDetails);
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("modal-window");
        self.koUserGroupUserModel = ko.observableArray();
        self.transactionName = ko.observable();
        self.datasource = new oj.ArrayTableDataSource([]);
        self.userID = ko.observable("");
        self.actionHeaderheading = ko.observable();
        self.mode = ko.observable(self.params.mode);
        if (self.mode() === "VIEW") {
            self.actionHeaderheading(self.nls.headers[self.mode()]);
        } else {
            self.actionHeaderheading(self.nls.generic.common[self.mode().toLowerCase()]);
        }
        self.groupCode = ko.observable(self.params.name);
        self.groupDescription = ko.observable(self.params.description);
        self.prevMode = ko.observable();
        self.userDTOList = ko.observableArray();
        self.userList = ko.observableArray();
        self.userListLoaded = ko.observable(false);
        self.buttonToDropDown = ko.observable(false);
        self.selectedUser = ko.observable();
        self.validationTracker = ko.observable();
        self.httpStatus = ko.observable();
        self.transactionStatus = ko.observable();
        self.referenceNumber = ko.observable();
        self.userListNull = ko.observable(false);
        self.statusMessage = ko.observable();
        self.version = null;
        rootParams.baseModel.registerElement("confirm-screen");
        if (self.params.users && self.params.users.length > 0) {
            ko.utils.arrayForEach(self.params.users, function (users) {
                PaneViewModel.validateUser(users.userId).then(function (data) {
                    var usermodel = PaneViewModel.getUserModel();
                    usermodel.userID = data.userDTO.username;
                    usermodel.userName = rootParams.baseModel.format(self.nls.generic.common.name, {
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
        self.cancel = function () {
            history.back();
        };
        var getNewKoModel = function () {
            var KoModel = PaneViewModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.confirm = function () {
            if (self.params.id === undefined) {
                self.prevMode("CREATE");
            }
            if (self.prevMode() === "EDIT") {
                self.transactionName(self.nls.userGroup.modifyUserGroup);
                self.rootModelInstance().UserGroup.id = self.params.id;
                self.rootModelInstance().UserGroup.name = self.groupCode();
                self.rootModelInstance().UserGroup.type = self.params.type;
                self.rootModelInstance().UserGroup.unary = self.params.unary;
                self.rootModelInstance().UserGroup.version = self.params.version;
                self.rootModelInstance().UserGroup.description = self.groupDescription();
                ko.utils.arrayForEach(self.koUserGroupUserModel(), function (users) {
                    self.rootModelInstance().UserGroup.users.push({ "userId": users.userID });
                });
                PaneViewModel.saveModel(ko.toJSON(self.rootModelInstance().UserGroup), self.rootModelInstance().UserGroup.id).done(function (data, status, jqXhr) {
                    self.httpStatus(jqXhr.status);
                    if (self.httpStatus() === 202) {
                        self.statusMessage(self.nls.approvals.common.successfullyInitiated);
                    } else if (self.httpStatus() === 200) {
                        self.statusMessage(self.nls.approvals.common.savedSuccessfully);
                    } else if (self.httpStatus() === 201) {
                        self.statusMessage(self.nls.approvals.common.savedSuccessfully);
                    }
                    self.transactionStatus(data);
                    if (data.status) {
                        self.referenceNumber(data.status.referenceNumber);
                    }
                    self.mode("SUCCESS");
                    self.actionHeaderheading(self.nls.approvals.headers.SUCCESSFUL);
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.transactionName()
                    }, self);
                });
            } else if (self.prevMode() === "CREATE") {
                self.transactionName(self.nls.userGroup.createUserGroup);
                self.rootModelInstance().UserGroup.name = self.groupCode();
                self.rootModelInstance().UserGroup.type = "ADMIN";
                self.rootModelInstance().UserGroup.description = self.groupDescription();
                self.rootModelInstance().UserGroup.unary = false;
                ko.utils.arrayForEach(self.koUserGroupUserModel(), function (users) {
                    self.rootModelInstance().UserGroup.users.push({ "userId": users.userID });
                });
                PaneViewModel.createUserGroup(ko.toJSON(self.rootModelInstance().UserGroup)).done(function (data, status, jqXhr) {
                    self.httpStatus(jqXhr.status);
                    if (self.httpStatus() === 202) {
                        self.statusMessage(self.nls.approvals.common.successfullyInitiated);
                    } else if (self.httpStatus() === 200) {
                        self.statusMessage(self.nls.approvals.common.savedSuccessfully);
                    } else if (self.httpStatus() === 201) {
                        self.statusMessage(self.nls.approvals.common.savedSuccessfully);
                    }
                    self.transactionStatus(data.status);
                    if (data.status) {
                        self.referenceNumber(data.status.referenceNumber);
                    }
                    self.mode("SUCCESS");
                    self.actionHeaderheading(self.nls.headers.SUCCESSFUL);
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.transactionName()
                    }, self);
                });
            }
        };
        self.save = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            if (self.koUserGroupUserModel().length === 0) {
                rootParams.baseModel.showMessages(null, [self.nls.info.userGroupDataError], "INFO");
            } else {
                self.prevMode(self.mode());
                self.mode("REVIEW");
                self.actionHeaderheading(self.nls.headers.REVIEW);
            }
        };
        self.deleteUserFromGroup = function (userID) {
            ko.utils.arrayForEach(self.koUserGroupUserModel(), function (usersAdded) {
                if (usersAdded.userID === userID) {
                    self.koUserGroupUserModel.remove(usersAdded);
                    self.datasource.reset(self.koUserGroupUserModel(), { idAttribute: "userID" });
                    self.selectedUser();
                    self.userID("");
                }
            });
        };
        self.deleteUserGroup = function () {
            PaneViewModel.deleteUserGroup(self.groupCode()).done(function () {
                self.ruleSearch(false);
                self.ruleSearch(true);
            });
        };
        self.editUserGroup = function () {
            if (self.params.id) {
                PaneViewModel.fetchUserGroup(self.params.id).done(function (data) {
                    self.version = data.userGroup.version;
                });
                self.loadUserList();
            } else {
                self.mode("CREATE");
                self.actionHeaderheading(self.nls.generic.common[self.mode().toLowerCase()]);
            }
        };
        self.loadUserList = function () {
            PaneViewModel.fetchUserList().done(function (data) {
                self.userDTOList = data.userDTOList;
                if (self.params.id) {
                    self.mode("EDIT");
                    self.actionHeaderheading(self.nls.generic.common[self.mode().toLowerCase()]);
                }
            });
        };
        if (self.mode() === "CREATE") {
            self.loadUserList();
        }
        self.addNew = function () {
            self.userListLoaded(false);
            self.usersFilter = ko.computed(function () {
                self.userList.removeAll();
                var temp;
                return ko.utils.arrayFilter(self.userDTOList, function (dataItem) {
                    temp = true;
                    ko.utils.arrayForEach(self.koUserGroupUserModel(), function (usersAdded) {
                        if (dataItem.username === usersAdded.userID) {
                            temp = false;
                        }
                    });
                    if (temp) {
                        self.userList.push(dataItem);
                    }
                });
            }, self);
            self.dispose = function () {
                self.usersFilter.dispose();
            };
            self.userListLoaded(true);
            self.buttonToDropDown(true);
        };
        self.showUserId = ko.computed(function () {
            if (self.selectedUser()) {
                return self.userID(self.selectedUser().split("~")[2]);
            }
        }, this);
        self.dispose = function () {
            self.showUserId.dispose();
        };
        self.addRow = function () {
            var usermodel = PaneViewModel.getUserModel();
            usermodel.userID = self.selectedUser().split("~")[2];
            self.userID(self.selectedUser().split("~")[2]);
            usermodel.userName = rootParams.baseModel.format(self.nls.generic.common.name, {
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
        self.done = function () {
            rootParams.dashboard.openDashBoard();
        };
        self.cancel = function () {
            rootParams.dashboard.openDashBoard(self.nls.common.cancelMaintenanceMsg);
        };
        self.viewBack = function () {
            self.groupDetailsFetched = false;
            history.back();
        };
        self.updateBack = function () {
            self.mode("VIEW");
            self.actionHeaderheading(self.nls.headers.VIEW);
        };
        self.createBack = function () {
            history.back();
        };
    };
});
