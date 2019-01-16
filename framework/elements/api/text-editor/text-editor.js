define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "thirdPartyLibs/ckeditor/ckeditor",
    "ojs/ojknockout"
], function (oj, ko, $) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.fieldId = rootParams.id;
        self.label = rootParams.label;
        var subcription1, subcription2;
        self.txtBoxId = rootParams.baseModel.incrementIdCount();
        if (!self.label) {
            throw new Error("PASS_MEANINGFUL_LABEL_TO_THE_COMPONENT");
        }
        self.containerClass = rootParams.containerClass;
        self.editorData = rootParams.data;
        self.validationRequired = false;
        if (rootParams.validator) {
            self.validationTracker = rootParams.validator;
            self.validationRequired = true;
        }
        self.initializeEditor = function () {
            var editor = window.CKEDITOR.replace(rootParams.id, {
                extraPlugins: "divarea",
                on: {
                    instanceReady: function () {
                        this.dataProcessor.writer.setRules("p", {
                            indent: false,
                            breakBeforeOpen: true,
                            breakAfterOpen: false,
                            breakBeforeClose: false,
                            breakAfterClose: false
                        });
                    }
                }
            });
            editor.on("change", function (evt) {
                self.editorData(evt.editor.getData().replace(/&nbsp;/g, " "));
            });
            if (self.editorData()) {
                window.CKEDITOR.instances[rootParams.id].setData(self.editorData());
            }
            subcription1 = self.editorData.subscribe(function (newValue) {
                if (newValue.length) {
                    $("#" + rootParams.id).parent().parent().removeClass("text-input__required");
                }
            });
        };
        window.CKEDITOR.config.height = rootParams.height;
        if (rootParams.copyTxt) {
            self.copyTxt = rootParams.copyTxt;
            subcription2 = self.copyTxt.subscribe(function (newValue) {
                window.CKEDITOR.instances[rootParams.id].setData(newValue);
            });
        }
        self.dispose = function () {
            if (subcription1) {
                subcription1.dispose();
            }
            if (subcription2) {
                subcription2.dispose();
            }
        };
        self.validate = function () {
            if (!$("#" + self.txtBoxId).ojInputText("validate")) {
                $("#" + rootParams.id).parent().parent().addClass("text-input__required");
            } else {
                $("#" + rootParams.id).parent().parent().removeClass("text-input__required");
            }
        };
        rootParams.validate(self.validate);
    };
});
