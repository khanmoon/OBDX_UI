define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",
    "ojL10n!resources/nls/list-mail-categories",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojpopup"
], function (oj, ko, $, BaseLogger, ListMailCategoriesModel, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.categoryDTOArray = ko.observableArray();
        var categoryChildLength = 0;
        ko.utils.arrayForEach(self.categoryOptionList(), function (categoaryChild) {
            ko.utils.arrayForEach(categoaryChild.children, function () {
                categoryChildLength++;
            });
        });
        self.areAllOptionsOfCategorySelected = function (data) {
            var FOUND_FLAG = 0;
            ko.utils.arrayForEach(data.children, function (item) {
                if (self.selectedSubjectIds().indexOf(item.value) < 0) {
                    FOUND_FLAG = 1;
                }
            });
            if (FOUND_FLAG === 0) {
                return true;
            }
                return false;

        };
        if ((self.selectedSubjectIds().length > 0 && self.selectedSubjectIds().length === categoryChildLength) || (self.updateMode() && self.subjectCount() === self.subjectSelectionCount())) {
            self.areAllOptionsSelected(true);
        } else {
            self.areAllOptionsSelected(false);
        }
        self.parseCategoryData = function (data) {
            ko.utils.arrayForEach(data, function (item) {
                self.categoryOption = {
                    "name": "",
                    "categoryId": "",
                    "children": [],
                    "nameid": ""
                };
                self.categoryOption.name = item.name;
                var childrenId = self.categoryOption.name.split(" ");
                var temp = "";
                for (var i = 0; i < childrenId.length; i++)
                    temp = temp + childrenId[i];
                self.categoryOption.nameid = temp;
                self.categoryOption.categoryId = item.categoryId;
                if (item.subjects.length > 0) {
                    ko.utils.arrayForEach(item.subjects, function (thisItem) {
                        self.categoryOptionChild = {
                            "value": "",
                            "name": "",
                            "subjectMapId": "",
                            "version": ""
                        };
                        self.categoryOptionChild.value = thisItem.subjectId;
                        self.categoryOptionChild.name = thisItem.subject;
                        self.categoryOptionChild.subjectMapId = thisItem.subjectMapId;
                        self.categoryOptionChild.version = thisItem.version;
                        self.categoryOption.children.push(self.categoryOptionChild);
                    });
                    self.categoryOptionList.push(self.categoryOption);
                }
            });
            self.mailCategoriesListLoaded(true);
        };
        self.fetchMailCategories = function () {
            ListMailCategoriesModel.fetchCategoryOptions().done(function (data) {
                if (data.mailCategoryDTOs) {
                    self.parseCategoryData(data.mailCategoryDTOs);
                }
            });
        };
        self.readMapping = function () {
            ListMailCategoriesModel.readMapping(self.mappingId()).done(function (data) {
                if (data.userGroupSubjectMapDTO) {
                    ko.utils.arrayForEach(data.userGroupSubjectMapDTO.subjects, function (item) {
                        var categoryDTO = {
                            "categoryId": "",
                            "name": "",
                            "subjects": []
                        };
                        categoryDTO.categoryId = item.subjectDTO.mailCategoryDTO.categoryId;
                        categoryDTO.name = item.subjectDTO.mailCategoryDTO.name;
                        if (!(self.categoryDTOArray().filter(function (e) {
                                return e.categoryId === item.subjectDTO.mailCategoryDTO.categoryId;
                            }).length > 0)) {
                            self.categoryDTOArray.push(categoryDTO);
                        }
                        if (item.selectionStatus === true)
                            self.selectedSubjectIds.push(item.subjectDTO.subjectId);
                    });
                    ko.utils.arrayForEach(data.userGroupSubjectMapDTO.subjects, function (subjectItem) {
                        ko.utils.arrayForEach(self.categoryDTOArray(), function (categoryItem) {
                            if (categoryItem.categoryId === subjectItem.subjectDTO.mailCategoryDTO.categoryId) {
                                var nestedSubjectDTO = {
                                    subject: "",
                                    subjectId: "",
                                    userGroupId: "",
                                    subjectMapId: "",
                                    version: ""
                                };
                                nestedSubjectDTO.subject = subjectItem.subjectDTO.subject;
                                nestedSubjectDTO.subjectId = subjectItem.subjectDTO.subjectId;
                                nestedSubjectDTO.userGroupId = subjectItem.subjectDTO.userGroupId;
                                nestedSubjectDTO.subjectMapId = subjectItem.subjectMapId;
                                nestedSubjectDTO.version = subjectItem.version;
                                categoryItem.subjects.push(nestedSubjectDTO);
                                if (!(self.mailCategoryDTOs().filter(function (e) {
                                        return e.categoryId === categoryItem.categoryId;
                                    }).length > 0)) {
                                    self.mailCategoryDTOs.push(categoryItem);
                                }
                            }
                        });
                    });
                }
                self.parseCategoryData(self.mailCategoryDTOs());
            });
        };
        if (self.approval()) {
            self.parseCategoryData(self.mailCategoryDTOs());
            var FOUND_FLAG = 0;
            ko.utils.arrayForEach(self.categoryOptionList(), function (item) {
                ko.utils.arrayForEach(item.children, function (childItem) {
                    if (self.selectedSubjectIds().indexOf(childItem.value) < 0) {
                        FOUND_FLAG = 1;
                    }
                });
            });
            if (FOUND_FLAG === 0) {
                self.areAllOptionsSelected(true);
            } else {
                self.areAllOptionsSelected(false);
            }
        } else if (self.createMode())
                self.fetchMailCategories();
            else if (self.updateMode())
                self.readMapping();
        var isParentChecked;
        $.extend($.expr[":"], {
            unchecked: function (obj) {
                return (obj.type === "checkbox" || obj.type === "radio") && !$(obj).is(":checked");
            }
        });
        $(document).on("change", "#tree input:checkbox", function () {
            var currentContext = this;
            var a = $(this).next("label").next("ul").find("input:checkbox");
            if ($(this).prop("checked") === true) {
                $(this).addClass("oj-selected");
                isParentChecked = true;
            } else {
                $(this).removeClass("oj-selected");
                isParentChecked = false;
            }
            $(a).each(function () {
                if (isParentChecked === true) {
                    if ($(this).prop("checked") === false) {
                        $(this).trigger("click");
                    }
                } else if ($(this).prop("checked") === true) {
                        $(this).trigger("click");
                    }
            });
            for (var i = $("#tree").first("ul").length; i >= 0; i--) {
                $("#tree").find("ul:eq(" + i + ")").prev("label").prev("input:checkbox").prop("checked", function () {
                    if ($(this).next("label").next("ul").find("input:unchecked").length === 0) {
                        $(this).addClass("oj-selected");
                    } else {
                        $(this).removeClass("oj-selected");
                    }
                    return $(this).next("label").next("ul").find("input:unchecked").length === 0;
                });
            }
            $(currentContext).parent().parent().prev("label").prev("input:checkbox").prop("checked", function () {
                if ($(this).next("label").next("ul").find("input:unchecked").length === 0) {
                    $(this).addClass("oj-selected");
                } else {
                    $(this).removeClass("oj-selected");
                }
                return $(this).next("label").next("ul").find("input:unchecked").length === 0;
            });
            $(currentContext).parent().parent().parent().parent().prev("label").prev("input:checkbox").prop("checked", function () {
                if ($(this).next("label").next("ul").find("input:unchecked").length === 0) {
                    $(this).addClass("oj-selected");
                } else {
                    $(this).removeClass("oj-selected");
                }
                return $(this).next("label").next("ul").find("input:unchecked").length === 0;
            });
        });
    };
});