define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/transaction-group",
  "ojs/ojinputtext",
  "ojs/ojknockout",
  "ojs/ojknockout-validation",
  "ojs/ojlistview",
  "ojs/ojarraytabledatasource",
  "ojs/ojselectcombobox"
], function(oj, ko, $, TransactionGroupSearchModel, Constants, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.dashboard.headerName(self.nls.headers.transactiongroupheader);
    rootParams.baseModel.registerElement("action-header");
    self.transactionListArray = ko.observableArray();
    self.transactionList = ko.observableArray();
    self.datasource = new oj.ArrayTableDataSource([]);
    self.showData = ko.observable(false);
    self.showHeader = ko.observable(false);

    if (rootParams.rootModel.params.data) {
      self.transactionGroupCode = ko.observable(rootParams.rootModel.params.data.name());
      self.transactionGroupDesc = ko.observable(rootParams.rootModel.params.data.description());
      self.selectedTaskDto = ko.observableArray(rootParams.rootModel.params.data.taskDTOs());
    } else {
      self.showHeader(true);
      self.transactionGroupCode = ko.observable(rootParams.rootModel.params.reviewData.name);
      self.transactionGroupDesc = ko.observable(rootParams.rootModel.params.reviewData.description);
      self.selectedTaskDto = ko.observableArray(rootParams.rootModel.params.reviewData.selectedTransactionGroupValues);
    }

    var i = 1;
    self.transactionListArray = $.map(self.selectedTaskDto(), function(temp) {
      var obj = {
        "recordNo": i,
        "transaction": temp.name ? temp.name() : temp
      };
      i++;
      return obj;
    });
    self.datasource.reset(self.transactionListArray, {
      idAttribute: "recordNo"
    });
    self.showData(true);
    ko.tasks.runEarly();

  };
});
