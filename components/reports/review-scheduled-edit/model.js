define(["jquery","baseService"], function($, BaseService) {
  "use strict";
  var ScheduledReportEditModel = function() {
    var baseService = BaseService.getInstance();
    var Model = function() {
      this.payload = {
        reportRequestIdentifier: null,
        formatType: null,
        reportSchFreq: null,
        startTime: null,
        endTime: null,
        reportType: null
      };
    };
    var updateScheduledEditDeferred, updateScheduledEdit = function(deferred, payload) {
        var options = {
          url: "reports/reportRequest",
          data: payload,
           success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
        };
         baseService.update(options);
      };
    return {
      getNewModel: function() {
        return new Model();
      },
       updateScheduledEdit: function( payload) {
        updateScheduledEditDeferred = $.Deferred();
        updateScheduledEdit(updateScheduledEditDeferred, payload);
        return updateScheduledEditDeferred;
      }

    };

  };
  return new ScheduledReportEditModel();
});