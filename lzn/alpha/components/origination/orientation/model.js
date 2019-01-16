define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * @namespace CreditCardStructureSolution~CardStructureSolutionModel
   * @class CardStructureSolutionModel
   */
  return function OrientationModel() {
    var
      /*
       * Extending BaseService
       */
      baseService = BaseService.getInstance(),
      deleteSessionDeffered,

      /**
       * deleteSession - description
       *
       * @param  {Object} deferred description
       * @return {void}          description
       */
      deleteSession = function(deferred) {
        var options = {
          url: "session",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.remove(options);
      };
    return {
      /**
       * deleteSession - description
       *
       * @return {Object}  description
       */
      deleteSession: function() {
        deleteSessionDeffered = $.Deferred();
        deleteSession(deleteSessionDeffered);
        return deleteSessionDeffered;
      }
    };
  };
});