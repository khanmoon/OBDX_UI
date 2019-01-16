define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "ojL10n!resources/nls/letter-of-credit-search",
    "ojs/ojnavigationlist",
    "ojs/ojradioset"
], function (oj, ko, $, BaseLogger, resourceBundle) {
    "use strict";
    var vm = function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resourceBundle = resourceBundle;
        rootParams.baseModel.registerElement("nav-bar");
        rootParams.baseModel.registerComponent("initiate-lc", "letter-of-credit");
        rootParams.baseModel.registerComponent("template-list", "letter-of-credit");
        rootParams.baseModel.registerComponent("draft-list", "letter-of-credit");
        self.mode = ko.observable();
        self.menuOptions = ko.observable([{
            id: "TEMPLATES",
            label: self.resourceBundle.navLabels.template
          },{
            id: "DRAFTS",
            label: self.resourceBundle.navLabels.drafts
          }
        ]);
        if (!self.menuSelection) {
            self.menuSelection = ko.observable("TEMPLATES");
        }
        if (!self.compName) {
            self.compName = ko.observable("template-list");
        }
        self.uiOptions = {
            "menuFloat": "left",
            "fullWidth": false,
            "defaultOption": self.menuSelection
        };
        self.menuSelectionSubscribe = self.menuSelection.subscribe(function (newValue) {
            if (newValue === "TEMPLATES") {
                self.compName("template-list");
            } else if (newValue === "DRAFTS") {
                self.compName("draft-list");
            }
        });
        self.create = function () {
            self.mode("CREATE");
            rootParams.dashboard.loadComponent("initiate-lc", {}, self);
        };
    };
    vm.prototype.dispose = function () {
        this.menuSelectionSubscribe.dispose();
    };
    return vm;
});
