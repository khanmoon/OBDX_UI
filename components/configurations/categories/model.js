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
      getCategoriesListDeferred,
      /**
       * Private method to fetch list of Categories. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getCategoriesList
       * @memberOf CategoryModel
       * @private
       */
      getCategoriesList = function(deferred) {
        var categories = {
          url: "configurations",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(categories);
      },
      getFilterCategoriesListDeferred,
      /**
       * Private method to fetch list of filtered Categories based on search text provided by user. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getFilterCategoriesList
       * @memberOf CategoryModel
       * @private
       */
      getFilterCategoriesList = function(categoryValue, deferred) {
        var categories = {
            url: "configurations?categoryId={categoryId}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "categoryId": categoryValue
          };
        baseService.fetch(categories, params);
      };
    return {
      /**
       * Public method to fetch list of Categories. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getCategoriesList
       * @memberOf CategoryModel
       * @returns deferredObject
       * @example
       *      CategoryModel.getCategoriesList().then(function (data) {
       *
       *      });
       */
      getCategoriesList: function() {
        getCategoriesListDeferred = $.Deferred();
        getCategoriesList(getCategoriesListDeferred);
        return getCategoriesListDeferred;
      },
      /**
       * Public method to fetch list of Categories based on filter text. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getFilterCategoriesList
       * @memberOf CategoryModel
       * @returns deferredObject
       * @example
       *      CategoryModel.getCategoriesList().then(function (data) {
       *
       *      });
       */
      getFilterCategoriesList: function(categoryValue) {

        getFilterCategoriesListDeferred = $.Deferred();
        getFilterCategoriesList(categoryValue, getFilterCategoriesListDeferred);
        return getFilterCategoriesListDeferred;
      }
    };
  };
  return new CategoryModel();
});