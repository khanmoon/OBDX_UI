define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/access-point",
  "ojs/ojknockout-validation",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojradioset",
  "ojs/ojlabel",
  "ojs/ojswitch",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojfilepicker"
], function(oj, ko, $, AccessPointCreateModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerComponent("access-point-view", "access-point");
    rootParams.baseModel.registerComponent("access-point-search", "access-point");
    rootParams.dashboard.headerName(self.nls.accessPoint.headerName);
    self.accessPointId = self.id ? self.id : ko.observable();
    self.accessType = self.accessType() !== undefined ? self.accessType : ko.observable("EXT");
    self.accessPointStatus = self.accessPointStatus() !== undefined ? self.accessPointStatus : ko.observable("N");
    self.accessPointDescription = self.description ? self.description : ko.observable();
    self.clientId = self.clientId() !== undefined ? self.clientId : ko.observable();
    self.accessPointInstance = ko.observable();
    self.payloadObj = {};
    self.statusSwitch = self.statusSwitch ? self.statusSwitch : ko.observable(false);
    self.isExternal = self.isExternal !== undefined ? self.isExternal : ko.observable(true);
    self.version = self.version() !== undefined ? self.version : ko.observable();
    self.accessTypeOptions = self.accessTypeOptions ? self.accessTypeOptions : ko.observableArray([]);
    self.dataLoaded = ko.observable(false);
    self.isHeadlessMode = self.isHeadlessMode() !== undefined ? self.isHeadlessMode : ko.observable(false);
    self.twoFARequired = self.twoFARequired() !== undefined ? self.twoFARequired : ko.observable(false);
    self.scopes = ko.observableArray([]);
    self.scopeOptions = self.scopeOptions ? self.scopeOptions : ko.observableArray([]);
    self.selectedScopes = ko.observableArray([]);
    self.groupValid = ko.observable();
    self.isMenuSupported = ko.observable(true);
    self.defaultSelect = self.defaultSelect() !== undefined ? self.defaultSelect : ko.observable(false);
    self.uploadedImage = self.uploadedImage !== undefined ? self.uploadedImage : ko.observable();
    self.contentId = self.contentId !== undefined ? self.contentId : ko.observable();
    self.selfOnboard = self.selfOnboard() !== undefined ? self.selfOnboard : ko.observable(false);
    self.skipLoginFlow = self.skipLoginFlow() !== undefined ? self.skipLoginFlow : ko.observable(false);
    if (self.params && self.params.mode === "editAfterUpdate") {
      self.mode = "edit";
      self.isMenuSupported(self.params.data.isMenuSupported());
      if (self.accessPointStatus() === "Y") {
        self.statusSwitch(true);
      } else {
        self.statusSwitch(false);
      }
    } else {
      self.mode = "create";
      if (self.accessPointStatus() === "Y") {
        self.statusSwitch(true);
      } else {
        self.statusSwitch(false);
      }
    }

    if (self.mode === "create" || self.mode === "edit") {
      AccessPointCreateModel.fetchAccessPointType().done(function(data) {
        self.accessTypeOptions.removeAll();
        for (var i = 0; i < data.enumRepresentations.length; i++) {
          for (var j = 0; j < data.enumRepresentations[i].data.length; j++) {
            self.accessTypeOptions.push({
              description: data.enumRepresentations[i].data[j].description,
              code: data.enumRepresentations[i].data[j].code
            });
          }
        }
        AccessPointCreateModel.fetchScope().done(function(data) {
          self.scopeOptions.removeAll();
          for (var i = 0; i < data.accessPointScopeListDTO.length; i++) {
            self.scopeOptions.push({
              id: data.accessPointScopeListDTO[i].id,
              description: data.accessPointScopeListDTO[i].description
            });
          }
          if (self.params.mode === "editAfterCreate" || self.params.mode === "editAfterUpdate") {
            for (var k = 0; k < self.params.data.scopes().length; k++) {
              for (var j = 0; j < self.scopeOptions().length; j++) {
                if (self.params.data.scopes()[k] === self.scopeOptions()[j].id) {
                  self.selectedScopes.push(self.scopeOptions()[j].description);
                }
              }
            }
          }
          self.dataLoaded(true);
        });
      });
    }

    var getNewKoModel = function() {
      var KoModel = AccessPointCreateModel.getNewModel();
      return ko.mapping.fromJS(KoModel);
    };

    self.preparePayload = function() {
      var tracker = document.getElementById("tracker");
      if (tracker.valid === "valid") {
        self.accessPointInstance(getNewKoModel().accessPointModel);
        self.accessPointInstance().id(self.accessPointId());
        self.accessPointInstance().description(self.accessPointDescription());
        self.accessPointInstance().type(self.accessType());
        self.accessPointInstance().headlessMode(self.isHeadlessMode());
        self.accessPointInstance().twoFactorAuthentication(self.twoFARequired());
        self.accessPointInstance().selfOnboard(self.selfOnboard());
        self.accessPointInstance().clientId(self.clientId());
        self.accessPointInstance().isMenuSupported(self.isMenuSupported());
        self.accessPointInstance().skipLoginFlow(self.skipLoginFlow());
        if (self.statusSwitch()) {
          self.accessPointStatus("Y");
        } else {
          self.accessPointStatus("N");
        }
        if (!self.isExternal()) {
          self.accessPointInstance().defaultSelect(self.defaultSelect());
          self.accessPointInstance().scopes([]);
          self.accessPointInstance().imgRefno(self.contentId());
        } else {
          for (var i = 0; i < self.selectedScopes().length; i++) {
            for (var j = 0; j < self.scopeOptions().length; j++) {
              if (self.selectedScopes()[i] === self.scopeOptions()[j].description) {
                self.scopes.push(self.scopeOptions()[j].id);
              }
            }
          }
          self.accessPointInstance().scopes(self.scopes());
          self.accessPointInstance().imgRefno(self.contentId());
        }
        self.accessPointInstance().status(self.accessPointStatus());
        self.accessPointInstance().description(self.accessPointDescription());
        self.accessPointInstance().version(self.version());
        self.payloadObj = self.accessPointInstance();
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.submit = function() {
      self.preparePayload();
      if (self.groupValid() !== "valid") {
        return;
      }
      if (self.mode === "create") {
        rootParams.dashboard.loadComponent("access-point-view", {
          data: self.payloadObj,
          mode: "reviewAfterCreate"
        }, self);
      } else {
        rootParams.dashboard.loadComponent("access-point-view", {
          data: self.payloadObj,
          mode: "reviewAfterEdit"
        }, self);
      }
    };

    self.back = function() {
      rootParams.dashboard.loadComponent("access-point-search", {}, self);
    };

    self.accessTypeChangeHandler = function() {
      if (self.accessType() === "EXT")
        self.isExternal(true);
      else {
        self.isExternal(false);
        self.selectedScopes([]);
      }
    };

    self.imageSelectListener = function(event) {
      var files = event.detail.files[0];
      self.uploadedImage(files.name);
      var formData = new FormData();
      formData.append("file", files);

      AccessPointCreateModel.uploadImage(formData).then(function(data) {
        self.contentId(data.contentDTOList[0].contentId.value);
      }).fail(
        self.contentId("")
      );
    };

  };
});
