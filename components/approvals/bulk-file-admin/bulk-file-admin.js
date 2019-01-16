define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "jquery",

  "ojL10n!resources/nls/bulk-file-admin",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function(oj, ko, activityLogModel, $, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.Nls = resourceBundle;
    rootParams.baseModel.registerComponent("transaction-detail", "admin-approvals");
    self.transactionListLoaded = ko.observable(false);
    var transactionList;
    activityLogModel.getTransactionList(rootParams.rootModel.view).done(function(data) {
      transactionList = data.transactionDTOs;
      self.arrayDataSource = new oj.ArrayTableDataSource(transactionList || [], {
        idAttribute: "fileRefId"
      });
      self.paginationDataSource = new oj.PagingTableDataSource(self.arrayDataSource);
      self.transactionListLoaded(true);
    });
  };
});
