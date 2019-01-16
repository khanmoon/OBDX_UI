define(["baseService","jquery"], function(BaseService,$) {
  "use strict";
  var AccessPointGroupViewModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance();
    /**
     * This function fires a POST request to create the access point group
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function createAccessPointGroup
     * @memberOf ProductService
     * @param {Object} payload      - object containg access point group details
     * @param {Object} deferred - deferred object used to store data if successfully fetched
     * @example AccessPointGroupViewModel.createAccessPointGroup(payload, deferred);
     * @returns {void}
     */
    var createAccessPointGroupDeferred, createAccessPointGroup = function(payload, deferred) {
      var options = {
        data: payload,
        url: "accessPointGroups",
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };
      baseService.add(options);
    };
    /**
     * This function fires a POST request to update the access point group
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function updateAccessPointGroup
     * @memberOf ProductService
     * @param {Object} deferred - deferred object used to store data if successfully fetched
     * @param {Object} payload      - object containg access point group details
     * @param {String} groupCode - Group code of the access point to be updated
     * @example AccessPointGroupViewModel.updateAccessPointGroup(deferred, payload, groupCode);
     * @returns {void}
     */
    var updateAccessPointGroupDeferred, updateAccessPointGroup = function(deferred, payload, groupCode) {
      var params = {
          "groupCode": groupCode
        },
        options = {
          data: payload,
          url: "accessPointGroups/{groupCode}",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
      baseService.update(options, params);
    };
    return {
      /**
       * This function fires a POST request to create the access point group
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched
       *
       * @function createAccessPointGroup
       * @memberOf ProductService
       * @param {Object} payload      - object containg access point group details
       * @example AccessPointGroupViewModel.createAccessPointGroup(payload);
       * @returns {Object} createAccessPointGroupDeferred - object used to store data if successfully fetched
       */
      createAccessPointGroup: function(payload) {
        createAccessPointGroupDeferred = $.Deferred();
        createAccessPointGroup(payload, createAccessPointGroupDeferred);
        return createAccessPointGroupDeferred;
      },
      /**
       * This function fires a POST request to update the access point group
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched
       *
       * @function updateAccessPointGroup
       * @memberOf ProductService
       * @param {Object} payload      - object containg access point group details
       * @param {String} groupCode - Group code of the access point to be updated
       * @example AccessPointGroupViewModel.updateAccessPointGroup(payload, groupCode);
       * @returns {Object} updateAccessPointGroupDeferred - object used to store data if successfully fetched
       */
      updateAccessPointGroup: function(payload, groupCode) {
        updateAccessPointGroupDeferred = $.Deferred();
        updateAccessPointGroup(updateAccessPointGroupDeferred, payload, groupCode);
        return updateAccessPointGroupDeferred;
      }
    };
  };
  return new AccessPointGroupViewModel();
});
