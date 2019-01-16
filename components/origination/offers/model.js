define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var OffersModel = function() {
    var Model = function() {
        this.offers = {
          offerName: "",
          features: "",
          offerId: ""
        };
      },
      baseService = BaseService.getInstance(),
      submissionId, productGroupSerialNumber, productsGroupId, getOffersDeferred, getOffers = function(deferred) {
        var params = {
            submissionId: submissionId,
            productsGroupId: productsGroupId
          },
          options = {
            url: "productGroups/{productsGroupId}/offers",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      fetchRequirementsDeferred,
      fetchRequirements = function(deferred) {
        var params = {
          "submissionId": submissionId
        };
        var options = {
          url: "submissions/{submissionId}/loanApplications",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      fetchSubmissionSummaryDeferred,
      fetchSubmissionSummary = function(deferred) {
        var params = {
          "submissionId": submissionId
        };
        var options = {
          url: "submissions/{submissionId}/summary",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      fetchSelectedOfferDeferred, fetchSelectedOffer = function(deferred) {
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
      submitRequirementsDeferred,
      submitRequirements = function(url, requirements, deferred) {
        var params = {
          "submissionId": submissionId
        };
        var options = {
          url: url,
          data: requirements,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options, params);
      },
      submitOffersDeferred, submitOffers = function(offerId, deferred) {
        var params = {
            submissionId: submissionId,
            productGroupSerialNumber: productGroupSerialNumber
          },
          options = {
            url: "submissions/{submissionId}/products/{productGroupSerialNumber}/selectedOffer",
            data: JSON.stringify({
              "offerId": offerId
            }),
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.add(options, params);
      };
    return {
      init: function(subId, productsGrpId) {
        submissionId = subId || undefined;
        productsGroupId = productsGrpId || undefined;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getOffers: function() {
        getOffersDeferred = $.Deferred();
        getOffers(getOffersDeferred);
        return getOffersDeferred;
      },
      fetchRequirements: function() {
        fetchRequirementsDeferred = $.Deferred();
        fetchRequirements(fetchRequirementsDeferred);
        return fetchRequirementsDeferred;
      },
      fetchSubmissionSummary: function() {
        fetchSubmissionSummaryDeferred = $.Deferred();
        fetchSubmissionSummary(fetchSubmissionSummaryDeferred);
        return fetchSubmissionSummaryDeferred;
      },
      fetchSelectedOffer: function() {
        fetchSelectedOfferDeferred = $.Deferred();
        fetchSelectedOffer(fetchSelectedOfferDeferred);
        return fetchSelectedOfferDeferred;
      },
      submitRequirements: function(url, requirements) {
        submitRequirementsDeferred = $.Deferred();
        submitRequirements(url, requirements, submitRequirementsDeferred);
        return submitRequirementsDeferred;
      },
      submitOffers: function(offerId) {
        submitOffersDeferred = $.Deferred();
        submitOffers(offerId, submitOffersDeferred);
        return submitOffersDeferred;
      }
    };
  };
  return new OffersModel();
});