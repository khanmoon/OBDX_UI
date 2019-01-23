define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "jquery",
  "baseLogger",
  "ojL10n!resources/nls/user-read",
  "ojs/ojswitch",
  "ojs/ojcheckboxset"
], function(oj, ko, UserReadModel, $, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.userFullData = ko.observable();
    self.approverReview = ko.observable(false);
    self.androidDevice = ko.observable(false);
    self.androidDisabled = ko.observable(true);
    self.iOsDevice = ko.observable(false);
    self.iOsDisabled = ko.observable(true);
    self.accessPoint = ko.observableArray([]);
    self.selectedAccessPoint = ko.observableArray();
    self.selectedAccessType = ko.observable("INT");
    self.selectedAccessPointEntity = ko.observableArray();
    self.androidDeviceForPushNotification = ko.observable(false);
    self.androidDisabledForPushNotification = ko.observable(true);
    self.iOsDeviceForPushNotification = ko.observable(false);
    self.iOsDisabledForPushNotification = ko.observable(true);
    self.deviceDataLoadedForPushNotification = ko.observable(false);
    self.entityDetails = rootParams.entityDetails;
    if (rootParams.data) {
      self.username = ko.observable(rootParams.data.username());
      self.approverReview(true);
    }
    self.userTypeList = ko.observableArray([]);
    self.childRoleEnums = ko.observableArray([]);
    self.childRoleEnumsLoaded = ko.observable(false);
    self.selectedChildRole = ko.observableArray([]);
    self.showConfirmation = ko.observable(false);
    self.transactionStatus = ko.observable();
    self.transactionName = ko.observable();
    self.dataLoaded = ko.observable(false);
    self.deviceDataLoaded = ko.observable(false);
    self.homeEntityLimitPackage = ko.observable(false);
    self.isAccessPointFetched = ko.observable(false);
    self.selectedAccessPoints = ko.observableArray();
    rootParams.baseModel.registerComponent("users-update", "user-management");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerElement("confirm-screen");
    self.usernamesearched = ko.observable(rootParams.rootModel.usernamesearched());
    self.firstNamesearched = ko.observable(rootParams.rootModel.firstNamesearched());
    self.lastNamesearched = ko.observable(rootParams.rootModel.lastNamesearched());
    self.emailIdsearched = ko.observable(rootParams.rootModel.emailIdsearched());
    self.mobileNumbersearched = ko.observable(rootParams.rootModel.mobileNumbersearched());
    self.userList = ko.observable(rootParams.rootModel.user().searchedUserList());
    rootParams.dashboard.headerName(self.nls.headers.usermanagement);
    self.entityLimitPackages = ko.observableArray();
    self.accessPointGroup = ko.observableArray();
    self.accessPointExt = ko.observableArray();
    self.selectedExtAccessPoint = ko.observableArray([]);

    self.limitPackageSearch = function(data, item) {
      var temp;
      for (var h = 0; h < data.entityLimitPackageMappingDTO.length; h++) {
        if (data.entityLimitPackageMappingDTO[h].limitPackage.accessPointValue === item.value) {
          temp = {
            "limitPackage": ko.observable(data.entityLimitPackageMappingDTO[h].limitPackage.key.id),
            "accessPointDescription": item.text
          };
          break;
        }
      }
      return temp;
    };

    self.setEntityLimitPackages = function() {

      for (var f = 0; f < self.userFullData().limitPackages.length; f++) {
        var tempArray = [];
        var data;
        for (var b = 0; b < self.accessPoint().length; b++) {
          data = self.limitPackageSearch(self.userFullData().limitPackages[f], self.accessPoint()[b]);
          if (data)
            tempArray.push(data);
        }
        for (b = 0; b < self.accessPointGroup().length; b++) {
          data = self.limitPackageSearch(self.userFullData().limitPackages[f], self.accessPointGroup()[b]);
          if (data)
            tempArray.push(data);
        }

        self.entityLimitPackages().push({
          targetUnit: self.userFullData().limitPackages[f].targetUnit,
          entityLimitPackageMappingDTO: tempArray
        });
      }
    };
    self.setHomeEntityParty = function() {
      for (var f = 0; f < self.userFullData().userPartyRelationshipDTOs.length; f++) {
        if (self.userFullData().userPartyRelationshipDTOs[f].determinantValue === self.userFullData().homeEntity) {
          self.userFullData().partyId = self.userFullData().userPartyRelationshipDTOs[f].partyId;
        }
      }
      for (var g = 0; g < self.userFullData().accessibleEntities.length; g++) {
        if (self.userFullData().accessibleEntities[g].entityId === self.userFullData().homeEntity) {
          self.userFullData().partyName = self.userFullData().accessibleEntities[g].partyName;
        }
      }
    };

    var searchParameters = {
      "accessType": "INT"
    };
    Promise.all([UserReadModel.fetchAccess(searchParameters), UserReadModel.listAccessPointGroup(), UserReadModel.getEnterpriseRoles(),UserReadModel.readUser(self.username())])
      .then(function(response) {
        var data = response[0];
        var data1 = response[1];
        var data2 = response[2];
        var data3 = response[3];
        self.userTypeList = data2.enterpriseRoleDTOs;
          self.userFullData(data3.userDTO);
          for (var c = 0; c < self.countries().length; c++) {
            if (self.userFullData().address.country === self.countries()[c].value) {
              self.countryName = self.countries()[c].text;
            }
          }
          var i;
          ko.utils.arrayForEach(self.userTypeList, function(item) {
            for (i = 0; i < self.userFullData().userGroups.length; i++) {
              if (item.enterpriseRoleId.toLowerCase() === self.userFullData().userGroups[i].toLowerCase()) {
                self.userFullData().userType = item;
                var index = self.userFullData().userGroups.indexOf(self.userFullData().userGroups[i]);
                self.userFullData().userGroups.splice(index, 1);
              }
            }
          });
          for (i = 0; i < data3.userDTO.userAccessPointRelationshipList.length; i++) {
            for (var j = 0; j < self.accessPointExt().length; j++) {
              if (data3.userDTO.userAccessPointRelationshipList[i].accessPointId === self.accessPointExt()[j].value)
                self.selectedExtAccessPoint.push(data3.userDTO.userAccessPointRelationshipList[i]);
            }
          }

          for (i = 0; i < data3.userDTO.userAccessPointRelationshipList.length; i++) {
            if (self.userFullData().homeEntity === data3.userDTO.userAccessPointRelationshipList[i].determinantValue) {
              if (data3.userDTO.userAccessPointRelationshipList[i].status === true) {
                self.selectedAccessPoint.push(data3.userDTO.userAccessPointRelationshipList[i].accessPointId);
              }
            }
          }
          if (data3.userDTO.accessibleEntity.length > 1) {
            for (var k = 0; k < data3.userDTO.accessibleEntity.length; k++) {
              data3.userDTO.accessibleEntities[k].selectedAccessPoints = [];
              for (var m = 0; m < self.userFullData().userAccessPointRelationshipList.length; m++) {
                if (data3.userDTO.accessibleEntity[k] !== self.userFullData().homeEntity && data3.userDTO.accessibleEntity[k] === self.userFullData().userAccessPointRelationshipList[m].determinantValue && data3.userDTO.userAccessPointRelationshipList[m].status === true) {
                  for (var n = 0; n < self.accessPoint().length; n++) {
                    if (self.userFullData().userAccessPointRelationshipList[m].accessPointId === self.accessPoint()[n].value) {
                      self.selectedAccessPointEntity.push(self.userFullData().userAccessPointRelationshipList[m].accessPointId);
                      data3.userDTO.accessibleEntities[k].selectedAccessPoints.push(self.userFullData().userAccessPointRelationshipList[m].accessPointId);
                    }
                  }
                }
              }
            }
          }
          for (i = 0; i < self.userFullData().limitPackages.length; i++) {
            if (self.userFullData().limitPackages[i].targetUnit === self.userFullData().homeEntity && self.userFullData().limitPackages[i].entityLimitPackageMappingDTO.length) {
              self.homeEntityLimitPackage(true);
            }
          }
          UserReadModel.fetchChildRole(self.userFullData().userType.enterpriseRoleId).done(function(data) {
            self.childRoleEnums(data.applicationRoleDTOs);
            self.childRoleEnumsLoaded(true);
            self.selectedChildRole(self.userFullData().applicationRoles);
          });
          if (self.userFullData().userType.enterpriseRoleName === "Retail User")
            self.userFullData().phoneNumber = self.userFullData().homePhone;
          self.setHomeEntityParty();
          self.setEntityLimitPackages();
          self.dataLoaded(true);

        for (i = 0; i < data1.accessPointGroupListDTO.length; i++) {
          self.accessPointGroup.push({
            text: data1.accessPointGroupListDTO[i].description,
            value: data1.accessPointGroupListDTO[i].accessPointGroupId
          });
        }

        self.accessPointGroup().sort(function(a, b) {
          if (a.value < b.value)
            return -1;
          if (a.value > b.value)
            return 1;
          return 0;
        });

        for (i = 0; i < data.accessPointListDTO.length; i++) {
          if (data.accessPointListDTO[i].type === "INT") {
            self.accessPoint().push({
              text: data.accessPointListDTO[i].description,
              value: data.accessPointListDTO[i].id
            });

            self.accessPoint().sort(function(a, b) {
              if (a.value < b.value)
                return -1;
              if (a.value > b.value)
                return 1;
              return 0;
            });
          } else {
            self.accessPointExt().push({
              text: data.accessPointListDTO[i].description,
              value: data.accessPointListDTO[i].id
            });
          }
        }

        self.isAccessPointFetched(true);

      });

    UserReadModel.fetchDeviceCountForPushNotification(self.username()).done(function(data) {
      ko.utils.arrayForEach(data.listDTO, function(item) {
        if (item.os === "ANDROID" && item.count > 0) {
          self.androidDeviceForPushNotification(true);
          self.androidDisabledForPushNotification(true);
        }
        if (item.os === "IOS" && item.count > 0) {
          self.iOsDeviceForPushNotification(true);
          self.iOsDisabledForPushNotification(true);
        }
      });
      self.deviceDataLoadedForPushNotification(true);
    });
    UserReadModel.fetchDeviceCount(self.username()).done(function(data) {
      ko.utils.arrayForEach(data.listDTO, function(item) {
        if (item.os === "ANDROID" && item.count > 0) {
          self.androidDevice(true);
          self.androidDisabled(true);
        }
        if (item.os === "IOS" && item.count > 0) {
          self.iOsDevice(true);
          self.iOsDisabled(true);
        }
      });
      self.deviceDataLoaded(true);
    });
    self.cancel = function() {
      rootParams.dashboard.openDashBoard("nls.message.confirmationMessage");
    };
    self.edit = function() {
      rootParams.dashboard.loadComponent("users-update", {
        androidDevice: self.androidDevice,
        iOsDevice: self.iOsDevice,
        androidDeviceForPushNotification: self.androidDeviceForPushNotification,
        iOsDeviceForPushNotification: self.iOsDeviceForPushNotification
      }, self);
    };
    self.back = function() {
      rootParams.dashboard.loadComponent("users", {}, self);
    };
    self.showModalWindow = function() {
      $("#resetPassword").trigger("openModal");
    };
    self.hideModalWindow = function() {
      $("#resetPassword").trigger("closeModal");
    };
    self.transactionName(self.nls.fieldname.transactionName);
    self.resetPassword = function() {
      UserReadModel.resetPassword(self.userFullData().username).done(function(data, status, jqXhr) {
        $("#resetPassword").hide();
        self.transactionStatus(data.status);
        self.showConfirmation(true);
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.transactionName()
        }, self);
      });
    };
    self.downloadUserDetails = function() {
      UserReadModel.downloadUserDetails(self.username());
    };
  };
});
