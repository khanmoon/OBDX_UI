define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";
    /**
     * Main file for Service Request Search Model. This file contains the model definition
     * for list of moduleType and data fetched from the server through REST call.<br/><br/>
     * The injected Model Class will have below properties:
     * @namespace
     * @class ServiceRequestsBaseFormModel
     */
    var ServiceRequestsBaseFormModel = function () {
        var baseService = BaseService.getInstance(),
            readDataDeferred,
            /**
             * Private method to fetch the service requests details based on service request Id
             * This method will resolve a passed deferred object which can be returned from calling function to the parent.
             * @function readData
             * @memberOf ErrorModel
             * @returns {void}
             * @private
             * @param {String} id - service request id for request to be read
             * @param {Object} deferred - An object type deferred
             */
            readData = function (id, deferred) {
                var option = {
                        url: "servicerequest/definitions/{id}",
                        success: function (data) {
                            deferred.resolve(data);
                        }
                    },
                    params = {
                        "id": id
                    };
                baseService.fetch(option, params);
            },
            getFileDeferred,
            /**
             * Private method to fetch content of uploaded image
             * This method will resolve a passed deferred object which can be returned from calling function to the parent.
             * @function getFile
             * @memberOf ErrorModel
             * @returns {void}
             * @private
             * @param {String} contentId - content ID of the uploaded image
             * @param {Object} deferred - An object type deferred
             */
            getFile = function (contentId, deferred) {
                var option = {
                        url: "contents/{contentId}",
                        success: function (data) {
                            deferred.resolve(data);
                        }
                    },
                    params = {
                        "contentId": contentId
                    },
                    headers = {
                        "Content-Id": contentId,
                        "Content-Type": "application/json"
                    };
                baseService.fetch(option, params, headers);
            };
        return {
            /**
             * Public method to read Service Request details. This method will
             * instantiate a new deferred object and will return the same to the callee function
             * which will be resolved after call completion with appropriate data and developer
             * can use .then(handler) to handle the data.
             * This method will resolve a passed deferred object which can be returned from calling function to the parent.
             * @function readData
             * @memberOf ServiceRequestsBaseFormModel
             * @param {String} id Id of service request
             * @returns {Object} - deferredObject
             * @example
             *       ServiceRequestBaseForm.readData().done(function(data) {
             *
             *       });
             */
            readData: function (id) {
                readDataDeferred = $.Deferred();
                readData(id, readDataDeferred);
                return readDataDeferred;
            },
            /**
             * Public method to fetch list of Service Requests. This method will
             * instantiate a new deferred object and will return the same to the callee function
             * which will be resolved after call completion with appropriate data and developer
             * can use .then(handler) to handle the data.
             * This method will resolve a passed deferred object which can be returned from calling function to the parent.
             * @function getFile
             * @memberOf ServiceRequestsBaseFormModel
             * @param {String} contentId Content ID of the uploaded image
             * @returns {Object} - deferredObject
             * @example
             *       ServiceRequestBaseForm.getFile().done(function(data) {
             *
             *       });
             */
            getFile: function (contentId) {
                getFileDeferred = $.Deferred();
                getFile(contentId, getFileDeferred);
                return getFileDeferred;
            }
        };
    };
    return new ServiceRequestsBaseFormModel();
});