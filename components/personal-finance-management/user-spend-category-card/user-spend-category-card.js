define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/user-spend-category-card",
    "promise",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojbutton"
], function (oj, ko, $, Resource) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.cardData = ko.observable(Params.data);
        self.resource = Resource;
    };
});