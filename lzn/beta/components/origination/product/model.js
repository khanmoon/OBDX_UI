define(["jquery", "baseService"], function($, BaseService) {
  "use strict";
  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace Product~service
   * @class ProductService
   */
  var ProductService = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var params, baseService = BaseService.getInstance();
    /**
     * This function fires a GET request to fetch the product flow details
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function fetchProductFlow
     * @memberOf ProductService
     * @param {String} productCode      - String indicating the product code of the product whose flow details are to be fetched
     * @param {Function} successHandler - function to be called once the flow details are successfully fetched
     * @example ProductService.fetchProductFlow('productCode',handler);
     * @returns {void}
     */
    this.fetchProductFlow = function(productCode, successHandler) {
      var options = {
        url: "origination/flows/" + productCode,
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.fetchJSON(options);
    };
    var fetchAdditionalFlowDeferred = $.Deferred();
    this.fetchAdditionalFlow = function(coappJSON) {
      var options = {
        url: "origination/flows/" + coappJSON,
        success: function(data) {
          fetchAdditionalFlowDeferred.resolve(data);
        }
      };
      baseService.fetchJSON(options);
      return fetchAdditionalFlowDeferred;
    };
    var fetchRequiredFlowcontentDeferred = $.Deferred();
    this.fetchRequiredFlowcontent = function() {
      var options = {
        url: "origination/flows/content",
        success: function(data) {
          fetchRequiredFlowcontentDeferred.resolve(data);
        }
      };
      baseService.fetchJSON(options);
      return fetchRequiredFlowcontentDeferred;
    };
    var fetchRequiredFlowcontentmainDeferred = $.Deferred();
    this.fetchRequiredFlowcontentmain = function() {
      var options = {
        url: "origination/flows/content-main",
        success: function(data) {
          fetchRequiredFlowcontentmainDeferred.resolve(data);
        }
      };
      baseService.fetchJSON(options);
      return fetchRequiredFlowcontentmainDeferred;
    };
    var fetchRequiredFlowTemplateDeferred = $.Deferred();
    this.fetchRequiredFlowTemplate = function() {
      var options = {
        url: "origination/flows/template",
        success: function(data) {
          fetchRequiredFlowTemplateDeferred.resolve(data);
        }
      };
      baseService.fetchJSON(options);
      return fetchRequiredFlowTemplateDeferred;
    };
    var fetchRequiredFlowDeferred = $.Deferred();
    this.fetchRequiredFlow = function() {
      var options = {
        url: "origination/flows/required-flow",
        success: function(data) {
          fetchRequiredFlowDeferred.resolve(data);
        }
      };
      baseService.fetchJSON(options);
      return fetchRequiredFlowDeferred;
    };
    var fetchProductSummaryDeferred = $.Deferred();
    this.fetchProductSummary = function(submissionId) {
      params = {
        "submissionId": submissionId
      };
      var options = {
        url: "submissions/{submissionId}/summary",
        success: function(data) {
          fetchProductSummaryDeferred.resolve(data);
        }
      };
      baseService.fetch(options, params);
      return fetchProductSummaryDeferred;
    };
    var fetchUserTypeDeferred = $.Deferred();
    this.fetchUserType = function() {
      var options = {
        showMessage: false,
        url: "me",
        success: function(data) {
          fetchUserTypeDeferred.resolve(data);
        },
        error: function(data) {
          fetchUserTypeDeferred.reject(data);
        }
      };
      baseService.fetch(options);
      return fetchUserTypeDeferred;
    };
    var fetchApplicationInfoDeferred = $.Deferred();
    this.fetchApplicationInfo = function(paylod) {
      var options = {
        url: "applications/coApplicant/prospect",
        data: paylod,
        success: function(data) {
          fetchApplicationInfoDeferred.resolve(data);
        }
      };
      baseService.update(options);
      return fetchApplicationInfoDeferred;
    };
    this.fetchAssociatedOfferDetails = function(submissionId, productGroupSerialNumber, successHandler) {
      var params = {
          submissionId: submissionId,
          productGroupSerialNumber: productGroupSerialNumber
        },
        options = {
          url: "submissions/{submissionId}/products/{productGroupSerialNumber}/selectedOffer",
          success: function(data) {
            successHandler(data);
          }
        };
      baseService.fetch(options, params);
    };
    this.fetchOfferDetails = function(offerId, productType, successHandler) {
      var params = {
          offerId: offerId,
          productType: productType
        },
        options = {
          url: "offers/{offerId}?productType={productType}",
          success: function(data) {
            successHandler(data);
          }
        };
      baseService.fetch(options, params);
    };

    var fetchAdditionalOfferDetailsDeferred = $.Deferred();
    this.fetchAdditionalOfferDetails = function(offerId, productClassName) {
      var params = {
          offerId: offerId,
          productClassName: productClassName
        },
        options = {
          url: "offers/{offerId}?productType={productClassName}",
          success: function(data) {
            fetchAdditionalOfferDetailsDeferred.resolve(data);
          },
          error: function(data) {
            fetchAdditionalOfferDetailsDeferred.reject(data);
          }
        };
      baseService.fetch(options, params);
      return fetchAdditionalOfferDetailsDeferred;
    };
  };
  return new ProductService();
});
