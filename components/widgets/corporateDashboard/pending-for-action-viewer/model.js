define([
  "jquery",
  "baseService",
  "framework/js/constants/constants"
], function($, BaseService, Constants) {
  "use strict";
  var PendingActions = function() {
    var baseService = BaseService.getInstance();
    return {
      getCountForApproval: function(roleType) {
        var params = {
            "roleType": roleType
          },
          options = {
            url: "transactions/count?countFor=approval&roleType={roleType}",
            showMessage : false
          };
          if(Constants.userSegment === "ADMIN"){
            options.url = "design-dashboard/data/corporateDashboard/pending-for-action/pending-for-action-viewer";
            return baseService.fetchJSON(options);
          }
            return baseService.fetch(options,params);

      }
    };
  };
  return new PendingActions();
});
