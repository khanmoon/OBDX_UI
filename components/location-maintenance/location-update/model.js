define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var LocationUpdateModel = function() {
    var baseService = BaseService.getInstance(),
      Model = function() {
        this.atmPayload = {
            "id": "",
            "name": "",
            "bankCode": "",
            "postalAddress": "",
            "supportedServices": [],
            "type": "ATM",
            "version": "",
            "geoCoordinate": {
              "latitude": 0,
              "longitude": 0
            }
          };
          this.branchPayload = {
            "id": "",
            "name": "",
            "bankCode": "",
            "postalAddress": "",
            "workTimings": [],
            "workDays": [],
            "branchPhone": [],
            "supportedServices": [],
            "version": "",
            "type": "BRANCH",
            "geoCoordinate": {
              "latitude": 0,
              "longitude": 0
            },
            "additionalDetails": []
          };
          this.address = {
            postalAddress: {
              line1: "",
              line2: "",
              line3: "",
              line4: "",
              city: "",
              country: ""
            }
          };
      };

    var updateAtmDetailsDeferred, updateAtmDetails = function(id, payload, deferred) {
        var options = {
          url: "locator/atms/" + id,
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.update(options);
      },
      updateBranchDetailsDeferred, updateBranchDetails = function(id, payload, deferred) {
        var options = {
          url: "locator/branches/" + id,
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.update(options);
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      updateAtmDetails: function(id, payload) {
        updateAtmDetailsDeferred = $.Deferred();
        updateAtmDetails(id, payload, updateAtmDetailsDeferred);
        return updateAtmDetailsDeferred;
      },
      updateBranchDetails: function(id, payload) {
        updateBranchDetailsDeferred = $.Deferred();
        updateBranchDetails(id, payload, updateBranchDetailsDeferred);
        return updateBranchDetailsDeferred;
      }
    };
  };
  return new LocationUpdateModel();
});
