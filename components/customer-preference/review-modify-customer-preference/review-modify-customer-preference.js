define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/customer-preference",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "baseLogger",
    "ojs/ojpopup",
    "ojs/ojradioset",
    "ojs/ojcheckboxset"
], function (oj, ko, $, UpdateCPModel, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.showConfirmationScreen = ko.observable();
        self.updatePayload = ko.observable({});
        self.approvalTypeDisplayValue = ko.observable();
        self.channelAccessValue = ko.observable();
        rootParams.dashboard.headerName(self.nls.headings.partyPreferences);
        self.cpData = ko.observable(ko.toJS(rootParams.rootModel.params.data));
        self.partyIDdisplayValue = rootParams.rootModel.partyIDdisplayValue ? rootParams.rootModel.partyIDdisplayValue : rootParams.rootModel.params.data.party.displayValue;
        self.isActionReuired = ko.observable(false);
        self.transactionName = ko.observable();
        self.isCorpAdminEnabled = ko.observable();
        if (self.cpData().isActionRequired) {
            self.isActionReuired(true);
        }
        self.transactionName(self.nls.headings.modifytransactionName);
        if (self.cpData().approvalType === "SE") {
            self.approvalTypeDisplayValue = self.nls.headings.sequential;
        } else if (self.cpData().approvalType === "NSE") {
            self.approvalTypeDisplayValue = self.nls.headings.parallel;
        } else if (self.cpData().approvalType === "ZE") {
            self.approvalTypeDisplayValue = self.nls.headings.noApproval;
        }
        if (self.cpData().isEnabled === true || self.cpData().isEnabled === "true") {
            self.channelAccessValue = "true";
        } else {
            self.channelAccessValue = "false";
        }
        if (self.cpData().isCorpAdminEnabled && (self.cpData().isCorpAdminEnabled === true || self.cpData().isCorpAdminEnabled === "true")) {
            self.isCorpAdminEnabled("ENABLED");
        } else {
            self.isCorpAdminEnabled("DISABLED");
        }
        self.updateCP = function () {
            self.updatePayload().party = self.cpData().partyId;
            self.updatePayload().partyName = self.cpData().partyName;
            self.updatePayload().approvalType = self.cpData().approvalType;
            self.updatePayload().isEnabled = self.cpData().isEnabled;
             var i =0;
            for(i=0;i<self.cpData().limitPackagesUtilizedByUser.length;i++)
            delete self.cpData().limitPackagesUtilizedByUser[i].accessPointValue;
            for(i=0;i<self.cpData().limitPackagesUtilizedByParty.length;i++)
            delete self.cpData().limitPackagesUtilizedByParty[i].accessPointValue;
            self.updatePayload().limitPackagesUtilizedByUser = self.cpData().limitPackagesUtilizedByUser;
            self.updatePayload().limitPackagesUtilizedByParty = self.cpData().limitPackagesUtilizedByParty;
            self.updatePayload().partyLimitDescription = self.cpData().partyLimitDescription;
            self.updatePayload().userLimitDescription = self.cpData().userLimitDescription;
            self.updatePayload().isCorpAdminEnabled = self.cpData().isCorpAdminEnabled;
            self.updatePayload().maxUsersAllowed = self.cpData().maxUsersAllowed;
            self.updatePayload().allowedRoles = self.cpData().allowedRoles;
            self.updatePayload().version = self.cpData().version;
            self.updatePayload().gracePeriod = self.cpData().gracePeriod;
            self.updatePayload().dealCreationAllowed = self.cpData().dealCreationAllowed;
            var payload = ko.mapping.toJSON(self.updatePayload());
            UpdateCPModel.updateCP(self.cpData().partyId, payload).done(function (data, status, jqXhr) {
                self.httpStatus(jqXhr.status);
                self.transactionStatus(data);
                self.showConfirmationScreen(true);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName()
                }, self);
            });
        };
        self.cancelOnUpdateReview = function () {
            rootParams.dashboard.openDashBoard("nls.common.confirmationMessage");
        };
        self.backReview = function () {
            self.showReview(false);
            rootParams.dashboard.loadComponent("modify-customer-preference", {}, self);
        };
    };
});