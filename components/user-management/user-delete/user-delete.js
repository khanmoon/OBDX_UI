define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojs/ojinputtext",
    "ojs/ojdialog"
], function (oj, ko, DeleteObjectModel) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.componentId = ko.observable();
        self.userId = ko.observable();
        self.userId(rootParams.id);
        self.componentType = ko.observable(rootParams.componentType);
        self.hideDeletePanel = function (id) {
            self.hideDeleteBlock(id);
        };
        self.deleteObjectErrorHandler = function (data) {
            var msg = data.responseJSON.message.detail;
            rootParams.baseModel.showMessages(null, [msg], "ERROR");
        };
        self.deleteObjectSuccessHandler = function (data, status, jqXhr) {
            self.hideDeleteBlock(data);
            self.updateList(data);
            self.httpStatus(jqXhr.status);
            self.transactionStatus(data.status);
            var userListAfterDeletion = self.user().searchedUserList().filter(function (obj) {
                return self.user().searchedUserList().indexOf(obj.username) === -1;
            });
            self.user().searchedUserList(userListAfterDeletion);
            self.deleteConfrimFlag(true);
        };
        self.confirmDelete = function (data) {
            var payload = { "userIdList": [] };
            var userIdList = [];
            userIdList.push(data.id());
            payload.userIdList = userIdList;
            DeleteObjectModel.deleteObject(ko.toJSON(payload), self.userId(), self.deleteObjectSuccessHandler, self.deleteObjectErrorHandler);
            location.reload();
        };
        self.message = ko.observable("success");
    };
});