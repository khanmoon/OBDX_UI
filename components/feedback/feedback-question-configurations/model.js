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

      getFeedbackQuestionDeferred,
      /**
       * Private method to fetch the Feedback Question. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getFeedbackQuestion
       * @memberOf FeedbackModel
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      getFeedbackQuestion = function(deferred) {
        var options = {
          url: "feedback/questions",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getFeedbackOptionListDeferred,
      getFeedbackOptionList = function(deferred) {
        var options = {
          url: "feedback/options",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      addQuestionDeferred,
      /**
       * addQuestion - adding a new question
       *
       * @param  {String} data     An string containg the data to be sent to host
       * @param  {object} deferred An Object containg the data to be sent to host
       * @returns {object} question      returns question array
       */
      addQuestion = function(data, deferred) {
        var option = {
          url: "feedback/questions",
          data: data,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.add(option);
      };
    return {
      /**
       * getFeedbackQuestion - get feedback questions
       *
       * @returns {object}  returns questions
       */
      getFeedbackQuestion: function() {
        getFeedbackQuestionDeferred = $.Deferred();
        getFeedbackQuestion(getFeedbackQuestionDeferred);
        return getFeedbackQuestionDeferred;
      },
      /**
       * addQuestion - description
       *
       * @param  {String} data An string containg the data to be sent to host
       * @returns {Object}      returns object
       */
      addQuestion: function(data) {

        addQuestionDeferred = $.Deferred();
        addQuestion(data, addQuestionDeferred);
        return addQuestionDeferred;
      },
      /**
       * getFeedbackOptionList - description
       *
       * @returns {object}  returns option object
       */
      getFeedbackOptionList: function() {
        getFeedbackOptionListDeferred = $.Deferred();
        getFeedbackOptionList(getFeedbackOptionListDeferred);
        return getFeedbackOptionListDeferred;
      }
    };
  };
  return new FeedbackModel();
});
