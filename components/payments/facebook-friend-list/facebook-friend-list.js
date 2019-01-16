define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "ojL10n!resources/nls/facebook-friend-list",
    "ojs/ojinputtext",
    "ojs/ojlistview",
    "ojs/ojjsontreedatasource",
    "ojs/ojcollectiontabledatasource",
    "ojs/ojradioset",
    "ojs/ojbutton"
], function(oj, ko, $, BaseLogger, resourceBundle) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        if (!self.params.dataList)
            throw new Error();
        self.Nls = resourceBundle;
        self.dataList = ko.utils.unwrapObservable(self.params.dataList);
        self.selectedValue = self.params.selectedValue || ko.observable();
        rootParams.dashboard.headerName(self.Nls.header || "");
        self.convertData = function(data) {
            var arr = data;
            arr.sort(function(a, b) {
                if (a.name < b.name)
                    return -1;
                if (a.name > b.name)
                    return 1;
                return 0;
            });
            var sortedData = [];
            var current;
            for (var i = 0; i < arr.length; i++) {
                var char = arr[i].name.substring(0, 1).toUpperCase();
                if (!current || current.attr.id !== char) {
                    current = {
                        "attr": { "id": char },
                        "children": []
                    };
                    sortedData.push(current);
                }
                current.children.push({
                    "attr": {
                        "id": arr[i].id,
                        "name": arr[i].name,
                        "picture": arr[i].picture.data.url
                    }
                });
            }
            return sortedData;
        };
        self.dataList = self.convertData(self.dataList);
        self.contactDataSource = new oj.JsonTreeDataSource(self.dataList);
        self.filter = ko.observable("");
        self.dataSource = ko.observable(self.contactDataSource);
        self.flattenJSON = function(data) {
            var collection = new oj.Collection();
            for (var i = 0; i < data.length; i++) {
                var children = data[i].children;
                if (children !== null && children.length > 0) {
                    for (var j = 0; j < children.length; j++) {
                        collection.add(children[j].attr);
                    }
                }
            }
            return collection;
        };
        self.nameFilter = function(model, attr, value) {
            var name = model.get("name");
            return name.toLowerCase().indexOf(value.toLowerCase()) > -1;
        };
        self.handleKeyUp = function(event) {
            var filter = event.detail.value;
            if (filter.length === 0) {
                if (self.dataSource() === self.filteredDataSource)
                    self.dataSource(self.contactDataSource);
            } else {
                if (self.filteredDataSource === undefined) {
                    self.collection = self.flattenJSON(self.dataList);
                    self.filteredCollection = self.collection.clone();
                    self.filteredDataSource = new oj.CollectionTableDataSource(self.filteredCollection);
                }
                var ret = self.collection.where({
                    name: {
                        value: filter,
                        comparator: self.nameFilter
                    }
                });
                self.filteredCollection.reset(ret);
                if (self.dataSource() === self.contactDataSource)
                    self.dataSource(self.filteredDataSource);
            }
        };
        self.itemOnly = function(context) {
            if (context.leaf === undefined) {
                return true;
            }
            return context.leaf;
        };
        self.renderer = function(context) {
            var leaf = context.leaf === undefined ? true : context.leaf;
            var renderer = oj.KnockoutTemplateUtils.getRenderer(leaf ? "item_template" : "group_template", true);
            return renderer.call(this, context);
        };
        self.selectContact = function(event, data) {
            self.selectedValue(data.id);
            history.back();
        };
    };
});