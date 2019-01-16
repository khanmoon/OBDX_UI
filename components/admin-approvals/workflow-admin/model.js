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
  var WorkflowValidateModel = function() {
    this.approvals = {
      "partyId": null,
      "userType": "ADMIN",
      "partyName": null,
      "workflowDetailsFetched": false,
      "additionalDetails": "",
      "userTypeLabel": ""
    };
    var baseService = BaseService.getInstance(),
      Model = function() {
        this.approvals = {
          "partyId": null,
          "userType": "ADMIN",
          "partyName": null,
          "workflowDetailsFetched": false,
          "additionalDetails": "",
          "userTypeLabel": "",
          "workflowCode": null,
          "workflowName": "",
          "workflowDescription": ""
        };
      },
      /**
       * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
       * @function fetchDetails
       *
       * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
       * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
       */
      fetchDetailsDeferred, fetchDetails = function(workflowId, desc, deferred) {
        var options = {
          url: "approvalWorkflows?workflowName={workflowId}&description={desc}",
          success: function(data) {
            deferred.resolve(data);
          },
          failure: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, {
          workflowId: workflowId,
          desc: desc
        });
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      fetchDetails: function(workflowId, desc) {
        fetchDetailsDeferred = $.Deferred();
        fetchDetails(workflowId, desc, fetchDetailsDeferred);
        return fetchDetailsDeferred;
      }
    };
  };
  return new WorkflowValidateModel();
});