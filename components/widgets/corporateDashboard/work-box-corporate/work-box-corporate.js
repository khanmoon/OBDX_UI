define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/maker-work-box"
], function (ko, $, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.workData = rootParams;
        self.totalCount = 0;
        self.resource = ResourceBundle;
        $(self.workData.workCount).each(function (k, v) {
            self.totalCount = self.totalCount + parseInt(v.count);
        });
    };
});