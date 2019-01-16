/**
  * Audit Log search results
  *
  * @module audit-log-search-results
  * @requires {ojcore} oj
  * @requires {knockout} ko
  * @requires {object} AuditLogSearchResultsModel
  * @requires {jquery} $
  * @requires {object} BaseLogger
  * @requires {object} ResourceBundle
  */
define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",
    "baseLogger",
    "ojL10n!resources/nls/audit",
    "ojs/ojknockout",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable",
    "ojs/ojcollectiontabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojinputtext"
], function (oj, ko, AuditLogSearchResultsModel, $, BaseLogger, resourceBundle) {
    "use strict";
    /** Audit Logging search results
    *It allows user to get details of perticular audit based on ID.
    * @param {object} rootParams  An object which contains contect of dashboard and param values
    * @return {function} function
    *
    */
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.dataSource = ko.observable(rootParams.rootModel.auditResult());
        self.paginationDataSource = ko.observable();
        self.loadResults = ko.observable(false);
        self.resultList = ko.observableArray();
        rootParams.baseModel.registerComponent("audit-log-results", "audit");
        self.resultListDetailsDataSource = ko.observableArray();
        if (rootParams.rootModel.auditResult().length === 0) {
            self.loadResults(false);
            self.resultList([]);
        }
        ko.utils.arrayForEach(self.dataSource(), function (item) {
            item.startTime = item.startTime ? item.startTime : "";
            item.activity = item.activity ? item.activity : "";
            item.action = item.action ? item.action : "";
            item.userType = item.userType ? item.userType : "";
            item.userName = item.userName ? item.userName : "";
            item.partyId.displayValue = item.partyId.displayValue ? item.partyId.displayValue : "";
            item.partyName = item.partyName ? item.partyName : "";
            item.referenceNo = item.referenceNo ? item.referenceNo : "";
            item.status = item.status ? item.status : "";
            if (item.userType === "administrator") {
                item.userType = self.nls.auditResult.administrator;
            } else if (item.userType === "retailuser") {
                item.userType = self.nls.auditResult.retailuser;
            } else if (item.userType === "corporateuser") {
                item.userType = self.nls.auditResult.corporateuser;
            }
            self.resultList().push(item);
            self.loadResults(true);
        });
        self.openJSON = function(data){
       AuditLogSearchResultsModel.searchAuditItem(data.id).done(function (auditData) {
               rootParams.dashboard.loadComponent("audit-log-results",auditData.auditDTO, self);
                });
        };
        self.paginationDataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.resultList(), { idAttribute: "id" }));
    };

});
