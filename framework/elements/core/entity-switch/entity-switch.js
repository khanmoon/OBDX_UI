define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "ojL10n!resources/nls/entity-switch",
  "framework/js/constants/constants",
  "ojs/ojselectcombobox"
], function(oj, ko, $, Model, resourceBundle, Constants) {
  "use strict";
  return function(params) {
    var self = this;
    self.nls = resourceBundle;
    self.entityList = ko.observableArray();
    self.currentEntity = ko.observable();
    self.entityListLoaded = ko.observable(false);
    params.rootModel.userInfoPromise.then(function() {
      if (params.dashboard.userData.userProfile) {
        Model.fetchBankConfig().then(function(data) {
          require(["text!lzn/" + data.bankConfigurationDTO.region.toLowerCase() + "/manifest.json"], function(manifest) {
            var metaData = JSON.parse(manifest);
            params.baseModel.updateLocalization(data.bankConfigurationDTO.region.toLowerCase(),metaData);
          }, function() {
            params.baseModel.updateLocalization();
          });
        });
      }
      self.currentEntity(Constants.currentEntity);
      if (params.dashboard.userData.userProfile && params.dashboard.userData.userProfile.accessibleEntityDTOs && params.dashboard.userData.userProfile.accessibleEntityDTOs.length) {
        if (params.dashboard.userData.userProfile.accessibleEntityDTOs.length > 1) {
          for (var i = 0; i < params.dashboard.userData.userProfile.accessibleEntityDTOs.length; i++) {
            self.entityList.push({
              text: params.dashboard.userData.userProfile.accessibleEntityDTOs[i].entityName,
              value: params.dashboard.userData.userProfile.accessibleEntityDTOs[i].entityId
            });
          }
          self.entityListLoaded(true);
        }
      } else {
        Model.fetchEntities().then(function(data) {
          if (!Constants.currentEntity) {
            Constants.currentEntity = data.businessUnitDTOs[0].businessUnitCode;
          }
          ko.utils.arrayPushAll(self.entityList, data.businessUnitDTOs.map(function(element) {
            return {
              text: element.businessUnitName,
              value: element.businessUnitCode
            };
          }));
          self.entityListLoaded(true);
        });
      }
    });
    self.currentEntity.subscribe(function(newValue) {
      if (newValue !== Constants.currentEntity) {
        Constants.currentEntity = newValue;
        // eslint-disable-next-line no-storage/no-browser-storage
        sessionStorage.setItem("entity", newValue);
        if(document.querySelector("#profileLauncherPopup")){
          document.querySelector("#profileLauncherPopup").close();
        }
        if (params.dashboard.userData.userProfile) {
          Model.fetchUserData().then(function(data) {
            Constants.timezoneOffset = data.userProfile.timeZoneDTO.offset;
            params.rootModel.resetLayout();
          });
        } else {
          params.rootModel.resetLayout();
        }
      }
    });
    self.userDashboardChoice = ko.observable();

    function loadMyDashboard(newValue) {
      if (newValue) {
        params.dashboard.switchModule(newValue);
      }
    }
    self.userDashboardChoice.subscribe(loadMyDashboard);
  };
});
