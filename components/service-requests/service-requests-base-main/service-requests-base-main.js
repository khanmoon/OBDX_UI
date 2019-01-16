define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/service-requests-configuration",
  "./model",
  "jqueryui-amd/widgets/sortable",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojaccordion",
  "ojs/ojnavigationlist",
  "ojs/ojlistview",
  "ojs/ojarraytabledatasource",
  "ojs/ojarraydataprovider"
], function (oj, ko, $, BaseLogger, constants, ResourceBundle, ServiceRequestsBaseMainModel) {
  "use strict";
  return function (Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.preLoadRootModel = Params.rootModel;
    self.model = Params.model;
    self.validationTracker = Params.validator;
    self.resource = ResourceBundle;
    Params.dashboard.headerName(self.resource.serviceRequest.raiseNewHeader);
    Params.baseModel.registerElement("search-box");
    self.showSearch = ko.observable(false);
    self.searchByType = ko.observable(self.resource.serviceRequest.searchByType);
    self.isExpanded = ko.observable(false);
    self.categoryHandle = ko.observable(false);
    self.refreshSRList = ko.observable(true);
    self.requestHeader = ko.observable(self.resource.serviceRequest.requestCreateHeader);
    self.SRName = ko.observable(self.resource.serviceRequest.requestName);
    self.SRAriaLabel = ko.observable(self.resource.serviceRequest.SRAriaLabel);
    self.SRDefinitionDTO = ko.observableArray([]);
    self.SRNameList = ko.observableArray([]);
    self.SRCategoryList = ko.observableArray();
    self.viewId = ko.observable();
    self.productData = ko.observableArray();
    self.selectedItem = ko.observable();
    var i, j;
    var count = 0;
    Params.baseModel.registerComponent("service-requests-base-form", "service-requests");
    Params.baseModel.registerComponent("service-requests-raise-request", "service-requests");
    ServiceRequestsBaseMainModel.fetchSRDefinitionDTO().then(function (data) {
      self.SRDefinitionDTO(data.serviceRequestResponse);
      for (i = 0; i < self.SRDefinitionDTO().length; i++) {
        var objName = {
          id: i,
          srid: self.SRDefinitionDTO()[i].id,
          name: self.SRDefinitionDTO()[i].name
        };
        self.SRNameList.push(objName);
      }
      for (i = 0; i < self.SRDefinitionDTO().length; i++) {
        for (j = 0; j < self.productData().length; j++) {
          if (self.SRDefinitionDTO()[i].product === self.productData()[j].label) {
            count++;
          }
        }
        if (count === 0) {
          self.productData.push({
            label: self.SRDefinitionDTO()[i].product
          });
        }
        count = 0;
      }
      self.showSearch(true);
      if (!Params.baseModel.small()) {
        self.selectedItem("product_0");
        self.getCategory(self.productData()[0]);
      }
    });
    self.getCategory = function (data) {
      ServiceRequestsBaseMainModel.fetchSRCategory(data.label).then(function (data) {
        self.refreshSRList(false);
        self.SRCategoryList.removeAll();
        for (i = 0; i < data.categoryResponse.length; i++) {
          self.SRList = ko.observableArray([]);
          self.SRListCount = ko.observable(0);
          for (j = 0; j < self.SRDefinitionDTO().length; j++) {
            if (self.SRDefinitionDTO()[j].categoryType === data.categoryResponse[i].categoryName) {
              var objChild = {
                srid: self.SRDefinitionDTO()[j].id,
                reqName: self.SRDefinitionDTO()[j].name
              };
              self.SRList.push(objChild);
              self.SRListCount(self.SRListCount() + 1);
            }
          }
          if (self.SRListCount() !== 0) {
            var objCategory = {
              id: i,
              categoryName: data.categoryResponse[i].categoryName,
              srList: self.SRList()
            };
            self.SRCategoryList.push(objCategory);
          }
          self.categoryHandle(true);
        }
        ko.tasks.runEarly();
        self.refreshSRList(true);
        if (Params.baseModel.small() && self.SRCategoryList()[0]) {
          Params.dashboard.loadComponent("service-requests-raise-request", {}, self);
        }
      });
    };
    self.callView = function (event) {
      if (event.srid) {
        self.viewId(event.srid);
      } else {
        self.viewId(event.detail.value);
      }
      Params.dashboard.loadComponent("service-requests-base-form", {}, self);
    };
    self.goToTracking = function () {
      Params.baseModel.registerComponent("service-requests-track", "service-requests");
      Params.dashboard.loadComponent("service-requests-track", {}, self);
    };
  };
});