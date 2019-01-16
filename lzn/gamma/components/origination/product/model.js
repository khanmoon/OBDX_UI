define(["baseService", "jquery"], function(BaseService, $) {
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
     * @returns {void}
     * @example ProductService.fetchProductFlow('productCode',handler);
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
    var fetchSubmissionListDeferred = $.Deferred();
    this.fetchSubmissionList = function() {
      var options = {
        url: "submissions",
        success: function(data) {
          fetchSubmissionListDeferred.resolve(data);
        }
      };
      baseService.fetch(options);
      return fetchSubmissionListDeferred;
    };
    var createSubmissionDeferred = $.Deferred();
    this.createSubmission = function(payload) {
      var options = {
        url: "submissions/",
        showMessage: false,
        data: JSON.stringify(payload),
        success: function(data) {
          createSubmissionDeferred.resolve(data);
        },
        error: function(data) {
          createSubmissionDeferred.reject(data);
        }
      };
      baseService.add(options);
      return createSubmissionDeferred;
    };
    var createApplicantDeferred = $.Deferred();
    this.createApplicant = function(submissionId, payload) {
      var params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/applicants",
          data: JSON.stringify(payload),
          success: function(data) {
            createApplicantDeferred.resolve(data);
          },
          error: function(data) {
            createApplicantDeferred.reject(data);
          }
        };
      baseService.add(options, params);
      return createApplicantDeferred;
    };
    var getDealerVehicleDetailsDeferred = $.Deferred();
    this.getDealerVehicleDetails = function(transactionId) {
      var params = {
          transactionId: transactionId
        },
        options = {
          url: "loanItems/{transactionId}",
          success: function(data) {
            getDealerVehicleDetailsDeferred.resolve(data);
          },
          error: function(data) {
            getDealerVehicleDetailsDeferred.reject(data);
          }
        };
      baseService.fetch(options, params);
      return getDealerVehicleDetailsDeferred;
    };
    var deleteDealerVehicleDetailsDeferred = $.Deferred();
    this.deleteDealerVehicleDetails = function(transactionId) {
      var params = {
          transactionId: transactionId
        },
        options = {
          url: "loanItems/{transactionId}",
          success: function(data) {
            deleteDealerVehicleDetailsDeferred.resolve(data);
          },
          error: function(data) {
            deleteDealerVehicleDetailsDeferred.reject(data);
          }
        };
      baseService.remove(options, params);
      return deleteDealerVehicleDetailsDeferred;
    };
    var submitRequirementsDeferred = $.Deferred();
    this.submitRequirements = function(submissionId, requirements) {
      params = {
        "submissionId": submissionId
      };
      var options = {
        url: "submissions/{submissionId}/loanApplications",
        data: requirements,
        success: function(data) {
          submitRequirementsDeferred.resolve(data);
        },
        error: function(data) {
          submitRequirementsDeferred.reject(data);
        }
      };
      baseService.add(options, params);
      return submitRequirementsDeferred;
    };
    var validateLoanDeferred = $.Deferred();
    this.validateLoan = function(submissionId, payload) {
      var params = {
          "submissionId": submissionId
        },
        options = {
          url: "submissions/{submissionId}/loanApplications/validation",
          data: JSON.stringify(payload),
          success: function(data) {
            validateLoanDeferred.resolve(data);
          }
        };
      baseService.update(options, params);
      return validateLoanDeferred;
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
    var fetchRequiredFlowPagesDeferred = $.Deferred();
    this.fetchRequiredFlowPages = function() {
      var options = {
        url: "origination/flows/pages",
        success: function(data) {
          fetchRequiredFlowPagesDeferred.resolve(data);
        }
      };
      baseService.fetchJSON(options);
      return fetchRequiredFlowPagesDeferred;
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
    var fetchRequiredWorkflowDeferred = $.Deferred();
    this.fetchRequiredWorkflow = function(productClass, productSubClass) {
      var params = {
          productClass: productClass,
          productSubClass: productSubClass
        },
        options = {
          url: "workflows?productClass={productClass}&productSubClass={productSubClass}&status=active",
          success: function(data) {
            fetchRequiredWorkflowDeferred.resolve(data);
          }
        };
      baseService.fetch(options, params);
      return fetchRequiredWorkflowDeferred;
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
    var fetchApplicantsDeferred = $.Deferred();
    this.fetchApplicants = function(submissionId) {
      var options = {
        url: "submissions/" + submissionId + "/applicants",
        success: function(data) {
          fetchApplicantsDeferred.resolve(data);
        }
      };
      baseService.fetch(options);
      return fetchApplicantsDeferred;
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
  };
  return new ProductService();
});
