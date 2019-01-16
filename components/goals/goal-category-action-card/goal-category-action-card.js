define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/goal-category-action-card"
], function (ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.data = {
            "title": self.nls[rootParams.data.card_text + "_title"],
            "image": rootParams.data.image,
            "description": "",
            "className": rootParams.data.card_text
        };
    };
});