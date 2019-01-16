define([
    "ojs/ojcore",
    "knockout",
    "ojL10n!resources/nls/help"
], function(oj, ko, resourceBundle) {
    "use strict";

    return function(rootParams) {
        var self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.transaction = null;
        self.loaded = ko.observable();

        var subscriber,
            langPrefix = oj.Config.getLocale() === "en" ? "" : (oj.Config.getLocale() + "/");

        if (!rootParams.baseModel.large()) {
            subscriber = rootParams.transaction.subscribe(function(value) {
                self.loaded(false);
                ko.tasks.runEarly();

                if (value) {
                    self.transaction = langPrefix + value;
                    self.loaded(true);
                }
            });
        } else {
            self.transaction = langPrefix + ko.utils.unwrapObservable(rootParams.transaction);
            self.loaded(true);
        }

        self.afterRender = function(nodeArray) {
            if (rootParams.isHelpAvailable && nodeArray.length) {
                rootParams.isHelpAvailable(true);
            }
        };

        self.dispose = function() {
            if (subscriber) {
                subscriber.dispose();
            }
        };
    };
});