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
     */

    /**
     * var Model - description
     *
     * @param  {type} modelData description
     * @return {type}           description
     */
    var Model = function(modelData) {
        this.employmentDTOs = [{
          type: modelData ? modelData.type : "",
          status: modelData ? modelData.status : "",
          employerName: modelData ? modelData.employerName : "",
          reference: {
            name: "",
            designation: ""
          },
          startDate: modelData ? modelData.startDate : "",
          endDate: modelData ? modelData.endDate : "",
          isPrimary: modelData ? modelData.isPrimary : false,
          profileStatus: modelData ? modelData.profileStatus : "",
          temp_isActive: !modelData,
          temp_isStatusEligible: !modelData,
          temp_selectedValues: {
            type: "",
            status: ""
          },
          temp_setProfileStatus: false
        }];
      },
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      submissionId, applicantId, fetchOccupationStatusAndTypeDeferred,
      /**
       * Private method to fetch enumeration data for occupation type and its allowed status, this method will
       * only be called if applicant and profile ids are present, and will resolve a
       * passeddeferred object, which can be returned from calling function to the
       * parent.
       *
       * @function fetchOccupationType
       * @memberOf OccupationInfoModel
       * @private
       */

      /**
       * fetchOccupationStatusAndType - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      fetchOccupationStatusAndType = function(deferred) {
        var options = {
          url: "enumerations/employmentType",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      finTemplateDeferred,
      /**
       * Method to fetch financial template to capture applicant financial profile.
       */

      /**
       * fetchFinancialTemplate - description
       *
       * @param  {type} deferred description
       * @param  {type} empType  description
       * @return {type}          description
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
       * validateEmployment - description
       *
       * @param  {type} submissionId   description
       * @param  {type} applicantId    description
       * @param  {type} successHandler description
       * @return {type}                description
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
       * @private
       */

      /**
       * fetchOccupationType - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      fetchOccupationType = function(deferred) {
        var options = {
          url: "enumerations/employmentType?partyType=Individual",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      /**
       * Private method to fetch enumeration data for occupation type, this method will
       * only be called if applicant and profile ids are present, and will resolve a
       * passeddeferred object, which can be returned from calling function to the
       * parent.
       *
       * @function fetchOccupationType
       * @memberOf OccupationInfoModel
       * @private
       */
      fetchEmployerNameDeferred,

      /**
       * fetchEmployerName - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      fetchEmployerName = function(deferred) {
        var options = {
          url: "enumerations/employers",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      checkEmploymentStartDateDeferred,

      /**
       * checkEmploymentStartDate - description
       *
       * @param  {type} submissionId description
       * @param  {type} applicantId  description
       * @param  {type} empStartDate description
       * @param  {type} deferred     description
       * @return {type}              description
       */
      checkEmploymentStartDate = function(submissionId, applicantId, empStartDate, deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId,
            empStartDate: empStartDate
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/employments/validateEmploymentDate/{empStartDate}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
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
       * @private
       */

      /**
       * fetchOccupationStatus - description
       *
       * @param  {type} deferred description
       * @return {type}          description
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
      fetchExistingOccupationsDeferred,
      /**
       * Private method to fetch occupation statuses available for loan application,
       * this method will only be called if applicant and profile ids are present,
       * and will resolve a passeddeferred object, which can be returned from calling
       * function to the parent.
       *
       * @function fetchExistingOccupations
       * @memberOf OccupationInfoModel
       * @private
       */

      /**
       * fetchExistingOccupations - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      fetchExistingOccupations = function(deferred) {
        var options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/employments",
            throttle: false,
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
       * @private
       */

      /**
       * fetchCountryList - description
       *
       * @param  {type} deferred description
       * @return {type}          description
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
       * @private
       */

      /**
       * saveModel - description
       *
       * @param  {type} model    description
       * @param  {type} deferred description
       * @return {type}          description
       */
      saveModel = function(model, deferred) {
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
       * @private
       */

      /**
       * deleteModel - description
       *
       * @param  {type} id       description
       * @param  {type} deferred description
       * @return {type}          description
       */
      deleteModel = function(id, deferred) {
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
      };
    return {
      /**
       * Method to initialize the described model, this function can take two params
       * and will throw exception in case no submission id is passed.
       *
       * @param {String} subId - submission id for current application
       * @param {String} applId - applicant id for current user
       * @param {String} profId - employment profile id for loan application
       * @function init
       * @memberOf OccupationInfoModel
       */

      /**
       * init - description
       *
       * @param  {type} subId  description
       * @param  {type} applId description
       * @return {type}        description
       */
      init: function(subId, applId) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;

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
       * @returns Model
       */

      /**
       * getNewModel - description
       *
       * @param  {type} modelData description
       * @return {type}           description
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
       * @returns deferredObject
       * @example
       * OccupationInfoModel.getOccupationTypes().then(function (data) {
       *
       * });
       */

      /**
       * getOccupationTypes - description
       *
       * @return {type}  description
       */
      getOccupationTypes: function() {
        fetchOccupationTypeDeferred = $.Deferred();
        fetchOccupationType(fetchOccupationTypeDeferred);
        return fetchOccupationTypeDeferred;
      },

      /**
       * getEmployerName - description
       *
       * @return {type}  description
       */
      getEmployerName: function() {
        fetchEmployerNameDeferred = $.Deferred();
        fetchEmployerName(fetchEmployerNameDeferred);
        return fetchEmployerNameDeferred;
      },

      /**
       * checkEmploymentStartDate - description
       *
       * @param  {type} submissionId description
       * @param  {type} applicantId  description
       * @param  {type} empStartDate description
       * @return {type}              description
       */
      checkEmploymentStartDate: function(submissionId, applicantId, empStartDate) {
        checkEmploymentStartDateDeferred = $.Deferred();
        checkEmploymentStartDate(submissionId, applicantId, empStartDate, checkEmploymentStartDateDeferred);
        return checkEmploymentStartDateDeferred;
      },
      /**
       * Public method to fetch enumeration data for occupation statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getOccupationStatus
       * @memberOf OccupationInfoModel
       * @returns deferredObject
       * @example
       * OccupationInfoModel.getOccupationStatus().then(function (data) {
       *
       * });
       */

      /**
       * fetchOccupationStatusAndType - description
       *
       * @return {type}  description
       */
      fetchOccupationStatusAndType: function() {
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
       * @returns deferredObject
       * @example
       * OccupationInfoModel.getOccupationStatus().then(function (data) {
       *
       * });
       */

      /**
       * getOccupationStatus - description
       *
       * @return {type}  description
       */
      getOccupationStatus: function() {
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
       * @returns deferredObject
       * @example
       * OccupationInfoModel.getOccupationStatus().then(function (data) {
       *
       * });
       */

      /**
       * getExistingOccupations - description
       *
       * @return {type}  description
       */
      getExistingOccupations: function() {
        fetchExistingOccupationsDeferred = $.Deferred();
        fetchExistingOccupations(fetchExistingOccupationsDeferred);
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
       * @returns deferredObject
       * @example
       * OccupationInfoModel.getCountryList().then(function (data) {
       *
       * });
       */

      /**
       * getCountryList - description
       *
       * @return {type}  description
       */
      getCountryList: function() {
        fetchCountryListDeferred = $.Deferred();
        fetchCountryList(fetchCountryListDeferred);
        return fetchCountryListDeferred;
      },
      /**
       * Public method to save passed in occupation information model. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function saveModel
       * @memberOf OccupationInfoModel
       * @returns deferredObject
       * @example
       * IncomeInfoModel.saveModel().then(function (data) {
       *
       * });
       */

      /**
       * saveModel - description
       *
       * @param  {type} model description
       * @return {type}       description
       */
      saveModel: function(model) {
        saveModelDeferred = $.Deferred();
        saveModel(model, saveModelDeferred);
        return saveModelDeferred;
      },
      /**
       * Fetches financial Template for the provided employment type.
       * SubmissionId and applicantId will be initialized with the model.
       * Response from this call will be saved for using in capturing financial profile for the applicant.
       */

      /**
       * fetchFinancialTemplate - description
       *
       * @param  {type} empType description
       * @return {type}         description
       */
      fetchFinancialTemplate: function(empType) {
        finTemplateDeferred = $.Deferred();
        fetchFinancialTemplate(finTemplateDeferred, empType);
        return finTemplateDeferred;
      },

      /**
       * validateEmployment - description
       *
       * @param  {type} submissionId   description
       * @param  {type} applicantId    description
       * @param  {type} successHandler description
       * @return {type}                description
       */
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
       * @returns deferredObject
       * @example
       * IncomeInfoModel.deleteModel().then(function (data) {
       *
       * });
       */

      /**
       * deleteModel - description
       *
       * @param  {type} liabilityId description
       * @return {type}             description
       */
      deleteModel: function(liabilityId) {
        deleteModelDeferred = $.Deferred();
        deleteModel(liabilityId, deleteModelDeferred);
        return deleteModelDeferred;
      }
    };
  };
});
