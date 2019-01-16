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


    /* Extending predefined baseService to get ajax functions. */
    var baseService = BaseService.getInstance();


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
          showMessage: false,
          url: "submissions/{submissionId}/applicants/{applicantId}/disclosures",
          selfLoader: true,
          success: function(data) {
            successHandler(data);
          }
        };
      baseService.fetch(options, params);
    };


  };
  return new PersonalDetailsService();
});
