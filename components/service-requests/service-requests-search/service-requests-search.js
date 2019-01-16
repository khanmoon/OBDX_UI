define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "ojL10n!resources/nls/service-requests-search",
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
  "ojs/ojcollectiontabledatasource",
  "ojs/ojtoolbar",
  "ojs/ojswitch"
], function (oj, ko, $, BaseLogger, ResourceBundle, Constants, ServiceRequestSearch) {
  "use strict";
  return function (Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.validationTracker = Params.validator;
    self.resource = ResourceBundle;
    self.dataSource = ko.observable();
    self.requestNameParameter = ko.observable();
    self.descriptionParameter = ko.observable();
    self.moduleTypeParameter = ko.observable();
    self.taskTypeParameter = ko.observable();
    self.noRequests = ko.observable(false);
    self.moreOptions = ko.observable(false);
    self.searchResults = ko.observable(false);
    self.transactionTypesLoaded = ko.observable(false);
    self.transactionTypeData = ko.observableArray();
    self.moduleTypesLoaded = ko.observable(false);
    self.recentServiceRequest = ko.observableArray();
    self.idList = ko.observableArray();
    self.recentServiceRequestHover = ko.observable(true);
    self.recentServiceRequestHoverOptions = ko.observable(false);
    self.moduleData = ko.observableArray();
    self.taskTypeLabel = ko.observable();
    self.readModule = ko.observable();
    self.readTaskType = ko.observable();
    self.severityData = ko.observableArray();
    self.priorityType = ko.observable();
    self.statusesData = ko.observableArray();
    self.applicableStatus = ko.observableArray();
    self.viewAllowedStatus = ko.observableArray();
    self.nameList = ko.observableArray();
    self.remarksValid = ko.observable();
    Params.baseModel.registerElement("modal-window");
    var location = ko.observable();
    var id = ko.observable();
    this.isChecked = ko.observable();
    this.justification = ko.observable();
    this.srIDtoPass = ko.observable();
    this.statusChangeMsg = ko.observable("");
    self.isCheckedStore = ko.observable();
    self.statusCheck = ko.observable(false);
    Params.dashboard.headerName(self.resource.serviceRequestHeader);
    self.headerText = ko.observableArray([{
        "headerText": self.resource.searchByRequestName,
        "field": "name",
        "renderer": oj.KnockoutTemplateUtils.getRenderer("templateIdentifier1", true)
      },
      {
        "headerText": self.resource.searchByRequestDescription,
        "field": "description"
      },
      {
        "headerText": self.resource.productName,
        "field": "product"
      },
      {
        "headerText": self.resource.requestType,
        "field": "taskType"
      },
      {
        "headerText": self.resource.activationStatus,
        "field": "activationStatus",
        "renderer": oj.KnockoutTemplateUtils.getRenderer("activationAlert", true)
      },
      {
        "headerText": self.resource.copy,
        "renderer": oj.KnockoutTemplateUtils.getRenderer("alert_template", true)
      }
    ]);
    var i;
    self.openCreate = function () {
      Params.baseModel.registerComponent("service-requests-train", "service-requests");
      Params.dashboard.loadComponent("service-requests-train", {}, self);
    };
    self.copyAlert = function (event) {
      id = event.requestId;
      for (var j = 0; j < self.nameList().length; j++) {
        if (self.nameList()[j] === event.name) {
          location = j;
        }
      }
      $("#copyRequest").trigger("openModal");
    };
    self.closeCopy = function () {
      $("#copyRequest").hide();
    };
    self.copyComponent = function () {
      if (id) {
        ServiceRequestSearch.readData(id).done(
          function (data) {
            for (i = 0; i < data.serviceRequestResponse[0].form.fields.length; i++) {
              if (!(data.serviceRequestResponse[0].form.fields[i].type === "SBH" || data.serviceRequestResponse[0].form.fields[i].type === "SCH")) {
                data.serviceRequestResponse[0].form.fields[i].validation.isMandatory = ko.observable(data.serviceRequestResponse[0].form.fields[i].validation.isMandatory);
              }
            }
            data.serviceRequestResponse[0].id = null;
            data.serviceRequestResponse[0].form.id = null;
            Params.baseModel.registerComponent("service-requests-train", "service-requests");
            Params.dashboard.loadComponent("service-requests-train", {
              SRDefinitionDTO: data.serviceRequestResponse[0]
            }, self);
          }
        );
      }
      if (location >= 0) {
        ServiceRequestSearch.readData(self.idList()[location]).done(
          function (data) {
            for (i = 0; i < data.serviceRequestResponse[0].form.fields.length; i++) {
              if (!(data.serviceRequestResponse[0].form.fields[i].type === "SBH" || data.serviceRequestResponse[0].form.fields[i].type === "SCH")) {
                data.serviceRequestResponse[0].form.fields[i].validation.isMandatory = ko.observable(data.serviceRequestResponse[0].form.fields[i].validation.isMandatory);
              }
            }
            data.serviceRequestResponse[0].id = null;
            data.serviceRequestResponse[0].form.id = null;
            Params.baseModel.registerComponent("service-requests-train", "service-requests");
            Params.dashboard.loadComponent("service-requests-train", {
              SRDefinitionDTO: data.serviceRequestResponse[0]
            }, self);
          }
        );
      }
    };
    self.showOptions = function () {
      if (self.moreOptions()) {
        self.moreOptions(false);
      } else {
        self.moreOptions(true);
      }
    };
    self.viewData = function (data) {
      ServiceRequestSearch.readData(data.requestId).done(function (data) {
        self.showButtons = ko.observable(true);
        Params.baseModel.registerComponent("service-request-approval-view", "service-requests");
        Params.dashboard.loadComponent("service-request-approval-view", {
          SRDefinitionDTO: data.serviceRequestResponse[0],
          showButtons: self.showButtons()
        }, self);
      });
    };
    ServiceRequestSearch.fetchList().done(function (data) {
      if (data.serviceRequestResponse.length === 0) {
        self.noRequests(true);
      }
      for (i = 0; i < data.serviceRequestResponse.length; i++) {
        if (data.serviceRequestResponse[i].name) {
          self.recentServiceRequest.push({
            label: data.serviceRequestResponse[i].name,
            date: Params.baseModel.formatDate(data.serviceRequestResponse[i].creationDate),
            requestId: data.serviceRequestResponse[i].id

          });
        }
      }
    });
    ServiceRequestSearch.fetchTransactionTypes().done(function (data) {
      self.transactionTypesLoaded(true);
      for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.transactionTypeData.push({
          label: data.enumRepresentations[0].data[i].description,
          code: data.enumRepresentations[0].data[i].code
        });
      }
    });
    ServiceRequestSearch.fetchStatuses().done(function (data) {
      for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.statusesData.push({
          label: data.enumRepresentations[0].data[i].description,
          code: data.enumRepresentations[0].data[i].code
        });
      }
    });
    ServiceRequestSearch.fetchSeverity().done(function (data) {
      for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.severityData.push({
          label: data.enumRepresentations[0].data[i].description,
          code: data.enumRepresentations[0].data[i].code
        });
      }
    });
    ServiceRequestSearch.fetchModuleTypes().done(function (data) {
      self.moduleTypesLoaded(true);
      for (i = 0; i < data.productResponse.length; i++) {
        self.moduleData.push({
          label: data.productResponse[i].productName,
          code: data.productResponse[i].productName
        });
      }
    });
    self.searchRequests = function () {
      if (self.requestNameParameter() || self.descriptionParameter() || self.moduleTypeParameter() || self.taskTypeParameter()) {
        ServiceRequestSearch.fetchData(self.requestNameParameter(), self.descriptionParameter(), self.moduleTypeParameter(), self.taskTypeParameter()).done(function (data) {
          var tempData = null;
          tempData = $.map(data.serviceRequestResponse, function (v) {
            self.idList.push(v.id);
            self.nameList.push(v.name);
            var newObj = {};
            newObj.srid = v.id;
            newObj.name = v.name;
            newObj.description = v.description;
            newObj.isActive = v.isActive;
            if (v.isActive) {
              newObj.activationStatus = self.resource.active;
            } else {
              newObj.activationStatus = self.resource.inactive;
            }
            for (i = 0; i < self.transactionTypeData().length; i++) {
              if (v.requestType === self.transactionTypeData()[i].code) {
                self.taskTypeLabel(self.transactionTypeData()[i].label);
              }
            }
            newObj.taskType = self.taskTypeLabel();
            newObj.product = v.product;
            return newObj;
          });
          self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempData, {
            idAttribute: "name"
          })));
          self.searchResults(true);
        });
      } else {
        $("#filter").trigger("openModal");
      }
    };
    self.closeSearchResults = function () {

      self.searchResults(false);
      self.requestNameParameter("");
      self.descriptionParameter("");
      self.moduleTypeParameter("");
      self.taskTypeParameter("");
    };
    self.onSelectedInTable = function (event) {
      var index;
      for (var j = 0; j < self.nameList().length; j++) {
        if (self.nameList()[j] === event.name) {
          index = j;
        }
      }
      if (index >= 0) {
        ServiceRequestSearch.readData(self.idList()[index]).done(
          function (data) {
            self.showButtons = ko.observable(true);
            Params.baseModel.registerComponent("service-request-approval-view", "service-requests");
            Params.dashboard.loadComponent("service-request-approval-view", {
              SRDefinitionDTO: data.serviceRequestResponse[0],
              showButtons: self.showButtons()
            }, self);
          }
        );
      }
    };
    self.editAtivationStatus = function (event) {
      self.srIDtoPass(event.srid);
      if (event.isActive) {
        self.isChecked(true);
        self.isCheckedStore(true);
      } else {
        self.isChecked(false);
        self.isCheckedStore(false);
      }
      self.justification("");
      $("#actStat").trigger("openModal");
    };
    self.changeStatus = function (data) {
      var tracker = document.getElementById("text-area-remarks");
      if (tracker.valid === "valid") {
        if (self.isChecked() === self.isCheckedStore()) {
          self.statusChangeMsg(self.resource.statusChangeMsg);
          self.statusCheck(false);
          self.statusCheck(true);
          return;
        }
        ServiceRequestSearch.updateStatus(data.srIDtoPass(), self.justification()).done(function () {
          $("#actStat").hide();
          self.justification("");
          self.statusChangeMsg("");
          self.searchRequests();
        });
      }
    };
    $(document).on("mouseover", ".onReq", function () {
      self.recentServiceRequestHover(false);
      self.recentServiceRequestHoverOptions(true);
    });
    $(document).on("mouseout", ".onReq", function () {
      self.recentServiceRequestHoverOptions(false);
      self.recentServiceRequestHover(true);
    });
    self.goBack = function () {
      self.loadSecondScreen(true);
      Params.dashboard.loadComponent("service-requests-base", {}, self);
    };
    self.closePopUp = function () {
      self.justification("");
      var tracker = document.getElementById("text-area-remarks");
      tracker.reset();
      $("#filter").hide();
      $("#actStat").hide();
    };
  };
});