define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var LocationSearchModel = function() {
    var baseService = BaseService.getInstance(),
      Model = function() {
        this.locationAddAtmPayload = {
            "id": "",
            "name": "",
            "bankCode": "",
            "postalAddress": "",
            "supportedServices": [],
            "type": "ATM",
            "geoCoordinate": {
              "latitude": "",
              "longitude": ""
            }
          };
          this.locationAddBranchPayload = {
            "id": "",
            "name": "",
            "bankCode": "",
            "postalAddress": "",
            "workTimings": [],
            "workDays": [],
            "branchPhone": [],
            "supportedServices": [],
            "type": "BRANCH",
            "geoCoordinate": {
              "latitude": "",
              "longitude": ""
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

    var
      fetchSupportedServicesDeferred,
      fetchSupportedServices = function(type, deferred) {
        var options = {
          url: "locator/services?type=" + type.toUpperCase(),
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      addAtmLocationDeferred, addAtmLocation = function(payload, deferred) {
        var options = {
          url: "locator/atms",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      addBranchLocationDeferred, addBranchLocation = function(payload, deferred) {
        var options = {
          url: "locator/branches",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },

      uploadDocumentDeferred, uploadDocument = function(file, deferred) {
        var form = new FormData();
        form.append("file", file);
        var options = {
          url: "locator/upload?type=BRANCH",
          formData: form,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.uploadFile(options);
      };

    return {
      getNewModel: function() {
        return new Model();
      },
      fetchSupportedServices: function(type) {
        fetchSupportedServicesDeferred = $.Deferred();
        fetchSupportedServices(type, fetchSupportedServicesDeferred);
        return fetchSupportedServicesDeferred;
      },
      addAtmLocation: function(payload) {
        addAtmLocationDeferred = $.Deferred();
        addAtmLocation(payload, addAtmLocationDeferred);
        return addAtmLocationDeferred;
      },
      addBranchLocation: function(payload) {
        addBranchLocationDeferred = $.Deferred();
        addBranchLocation(payload, addBranchLocationDeferred);
        return addBranchLocationDeferred;
      },
      uploadDocument: function(file) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(file, uploadDocumentDeferred);
        return uploadDocumentDeferred;
      }
    };
  };
  return new LocationSearchModel();
});
