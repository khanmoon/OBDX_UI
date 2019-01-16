define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/access-point-group",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojlabel",
  "ojs/ojtable",
  "ojs/ojcheckboxset",
  "ojs/ojarraytabledatasource",
  "ojs/ojvalidationgroup",
  "ojs/ojradioset"
], function(oj, ko, $, AccessPointGroupCreateModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    self.invalidInput = ko.observable(false);
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerComponent("access-point-group-view", "access-point");
    rootParams.baseModel.registerComponent("access-point-group-search", "access-point");
    rootParams.dashboard.helpComponent.componentName("access-point-group-create");
    rootParams.baseModel.registerComponent("limit-package", "financial-limit-package");
    rootParams.dashboard.headerName(self.nls.accessPointGroup.headerName);
    self.payloadObj = {};
    self.dataLoaded = ko.observable(false);
    self.version = self.version() !== undefined ? self.version : ko.observable();
    self.externalAccessPoints = ko.observableArray([]);
    self.internalAccessPoints = ko.observableArray([]);
    self.selectedExternalAccessPoints = ko.observableArray([]);
    self.selectedInternalAccessPoints = ko.observableArray([]);
    self.externalDataSource = ko.observable();
    self.internalDataSource = ko.observable();
    self.groupCode = ko.observable();
    self.description = ko.observable();
    self.groupValid = ko.observable();
    self.mappedAccessPoints = [];
    self.groupType = ko.observable(self.nls.accessPointGroup.internal);

    if (self.params.mode === "editAfterCreate" || self.params.mode === "editAfterUpdate") {
      self.groupCode(self.params.data.groupCode);
      self.description(self.params.data.description);
      self.version(self.params.data.version);
    }
    AccessPointGroupCreateModel.getAccessPointGroups().then(function(data) {
      $.map(data.accessPointGroupListDTO, function(v) {
        if (!self.groupCode() || (self.groupCode() && v.accessPointGroupId !== self.groupCode()))
          self.mappedAccessPoints = self.mappedAccessPoints.concat(v.accessPoints);
      });

      AccessPointGroupCreateModel.fetchAccessPoint("INT").then(function(data) {
        self.internalAccessPoints([]);
        self.externalAccessPoints([]);
        for (var i = 0; i < data.accessPointListDTO.length; i++) {
          self.selected = ko.observable([]);
          var disabled = false;
          if (self.params.data && (ko.utils.arrayFilter(self.params.data.selectedInternalAccessPoints, function(accessPoint) {
              return accessPoint.id === data.accessPointListDTO[i].id;
            })).length > 0) {
            self.selected(["checked"]);
            self.groupType(self.nls.accessPointGroup.internal);
            self.selectedInternalAccessPoints.push(data.accessPointListDTO[i]);
          }
          if ((ko.utils.arrayFilter(self.mappedAccessPoints, function(mappedAccessPoint) {
              return mappedAccessPoint.id === data.accessPointListDTO[i].id;
            })).length > 0) {
            disabled = true;
          }
          data.accessPointListDTO[i].selected = self.selected;
          data.accessPointListDTO[i].disabled = disabled;
          self.internalAccessPoints.push(data.accessPointListDTO[i]);
        }
        self.internalDataSource(new oj.ArrayTableDataSource(self.internalAccessPoints, {
          idAttribute: "id"
        }));

        AccessPointGroupCreateModel.fetchAccessPoint("EXT").then(function(data) {
          for (var i = 0; i < data.accessPointListDTO.length; i++) {
            self.selected = ko.observable([]);
            var disabled = false;
            if (self.params.data && (ko.utils.arrayFilter(self.params.data.selectedExternalAccessPoints, function(accessPoint) {
                return accessPoint.id === data.accessPointListDTO[i].id;
              })).length > 0) {
              self.selected(["checked"]);
              self.groupType(self.nls.accessPointGroup.external);
              self.selectedExternalAccessPoints.push(data.accessPointListDTO[i]);
            }
            if ((ko.utils.arrayFilter(self.mappedAccessPoints, function(mappedAccessPoint) {
                return mappedAccessPoint.id === data.accessPointListDTO[i].id;
              })).length > 0) {
              disabled = true;
            }
            data.accessPointListDTO[i].selected = self.selected;
            data.accessPointListDTO[i].disabled = disabled;
            self.externalAccessPoints.push(data.accessPointListDTO[i]);
          }
          self.externalDataSource(new oj.ArrayTableDataSource(self.externalAccessPoints, {
            idAttribute: "id"
          }));
          self.dataLoaded(true);
        });
      });
    });

    self.internalColumns = [{
        "renderer": oj.KnockoutTemplateUtils.getRenderer("internalCheckBox", true),
        "headerRenderer": oj.KnockoutTemplateUtils.getRenderer("internalHeaderCheckBox", true),
        "id": "internalCheckboxColumn"
      },
      {
        "headerText": self.nls.accessPointGroup.internal,
        "renderer": oj.KnockoutTemplateUtils.getRenderer("internalCheckBoxLabel", true),
        "id": "internalAccessPointColumn"
      }
    ];

    self.externalColumns = [{
        "renderer": oj.KnockoutTemplateUtils.getRenderer("externalCheckBox", true),
        "headerRenderer": oj.KnockoutTemplateUtils.getRenderer("externalHeaderCheckBox", true),
        "id": "externalCheckboxColumn"
      },
      {
        "headerText": self.nls.accessPointGroup.external,
        "renderer": oj.KnockoutTemplateUtils.getRenderer("externalCheckBoxLabel", true),
        "id": "externalAccessPointColumn"
      }
    ];

    self.setAccessPointGroup = function() {
      var tracker = document.getElementById("tracker");
      var groupTypeFilter = self.nls.accessPointGroup.external;
      if (tracker.valid === "valid") {
        self.payloadObj = {
          "groupCode": self.groupCode(),
          "description": self.description(),
          "internalAccessPoints": self.selectedInternalAccessPoints(),
          "externalAccessPoints": self.selectedExternalAccessPoints(),
          "version": self.version(),
          "type": self.groupType() === groupTypeFilter ? "EXT" : "INT"
        };
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.submit = function() {
      self.setAccessPointGroup();
      if (self.groupValid() !== "valid") {
        return;
      }
      if (self.selectedInternalAccessPoints().length < 2 && self.selectedExternalAccessPoints().length < 2) {
        $("#createError").trigger("openModal");
        return;
      }
      if (self.params.mode === "create" || self.params.mode === "editAfterCreate") {
        rootParams.dashboard.loadComponent("access-point-group-view", {
          data: self.payloadObj,
          mode: "reviewAfterCreate"
        }, self);
      } else {
        rootParams.dashboard.loadComponent("access-point-group-view", {
          data: self.payloadObj,
          mode: "reviewAfterUpdate"
        }, self);
      }
    };

    self.back = function() {
      rootParams.dashboard.loadComponent("access-point-group-search", {}, self);
    };

    self.selectAllExternalListener = function(event) {
      var data = event.detail;
      var externalArrayLength = null;
      if (data !== null) {
        if (data.value.length > 0) {
          externalArrayLength = self.externalAccessPoints().length;
          for (var i = 0; i < externalArrayLength; i++) {
            if (!self.externalAccessPoints()[i].disabled)
              self.externalAccessPoints()[i].selected()[0] = "checked";
          }
        } else {
          externalArrayLength = self.externalAccessPoints().length;
          for (var j = 0; j < externalArrayLength; j++) {
            self.externalAccessPoints()[j].selected()[0] = "";
          }
        }
        self.externalDataSource(new oj.ArrayTableDataSource(self.externalAccessPoints, {
          idAttribute: "id"
        }));
      }
    };

    self.selectAllInternalListener = function(event) {
      var data = event.detail;
      var internalArrayLength = null;
      if (data !== null) {
        if (data.value.length > 0) {
          internalArrayLength = self.internalAccessPoints().length;
          for (var i = 0; i < internalArrayLength; i++) {
            if (!self.internalAccessPoints()[i].disabled)
              self.internalAccessPoints()[i].selected()[0] = "checked";
          }
        } else {
          internalArrayLength = self.internalAccessPoints().length;
          for (var j = 0; j < internalArrayLength; j++) {
            self.internalAccessPoints()[j].selected()[0] = "";
          }
        }
        self.internalDataSource(new oj.ArrayTableDataSource(self.internalAccessPoints, {
          idAttribute: "id"
        }));
      }
    };

    self.syncExternalAccessPoints = function() {
      setTimeout(function() {
        var arrayLength = self.externalAccessPoints().length;
        self.selectedExternalAccessPoints([]);
        for (var i = 0; i < arrayLength; i++) {
          if (self.externalAccessPoints()[i].selected()[0] === "checked") {
            self.selectedExternalAccessPoints.push(self.externalAccessPoints()[i]);
          } else {
            self.selectedExternalAccessPoints.remove(self.externalAccessPoints()[i]);
          }
        }
      }, 0);
    };

    $(document).on("click", "#external-table", self.syncExternalAccessPoints);

    self.syncInternalAccessPoints = function() {
      setTimeout(function() {
        var arrayLength = self.internalAccessPoints().length;
        self.selectedInternalAccessPoints([]);
        for (var i = 0; i < arrayLength; i++) {
          if (self.internalAccessPoints()[i].selected().length > 0 &&
            self.internalAccessPoints()[i].selected()[0] === "checked") {
            self.selectedInternalAccessPoints.push(self.internalAccessPoints()[i]);
          } else {
            self.selectedInternalAccessPoints.remove(self.internalAccessPoints()[i]);
          }
        }
      }, 0);
    };

    $(document).on("click", "#internal-table", self.syncInternalAccessPoints);

    self.closeDialogBox = function() {
      $("#createError").hide();
    };

    self.loadLimitPackage = function() {
      rootParams.dashboard.loadComponent("limit-package", {
        action: "CREATE"
      }, self);
    };

    self.changeGroupType = function() {
      self.selectedInternalAccessPoints([]);
      self.selectedExternalAccessPoints([]);
      for (var i = 0; i < self.internalAccessPoints().length; i++) {
        self.internalAccessPoints()[i].selected()[0] = "";
      }
      for (var j = 0; j < self.externalAccessPoints().length; j++) {
        self.externalAccessPoints()[j].selected()[0] = "";
      }
      self.internalDataSource(new oj.ArrayTableDataSource(self.internalAccessPoints, {
        idAttribute: "id"
      }));
      self.externalDataSource(new oj.ArrayTableDataSource(self.externalAccessPoints, {
        idAttribute: "id"
      }));
    };

  };
});
