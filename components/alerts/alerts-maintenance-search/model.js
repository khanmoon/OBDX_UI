define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * @namespace AlertsMaintenance~Model
   * @class AlertsMaintenanceModel
   * @extends BaseService {@link BaseService}
   */
  var AlertsMaintenanceModel = function() {
    var params, baseService = BaseService.getInstance();

    var fetchAlertsDeferred, fetchAlerts = function(activityId, eventId, moduleId, deferred) {
        params = {
          "activityId": activityId || "",
          "eventId": eventId || "",
          "moduleId": moduleId || ""
        };
        var options = {
          url: "activityEventActions?activityId={activityId}&eventId={eventId}&moduleId={moduleId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      fetchEventDescriptionListDeferred, fetchEventDescriptionList = function(moduleType, deferred) {

        var options = {
          url: "activityEvents?moduleId=" + moduleType,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchModuleTypeListDeferred, fetchModuleTypeList = function(deferred) {

        var options = {
          url: "enumerations/moduleTypes",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);

      };
    return {
      fetchAlerts: function(activityId, eventId, moduleId) {
        fetchAlertsDeferred = $.Deferred();
        fetchAlerts(activityId, eventId, moduleId, fetchAlertsDeferred);
        return fetchAlertsDeferred;
      },
      fetchEventDescriptionList: function(moduleType) {
        fetchEventDescriptionListDeferred = $.Deferred();
        fetchEventDescriptionList(moduleType, fetchEventDescriptionListDeferred);
        return fetchEventDescriptionListDeferred;
      },
      fetchModuleTypeList: function() {
        fetchModuleTypeListDeferred = $.Deferred();
        fetchModuleTypeList(fetchModuleTypeListDeferred);
        return fetchModuleTypeListDeferred;
      }
    };
  };
  return new AlertsMaintenanceModel();
});