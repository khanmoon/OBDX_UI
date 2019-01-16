/**
  * Audit Log search
  *
  * @module audit-log-search
  * @requires {ojcore} oj
  * @requires {knockout} ko
  * @requires {jquery} $
  * @requires {object} AuditLogSearchModel
  * @requires {object} BaseLogger
  * @requires {object} ResourceBundle
  */
define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/audit",
    "ojs/ojinputtext",
    "ojs/ojinputnumber",
    "ojs/ojselectcombobox"
], function (oj, ko, $, AuditLogSearchModel, BaseLogger, resourceBundle) {
    "use strict";
    /** Audit Logging search
    *It allows user search audit.
    * @param {object} rootParams  An object which contains contect of dashboard and param values
    * @return {function} function
    *
    */
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.response = ko.observable();
        self.audit = ko.observable("1");
        self.auditType = ko.observable("");
        self.userID = ko.observable("");
        self.contextID = ko.observable("");
        self.serviceId = ko.observable("");
        self.partyId = ko.observable("");
        self.requestUrl = ko.observable("");
        self.startTime = ko.observable("");
        self.endTime = ko.observable("");
        self.operationName = ko.observable("");
        self.serviceName = ko.observable("");
        self.auditTypeEnumLoaded = ko.observable(false);
        self.auditTypeEnumList = ko.observableArray();
        self.clickedHost = ko.observable(false);
        self.requestUrlFlag = ko.observable(true);
        self.optionChangedHandler = function (event) {
            if (event.detail.value === "ALL") {
                self.clickedHost(true);
                self.requestUrlFlag(false);
            }
            if (event.detail.value === "REST") {
                self.clickedHost(false);
                self.requestUrlFlag(true);
            }
            if (event.detail.value === "HOST") {
                self.clickedHost(true);
                self.requestUrlFlag(false);
            }
            if (event.detail.value === "SERVICE") {
                self.clickedHost(false);
                self.requestUrlFlag(false);
            }
        };
        AuditLogSearchModel.getAuditType().done(function (data) {
            self.auditTypeEnumList(data.enumRepresentations[0].data);
            self.auditTypeEnumLoaded(true);
        });
        self.searchAudit = function () {
            if (typeof self.audit() === "object") {
                self.auditType(self.audit()[0]);
            } else {
                self.auditType(self.audit());
            }
            AuditLogSearchModel.searchAudit(self.userID(), self.contextID(), self.serviceId(), self.partyId(), self.requestUrl(), self.startTime(), self.endTime(), self.auditType(), self.operationName(), self.serviceName()).done(function (data) {
                self.response(data);
                self.auditResult().loadSearchedAudits(true);
                self.auditResult().searchedAuditList(data.auditList);
            });
        };
        self.resetform = function () {
            self.userID("");
            self.contextID("");
            self.serviceId("");
            self.partyId("");
            self.requestUrl("");
            self.startTime("");
            self.endTime("");
        };
    };
});
