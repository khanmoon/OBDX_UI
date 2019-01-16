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

    /**
     * var Model - description
     *
     * @return {type}  description
     */
    var Model = function() {
        this.type = "";
        this.value = {
          amount: "",
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

      submissionId, applicantId, profileId, getAssetTypeListDeferred,
      /**
       * Private method to fetch list of Asset Types. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getAssetTypeList
       * @memberOf AssetsInfoModel
       * @private
       */

      /**
       * getAssetTypeList - description
       *
       * @param  {type} productType description
       * @param  {type} deferred    description
       * @return {type}             description
       */
      getAssetTypeList = function(productType, deferred) {
        var options = {
            url: "financialTemplate?partyType=Individual&parameterType=Assets&productSubClass={productType}",

            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            productType: productType
          };
        baseService.fetch(options, params);
      },
      getExistingAssetsDeferred,
      /**
       * Private method to fetch list of existing assets of an applicant. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getExistingAssets
       * @memberOf AssetsInfoModel
       * @private
       */

      /**
       * getExistingAssets - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      getExistingAssets = function(deferred) {
        var options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/assets",
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
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/employments/profileId",
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
       * Private method to delete an asset of the user. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function deleteModel
       * @memberOf AssetsInfoModel
       * @private
       */

      /**
       * deleteModel - description
       *
       * @param  {type} assetId  description
       * @param  {type} deferred description
       * @return {type}          description
       */
      deleteModel = function(assetId, deferred) {
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
      };
    return {
      /**
       * Method to initialize the described model, this function can take three params
       * and will throw exception in case no submission id is passed.
       *
       * @param {String} subId - submission id for current application
       * @param {String} applId - applicant id for current user
       * @param {String} profId - profile id for current user
       * @function init
       * @memberOf AssetsInfoModel
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
       * Public method to fetch list of Asset types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getAssetTypeList
       * @memberOf AssetsInfoModel
       * @returns deferredObject
       * @example
       *      AssetsInfoModel.getAssetTypeList().then(function (data) {
       *
       *      });
       */

      /**
       * getAssetTypeList - description
       *
       * @param  {type} productType description
       * @return {type}             description
       */
      getAssetTypeList: function(productType) {
        getAssetTypeListDeferred = $.Deferred();
        getAssetTypeList(productType, getAssetTypeListDeferred);
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
       * @returns deferredObject
       * @example
       *      AssetsInfoModel.getExistingAssets().then(function (data) {
       *
       *      });
       */

      /**
       * getExistingAssets - description
       *
       * @return {type}  description
       */
      getExistingAssets: function() {
        getExistingAssetsDeferred = $.Deferred();
        getExistingAssets(getExistingAssetsDeferred);
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
       * @returns deferredObject
       * @example
       *      AssetsInfoModel.saveModel().then(function (data) {
       *
       *      });
       */

      /**
       * saveModel - description
       *
       * @param  {type} assetModel description
       * @return {type}            description
       */
      saveModel: function(assetModel) {
        saveModelDeferred = $.Deferred();
        saveModel(assetModel, saveModelDeferred);
        return saveModelDeferred;
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
       * Public method to delete asset information of an applicant. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function deleteModel
       * @memberOf AssetsInfoModel
       * @returns deferredObject
       * @example
       *      AssetsInfoModel.deleteModel().then(function (data) {
       *
       *      });
       */

      /**
       * deleteModel - description
       *
       * @param  {type} assetId description
       * @return {type}         description
       */
      deleteModel: function(assetId) {
        deleteModelDeferred = $.Deferred();
        deleteModel(assetId, deleteModelDeferred);
        return deleteModelDeferred;
      }
    };
  };
});
