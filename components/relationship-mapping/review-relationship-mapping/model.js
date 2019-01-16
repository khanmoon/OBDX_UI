define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * var ReviewRelationshipMappingModel - description
   *
   * @return {type}  description
   */
  var ReviewRelationshipMappingModel = function() {
    var baseService = BaseService.getInstance();

    /**
     * var Model - description
     *
     * @return {type}  description
     */
    var Model = function() {
        this.createRelationshipMappingPayload = {
          relationshipCode: "",
          hostRelationshipCode: ""
        };
      },
      createRelationshipMappingDeferred,

      /**
       * createRelationshipMapping - description
       *
       * @param  {type} payload  description
       * @param  {type} deferred description
       * @return {type}          description
       */
      createRelationshipMapping = function(payload, deferred) {
        var options = {
          url: "accountRelationship/maintenance",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(jqXhr, status, errorThrown ) {
            deferred.reject(jqXhr, status, errorThrown );
          }
        };
        baseService.add(options);
      };
    return {

      /**
       * getNewModel - description
       *
       * @return {type}  description
       */
      getNewModel: function() {
        return new Model();
      },

      /**
       * createRelationshipMapping - description
       *
       * @param  {type} payload description
       * @return {type}         description
       */
      createRelationshipMapping: function(payload) {
        createRelationshipMappingDeferred = $.Deferred();
        createRelationshipMapping(payload, createRelationshipMappingDeferred);
        return createRelationshipMappingDeferred;
      }
    };
  };
  return new ReviewRelationshipMappingModel();
});
