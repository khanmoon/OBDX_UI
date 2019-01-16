define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/user-management",
    "ojs/ojcheckboxset",
    "ojs/ojswitch"
], function (oj, ko, $, reviewUserActionModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        if (rootParams.rootModel.params.data) {
            self.userFullData = ko.observable(ko.toJS(rootParams.rootModel.params.data));
        }
        if (rootParams.rootModel.params.data.limitPackage) {
            self.selectedUserLimit = rootParams.rootModel.params.data.limitPackage;
        }
        self.statusOptionValue = ko.observable();
        self.statusOptionValue(self.userFullData().lockStatus === "LOCK");
        self.nls = resourceBundle;
        self.resourceBundle = resourceBundle;
        rootParams.baseModel.registerElement("action-header");
        self.limitGroupName = ko.observable();
        self.isLimitsLoaded = ko.observable(false);
        self.deviceDataLoaded = ko.observable(false);
        self.fetchDeviceData = function (deviceUUID) {
            if (deviceUUID) {
                reviewUserActionModel.fetchDeviceData(deviceUUID).done(function (data) {
                    self.userFullData().deviceUUIDDescription = rootParams.baseModel.format("{deviceUUID} ({manufacturer} {model})", {
                        deviceUUID: deviceUUID,
                        manufacturer: data.mobileClientDTO.manufacturer,
                        model: data.mobileClientDTO.model
                    });
                    self.deviceDataLoaded(true);
                });
            }
        };
        if (self.userFullData().userGroups.indexOf("AuthAdmin") === -1) {
            reviewUserActionModel.fetchUserLimitOptions().done(function (data) {
                if (self.userFullData().limitPackage) {
                    for (var i = 0; i < data.limitPackageDTOList.length; i++) {
                        if (typeof self.userFullData().limitPackage === "object") {
                            if (data.limitPackageDTOList[i].key.key === self.userFullData().limitPackage.key.key) {
                                self.limitGroupName(data.limitPackageDTOList[i].name);
                                self.isLimitsLoaded(true);
                            }
                        } else if (data.limitPackageDTOList[i].key.key === self.userFullData().limitPackage) {
                                self.limitGroupName(data.limitPackageDTOList[i].name);
                                self.isLimitsLoaded(true);
                            }
                    }
                } else {
                    self.limitGroupName(self.resourceBundle.info.noLimitAssigned);
                    self.isLimitsLoaded(true);
                }
                self.fetchDeviceData(self.userFullData().deviceUUID);
            });
        }
        self.userGroupsList = ko.observableArray();
        self.childRoleEnums = ko.observableArray([]);
        self.childRoleEnumsLoaded = ko.observable(false);
        self.getEnterpriseRoles = function () {
            reviewUserActionModel.getEnterpriseRoles().done(function (data) {
                ko.utils.arrayForEach(data, function (item) {
                    if (self.userFullData().userGroups.indexOf(item.enterpriseRoleId) > -1) {
                        self.userType = item;
                    }
                });
            });
        };
        self.getEnterpriseRoles();
        if (self.userFullData().userGroups.indexOf(self.userFullData().userType) > -1) {
            var index = self.userFullData().userGroups.indexOf(self.userFullData().userType);
            self.userFullData().userGroups.splice(index, 1);
        }
        reviewUserActionModel.fetchChildRole(self.userFullData().userType).done(function (data) {
            self.childRoleEnums(data.applicationRoleDTOs);
            self.childRoleEnumsLoaded(true);
        });
    };
});
