define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Category Model. This file contains the model definition
   * for list of category/preferences fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of categories:
   *          <ul>
   *              <li>[init()]{@link CategoryModel.init}</li>
   *              <li>[getCategoriesList()]{@link CategoryModel.getCategoriesList}</li>
   *              <li>[getFilterCategoriesList()]{@link CategoryModel.getFilterCategoriesList}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~CategoryModel
   * @class CategoryModel
   */
  var CategoryModel = function() {
    var baseService = BaseService.getInstance(),
      getMenuListDeferred,
      getMenuList = function(deferred) {
        var options = {
          url: "menuList",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetchJSON(options);
      };
    return {
      /**
       * Public method to fetch list of Categories. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getMenuList
       * @memberOf CategoryModel
       * @returns {Object} deferredObject
       * @example
       * CategoryModel.getCategoriesList().then(function (data) {
       *
       *      });
       */
      getMenuList: function() {
        getMenuListDeferred = $.Deferred();
        getMenuList(getMenuListDeferred);
        return getMenuListDeferred;
      }
    };
  };
  return new CategoryModel();
});