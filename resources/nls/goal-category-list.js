define(
    [],
    function() {
        "use strict";
        var GoalLocale = function() {
            return {
                root: {
                    goal: {
                        category: {
                            goalCode: "Category Code",
                            goalCategory: "Category Name",
                            searchTitle: "Goal Category Maintenance",
                            productType: "Product Type",
                            productCode: "Product Code",
                            product: "Product",
                            status: "Status",
                            obsolete: "Obsolete",
                            parentId: "Parent Id",
                            categoryId: "Category Id",
                            contentId: "Content Id",
                            list: "Category List Details",
                            statusArray: {
                                "ACT": "Active",
                                "DEL": "Deleted",
                                "EXP": "Expired"
                            }
                        }
                    },
                    common: {
                        create: "Create",
                        cancel: "Cancel",
                        clear: "Clear",
                        search: "Search"
                    }
                },
                ar: true,
                fr: true,
                cs: true,
                sv: true,
                en: false,
                "en-us": false,
                el: true
            };
        };
        return new GoalLocale();
    }
);