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
  "ojs/ojswitch"
], function(oj, ko, $, AccessPointViewModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerComponent("access-point-search", "access-point");
    rootParams.dashboard.headerName(self.nls.accessPoint.headerName);
    self.payload = ko.observable();
    self.httpStatus = ko.observable();
    self.transactionStatus = ko.observable();
    self.dataLoaded = ko.observable(false);
    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.nls.accessPoint.review;
    self.reviewTransactionName.reviewHeader = self.nls.accessPoint.confirmScreenheader;

    if (self.params.mode === "view") {
      self.mode = "view";
      self.accessTypeOptions = ko.observableArray([]);
      self.scopeOptions = ko.observableArray([]);
      self.selectedScopes = ko.observableArray([]);
      self.isExternal = ko.observable(false);
      self.uploadedImage = ko.observable();
      self.contentId = ko.observable();
      self.statusSwitch = ko.observable(false);

      if (self.params.data !== undefined) {
        if (self.params.data.accessPointStatus() === "Y") {
          self.statusSwitch(true);
        } else {
          self.statusSwitch(false);
        }
      }

      AccessPointViewModel.fetchAccessPointType().done(function(data) {
        for (var i = 0; i < data.enumRepresentations.length; i++) {
          for (var j = 0; j < data.enumRepresentations[i].data.length; j++) {
            self.accessTypeOptions.push({
              description: data.enumRepresentations[i].data[j].description,
              code: data.enumRepresentations[i].data[j].code
            });
          }
        }
        AccessPointViewModel.fetchScope().done(function(data) {
          for (var k = 0; k < data.accessPointScopeListDTO.length; k++) {
            self.scopeOptions.push({
              id: data.accessPointScopeListDTO[k].id,
              description: data.accessPointScopeListDTO[k].description
            });
          }

          for (var i = 0; i < self.scopes().length; i++) {
            for (var j = 0; j < self.scopeOptions().length; j++) {
              if (self.scopeOptions()[j].id === self.scopes()[i]) {
                self.selectedScopes.push(self.scopeOptions()[j].description);
              }
            }
          }
          self.dataLoaded(true);
        });
      });

      if (self.params.data.imgRefno()) {
        AccessPointViewModel.readImage(self.params.data.imgRefno()).then(function(data) {
          self.uploadedImage(data.contentDTOList[0].title);
          self.contentId(data.contentDTOList[0].contentId.value);
        });
      }

      if (self.accessType() === "EXT") {
        self.isExternal(true);
      }

    } else {
      if (self.params.data.imgRefno()) {
        AccessPointViewModel.readImage(self.params.data.imgRefno()).then(function(data) {
          self.uploadedImage(data.contentDTOList[0].title);
          self.contentId(data.contentDTOList[0].contentId.value);
        });
      }
      self.dataLoaded(true);
    }

    self.backReview = function() {
      if (self.mode === "edit") {
        rootParams.dashboard.loadComponent("access-point-create", {
          "mode": "editAfterUpdate",
          "data": self.params.data
        }, self);
      } else {
        rootParams.dashboard.loadComponent("access-point-create", {
          "mode": "editAfterCreate",
          "data": self.params.data
        }, self);
      }
    };

    self.updateAccessPoint = function() {
      rootParams.dashboard.loadComponent("access-point-create", {
        "mode": "editAfterUpdate",
        "data": self.params.data
      }, self);
    };

    self.confirm = function() {
      self.payload = {
        "accessPointDTO": self.params.data
      };
      if (self.mode === "edit") {
        AccessPointViewModel.updateAccessPoint(ko.mapping.toJSON(self.payload), self.params.data.id()).done(function(data, status, jqXhr) {
          self.httpStatus(jqXhr.status);
          self.transactionStatus(data.status);
          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.nls.accessPoint.updateAccessPoint
          }, self);
        });
      } else {
        AccessPointViewModel.createAccessPoint(ko.mapping.toJSON(self.payload)).done(function(data, status, jqXhr) {
          self.httpStatus(jqXhr.status);
          self.transactionStatus(data.status);
          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.nls.accessPoint.createAccessPoint
          }, self);
        });
      }
    };

    self.cancel = function() {
      $("#reviewCancel").trigger("openModal");
    };

    self.yes = function() {
      rootParams.dashboard.loadComponent("access-point-search", {}, self);
    };

    self.no = function() {
      $("#reviewCancel").hide();
    };

    self.backView = function() {
      rootParams.dashboard.loadComponent("access-point-search", {
        "mode": "search",
        "data": self.params.data
      }, self);
    };

  };
});
