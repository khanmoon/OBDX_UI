define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Liabilities Information section. This file contains the model definition
   * for liabilities information section and exports the LiabilitiesInfoModel which can be injected
   * in any framework and developer will by default get a self aware model for Liability Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Model for Liability Section using [getNewModel()]{@link LiabilitiesInfoModel.getNewModel}</li>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[init()]{@link LiabilitiesInfoModel.init}</li>
   *              <li>[getNewModel()]{@link LiabilitiesInfoModel.getNewModel}</li>
   *              <li>[fetchLiabilities()]{@link LiabilitiesInfoModel.fetchLiabilityList}</li>
   *              <li>[submitLiabilitiesData()]{@link LiabilitiesInfoModel.synchronizeRequests}</li>
   *              <li>[fetchLiabilities()]{@link LiabilitiesInfoModel.fetchLiabilityList}</li>
   *              <li>[submitLiabilitiesData()]{@link LiabilitiesInfoModel.synchronizeRequests}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace LiabilitiesInfo~LiabilitiesInfoModel
   * @class LiabilitiesInfoModel
   * @property {String} type - type of liability
   * @property {Object} original - Object containing details about the liability's Original amount
   * @property {Float} original.amount - Decimal value representing the liability's Original amount
   * @property {String} original.currency - String value representing the currency code of the liability's Original amount
   * @property {Object} outstanding - Object containing details about the liability's Outstanding amount
   * @property {Float} outstanding.amount - Decimal value representing the liability's Outstanding amount
   * @property {String} outstanding.currency - String value representing the currency code of the liability's Outstanding amount
   * @property {Integer} ownershipPercentage - ownership percentage
   */
  return function LiabilitiesInfoModel() {
    /**
     * In case more than one instance of model is required, eg for main and co-applicant
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @memberOf LiabilitiesInfoModel
     * @private
     */

    /**
     * var Model - description
     *
     * @param  {type} modelData description
     * @return {type}           description
     */
    var Model = function(modelData) {
        this.type = modelData ? modelData.type : "";
        this.id = modelData ? modelData.id : null;
        this.repaymentFrequency = modelData ? modelData.repaymentFrequency : "";
        this.original = {
          amount: modelData ? modelData.original.amount : "",
          currency: modelData ? modelData.outstanding.currency : ""
        };
        this.outstanding = {
          amount: modelData ? modelData.outstanding.amount : "",
          currency: modelData ? modelData.outstanding.currency : ""
        };
        this.ownershipPercentage = 100;
        this.temp_isActive = !modelData;
        this.temp_selectedValues = {
          type: ""
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      modelStateChanged = true,
      submissionId, applicantId, profileId, fetchExistingLiabilitiesDeferred,
      /**
       * Private method to fetch existing liabilities for the user, this method will
       * only be called if applicant and profile ids are present, and will resolve a
       * passeddeferred object, which can be returned from calling function to the
       * parent.
       *
       * @function fetchExistingLiabilities
       * @memberOf LiabilitiesInfoModel
       * @private
       */

      /**
       * fetchExistingLiabilities - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      fetchExistingLiabilities = function(deferred) {
        modelStateChanged = false;
        var options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/liabilities",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function() {
              deferred.reject();
            }
          },
          params = {
            submissionId: submissionId,
            applicantId: applicantId,
            profileId: profileId
          };
        baseService.fetch(options, params);
      },
      fetchLiabilitiesListDeferred,
      /**
       * Private method to fetch supported type of liabilities in loan application. This
       * method will resolve a passed deferred object, which can be returned from calling
       * function to the parent.
       *
       * @function fetchLiabilitiesList
       * @memberOf LiabilitiesInfoModel
       * @private
       */

      /**
       * fetchLiabilitiesList - description
       *
       * @param  {type} productType description
       * @param  {type} deferred    description
       * @return {type}             description
       */
      fetchLiabilitiesList = function(productType, deferred) {
        var params = {
            productType: productType
          },
          options = {
            url: "financialLiabilityTypes",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      saveModelDeferred,
      /**
       * Private method to save passed liabilities information model. Based
       * on the availability or non-availability of liability id attribute
       * on existing model this function will add or update the passed model.
       * This method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function saveModel
       * @memberOf LiabilitiesInfoModel
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
        modelStateChanged = true;
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/liabilities",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            }
          },
          modelData = JSON.parse(model);
        if (modelData.liabilityDetails.id && modelData.liabilityDetails.id.length > 0) {
          options.url = "submissions/{submissionId}/applicants/{applicantId}/financialProfile/liabilities/" + modelData.liabilityDetails.id;
          baseService.update(options, params);
        } else {
          baseService.add(options, params);
        }
      },
      deleteModelDeferred,
      /**
       * Private method to delete passed liabilities information model.
       * This method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function deleteModel
       * @memberOf LiabilitiesInfoModel
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
        modelStateChanged = true;
        var params = {
            submissionId: submissionId,
            applicantId: applicantId,
            profileId: profileId,
            liabilityId: id
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/liabilities/{liabilityId}?profileId={profileId}",
            data: "",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.remove(options, params);
      },
      fetchEmploymentsDeferred,

      /**
       * fetchEmployments - description
       *
       * @param  {type} submissionId description
       * @param  {type} applicantId  description
       * @param  {type} deferred     description
       * @return {type}              description
       */
      fetchEmployments = function(submissionId, applicantId, deferred) {
        var params = {
          submissionId: submissionId,
          applicantId: applicantId
        };
        var options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/employments",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      saveEmploymentsDeferred,
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
       * saveEmployments - description
       *
       * @param  {type} submissionId description
       * @param  {type} applicantId  description
       * @param  {type} model        description
       * @param  {type} deferred     description
       * @return {type}              description
       */
      saveEmployments = function(submissionId, applicantId, model, deferred) {
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
      fetchFrequencyDeferred,
      /**
       * Private method to fetch income frequency options supported in loan application. This
       * method will resolve a passed deferred object, which can be returned from calling
       * function to the parent.
       *
       * @function fetchFrequencyOptions
       * @memberOf IncomeInfoModel
       * @private
       */

      /**
       * fetchFrequencyOptions - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      fetchFrequencyOptions = function(deferred) {
        var options = {
          url: "enumerations/originationFinancialFrequency?for=liability",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      errors = {

        /**
         * InitializationException - description
         *
         * @return {type}  description
         */
        InitializationException: function() {
          var message = "";
          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }(),

        /**
         * InvalidApplicantId - description
         *
         * @return {type}  description
         */
        InvalidApplicantId: function() {
          var message = "";
          message += "\nNo applicant id found, please make sure applicant id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }(),

        /**
         * InvalidProfileId - description
         *
         * @return {type}  description
         */
        InvalidProfileId: function() {
          var message = "";
          message += "\nNo profile id found, please make sure profile id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";
          return message;
        }(),

        /**
         * ObjectNotInitialized - description
         *
         * @return {type}  description
         */
        ObjectNotInitialized: function() {
          var message = "";
          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }()
      },

      /**
       * objectInitializedCheck - description
       *
       * @return {type}  description
       */
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
       * @memberOf LiabilitiesInfoModel
       */

      /**
       * init - description
       *
       * @param  {type} subId  description
       * @param  {type} applId description
       * @param  {type} profId description
       * @return {type}        description
       */
      init: function(subId, applId, profId) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;
        profileId = profId || undefined;
        modelInitialized = true;
        return modelInitialized;
      },
      /**
       * Method to get new instance of Identity Information model. This method is a static member
       * of IdentityInfoModel class, and on calling it will instantiate the defined [Model]{@link
       * IdentityInfoModel.Model} (private to this class) and return a new instance of same.
       *
       * @function getNewModel
       * @param {object} modelData - javascript object with predefined attributed present with which
       * the model will be initialized
       * @memberOf LiabilitiesInfoModel
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
       * Public method to fetch existing liabilities against current profile id for current applicant.
       * This method will instantiate a new deferred object and will return the same to the callee
       * function which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getExistingLiabilities
       * @memberOf LiabilitiesInfoModel
       * @returns deferredObject
       * @example
       * LiabilitiesInfoModel.getExistingLiabilities().then(function (data) {
       *
       * });
       */

      /**
       * getExistingLiabilities - description
       *
       * @return {type}  description
       */
      getExistingLiabilities: function() {
        objectInitializedCheck();
        if (!applicantId) {
          throw new Error(errors.InvalidApplicantId);
        }
        if (modelStateChanged) {
          fetchExistingLiabilitiesDeferred = $.Deferred();
          $.when(fetchLiabilitiesListDeferred).done(function() {
            fetchExistingLiabilities(fetchExistingLiabilitiesDeferred);
          });
        }
        return fetchExistingLiabilitiesDeferred;
      },
      /**
       * Public method to fetch supported liabilities for loan application. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getIdentificationTypeList
       * @memberOf LiabilitiesInfoModel
       * @returns deferredObject
       * @example
       * LiabilitiesInfoModel.getIdentificationTypeList().then(function (data) {
       *
       * });
       */

      /**
       * getLiabilitiesList - description
       *
       * @param  {type} productType description
       * @return {type}             description
       */
      getLiabilitiesList: function(productType) {
        objectInitializedCheck();
        fetchLiabilitiesListDeferred = $.Deferred();
        fetchLiabilitiesList(productType, fetchLiabilitiesListDeferred);
        return fetchLiabilitiesListDeferred;
      },
      /**
       * Public method to save passed in liabilities information model. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function saveModel
       * @memberOf LiabilitiesInfoModel
       * @returns deferredObject
       * @example
       * LiabilitiesInfoModel.saveModel().then(function (data) {
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
        objectInitializedCheck();
        saveModelDeferred = $.Deferred();
        saveModel(model, saveModelDeferred);
        return saveModelDeferred;
      },
      /**
       * Public method to delete passed in liabilities information model. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function saveModel
       * @memberOf LiabilitiesInfoModel
       * @returns deferredObject
       * @example
       * LiabilitiesInfoModel.saveModel().then(function (data) {
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
        objectInitializedCheck();
        deleteModelDeferred = $.Deferred();
        deleteModel(liabilityId, deleteModelDeferred);
        return deleteModelDeferred;
      },

      /**
       * getRepaymentFrequency - description
       *
       * @return {type}  description
       */
      getRepaymentFrequency: function() {
        fetchFrequencyDeferred = $.Deferred();
        fetchFrequencyOptions(fetchFrequencyDeferred);
        return fetchFrequencyDeferred;
      },

      /**
       * saveEmployments - description
       *
       * @param  {type} submissionId description
       * @param  {type} applicantId  description
       * @param  {type} model        description
       * @return {type}              description
       */
      saveEmployments: function(submissionId, applicantId, model) {
        saveEmploymentsDeferred = $.Deferred();
        saveEmployments(submissionId, applicantId, model, saveEmploymentsDeferred);
        return saveEmploymentsDeferred;
      },

      /**
       * fetchEmployments - description
       *
       * @param  {type} submissionId description
       * @param  {type} applicantId  description
       * @return {type}              description
       */
      fetchEmployments: function(submissionId, applicantId) {
        fetchEmploymentsDeferred = $.Deferred();
        fetchEmployments(submissionId, applicantId, fetchEmploymentsDeferred);
        return fetchEmploymentsDeferred;
      }
    };
  };
});
