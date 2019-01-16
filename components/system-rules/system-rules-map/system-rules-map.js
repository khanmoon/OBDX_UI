define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",

  "./model",
  "ojL10n!resources/nls/system-rules",
  "framework/js/constants/constants",
  "ojs/ojknockout",
  "ojs/ojknockout-validation",
  "ojs/ojarraytabledatasource",
  "ojs/ojtable",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojswitch",
  "ojs/ojbutton"
], function(oj, ko, $, BaseLogger, RolePreferenceModel, ResourceBundle, Constants) {
  "use strict";
  return function(Params) {
    var self = this,
      getNewKoModel = function() {
        var KoModel = ko.mapping.fromJS(RolePreferenceModel.getNewModel());
        return KoModel;
      };
    Params.baseModel.registerComponent("access-point-mapping", "financial-limits");
    self.mode = ko.observable("CREATE");
    self.constants = Constants;
    self.payload = getNewKoModel().payload;
    self.limitPackagePayload = ko.observable();
    self.selectedRole = ko.observable();
    self.enterpriseRolesList = ko.observableArray([]);
    self.showEdit = ko.observable(false);
    self.validationTracker = ko.observable();
    self.isEnterpriseRolesLoaded = ko.observable();
    self.isEnterpriseRoleSelected = ko.observable(false);
    self.isPreferencesLoaded = ko.observable();
    self.isRolePreferencesLoaded = ko.observable(false);
    self.isPartyMappingRequired = ko.observable(false);
    self.isCustomerPreferenceCheck = ko.observable(false);
    self.isAccountAccessCheck = ko.observable(false);
    self.isLimitCheck = ko.observable(false);
    self.isApprovalCheck = ko.observable(false);
    self.preferencesListForPayload = ko.observableArray();
    self.isInitialScreenLoaded = ko.observable(false);
    self.otpRequiredConstant = "OTP_REQUIRED";
    self.showLimitPackageSearchSection = ko.observable(false);
    self.limitPackageDataLoaded = ko.observable(false);
    self.selectedRoleValues = ko.observableArray([]);
    self.entityLimitPackageMapArray = ko.observableArray();
    self.mappedLimitPackages = ko.observableArray();
    self.datasource = ko.observable();
    Params.baseModel.registerElement("action-header");
    self.limitPackageDetails = ko.observableArray();
    self.accessPointType = ko.observable();
    self.showReviewForCreate = ko.observable(false);
    self.preferencesList = ko.observableArray();

    for (var i = 0; i < Params.dashboard.userData.userProfile.accessibleEntities.length; i++) {
      self.entityLimitPackageMapArray.push({
        entityId: Params.dashboard.userData.userProfile.accessibleEntities[i],
        entityName: Params.dashboard.userData.userProfile.accessibleEntityDTOs[i].entityName,
        selectedLimitPackages: ko.observableArray(),
        limitPackages: ko.observableArray(),
        limitPackagesLoaded: ko.observable(false),
        limitPackageDetails: ko.observableArray()
      });
    }

    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    Params.baseModel.registerComponent("review-system-rules-map", "system-rules");
    Params.dashboard.headerName(self.resource.rolePreferences.systemRules);
    if (self.params.mode) {
      self.mode(self.params.mode);
    }

    var accountRelCheckLabel;

    self.getEnterpriseRoles = function() {
      RolePreferenceModel.getEnterpriseRoles().done(function(data) {
        self.isEnterpriseRolesLoaded(false);
        self.enterpriseRolesList.removeAll();
        for (var i = 0; i < data.enterpriseRoleDTOs.length; i++) {
          self.enterpriseRolesList.push({
            text: data.enterpriseRoleDTOs[i].enterpriseRoleName,
            value: data.enterpriseRoleDTOs[i].enterpriseRoleId
          });
        }
        self.isEnterpriseRolesLoaded(true);
      });
    };
    self.compare = function(a, b) {
      if (a.text < b.text) {
        return -1;
      }
      if (a.text > b.text) {
        return 1;
      }
      return 0;
    };
    self.getRolePreferences = function() {
      RolePreferenceModel.getRolePreferences(self.selectedRole()).done(function(data) {
        var j;
        for (var i = 0; i < self.preferencesList().length; i++) {
          for (j = 0; j < data.rolePreferencesList.length; j++) {
            if (self.preferencesList()[i].preferenceId === data.rolePreferencesList[j].preferenceId) {
              data.rolePreferencesList[j].text = self.preferencesList()[i].text;
              break;
            }
          }
        }
        self.preferencesList.removeAll();
        self.showLimitPackageSearchSection(false);
        for (j = 0; j < data.rolePreferencesList.length; j++) {
          if (data.rolePreferencesList[j].preferenceId === "PARTY_MAPPING") {
            self.preferencesList()[0] = data.rolePreferencesList[j];

          } else if (data.rolePreferencesList[j].preferenceId === "CUSTOMER_PREFERENCES") {
            self.preferencesList()[1] = data.rolePreferencesList[j];

          } else if (data.rolePreferencesList[j].preferenceId === "ACCOUNT_ACCESS") {
            self.preferencesList()[2] = data.rolePreferencesList[j];

          } else if (data.rolePreferencesList[j].preferenceId === "APPROVAL") {
            self.preferencesList()[3] = data.rolePreferencesList[j];

          } else if (data.rolePreferencesList[j].preferenceId === "LOGIN_FLOW_REQUIRED") {
            self.preferencesList()[4] = data.rolePreferencesList[j];

          } else if (data.rolePreferencesList[j].preferenceId === "ACCOUNT_RELATIONSHIP_CHECK") {
            self.preferencesList()[5] = data.rolePreferencesList[j];
            if(self.mode() !== "EDIT"){
              self.preferencesList()[5].text = accountRelCheckLabel;
            }
          } else if (data.rolePreferencesList[j].preferenceId === "LIMITS_CHECK") {
            if (data.assignedLimitPackageDTOs) {
              for (var k = 0; k < self.entityLimitPackageMapArray().length; k++) {
                self.entityLimitPackageMapArray()[k].selectedLimitPackages.removeAll();
                for (var z = 0; z < data.assignedLimitPackageDTOs.length; z++) {
                  if (self.entityLimitPackageMapArray()[k].entityId === data.assignedLimitPackageDTOs[z].targetUnit) {
                    for(var y = 0; y < data.assignedLimitPackageDTOs[z].entityLimitPackageMappingDTO.length; y++)
                    self.entityLimitPackageMapArray()[k].selectedLimitPackages.push(data.assignedLimitPackageDTOs[z].entityLimitPackageMappingDTO[y].limitPackage);
                  }
                }
              }
            }
            self.mappedLimitPackages.removeAll();
            var assignableEntitiesData = [{
              key: {
                value: self.selectedRole(),
                type: "ROLE"
              }
            }];
            for (var index = 0; index < Params.dashboard.userData.userProfile.accessibleEntities.length; index++) {
              self.mappedLimitPackages.push({
                methodType: "GET",
                uri: {
                  value: "/limitPackages?assignableEntities={assignableEntities}",
                  params: {
                    assignableEntities: ko.toJSON(assignableEntitiesData)
                  }
                },
                headers: {
                  "Content-Type": "application/json",
                  "Content-Id": index+1,
                  "X-Target-Unit": Params.dashboard.userData.userProfile.accessibleEntities[index]
                }
              });
            }

            RolePreferenceModel.fireBatch({
              batchDetailRequestList: self.mappedLimitPackages()
            }).done(function(data2) {
              for (var x = 0; x < self.entityLimitPackageMapArray().length; x++) {
                for (var y = 0; y < data2.batchDetailResponseDTOList.length; y++) {
                  var batchResponseDTO = JSON.parse(data2.batchDetailResponseDTOList[y].responseText);
                  if (batchResponseDTO.limitPackageDTOList && batchResponseDTO.limitPackageDTOList.length && self.entityLimitPackageMapArray()[x].entityId === batchResponseDTO.limitPackageDTOList[0].key.determinantValue) {
                    self.entityLimitPackageMapArray()[x].limitPackages(batchResponseDTO.limitPackageDTOList);
                    self.entityLimitPackageMapArray()[x].limitPackagesLoaded(true);
                    break;
                  }
                }
              }
              self.datasource(new oj.ArrayTableDataSource(self.entityLimitPackageMapArray, {
                idAttribute: "entityId"
              }));
              self.limitPackageDataLoaded(true);
            });
            self.preferencesList()[6] = data.rolePreferencesList[j];

            if (self.preferencesList()[6].value) {
              self.showLimitPackageSearchSection(true);
            } else {
              self.showLimitPackageSearchSection(false);
            }
          }
        }
      });
      self.isEnterpriseRoleSelected(true);
      self.isInitialScreenLoaded(false);
    };
    self.getPreferences = function() {
      RolePreferenceModel.getPreferences().done(function(data) {
          for (var i = 0; i < data.rolePreferencesList.length; i++) {
          if (data.rolePreferencesList[i].rolePreferenceId === "PARTY_MAPPING") {
            self.preferencesList()[0] = {
              text: data.rolePreferencesList[i].description,
              preferenceId: data.rolePreferencesList[i].rolePreferenceId,
              value: false
            };

          } else if (data.rolePreferencesList[i].rolePreferenceId === "CUSTOMER_PREFERENCES") {
            self.preferencesList()[1] = {
              text: data.rolePreferencesList[i].description,
              preferenceId: data.rolePreferencesList[i].rolePreferenceId,
              value: false
            };

          } else if (data.rolePreferencesList[i].rolePreferenceId === "ACCOUNT_ACCESS") {
            self.preferencesList()[2] = {
              text: data.rolePreferencesList[i].description,
              preferenceId: data.rolePreferencesList[i].rolePreferenceId,
              value: false
            };

          } else if (data.rolePreferencesList[i].rolePreferenceId === "APPROVAL") {
            self.preferencesList()[3] = {
              text: data.rolePreferencesList[i].description,
              preferenceId: data.rolePreferencesList[i].rolePreferenceId,
              value: false
            };
          } else if (data.rolePreferencesList[i].rolePreferenceId === "LOGIN_FLOW_REQUIRED") {
            self.preferencesList()[4] = {
              text: data.rolePreferencesList[i].description,
              preferenceId: data.rolePreferencesList[i].rolePreferenceId,
              value: false
            };

          } else if (data.rolePreferencesList[i].rolePreferenceId === "ACCOUNT_RELATIONSHIP_CHECK") {
            self.preferencesList()[5] = {
              text: data.rolePreferencesList[i].description,
              preferenceId: data.rolePreferencesList[i].rolePreferenceId,
              value: false
            };
            accountRelCheckLabel = data.rolePreferencesList[i].description;
          } else if (data.rolePreferencesList[i].rolePreferenceId === "LIMITS_CHECK") {
            self.preferencesList()[6] = {
              text: data.rolePreferencesList[i].description,
              preferenceId: data.rolePreferencesList[i].rolePreferenceId,
              value: false
            };
          }
        }
        self.isInitialScreenLoaded(true);
      });
    };
    self.getEnterpriseRoles();
    if(self.mode() === "CREATE"){
      self.getPreferences();
    }

    self.cancelRolePreference = function() {
      window.location = "dashboard.html";
    };

    self.createRolePreference = function() {
      if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        for (var x = 0; x < self.entityLimitPackageMapArray().length; x++) {
          if (self.entityLimitPackageMapArray()[x].packageId().toString() === "") {
            Params.baseModel.showMessages(null, [self.resource.rolePreferences.limitPackageSelectionError], "ERROR");
            break;
          }
        }
        return;
      }
      self.preferencesListForPayload.removeAll();
      if (self.selectedRole()) {
        self.payload.roleId(self.selectedRole());
        for (var i = 0; i < self.preferencesList().length; i++) {
          self.preferencesListForPayload.push({
            roleId: self.preferencesList()[i].roleId,
            preferenceId: self.preferencesList()[i].preferenceId,
            value: self.preferencesList()[i].value
          });
        }
        self.payload.preferenceMappingDTOs = self.preferencesListForPayload();

        self.limitPackagePayload = getNewKoModel().limitPackage;
        self.limitPackagePayload.roleId(self.selectedRole());
        self.limitPackagePayload.entityLimitPackageDTOs.removeAll();
        if (self.entityLimitPackageMapArray() !== null) {
          for (var x1 = 0; x1 < self.entityLimitPackageMapArray().length; x1++) {
            var entityLimitPackageDTO = {
              "targetUnit": "",
              "entityLimitPackageMappingDTO":[]
            };
            entityLimitPackageDTO.targetUnit = self.entityLimitPackageMapArray()[x1].entityId;
            for (var x2 = 0; x2 < self.entityLimitPackageMapArray()[x1].limitPackageDetails().length; x2++) {
              if (self.entityLimitPackageMapArray()[x1].limitPackageDetails()[x2].selectedLimitPackage()) {
                var entityLimitPackageMappingDTO = {
                  "id": "",
                  "limitPackage": {
                    "key": {
                      "id": "",
                      "determinantValue": ""
                    }
                  },
                  "assignedEntity": {
                    "key": {
                      "type": "",
                      "determinantValue": "",
                      "value": ""
                    }
                  },
                  "utilizedBy": ""
                };

                entityLimitPackageMappingDTO.limitPackage.key.id = self.entityLimitPackageMapArray()[x1].limitPackageDetails()[x2].selectedLimitPackage;
                entityLimitPackageMappingDTO.limitPackage.key.determinantValue = self.entityLimitPackageMapArray()[x1].entityId;
                entityLimitPackageMappingDTO.assignedEntity.key.determinantValue = self.entityLimitPackageMapArray()[x1].entityId;

                entityLimitPackageMappingDTO.assignedEntity.key.type = "ROLE";

                entityLimitPackageMappingDTO.assignedEntity.key.value = self.selectedRole();
                entityLimitPackageDTO.entityLimitPackageMappingDTO.push(entityLimitPackageMappingDTO);
              }
            }
            if(entityLimitPackageDTO.entityLimitPackageMappingDTO.length>0)
            self.limitPackagePayload.entityLimitPackageDTOs.push(entityLimitPackageDTO);
          }
        }
      }
    };

    self.showLimitPackage = function(data,event) {
        if (event.preferenceId === "LIMITS_CHECK" && event.value === true) {
          self.showLimitPackageSearchSection(true);
        } else {
          self.showLimitPackageSearchSection(false);
        }
    };

    if(self.mode()==="EDIT") {
        self.payload = ko.mapping.fromJS(self.params.payload);
        self.payload.preferenceMappingDTOs(self.preferencesList());
        self.selectedRole(self.payload.roleId());
        self.showEdit(true);
    }

    self.submit = function() {
      self.createRolePreference();
      var parameters = {
          mode: "REVIEW",
          payload: ko.mapping.toJS(self.payload)
      };
      Params.dashboard.loadComponent("review-system-rules-map", parameters, self);
    };
  };
});
