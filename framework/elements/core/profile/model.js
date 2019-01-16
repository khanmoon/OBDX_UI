define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  /**
   * This file contains the Tech Agnostic model
   * consisting of all the REST services APIs for the generic component row.
   *
   * @namespace PartyModel~model
   * @class PartyModel
   * @extends BaseService {@link BaseService}
   */
  var PartyModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),
      params;
    /**
     * This function fires a GET request to fetch the address associated with 'me' party id
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function fetchAddressInfo
     * @memberOf PartyModel

     * @example PartyModel.fetchAddressInfo();
     */
    var fetchAddressInfoDeferred, fetchAddressInfo = function(deferred) {
      var options = {
        url: "parties/me/addresses",
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
     * This function fires a GET request to fetch the contact points of specific party id
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function fetchContactInfo
     * @memberOf PartyModel
     * @param {String} partyId  - String indicating the party id whose contact points are to be fetched

     * @example PartyModel.fetchContactInfo(self.userDataFromParent.party.id.value)
     */
    var fetchContactInfoDeferred, fetchContactInfo = function(partyId, deferred) {
      params = {
        "partyId": partyId
      };
      var options = {
        url: "parties/{partyId}/contactPoints",
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
     * This function fires a GET request to fetch the login time
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function fetchLastLoginTime
     * @memberOf PartyModel

    * @example ProductService.fetchLastLoginTime();
     */
    var fetchPartyDeferred, fetchParty = function(deferred) {
      var options = {
        url: "me/party",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options, params);
    };
    var downloadPartyDetails = function(userType) {
      var url = "me/party?media=text/csv&mediaFormat=csv";
      if(userType === "ADMIN") {
        url = "me?media=text/csv&mediaFormat=csv";
      }
      var options = {
        url: url
      };
      baseService.downloadFile(options, params);
    };
    var logOut = function() {
      var options = {
        url: "session",
        success: function() {
          var form = document.createElement("form");
          form.action = "/logout.";
          document.body.appendChild(form);
          form.submit();
        }
      };
      baseService.remove(options);
    };
    return {
      fetchAddressInfo: function() {
        fetchAddressInfoDeferred = $.Deferred();
        fetchAddressInfo(fetchAddressInfoDeferred);
        return fetchAddressInfoDeferred;
      },
      fetchContactInfo: function(partyId) {
        fetchContactInfoDeferred = $.Deferred();
        fetchContactInfo(partyId, fetchContactInfoDeferred);
        return fetchContactInfoDeferred;
      },
      fetchParty: function() {
        fetchPartyDeferred = $.Deferred();
        fetchParty(fetchPartyDeferred);
        return fetchPartyDeferred;
      },
      downloadPartyDetails: function(userType) {
        downloadPartyDetails(userType);
      },
      logOut: function() {
        logOut();
      }
    };
  };
  return new PartyModel();
});
