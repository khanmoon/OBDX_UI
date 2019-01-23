define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "./model",
  "ojL10n!resources/nls/authorization",
  "ojs/ojtrain",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset",
  "ojs/ojradioset",
  "ojs/ojselectcombobox",
  "ojs/ojnavigationlist", "ojs/ojvalidationgroup",
  "ojs/ojknockout-validation"
], function(oj, ko, $, BaseLogger, RoleTransactionUpdateModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    var getNewKoModel = function() {
      var KoModel = RoleTransactionUpdateModel.getNewModel();
      return ko.mapping.fromJS(KoModel);
    };
    self.rootModelInstance = getNewKoModel();
    self.nls = resourceBundle;
    self.dataSourceLoaded(false);
    self.entitlementGroup = ko.observableArray();
    self.accessPointType = ko.observableArray();
    self.validationTracker = ko.observable();
    rootParams.baseModel.registerComponent("transaction-mapping", "role-transaction-mapping");
    rootParams.baseModel.registerComponent("review-role-transaction-update", "role-transaction-mapping");

    self.transactionStatus = ko.observable();
    self.mappingFound = ko.observable(false);
    self.selectedAccessPointToCopy = ko.observable();
    rootParams.baseModel.registerElement("confirm-screen");
    self.destinedAccessPoints = ko.observableArray();
    var actionIndex = [self.nls.headings.perform, self.nls.headings.approve, self.nls.headings.view];
    rootParams.dashboard.headerName(self.nls.common.roleTransactionMapping);
    self.moduleName().push({
      text: self.nls.headings.all,
      value: self.nls.headings.all
    });
    var currentAccessTabs = self.accessPointTabs();
    self.next = function() {
      self.refreshAccessPoint();
      self.mapEntitlements();
    };
    self.comboBoxChangeHandler = function(event) {
      if (event.detail.previousValue === undefined || event.detail.value.length >= event.detail.previousValue.length) {
        if (event.detail.value.indexOf(self.nls.headings.all) !== -1) {
          self.selectedModuleName([]);
          ko.utils.arrayForEach(self.moduleName(), function(item) {
            self.selectedModuleName().push(item.value);
          });
        }
      } else if (event.detail.value.length < event.detail.previousValue.length) {
        if (event.detail.previousValue.indexOf(self.nls.headings.all) !== -1 && event.detail.value.indexOf(self.nls.headings.all) === -1) {
          self.selectedModuleName([]);
        }
      }
    };
    self.refreshAccessPoint = function() {
      currentAccessTabs = [];
      ko.utils.arrayForEach(self.accessPoint(), function(item) {
        if (self.selectedAccessPoint().indexOf(item.value) !== -1) {
          var temp = {
            id: item.value,
            name: item.text
          };
          currentAccessTabs.push(temp);
        }
      });
    };

    self.mapEntitlements = function() {
      if (self.isEdit() === true) {
        if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
          return;
        }
      }
      self.isEdit(false);
      self.accessPointTabs([]);
      self.accessPointTabs(currentAccessTabs);
      var tempRoleAccessPointMap = [];
      ko.utils.arrayForEach(self.roleAccessPointMap(), function(item) {
        if (item) {
          if (self.selectedAccessType() === "INT") {
            var i, item1;
            for (i = 0; i < self.accessPointTabs().length; i++) {
              item1 = self.accessPointTabs()[i];
              if (item.accessPoint === item1.id) {
                tempRoleAccessPointMap.push(item);
                break;
              }
            }
          } else {
            tempRoleAccessPointMap.push(item);
          }
        }
      });
      self.roleAccessPointMap([]);
      self.roleAccessPointMap(tempRoleAccessPointMap);
      if (self.selectedAccessType() === "INT") {
        self.selectedItem(self.accessPointTabs()[0].id);
        self.createDataSource(self.accessPointTabs()[0].id);
        self.disabled(true);
      } else {
        self.createDataSource();
        self.disabled(true);
      }
    };

    self.clear = function() {
      self.disabled(false);
      self.entitlementGroup([]);
      currentAccessTabs = [];
      self.selectedModuleName([]);
      self.componentId(false);
      self.dataSourceLoaded(false);
      self.isNext(false);
      self.selectedAccessPoint([]);
      self.accessPointTabs([]);
      self.roleAccessPointMap([]);
      self.dataSourceToBePassed(null);
      self.destinedAccessPoints([]);
    };

    self.edit = function() {
      self.disabled(false);
      self.isEdit(true);
      self.isNext(false);
      self.componentId(false);
    };
    self.accessPointTabChangeHandler = function(event) {
      self.selectedItem(event.detail.value);
      //make an array which has selected accessPoint minus selected Item and pass it to dropdown
      var filteredTabList = self.accessPointTabs().filter(function(selectedTab) {
        if (selectedTab.id !== self.selectedItem()) {
          return selectedTab;
        }
        return false;
      });
      self.destinedAccessPoints([]);
      ko.tasks.runEarly();
      self.destinedAccessPoints(filteredTabList);
      $("#tabChangeModal").trigger("openModal");
    };

    self.createDataSource = function(accessPoint) {
      self.dataSourceLoaded(false);
      var expectedDataSource = [],
        countActions = [0, 0, 0],
        currentActionCount = [0, 0, 0];
      if (self.roleAccessPointMap().length > 0) {
        ko.utils.arrayForEach(self.roleAccessPointMap(), function(item) {
          if (item.accessPoint === accessPoint) {
            expectedDataSource = item.expectedDataSource;
            countActions = item.countActions;
            currentActionCount = item.currentActionCount;
          }
        });
      }
      self.expectedDataSourcePushFunction(expectedDataSource, countActions, currentActionCount, accessPoint, false);
    };

    self.expectedDataSourcePushFunction = function(expectedDataSource, countActions, currentActionCount, accessPoint, needToCopy) {

      var newEntitlementGroup = [],
        i, j;
      self.manipulateActionCount = function() {
        for (var i = 0; i < expectedDataSource[j].children.length; i++) {
          for (var a = 0; a < expectedDataSource[j].children[i].children.length; a++) {
            for (var m = 0; m < expectedDataSource[j].children[i].children[a].actionTypeMap.length; m++) {
              if (expectedDataSource[j].children[i].children[a].actionTypeMap[m].disable() === "false") {
                countActions[m]++;
                if (expectedDataSource[j].children[i].children[a].actionTypeMap[m].selected()[0] === "true")
                  currentActionCount[m]++;
              }
            }
          }
        }
      };
      self.parseEntitlement = function(entitlementData) {
        self.entitlements = ko.observableArray();
        for (var i = 0; i < entitlementData.length; i++) {
          var name = entitlementData[i].entitlementName;
          var action = entitlementData[i].entitlementId.split("_")[entitlementData[i].entitlementId.split("_").length - 1];
          var id = entitlementData[i].entitlementId.split("_")[0];
          self.entitlementFound = ko.observable(false);
          if (self.entitlements().length !== 0) {
            for (var l = 0; l < self.entitlements().length; l++) {
              if (self.entitlements()[l].attr.id === id) {
                ko.utils.arrayForEach(self.entitlements()[l].actionTypeMap, function(item2) {
                  if (item2.action === action) {
                    countActions[actionIndex.indexOf(action)] += 1;
                    item2.id = entitlementData[i].entitlementId;
                    item2.action = action;
                    item2.selected = ko.observableArray();
                    item2.disable = ko.observable("false");
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
                countActions[actionIndex.indexOf(action)] += 1;
                item1.id = entitlementData[i].entitlementId;
                item1.action = action;
                item1.selected = ko.observableArray();
                item1.disable = ko.observable("false");
              }
            });
            entitlementData[i].attr = {
              id: id,
              displayName: name,
              actionTypeMap: entitlementData[i].actionTypeMap,
              selected: ko.observableArray()
            };
            self.entitlements.push(entitlementData[i]);
          }
        }
        return self.entitlements();
      };

      var tempExpectedDataSource = [];
      self.expectedDataSourceFound = ko.observable(false);
      if (expectedDataSource.length > 0) {
        self.expectedDataSourceFound(true);
      }
      var searchParameters = {
        "module": self.selectedModuleName(),
        "categoryName": "",
        "entitlementName": ""
      };
      RoleTransactionUpdateModel.fetchEntitlements(searchParameters).done(function(data) {
        if (self.expectedDataSourceFound()) {
          countActions = [0, 0, 0];
          currentActionCount = [0, 0, 0];
          for (i = 0; i < data.entitlementGroupDTOs.length; i++) {
            var flag = 0;
            for (j = 0; j < expectedDataSource.length; j++) {
              if (data.entitlementGroupDTOs[i].id === expectedDataSource[j].attr.id) {
                tempExpectedDataSource.push(expectedDataSource[j]);
                self.manipulateActionCount();
                flag = 1;
                break;
              }
            }
            if (flag === 0) {
              newEntitlementGroup.push(data.entitlementGroupDTOs[i]);
            }
          }
        } else {
          newEntitlementGroup = data.entitlementGroupDTOs;
        }
        expectedDataSource = tempExpectedDataSource;
        for (i = 0; i < newEntitlementGroup.length; i++) {
          var parent = {
            attr: {},
            children: []
          };
          parent.attr.id = newEntitlementGroup[i].id;
          parent.attr.displayName = newEntitlementGroup[i].displayName;
          parent.attr.selected = ko.observableArray();
          var subGroupDTOs = newEntitlementGroup[i].subGroupDTOs;
          var nestedChildren = [];
          if (subGroupDTOs) {
            for (j = 0; j < subGroupDTOs.length; j++) {
              var child = {
                attr: {},
                children: []
              };
              child.attr.id = subGroupDTOs[j].id;
              child.attr.displayName = subGroupDTOs[j].displayName;
              child.attr.selected = ko.observableArray();

              var entitlementData = newEntitlementGroup[i].subGroupDTOs[j].entitlements;
              if (entitlementData && entitlementData.length > 0) {
                var innermostChildren = self.parseEntitlement(entitlementData);
                child.children = innermostChildren;
                nestedChildren.push(child);
              }
            }
            parent.children = nestedChildren;
            expectedDataSource.push(parent);
          }
        }
        self.disabled(true);
        if (!self.expectedDataSourceFound() || needToCopy) {
          var roleAcessPoint = {
            "accessPoint": null,
            "expectedDataSource": null,
            "countActions": countActions,
            "currentActionCount": currentActionCount
          };
          roleAcessPoint.accessPoint = accessPoint;
          roleAcessPoint.expectedDataSource = expectedDataSource;
          var filteredRoleAccessMap = self.roleAccessPointMap().filter(function(item) {
            if (item.accessPoint !== accessPoint) {
              return item;
            }
            return false;
          });
          self.roleAccessPointMap(filteredRoleAccessMap);
          self.roleAccessPointMap().push(roleAcessPoint);
          self.isNext(true);
          self.dataSourceToBePassed(roleAcessPoint);
          self.dataSourceLoaded(true);
        } else {
          ko.utils.arrayForEach(self.roleAccessPointMap(), function(item) {
            if (item.accessPoint === accessPoint) {
              item.expectedDataSource = expectedDataSource;
              item.countActions = countActions;
              item.currentActionCount = currentActionCount;
              self.dataSourceToBePassed(item);
              self.dataSourceLoaded(true);
              self.isNext(true);
            }
          });
        }
      });
    };

    self.save = function() {
      rootParams.dashboard.loadComponent("review-role-transaction-update", {}, self);
    };

    self.updateAppRolePolicy = function() {
      self.rootModelInstance.applicationRoleDTO.applicationRoleId = self.appRoleId();
      self.rootModelInstance.applicationRoleDTO.applicationRoleName = self.appRoleName();
      self.rootModelInstance.applicationRoleDTO.applicationRoleDescription = self.appDescription();
      self.rootModelInstance.applicationRoleDTO.applicationRoleDisplayName = self.appRoleName();
      self.rootModelInstance.applicationRoleDTO.enterpriseRole = self.userSegment();
      self.rootModelInstance.applicationRoleDTO.accessPointType = self.selectedAccessType();
      self.rootModelInstance.applicationRoleDTO.accessPointScope = self.selectedAccessScope();
      self.rootModelInstance.modules = self.selectedModuleName();
      self.rootModelInstance.applicationRoleDTO.version = self.version;
      self.accessTrans = ko.observableArray([]);
      ko.utils.arrayForEach(self.roleAccessPointMap(), function(itemParent) {
        self.entitlementsArray = ko.observableArray([]);
        self.entitlementMainGroupArray = ko.observableArray([]);
        ko.utils.arrayForEach(itemParent.expectedDataSource, function(item) {

          var entitlementMainGroup = {
            id: item.attr.id,
            displayName: item.attr.displayName,
            subGroupDTOs: []
          };
          self.subGroupDTOs = ko.observableArray([]);
          ko.utils.arrayForEach(item.children, function(childItem) {
            var subGroupDTOsObject = {
              id: childItem.attr.id,
              displayName: childItem.attr.displayName,
              entitlements: []
            };
            ko.utils.arrayForEach(childItem.children, function(grandChildItem) {
              ko.utils.arrayForEach(grandChildItem.attr.actionTypeMap, function(action) {
                var object = {
                  "entitlementName": grandChildItem.entitlementName,
                  "entitlementDisplayName": grandChildItem.entitlementDisplayName,
                  "entitlementId": action.id,
                  "isMapped": false
                };
                if (action.selected()[0] === "true") {
                  object.isMapped = true;
                }
                if (object.entitlementId !== "")
                  subGroupDTOsObject.entitlements.push(object);
              });
            });
            self.subGroupDTOs().push(subGroupDTOsObject);
          });
          entitlementMainGroup.subGroupDTOs = self.subGroupDTOs();
          self.entitlementMainGroupArray().push(entitlementMainGroup);
        });

        var accessTransactionMapDTO = {
          entitlementGroups: self.entitlementMainGroupArray(),
          accessPoint: itemParent.accessPoint
        };
        self.accessTrans().push(accessTransactionMapDTO);
      });
      self.rootModelInstance.accessTransactionMapDTO = self.accessTrans();
      RoleTransactionUpdateModel.updateRoleTransaction(ko.mapping.toJSON(self.rootModelInstance)).done(function(data, status, jqXhr) {
        self.transactionStatus(data.status);
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.nls.headings.updateApplicationRole
        }, self);
      });
    };
    if (self.selectedModuleName()) {
      self.mapEntitlements();
    }
    self.back = function() {
      rootParams.dashboard.loadComponent("application-role-read", {
        appRoleId: self.appRoleId()
      }, null);
    };

    self.openModal = function() {
      $("#accessPointModal").trigger("openModal");
    };

    self.replicateDatasource = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
        return;
      }
      ko.utils.arrayForEach(self.roleAccessPointMap(), function(item) {
        if (item.accessPoint === self.selectedAccessPointToCopy()) {
          self.expectedDataSourcePushFunction(item.expectedDataSource, item.countActions, item.currentActionCount, self.selectedItem(), true);
        }
      });
      $("#accessPointModal").hide();
      $("#tabChangeModal").hide();
    };

    self.cancelDatasourceReplication = function() {
      self.createDataSource(self.selectedItem());
      $("#tabChangeModal").hide();
    };
  };
});
