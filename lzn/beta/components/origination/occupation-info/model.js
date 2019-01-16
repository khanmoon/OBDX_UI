define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Ocucpation Information Model. This file contains the model definition
   * for occupation information section and exports the OccupationInfoModel which can be injected
   * in any framework and developer will, by default get a self aware model for Occupation
   * Information Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Model for Income Section using [getNewModel()]{@link OccupationInfoModel.getNewModel}</li>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[fetchOccupationDetails()]{@link OccupationInfoModel.fetchOccupationDetails}</li>
   *              <li>[fetchOccupationType()]{@link OccupationInfoModel.fetchOccupationType}</li>
   *              <li>[fetchEmploymentStatus()]{@link OccupationInfoModel.fetchEmploymentStatus}</li>
   *              <li>[fetchCountryList()]{@link OccupationInfoModel.fetchCountryList}</li>
   *              <li>[addEmploymentDetails()]{@link OccupationInfoModel.addEmploymentDetails}</li>
   *              <li>[updateEmploymentDetails()]{@link OccupationInfoModel.updateEmploymentDetails}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace OccupationInfo~OccupationInfoModel
   * @class OccupationInfoModel
   * @property {String} title - occupation title
   * @property {String} type - occupation type
   * @property {String} status - current occupation status
   * @property {String} industry - industry
   * @property {String} occupation - occupation of user
   * @property {String} department - department of user
   * @property {String} designation - designation of user
   * @property {String} employeeId - employees id of user
   * @property {String} grossAnnualSalary - gross annual salary
   * @property {Object} startDate - start date of employment
   * @property {String} startDate.dateString - string containing start date of employment
   * @property {Object} endDate - end date of employment
   * @property {String} endDate.dateString - string containing end date of employment
   * @property {String} employerName - employer's name
   * @property {Boolean} isPrimary - current occupation is primary primary occupation
   * @property {Boolean} isCompleting - co-applicant is self filling the form
   * @property {String} reference - reference
   * @property {Object} employerAddress - address of employer
   * @property {String} employerAddress.country - country of employer
   * @property {String} employerAddress.state - state in which employer operates
   * @property {String} employerAddress.city - city in which employer operates
   * @property {String} employerAddress.zipCode - zipcode in which employer operates
   * @property {String} employerAddress.line1 - address line 1
   * @property {String} employerAddress.line2 - address line 2
   */
  return function OccupationInfoModel() {
    /**
     * In case more than one instance of model is required, eg for main and co-applicant
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf OccupationInfoModel
     * @param {Object} modelData - An object type modelData
     * @returns {void}
     */
    var Model = function(modelData) {
        this.employmentDTOs = [{
          type: modelData ? modelData.type : "",
          status: modelData ? modelData.status : "",
          employerName: modelData ? modelData.employerName : "",
          startDate: modelData ? modelData.startDate : "",
          endDate: modelData ? modelData.endDate : "",
          isPrimary: modelData ? modelData.isPrimary : false,
          profileStatus: modelData ? modelData.profileStatus : "",
          temp_isActive: !modelData,
          temp_isTypeDisable: !modelData,
          temp_selectedValues: {
            type: "",
            status: ""
          },
          temp_setProfileStatus: false
        }];
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      modelStateChanged = true,
      submissionId, applicantId, fetchOccupationStatusAndTypeDeferred,
      /**
       * Private method to fetch enumeration data for occupation type and its allowed status, this method will
       * only be called if applicant and profile ids are present, and will resolve a
       * passeddeferred object, which can be returned from calling function to the
       * parent.
       *
       * @function fetchOccupationType
       * @memberOf OccupationInfoModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      fetchOccupationStatusAndType = function(deferred) {
        var options = {
          url: "employmentTypeAndStatus",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      finTemplateDeferred,
      /**
       * Method to fetch financial template to capture applicant financial profile.
       * @param {Object} deferred - An object type deferred
       * @param {Object} empType - An empType for application
       * @returns {void}
       */
      fetchFinancialTemplate = function(deferred, empType) {
        var options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/financialParameter?employmentType={empType}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            submissionId: submissionId,
            applicantId: applicantId,
            empType: empType
          };
        baseService.fetch(options, params);
      },
      /**
       * Method to fetch financial template to capture applicant financial profile.
       * @param {Object} submissionId - submission Id for application
       * @param {Object} applicantId -  applicant Id for application
       * @param {Object} successHandler -  successHandler for application
       * @returns {void}
       */
      validateEmployment = function(submissionId, applicantId, successHandler) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/employments/validateEmployments",
            success: function(data) {
              successHandler(data);
            }
          };
        baseService.fetch(options, params);
      },
      fetchOccupationTypeDeferred,
      /**
       * Private method to fetch enumeration data for occupation type, this method will
       * only be called if applicant and profile ids are present, and will resolve a
       * passeddeferred object, which can be returned from calling function to the
       * parent.
       *
       * @function fetchOccupationType
       * @memberOf OccupationInfoModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      fetchOccupationType = function(deferred) {
        var options = {
          url: "enumerations/employmentType?applicantType=Individual",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchOccupationStatusDeferred,
      /**
       * Private method to fetch occupation statuses available for loan application,
       * this method will only be called if applicant and profile ids are present,
       * and will resolve a passeddeferred object, which can be returned from calling
       * function to the parent.
       *
       * @function fetchOccupationStatus
       * @memberOf OccupationInfoModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      fetchOccupationStatus = function(deferred) {
        var options = {
          url: "enumerations/employmentStatus",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchBankPolicyTemplateDeferred,
      /**
      /**
       * fetchBankPolicyTemplate - fetches Bank Policy
       *
       * @param  {type} deferred An object type deferred
       * @return {void}
       */

      fetchBankPolicyTemplate = function(deferred) {
        var options = {
          url: "bankPolicyTemplates",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },

      fetchExistingOccupationsDeferred,
      /**
       * Private method to fetch occupation statuses available for loan application,
       * this method will only be called if applicant and profile ids are present,
       * and will resolve a passeddeferred object, which can be returned from calling
       * function to the parent.
       *
       * @function fetchExistingOccupations
       * @memberOf OccupationInfoModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      fetchExistingOccupations = function(deferred) {
        modelStateChanged = false;
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
      },
      fetchCountryListDeferred,
      /**
       * Private method to fetch occupation statuses available for loan application,
       * this method will only be called if applicant and profile ids are present,
       * and will resolve a passeddeferred object, which can be returned from calling
       * function to the parent.
       *
       * @function fetchExistingOccupations
       * @memberOf OccupationInfoModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      fetchCountryList = function(deferred) {
        var options = {
          url: "enumerations/country",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      saveModelDeferred,
      /**
       * Private method to save passed occupation information model. Based
       * on the availability or non-availability of liability id attribute
       * on existing model this function will add or update the passed model.
       * This method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function saveModel
       * @memberOf OccupationInfoModel
       * @param {Object} model - model for an application
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      saveModel = function(model, deferred) {
        modelStateChanged = true;
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/employments/profiles",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.add(options, params);
      },
      deleteModelDeferred,
      /**
       * Private method to delete passed occupation information model.
       * This method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function deleteModel
       * @memberOf OccupationInfoModel
       * @param {Object} id - id for an application
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      deleteModel = function(id, deferred) {
        modelStateChanged = true;
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/employments/" + id,
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.remove(options, params);
      },
      errors = {
        InitializationException: function() {
          var message = "";
          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";
          return message;
        }(),
        InvalidApplicantId: function() {
          var message = "";
          message += "\nNo applicant id found, please make sure applicant id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";
          return message;
        }(),
        InvalidProfileId: function() {
          var message = "";
          message += "\nNo profile id found, please make sure profile id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";
          return message;
        }(),
        ObjectNotInitialized: function() {
          var message = "";
          message += "\nModel has not been initialized. Please initialize the model before setting/calling properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";
          return message;
        }()
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };
    return {
      /**
       * Method to initialize the described model, this function can take two params
       * and will throw exception in case no submission id is passed.
       *
       * @param {String} subId - submission id for current application
       * @param {String} applId - applicant id for current user
       * @function init
       * @returns {Object} modelInitialized ~ modelInitialized specific model
       * @memberOf OccupationInfoModel
       */
      init: function(subId, applId) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;
        if (!submissionId) {
          throw new Error(errors.InitializationException);
        }
        modelInitialized = true;
        return modelInitialized;
      },
      /**
       * Method to get new instance of Income Information model. This method is a static member
       * of IncomeInfoModel class, and on calling it will instantiate the defined [Model]{@link
       * IncomeInfoModel.Model} (private to
       * this class) and return a new instance of same.
       *
       * @function getNewModel
       * @param {object} modelData - javascript object with predefined attributed present with which
       * the model will be initialized
       * @memberOf OccupationInfoModel
       * @returns {Object} Model
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      /**
       * Public method to fetch enumeration data for occupation types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getOccupationTypes
       * @memberOf OccupationInfoModel
       * @returns {Object} deferredObject
       * @example
       * OccupationInfoModel.getOccupationTypes().then(function (data) {
       *
       * });
       */
      getOccupationTypes: function() {
        objectInitializedCheck();
        fetchOccupationTypeDeferred = $.Deferred();
        fetchOccupationType(fetchOccupationTypeDeferred);
        return fetchOccupationTypeDeferred;
      },
      /**
       * Public method to fetch enumeration data for occupation statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getOccupationStatus
       * @memberOf OccupationInfoModel
       * @returns {Object} deferredObject
       * @example
       * OccupationInfoModel.getOccupationStatus().then(function (data) {
       *
       * });
       */
      fetchOccupationStatusAndType: function() {
        objectInitializedCheck();
        fetchOccupationStatusAndTypeDeferred = $.Deferred();
        fetchOccupationStatusAndType(fetchOccupationStatusAndTypeDeferred);
        return fetchOccupationStatusAndTypeDeferred;
      },
      /**
       * Public method to fetch enumeration data for occupation statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getOccupationStatus
       * @memberOf OccupationInfoModel
       * @returns {Object} deferredObject
       * @example
       * OccupationInfoModel.getOccupationStatus().then(function (data) {
       *
       * });
       */
      getOccupationStatus: function() {
        objectInitializedCheck();
        fetchOccupationStatusDeferred = $.Deferred();
        fetchOccupationStatus(fetchOccupationStatusDeferred);
        return fetchOccupationStatusDeferred;
      },
      /**
       * Public method to fetch existing occupations for current applicant. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getExistingOccupations
       * @memberOf OccupationInfoModel
       * @returns {Object} deferredObject
       * @example
       * OccupationInfoModel.getOccupationStatus().then(function (data) {
       *
       * });
       */
      getExistingOccupations: function() {
        objectInitializedCheck();
        if (!applicantId) {
          throw new Error(errors.InvalidApplicantId);
        }
        if (modelStateChanged) {
          fetchExistingOccupationsDeferred = $.Deferred();
          $.when(fetchOccupationTypeDeferred, fetchOccupationStatusDeferred).done(function() {
            fetchExistingOccupations(fetchExistingOccupationsDeferred);
          });
        }
        return fetchExistingOccupationsDeferred;
      },
      /**
       * Public method to fetch enumeration for list of countries. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getCountryList
       * @memberOf OccupationInfoModel
       * @returns {Object} deferredObject
       * @example
       * OccupationInfoModel.getCountryList().then(function (data) {
       *
       * });
       */
      getCountryList: function() {
        objectInitializedCheck();
        fetchCountryListDeferred = $.Deferred();
        fetchCountryList(fetchCountryListDeferred);
        return fetchCountryListDeferred;
      },
      fetchBankPolicyTemplate: function() {
        objectInitializedCheck();
        fetchBankPolicyTemplateDeferred = $.Deferred();
        fetchBankPolicyTemplate(fetchBankPolicyTemplateDeferred);
        return fetchBankPolicyTemplateDeferred;
      },
      /**
       * Public method to save passed in occupation information model. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function saveModel
       * @memberOf OccupationInfoModel
       *  @param {Object} model - An object type model
       * @returns {Object} KoModel ~ KnockOut specific model
       * @example
       * IncomeInfoModel.saveModel().then(function (data) {
       *
       * });
       */
      saveModel: function(model) {
        objectInitializedCheck();
        saveModelDeferred = $.Deferred();
        saveModel(model, saveModelDeferred);
        return saveModelDeferred;
      },
      /**
       * Fetches financial Template for the provided employment type.
       * SubmissionId and applicantId will be initialized with the model.
       * Response from this call will be saved for using in capturing financial profile for the applicant.
       * @param {empType} empType - empType for application
       * @returns {Object} finTemplateDeferred
       */
      fetchFinancialTemplate: function(empType) {
        objectInitializedCheck();
        finTemplateDeferred = $.Deferred();
        fetchFinancialTemplate(finTemplateDeferred, empType);
        return finTemplateDeferred;
      },
      validateEmployment: function(submissionId, applicantId, successHandler) {
        validateEmployment(submissionId, applicantId, successHandler);
      },
      /**
       * Public method to delete passed in occupation information model. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function deleteModel
       * @memberOf OccupationInfoModel
       * @param {Object} liabilityId - liability Id for application
       * @returns {Object} deferredObject
       * @example
       * IncomeInfoModel.deleteModel().then(function (data) {
       *
       * });
       */
      deleteModel: function(liabilityId) {
        objectInitializedCheck();
        deleteModelDeferred = $.Deferred();
        deleteModel(liabilityId, deleteModelDeferred);
        return deleteModelDeferred;
      },
      setApplicantId: function(applId) {
        applicantId = applId;
      }

    };
  };
});
