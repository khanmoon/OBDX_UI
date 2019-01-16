define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "framework/js/constants/constants"
], function (oj, ko, $, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.dataLoaded = ko.observable(false);
        self.productComponentName = ko.observable();
        self.submissionIdExists = ko.observable(false);
        self.pluginCompName = ko.observable("row");
        self.productflowComponent = ko.observable(true);
        self.productHeadingName = ko.observable();

        self.hideBackButton = ko.observable(false);
        self.constants = Constants;
        self.productDetails = ko.observable({
            applicantList: ko.observableArray([]),
            baseCurrency: rootParams.baseModel.getLocaleValue("localCurrency"),
            applicantDetailsFetched: ko.observable(false),
            sectionBeingEdited: ko.observable(),
            collabData: ko.observable({}),
            isUserAssociated: false,
            isRegistered: false,
            repaymentAmount: ko.observable()
        });
        self.initQueryMap = function (root) {
            self.queryMap = root.queryMap;
            self.applicationArguments = root.applicationArguments;
        };
        rootParams.baseModel.registerComponent("product", "origination");
        self.dataLoaded(true);
    };
});
