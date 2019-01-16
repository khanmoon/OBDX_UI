define(["baseService"], function(BaseService) {
  "use strict";
  /**
   * Model for application details view section in the application tracking page. It serves as the model where the data to be used by the application details section is defined. Since this model is tech agnostic, it can be coupled with any technology.
   *
   * @namespace ApplicationDetailsViewModel~Model
   * @class ApplicationDetailsViewModel
   */
  var ApplicationListModel = function() {

    /**
     * Extending predefined baseService to get ajax functions. BaseService is the object through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance();
    /**
     * This function will fetch and return list of application under current submisison.It fires a rest api call, and once the call is completed, the function 'successHandler is fired, which is passed as an argument. It takes submissionId and applicationId also as arguments. Before placing the call, an 'option' object is created, which has the url, formed using submission and application ids and the successs handler bundled in it. Once the data is recieved, the success handler takes care of it, either storing it or a part of it in a local object, or modifying the UI.
     * @function fetchApplications
     * @memberOf ApplicationListService
     * @param {function} successHandler - function
     */
    this.fetchApplications = function(submissionId, successHandler) {
      var options = {
        url: "submissions/" + submissionId + "/applications",
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.fetch(options);
    };

    /**
     * Method to fetch applicant details for current submission and login.
     *
     * @function fetchCurrentUserDetails
     * @memberOf ApplicationListService
     * @param {function} successHandler - function
     */
    this.fetchCurrentUserDetails = function(successHandler) {
      var options = {
        url: "me",
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.fetch(options);
    };
    /**
     * Method to fetch list of applicants for the current submission id. This is required because the current user might be either a primary applicant or a co-applicant. In the subsequent screens, there are many options open only to the primary applicant.
     *
     * @function fetchCurrentUserDetails
     * @memberOf ApplicationListService
     * @param {String} submissionId - Submission Id for which applicant details are to be fetched
     * @param {String} applicantId - Applicant Id whowse details are to be fetched
     * @param {function} successHandler - function
     */
    this.fetchApplicantDetails = function(submissionId, successHandler) {
      var options = {
        url: "submissions/" + submissionId + "/applicants",
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.fetch(options);
    };
    this.fetchApplicationsDetails = function(submissionId, applicationId, successHandler) {
      var options = {
        url: "submissions/" + submissionId + "/applications/" + applicationId + "/applicants",
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.fetch(options);
    };
    /*
     * This function will fetch and return application stages for selected application.  It makes a rest api call to the server, and fires the successHandler once the request is completed successfully.
     * @function fetchApplicationStages
     * @memberOf ApplicationListService
     * @param function successHandler function
     */
    this.fetchApplicationStages = function(submissionId, applicationId, successHandler) {
      var options = {
        url: "submissions/" + submissionId + "/applications/" + applicationId + "/progress",
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.fetch(options);
    };
    /*
     * This function will fetch product class for product group code.
     * @function fetchProductClassName
     * @memberOf ApplicationListService
     * @param function successHandler function
     */
    this.fetchProductClassName = function(productGroupCode, successHandler) {
      var options = {
        url: "productGroups/" + productGroupCode,
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.fetch(options);
    };
    /*
     * This function will fetch and return application stages for selected application.  It makes a rest api call to the server, and fires the successHandler once the request is completed successfully.
     * @function fetchApplicationStages
     * @memberOf ApplicationListService
     * @param function successHandler function
     */
    this.fetchApplications = function(submissionId, successHandler) {
      var options = {
        url: "submissions/" + submissionId + "/applications",
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.fetch(options);
    };
    /*
     * This function will fetch and return application stages for selected application.  It makes a rest api call to the server, and fires the successHandler once the request is completed successfully.
     * @function fetchApplicationStages
     * @memberOf ApplicationListService
     * @param function successHandler function
     */
    this.fetchDraftApplications = function(payload, successHandler) {
      var options = {
        headers: {
          "BATCH_ID": "123456789"
        },
        url: "batch/",
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.batch(options, {});
    };
    this.fetchFlow = function(productCode, successHandler) {
      var options = {
        url: "origination/flows/" + productCode,
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.fetchJSON(options);
    };
    /*
     * This function will fetch and return application stages for selected application.  It makes a rest api call to the server, and fires the successHandler once the request is completed successfully.
     * @function fetchApplicationStages
     * @memberOf ApplicationListService
     * @param function successHandler function
     */
    this.fetchSubmittedApplications = function(submissionId, successHandler, errorHandler) {
      var options = {
        headers: {
          "BATCH_ID": "9654123"
        },
        url: "batch/",
        success: function(data) {
          successHandler(data);
        },
        error: function(data) {
          errorHandler(data);
        }
      };
      baseService.batch(options, {}, submissionId);
    };
  };
  return new ApplicationListModel();
});
