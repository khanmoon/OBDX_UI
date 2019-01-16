define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/system-rules",
    "ojs/ojbutton",
    "ojs/ojknockout"
], function(oj, ko, $, ReviewSystemRulesModel,resourceBundle) {
    "use strict";
    return function (params) {
      var self = this;
      self.mode = ko.observable();
      ko.utils.extend(self, params.rootModel);
      self.resourceBundle = resourceBundle;
      params.dashboard.headerName();
      params.baseModel.registerElement("confirm-screen");
      params.baseModel.registerComponent("system-rules-map", "system-rules");
      self.entityArray = ko.observableArray();
      self.limitArray = ko.observableArray();
      self.isLoaded = ko.observable(false);
      self.httpStatus = ko.observable();
      self.transactionStatus = ko.observable();
      if (params.mode) {
        self.mode(params.mode);
      }else if(self.params.mode){
        self.mode(self.params.mode);
      }

      if(self.entityLimitPackageMapArray()){
       for(var i = 0; i<self.entityLimitPackageMapArray().length; i++){
         self.entityArray()[i] = self.entityLimitPackageMapArray()[i].entityName;
       }
     }
       for(var x = 0; x < self.entityArray().length; x++){
         for(var y = 0; y< self.entityLimitPackageMapArray().length; y++){
           if(self.entityArray()[x] === self.entityLimitPackageMapArray()[y].entityName){
             self.limitArray.push({
                 id : x,
                 name : self.entityArray()[x],
                 packages : []
             });
             for(var z = 0; z < self.entityLimitPackageMapArray()[y].limitPackageDetails().length; z++){
              if(self.entityLimitPackageMapArray()[y].limitPackageDetails()[z].selectedLimitPackage() !== undefined){
                self.limitArray()[x].packages.push({
                  value : self.entityLimitPackageMapArray()[y].limitPackageDetails()[z].selectedLimitPackage(),
                  description: self.entityLimitPackageMapArray()[y].limitPackageDetails()[z].description
                });
                }
              }
            }
          }
        }

        self.createRolePreference = function() {
          if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
            for (var x = 0; x < self.entityLimitPackageMapArray().length; x++) {
              if (self.entityLimitPackageMapArray()[x].packageId().toString() === "") {
                params.baseModel.showMessages(null, [self.resource.rolePreferences.limitPackageSelectionError], "ERROR");
                break;
              }
            }
            return;
          }
          if (self.selectedRole()) {
          if (self.showLimitPackageSearchSection()) {
            ReviewSystemRulesModel.setLimitPackages(ko.toJSON(self.limitPackagePayload), self.selectedRole()).done(function(data) {
              if (data.status.message.type === "INFO") {
                self.fireCreateRolePreference();
              }
            });
          } else {
            self.fireCreateRolePreference();
          }
        }
      };

      self.fireCreateRolePreference = function() {
        ReviewSystemRulesModel.createRolePreference(self.selectedRole(), ko.toJSON(self.params.payload), self.createRolePreferenceSuccesshandler).done(function(data, status, jqXhr) {
       if (data.status.message.type !== "INFO") {
         var error = new Error(self.resource.failedMessage);
         throw error;
       } else {
         self.httpStatus(jqXhr.status);
         self.transactionStatus(data.status);
         params.dashboard.loadComponent("confirm-screen", {
           jqXHR: jqXhr,
           transactionName: self.resource.rolePreferences.updateSuccess
         }, self);
       }
     });
   };

      self.editAll = function () {
        var parameters = {
          mode: "EDIT",
          payload: ko.mapping.toJS(self.payload)
        };
          params.dashboard.loadComponent("system-rules-map", parameters, self);
        };
      };
      });
