define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/td-list",
    "ojs/ojfilmstrip"
], function (ko, $, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.dashboard.headerName(self.resource.cardDetails.closedDeposit);
        self.tdCards = ko.observable([]);
        self.cardObject = ko.observable();
        self.cardDetailsFetched = ko.observable(false);
        self.loadDetails = function (parent, componentName, params, context) {
            rootParams.dashboard.loadComponent(componentName, params, context);
        };
        rootParams.baseModel.registerComponent("td-details", "term-deposits");
        self.image = "term-deposits/closed-cards.svg";
        self.currentNavArrowPlacement = ko.observable("adjacent");
        self.currentNavArrowVisibility = ko.observable("auto");
        self.dataFetched = ko.observable(false);
        self.getItemInitialDisplay = function (index) {
            return index < 3 ? "" : "none";
        };
        rootParams.baseModel.registerElement("card");
        self.getPartyName = function (parties) {
            var partyname = "";
            for (var i = 0; i < parties.length; i++) {
                partyname += parties[i].partyName;
                if (i !== parties.length - 1) {
                    partyname += "/";
                }
            }
            return partyname;
        };
        self.toggleClose = function () {
            self.displayTransaction(false);
        };
        self.tdCards(rootParams.rootModel.accounts());
        if (self.tdCards().length > 0) {
            self.cardDetailsFetched(true);
        }
        if (self.data !== null || self.data !== "") {
            self.dataFetched(true);
        }
    };
});