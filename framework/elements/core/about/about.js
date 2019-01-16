define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/about"
], function (oj, ko, $, Model, resourceBundle) {
    "use strict";
    return function (params) {
        var self = this;
        params.baseModel.registerElement("modal-window");
        self.obdx = ko.observable();
        self.nls = resourceBundle;
        Model.getAbout().then(function (data) {
            require(["text!/buildnum"], function (buildnum) {
                ko.utils.extend(data, { buildnum: buildnum.trim() });
                self.obdx(data);
            }, function () {
                self.obdx(data);
            });
        });
        self.showDialog = function () {
            $("#aboutBox").trigger("openModal");
        };
    };
});