define(["baseService","jquery","framework/js/constants/constants"], function(BaseService, $,Constants) {
  "use strict";
  var AccordionModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    var baseService = BaseService.getInstance();
    var getGoalDetailsDeferred, getGoalDetails = function(deferred) {
      var options = {
        url: "goals?status=ACTIVE",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      if(Constants.userSegment==="ADMIN"){
        options.url="design-dashboard/data/personal-finance-management/goals-dashboard-card";
        baseService.fetchJSON(options);
      }else{
        baseService.fetch(options);
      }
    };
    return {
      getGoalDetails: function() {
        getGoalDetailsDeferred = $.Deferred();
        getGoalDetails(getGoalDetailsDeferred);
        return getGoalDetailsDeferred;
      }
    };
  };
  return new AccordionModel();
});
