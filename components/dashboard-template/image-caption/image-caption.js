define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/design-dashboard-component-name"
], function (oj, ko, $, nls) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.nls = nls;
        self.data = params.data;
    };
});