define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";
    var ATMBranchLocatorModel = function() {
        var baseService = BaseService.getInstance();
        /**
         * This function creates the customer preferences of valid party Id,
         * posts entered details filled in the form as request payload
         * @function createCP
         * @memberOf CreateCPModel
         **/
        var listLocationsDeferred, listLocations = function(deferred) {

                var options = {
                    url: "locator",
                    success: function(data, status, jqXhr) {
                        deferred.resolve(data, status, jqXhr);
                    },
                    error: function(data, status, jqXhr) {
                        deferred.reject(data, status, jqXhr);
                    }
                };
                baseService.fetch(options);
            },
            getLocationsDeferred, getLocations = function(lat, lng, type, radius, deferred) {
                var uri;
                if (type === "ATM") {
                    uri = "locator/atms?latitude=" + lat + "&longitude=" + lng + "&radius=" + radius + "&type=" + type;
                } else if (type === "BRANCH") {
                    uri = "locator/branches?latitude=" + lat + "&longitude=" + lng + "&radius=" + radius + "&type=" + type;
                } else {
                    uri = "locator?latitude=" + lat + "&longitude=" + lng + "&radius=" + radius + "&type=" + type;
                }
                var options = {
                    url: uri,
                    success: function(data, status, jqXhr) {
                        deferred.resolve(data, status, jqXhr);
                    },
                    error: function(data, status, jqXhr) {
                        deferred.reject(data, status, jqXhr);
                    }
                };
                baseService.fetch(options);
            },
            getDetailsDeferred, getDetails = function(branchCode, type, deferred) {
                var uri;
                if (type === "ATM")
                    uri = "locator/atms/{branchCode}";
                else
                    uri = "locator/branches/{branchCode}";
                var params = {
                        "branchCode": branchCode
                    },
                    options = {
                        url: uri,
                        success: function(data, status, jqXhr) {
                            deferred.resolve(data, status, jqXhr);
                        },
                        error: function(data, status, jqXhr) {
                            deferred.reject(data, status, jqXhr);
                        }
                    };
                baseService.fetch(options, params);
            },
            showAllServicesDeferred, showAllServices = function(type, deferred) {
                var uri = "locator/services?type=" + type,
                    options = {
                        url: uri,
                        success: function(data, status, jqXhr) {
                            deferred.resolve(data, status, jqXhr);
                        },
                        error: function(data, status, jqXhr) {
                            deferred.reject(data, status, jqXhr);
                        }
                    };
                baseService.fetch(options);
            },
            refineServiceSearchDeferred, refineServiceSearch = function(type, serviceId, lat, lng, radius, deferred) {
                var serviceids = "";
                for (var i = 0; i < serviceId.length; i++)
                    serviceids = serviceids + "&supportedServices=" + serviceId[i];
                var uri = "locator?latitude=" + lat + "&longitude=" + lng + "&radius=" + radius + serviceids + "&type=" + type,
                    options = {
                        url: uri,
                        success: function(data, status, jqXhr) {
                            deferred.resolve(data, status, jqXhr);
                        },
                        error: function(data, status, jqXhr) {
                            deferred.reject(data, status, jqXhr);
                        }
                    };
                baseService.fetch(options);
            };
        return {

            listLocations: function() {
                listLocationsDeferred = $.Deferred();
                listLocations(listLocationsDeferred);
                return listLocationsDeferred;
            },
            getLocations: function(lat, lng, type, radius) {
                getLocationsDeferred = $.Deferred();
                getLocations(lat, lng, type, radius, getLocationsDeferred);
                return getLocationsDeferred;
            },
            getDetails: function(branchCode, type) {
                getDetailsDeferred = $.Deferred();
                getDetails(branchCode, type, getDetailsDeferred);
                return getDetailsDeferred;
            },
            showAllServices: function(type) {
                showAllServicesDeferred = $.Deferred();
                showAllServices(type, showAllServicesDeferred);
                return showAllServicesDeferred;
            },
            refineServiceSearch: function(type, serviceId, lat, lng, radius) {
                refineServiceSearchDeferred = $.Deferred();
                refineServiceSearch(type, serviceId, lat, lng, radius, refineServiceSearchDeferred);
                return refineServiceSearchDeferred;
            }

        };
    };
    return new ATMBranchLocatorModel();
});
