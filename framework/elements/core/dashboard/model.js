define(["baseService"], function (BaseService) {
  "use strict";
  var DashboardModel = function () {
    var baseService = BaseService.getInstance(),
      params;
    return {
      fetchDetails: function (urlParams) {
        var options = {
          url: urlParams
        };
        return baseService.fetch(options);
      },
      fetchPartyDetails: function () {
        var options = {
          url: "me/party",
          showMessage: false
        };
        return baseService.fetch(options);
      },
      fetchModules: function (moduleName) {
        params = {
          "moduleName": moduleName
        };
        var options = {
          url: "dashboards/modules?module={moduleName}"
        };
        return baseService.fetch(options, params);
      },
      fetchAvailableLocale: function () {
        var options = {
          url: "enumerations/locale"
        };
        return baseService.fetch(options);
      },
      getMailCount: function () {
        var options = {
          url: "mailbox/count?msgFlag=T"
        };
        return baseService.fetch(options);
      }
    };
  };
  return new DashboardModel();
});