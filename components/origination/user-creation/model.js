define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var UserCreationModel = function() {
    var Model = function() {
        this.primary = {
          username: "",
          password: "",
          partyId: "",
          submissionId: ""
        };
        this.coApp = {
          username: "",
          partyId: "",
          submissionId: {
            displayValue: "",
            value: ""
          },
          applicationId: {
            displayValue: "",
            value: ""
          }
        };
        this.QuesAnsPayload = {
          userSecurityQuestionList: []
        };
      },
      baseService = BaseService.getInstance(),
      notificationSuccessDeferred,
      notificationSuccess = function(notificationId, deferred) {
        var params = {
            notificationId: notificationId
          },
          options = {
            url: "registration/prospect/notification/{notificationId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      deleteSessionDeffered, deleteSession = function(deferred) {
        var options = {
          url: "session",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.remove(options);
      },
      registerDeferred,
      register = function(payload, deferred) {
        var options = {
          url: "registration/prospect",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      registerThroughLinkDeferred,
      registerThroughLink = function(payload, deferred, notificationId) {
        var params = {
            notificationId: notificationId
          },
          options = {
            url: "registration/prospect/notification/{notificationId}",
            data: payload,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.update(options, params);
      },
      fetchApplicantDeferred, fetchApplicantList = function(submissionId, deferred) {
        var params = {
            submissionId: submissionId
          },
          options = {
            url: "submissions/{submissionId}/applicants",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      registerCoAppDeferred,
      registerCoApp = function(payload, deferred) {
        var options = {
          url: "registration/prospect/notification",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },
      fetchPasswordPolicyDeferred,
      fetchPasswordPolicy = function(deferred) {
        var options = {
          url: "passwordPolicy",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      verifyEmailDeferred,
      verifyEmail = function(payload, deferred) {
        var options = {
          url: "me/emailVerification/otp",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },

      fetchUserNameTypeDeferred,
      fetchUserNameType = function(deferred) {
        var options = {
          url: "registration/prospect/userNamePolicy",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      submitApplicationDeferred,
      submitApplication = function(submissionId, deferred) {
        var params = {
            "submissionId": submissionId
          },
          options = {
            url: "submissions/{submissionId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.update(options, params);
      },
      getApplicationsDeferred,
      getApplications = function(submissionId, deferred) {
        var params = {
          "submissionId": submissionId
        };
        var options = {
          url: "submissions/{submissionId}/applications",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, params);
      },
      fetchSecurityQuestionNumberDeferred,
      fetchSecurityQuestionNumber = function(deferred) {
        var options = {
          url: "me/securityQuestion/noOfQuestions",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchSecurityQuestionListDeferred,
      fetchSecurityQuestionList = function(deferred) {
        var options = {
          url: "securityQuestion",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      postSecurityQuestionsDeferred, postSecurityQuestions = function(payload, refNoHeader, deferred) {
        var options = {
          url: "me/securityQuestion",
          data: payload,
          headers: {
            "X_OR_REFERENCE_NO": refNoHeader
          },
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      createLoginConfigDeferred, createLoginConfig = function(payload, refNoHeader, deferred) {
        var options = {
          url: "me/loginFlow",
          data: payload,
          headers: {
            "X_OR_REFERENCE_NO": refNoHeader
          },
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },
      fetchEmailVerificationCheckDeferred,
      fetchEmailVerificationCheck = function(deferred) {
        var options = {
          url: "configurations/base/OriginationConfig/properties/ORIG_PI_EMAIL_VERIFICATION_REQUIRED",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      notificationSuccess: function(notificationId) {
        notificationSuccessDeferred = $.Deferred();
        notificationSuccess(notificationId, notificationSuccessDeferred);
        return notificationSuccessDeferred;
      },
      register: function(payload) {
        registerDeferred = $.Deferred();
        register(payload, registerDeferred);
        return registerDeferred;
      },
      deleteSession: function() {
        deleteSessionDeffered = $.Deferred();
        deleteSession(deleteSessionDeffered);
        return deleteSessionDeffered;
      },
      registerThroughLink: function(payload, notificationId) {
        registerThroughLinkDeferred = $.Deferred();
        registerThroughLink(payload, registerThroughLinkDeferred, notificationId);
        return registerThroughLinkDeferred;
      },
      registerCoApp: function(payload) {
        registerCoAppDeferred = $.Deferred();
        registerCoApp(payload, registerCoAppDeferred);
        return registerCoAppDeferred;
      },
      fetchApplicantList: function(submissionId) {
        fetchApplicantDeferred = $.Deferred();
        fetchApplicantList(submissionId, fetchApplicantDeferred);
        return fetchApplicantDeferred;
      },
      fetchPasswordPolicy: function() {
        fetchPasswordPolicyDeferred = $.Deferred();
        fetchPasswordPolicy(fetchPasswordPolicyDeferred);
        return fetchPasswordPolicyDeferred;
      },
      fetchUserNameType: function() {
        fetchUserNameTypeDeferred = $.Deferred();
        fetchUserNameType(fetchUserNameTypeDeferred);
        return fetchUserNameTypeDeferred;
      },
      fetchEmailVerificationCheck: function() {
        fetchEmailVerificationCheckDeferred = $.Deferred();
        fetchEmailVerificationCheck(fetchEmailVerificationCheckDeferred);
        return fetchEmailVerificationCheckDeferred;
      },
      verifyEmail: function(payload) {
        verifyEmailDeferred = $.Deferred();
        verifyEmail(payload, verifyEmailDeferred);
        return verifyEmailDeferred;
      },
      submitApplication: function(submissionId) {
        submitApplicationDeferred = $.Deferred();
        submitApplication(submissionId, submitApplicationDeferred);
        return submitApplicationDeferred;
      },
      getApplications: function(submissionId) {
        getApplicationsDeferred = $.Deferred();
        getApplications(submissionId, getApplicationsDeferred);
        return getApplicationsDeferred;
      },
      fetchSecurityQuestionNumber: function() {
        fetchSecurityQuestionNumberDeferred = $.Deferred();
        fetchSecurityQuestionNumber(fetchSecurityQuestionNumberDeferred);
        return fetchSecurityQuestionNumberDeferred;
      },
      fetchSecurityQuestionList: function() {
        fetchSecurityQuestionListDeferred = $.Deferred();
        fetchSecurityQuestionList(fetchSecurityQuestionListDeferred);
        return fetchSecurityQuestionListDeferred;
      },
      postSecurityQuestions: function(payload, refNoHeader) {
        postSecurityQuestionsDeferred = $.Deferred();
        postSecurityQuestions(payload, refNoHeader, postSecurityQuestionsDeferred);
        return postSecurityQuestionsDeferred;
      },
      createLoginConfig: function(payload, refNoHeader) {
        createLoginConfigDeferred = $.Deferred();
        createLoginConfig(payload, refNoHeader, createLoginConfigDeferred);
        return createLoginConfigDeferred;
      }
    };
  };
  return new UserCreationModel();
});