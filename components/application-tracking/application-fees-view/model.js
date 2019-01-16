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
   * @return {Object}  description
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

      appFeesDeffered, collectionTypeDeffered,

      /**
       * fetchAppFees - description
       *
       * @param  {Object} submissionId  description
       * @param  {Object} applicationId description
       * @param  {Object} deferred      description
       * @return {void}               description
       */
      fetchAppFees = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/fees",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchFundingTableDeferred,

      /**
       * fetchFundingTable - description
       *
       * @param  {Object} submissionId  description
       * @param  {Object} applicationId description
       * @param  {Object} deferred      description
       * @return {void}               description
       */
      fetchFundingTable = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/fees",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },

      /**
       * fetchCollectionType - description
       *
       * @param  {Object} deferred description
       * @return {void}          description
       */
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

      /**
       * fetchAppFees - description
       *
       * @param  {Object} submissionId  description
       * @param  {Object} applicationId description
       * @return {void}               description
       */
      fetchAppFees: function(submissionId, applicationId) {
        appFeesDeffered = $.Deferred();
        fetchAppFees(submissionId, applicationId, appFeesDeffered);
        return appFeesDeffered;
      },

      /**
       * fetchFundingTable - description
       *
       * @param  {Object} submissionId  description
       * @param  {Object} applicationId description
       * @return {void}               description
       */
      fetchFundingTable: function(submissionId, applicationId) {
        fetchFundingTableDeferred = $.Deferred();
        fetchFundingTable(submissionId, applicationId, fetchFundingTableDeferred);
        return fetchFundingTableDeferred;
      },

      /**
       * fetchCollectionType - description
       *
       * @return {void}  description
       */
      fetchCollectionType: function() {
        collectionTypeDeffered = $.Deferred();
        fetchCollectionType(collectionTypeDeffered);
        return collectionTypeDeffered;
      }
    };
  };
  return new ApplicationFeesViewModel();
});