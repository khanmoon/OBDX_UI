define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "./model",
    "ojL10n!resources/nls/user-group",
    "ojs/ojinputtext",
    "ojs/ojknockout",
    "ojs/ojknockout-validation",
    "ojs/ojdatetimepicker",
    "ojs/ojselectcombobox",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, BaseLogger, UserGroupReviewModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(UserGroupReviewModel.getNewModel());
                return KoModel;
            };
        self.usermodel = getNewKoModel().UserModel;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("confirm-screen");
        self.resourceBundle = resourceBundle;
        self.userGroup = rootParams.rootModel.params.data;
        if (rootParams.rootModel.transactionDetails().partyName)
            self.partyName = ko.observable(rootParams.rootModel.transactionDetails().partyName.fullName);
        self.groupCode = ko.observable(self.userGroup.name());
        self.showUsers = ko.observable(false);
        self.groupDescription = ko.observable(self.userGroup.description());
        self.koUserGroupUserModel = ko.observableArray();
        self.datasourceForUserGroup = new oj.ArrayTableDataSource([]);
        self.count = ko.observable(0);
        if (self.userGroup.users() && self.userGroup.users().length > 0) {
            ko.utils.arrayForEach(self.userGroup.users(), function (users) {
                self.koUserGroupUserModel.removeAll();
                UserGroupReviewModel.validateUser(users.userId()).then(function (data) {
                    self.usermodel = getNewKoModel().UserModel;
                    self.usermodel.userID = data.userDTO.username;
                    self.usermodel.userName = rootParams.baseModel.format(self.resourceBundle.common.name, {
                        firstName: data.userDTO.firstName,
                        lastName: data.userDTO.lastName
                    });
                    self.koUserGroupUserModel.push(self.usermodel);
                    self.count(self.koUserGroupUserModel().length);
                    if (self.count() === self.userGroup.users().length) {
                        self.datasourceForUserGroup.reset(self.koUserGroupUserModel(), { idAttribute: "userID" });
                        self.showUsers(true);
                    }
                });
            });
        }
    };
});