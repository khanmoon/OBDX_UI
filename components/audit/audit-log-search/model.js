define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var AuditLogSearchModel = function() {
    var baseService = BaseService.getInstance();
  /**
     * Function to get new instance of AuditLogSearchModel
     *
     * @function
     * @memberOf AuditLogSearchModel
     * @returns Model
     * @private
     */
    var searchAuditDeferred, getAuditTypeDeffered, getAuditType = function(deferred) {
      var options = {
        url: "audit/auditType",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetchJSON(options);
    };
    var searchAudit = function(userid, contextid, serviceid, partyid, requesturl, starttime, endtime, audit, operationName, serviceName, deferred) {
      var options = {
        url: "audit?userID=" + userid + "&contextID=" + contextid + "&serviceId=" + serviceid + "&partyId=" + partyid + "&requestUrl=" + requesturl + "&startTime=" + starttime + "&endTime=" + endtime + "&auditType=" + audit + "&hostOperationName=" + operationName + "&hostServiceId=" + serviceName,
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
             * Public function to search Audit
             * @returns {Promise}  Returns the promise object
             */
      getAuditType: function() {
        getAuditTypeDeffered = $.Deferred();
        getAuditType(getAuditTypeDeffered);
        return getAuditTypeDeffered;
      },
      searchAudit: function(userID, contextID, serviceId, partyId, requestUrl, startTime, endTime, audit, operationName, serviceName) {
        searchAuditDeferred = $.Deferred();
        searchAudit(userID, contextID, serviceId, partyId, requestUrl, startTime, endTime, audit, operationName, serviceName, searchAuditDeferred);
        return searchAuditDeferred;
      }
    };
  };
  return new AuditLogSearchModel();
});