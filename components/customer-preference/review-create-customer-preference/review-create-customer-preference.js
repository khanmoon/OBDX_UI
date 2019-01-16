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
    "ojs/ojcheckboxset",
    "ojs/ojradiocheckbox"
], function (oj, ko, $, CreateCPModel, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.approvalTypeDisplayValue = ko.observable();
        self.channelAccessValue = ko.observable();
        self.transactionName = ko.observable();
        rootParams.dashboard.headerName(self.nls.headings.partyPreferences);
        self.partyIDdisplayValue = rootParams.rootModel.partyIDdisplayValue ? rootParams.rootModel.partyIDdisplayValue : rootParams.rootModel.params.data.party.displayValue;
        if (ko.isObservable(rootParams.rootModel.params.data)) {
            self.cpData = rootParams.rootModel.params.data;
        } else {
            self.cpData = ko.observable(ko.toJS(rootParams.rootModel.params.data));
        }
        self.isActionReuired = ko.observable(false);
        if (self.cpData().isActionRequired) {
            self.isActionReuired(true);
        }
        if (self.cpData().approvalType === "SE") {
            self.approvalTypeDisplayValue = "SE";
        } else if (self.cpData().approvalType === "NSE") {
            self.approvalTypeDisplayValue = "NSE";
        } else if (self.cpData().approvalType === "ZE") {
            self.approvalTypeDisplayValue = "ZE";
        }
        if (self.cpData().isEnabled === true || self.cpData().isEnabled === "true") {
            self.channelAccessValue = "true";
        } else {
            self.channelAccessValue = "false";
        }
        self.createPayload = ko.observable({});
        self.showConfirmationScreen = ko.observable();
        self.transactionName(self.nls.headings.createtransactionName);
        self.createORupdateCP = function () {
            self.createPayload().party = self.cpData().partyId;
            self.createPayload().partyName = self.cpData().partyName;
            self.createPayload().approvalType = self.cpData().approvalType;
            self.createPayload().isEnabled = self.cpData().isEnabled;
            var i =0;
            for(i=0;i<self.cpData().limitPackagesUtilizedByUser.length;i++)
            delete self.cpData().limitPackagesUtilizedByUser[i].accessPointValue;
            for(i=0;i<self.cpData().limitPackagesUtilizedByParty.length;i++)
            delete self.cpData().limitPackagesUtilizedByParty[i].accessPointValue;
            self.createPayload().limitPackagesUtilizedByUser = self.cpData().limitPackagesUtilizedByUser;
            self.createPayload().limitPackagesUtilizedByParty = self.cpData().limitPackagesUtilizedByParty;
            self.createPayload().partyLimitDescription = self.cpData().partyLimitDescription;
            self.createPayload().userLimitDescription = self.cpData().userLimitDescription;
            self.createPayload().isCorpAdminEnabled = self.cpData().isCorpAdminEnabled;
            self.createPayload().maxUsersAllowed = self.cpData().maxUsersAllowed;
            if (self.createPayload().isCorpAdminEnabled) {
                self.createPayload().allowedRoles = self.cpData().allowedRoles;
            }
            self.createPayload().gracePeriod = self.cpData().gracePeriod;
            var payload = ko.mapping.toJSON(self.createPayload());
            CreateCPModel.createCP(self.partyID(), payload).done(function (data, status, jqXhr) {
                self.httpStatus(jqXhr.status);
                self.transactionStatus(data.status);
                self.showConfirmationScreen(true);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName()
                }, self);
            });
            self.isDisabled(false);
        };
        self.cancelOnCreateReview = function () {
            rootParams.dashboard.openDashBoard("nls.common.confirmationMessage");
        };
        self.backOnReview = function () {
            self.showReviewForCreate(false);
            rootParams.dashboard.loadComponent("create-customer-preference", {}, self);
        };
    };
});
