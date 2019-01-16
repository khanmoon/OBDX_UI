define([
  "jquery",
  "baseService", "framework/js/constants/constants"
], function($, BaseService, Constants) {
  "use strict";
  var ScheduledPaymentsInfoModel = function() {
    var baseService = BaseService.getInstance(),
      getHostDateDeferred, getHostDate = function(deferred) {

        var options = {
          url: "payments/currentDate",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        if (Constants.userSegment === "ADMIN") {
          options.url = "design-dashboard/data/payments/scheduled-payments/scheduled-payments";
          baseService.fetchJSON(options);
        } else {
          baseService.fetch(options);
        }
      },
      getUpcomingPaymentsListDeferred, getUpcomingPaymentsList = function(fromDate, toDate, deferred) {
        var options = {
            url: "payments/instructions?status=ACTIVE&type=ALL&maxRecords=4&fromDate={fromDate}&toDate={toDate}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            fromDate: fromDate,
            toDate: toDate
          };
          if (Constants.userSegment === "ADMIN") {
            options.url = "design-dashboard/data/payments/scheduled-payments/upcoming-payment-list";
            baseService.fetchJSON(options);
          } else {
            baseService.fetch(options,params);
          }
      };
    return {
      getUpcomingPaymentsList: function(fromDate, toDate) {
        getUpcomingPaymentsListDeferred = $.Deferred();
        getUpcomingPaymentsList(fromDate, toDate, getUpcomingPaymentsListDeferred);
        return getUpcomingPaymentsListDeferred;
      },
      getHostDate: function() {
        getHostDateDeferred = $.Deferred();
        getHostDate(getHostDateDeferred);
        return getHostDateDeferred;
      }
    };
  };
  return new ScheduledPaymentsInfoModel();
});