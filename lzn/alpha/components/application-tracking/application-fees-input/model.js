define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for application fees input in the Application tracking additional details section. It serves as the model where the data to be used by the application details section is defined. Since this model is tech agnostic, it can be coupled with any technology.
   *
   * @namespace ApplicationFeesInputModel~Model
   * @class
   * @property {Object[]} sections - Array containing the distinct additional information sections
   */
  var ApplicationRepaymentInputModel = function() {
    /**
     * @class Model
     * @private
     * @memberOf ApplicationFeesInputModel~Model
     */
    var Model = function() {
        this.applicationFeesData = {
          feeTypes: "",
          defer: "",
          collect: "",
          capitalise: ""
        };
      },
      baseService = BaseService.getInstance(),
      appFeesDeffered, collectionTypeDeffered, accountsDeffered, feesUpdateDeffered, fetchAppFees = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/fees",
          success: function(data) {
            deferred.resolve(data);
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
      },
      fetchAccounts = function(deferred) {
        var options = {
          url: "parties/me/accounts/dda/internal",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      updateFeesCollection = function(submissionId, applicationId, data, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/fees",
          data: JSON.stringify(data),
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.update(options);
      };
    return {
      fetchAppFees: function(submissionId, applicationId) {
        appFeesDeffered = $.Deferred();
        fetchAppFees(submissionId, applicationId, appFeesDeffered);
        return appFeesDeffered;
      },
      fetchCollectionType: function() {
        collectionTypeDeffered = $.Deferred();
        fetchCollectionType(collectionTypeDeffered);
        return collectionTypeDeffered;
      },
      fetchAccounts: function() {
        accountsDeffered = $.Deferred();
        fetchAccounts(accountsDeffered);
        return accountsDeffered;
      },
      updateFeesCollection: function(submissionId, applicationId, data) {
        feesUpdateDeffered = $.Deferred();
        updateFeesCollection(submissionId, applicationId, data, feesUpdateDeffered);
        return feesUpdateDeffered;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      }
    };
  };
  return new ApplicationRepaymentInputModel();
});