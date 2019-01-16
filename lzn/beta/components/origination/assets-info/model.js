define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Asset Information Model. This file contains the model definition
   * for asset information section and exports the AssetsInfoModel which can be injected
   * in any framework and developer will by default get a self aware model for Asset
   * Information Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Model for Assets Section using [getNewModel()]{@link AssetsInfoModel.getNewModel}</li>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[init()]{@link AssetsInfoModel.init}</li>
   *              <li>[getNewModel()]{@link AssetsInfoModel.getNewModel}</li>
   *              <li>[getAssetTypeList()]{@link AssetsInfoModel.getAssetTypeList}</li>
   *              <li>[getExistingAssets()]{@link AssetsInfoModel.getExistingAssets}</li>
   *              <li>[saveModel()]{@link AssetsInfoModel.saveModel}</li>
   *              <li>[deleteModel()]{@link AssetsInfoModel.deleteModel}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace AssetsInfo~AssetsInfoModel
   * @class AssetsInfoModel
   * @property {String} id - asset id
   * @property {String} type - type of selected asset
   * @property {Object} value - object to store value of asset
   * @property {Integer} value.amount - asset's worth
   * @property {String} value.currency - currency code used
   * @property {Integer} ownershipPercentage - ownership percentage
   */
  return function AssetsInfoModel() {
    /**
     * In case more than one instance of model is required, eg for main and co-applicant
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf AssetsInfoModel
     */
    var Model = function() {
        this.type = "";
        this.value = {
          amount: 0,
          currency: ""
        };
        this.ownershipPercentage = 100;
        this.temp_isActive = true;
        this.temp_selectedValues = {
          type: ""
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      modelStateChanged = true,
      submissionId, applicantId, profileId, getAssetTypeListDeferred,
      /**
       * Private method to fetch list of Asset Types. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getAssetTypeList
       * @memberOf AssetsInfoModel
       * @param {Object} deferred - deferred object
       * @returns {void}
       * @private
       */
      getAssetTypeList = function(deferred) {
        var options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/financialParameter?financialParameter=income&employmentType={employmentType}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getExistingAssetsDeferred,
      /**
       * Private method to fetch list of existing assets of an applicant. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getExistingAssets
       * @memberOf AssetsInfoModel
       * @param {Object} deferred - deferred object
       * @returns {void}
       * @private
       */
      getExistingAssets = function(deferred) {
        modelStateChanged = false;
        var options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/assets?profileId={profileId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            submissionId: submissionId,
            applicantId: applicantId,
            profileId: profileId
          };
        baseService.fetch(options, params);
      },
      saveModelDeferred,
      /**
       * Private method to save or update information of a users Asset. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function saveModel
       * @memberOf AssetsInfoModel
       * @param {Object} model - model object
       * @param {Object} deferred - deferred object
       * @returns {void}
       * @private
       */
      saveModel = function(model, deferred) {
        modelStateChanged = true;
        var options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/assets",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          modelData = JSON.parse(model);
        if (modelData.assetDetails.id) {
          options.url += "/" + modelData.assetDetails.id;
          baseService.update(options, params);
        } else {
          baseService.add(options, params);
        }
      },
      deleteModelDeferred,
      /**
       * Private method to delete an asset of the user. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function deleteModel
       * @param {Object} assetId - asset Id
       * @param {Object} deferred - An object type Deferred
       * @memberOf AssetsInfoModel
       * @returns {void}
       * @private
       */
      deleteModel = function(assetId, deferred) {
        modelStateChanged = true;
        var options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/assets/{assetId}?profileId={profileId}",
            data: "",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            submissionId: submissionId,
            applicantId: applicantId,
            profileId: profileId,
            assetId: assetId
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
       * Method to initialize the described model, this function can take three params
       * and will throw exception in case no submission id is passed.
       *
       * @function init
       * @param {String} subId - submission id for current application
       * @param {String} applId - applicant id for current user
       * @param {String} profId - profile id for current user
       * @returns {Object} modelInitialized - initialized model
       * @memberOf AssetsInfoModel
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
        this.getExistingAssets();
        return modelInitialized;
      },
      /**
       * Method to get new instance of Asset Information model. This method is a static member
       * of AssetsInfoModel class, and on calling it will instantiate the defined [Model]{@link
       * AssetsInfoModel.Model} (private to this class) and return a new instance of same.
       *
       * @function getNewModel
       * @param {object} modelData - javascript object with predefined attributed present with which
       * the model will be initialized
       * @memberOf AssetsInfoModel
       * @returns {Object} Model
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      /**
       * Public method to fetch list of Asset types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getAssetTypeList
       * @memberOf AssetsInfoModel
       * @returns {Object} deferredObject
       * @example
       *      AssetsInfoModel.getAssetTypeList().then(function (data) {
       *
       *      });
       */
      getAssetTypeList: function() {
        objectInitializedCheck();
        getAssetTypeListDeferred = $.Deferred();
        getAssetTypeList(getAssetTypeListDeferred);
        return getAssetTypeListDeferred;
      },
      /**
       * Public method to fetch list of existing assets of an applicant. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getExistingAssets
       * @memberOf AssetsInfoModel
       * @returns {Object} deferredObject
       * @example
       *      AssetsInfoModel.getExistingAssets().then(function (data) {
       *
       *      });
       */
      getExistingAssets: function() {
        objectInitializedCheck();
        if (modelStateChanged) {
          getExistingAssetsDeferred = $.Deferred();
          $.when(getAssetTypeList).done(function() {
            getExistingAssets(getExistingAssetsDeferred);
          });
        }
        return getExistingAssetsDeferred;
      },
      /**
       * Public method to save/update asset information of an applicant. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function saveModel
       * @memberOf AssetsInfoModel
       * @param {object} assetModel - user's asset information to pass to the service
       * @returns {Object} deferredObject
       * @example
       *      AssetsInfoModel.saveModel().then(function (data) {
       *
       *      });
       */
      saveModel: function(assetModel) {
        objectInitializedCheck();
        saveModelDeferred = $.Deferred();
        saveModel(assetModel, saveModelDeferred);
        return saveModelDeferred;
      },
      /**
       * Public method to delete asset information of an applicant. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function deleteModel
       * @memberOf AssetsInfoModel
       * @param {object} assetId - asset id
       * @returns {Object} deferredObject
       * @example
       *      AssetsInfoModel.deleteModel().then(function (data) {
       *
       *      });
       */
      deleteModel: function(assetId) {
        objectInitializedCheck();
        deleteModelDeferred = $.Deferred();
        deleteModel(assetId, deleteModelDeferred);
        return deleteModelDeferred;
      }
    };
  };
});