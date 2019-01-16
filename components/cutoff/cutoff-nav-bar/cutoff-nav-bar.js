define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "ojL10n!resources/nls/transaction-cutoff",
    "ojs/ojinputtext",
    "ojs/ojnavigationlist"
], function (oj, ko, $, BaseLogger, resourceBundle) {
    "use strict";
    var vm = function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.baseModel.registerElement("nav-bar");
        self.uiOptions = {
            "menuFloat": "left",
            "fullWidth": false,
            "defaultOption": self.menuSelection
        };
        self.menuSubscribe = self.menuSelection.subscribe(function (newValue) {
            if (newValue === "STANDARD") {
                rootParams.dashboard.loadComponent("standard-work-window", {}, self);
            } else if (newValue === "EXCEPTION") {
                rootParams.dashboard.loadComponent("cutoff-exceptions", {}, self);
            }
        });
        if (rootParams.disableNav) {
            if (rootParams.type === "STANDARD") {
                self.menuOptions = ko.observable([
                    {
                        id: "STANDARD",
                        label: self.nls.labels.standardWorkingWindow,
                        disabled: false
                    },
                    {
                        id: "EXCEPTION",
                        label: self.nls.labels.exceptionWindow,
                        disabled: true
                    }
                ]);
            }
            if (rootParams.type === "Exception Window") {
                self.menuOptions = ko.observable([
                    {
                        id: "STANDARD",
                        label: self.nls.labels.standardWorkingWindow,
                        disabled: true
                    },
                    {
                        id: "EXCEPTION",
                        label: self.nls.labels.exceptionWindow,
                        disabled: false
                    }
                ]);
            }
        } else {
            self.menuOptions = ko.observable([
                {
                    id: "STANDARD",
                    label: self.nls.labels.standardWorkingWindow,
                    disabled: false
                },
                {
                    id: "EXCEPTION",
                    label: self.nls.labels.exceptionWindow,
                    disabled: false
                }
            ]);
        }
    };
    vm.prototype.dispose = function () {
        this.menuSubscribe.dispose();
    };
    return vm;
});
