define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * var RelationshipMappingBaseModel - description
   *
   * @return {type}  description
   */
  var RelationshipMappingBaseModel = function() {
    var baseService = BaseService.getInstance();
    var fetchRelationshipMappingDeferred,

      /**
       * fetchRelationshipMapping - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      fetchRelationshipMapping = function(deferred) {
        var options = {
          url: "accountRelationship/maintenance",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },

      fetchRelationshipEnumDeferred,

      /**
       * fetchRelationshipEnum - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      fetchRelationshipEnum = function(deferred) {
        var options = {
          url:"enumerations/accountRelationshipType",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };

    return {

      /**
       * fetchRelationshipMapping - description
       *
       * @return {type}  description
       */
      fetchRelationshipMapping: function() {
        fetchRelationshipMappingDeferred = $.Deferred();
        fetchRelationshipMapping(fetchRelationshipMappingDeferred);
        return fetchRelationshipMappingDeferred;
      },

      /**
       * fetchRelationshipEnum - description
       *
       * @return {type}  description
       */
      fetchRelationshipEnum: function() {
        fetchRelationshipEnumDeferred = $.Deferred();
        fetchRelationshipEnum(fetchRelationshipEnumDeferred);
        return fetchRelationshipEnumDeferred;
      }
    };
  };
  return new RelationshipMappingBaseModel();
});
