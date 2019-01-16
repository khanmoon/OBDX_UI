define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ReviewLimitPackageModel = function() {
    var baseService = BaseService.getInstance(),
      fetchPackageDetailsDeffered, fetchPackageDetails = function(packageId, deffered) {
        var options = {
          url: "limitPackages/" + packageId,
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);

      },
      deletePackageDeffered, deletePackage = function(packageId, deffered) {
        var options = {
          url: "limitPackages/" + packageId,

          success: function(data, status, jqXhr) {
            deffered.resolve(data, status, jqXhr);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.remove(options);
      },
      createNewPackageDeffered, createNewPackage = function(payload, deffered) {
        var options = {
          url: "limitPackages",
          data: payload,
          success: function(data, status, jqXhr) {
            deffered.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deffered.reject(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      getTransactionNameDeferred, getTransactionName = function(taskId, deferred) {
        var options = {
          url: "resourceTasks/" + taskId,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.fetch(options);
      },

      getTransactionGroupNameDeffered, getTransactionGroupName = function(taskGroupId, deffered) {
        var options = {

          url: "taskGroups/" + taskGroupId,
          success: function(data, status, jqXhr) {
            deffered.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deffered.reject(data, status, jqXhr);
          }
        };
        baseService.fetch(options);
      },
      fetchAccessPointDeffered, fetchAccessPoint = function(deffered) {
        var options = {

          url: "accessPoints",
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchAccessPointGroupDeffered, fetchAccessPointGroup = function(deffered) {
        var options = {

          url: "accessPointGroups",
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      },

      updatePackageDeffered, updatePackage = function(payload, deffered) {
        var options = {
          url: "limitPackages/" + JSON.parse(payload).key.id,
          data: payload,
          success: function(data, status, jqXhr) {
            deffered.resolve(data, status, jqXhr);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.update(options);
      };
    return {
      fetchPackageDetails: function(packageId) {
        fetchPackageDetailsDeffered = $.Deferred();
        fetchPackageDetails(packageId, fetchPackageDetailsDeffered);
        return fetchPackageDetailsDeffered;
      },
      deletePackage: function(packageId) {
        deletePackageDeffered = $.Deferred();
        deletePackage(packageId, deletePackageDeffered);
        return deletePackageDeffered;
      },
      createNewPackage: function(payload) {
        createNewPackageDeffered = $.Deferred();
        createNewPackage(payload, createNewPackageDeffered);
        return createNewPackageDeffered;
      },
      getTransactionName: function(taskId) {
        getTransactionNameDeferred = $.Deferred();
        getTransactionName(taskId, getTransactionNameDeferred);
        return getTransactionNameDeferred;
      },
      getTransactionGroupName: function(taskGroupId) {
        getTransactionGroupNameDeffered = $.Deferred();
        getTransactionGroupName(taskGroupId, getTransactionGroupNameDeffered);
        return getTransactionGroupNameDeffered;
      },
      fetchAccessPoint: function() {
        fetchAccessPointDeffered = $.Deferred();
        fetchAccessPoint(fetchAccessPointDeffered);
        return fetchAccessPointDeffered;
      },
      fetchAccessPointGroup: function() {
        fetchAccessPointGroupDeffered = $.Deferred();
        fetchAccessPointGroup(fetchAccessPointGroupDeffered);
        return fetchAccessPointGroupDeffered;
      },
      updatePackage: function(payload) {
        updatePackageDeffered = $.Deferred();
        updatePackage(payload, updatePackageDeffered);
        return updatePackageDeffered;
      }
    };
  };
  return new ReviewLimitPackageModel();
});
