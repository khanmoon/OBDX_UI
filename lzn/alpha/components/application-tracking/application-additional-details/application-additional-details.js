define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!lzn/alpha/resources/nls/application-additional-details"
], function (oj, ko, $, AdditionalInfoModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, index = 0;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.headingText(self.resource.additionalInfo);
        self.showComponents = ko.observable(false);
        AdditionalInfoModel.fetchComponents().done(function (data) {
            self.uplTrackingDetails().additionalInfo.sections = data.sections;
            for (index = 0; index < self.uplTrackingDetails().additionalInfo.sections.length; index++) {
                self.uplTrackingDetails().additionalInfo.sections[index].isComplete = ko.observable(self.uplTrackingDetails().additionalInfo.sections[index].isComplete);
            }
            for (index = 0; index < self.uplTrackingDetails().additionalInfo.sections.length; index++) {
                rootParams.baseModel.registerComponent(self.uplTrackingDetails().additionalInfo.sections[index].component, "application-tracking");
            }
            setTimeout(function () {
                self.additionalInfoAccordion($("#addtionalInfoAccordion").paperAccordion({
                    disableOthers: true,
                    zoom: false
                }));
                self.additionalInfoAccordion().enableAll();
            }, 100);
            self.showComponents(true);
        });
    };
});
