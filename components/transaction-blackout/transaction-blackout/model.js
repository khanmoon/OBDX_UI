/*global define, console*/
define([
  "jquery",
  "baseService"

], function($, BaseService) {
  "use strict";

  /**
   * This file contains all the REST services APIs for the bank-look-up component.
   *
   * @class BankLookUpModel
   * @extends BaseService {@link BaseService}
   * @property {Object} baseService - baseService instance through which all the rest calls will be made.
   */
  var UserGroupModel = function() {
    var baseService = BaseService.getInstance();

    /**
     * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
     * @function fetchDetails
     *
     * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
     * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
     */
    var getPartyDetailsDeferred,
      getPartyDetails = function(partyId, deferred) {

        var options = {
          url: "administration/parties/" + partyId,

          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);

      };

    return {
      getPartyDetails: function(partyId) {
        getPartyDetailsDeferred = $.Deferred();
        getPartyDetails(partyId, getPartyDetailsDeferred);
        return getPartyDetailsDeferred;
      }
    };

  };
  return new UserGroupModel();
});