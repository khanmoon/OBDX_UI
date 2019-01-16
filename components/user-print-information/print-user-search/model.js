define([
        "jquery",
        "baseService"
    ],
    function($, BaseService) {
        "use strict";
        var baseService = BaseService.getInstance();
        var params;
        var PrintUserSearchModel = function() {
            var Model = function() {
                this.userprintModel = {
                    "userID": [],
                    "userPrintDocs": []
                };
            };
            var fetchUsersListDeferred, fetchUsersList = function(Parameters, deferred) {
                var userParameters = {
                        "userName": Parameters.userName,
                        "emailId": Parameters.emailId,
                        "mobileNumber": Parameters.mobileNumber,
                        "userType": Parameters.userType,
                        "userGroup": Parameters.userType,
                        "partyId": Parameters.partyId,
                        "firstName": Parameters.firstName,
                        "lastName": Parameters.lastName,
                        "passwordGenerationFromDate": Parameters.passwordgenerationFromDate,
                        "passwordGenerationToDate": Parameters.passwordGenerationToDate,
                        "isAccessSetupCheckRequired": false,
                        "passwordGenerationType": Parameters.passwordGenerationType
                    },
                    options = {
                        url: "users?username={userName}&firstName={firstName}&lastName={lastName}&mobileNumber={mobileNumber}&emailId={emailId}&userType={userType}&userGroup={userGroup}&partyId={partyId}&passwordGenerationFromDate={passwordGenerationFromDate}&passwordGenerationToDate={passwordGenerationToDate}&passwordGenerationType={passwordGenerationType}&isUserPasswordPrint=true",
                        success: function(data) {
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    };
                baseService.fetch(options, userParameters);
            };

            var printUsersListDeferred, printUsersList = function(deferred) {
                var options = {
                    url: "enumerations/userprintdocs",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };
                baseService.fetch(options);
            };
            var printUsersDeferred, printUsers = function(printUsersPayload, deferred) {
                var options = {
                    url: "printUsers",
                    data: printUsersPayload,
                    success: function(data, status, jqXhr) {
                        deferred.resolve(data, status, jqXhr);
                    },
                    error: function(data, status, jqXhr) {
                        deferred.reject(data, status, jqXhr);
                    }
                };
                baseService.add(options);
            };
            var fetchDetailsDeferred, fetchDetails = function(partyId, deferred) {
                var options = {
                    url: "parties?partyId=" + partyId,
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    failure: function(data) {
                        deferred.reject(data);
                    }
                };
                baseService.fetch(options);
            };
            var fetchUserGroupOptionsDeferred, fetchUserGroupOptions = function(deferred) {
                    var options = {
                        url: "enterpriseRoles?isLocal=true",
                        success: function(data) {
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    };
                    baseService.fetch(options, params);
                },

                showPartyDetailsDeferred, showPartyDetails = function(deferred) {
                    var options = {
                        url: "me",
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
                fetchUsersList: function(Parameters) {
                    fetchUsersListDeferred = $.Deferred();
                    fetchUsersList(Parameters, fetchUsersListDeferred);
                    return fetchUsersListDeferred;
                },
                printUsersList: function() {
                    printUsersListDeferred = $.Deferred();
                    printUsersList(printUsersListDeferred);
                    return printUsersListDeferred;
                },
                printUsers: function(payload) {
                    printUsersDeferred = $.Deferred();
                    printUsers(payload, printUsersDeferred);
                    return printUsersDeferred;
                },
                fetchDetails: function(partyId) {
                    fetchDetailsDeferred = $.Deferred();
                    fetchDetails(partyId, fetchDetailsDeferred);
                    return fetchDetailsDeferred;
                },
                fetchUserGroupOptions: function() {
                    fetchUserGroupOptionsDeferred = $.Deferred();
                    fetchUserGroupOptions(fetchUserGroupOptionsDeferred);
                    return fetchUserGroupOptionsDeferred;
                },
                showPartyDetails: function() {
                    showPartyDetailsDeferred = $.Deferred();
                    showPartyDetails(showPartyDetailsDeferred);
                    return showPartyDetailsDeferred;
                }
            };
        };
        return PrintUserSearchModel();
    });
