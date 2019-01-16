define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for BaseConfiguration Model. This file contains the model definition
   * for list of properties fetched from the server from table digx_fw_config_all_b through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of properties:
   *          <ul>
   *              <li>[init()]{@link FeedbackModel.init}</li>
   *
   *              <li>[getProperty()]{@link FeedbackModel.getFeedbackQuestion}</li>
   *
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~FeedbackModel
   * @class FeedbackModel
   */
  var FeedbackModel = function() {
    var baseService = BaseService.getInstance(),
      addTemplateDeferred,
      /**
       * Private method to fetch the User for Feedback like corporate, retail . This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function addTemplate
       * @memberOf FeedbackModel
       * @param {Object} deferred - An object type Deferred
       * @param {Object} payload - An object of payload
       * @param {String} templateId - A templateId for template to update
       * @returns {void}
       */
      addTemplate = function(deferred, payload,templateId) {
        var options = {
          url: "feedback/template",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        if(templateId){
          baseService.update(options);
        }else{
          baseService.add(options);
        }
      };
    return {
      addTemplate: function(payload,templateId) {
        addTemplateDeferred = $.Deferred();
        addTemplate(addTemplateDeferred, payload,templateId);
        return addTemplateDeferred;
      }
    };
  };
  return new FeedbackModel();
});
