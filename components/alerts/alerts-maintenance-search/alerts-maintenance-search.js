define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "./model",
  "ojL10n!resources/nls/alerts",
  "ojs/ojselectcombobox",
  "ojs/ojvalidation",
  "ojs/ojbutton",
  "ojs/ojknockout-validation",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojlistview"
], function(oj, ko, $, BaseLogger, AlertsMaintenanceSearchModel, resourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    Params.baseModel.registerComponent("alerts-maintenance", "alerts");
    self.nls = resourceBundle;
    self.payload = ko.observable();
    self.actionAndEventId = ko.observable();
    self.dataPassing = {};
    self.eventActivityList = ko.observableArray();
    self.fetchedAlerts = self.fetchedAlerts || ko.observableArray();
    self.showDropDown = ko.observable(false);
    self.datasource = self.datasource || {};
    Params.baseModel.registerElement("action-widget");
    self.moduleType = self.moduleType || ko.observable();
    self.moduleTypeList = ko.observableArray();
    self.filterList=ko.observableArray();
    self.moduleTypeLoaded = ko.observable(false);
    self.alertsFetched = self.alertsFetched || ko.observable(false);
    Params.dashboard.headerName(self.nls.alerts.labels.heading);
    var alertData;
    AlertsMaintenanceSearchModel.fetchEventDescriptionList(self.moduleType()).done(function(data) {
      self.eventActivityList(data.activityEvents);
      self.showDropDown(true);
    });
    self.resetForm = function() {
      self.alertsFetched(false);
      self.actionAndEventId("");
      self.moduleType("");
      self.fetchedAlerts.removeAll();
      $(".random").ojSelect("reset");
      self.dataPassing.eventId = null;
      self.dataPassing.activityId = null;
    };
    self.createNew = function() {
      var context = {};
      context.mode = "CREATE";
      Params.dashboard.loadComponent("alerts-maintenance", context, self);
    };
    self.cancelConfirmation = function(){
      Params.dashboard.openDashBoard(self.nls.alerts.labels.confirmationMessage);
    };
    self.closeDialogBox = function() {
      $("#cancelDialog").hide();
    };
    self.setDatasource = function() {
      var searchedAlertsMap = $.map(alertData, function(alert) {
        alert.mode = "VIEW";
        alert.id = alert.alertDTO.alertName;
        return alert;
      });
      self.datasource = new oj.ArrayTableDataSource(searchedAlertsMap, {
        idAttribute: "id"
      });
      self.paginationDataSource = new oj.PagingTableDataSource(self.datasource);
      self.alertsFetched(true);
    };
    AlertsMaintenanceSearchModel.fetchModuleTypeList().done(function(data) {
      for (var i = 0; i < data.enumRepresentations.length; i++) {
        for (var j = 0; j < data.enumRepresentations[i].data.length; j++) {
          self.moduleTypeList.push({
            description: data.enumRepresentations[i].data[j].description,
            code: data.enumRepresentations[i].data[j].code
          });
        }
      }
      self.moduleTypeLoaded(false);
      self.moduleTypeLoaded(true);
    });
    var moduleTypeDispose = self.moduleType.subscribe(function(newValue) {
      self.showDropDown(false);
      AlertsMaintenanceSearchModel.fetchEventDescriptionList(newValue).done(function(data) {
        self.eventActivityList(data.activityEvents);
        self.showDropDown(true);
        self.dataPassing.eventId = null;
        self.dataPassing.activityId = null;
        self.actionAndEventId("");
        $(".random").ojSelect("reset");
      });
    });

    self.eventOptionChangeHandler = function(event) {
      self.filterList = ko.computed(function() {
          return ko.utils.arrayFilter(self.eventActivityList(), function(events) {
            return events.activityEventDescription === event.detail.value;
          });
        });
        if(self.filterList()[0])
        {
        self.selectedData = self.filterList()[0];
        self.actionAndEventId(self.selectedData.activityEventDescription);
        self.dataPassing.eventId = self.selectedData.eventId;
        self.dataPassing.activityId = self.selectedData.activityId;
      }
        self.dispose = function() {
          self.filterList.dispose();
        };
          };

    self.fetchSearchAlerts = function() {
      self.alertsFetched(false);
      AlertsMaintenanceSearchModel.fetchAlerts(self.dataPassing.activityId, self.dataPassing.eventId, self.moduleType()).done(function(data) {
        self.fetchedAlerts(data.alertResponseDTO);
        alertData = $.map(self.fetchedAlerts(), function(alertData) {
          alertData.mode = "";
          return alertData;
        });
        self.setDatasource();
      });
    };
    self.onAlertSelected = function(data) {
      if (Params.baseModel.small()) {
        data.mode = "VIEW";
        data.dataPassing = self.dataPassing;
        Params.dashboard.loadComponent("alerts-maintenance", data, self);
      } else {
        var context = {
          party: {}
        };
        context = data;
        context.mode = "VIEW";
        context.dataPassing = self.dataPassing;
        Params.dashboard.loadComponent("alerts-maintenance", context, self);
      }
    };
    self.dispose = function() {
      moduleTypeDispose.dispose();
    };
  };
});
