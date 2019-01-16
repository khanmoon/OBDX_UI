define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/list-collection",
    "ojs/ojnavigationlist",
    "ojs/ojradioset"
], function (ko, $, resourceBundle) {
    "use strict";
    var vm = function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resourceBundle = resourceBundle;
        rootParams.baseModel.registerElement("nav-bar");
        rootParams.baseModel.registerComponent("initiate-collection", "collection");
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
            self.menuSelection("TEMPLATES");
        } else {
            self.menuSelection(self.componentId());
        }
        self.create = function () {
            var parameters = { mode: "CREATE" };
            rootParams.dashboard.loadComponent("initiate-collection", parameters, self);
        };
    };
    vm.prototype.dispose = function () {
        this.menuSelectionSubscribe.dispose();
    };
    return vm;
});
