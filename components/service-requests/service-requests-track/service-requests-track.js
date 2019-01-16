define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "ojL10n!resources/nls/service-requests-track",
  "framework/js/constants/constants",
  "./model",
  "jqueryui-amd/widgets/sortable",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojlistview",
  "ojs/ojcollectiontabledatasource",
  "ojs/ojdatetimepicker",
  "ojs/ojtoolbar",
  "ojs/ojswitch"
], function (oj, ko, $, BaseLogger, ResourceBundle, Constants, ServiceRequestTrack) {
  "use strict";
  return function (Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.validationTracker = Params.validator;
    self.resource = ResourceBundle;
    Params.dashboard.headerName(self.resource.trackHeader);
    self.refreshData = ko.observable(true);
    self.dataSource = ko.observable();
    self.productData = ko.observableArray();
    self.categoryData = ko.observableArray();
    self.statusesData = ko.observableArray();
    self.statusesLoaded = ko.observable(false);
    self.productNamesLoaded = ko.observable(false);
    self.categoryTypesLoaded = ko.observable(false);
    self.searchResults = ko.observable(false);
    self.productNames = ko.observableArray();
    var i;
    self.headerText = ko.observableArray([{
        "headerText": self.resource.datePlaceHolder,
        "field": "date"
      },
      {
        "headerText": self.resource.requestName,
        "field": "name"
      },
      {
        "headerText": self.resource.referenceNo,
        "field": "refNo"
      },
      {
        "headerText": self.resource.statusPlaceHolder,
        "field": "status"
      }
    ]);
    self.refreshSearch = function () {
      self.refreshData(false);
      self.searchResults(false);
      self.productName("");
      self.category("");
      self.categoryData.removeAll();
      self.categoryTypesLoaded(false);
      self.startDate("");
      self.endDate("");
      self.statusValue("");
      ko.tasks.runEarly();
      self.refreshData(true);
    };
    if (!self.detailsVisited) {
      self.productName = ko.observable();
      self.category = ko.observable();
      self.startDate = ko.observable();
      self.endDate = ko.observable();
      self.statusValue = ko.observable();
    }
    ServiceRequestTrack.fetchProductNames().done(function (data) {
      self.productNamesLoaded(true);
      for (i = 0; i < data.productResponse.length; i++) {
        self.productData.push({
          label: data.productResponse[i].productName
        });
      }
    });
    ServiceRequestTrack.fetchStatuses().done(function (data) {
      self.statusesLoaded(true);
      for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.statusesData.push({
          label: data.enumRepresentations[0].data[i].description,
          code: data.enumRepresentations[0].data[i].code
        });
      }
    });
    self.showCategoriesList = function (event) {
      if (event.detail.value) {
        ServiceRequestTrack.fetchCategoryTypes(event.detail.value).done(function (data) {
          self.categoryTypesLoaded(false);
          self.categoryData.removeAll();
          for (i = 0; i < data.categoryResponse.length; i++) {
            self.categoryData.push({
              label: data.categoryResponse[i].categoryName
            });
          }
          ko.tasks.runEarly();
          self.categoryTypesLoaded(true);
        });
      } else {
        self.categoryTypesLoaded(false);
        self.searchResults(false);
        self.category("");
        self.categoryData.removeAll();
        ko.tasks.runEarly();
        self.categoryTypesLoaded(true);
      }
    };
    self.fetchList = function () {
      if (self.category() || self.startDate() || self.endDate() || self.statusValue()) {
        ServiceRequestTrack.fetchData(self.productName(), self.category(), self.startDate(), self.endDate(), self.statusValue()).done(function (data) {
          var tempData = null;
          tempData = $.map(data.list, function (v) {
            var newObj = {};
            for (i = 0; i < self.statusesData().length; i++) {
              if (self.statusesData()[i].code === v.status) {
                newObj.status = self.statusesData()[i].label;
                break;
              }
            }
            newObj.date = Params.baseModel.formatDate(v.creationDate);
            newObj.name = v.definition.name;
            newObj.refNo = v.id;
            newObj.requestType = v.requestType;
            return newObj;
          });
          self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempData, {
            idAttribute: "refNo"
          })));
          self.searchResults(true);
        });
      }
    };
    self.onSelectedInTable = function (event) {
      self.detailsVisited = ko.observable(true);
      if (event.requestType === "OTHERS") {
        Params.baseModel.registerComponent("service-requests-track-details", "service-requests");
        Params.dashboard.loadComponent("service-requests-track-details", {
          referenceNo: event.refNo,
          status: event.status
        }, self);
      } else {
        self.serviceRequest = ko.observable(event.refNo);
        ServiceRequestTrack.fetchRequestType().done(function (data) {
          self.requestTypeArray = ko.observable(data.enumRepresentations[0].data);
          Params.baseModel.registerComponent("service-requests-detail", "service-requests");
          Params.dashboard.loadComponent("service-requests-detail", {}, self);
        });
      }
      self.searchResults(false);
    };
    if (self.detailsVisited) {
      if (self.category()) {
        ServiceRequestTrack.fetchCategoryTypes(self.productName()).done(function (data) {
          self.categoryTypesLoaded(false);
          self.categoryData.removeAll();
          for (i = 0; i < data.categoryResponse.length; i++) {
            self.categoryData.push({
              label: data.categoryResponse[i].categoryName
            });
          }
          ko.tasks.runEarly();
          self.categoryTypesLoaded(true);
        });
      }
      ServiceRequestTrack.fetchStatuses().done(function (data) {
        self.statusesData.removeAll();
        self.statusesLoaded(true);
        for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.statusesData.push({
            label: data.enumRepresentations[0].data[i].description,
            code: data.enumRepresentations[0].data[i].code
          });
        }
        self.fetchList();
      });
    }
  };
});
