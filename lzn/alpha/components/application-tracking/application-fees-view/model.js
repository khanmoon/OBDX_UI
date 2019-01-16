define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for application fees view in the Application tracking additional details section. It serves as the model where the data to be used by the application details section is defined. Since this model is tech agnostic, it can be coupled with any technology.
   *
   * @namespace ApplicationFeesViewModel~Model
   * @class
   * @property {Object[]} sections - Array containing the distinct additional information sections
   */
  var ApplicationFeesViewModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),

      appFeesDeffered, collectionTypeDeffered, fetchAppFees = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/fees",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchFundingTableDeferred, fetchFundingTable = function(submissionId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/fundingTable",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchCollectionType = function(deferred) {
        var options = {
          url: "enumerations/collectionType",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchAppFees: function(submissionId, applicationId) {
        appFeesDeffered = $.Deferred();
        fetchAppFees(submissionId, applicationId, appFeesDeffered);
        return appFeesDeffered;
      },
      fetchFundingTable: function(submissionId) {
        fetchFundingTableDeferred = $.Deferred();
        fetchFundingTable(submissionId, fetchFundingTableDeferred);
        return fetchFundingTableDeferred;
      },
      fetchCollectionType: function() {
        collectionTypeDeffered = $.Deferred();
        fetchCollectionType(collectionTypeDeffered);
        return collectionTypeDeffered;
      }
    };
  };
  return new ApplicationFeesViewModel();
});