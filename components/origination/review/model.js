/*global define, console, require*/
/*jslint plusplus: true newcap: false*/
define(["jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Tech Agnostic Service instance for Primary Info component.
   *
   * @namespace Review.service
   * @class ReviewService
   * @extends BaseService {@link BaseService}
   */

  /**
   * var ReviewService - description
   *
   * @return {type}  description
   */
  var ReviewService = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var params, baseService = BaseService.getInstance();

    /**
     * Method to submit application, this method will be called when user clicks
     * on final submit button after reviewing the entire application in review
     * screen.
     *
     * @function submitApplication
     * @memberOf ReviewService
     * @param {String} submissionId submission id against which application is to be submitted
     * @param {Function} successHandler function to be called as a callback on success
     * @example
     *      ReviewService.submitApplication(submissionId, handler);
     */

    /**
     * this - description
     *
     * @param  {type} submissionId   description
     * @param  {type} successHandler description
     * @param  {type} errorHandler   description
     * @return {type}                description
     */
    this.submitApplication = function(submissionId, successHandler, errorHandler) {
      params = {
        "submissionId": submissionId
      };
      var options = {
        url: "submissions/{submissionId}",
        success: function(data) {
          successHandler(data);
        },
        error: function(data) {
          errorHandler(data);
        }
      };
      baseService.update(options, params);
    };
    var downloadDocumentDeferred = $.Deferred();
    /**
     * Private method to download the file from server.
     * This method will only be called if submissionId is present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function downloadDocument
     * @memberOf DocumentUploadModel
     * @param {String} contentId - document reference id
     * @param {String} ownerId - applicant id of owner
     * @param {Object} deferred - An object type Deferred
     * @returns {void}
     * @private
     */

    /**
     * this - description
     *
     * @param  {type} contentId   description
     * @param  {type} applicantId description
     * @return {type}             description
     */
    this.downloadDocument = function(contentId, applicantId) {
      var params = {
        contentId: contentId,
        mediaType: "media",
        ownerId: applicantId
      };
      var options = {
        url: "contents/{contentId}?alt={mediaType}&ownerId={ownerId}&transactionType=OR",
        success: function(data) {
          downloadDocumentDeferred.resolve(data);
        }
      };
      baseService.downloadFile(options, params);
      return downloadDocumentDeferred;
    };

    /**
     * this - description
     *
     * @param  {type} submissionId description
     * @param  {type} deferred     description
     * @return {type}              description
     */
    this.fetchRegistrationRequired = function(submissionId, deferred) {
      params = {
        "submissionId": submissionId
      };
      var options = {
        url: "submissions/{submissionId}/registrationValidation",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options, params);
      return deferred;
    };

    /**
     * this - description
     *
     * @param  {type} documentUrl description
     * @param  {type} ownerId     description
     * @param  {type} contentId   description
     * @return {type}             description
     */
    this.fetchDocumentsByteArray = function(documentUrl, ownerId, contentId) {
      params = {
        documentUrl: contentId.value,
        mediaType: "media",
        ownerId: ownerId

      };
      var options = {
        url: "contents/{documentUrl}?alt={mediaType}&ownerId={ownerId}"
      };
      baseService.downloadFile(options, params);
    };
    /**
     * Private method to get the detailed list of uploaded documents.
     * This method will only be called if submissionId is present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function fetchUploadedDocuments
     * @memberOf DocumentUploadModel
     * @param {String} submissionId - Submission id of the application
     * @param {Object} deferred - An object type Deferred
     * @returns {void}
     * @private
     */

    /**
     * this - description
     *
     * @param  {type} submissionId description
     * @param  {type} deferred     description
     * @return {type}              description
     */
    this.fetchUploadedDocuments = function(submissionId, deferred) {
      var params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/documents",
          success: function(data) {
            deferred.resolve(data);
          }
        };
      baseService.fetch(options, params);
      return deferred;
    };

    /**
     * this - description
     *
     * @param  {type} submissionId   description
     * @param  {type} successHandler description
     * @return {type}                description
     */
    this.getApplications = function(submissionId, successHandler) {
      params = {
        "submissionId": submissionId
      };
      var options = {
        url: "submissions/{submissionId}/applications",
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.fetch(options, params);
    };


    /**
     * this - description
     *
     * @param  {type} submissionId   description
     * @param  {type} applicactionId description
     * @param  {type} successHandler description
     * @return {type}                description
     */
    this.getAccountId = function(submissionId, applicactionId, successHandler) {
      params = {
        "submissionId": submissionId,
        "applicactionId": applicactionId
      };
      var options = {
        url: "submissions/{submissionId}/applications/{applicactionId}/summary",
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.fetch(options, params);
    };


    /**
     * this - description
     *
     * @param  {type} submissionId             description
     * @param  {type} productGroupSerialNumber description
     * @param  {type} successHandler           description
     * @return {type}                          description
     */
    this.getSelectedOffer = function(submissionId, productGroupSerialNumber, successHandler) {
      var params = {
        submissionId: submissionId,
        productGroupSerialNumber: productGroupSerialNumber
      };
      var options = {
        url: "submissions/{submissionId}/products/{productGroupSerialNumber}/selectedOffer",
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.fetch(options, params);
    };

  };

  return new ReviewService();
});
