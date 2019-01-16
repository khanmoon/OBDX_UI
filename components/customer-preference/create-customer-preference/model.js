define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var CreateCPModel = function() {
    var baseService = BaseService.getInstance();
    /**
     * Function to get new instance of CreateCPModel
     * @function
     * @memberOf CreateCPModel
     * @returns Model
     */
    var modelInitialized = false,
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/

      /**
       * This function creates the customer preferences of valid party Id,
       * posts entered details filled in the form as request payload
       * @function createCP
       * @memberOf CreateCPModel
       **/
      createCPDeferred, createCP = function(partyId, payload, deferred) {
        var params = {
            "payload": payload,
            "partyId": partyId
          },
          options = {
            url: "parties/{partyId}/preferences/",

            data: payload,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };
        baseService.add(options, params);
      },
      /**
       * This function creates or updates the customer preferences of valid party Id,
       * posts updated details filled in the form as request payload
       * along with the party id ,
       * @function updateCP
       * @memberOf CreateCPModel
       **/
      updateCPDeferred, updateCP = function(partyId, payload, deferred) {
        var params = {
            "payload": payload,
            "partyId": partyId
          },
          options = {
            url: "parties/{partyId}/preferences",

            data: payload,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };
        baseService.update(options, params);
      },
      fetchChildRoleDeferred, fetchChildRole = function(enterpriseRoleId, deferred) {
        var params = {
            "enterpriseRoleId": enterpriseRoleId
          },
          options = {

            url: "applicationRoles?enterpriseRole=" + enterpriseRoleId,
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      };
    return {
      init: function() {
        modelInitialized = true;
        return modelInitialized;
      },
      createCP: function(partyId, payload) {
        createCPDeferred = $.Deferred();
        createCP(partyId, payload, createCPDeferred);
        return createCPDeferred;
      },
      updateCP: function(partyId, payload) {
        updateCPDeferred = $.Deferred();
        updateCP(partyId, payload, updateCPDeferred);
        return updateCPDeferred;
      },
      fetchChildRole: function(enterpriseRoleId) {
        fetchChildRoleDeferred = $.Deferred();
        fetchChildRole(enterpriseRoleId, fetchChildRoleDeferred);
        return fetchChildRoleDeferred;
      }
    };
  };
  return new CreateCPModel();
});