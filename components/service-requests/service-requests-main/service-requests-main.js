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
  "ojs/ojtable",
  "ojs/ojdatetimepicker",
  "ojs/ojarraytabledatasource"
], function(oj, ko, $, BaseLogger, constants, ResourceBundle, ServiceRequestsMainModel) {
  "use strict";
  return function(Params) {
    var self = this;
    var i;
    ko.utils.extend(self, Params.rootModel);
    self.preLoadRootModel = Params.rootModel;
    self.model = Params.model;
    self.validationTracker = Params.validator;
    self.resource = ResourceBundle;
    Params.dashboard.headerName(self.resource.serviceRequest.header);
    self.transactionName = ko.observable("Maintenance");
    self.turnaroundTimeIcon = ko.observableArray([]);
    self.maxEndDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(Params.baseModel.getDate()));
    self.maxEndDateCurrent = ko.observable(oj.IntlConverterUtils.dateToLocalIso(Params.baseModel.getDate()));
    Params.baseModel.registerComponent("service-requests-list", "service-requests");
    self.statusDescription = ko.observable("Pending");
    self.gotoMainScreen = function() {
      Params.dashboard.loadComponent("service-requests-main", {}, self);
    };
    self.goBack = function() {
      self.loadSecondScreen(true);
      Params.dashboard.loadComponent("service-requests-main", {}, self);
    };
    if (constants.userSegment === "RETAIL" && !self.backFromDetails) {
      self.startDate("");
      self.endDate("");
    }
    ServiceRequestsMainModel.fetchStatusType().done(function(data) {
      self.statusTypeLoaded(false);
      for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
        if (self.statusType() === data.enumRepresentations[0].data[i].code) {
          self.statusDescription(data.enumRepresentations[0].data[i].description);
        }
        self.statusTypeArray.push({
          "code": data.enumRepresentations[0].data[i].code,
          "description": data.enumRepresentations[0].data[i].description
        });
      }
      self.statusTypeLoaded(true);
    });
    ServiceRequestsMainModel.fetchRequestType().done(function(data) {
      self.requestTypeLoaded(false);
      self.requestTypeArray(data.enumRepresentations[0].data);
      self.requestTypeLoaded(true);
      ServiceRequestsMainModel.fetchDefaultList(self.statusType(),
        self.startDate(),
        self.endDate(),
        self.firstName(),
        self.lastname(),
        self.userName(),
        self.partyId(),
        self.requestType(),
        self.productName(),
        self.severity(),
        self.requestCategory(),
        self.refNumber(),
        self.requestName()).done(function(data) {
        self.defaultListLoaded(false);
        self.listArray.removeAll();
        for (i = 0; i < data.list.length; i++) {

          self.listArray.push({
            "date": Params.baseModel.formatDate(data.list[i].creationDate.substring(0, data.list[i].creationDate.indexOf("T"))),
            "requesttype": data.list[i].definition.name,
            "requestedby": data.list[i].userName,
            "userid": data.list[i].userID,
            "partyname": data.list[i].party.displayValue,
            "refnumber": data.list[i].id,
            "statustype": self.statusDescription(),
            "requestname": data.list[i].requestType,
            "iconClass": data.list[i].turnaroundTime && JSON.parse(data.list[i].turnaroundTime) ? "icon-alert" : ""
          });
        }
        self.datasource = new oj.ArrayTableDataSource(self.listArray, {
          idAttribute: "refnumber"
        });

        self.defaultListLoaded(true);
        if(self.statusType()==="CO")
        {
          self.approveRejectButton(false);
        }
        else{
          self.approveRejectButton(true);
        }
      });
    });


    ServiceRequestsMainModel.fetchSeverity().done(function(data) {
      self.severityLoaded(false);
      for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.severityData.push({
          description: data.enumRepresentations[0].data[i].description,
          code: data.enumRepresentations[0].data[i].code
        });
      }
      self.severityLoaded(true);
    });
    ServiceRequestsMainModel.fetchProductNames().done(function(data) {
      for (i = 0; i < data.productResponse.length; i++) {
        self.productsArray.push({
          code: data.productResponse[i].productName
        });
      }
      self.productsLoaded(true);
    });

    if (self.productName()) {
      ServiceRequestsMainModel.fetchCategoryTypes(self.productName()).done(function(data) {
        self.requestCategoriesLoaded(false);
        self.categoriesLoaded.removeAll();
        for (i = 0; i < data.categoryResponse.length; i++) {
          self.categoriesLoaded.push({
            code: data.categoryResponse[i].categoryName
          });
        }
        ko.tasks.runEarly();
        self.requestCategoriesLoaded(true);
      });
    }
    self.showCategoriesList = function(event) {
      if (event.detail.value) {
        ServiceRequestsMainModel.fetchCategoryTypes(event.detail.value).done(function(data) {
          self.requestCategoriesLoaded(false);
          self.categoriesLoaded.removeAll();
          for (i = 0; i < data.categoryResponse.length; i++) {
            self.categoriesLoaded.push({
              code: data.categoryResponse[i].categoryName
            });
          }
          ko.tasks.runEarly();
          self.requestCategoriesLoaded(true);
        });
      }
    };
    self.startDateSubscription = self.startDate.subscribe(function() {
      var dateStart = new Date(self.startDate());
      var dateMax = Params.baseModel.getDate();
      var dateCurrent = Params.baseModel.getDate();
      dateMax.setMonth(dateStart.getMonth() + 1);
      dateMax.setDate(dateStart.getDate());
      if (dateMax < dateCurrent) {
        self.maxEndDate(oj.IntlConverterUtils.dateToLocalIso(dateMax));
      } else {
        self.maxEndDate(oj.IntlConverterUtils.dateToLocalIso(dateCurrent));
      }
      self.maxEndDateCurrent(oj.IntlConverterUtils.dateToLocalIso(dateCurrent));
    });

    self.search = function() {
      self.statusType(self.statusType());
      ServiceRequestsMainModel.fetchDefaultList(self.statusType(),
        self.startDate(),
        self.endDate(),
        self.firstName() ? self.firstName() : "",
        self.lastname() ? self.lastname() : "",
        self.userName() ? self.userName() : "",
        self.partyId() ? self.partyId() : "",
        self.requestType() ? self.requestType() : "",
        self.productName() ? self.productName() : "",
        self.severity() ? self.severity() : "",
        self.requestCategory() ? self.requestCategory() : "",
        self.refNumber() ? self.refNumber() : "",
        self.requestName() ? self.requestName() : "").done(function(data) {

        self.defaultListLoaded(false);
        self.listArray.removeAll();
        for (i = 0; i < data.list.length; i++) {
          self.listArray.push({
            "date": Params.baseModel.formatDate(data.list[i].creationDate.substring(0, data.list[i].creationDate.indexOf("T"))),
            "requesttype": data.list[i].definition.name,
            "requestedby": data.list[i].userName,
            "userid": data.list[i].userID,
            "partyname": data.list[i].party.displayValue,
            "refnumber": data.list[i].id,
            "statustype": self.statusDescription(),
            "requestname": data.list[i].requestType,
            "iconClass": data.list[i].turnaroundTime && JSON.parse(data.list[i].turnaroundTime) ? "icon-alert" : ""
          });
        }
        self.datasource = new oj.ArrayTableDataSource(self.listArray(), {
          idAttribute: "refnumber"
        });
        self.pagingDatasource(new oj.PagingTableDataSource(self.datasource));
        self.defaultListLoaded(true);
        if(self.statusType()==="CO")
        {
          self.approveRejectButton(false);
        }
        else{
          self.approveRejectButton(true);
        }
      });
    };
    self.reset = function() {
      self.firstName("");
      self.lastname("");
      self.userName("");
      self.partyId("");
      self.requestName("");
      self.productName("");
      self.severity("");
      self.requestCategory("");
      if (constants.userSegment === "RETAIL") {
        self.startDate("");
        self.endDate("");
      } else {
        var date = Params.baseModel.getDate();
        var date2 = Params.baseModel.getDate();
        date2.setMonth(date.getMonth() - 1);
        self.startDate(oj.IntlConverterUtils.dateToLocalIso(date2));
        self.endDate(oj.IntlConverterUtils.dateToLocalIso(date));
        self.startDate(self.startDate().substring(0, self.startDate().indexOf("T")));
        self.endDate(self.endDate().substring(0, self.endDate().indexOf("T")));
      }

      self.requestTypeLoaded(false);
      self.statusTypeLoaded(false);

      self.requestType("");
      // pre set
      self.statusType("PE");
      self.refNumber("");
      ko.tasks.runEarly();
      self.requestTypeLoaded(true);
      self.statusTypeLoaded(true);

      self.search();
    };

    self.transformText = function(text) {
      if (!text) {
        return;
      }
      var j, pairs;
      if (text.indexOf("_") > -1) {
        pairs = text.split("_");
        for (j = 0; j < pairs.length; j++) {
          pairs[j] = pairs[j].substring(0, 1).toUpperCase() + pairs[j].substring(1).toLowerCase();
        }
        text = pairs.join(" ");
      } else if (text.indexOf(" ") === -1) {
        text = text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
      }
      return text;
    };

    self.dispose = function() {
      self.startDateSubscription.dispose();
    };
    self.getTemplate = function() {
      if (constants.userSegment === "RETAIL") {
        return "templateRetailMain";
      }
      return "templateAdmin";
    };
    self.statusChangeHandler = function() {
      for (i = 0; i < self.statusTypeArray().length; i++) {
        if (self.statusTypeArray()[i].code === self.statusType()) {
          self.statusDescription(self.statusTypeArray()[i].description);
        }
      }
    };
    self.moreOptions = ko.observable(false);
    self.showOptions = function() {
      if (self.moreOptions()) {
        self.moreOptions(false);
      } else {
        self.moreOptions(true);
      }
    };
  };
});
