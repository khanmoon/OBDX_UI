define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "jquery",
  "baseLogger",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/transaction-group",
  "ojs/ojinputtext",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojtable",
  "ojs/ojpagingtabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojknockout",
  "ojs/ojpopup",
  "ojs/ojarraytabledatasource",
  "ojs/ojvalidationgroup"
], function(oj, ko, TransactionGroupSearchModel, $, BaseLogger, constants, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.resource = resourceBundle;
    rootParams.dashboard.headerName(self.nls.headers.transactiongroupheader);
    self.datasource = self.datasource || new oj.ArrayTableDataSource([]);
    self.dataLoaded = self.datasource.totalSize() ? ko.observable(true) : ko.observable(false);
    self.transactionGroupCode = self.transactionGroupCode || ko.observable("");
    self.transactionGroupDesc = self.transactionGroupDesc || ko.observable("");
    self.groupList = ko.observableArray();
    self.validationTracker = ko.observable();
    self.groupValid=ko.observable();
    self.groupListArray = ko.observableArray();
    self.createTemplate = ko.observable(false);
    rootParams.baseModel.registerComponent("transaction-group-create", "transaction-group");
    rootParams.baseModel.registerComponent("transaction-group-read", "transaction-group");
    rootParams.dashboard.helpComponent.componentName("transaction-group-search");
    self.taskAspect = ko.observable("limit");

    self.clearValues = function() {
      self.transactionGroupCode("");
      self.transactionGroupDesc("");
      self.datasource.reset();
      self.dataLoaded(false);
    };

    self.cancel = function() {
      rootParams.dashboard.openDashBoard("nls.common.confirmationMessage");
    };

    self.columnArray = [{
        headerText: self.nls.fieldname.transactionGroupCode,
        renderer: oj.KnockoutTemplateUtils.getRenderer("viewDetails", true)
      },
      {
        headerText: self.nls.fieldname.transactionGroupDesc,
        field: "description"
      },
      {
        headerText: self.nls.fieldname.transactionsCount,
        field: "transactionCount"
      }
    ];

    self.openCreatePanel = function() {
      rootParams.dashboard.loadComponent("transaction-group-create", {}, self);
    };
    self.onGroupSelected = function(data) {
      rootParams.dashboard.loadComponent("transaction-group-read", data, self);
    };

    self.search = function() {
      if (self.transactionGroupCode() === "" && self.transactionGroupDesc() === "") {
          self.clearValues();
          rootParams.baseModel.showMessages(null, [self.nls.fieldname.noDescription], "ERROR");
          return;
      }

      self.dataLoaded(false);
      var promise1 = TransactionGroupSearchModel.searchTransactionGroup(self.taskAspect(), self.transactionGroupCode(), self.transactionGroupDesc());
      Promise.all([
        promise1
      ]).then(function(data) {
        self.groupList(data[0].taskGroupDTOlist);

        self.groupListArray = $.map(self.groupList(), function(temp) {
          var obj = {
            "description": temp.description,
            "id": temp.id,
            "transactionCount": temp.taskDTOs.length,
            "code": temp.name
          };
          return obj;
        });
        self.datasource.reset(self.groupListArray, {
          idAttribute: "code"
        });

        ko.tasks.runEarly();
        self.dataLoaded(true);
      });
    };

    self.viewTransactionGroup = function(data) {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      self.groupList.removeAll();
      rootParams.dashboard.loadComponent("transaction-group-read", {
        transactionGroupId: data.id,
        taskAspect: "limit"
      }, self);
    };
    self.reset = function() {
      self.transactionGroupCode(null);
      self.transactionGroupDesc(null);
      self.groupList.removeAll();
    };

  };
});
