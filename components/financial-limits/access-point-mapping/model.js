/**


 */
 define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var AccessPointLimitPackageModel = function() {
    var baseService = BaseService.getInstance();
    return {
      /**
       * listAccessPointGroup - fetches the AccessPointGroup List
       * @returns {Promise}  Returns the promise object
       */
      listAccessPointGroup: function() {
        var options = {
          url: "accessPointGroups"
        };
        return baseService.fetch(options);
      },
      /**
       * listLimitPackage - fetches the LimitPackages List
       * @returns {Promise}  Returns the promise object
       */
      listLimitPackage: function() {
        var options = {
          url: "limitPackage"
        };
        return baseService.fetch(options);
      },
      /**
       * listAccessPoint - fetches the Access Point List
       * @param {String} accessPointType - indicates the type for which access points are to be fetched
       * @returns {Promise}  Returns the promise object
       */
      listAccessPoint: function(accessPointType) {
        var options = {
          url: "accessPoints?accessType=" + accessPointType
        };
        return baseService.fetch(options);
      }
    };
  };
  return new AccessPointLimitPackageModel();
});
