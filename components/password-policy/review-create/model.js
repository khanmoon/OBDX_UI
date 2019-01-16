define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();

  var PasswordPolicyCreateReviewModel = function() {

    var Model = function() {
      this.passwordPolicyCreateModel = {
          "pwdPolicyName": null,
          "pwdPolicyDesc": null,
          "enterpriseRoles": [],
          "pwdMinLength": null,
          "pwdMaxLength": null,
          "nbrRepeatChars": null,
          "nbrSuccessiveChars": null,
          "pwdHistorySize": null,
          "pwdMaxFailure": null,
          "excludedDictWords": [],
          "pwdExpireWarning": null,
          "pwdMaxExpiryDays": null,
          "pwdMustChange": null,
          "isUpperAlphaAllowed": null,
          "isLowerAlphaAllowed": null,
          "isNumericAllowed": null,
          "isSpecialCharAllowed": null,
          "nbrUpperAlpha": null,
          "nbrLowerAlpha": null,
          "nbrNumeric": null,
          "nbrSpecial": null,
          "personalDetExclude": null
        };
        this.exclusionDetailListValues = {
          "dob": "dob",
          "firstname": "firstname",
          "lastname": "lastname",
          "userid": "userid",
          "partyid": "partyid"
        };
    };

    var createPasswordPolicyDeferred, createPasswordPolicy = function(createPayload, deferred) {
        var options = {
          url: "passwordPolicy",
          data: createPayload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      /**
       * This function fires a GET request to fetch the user groups options
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched
       *
       * @function fetchUserGroupOptions
       * @memberOf UsersCreateModel

       * @example UsersCreateModel.fetchUserGroupOptions();
       */
      fetchUserGroupOptionsDeferred, fetchUserGroupOptions = function(deferred) {
        var options = {
          url: "enterpriseRoles?isLocal=true",
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
      createPasswordPolicy: function(payload) {
        createPasswordPolicyDeferred = $.Deferred();
        createPasswordPolicy(payload, createPasswordPolicyDeferred);
        return createPasswordPolicyDeferred;
      },
      fetchUserGroupOptions: function() {
        fetchUserGroupOptionsDeferred = $.Deferred();
        fetchUserGroupOptions(fetchUserGroupOptionsDeferred);
        return fetchUserGroupOptionsDeferred;
      }
    };
  };
  return new PasswordPolicyCreateReviewModel();
});
