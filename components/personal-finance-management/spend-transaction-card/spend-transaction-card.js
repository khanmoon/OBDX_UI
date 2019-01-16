define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/spend-transaction-card",
    "promise",
    "ojs/ojmenu",
    "ojs/ojoption"
], function(oj, ko, $, ResourceBundle) {
    "use strict";
    return function(Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.cardData = ko.observable(Params.data);
        self.resource = ResourceBundle;
        self.selectedMenuItem = ko.observable();
        self.modifyOptions = ko.observableArray([{
                option: self.resource.categorizedTransaction.recategorize,
                value: "recategorize"
            },
            {
                option: self.resource.categorizedTransaction.split,
                value: "split"
            }
        ]);
        self.launchMenu = function(data,event) {
            document.getElementById("transactionModifyMenu" + data.transactionId + data.subSequenceId + "-container").open(event);
        };
        self.optionchangeHandler = function(event) {
            self.selectedMenuItem(event.target.value);
            if (self.selectedMenuItem() === "recategorize") {
                self.recategorize(self.cardData());
            } else if (self.selectedMenuItem() === "split") {
                self.split(self.cardData());
            }
        };
    };
});