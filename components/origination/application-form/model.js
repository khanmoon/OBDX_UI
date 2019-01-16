/*global define, console, require*/
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
  var ApplicationFormService = function() {

      /* Extending predefined baseService to get ajax functions. */
      var baseService = BaseService.getInstance();

    /**
     * Method to fetch the list of applicants against a particular applicant id
     *
     * @param  {type} submissionId   description
     * @param  {type} successHandler description
     * @return {type}                description
     */
    this.fetchpplicantList = function(submissionId, successHandler) {
      var options = {
        url: "submissions/" + submissionId + "/applicants",
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.fetch(options);
    };

    /**
     * this - description
     *
     * @param  {type} successHandler description
     * @param  {type} errorHandler   description
     * @return {type}                description
     */
    this.fetchUserType = function(successHandler, errorHandler) {
      var options = {
        showMessage: false,
        url: "me",
        success: function(data) {
          successHandler(data);
        },
        error: function(data) {
          errorHandler(data);
        }
      };
      baseService.fetch(options);
    };

    /**
     * this - description
     *
     * @param  {type} submissionId             description
     * @param  {type} facilityId               description
     * @param  {type} productGroupSerialNumber description
     * @param  {type} successHandler           description
     * @return {type}                          description
     */
    this.createApplicant = function(submissionId, facilityId, productGroupSerialNumber, successHandler) {
      var params = {
          "submissionId": submissionId
        },
        options = {
          url: "submissions/{submissionId}/applicants",
          data: JSON.stringify({
            facilityId: facilityId,
            productGroupSerialNumber: productGroupSerialNumber,
            applicantRelationshipType: "APPLICANT",
            partyType: "IND"
          }),
          success: function(data) {
            successHandler(data);
          }
        };
      baseService.add(options, params);
    };

    /**
     * this - description
     *
     * @param  {type} submissionId description
     * @param  {type} url          description
     * @param  {type} payload      description
     * @param  {type} deferred     description
     * @return {type}              description
     */
    this.validateLoan = function(submissionId, url, payload, deferred) {
      var params = {
          "submissionId": submissionId
        },
        options = {
          url: url,
          data: JSON.stringify(payload),
          success: function(data) {
            deferred.resolve(data);
          }
        };
      baseService.update(options, params);
      return deferred;
    };

    /**
     * this - description
     *
     * @param  {type} submissionId            description
     * @param  {type} applicantId             description
     * @param  {type} validateEmploymentIndex description
     * @param  {type} successHandler          description
     * @return {type}                         description
     */
    this.validateEmployment = function(submissionId, applicantId, validateEmploymentIndex, successHandler) {
      var params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/employments/validateEmployments",
          success: function(data) {
            successHandler(data, validateEmploymentIndex);
          }
        };
      baseService.fetch(options, params);
    };

    /**
     * this - description
     *
     * @param  {type} submissionId   description
     * @param  {type} applicantId    description
     * @param  {type} successHandler description
     * @return {type}                description
     */
    this.fetchOccupationDetails = function(submissionId, applicantId, successHandler) {
      var params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/employments",
          success: function(data) {
            successHandler(data);
          }
        };
      baseService.fetch(options, params);
    };
  };
  return new ApplicationFormService();
});
