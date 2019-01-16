define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  var SecurityQuestions = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance();

    /**
     * This function fires a GET request to fetch the Question against its Id
     *
     */
    var fetchQuestionDeferred, fetchQuestion = function(questionId, deferred) {
      var params = {
        "questionId": questionId
      };
      var options = {
        url: "securityQuestion/question/{questionId}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options, params);
    };

    return {

      fetchQuestion: function(questionId) {
        fetchQuestionDeferred = $.Deferred();
        fetchQuestion(questionId, fetchQuestionDeferred);
        return fetchQuestionDeferred;
      }

    };
  };
  return new SecurityQuestions();
});