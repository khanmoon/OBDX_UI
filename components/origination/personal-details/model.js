/*global define, console, require*/
/*jslint plusplus: true newcap: false*/
define([
  "baseService"

], function(BaseService) {
  "use strict";

  /**
   * <b>ApplicationFormService: </b> file containing service definitions for application form information section.
   * This file is written in JavaScript and jQuery and is independent of any other framework, this <b>Tech Agnostic
   * design makes service a resuable-injectable module, which can be used with any framework</b>.<br/><br/>
   * In order to make sure that all the available service calls are following the necessary protocols.<br/><br/>
   * Necessary service calls and utility functions for mentioned component/model includes:
   * <ul>
   *      <li>[fetchpplicantList()]{@link ApplicationFormService.fetchpplicantList}</li>
   * </ul>
   *
   * @namespace  ApplicationForm~ApplicationFormService
   * @constructor ApplicationFormService
   * @property {Object}   log - Logger reference
   * @property {Object}   baseService - The BaseService object
   * @property {boolean}  devMode - Whether in dev mode
   * @property {String}   baseUrl - URL string
   */
  var PersonalDetailsService = function() {

    var
      /* Extending predefined baseService to get ajax functions. */
      baseService = BaseService.getInstance();

    /**
     * Method to fetch the list of applicants against a particular applicant id
     *
     * @function fetchpplicantList
     * @memberOf ApplicationFormService
     * @param {Function} successHandler - Success callback function to be executed on success
     * @example
     *      ApplicationFormService.fetchpplicantList(successHandler);
     */

    this.fetchDocumentList = function(submissionId, applicantId, successHandler) {
      var params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/disclosures",
          selfLoader: true,
          success: function(data) {
            successHandler(data);
          }
        };
      baseService.fetch(options, params);
    };
    this.fetchExtraFields = function(successHandler) {
      var options = {
        url: "origination/extra-fields-payday",
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.fetchJSON(options);
    };
    this.fetchMandatoryFields = function(submissionId, sectionId, successHandler, isEditableField) {
      var params = {
          submissionId: submissionId,
          sectionId: sectionId
        },
        options = {
          showMessage: false,
          url: "submissions/{submissionId}/forms/sections/{sectionId}",
          success: function(data) {
            successHandler(data, isEditableField);
          }
        };
      baseService.fetch(options, params);
    };
    this.postMandatoryFields = function(submissionId, model, successHandler) {
      var params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/forms/sections",
          data: model,
          success: function(data) {
            successHandler(data);
          }
        };
      baseService.add(options, params);
    };
    this.fetchExistingOccupations = function(submissionId, applicantId, deferred) {
      var options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/employments",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function() {
            deferred.reject();
          }
        },
        params = {
          submissionId: submissionId,
          applicantId: applicantId
        };
      baseService.fetch(options, params);
      return deferred;
    };
  };
  return new PersonalDetailsService();
});
