define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Additional Information Model. This file contains the model definition
   * for additional information section and exports the AdditionalInfoModel which can be injected
   * in any framework and developer will, by default get a self aware model for Additional
   * Information Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[fetchComponents()]{@link AdditionalInfoModel.fetchComponents}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace AdditionalInfo~AdditionalInfoModel
   * @class AdditionalInfoModel
   */
  var AdditionalInfoModel = function() {
    var baseService = BaseService.getInstance(),

      componentsListDeferred,

      /**
       * Private method to fetch list of Components. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function fetchComponents
       * @memberOf AdditionalInfoModel
       * @private
       */
      fetchComponents = function(deferred) {
        var options = {
          url: "app-tracker/mortgage-additional-input",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetchJSON(options);
      },
      fetchSelectedOfferDeferred, fetchSelectedOffer = function(submissionId, productGroupSerialNumber, deferred) {
        var params = {
            submissionId: submissionId,
            productGroupSerialNumber: productGroupSerialNumber
          },
          options = {
            url: "submissions/{submissionId}/products/{productGroupSerialNumber}/selectedOffer",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      confirmAccountConfigurationDeferred, confirmAccountConfiguration = function(submissionId, applicantId, deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            showMessage: false,
            url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration/loans/confirm",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.update(options, params);
      };
    return {
      /**
       * Public method to fetch list of Components. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .done(handler) to handle the data.
       *
       * @function fetchComponents
       * @memberOf AdditionalInfoModel
       * @returns deferredObject
       * @example
       *      AdditionalInfoModel.fetchComponents().done(function (data) {
       *
       *      });
       */
      fetchComponents: function() {
        componentsListDeferred = $.Deferred();
        fetchComponents(componentsListDeferred);
        return componentsListDeferred;
      },
      fetchSelectedOffer: function(submissionId, productGroupSerialNumber) {
        fetchSelectedOfferDeferred = $.Deferred();
        fetchSelectedOffer(submissionId, productGroupSerialNumber, fetchSelectedOfferDeferred);
        return fetchSelectedOfferDeferred;
      },
      confirmAccountConfiguration: function(submissionId, applicantId) {
        confirmAccountConfigurationDeferred = $.Deferred();
        confirmAccountConfiguration(submissionId, applicantId, confirmAccountConfigurationDeferred);
        return confirmAccountConfigurationDeferred;
      }
    };
  };
  return new AdditionalInfoModel();
});