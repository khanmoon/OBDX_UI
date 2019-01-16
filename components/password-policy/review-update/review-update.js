define([
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/password-policy",
    "ojs/ojcheckboxset",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext"
], function (ko, $, ReviewPasswordPolicyUpdateModel, locale) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.nls = locale;
        self.back = ko.observable(false);
        self.reviewData = ko.mapping.toJS(params.rootModel.params.data);
        params.dashboard.headerName(self.nls.pageTitle.header);
        self.personalDetExclusionReview = ko.observableArray();
        self.edit = function () {
            self.back(true);
            params.dashboard.loadComponent("update", {}, self);
        };
        self.userTypeEnums = ko.observableArray([]);
        self.userTypeEnumsLoaded = ko.observable(false);
        ko.utils.arrayForEach(self.reviewData.personalDetExclude, function (item) {
            if (item === "dob") {
                self.personalDetExclusionReview.push(self.nls.exclusionDetail.dob);
            } else if (item === "firstname") {
                self.personalDetExclusionReview.push(self.nls.exclusionDetail.firstname);
            } else if (item === "lastname") {
                self.personalDetExclusionReview.push(self.nls.exclusionDetail.lastname);
            } else if (item === "userid") {
                self.personalDetExclusionReview.push(self.nls.exclusionDetail.userid);
            } else if (item === "partyid") {
                self.personalDetExclusionReview.push(self.nls.exclusionDetail.partyid);
            }
        });
        ReviewPasswordPolicyUpdateModel.fetchUserGroupOptions().done(function (data) {
            self.userTypeEnums(data.enterpriseRoleDTOs);
            self.userTypeEnumsLoaded(true);
        });
        self.confirm = function () {
            ReviewPasswordPolicyUpdateModel.updatePasswordPolicy(self.id(), ko.toJSON(self.payload)).done(function (data, status, jqXhr) {
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.nls.header.transactionName
                }, self);
            });
        };
    };
});