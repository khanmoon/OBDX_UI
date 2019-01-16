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
    var
      baseService = BaseService.getInstance();

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

      },
      getTransactionsDeferred, getTransactions = function(deferred) {
        var options = {
          url: "resourceTasks?aspects=working-window",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchUserTypeDeferred, fetchUserType = function(deferred) {
        var
          options = {
            url : "enterpriseRoles?isLocal=true",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options);
      },
      getTransactionListDeferred, getTransactionList = function(selectedUser, startDate, taskCode, deferred) {
        var options = {
          url: "workingWindows?roleName=" + selectedUser + "&startDate=" + startDate + "&taskCode=" + taskCode + "&workingWindowType=EXCEPTION",
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
      },
      getTransactions: function() {
        getTransactionsDeferred = $.Deferred();
        getTransactions(getTransactionsDeferred);
        return getTransactionsDeferred;
      },
      fetchUserType: function() {
        fetchUserTypeDeferred = $.Deferred();
        fetchUserType(fetchUserTypeDeferred);
        return fetchUserTypeDeferred;
      },
      getTransactionList: function(selectedUser, startDate, taskCode) {
        getTransactionListDeferred = $.Deferred();
        getTransactionList(selectedUser, startDate, taskCode, getTransactionListDeferred);
        return getTransactionListDeferred;
      }
    };

  };
  return new UserGroupModel();
});