define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "./model",
  "ojL10n!resources/nls/authorization",
  "ojs/ojknockout-validation",
  "ojs/ojcheckboxset",
  "ojs/ojtable",
  "ojs/ojrowexpander",
  "ojs/ojflattenedtreetabledatasource",
  "ojs/ojjsontreedatasource"
], function(oj, ko, $, BaseLogger, ApplicationRolesCreateReviewModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.dashboard.headerName(self.nls.common.roleTransactionMapping);
    self.roleDataLoaded = ko.observable(false);
    self.dataSource = ko.observable();
    self.selectedItem = ko.observable();
    self.accessPointTabs = ko.observableArray();
    self.isModuleFetched = ko.observable(false);
    self.dataSourceLoaded = ko.observable(false);
    self.isAccessPointFetched = ko.observable(false);
    self.dataSourceToBePassed = ko.observable();
    self.selectedScopeText = ko.observable();
    self.selectedAccessTypeDisp = ko.observable();
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerComponent("transaction-mapping", "role-transaction-mapping");
    self.columnArray = [{
      "headerText": self.nls.headings.transactions,
      "renderer": oj.KnockoutTemplateUtils.getRenderer("row_template", true)
    }, {
      "headerText": self.nls.headings.perform,
      "headerRenderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl", true),
      "renderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_tmpl", true),
      "id": self.nls.headings.perform
    }, {
      "headerText": self.nls.headings.approve,
      "headerRenderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl", true),
      "renderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_tmpl", true),
      "id": self.nls.headings.approve
    }, {
      "headerText": self.nls.headings.view,
      "id": self.nls.headings.view,
      "headerRenderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl", true),
      "renderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_tmpl", true)
    }];
    if (self.transactionDetails !== undefined) {
      self.appRoleName = ko.observable(self.transactionDetails().transactionSnapshot.applicationRoleDTO.applicationRoleName);
      self.appDescription = ko.observable(self.transactionDetails().transactionSnapshot.applicationRoleDTO.applicationRoleDescription);
      self.selectedUser = ko.observable(self.transactionDetails().transactionSnapshot.applicationRoleDTO.enterpriseRole);
      self.selectedAccessTypeDisp = ko.observable(self.transactionDetails().transactionSnapshot.applicationRoleDTO.accessPointType === "INT" ? self.nls.common.menu.internal : self.nls.common.menu.external);
      self.selectedModuleName = ko.observableArray(self.transactionDetails().transactionSnapshot.modules);
      self.selectedAccessType = ko.observable(self.transactionDetails().transactionSnapshot.applicationRoleDTO.accessPointType);
    }
    self.accessPointTabChangeHandler = function(event) {
      self.createDataSource(event.detail.value);
    };
    var accessTransactionMap = [];

    self.createDataSource = function(accessPoint) {

      if (self.transactionDetails && self.transactionDetails() && self.transactionDetails().transactionSnapshot.accessTransactionMapDTO && self.transactionDetails().transactionSnapshot.applicationRoleDTO && self.transactionDetails().transactionSnapshot.modules) {
        accessTransactionMap = self.transactionDetails().transactionSnapshot.accessTransactionMapDTO;
        ko.utils.arrayForEach(accessTransactionMap, function(data) {
          if (data.accessPoint === accessPoint) {
            var expectedDataSource = [];
            // create a list of expectedDataSource and pass it to grid
            for (var i = 0; i < data.entitlementGroups.length; i++) {
              var parent = {
                attr: {
                  id: "",
                  name: ""
                },
                children: []
              };
              parent.attr.id = data.entitlementGroups[i].id;
              parent.attr.displayName = data.entitlementGroups[i].displayName;
              parent.attr.selected = ko.observableArray();
              var subGroupDTOs = data.entitlementGroups[i].subGroupDTOs;
              var nestedChildren = [];
              for (var j = 0; j < subGroupDTOs.length; j++) {
                var child = {
                  attr: {
                    id: "attr",
                    name: ""
                  },
                  children: []
                };
                child.attr.id = subGroupDTOs[j].id;
                child.attr.displayName = subGroupDTOs[j].displayName;
                child.attr.selected = ko.observableArray();
                nestedChildren.push(child);
                var entitlementData = data.entitlementGroups[i].subGroupDTOs[j].entitlements;
                var innermostChildren = self.parseEntitlement(entitlementData);
                child.children = innermostChildren;
                parent.children = nestedChildren;
              }
              expectedDataSource.push(parent);
            }
            var roleAcessPoint = {
              "accessPoint": null,
              "expectedDataSource": null
            };
            roleAcessPoint.accessPoint = accessPoint;
            roleAcessPoint.expectedDataSource = expectedDataSource;
            self.dataSourceToBePassed(roleAcessPoint);
            self.dataSourceLoaded(true);
          }
        });
      } else if (self.roleAccessPointMap().length > 0) {
        ko.utils.arrayForEach(self.roleAccessPointMap(), function(item) {
          if (item.accessPoint === accessPoint) {
            self.dataSourceToBePassed(item);

          }
        });
        self.dataSourceLoaded(true);

      }
    };
    if (self.selectedAccessType() === "EXT") {
      ko.utils.arrayForEach(self.scopes(), function(item) {
        if (self.selectedScopeType() === item.value)

          self.selectedScopeText(item.text);

      });
    }

    self.showTabBar = function() {
      var temp, i;
      if (self.selectedAccessType() === "INT") {
        ko.utils.arrayForEach(self.accessPoint(), function(item) {
          for (i = 0; i < self.selectedAccessPoint().length; i++) {
            if (item.value === self.selectedAccessPoint()[i]) {
              temp = {
                id: item.value,
                name: item.text
              };
              self.accessPointTabs.push(temp);
            }
          }
        });
        self.isAccessPointFetched(true);
        self.selectedItem(self.accessPointTabs()[0].id);
        self.createDataSource(self.accessPointTabs()[0].id);
      } else {
        self.createDataSource();

      }
    };

    if (self.transactionDetails && self.transactionDetails() && self.transactionDetails().transactionSnapshot.accessTransactionMapDTO && self.transactionDetails().transactionSnapshot.applicationRoleDTO && self.transactionDetails().transactionSnapshot.modules) {
      self.moduleName = ko.observableArray();
      ApplicationRolesCreateReviewModel.fetchModuleName().done(function(data) {
        if (data.enumRepresentations) {
          self.moduleName().push({
            text: self.nls.headings.all,
            value: self.nls.headings.all
          });
          for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
            self.moduleName().push({
              text: data.enumRepresentations[0].data[i].description,
              value: data.enumRepresentations[0].data[i].code
            });
          }
          self.isModuleFetched(true);
        }
      });

      self.selectedAccessPoint = ko.observableArray();
      self.selectedAccessPointArray = ko.observableArray(self.transactionDetails().transactionSnapshot.accessTransactionMapDTO);
      for (var i = 0; i < self.selectedAccessPointArray().length; i++) {
        self.selectedAccessPoint().push(self.selectedAccessPointArray()[i].accessPoint);
      }

      self.accessPoint = ko.observableArray();

      var searchParameters = {
        "accessType": self.selectedAccessType()
      };
      ApplicationRolesCreateReviewModel.fetchAccess(searchParameters).done(function(data) {
        for (var i = 0; i < data.accessPointListDTO.length; i++) {
          self.accessPoint().push({
            text: data.accessPointListDTO[i].description,
            value: data.accessPointListDTO[i].id
          });
        }
        self.showTabBar();

      });
    } else {
      self.showTabBar();
      self.selectedAccessTypeDisp = self.selectedAccessType() === "INT" ? self.nls.common.menu.internal : self.nls.common.menu.external;
      self.isModuleFetched(true);
      self.isAccessPointFetched(true);

    }


    self.parseEntitlement = function(entitlementData) {
      self.entitlements = ko.observableArray();
      self.selectedEntitlements = ko.observableArray();
      for (var i = 0; i < entitlementData.length; i++) {
        var name;
        name = entitlementData[i].entitlementName;
        var action = entitlementData[i].entitlementId.split("_")[entitlementData[i].entitlementId.split("_").length - 1];
        self.entitlementFound = ko.observable(false);
        if (self.entitlements().length !== 0) {
          for (var l = 0; l < self.entitlements().length; l++) {
            if (self.entitlements()[l].attr.id === name) {
              ko.utils.arrayForEach(self.entitlements()[l].actionTypeMap, function(item2) {
                if (item2.action === action) {
                  item2.id = entitlementData[i].entitlementId;
                  item2.action = action;
                  item2.selected = ko.observableArray();
                  if (entitlementData[i].isMapped) {
                    item2.selected().push("true");
                    self.selectedEntitlements().push(item2);
                  }
                  item2.disable = ko.observable("true");
                }
              });
              self.entitlementFound(true);
              break;
            }
          }
        }
        if (!self.entitlementFound()) {
          entitlementData[i].actionTypeMap = [{
            id: "",
            action: self.nls.headings.perform,
            selected: ko.observableArray(),
            disable: ko.observable("true")
          }, {
            id: "",
            action: self.nls.headings.approve,
            selected: ko.observableArray(),
            disable: ko.observable("true")
          }, {
            id: "",
            action: self.nls.headings.view,
            selected: ko.observableArray(),
            disable: ko.observable("true")
          }];
          ko.utils.arrayForEach(entitlementData[i].actionTypeMap, function(item1) {
            if (item1.action === action) {
              item1.id = entitlementData[i].entitlementId;
              item1.action = action;
              item1.selected = ko.observableArray();
              if (entitlementData[i].isMapped)
                item1.selected().push("true");
              item1.disable = ko.observable("true");
            }
          });
          entitlementData[i].attr = {
            id: name,
            displayName: name,
            actionTypeMap: entitlementData[i].actionTypeMap,
            selected: ko.observableArray()
          };
          self.entitlements.push(entitlementData[i]);
        }
      }
      return self.entitlements();
    };
    self.roleDataLoaded(true);
    self.back = function() {
      rootParams.dashboard.loadComponent("map-transaction", {}, self);
    };

  };
});
