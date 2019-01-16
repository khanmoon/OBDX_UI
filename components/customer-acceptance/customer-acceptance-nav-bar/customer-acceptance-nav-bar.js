define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/discrepancies",
    "ojs/ojnavigationlist",
    "ojs/ojaccordion",
    "ojs/ojcollapsible",
    "ojs/ojvalidation",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojknockout-validation",
    "ojs/ojdatetimepicker",
    "ojs/ojcheckboxset",
    "ojs/ojselectcombobox",
    "ojs/ojcube",
    "ojs/ojdatagrid",
    "ojs/ojswitch",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingdatagriddatasource"
], function (ko, $, resourceBundle) {
    "use strict";
    var vm = function (params) {
        var self = this;
        self.menuSelection = ko.observable("DISCREPANCIES");

        ko.utils.extend(self, params.rootModel);

        self.resourceBundle = resourceBundle;
        params.baseModel.registerElement("nav-bar");
        params.baseModel.registerComponent("export-amendment", "customer-acceptance");
        params.baseModel.registerComponent("discrepancies", "customer-acceptance");

        self.menuOptions = ko.observable([{
            id: "DISCREPANCIES",
            label: self.resourceBundle.navLabels.discrepancies
          },{
            id: "AMENDMENT",
            label: self.resourceBundle.navLabels.amendment
          }
        ]);
        self.uiOptions = {
            "menuFloat": "left",
            "fullWidth": false,
            "defaultOption": self.menuSelection
        };
        self.menuSelectionSubscribe = self.menuSelection.subscribe(function (newValue) {
            if (newValue === "DISCREPANCIES") {
                params.dashboard.loadComponent("discrepancies", {}, self);
            } else if (newValue === "AMENDMENT") {
                params.dashboard.loadComponent("export-amendment", {}, self);
            }
        });
    };
    vm.prototype.dispose = function () {
        this.menuSelectionSubscribe.dispose();
    };
    return vm;
});
