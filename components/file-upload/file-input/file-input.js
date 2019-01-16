define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/upload-file",
    "ojs/ojknockout"
], function (oj, ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle;
        self.id = ko.observable(rootParams.id);
        $(".input-file").each(function () {
            var $input = $(this), $label = $input.next("label");
            $input.on("change", function (e) {
                var fileName = "";
                if (this.files && this.files.length > 1) {
                    fileName = rootParams.baseModel.format(self.Nls.fileUpload.noOfFileSelected, { count: this.files.length });
                } else if (e.target.value) {
                    fileName = e.target.value.split("\\").pop();
                }
                if (fileName) {
                    $label.html(fileName);
                } else {
                    $label.html(self.Nls.generic.common.fileInput.chooseFile);
                }
            });
            $input.on("focus", function () {
                $input.addClass("has-focus");
            }).on("blur", function () {
                $input.removeClass("has-focus");
            });
        });
    };
});
