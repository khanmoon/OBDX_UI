define(["baseService"], function(BaseService) {
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
    return {
      getNewModel: function() {
        return new Model();
      },
      getScheduledReportFrequencyTypes: function() {
        var options = {
          url: "enumerations/scheduledReportFrequencyTypes"
        };
        return baseService.fetch(options);
      }

    };

  };
  return new ScheduledReportEditModel();
});
