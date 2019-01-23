define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/admin-user-group",
    "ojs/ojinputtext",
    "ojs/ojknockout",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable",
    "ojs/ojradioset",
    "ojs/ojselectcombobox",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource", "ojs/ojarraytabledatasource"
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
        self.userList = ko.observableArray();
        self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.koUserGroupUserModel, {idAttribute: "userID"}));
        self.selectedUser = ko.observable();
        self.userExists = ko.observable(false);
        self.userID = ko.observable("");
        self.user = ko.observable();
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
        self.userListLoaded = ko.observable(false);
        self.buttonToDropDown = ko.observable(false);
        self.validationTracker = ko.observable();
        self.httpStatus = ko.observable();
        self.transactionStatus = ko.observable();
        self.referenceNumber = ko.observable();
        self.userName = ko.observable();
        self.userListNull = ko.observable(false);
        self.userLoaded = ko.observable(false);
        self.statusMessage = ko.observable();
        self.version = null;
        rootParams.baseModel.registerElement("confirm-screen");
        if (self.params.users && self.params.users.length > 0) {
            ko.utils.arrayForEach(self.params.users, function (users) {
              var usermodel = PaneViewModel.getUserModel();
              usermodel.userID = users.userId;
              usermodel.userName = null;
              usermodel.isLoading = ko.observable(false);
              self.koUserGroupUserModel.push(usermodel);
            });
        }
        self.viewUserDetails = function(users) {
            PaneViewModel.validateUser(users.userID).then(function(data) {
              users.isLoading(true);
              users.userName = data.userDTO.username;

            }).fail(function() {
                rootParams.baseModel.showMessages(null, [self.nls.common.invalidError], "ERROR");
            });
        };
        self.cancel = function () {
            history.back();
        };
        var getNewKoModel = function () {
            var KoModel = PaneViewModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.confirm = function () {
          self.rootModelInstance().UserGroup.users.removeAll();
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
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("adminUserGroupView"))) {
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
                }
            });
        };
        self.deleteUserGroup = function () {
            PaneViewModel.deleteUserGroup(self.groupCode()).done(function () {
                self.ruleSearch(false);
                self.ruleSearch(true);
            });
        };
        self.editUserGroup = function() {
            if (self.params.id) {
                self.mode("EDIT");
                self.actionHeaderheading(self.nls.generic.common[self.mode().toLowerCase()]);
            } else {
                self.mode("CREATE");
                self.actionHeaderheading(self.nls.generic.common[self.mode().toLowerCase()]);
            }

        };
        self.loadUserList = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("adminUserGroupView"))) {
                return;
            }
            PaneViewModel.fetchUserList(self.userName()).done(function(data) {
                ko.utils.arrayPushAll(self.userList,data.userDTOList);
                self.userListLoaded(true);
            });
        };
        self.openModal = function() {
            self.userListLoaded(false);
            $("#userSearchDialog").trigger("openModal");

        };

        self.closeDialog = function(){
          $("#userSearchDialog").trigger("closeModal");
        };

        self.refreshLookUp = function() {
            self.userList.removeAll();
        };
        self.addNew = function () {

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
        self.addRow = function() {
            var usermodel = PaneViewModel.getUserModel();
            usermodel.userID = self.userName();
            usermodel.isLoading = ko.observable(false);
            ko.utils.arrayForEach(self.koUserGroupUserModel(), function(users) {
                if (usermodel.userID === users.userID) {
                    self.userExists(true);
                }

            });
            if (self.userExists() === false) {
                self.userID(self.userName());
                self.koUserGroupUserModel.push(usermodel);
                self.userListLoaded(false);
                self.buttonToDropDown(false);
            } else {
                self.userListLoaded(false);
                self.buttonToDropDown(false);
                rootParams.baseModel.showMessages(null, [self.nls.common.userExists], "ERROR");
            }
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
