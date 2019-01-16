define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";
    var PaymentHistoryModel = function () {
        var baseService = BaseService.getInstance();
        var fetchPaymentsDeferred, fetchPayments = function(period, fromDate, toDate, media, mediaFormat, isDownload, deferred) {
            var options = {
                url:"ebillPayments?searchBy={period}&fromDate={fromDate}&toDate={toDate}",
                success: function(data) {
                  deferred.resolve(data);
                }
            },
            params = {
              period: period,
              fromDate:fromDate,
              toDate:toDate
            };
            if(isDownload) {
                options.url += "&media=" + media + "&mediaFormat=" + mediaFormat;
                baseService.downloadFile(options, params);
            } else {
                baseService.fetch(options,params);
            }
        };
        var fetchMediaTypeDeferred, fetchMediaType = function(deferred) {
          var options = {
            url: "enumerations/mediatype",
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
            fetchPayments: function(period,fromDate,toDate,media,mediaFormat) {
                fetchPaymentsDeferred = $.Deferred();
                fetchPayments(period,fromDate,toDate, media, mediaFormat, false, fetchPaymentsDeferred);
                return fetchPaymentsDeferred;
            },
            fetchMediaType: function() {
                fetchMediaTypeDeferred = $.Deferred();
                fetchMediaType(fetchMediaTypeDeferred);
                return fetchMediaTypeDeferred;
            },
            downloadStatement: function(period, fromDate, toDate, media, mediaFormat) {
                fetchPayments(period, fromDate, toDate, media, mediaFormat, true, fetchPaymentsDeferred);
            }
        };
    };
    return new PaymentHistoryModel();
});
