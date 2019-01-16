define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "./model",
  "ojL10n!resources/nls/system-configuration-home",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext",
  "ojs/ojpopup",
  "ojs/ojdialog"
], function(oj, ko, $, BaseLogger, SystemConfigurationHome, Resourcebundle) {
  "use strict";
  return function(params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    self.nls = Resourcebundle;
    self.isMultyEntity = ko.observable("YES");
    self.disableMultiEntityButtonSet = ko.observable(false);
    self.isDomainSharing = ko.observable("YES");
    self.timezones = ko.observable([]);
    params.dashboard.headerName(self.nls.systemConfiguration);
    self.validationTracker = ko.observable();
    self.entitiesFetched = ko.observable(false);
    self.currentEntity = ko.observable();
    self.currentEntityName = ko.observable();
    self.defaultEntityFetched = ko.observable();
    self.timeZoneLoaded = ko.observable(false);
    self.entities = ko.observableArray([]);
    self.newEntities = ko.observableArray([]);
    self.timeZone = ko.observable("");
    self.systemConfigurationStatus = "";
    self.showTimeZoneDropDown = ko.observable(false);
    var batchPayLoad = {
      batchDetailRequestList: []
    };
    params.baseModel.registerComponent("tooltip", "home");
    self.multiEntityPopup = function(open) {
      var popup = document.querySelector("#isMultientity");
      if (open) {
        var listener = popup.open("multiEntity-tooltip-holder");
        popup.addEventListener("ojOpen", listener);
      } else
        popup.close();
    };
    self.applyPattern = function(input, pattern, position) {
      var x = input;
      var output = "";
      if (x.length > pattern[position] && position < pattern.length) {
        x = x.substr(pattern[position]);
        output = self.applyPattern(x, pattern, position + 1);
        output = input.substr(0, pattern[position]) + "-" + output;
        return output;
      }
      output += x;
      return output;

    };
    SystemConfigurationHome.fetchSystemConfigurationDetails().done(function(data) {
      if (data.configResponseList[0].propertyValue) {
        self.systemConfigurationStatus = data.configResponseList[0].propertyValue;
      }
      SystemConfigurationHome.getEntitiesList().done(function(data) {
        if (data.businessUnitDTOs.length > 0) {
          self.entities(data.businessUnitDTOs);
          if (self.entities().length > 1) {
            self.disableMultiEntityButtonSet(true);
          }
          if (self.systemConfigurationStatus === "false" && self.entities().length === 1) {
            self.defaultEntityFetched(self.entities()[0].businessUnitCode);
          }
          var contentURL = {
            value: "/configurations/variable/dayoneconfig/properties/TIME_ZONE?environmentId=OBDX"
          };
          var obj = {};
          for (var i = 0; i < self.entities().length; i++) {
            self.entities()[i].temp_edit = ko.observable(false);
            self.entities()[i].businessUnitName = ko.observable(self.entities()[i].businessUnitName);
            self.entities()[i].temp_configurationDone = ko.observable(false);
            self.entities()[i].temp_timeZone = ko.observable("");
            self.entities()[i].temp_isNew = false;

            obj = {
              methodType: "GET",
              uri: contentURL,
              headers: {
                "X-Target-Unit": self.entities()[i].businessUnitCode,
                "Content-Id": i + 1,
                "Content-Type": "application/json"
              }
            };
            batchPayLoad.batchDetailRequestList.push(obj);
          }
          if (self.systemConfigurationStatus === "false" && self.entities().length === 1) {
            self.entities()[0].temp_edit(true);
          }
          if (self.systemConfigurationStatus === "true") {
            SystemConfigurationHome.fireBatch(batchPayLoad).done(function(batchData) {
              if (batchData && batchData.batchDetailResponseDTOList) {
                var batchResponse = null;
                for (var s = 0; s < batchData.batchDetailResponseDTOList.length; s++) {
                  batchResponse = JSON.parse(batchData.batchDetailResponseDTOList[s].responseText);
                  if (batchResponse.configResponseList) {
                    self.entities().forEach(function(entity) {
                      if (entity.businessUnitCode === batchResponse.configResponseList[0].determinantValue && batchResponse.configResponseList[0].propertyValue) {
                        entity.temp_timeZone($.parseHTML(batchResponse.configResponseList[0].propertyValue)[0].data);
                      }
                    });
                  }
                }
                self.showTimeZoneDropDown(true);
              } else {
                self.showTimeZoneDropDown(true);
              }
            });
          } else {
            self.showTimeZoneDropDown(true);
          }
        }
        self.entitiesFetched(true);
      });
    });
    SystemConfigurationHome.getTimezones().then(function(data) {
      self.timezones(data.enumRepresentations[0].data);
      self.timeZoneLoaded(true);
    });
    self.editEntity = function(data) {
      self.entities()[data].temp_edit(!self.entities()[data].temp_edit());
    };
    var payload = null,
      j = 0;
    self.saveEntity = function(data) {
      j = data;
      payload = self.entities()[data];
      SystemConfigurationHome.saveEntities(ko.mapping.toJSON(payload, {
        "ignore": ["temp_edit", "temp_configurationDone", "temp_isNew", "temp_timeZone"]
      }), payload.businessUnitCode).done(function() {
        self.entities()[j].temp_edit(!self.entities()[j].temp_edit());
      });
      var sendData = ko.toJSON({
        categoryId: "dayoneconfig",
        configRequestList: [{
          propertyId: "TIME_ZONE",
          propertyValue: self.entities()[data].temp_timeZone(),
          environmentId: "OBDX",
          determinantValue: self.entities()[data].businessUnitCode,
          factoryShippedFlag: "Y",
          propertyComments: self.nls.propCommentsTimeZone
        }]
      });
      SystemConfigurationHome.saveTimeZone(sendData, payload.businessUnitCode);
    };
    self.addEntity = function() {
      self.newEntities.push({
        businessUnitCode: "",
        businessUnitName: ko.observable(""),
        temp_timeZone: ko.observable(""),
        temp_add: ko.observable(true),
        temp_isNew: true,
        temp_configurationDone: ko.observable(false)
      });
    };
    self.deleteEntity = function(data) {
      self.newEntities.splice(data, 1);
    };
    self.editNewEntity = function(data) {
      self.newEntities()[data].temp_add(!self.newEntities()[data].temp_add());
    };
    self.saveNewEntity = function(data) {
      self.newEntities()[data].temp_add(!self.newEntities()[data].temp_add());
      var entityPayload = {
        businessUnitCode: self.newEntities()[data].businessUnitCode,
        businessUnitName: self.newEntities()[data].businessUnitName
      };
      SystemConfigurationHome.createEntity(ko.toJSON(entityPayload)).done(function() {
        var sendData1 = ko.toJSON({
          categoryId: "dayoneconfig",
          configRequestList: [{
            propertyId: "TIME_ZONE",
            propertyValue: self.newEntities()[data].temp_timeZone(),
            environmentId: "OBDX",
            determinantValue: self.newEntities()[data].businessUnitCode,
            factoryShippedFlag: "Y",
            propertyComments: self.nls.propCommentsTimeZone
          }]
        });
        SystemConfigurationHome.saveTimeZone(sendData1, self.newEntities()[data].businessUnitCode);
      });
    };
    self.goToSystemConfiguration = function() {
      if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      for (var i = 0; i < self.newEntities().length; i++) {
        if (self.newEntities()[i].temp_add() === false) {
          self.entities().push(self.newEntities()[i]);
        }
      }
      params.baseModel.registerComponent("system-configuration-welcome", "system-configuration");
      params.dashboard.loadComponent("system-configuration-welcome", {}, self);
    };
    self.toCleanJson = function(input) {
      return ko.toJSON(input, function(key, value) {
        if (value === null || value === undefined) {
          return false;
        } else if (key && typeof key === "string") {
          if (!key.replace(/^temp_.*/g, "")) {
            return false;
          }
          return value;

        }
        return value;

      });
    };
  };
});
