define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/statements"
], function (ko, $, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = ResourceBundle;
        self.statementData = rootParams.data.data;
        self.cardData = {
            title: self.locale.statements.card_title,
            linkText: self.locale.statements.card_viewall,
            description: self.locale.statements.description
        };
        self.count = ko.observable();
        rootParams.baseModel.registerComponent("account-activity", "accounts");
        rootParams.baseModel.registerElement("object-card");
    };
});