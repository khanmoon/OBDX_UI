/**
 * Model for transfer-view-limits
 * @param {object} $ jquery instance
 * @param {object} BaseService instance
 * @return {object} TransferViewLimitsModel
 */
define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";
    var TransferViewLimitsModel = function() {
        var
            baseService = BaseService.getInstance(),

            /**
             * fetches assigned limit package
             *
             * @param {object} baseUrl base url
             * @param {object} accessPointValue access point
             * @param {object} accessPointGroupType accesspoint group
             * @param {object} deferred Deferred object
             * @returns {Promise}  Returns the promise object
             */
            fetchAssignedLimitPackagesDeferred, fetchAssignedLimitPackages = function(baseUrl, accessPointValue, accessPointGroupType, deferred) {
                var params = {
                        "accessPointValue": accessPointValue,
                        "accessPointGroupType": accessPointGroupType
                    },
                    options = {
                        url: "me/assignedLimitPackage?accessPointValue=" + accessPointValue + "&accessPointGroupType=" + accessPointGroupType,
                        success: function(data) {
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    };
                baseService.fetch(options, params);
            },

            /**
             * fetches custom limit package
             *
             * @param {object} baseUrl base url
             * @param {object} accessPointValue access point
             * @param {object} accessPointGroupType accesspoint group
             * @param {object} deferred Deferred object
             * @returns {Promise}  Returns the promise object
             */
             fetchCustomLimitPackagesDeferred, fetchCustomLimitPackages = function(baseUrl, accessPointValue, accessPointGroupType, deferred) {
               var params = {
                       "accessPointValue": accessPointValue,
                       "accessPointGroupType": accessPointGroupType
                   },
                options = {
                 url: "me/customLimitPackage?accessPointValue=" + accessPointValue + "&accessPointGroupType=" + accessPointGroupType,
                 success: function(data) {
                   deferred.resolve(data);
                 },
                 error: function(data) {
                   deferred.reject(data);
                 }
               };
               baseService.fetch(options, params);
             },
            /**
             * fetches utilized limit
             *
             * @param {object} deferred Deferred object
             * @param {object} url url
             * @returns {Promise}  Returns the promise object
             */
            fetchUtilizationLimitDeferred, fetchUtilizationLimit = function(deferred, url) {
                var options = {
                    url: url,
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
             * fetches utilized limit
             *
             * @param {object} url url
             * @returns {Promise}  Returns the promise object
             */
            fetchUtilizationLimit: function(url) {
                fetchUtilizationLimitDeferred = $.Deferred();
                fetchUtilizationLimit(fetchUtilizationLimitDeferred, url);
                return fetchUtilizationLimitDeferred;
            },
            /**
             * fetches assigned limit package
             *
             * @param {object} baseUrl base url
             * @param {object} accessPointValue access point
             * @param {object} accessPointGroupType accesspoint group
             * @returns {Promise}  Returns the promise object
             */
            fetchAssignedLimitPackages: function(baseUrl, accessPointValue, accessPointGroupType) {
                fetchAssignedLimitPackagesDeferred = $.Deferred();
                fetchAssignedLimitPackages(baseUrl, accessPointValue, accessPointGroupType, fetchAssignedLimitPackagesDeferred);
                return fetchAssignedLimitPackagesDeferred;
            },
            /**
             * fetches custom limit package
             *
             * @param {object} baseUrl base url
             * @param {object} accessPointValue access point
             * @param {object} accessPointGroupType accesspoint group
             * @returns {Promise}  Returns the promise object
             */
            fetchCustomLimitPackages: function(baseUrl, accessPointValue, accessPointGroupType) {
                fetchCustomLimitPackagesDeferred = $.Deferred();
                fetchCustomLimitPackages(baseUrl, accessPointValue, accessPointGroupType, fetchCustomLimitPackagesDeferred);
                return fetchCustomLimitPackagesDeferred;
            }
        };
    };
    return new TransferViewLimitsModel();
});
