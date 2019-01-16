/*global define, console, require*/
/*jslint plusplus: true newcap: false*/
define([
  "baseService", "jquery"
], function(BaseService, $) {
  "use strict";
  /**
   * Tech Agnostic Service instance for Primary Info component.
   *
   * @namespace Review.service
   * @class ReviewService
   * @extends BaseService {@link BaseService}
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
    this.submitApplication = function(submissionId, successHandler) {
      params = {
        "submissionId": submissionId
      };
      var options = {
        url: "submissions/{submissionId}",
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.update(options, params);
    };

    var fetchRegistrationRequiredDeferred = $.Deferred();
    this.fetchRegistrationRequired = function(submissionId) {
      params = {
        "submissionId": submissionId
      };
      var options = {
        url: "submissions/{submissionId}/registrationValidation",
        success: function(data) {
          fetchRegistrationRequiredDeferred.resolve(data);
        }
      };
      baseService.fetch(options, params);
      return fetchRegistrationRequiredDeferred;
    };
    this.fetchDocumentsByteArray = function(documentUrl, ownerId, contentId) {
      params = {
        documentUrl: contentId.value,
        mediaType: "media",
        ownerId: ownerId

      };
      var options = {
        url: "contents/{documentUrl}?alt={mediaType}&ownerId={ownerId}&transactionType=OR"
      };
      baseService.downloadFile(options, params);
    };

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
