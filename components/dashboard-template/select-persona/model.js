define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var DashboardListModel = function () {
    return {
      fetchDashboards: function (segment) {
        return baseService.fetch({
          url: "dashboards/default?segment={segment}"
        }, {
          segment: segment
        });
      },
      fetchDashboardDesign: function (segment, module) {
        return baseService.fetch({
          url: "dashboards/modules?module={module}&segment={segment}"
        }, {
          segment: segment,
          module: module
        });
      },
      getSegmentRoles:function(segment){
        return baseService.fetch({
          url: "applicationRoles?enterpriseRole={segment}&accessPointType=INT"
        }, {
          segment: segment
        });
      }
    };
  };
  return new DashboardListModel();
});