define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/guarantee-list",
    "ojs/ojnavigationlist",
    "ojs/ojradioset"
], function (ko, $, resourceBundle) {
    "use strict";
    var vm = function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = resourceBundle;
        params.baseModel.registerElement("nav-bar");
        params.baseModel.registerComponent("guarantee-filters", "guarantee");
        self.menuSelection = ko.observable();
        self.menuOptions = ko.observable([{
            id: "TEMPLATES",
            label: self.resourceBundle.navLabels.template
          },{
            id: "DRAFTS",
            label: self.resourceBundle.navLabels.drafts
          }
        ]);
        self.uiOptions = {
            "menuFloat": "left",
            "fullWidth": false,
            "defaultOption": self.menuSelection
        };
        self.menuSelectionSubscribe = self.menuSelection.subscribe(function (newValue) {
            self.setComponentId(newValue);
        });
        if (!self.componentId()) {
            self.menuSelection(self.resourceBundle.navLabels.template);
        } else {
            self.menuSelection(self.componentId());
        }
        self.create = function () {
            self.mode("CREATE");
            params.dashboard.loadComponent("initiate-guarantee", {}, self);
        };
    };
    vm.prototype.dispose = function () {
        this.menuSelectionSubscribe.dispose();
    };
    return vm;
});
