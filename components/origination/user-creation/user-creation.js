define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/origination/user-creation",
  "framework/js/constants/constants",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset",
  "ojs/ojvalidationgroup",
  "ojs/ojknockout-validation"
], function(oj, ko, $, UserCreationModel, resourceBundle, Constants) {
  "use strict";

  return function(rootParams) {
    var self = this,
      payload;
    ko.utils.extend(self, rootParams.rootModel);
    self.passwordRepeat = ko.observable();
    self.password = ko.observable();
    self.displaypasswordpolicy = ko.observable();
    self.confirmEmail = ko.observable();
    self.isConfirmRegister = ko.observable(false);
    self.isRegistered = ko.observable(false);
    self.userNameType = ko.observable();
    self.baseUrl = ko.observable();
    self.isCoApplogin = ko.observable(false);
    self.isEmailVerification = ko.observable(false);
    self.passwordPolicyLoaded = ko.observable(false);
    self.coAppRegSuccessful = ko.observable(false);
    self.disableSecurityQuestions = ko.observable(false);
    self.disableRegistration = ko.observable(false);
    self.readTermAndConditions = ko.observable(false);
    self.skipSecurityQuestions = ko.observable("OPTION_NO");
    self.noOfQuesToConfigure = ko.observable();
    self.termsAndConditions = ko.observableArray();
    self.questionListMap = {};
    self.questionSelectedMap = {};
    self.questionList = ko.observableArray();
    self.isQuestionListLoaded = ko.observable(false);
    self.validationEmailTracker = ko.observable();
    self.validationPwdTracker = ko.observable();
    self.validationTracker = ko.observable();

    if (self.productDetails().isRegistered) {
      self.isRegistered(true);
    }
    self.dataLoaded = ko.observable(true);
    /**
     * function to get a new Knockout Specific model of User Creation
     * section.
     *
     * @function
     * @private
     * @memberOf UserCreationViewModel
     * @returns KoModel ~ KnockOut specific model
     */
    var getNewKoModel = function() {
      var KoModel = UserCreationModel.getNewModel();
      return KoModel;
    };
    self.resource = resourceBundle;
    self.userCreationPayload = ko.observable(getNewKoModel().primary);
    self.quesAnsPayload = getNewKoModel().QuesAnsPayload;
    self.quesAnsPayload.userSecurityQuestionList = ko.observableArray([]);

    UserCreationModel.fetchPasswordPolicy().done(function(data) {
      if (data) {
        var pwdProps = data.passwordPolicyDTO;

        var msg = "";
        msg = rootParams.baseModel.format(self.resource.passwordPolicy, {
          pwdMinLength: pwdProps[0].pwdMinLength,
          pwdMaxLength: pwdProps[0].pwdMaxLength,
          nbrNumeric: pwdProps[0].nbrNumeric,
          nbrUpperAlpha: pwdProps[0].nbrUpperAlpha,
          nbrLowerAlpha: pwdProps[0].nbrLowerAlpha,
          nbrSpecial: pwdProps[0].nbrSpecial,
          specialAllowed: pwdProps[0].specialCharAllowed
        });
        msg = new DOMParser().parseFromString(msg, "text/html");
        self.displaypasswordpolicy(msg);
        self.passwordPolicyLoaded(true);
      }
    });
    UserCreationModel.fetchUserNameType().done(function(data) {
      self.userNameType(data.userNameType);
      if (self.userNameType() === "EMAIL") {
        self.isEmailVerification(data.isEmailVerificationRequired);
      }
    });

    self.questionNumber = function(index) {
      return index + 1;
    };
    self.password.subscribe(function(value) {
      self.userCreationPayload().password = value;
    });
    var questionListCopy;
    UserCreationModel.fetchSecurityQuestionNumber().done(function(data) {
      self.noOfQuesToConfigure(data.noOfQuestions);
      for (var i = 0; i < self.noOfQuesToConfigure(); i++) {
        self.quesAnsPayload.userSecurityQuestionList.push({
          questionId: null,
          answer: null
        });
      }
      UserCreationModel.fetchSecurityQuestionList().done(function(data) {
        questionListCopy = JSON.parse(JSON.stringify(data.secQueList[0].secQueMapping));
        self.questionList(data.secQueList[0].secQueMapping);
        for (var i = 0; i < self.questionList().length; i++) {
          self.questionListMap[self.questionList()[i].questionId] = self.questionList()[i].question;
        }
        self.isQuestionListLoaded(true);
      });
    });

    self.valueChangeHandler = function(event) {
      if (event.detail.value) {
        for (var i = 0; i < self.quesAnsPayload.userSecurityQuestionList().length; i++) {
          if (self.quesAnsPayload.userSecurityQuestionList()[i].questionId !== null && event.detail.value === self.quesAnsPayload.userSecurityQuestionList()[i].questionId[0]) {
            if (self.questionSelectedMap[i]) {
              self.questionList.push({
                questionId: self.questionSelectedMap[i],
                question: self.questionListMap[self.questionSelectedMap[i]]
              });
              self.questionSelectedMap[i] = event.detail.value;
            } else {
              self.questionSelectedMap[i] = event.detail.value;
            }
            for (var j = 0; j < self.questionList().length; j++) {
              if (event.detail.value === self.questionList()[j].questionId) {
                self.questionList.splice(j, 1);
              }
            }
          }
        }
      }
    };

    if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
      if (self.queryMap && self.queryMap.regRefNo) {
        $("#alreadyRegistered").trigger("openModal");
        self.dataLoaded(false);
        return;
      }
      for (var i = 0; i < self.applicantDetails().length; i++) {
        if (rootParams.dashboard.userData.userProfile.partyId.value === self.applicantDetails()[i].applicantId().value) {
          if (self.applicantDetails()[i].applicantRelationshipType === "CO_APPLICANT") {
            self.isCoApplogin(true);
          } else {
            self.isCoApplogin(false);

          }
        }
      }
      self.userCreationPayload().coApp = getNewKoModel().coApp;
    } else if (self.queryMap && self.queryMap.regRefNo) {
      UserCreationModel.notificationSuccess(self.queryMap.regRefNo).fail(function() {
        self.dataLoaded(false);
      });
    }

    self.skipSecurityQuestionsChange = function(event, data) {
      if (data.value === "OPTION_NO" && self.quesAnsPayload.userSecurityQuestionList().length === 0) {
        for (var i = 0; i < self.noOfQuesToConfigure(); i++) {
          self.quesAnsPayload.userSecurityQuestionList.push({
            questionId: null,
            answer: null
          });
        }
        self.questionList(JSON.parse(JSON.stringify(questionListCopy)));
      }
      if (data.value === "OPTION_YES") {
        self.quesAnsPayload.userSecurityQuestionList([]);
      }
    };

    self.viewTermAndConditions = function() {
      $("#termsAndConditionsPopup").trigger("openModal");
      self.readTermAndConditions(true);
    };

    self.closeTermAndConditions = function() {
      $("#termsAndConditionsPopup").trigger("closeModal");
    };

    self.registerUser = function() {
      self.validationEmailTracker(document.getElementById("emailTracker"));
      self.validationPwdTracker(document.getElementById("pwdTracker"));
      self.validationTracker(document.getElementById("valTracker"));
      var emailTracker = rootParams.baseModel.showComponentValidationErrors(self.validationEmailTracker());
      var pwdTracker = rootParams.baseModel.showComponentValidationErrors(self.validationPwdTracker());
      var tracker = rootParams.baseModel.showComponentValidationErrors(self.validationTracker());
      if ((!tracker) || (!emailTracker) || (!pwdTracker)) {
        return;
      }
      if (!self.readTermAndConditions()) {
        $("#readtermsAndConditionsPopup").trigger("openModal");
        self.termsAndConditions([]);
        return;
      }
      if (self.queryMap && self.queryMap.regRefNo) {
        var payload = {
          username: self.userCreationPayload().username,
          password: self.userCreationPayload().password,
          notificationId: self.queryMap.regRefNo
        };
        UserCreationModel.registerThroughLink(JSON.stringify(payload), payload.notificationId).done(function() {
          self.isRegistered(true);
          self.isConfirmRegister(true);
        });
      } else {
        self.userCreationPayload().partyId = self.applicantDetails()[0].applicantId();
        self.userCreationPayload().submissionId = self.productDetails().submissionId.value;
        if (Constants.host === "fcubs") {
          UserCreationModel.fetchApplicantList(self.productDetails().submissionId.value).done(function(data) {
            self.userCreationPayload().partyId = data.applicants[0].applicantId.value;
            self.register();
          });
        } else {
          self.register();
        }
      }
    };

    var refNoHeader;
    self.register = function() {
      if (!self.disableRegistration() && !refNoHeader) {
        UserCreationModel.register(JSON.stringify(self.userCreationPayload())).done(function(data, status, jqXhr) {
          self.disableRegistration(true);
          if (self.skipSecurityQuestions() === "OPTION_NO") {
            for (var i = 0; i < self.quesAnsPayload.userSecurityQuestionList().length; i++) {
              self.quesAnsPayload.userSecurityQuestionList()[i].questionId = self.quesAnsPayload.userSecurityQuestionList()[i].questionId + "";
              for (var j = i + 1; j < self.quesAnsPayload.userSecurityQuestionList().length; j++) {
                self.quesAnsPayload.userSecurityQuestionList()[j].questionId = self.quesAnsPayload.userSecurityQuestionList()[j].questionId + "";
                if (self.quesAnsPayload.userSecurityQuestionList()[i].questionId === self.quesAnsPayload.userSecurityQuestionList()[j].questionId) {
                  rootParams.baseModel.showMessages(null, [self.resource.messages.duplicateQuestions], "INFO");
                  return;
                }
              }
            }
          }
          refNoHeader = jqXhr.getResponseHeader("X_OR_REFERENCE_NO");
          if (self.skipSecurityQuestions() === "OPTION_NO") {
            UserCreationModel.postSecurityQuestions(ko.toJSON(self.quesAnsPayload), refNoHeader).done(function() {
              self.loginFlowPost(refNoHeader);
            });
          } else {
            self.loginFlowPost(refNoHeader);
          }
        });
      } else if (self.skipSecurityQuestions() === "OPTION_NO") {
        UserCreationModel.postSecurityQuestions(ko.toJSON(self.quesAnsPayload), refNoHeader).done(function() {
          self.loginFlowPost(refNoHeader);
        });
      } else {
        self.loginFlowPost(refNoHeader);
      }
    };

    self.loginFlowPost = function(refNoHeader) {
      var loginConfigPayload = {
        loginConfigId: "SETUP_SECURITY_QUESTIONS"
      };
      UserCreationModel.createLoginConfig(JSON.stringify(loginConfigPayload), refNoHeader).done(function() {
        self.disableSecurityQuestions(true);
        loginConfigPayload.loginConfigId = "ACCEPT_TERMS_CONDS";
        UserCreationModel.createLoginConfig(JSON.stringify(loginConfigPayload), refNoHeader).done(function() {
          var isCoappPresent = self.registrationCompulsory() && self.productDetails().requirements && self.productDetails().requirements.noOfCoApplicants < 1;
          var isReqNotPresent = self.registrationCompulsory() && !self.productDetails().requirements;
          if (isCoappPresent || isReqNotPresent || self.productDetails().productClassName === "CREDIT_CARD") {
            UserCreationModel.submitApplication(self.productDetails().submissionId.value).done(function(data) {
              self.productDetails().sectionBeingEdited("");
              if (data.submissionOutputDTO && data.submissionOutputDTO.applications && data.submissionOutputDTO.applications.length > 0 && data.submissionOutputDTO.applications[0].applicationId) {
                self.productDetails().applicationId.value = data.submissionOutputDTO.applications[0].applicationId.value;
                self.appRefNo(data.submissionOutputDTO.applications[0].applicationId.displayValue);
                self.productDetails().applicationId.displayValue = data.submissionOutputDTO.applications[0].applicationId.displayValue;
                if (data.submissionOutputDTO.applications[0].accountId && data.submissionOutputDTO.applications[0].accountId.value !== null) {
                  self.accountId(data.submissionOutputDTO.applications[0].accountId.displayValue);
                }
              }
              if (self.disableFinalSubmitButton && ko.isObservable(self.disableFinalSubmitButton)) {
                self.disableFinalSubmitButton(false);
              }
              if (Constants.host !== "fcubs") {
                self.getApplications();
              } else {
                self.getNextStage();
              }
              self.isConfirmRegister(true);
              self.userCreationPayload().coApp = getNewKoModel().coApp;
              self.productflowComponent(true);
              self.isRegistered(true);
              self.productDetails().isRegistered = true;
            }).fail(function() {
              self.productflowComponent(true);
              self.isRegistered(true);
              self.productDetails().isRegistered = true;
              if (self.disableFinalSubmitButton && ko.isObservable(self.disableFinalSubmitButton)) {
                self.disableFinalSubmitButton(false);
              }
            });
          } else {
            self.isRegistered(true);
            self.productDetails().isRegistered = true;
            self.isConfirmRegister(true);
            self.userCreationPayload().coApp = getNewKoModel().coApp;
          }
        });
      });
    };

    self.getApplications = function() {
      UserCreationModel.getApplications(self.productDetails().submissionId.value).done(function(data) {
        if (data.applications[0].applicationId) {
          self.appRefNo(data.applications[0].applicationId.displayValue);
          if (data.applications[0].applicationStatus) {
            self.applicationStatus(data.applications[0].applicationStatus);
          } else {
            self.applicationStatus(data.applications[0].submissionStatus);
          }
          self.productflowComponent(true);
          self.getNextStage();
        }
      });
    };
    self.registerCoAppUser = function() {
      self.validationEmailTracker(document.getElementById("emailTracker"));
      self.validationPwdTracker(document.getElementById("pwdTracker"));
      self.validationTracker(document.getElementById("valTracker"));
      var emailTracker = rootParams.baseModel.showComponentValidationErrors(self.validationEmailTracker());
      var pwdTracker = rootParams.baseModel.showComponentValidationErrors(self.validationPwdTracker());
      var tracker = rootParams.baseModel.showComponentValidationErrors(self.validationTracker());
      if ((!tracker) || (!emailTracker) || (!pwdTracker)) {
        return;
      }
      if ((self.applicantDetails()[1].applicantType() === "customer" && self.applicantDetails()[1].channelUser()) && (self.applicantDetails()[0].applicantType() === "anonymous" && !self.applicantDetails()[0].channelUser())) {
        if (self.isCoApplogin()) {
          self.userCreationPayload().coApp.partyId = self.applicantDetails()[0].applicantId();
        }

      } else {
        self.userCreationPayload().coApp.partyId = self.applicantDetails()[1].applicantId();
      }
      self.userCreationPayload().coApp.submissionId.value = self.productDetails().submissionId.value;
      if (self.productDetails().applicationId && self.productDetails().applicationId.value) {
        self.userCreationPayload().coApp.applicationId.value = self.productDetails().applicationId.value;
      }
      UserCreationModel.registerCoApp(JSON.stringify(self.userCreationPayload().coApp)).done(function() {
        if (self.registrationCompulsory()) {
          UserCreationModel.submitApplication(self.productDetails().submissionId.value).done(function(data) {
            self.productDetails().sectionBeingEdited("");
            if (data.submissionOutputDTO && data.submissionOutputDTO.applications && data.submissionOutputDTO.applications.length > 0 && data.submissionOutputDTO.applications[0].applicationId) {
              self.productDetails().applicationId.value = data.submissionOutputDTO.applications[0].applicationId.value;
              self.productDetails().applicationId.displayValue = data.submissionOutputDTO.applications[0].applicationId.displayValue;
              if (data.submissionOutputDTO.applications[0].accountId && data.submissionOutputDTO.applications[0].accountId.value !== null) {
                self.accountId(data.submissionOutputDTO.applications[0].accountId.displayValue);
                self.productflowComponent(true);
              }
              self.appRefNo(data.submissionOutputDTO.applications[0].applicationId.displayValue);
              if (data.submissionOutputDTO.applications[0].applicationStatus) {
                self.applicationStatus(data.submissionOutputDTO.applications[0].applicationStatus);
              } else {
                self.applicationStatus(data.submissionOutputDTO.applications[0].applicationStatus);
              }
              self.productflowComponent(true);
              self.getApplications();
              self.productDetails().isRegistered = true;
            } else {
              self.getApplications();
            }
            self.coAppRegSuccessful(true);
            self.userCreationPayload().coApp = getNewKoModel().coApp;
            self.productflowComponent(true);
          }).fail(function() {
            self.productflowComponent(true);
          });
        } else {
          self.coAppRegSuccessful(true);
        }
      });
    };

    self.equalToPassword = {
      validate: function(value) {
        var compareTo = self.userCreationPayload().password;
        if (!value && !compareTo) {
          return true;
        } else if (value !== compareTo) {
          self.passwordRepeat("");
          throw new Error(self.resource.messages.confirmPasswordMismatch);
        }
        return true;
      }
    };
    self.equalToEmail = {
      validate: function(value) {
        var compareTo = self.userCreationPayload().username;
        if (!value && !compareTo) {
          return true;
        } else if (value !== compareTo) {
          throw new Error(self.resource.messages.confirmEmailMismatch);
        }
        return true;
      }
    };

    self.updateEmail = ko.computed(function() {
      if (self.applicantDetails()[0].contactInfo) {
        self.userCreationPayload().username = self.applicantDetails()[0].contactInfo.email();
        $("#username1").val(self.userCreationPayload().username);
      }
    });

    self.otpDevice = ko.observable("");
    rootParams.baseModel.registerComponent("otp-verification", "base-components");
    self.verifyEmail = function() {
      self.validationEmailTracker(document.getElementById("emailTracker"));
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationEmailTracker())) {
        return;
      }
      if (self.queryMap && self.queryMap.regRefNo) {
        self.baseUrl("me/emailVerification/validateAndResend/" + self.queryMap.regRefNo);
      } else {
        self.baseUrl("me/emailVerification/validateAndResend/" + self.productDetails().submissionId.value);

      }

      if (self.queryMap && self.queryMap.regRefNo) {
        payload = {
          email: self.userCreationPayload().username,
          notificationId: self.queryMap.regRefNo
        };
      } else {
        payload = {
          email: self.userCreationPayload().username,
          submissionId: self.productDetails().submissionId.value
        };
      }
      if ($("#emailVerification").css("display") === "none") {
        UserCreationModel.verifyEmail(ko.toJSON(payload)).done(function() {
          self.otpDevice("otpDevice4");
          $("#emailVerification").trigger("openModal");
        });
      } else {
        $("#emailVerification").trigger("closeModal");
        $("#otpSuccess").trigger("openModal");
      }
    };

    var showPassword = function() {
      $("#pwd").prop({
        type: "text"
      });
    };
    var hidePassword = function() {
      $("#pwd").prop({
        type: "password"
      });
    };
    self.showHide = function() {
      if (!self.pwshown()) {
        self.pwshown(true);
        showPassword();
      } else {
        self.pwshown(false);
        hidePassword();
      }
    };
    self.createMarketingConsentData = function(applicantId) {
      var marketingConsentData = {
        partyId: applicantId,
        emailContactAllowed: self.applicantDetails().primaryInfo.adConsent,
        smsContactAllowed: false,
        phoneContactAllowed: false,
        postalContactAllowed: self.applicantDetails().primaryInfo.adConsent,
        preferredFrequency: "MNT",
        informationSource: [{
          sourceName: "In_the_Press",
          sourceCode: "ITP"
        }]
      };
      return ko.toJSON(marketingConsentData);
    };

    /**
     * Function to start the application tracking - component
     * @function trackApplication
     * @memberOf UserCreationViewModel
     * @returns {void}
     */
    self.trackApplication = function() {
      if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
        rootParams.baseModel.switchPage({
          homeComponent: {
            component: "application-tracking-base",
            module: "application-tracking",
            query: {
              context: "index"
            }
          }
        }, true, true);
      } else {
        UserCreationModel.deleteSession().done(function() {
          rootParams.baseModel.switchPage({
            homeComponent: {
              component: "application-tracking-base",
              module: "application-tracking",
              query: {
                context: "index"
              }
            }
          }, true, true);
        });
      }
    };

    self.dispose = function() {
      self.updateEmail.dispose();
    };

  };
});
