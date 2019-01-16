define(["jquery", "baseService"], function($, BaseService) {
  "use strict";

  /**
   * var ApplicationTrackingBaseModel - description
   *
   * @return {type}  description
   */
  var ApplicationTrackingBaseModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance();

    var fetchUserProfileDeferred = $.Deferred();
    this.fetchUserProfile = function() {
      var options = {
        url: "me",
        success: function(data) {
          fetchUserProfileDeferred.resolve(data);
        },
        error: function(data) {
          fetchUserProfileDeferred.reject(data);
        }
      };
      baseService.fetch(options);
      return fetchUserProfileDeferred;
    };

    /**
     * this - description
     *
     * @return {type}  description
     */
    this.fetchSubmissionIdList = function() {
      var options = {
        url: "submissions"
      };
      return baseService.fetch(options);
    };

    /**
     * this - description
     *
     * @return {type}  description
     */
    this.fetchApplicationStatusStringMap = function() {
      var options = {
        url: "enumerations/applicationStatus"
      };
       return baseService.fetch(options);
    };

    /**
     * this - description
     *
     * @return {type}  description
     */
    this.fetchSubmissionStatusStringMap = function() {
      var options = {
        url: "enumerations/submissionStatus"
      };
      return baseService.fetch(options);
    };

    /**
     * this - description
     *
     * @param  {type} submissionId   description
     * @param  {type} applicationId  description
     * @param  {type} successHandler description
     * @return {type}                description
     */
    this.fetchApplicationStages = function(submissionId, applicationId, successHandler) {
      var options = {
        url: "submissions/" + submissionId + "/applications/" + applicationId + "/progress",
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.fetch(options);
    };

    /**
     * this - description
     *
     * @param  {type} productCode    description
     * @param  {type} successHandler description
     * @return {type}                description
     */
    this.fetchFlow = function(productCode, successHandler) {
      var options = {
        url: "origination/flows/" + productCode,
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.fetchJSON(options);
    };

  };
  return new ApplicationTrackingBaseModel();
});
