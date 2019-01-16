define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var recordViewAdminModel = function() {
    var Model = function() {
      this.payload = {
        label: null,
        values: null,
        dataType: null,
        mandatory: null
      };
    };
    var baseService = BaseService.getInstance(),
      /**
       * Method to the record
       *  deferred object is resolved once the  information  is successfully fetched
       *
       * @function readRecord
       * @param {oject} deferred- resolved for successful request
       * @param {string} fileRefId - the file reference ID
       * @param {string} recRefId - the record refernce ID
       * @private
       */
      readRecordDeferred, readRecord = function(deferred, fileRefId, recRefId) {
        var options = {
            url: "fileUploads/files/{fileRefId}/records/{recRefId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "fileRefId": fileRefId,
            "recRefId": recRefId
          };
        baseService.fetch(options, params);
      },
      /**
       * Method to the load the template
       *  deferred object is resolved once the  information  is successfully fetched
       *
       * @function getJSONData
       * @param {oject} deferred- resolved for successful request
       * @private
       */
      getJSONDataDeferred, getJSONData = function(deferred) {
        var options = {
          url: "file-upload/record-component-mapping",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetchJSON(options);
      },
      /**
       * Method to the record
       *  deferred object is resolved once the  information  is successfully fetched
       *
       * @function getRecordStatus
       * @param {oject} deferred- resolved for successful request
       * @private
       */
      getRecordStatusDeferred, getRecordStatus = function(deferred) {
        var options = {
          url: "enumerations/recordStatuses",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      /**
       * Method to get the list of records
       *  deferred object is resolved once the  information  is successfully fetched
       *
       * @function listRecords
       * @param {object} deferred- resolved for successful request
       * @param {object} PARAMS - indicates the url
       * @private
       */
      listRecordsDeferred, listRecords = function(deferred, PARAMS) {
        var options = {
          url: PARAMS,
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
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      readRecord: function(fileRefId, recRefId) {
        readRecordDeferred = $.Deferred();
        readRecord(readRecordDeferred, fileRefId, recRefId);
        return readRecordDeferred;
      },
      getRecordStatus: function() {
        getRecordStatusDeferred = $.Deferred();
        getRecordStatus(getRecordStatusDeferred);
        return getRecordStatusDeferred;
      },
      getJSONData: function() {
        getJSONDataDeferred = $.Deferred();
        getJSONData(getJSONDataDeferred);
        return getJSONDataDeferred;
      },
      listRecords: function(PARAMS) {
        listRecordsDeferred = $.Deferred();
        listRecords(listRecordsDeferred, PARAMS);
        return listRecordsDeferred;
      }
    };
  };
  return new recordViewAdminModel();
});
