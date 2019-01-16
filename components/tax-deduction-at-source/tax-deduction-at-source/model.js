define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var tdsModel = function() {
    var baseService = BaseService.getInstance(),
      downloadDeferred,

      /**
       * download - description
       *
       * @param  {type} taskCode  description
       * @param  {type} fromDate  description
       * @param  {type} toDate    description
       * @param  {type} deferred  description
       * @return {type}           description
       */
      download = function(taskCode, fromDate, toDate, deferred) {
        var parameters = {
          taskCode: taskCode,
          fromDate: fromDate,
          toDate: toDate
        };
        var options = {
          url: "accounts/deposit/taxPaid?fromDate={fromDate}&toDate={toDate}&taskCode={taskCode}&media=application/pdf",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.downloadFile(options, parameters);
      },
      viewDeferred,

      /**
       * view - description
       *
       * @param  {type} deferred description
       * @param  {type} taskCode description
       * @param  {type} fromDate description
       * @param  {type} toDate   description
       * @return {type}          description
       */
      view = function(deferred, taskCode, fromDate, toDate) {
        var parameters = {
          taskCode: taskCode,
          fromDate: fromDate,
          toDate: toDate
        };
        var options = {
          url: "accounts/deposit/taxPaid?fromDate={fromDate}&toDate={toDate}&taskCode={taskCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options,parameters);
      },

      fetchCurrentDateDeferred,

      /**
       * fetchCurrentDate - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      fetchCurrentDate = function(deferred) {
        var options = {
          url: "payments/currentDate",
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
       * download - description
       *
       * @param  {type} taskCode  description
       * @param  {type} fromDate  description
       * @param  {type} toDate    description
       * @return {type}           description
       */
      download: function(taskCode, fromDate, toDate) {
        downloadDeferred = $.Deferred();
        download(taskCode, fromDate, toDate, downloadDeferred);
        return downloadDeferred;
      },

      /**
       * view - description
       *
       * @param  {type} taskCode  description
       * @param  {type} fromDate    description
       * @param  {type} toDate    description
       * @return {type}           description
       */
      view: function(taskCode, fromDate, toDate) {
        viewDeferred = $.Deferred();
        view(viewDeferred, taskCode, fromDate, toDate);
        return viewDeferred;
      },

      /**
       * fetchCurrentDate - description
       *
       * @return {type}  description
       */
      fetchCurrentDate: function() {
        fetchCurrentDateDeferred = $.Deferred();
        fetchCurrentDate(fetchCurrentDateDeferred);
        return fetchCurrentDateDeferred;
      }
    };
  };
  return new tdsModel();
});
