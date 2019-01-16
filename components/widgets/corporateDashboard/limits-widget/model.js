define(["baseService","framework/js/constants/constants"], function(BaseService, Constants) {
  "use strict";
  var LimitsWigetModel = function() {
    var baseService = BaseService.getInstance();
    return {
      fetchCustomLimitPackages: function() {
        if(Constants.userSegment === "ADMIN"){
          return baseService.fetchJSON({
            url: "design-dashboard/data/corporateDashboard/limits-widget/customLimits"
          });
        }
          return baseService.fetch({
            url: "me/customLimitPackage"
          });

      },
      fetchUtilizationLimit: function(entityType, limitType) {
        if(Constants.userSegment === "ADMIN"){
          return baseService.fetchJSON({
            url: "design-dashboard/data/corporateDashboard/limits-widget/financialLimits"
          });
        }
          return baseService.fetch({
            url: "financialLimitUtilization?entityType={entityType}&limitType={limitType}"
          }, {
            entityType: entityType,
            limitType: limitType
          });


      },
      fetchAssignedLimitPackages: function(party) {
        if(Constants.userSegment === "ADMIN"){
          return baseService.fetchJSON({
            url: "design-dashboard/data/corporateDashboard/limits-widget/assignedLimits"
          });
        }
          return baseService.fetch({
            url: party === "PARTY" ? "me/party/assignedLimitPackage" : "me/assignedLimitPackage"
          });

      },
      getTransactionName: function() {
        if(Constants.userSegment === "ADMIN"){
          return baseService.fetchJSON({
            url: "design-dashboard/data/corporateDashboard/limits-widget/resourceTasks"
          });
        }
          return baseService.fetch({
            url: "resourceTasks?aspects=limit&view=list"
          });
      }

    };
  };
  return new LimitsWigetModel();
});
