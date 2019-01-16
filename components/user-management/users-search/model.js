define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var UsersSearchModel = function() {
    var baseService = BaseService.getInstance();
    /**
     * Function to get new instance of ApplicationRolesCreateModel
     *
     * @function
     * @memberOf UsersSearchModel
     * @returns Model
     */
    var modelInitialized = false,
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/

      errors = {
        InitializationException: function() {
          var message = "";
          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }(),
        ObjectNotInitialized: function() {
          var message = "";
          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }()
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      },
      /**
			 * This function fires a GET request to get the list of user types
			 * and delegates control to the successhandler along with response data
			 * once the details are successfully fetched
			 *
			 * @function fetchUserType
			 * @memberOf UsersCreateModel

			 * @example UsersCreateModel.fetchUserType(data);
			 */
      fetchUserTypeDeferred, fetchUserType = function(deferred) {
        var options = {
          url: "enumerations/userType",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchUsersListDeferred, fetchUsersList = function(Parameters, deferred) {
        var params = {
            "username": Parameters.username,
            "firstName": Parameters.firstName,
            "lastName": Parameters.lastName,
            "emailId": Parameters.emailId,
            "mobileNumber": Parameters.mobileNumber,
            "partyId": Parameters.partyId,
            "isAccessSetupCheckRequired": false,
            "userType": Parameters.userType
          },
          options = {
            url: "users?username={username}&firstName={firstName}&lastName={lastName}&mobileNumber={mobileNumber}&emailId={emailId}&userType={userType}&partyId={partyId}",
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
       * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
       * @function fetchDetails
       *
       * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
       * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
       */
      fetchDetailsDeferred, fetchDetails = function(partyId, deferred) {
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

    return {
      init: function() {
        modelInitialized = true;
        return modelInitialized;
      },
      fetchUsersList: function(Parameters) {
        objectInitializedCheck();
        fetchUsersListDeferred = $.Deferred();
        fetchUsersList(Parameters, fetchUsersListDeferred);
        return fetchUsersListDeferred;
      },
      fetchUserType: function() {
        fetchUserTypeDeferred = $.Deferred();
        fetchUserType(fetchUserTypeDeferred);
        return fetchUserTypeDeferred;
      },
      fetchDetails: function(partyId) {
        fetchDetailsDeferred = $.Deferred();
        fetchDetails(partyId, fetchDetailsDeferred);
        return fetchDetailsDeferred;
      }

    };
  };
  return new UsersSearchModel();
});