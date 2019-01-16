define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/search-box",
    "ojs/ojselectcombobox",
    "ojs/ojnavigationlist"
], function (oj, ko, $, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        self.value = rootParams.value;
        self.nls = resourceBundle;
        self.dataSource = rootParams.data ? rootParams.data.getWrappedDataSource ? rootParams.data.getWrappedDataSource() : rootParams.data : null;
        var originalDataSource = ko.utils.unwrapObservable(self.dataSource ? self.dataSource.data : "");
        self.searchby = rootParams.searchBy;
        var idAttributes = self.dataSource && self.dataSource.options ? self.dataSource.options.idAttribute : null;
        self.array = rootParams.arrayReference;
        self.refresh = rootParams.refreshReference;
        var searchFields = rootParams.searchFields;
        var originalArray = ko.utils.unwrapObservable(rootParams.arrayReference);
        var filteredArray;
        self.valueChangeHandler = function (event) {
            if (self.dataSource) {
                if (event.detail.value) {
                    filteredArray = $.grep(originalDataSource, function (v) {
                        for (var i = 0; i < searchFields.length; i++) {
                            if (v[searchFields[i]] && event.detail.value) {
                                var searchValue = "";
                                if (event.detail.value instanceof Array && event.detail.value.length > 0) {
                                    searchValue = event.detail.value[0];
                                } else if (event.detail.value.length > 0) {
                                    searchValue = event.detail.value;
                                }
                                if (v[searchFields[i]].toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
                                    return true;
                                }
                            }
                        }
                    });
                    self.dataSource.reset(filteredArray, { idAttribute: idAttributes });
                } else {
                    self.dataSource.reset(originalDataSource, { idAttribute: idAttributes });
                }
            } else if (self.array()) {
                if (event.detail.value) {
                    self.refresh(false);
                    filteredArray = $.grep(originalArray, function (v) {
                        for (var i = 0; i < searchFields.length; i++) {
                            if (v[searchFields[i]] && event.detail.value) {
                                var searchValue = "";
                                if (event.detail.value instanceof Array && event.detail.value.length > 0) {
                                    searchValue = event.detail.value[0];
                                } else if (event.detail.value.length > 0) {
                                    searchValue = event.detail.value;
                                }
                                if (v[searchFields[i]].toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
                                    return true;
                                }
                            }
                        }
                    });
                    self.array(filteredArray);
                    ko.tasks.runEarly();
                    self.refresh(true);
                } else {
                    self.refresh(false);
                    self.array(originalArray);
                    ko.tasks.runEarly();
                    self.refresh(true);
                }
            }
        };
    };
});
