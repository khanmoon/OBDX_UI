define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var CreateMappingModel = function () {
    var getMappingModel = function (dashboardId, mappedValue, mappedType, module) {
        return {
          dashboardId: dashboardId || null,
          mappedValue: mappedValue || null,
          mappedType: mappedType || null,
          module: module || null
        };
      },
      createMappingDeferred,
      createMapping = function (payload, deferred) {
        var options = {
          url: "dashboards/mappings",
          data: payload,
          success: function (data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function (data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      getEntitiesDeferred, fetchEntities = function (deferred) {
        var options = {
          url: "entities",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };
        baseService.fetchJSON(options);
      },
      Deferred, getDashboardList = function (deferred) {
        var options = {
          url: "dashboards",
          success: function (data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getSegmentRolesDeferred, getSegmentRoles = function (userType,deferred) {
        var options = {
          url: "applicationRoles?enterpriseRole={userType}&accessPointType=INT",
          success: function (data) {
            deferred.resolve(data);
          }
        },params={
          userType:userType
        };
        baseService.fetch(options,params);
      },
      checkUserExists = function (userType) {
        var options = {
          url: "users/"+userType
        };
        return baseService.fetch(options);
      };
    return {
      getDashboardList: function () {
        Deferred = $.Deferred();
        getDashboardList(Deferred);
        return Deferred;
      },
      getTargetLinkageModel: function (dashboardId, mappedValue, mappedType) {
        return new getMappingModel(dashboardId, mappedValue, mappedType);
      },
      createMapping: function (payload) {
        createMappingDeferred = $.Deferred();
        createMapping(payload, createMappingDeferred);
        return createMappingDeferred;
      },
      fetchEntities: function () {
        getEntitiesDeferred = $.Deferred();
        fetchEntities(getEntitiesDeferred);
        return getEntitiesDeferred;
      },
      getSegmentRoles: function (userType) {
        getSegmentRolesDeferred = $.Deferred();
        getSegmentRoles(userType,getSegmentRolesDeferred);
        return getSegmentRolesDeferred;
      },
      checkUserExists:function(userName){
        return checkUserExists(userName);
      }

    };
  };
  return new CreateMappingModel();
});
