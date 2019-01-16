define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/access-point",
  "ojs/ojknockout-validation",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojknockout",
  "promise",
  "ojs/ojgauge",
  "ojs/ojarraydataprovider"
], function(oj, ko, $, AccessPointSearchModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerComponent("access-point-create", "access-point");
    rootParams.baseModel.registerComponent("access-point-view", "access-point");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.dashboard.headerName(self.nls.accessPoint.headerName);
    self.accessId = ko.observable();
    self.id = ko.observable();
    self.accessDescription = ko.observable();
    self.description = ko.observable();
    self.accessType = ko.observable();
    self.accessPointStatus = ko.observable();
    self.clientId = ko.observable();
    self.version = ko.observable();
    self.showSearchData = ko.observable(false);
    self.pagingDatasource = ko.observable();
    self.isHeadlessMode = ko.observable(false);
    self.twoFARequired = ko.observable(false);
    self.defaultSelect = ko.observable(false);
    self.selfOnboard = ko.observable(false);
    self.imgRefno = ko.observable();
    self.isMenuSupported = ko.observable();
    self.scopes = ko.observableArray([]);
    self.skipLoginFlow = ko.observable(false);
    self.mode = "search";

    if (self.params.data !== undefined) {
      self.pagingDatasource(self.params.data.pagingDatasource());
      self.showSearchData(self.params.data.showSearchData());
      self.accessId(self.params.data.accessId());
      self.accessDescription(self.params.data.accessDescription());
    }

    self.headerText = [{
        "headerText": self.nls.accessPoint.accessPointNameAndId,
        "renderer": oj.KnockoutTemplateUtils.getRenderer("accessPointNameAndId", true)
      },
      {
        "headerText": self.nls.accessPoint.accessType,
        "renderer": oj.KnockoutTemplateUtils.getRenderer("accessType", true)
      }
    ];

    self.accessParams = {
      accessPoint: "",
      description: ""
    };

    self.createAccessPoint = function() {
      rootParams.dashboard.loadComponent("access-point-create", {
        "mode": "create"
      }, self);
    };

    self.prepareDatasource = function(data) {
      self.pagingDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(data, {
        idAttribute: ["accessPoint"]
      })));
    };

    self.search = function() {
      if (!self.accessId() && !self.accessDescription()) {
        $("#searchError").trigger("openModal");
      } else {
        self.accessParams.accessPoint = self.accessId();
        self.accessParams.description = self.accessDescription();
        AccessPointSearchModel.search(self.accessParams).done(function(data) {
          var tempData = $.map(data.accessPointListDTO, function(v) {
            var newObj = {};
            newObj.accessPoint = v.id;
            newObj.description = v.description;
            if (v.type === "INT") {
              newObj.accessType = self.nls.accessPoint.internal;
            } else {
              newObj.accessType = self.nls.accessPoint.external;
            }
            return newObj;
          });
          self.prepareDatasource(tempData);
          self.showSearchData(true);
        });
      }
    };

    self.view = function(data) {
      self.accessParams.accessPoint = data.accessPoint;
      AccessPointSearchModel.getAccessPoint(self.accessParams).done(function(data) {
        self.id(data.accessPointDTO.id);
        self.accessType(data.accessPointDTO.type);
        self.clientId(data.accessPointDTO.clientId);
        self.description(data.accessPointDTO.description);
        self.accessPointStatus(data.accessPointDTO.status);
        self.isHeadlessMode(data.accessPointDTO.headlessMode);
        self.twoFARequired(data.accessPointDTO.twoFactorAuthentication);
        self.defaultSelect(data.accessPointDTO.defaultSelect);
        self.selfOnboard(data.accessPointDTO.selfOnboard);
        self.isMenuSupported(data.accessPointDTO.isMenuSupported);
        self.imgRefno(data.accessPointDTO.imgRefno.value);
        self.scopes(data.accessPointDTO.scopes);
        self.version(data.accessPointDTO.version);
        self.skipLoginFlow(data.accessPointDTO.skipLoginFlow);
        rootParams.dashboard.loadComponent("access-point-view", {
          "mode": "view",
          "data": self
        }, self);
      });
    };

    self.clear = function() {
      self.accessId("");
      self.accessDescription("");
      self.showSearchData(false);
    };

    self.closeDialogBox = function() {
      $("#searchError").hide();
    };

  };
});
