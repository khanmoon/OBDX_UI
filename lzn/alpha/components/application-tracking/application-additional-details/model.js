define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Additional Information Model. This file contains the model definition
   * for additional information section and exports the AdditionalInfoModel which can be injected
   * in any framework and developer will, by default get a self aware model for Additional
   * Information Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[fetchComponents()]{@link AdditionalInfoModel.fetchComponents}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace AdditionalInfo~AdditionalInfoModel
   * @class AdditionalInfoModel
   */
  var AdditionalInfoModel = function() {
    var baseService = BaseService.getInstance(),

      componentsListDeferred,

      /**
       * Private method to fetch list of Components. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function fetchComponents
       * @memberOf AdditionalInfoModel
       * @private
       */
      fetchComponents = function(deferred) {
        var options = {
          url: "app-tracker/additionalinput",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetchJSON(options);
      };
    return {
      /**
       * Public method to fetch list of Components. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .done(handler) to handle the data.
       *
       * @function fetchComponents
       * @memberOf AdditionalInfoModel
       * @returns deferredObject
       * @example
       *      AdditionalInfoModel.fetchComponents().done(function (data) {
       *
       *      });
       */
      fetchComponents: function() {
        componentsListDeferred = $.Deferred();
        fetchComponents(componentsListDeferred);
        return componentsListDeferred;
      }
    };
  };
  return new AdditionalInfoModel();
});