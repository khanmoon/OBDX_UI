define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /* Extending predefined baseService to get ajax functions. */
  var baseService = BaseService.getInstance();
  /**
   * Main file for Asset Information Model. This file contains the model definition
   * for asset information section and exports the AssetsInfoModel which can be injected
   * in any framework and developer will, by default get a self aware model for Asset
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
  var MenuModel = function() {
    var getMenuDeferred, getMenu = function(deferred) {
      var options = {
        url: "menu",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetchJSON(options);
    };
    return {
      getMenu: function() {
        getMenuDeferred = $.Deferred();
        getMenu(getMenuDeferred);
        return getMenuDeferred;
      }
    };
  };
  return new MenuModel();
});
