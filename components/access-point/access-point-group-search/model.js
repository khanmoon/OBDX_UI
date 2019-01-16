define(["baseService","jquery"], function(BaseService, $) {
  "use strict";
  var AccessPointGroupSearchModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance();
    /**
     * This function fires a GET request to search the access point group
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function search
     * @memberOf ProductService
     * @param {Object} deferred - deferred object used to store data if successfully fetched
     * @param {Object} queryParams      - object containg search parameters
     * @example AccessPointGroupSearchModel.search(deferred,queryParams);
     * @returns {void}
     */
    var searchDeffered,
      search = function(deferred, queryParams) {
        var params = {
            "groupCode": queryParams.groupCode,
            "description": queryParams.description
          },
          options = {
            url: "accessPointGroups?accessPointGroupId={groupCode}&description={description}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      };
    /**
     * This function fires a GET request to fetch the access point group details
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function getAccessPointGroup
     * @memberOf ProductService
     * @param {Object} deferred - deferred object used to store data if successfully fetched
     * @param {String} groupCode      - access point group code
     * @example AccessPointGroupSearchModel.getAccessPointGroup(deferred,groupCode);
     * @returns {void}
     */
    var getAccessPointGroupDeffered,
      getAccessPointGroup = function(deferred, groupCode) {
        var params = {
            "groupCode": groupCode
          },
          options = {
            url: "accessPointGroups/{groupCode}",

            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      };
    /**
     * This function fires a GET request to fetch the access point  details
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function getAccessPoint
     * @memberOf ProductService
     * @param {Object} deferred - deferred object used to store data if successfully fetched
     * @param {String} accessPoint      - access point group code
     * @example AccessPointGroupSearchModel.getAccessPoint(deferred,accessPoint);
     * @returns {void}
     */
    var getAccessPointDeffered,
      getAccessPoint = function(deferred, accessPoint) {
        var params = {
            "accessPoint": accessPoint
          },
          options = {
            url: "accessPoints/{accessPoint}",

            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      };
    return {
      /**
       * This function fires a GET request to search the access point group
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched
       *
       * @function search
       * @memberOf ProductService
       * @param {Object} queryParams      - object containg search parameters
       * @example AccessPointGroupSearchModel.search(queryParams);
       * @returns {Object} searchDeffered - deferred object used to store data if successfully fetched
       */
      search: function(queryParams) {
        searchDeffered = $.Deferred();
        search(searchDeffered, queryParams);
        return searchDeffered;
      },
      /**
       * This function fires a GET request to fetch the access point group details
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched
       *
       * @function getAccessPointGroup
       * @memberOf ProductService
       * @param {String} groupCode      - access point group code
       * @example AccessPointGroupSearchModel.getAccessPointGroup(groupCode);
       * @returns {Object} getAccessPointGroupDeffered - deferred object used to store data if successfully fetched
       */
      getAccessPointGroup: function(groupCode) {
        getAccessPointGroupDeffered = $.Deferred();
        getAccessPointGroup(getAccessPointGroupDeffered, groupCode);
        return getAccessPointGroupDeffered;
      },
      /**
       * This function fires a GET request to fetch the access point  details
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched
       *
       * @function getAccessPoint
       * @memberOf ProductService
       * @param {String} accessPoint      - access point group code
       * @example AccessPointGroupSearchModel.getAccessPoint(accessPoint);
       * @returns {Object} getAccessPointDeffered - deferred object used to store data if successfully fetched
       */
      getAccessPoint: function(accessPoint) {
        getAccessPointDeffered = $.Deferred();
        getAccessPoint(getAccessPointDeffered, accessPoint);
        return getAccessPointDeffered;
      }
    };
  };
  return new AccessPointGroupSearchModel();
});
