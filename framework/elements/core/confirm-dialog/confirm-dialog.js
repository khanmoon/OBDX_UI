define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/confirm-dialog",
    "ojs/ojbutton"
], function (oj, ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resourceBundle = resourceBundle;
        self.yes = function () {
            ko.removeNode($("#confirm-dialog")[0]);
            if (self.onYes) {
                self.onYes();
            }
        };
        self.no = function () {
            if (self.onNo) {
                self.onNo();
            }
            ko.removeNode($("#confirm-dialog")[0]);
        };
        self.showDialog = function () {
            $("#confirm-dialog").trigger("openModal");
        };
        $(document).keydown(function (event) {
            if (event.keyCode === 27) {
                event.preventDefault();
                self.no();
            }
        });
    };
});