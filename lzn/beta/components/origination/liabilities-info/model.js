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
     * @param {Object} modelData - An object type modelData
     * @returns {void}
     * @private
     */
    var Model = function(modelData) {
        this.type = modelData ? modelData.type : "";
        this.original = {
          amount: modelData ? modelData.original.amount : 0,
          currency: modelData ? modelData.outstanding.currency : ""
        };
        this.outstanding = {
          amount: modelData ? modelData.outstanding.amount : 0,
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
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      fetchExistingLiabilities = function(deferred) {
        modelStateChanged = false;
        var options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/liabilities?profileId={profileId}",
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
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      fetchLiabilitiesList = function(deferred) {
        var options = {
          url: "financialTemplate?partyType=Individual&parameterType=Liability",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
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
       * @param {String} model - model for current user
       * @param {Object} deferred - An object type Deferred
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
       * @param {String} id - id for current user
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @memberOf LiabilitiesInfoModel
       * @private
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
      errors = {
        InitializationException: function() {
          var message = "";
          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }(),
        InvalidApplicantId: function() {
          var message = "";
          message += "\nNo applicant id found, please make sure applicant id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
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
          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
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
       * @param {String} profId - prof id for current user
       * @returns {Object} modelInitialized
       * @function init
       * @memberOf LiabilitiesInfoModel
       */
      init: function(subId, applId, profId) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;
        profileId = profId || undefined;
        if (!submissionId) {
          throw new Error(errors.InitializationException);
        }
        if (!applicantId) {
          throw new Error(errors.InvalidApplicantId);
        }
        if (!profileId) {
          throw new Error(errors.InvalidProfileId);
        }
        modelInitialized = true;
        if (applicantId) {
          this.getExistingLiabilities();
        }
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
       * @returns {Object} Model
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
       * @returns {Object} deferredObject
       * @example
       * LiabilitiesInfoModel.getExistingLiabilities().then(function (data) {
       *
       * });
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
       * @returns {Object} deferredObject
       * @example
       * LiabilitiesInfoModel.getIdentificationTypeList().then(function (data) {
       *
       * });
       */
      getLiabilitiesList: function() {
        objectInitializedCheck();
        fetchLiabilitiesListDeferred = $.Deferred();
        fetchLiabilitiesList(fetchLiabilitiesListDeferred);
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
       * @param {String} model - model data for applicatons
       * @returns {Object} deferredObject
       * @example
       * LiabilitiesInfoModel.saveModel().then(function (data) {
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
       * Public method to delete passed in liabilities information model. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function saveModel
       * @memberOf LiabilitiesInfoModel
       * @param {String} liabilityId - liability Id for applicatons
       * @returns {Object} deferredObject
       * @example
       * LiabilitiesInfoModel.saveModel().then(function (data) {
       *
       * });
       */
      deleteModel: function(liabilityId) {
        objectInitializedCheck();
        deleteModelDeferred = $.Deferred();
        deleteModel(liabilityId, deleteModelDeferred);
        return deleteModelDeferred;
      }
    };
  };
});