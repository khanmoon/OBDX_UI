define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var RelationshipMatrixMappingModel = function() {
    var baseService = BaseService.getInstance();
    /**
     * In case more than one instance of model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @return {void}  description
     */
    var Model = function() {
      this.taskToAccountRelationshipMapping = {
        taskToAccountRelationshipDTOs: [{
          taskId: "",
          accountRelationshipCode: "",
          accountType: ""
        }]
      };
    };
    /**
     * var fetchTasksDeferred - description
     *
     * @param  {type} deferred description
     * @return {type}          description
     */

    var fetchTasksDeferred, fetchTasks = function(deferred) {
        var options = {
          url: "accountRelationship/mapping",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchRelationshipsDeferred, fetchRelationships = function(deferred) {
        var options = {
          url: "accountRelationship/maintenance",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      createMappingDeferred, createMapping = function(payload, deferred) {
        var options = {
          url: "accountRelationship/mapping",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
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
          url: "enumerations/accountRelationshipType",
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
       * getNewModel - description
       *
       * @param  {type} modelData description
       * @return {type}           description
       */
      getNewModel: function() {
        return new Model();
      },
      fetchTasks: function() {
        fetchTasksDeferred = $.Deferred();
        fetchTasks(fetchTasksDeferred);
        return fetchTasksDeferred;
      },
      fetchRelationships: function() {
        fetchRelationshipsDeferred = $.Deferred();
        fetchRelationships(fetchRelationshipsDeferred);
        return fetchRelationshipsDeferred;
      },
      createMapping: function(payload) {
        createMappingDeferred = $.Deferred();
        createMapping(payload, createMappingDeferred);
        return createMappingDeferred;
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
  return new RelationshipMatrixMappingModel();
});
