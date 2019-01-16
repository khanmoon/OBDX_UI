define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/user-security-question",
    "framework/js/constants/constants",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation",
    "ojs/ojpagingcontrol",
    "ojs/ojknockout",
    "ojs/ojnavigationlist",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable"
], function (oj, ko, $, viewUserSecurityQuestionModel, ResourceBundle,Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = ResourceBundle;
        self.userSegment = Constants.userSegment;
        rootParams.baseModel.registerComponent("create-user-security-question", "user-security-question");
        rootParams.baseModel.registerComponent("edit-user-security-question", "user-security-question");
        if (rootParams.dashboard.userData.firstLoginFlowDone) {
            rootParams.dashboard.headerName(self.userSegment === "ADMIN" ? self.nls.userSecurityQuestion.headers.userSecurityQuestion : self.nls.userSecurityQuestion.headers.headerName);
        }
        self.questionList = ko.observableArray();
        self.userQuestionList = ko.observableArray();
        self.questionListMap = {};
        self.userQuestionListMap = {};
        self.isQuestionListLoaded = ko.observable(false);
        self.isUserQuestionListLoaded = ko.observable(false);
        self.showCreateScreen = ko.observable(false);
        self.noOfQuesToConfigure = ko.observable();
        self.back = function () {
            history.back();
        };
        var roles = rootParams.dashboard.userData.userProfile.roles;
        var userSegment;
        for (var k = 0; k < roles.length; k++) {
            if (roles[k] === "Administrator") {
                userSegment = "administrator.NO_QUE_ANS";
                break;
            } else if (roles[k] === "RetailUser") {
                userSegment = "retailuser.NO_QUE_ANS";
                break;
            } else if (roles[k] === "CorporateUser") {
                userSegment = "corporateuser.NO_QUE_ANS";
                break;
            }
        }
        viewUserSecurityQuestionModel.fetchQuestionConfiguration(userSegment).done(function (data) {
            self.noOfQuesToConfigure(data.noOfQuestions);
        });
        viewUserSecurityQuestionModel.fetchQuestions().done(function (data) {
            self.questionList(data.secQueList[0].secQueMapping);
            if (self.questionList().length === 0) {
                rootParams.baseModel.showMessages(null, [self.nls.userSecurityQuestion.labels.questionConfigErrorMsg], "ERROR");
            }
            for (var i = 0; i < self.questionList().length; i++) {
                self.questionListMap[self.questionList()[i].questionId] = self.questionList()[i].question;
            }
            self.isQuestionListLoaded(true);
        });
        viewUserSecurityQuestionModel.fetchUserQuestions().done(function (data) {
            self.userQuestionList(data.userSecurityQuestionDTOList);
            if (self.userQuestionList().length === 0) {
                self.showCreateScreen(true);
            } else {
                for (var i = 0; i < self.userQuestionList().length; i++)
                    self.userQuestionListMap[self.userQuestionList()[i].questionId] = self.userQuestionList()[i].answer;
            }
            self.isUserQuestionListLoaded(true);
        });
        self.openCreateMode = function () {
            rootParams.dashboard.loadComponent("create-user-security-question", {
                mode: "CREATE",
                data: self.noOfQuesToConfigure
            }, self);
        };
        self.showEditScreen = function () {
            rootParams.dashboard.loadComponent("edit-user-security-question", {
                mode: "EDIT",
                data: self.noOfQuesToConfigure
            }, self);
        };
    };
});