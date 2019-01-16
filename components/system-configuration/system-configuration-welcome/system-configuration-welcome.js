define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",

  "./model",
  "ojL10n!resources/nls/system-configuration-welcome",
  "ojs/ojselectcombobox",
  "ojs/ojconveyorbelt"
], function(oj, ko, $, BaseLogger, SystemConfigurationWelcome, Resourcebundle) {
  "use strict";
  return function(params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    self.nls = Resourcebundle;
    self.mode = ko.observable("create");
    self.hostList = ko.observable();
    self.entitiesList = ko.observableArray();
    params.dashboard.headerName(self.nls.headings.systemConfigureHeading);
    self.hostListLoaded = ko.observable(false);
    self.hostSelected = ko.observable(false);
    self.modeSelected = ko.observable(false);
    self.entitiesListLoaded = ko.observable(false);
    self.selectedHost = ko.observable();
    self.disableEntity = ko.observable(false);
    self.disableSelection = ko.observable(false);
    self.newEntityFlag = ko.observable(false);
    self.hostFetched = ko.observable(false);
    self.entityDataLoaded = ko.observable(false);
    self.noOfEntities = 0;
    self.selectedEntity = "";
    params.baseModel.registerComponent("system-configuration-start", "system-configuration");
    self.noOfEntities = self.entities().length;
    SystemConfigurationWelcome.getHostList().done(function(data) {
      self.hostList(data.enumRepresentations[0]);
      self.tempObj = {
        "options": ko.observableArray([])
      };
      for (var k = 0; k < self.hostList().data.length; k++) {
        self.tempObj.options.push({
          key: self.hostList().data[k].code,
          description: self.hostList().data[k].description
        });
      }
      self.hostListLoaded(true);
    });
    self.currentEntity(self.entities()[0].businessUnitCode);
    self.currentEntityName(self.entities()[0].businessUnitName());
    SystemConfigurationWelcome.getSystemConfiguration(self.currentEntity()).done(function(data) {
      if (data.configResponseList[0].propertyValue === "true") {
        self.mode("view");
      } else {
        self.mode("create");
      }
      self.modeSelected(true);
      if (!self.entities()[0].temp_isNew) {
        SystemConfigurationWelcome.getHostSelection(self.currentEntity()).done(function(data) {
          if (data.configResponseList[0].propertyValue) {
            self.selectedHost(data.configResponseList[0].propertyValue);
            self.hostSelected(true);
            self.disableSelection(true);
            self.hostFetched(true);
          } else {
            self.disableSelection(false);
            self.hostSelected(false);
            self.hostFetched(true);
          }
        });
      } else {
        self.disableSelection(false);
        self.hostSelected(false);
        self.hostFetched(true);
        self.entityDataLoaded(true);
      }
    }).fail(function() {
      self.hostFetched(true);
      self.entityDataLoaded(true);
    });
    self.parentOptionChangedHandler = function(event) {
      if (event.detail.value && event.detail.updatedFrom === "internal") {
        self.hostSelected(false);
        ko.tasks.runEarly();
        self.selectedHost(event.detail.value);
        self.hostSelected(true);
      }
    };
    self.optionChangedHandlerButtonset = function(event) {
      if (event.detail.value) {
        self.modeSelected(false);
        self.hostSelected(false);
        self.hostListLoaded(false);
        self.hostFetched(false);
        self.entityDataLoaded(false);
        self.selectedHost("");
        ko.tasks.runEarly();
        SystemConfigurationWelcome.getSystemConfiguration(self.currentEntity()).done(function(data) {
          if (data.configResponseList[0].propertyValue === "true") {
            self.mode("view");
          } else {
            self.mode("create");
          }
          self.modeSelected(true);
          self.hostListLoaded(true);
          var tempEntity = "";
          tempEntity = ko.utils.arrayFilter(self.entities(), function(entity) {
            if (entity.businessUnitCode === event.detail.value) {
              return entity;
            }
          });
          if (tempEntity[0].businessUnitName()) {
            self.currentEntityName(tempEntity[0].businessUnitName());
            self.timeZone(tempEntity[0].temp_timeZone());
            self.newEntityFlag(tempEntity[0].temp_isNew);
            self.selectedEntity = tempEntity[0];
          }
          if (!self.newEntityFlag()) {
            SystemConfigurationWelcome.getHostSelection(self.currentEntity()).done(function(data) {
              if (data.configResponseList[0].propertyValue) {
                self.selectedHost(data.configResponseList[0].propertyValue);
                self.hostSelected(true);
                self.disableSelection(true);
                self.hostFetched(true);
              } else {
                self.disableSelection(false);
                self.hostSelected(false);
                self.hostFetched(true);
              }
            });
          } else {
            self.disableSelection(false);
            self.hostSelected(false);
            self.hostFetched(true);
            self.entityDataLoaded(true);
          }

        }).fail(function() {
          self.hostFetched(true);
          self.entityDataLoaded(true);
        });
      }
    };
  };
});
