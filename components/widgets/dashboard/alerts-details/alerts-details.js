define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojmenu",
    "promise",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojknockout",
    "ojs/ojswipetoreveal",

    "ojs/ojdialog",
    "ojs/ojknockout-validation"
], function (oj, ko, $, BaseLogger, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("action-widget");
        self.listItem = ko.observableArray(self.listItem());
        self.nls = ResourceBundle;
        self.removeSelected = function (index) {
            self.listItem.splice(index, 1);
            ko.tasks.runEarly();
            $("#listview").ojListView("refresh");
        };
        this.handleReady = function () {
            $("#listview").find(".item-marker").each(function () {
                var id = $(this).prop("id");
                var startOffcanvas = $(this).find(".oj-offcanvas-start").first();
                var endOffcanvas = $(this).find(".oj-offcanvas-end").first();
                oj.SwipeToRevealUtils.setupSwipeActions(startOffcanvas);
                oj.SwipeToRevealUtils.setupSwipeActions(endOffcanvas);
                endOffcanvas.off("ojdefaultaction");
                endOffcanvas.on("ojdefaultaction", function () {
                    self.handleDefaultAction({ "id": id });
                });
            });
        };
        this.handleDestroy = function () {
            $("#listview").find(".item-marker").each(function () {
                var startOffcanvas = $(this).find(".oj-offcanvas-start").first();
                var endOffcanvas = $(this).find(".oj-offcanvas-end").first();
                oj.SwipeToRevealUtils.tearDownSwipeActions(startOffcanvas);
                oj.SwipeToRevealUtils.tearDownSwipeActions(endOffcanvas);
            });
        };
        this.handleMenuItemSelect = function (event, ui) {
            var id = ui.item.prop("id");
            if (id === "delete") {
                self.handleTrash();
            }
        };
        this.closeToolbar = function (which, item) {
            var toolbarId = "#" + which + "_toolbar_" + item.prop("id");
            var drawer = {
                "displayMode": "push",
                "selector": toolbarId
            };
            oj.OffcanvasUtils.close(drawer);
        };
        this.handleAction = function (which, action, model) {
            if (model !== null && model.id) {
                if (action !== "default") {
                    self.closeToolbar(which, $(model));
                }
            }
        };
        this.handleTrash = function (model) {
            self.handleAction("second", "trash", model);
        };
        this.handleDefaultAction = function (model) {
            self.handleAction("second", "default", model);
            self.removeModel(model);
        };
        this.removeModel = function (model) {
            var item = $("#" + model.id);
            var startOffcanvas = item.find(".oj-offcanvas-start").first();
            var endOffcanvas = item.find(".oj-offcanvas-end").first();
            oj.SwipeToRevealUtils.tearDownSwipeActions(startOffcanvas);
            oj.SwipeToRevealUtils.tearDownSwipeActions(endOffcanvas);
            self.listItem.remove(function (item) {
                return item.id === model.id;
            });
        };
    };
});