define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/manage-category"
], function(oj, ko, $, ReviewCategoryModel,resourceBundle) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = resourceBundle;
        self.dataLoaded = ko.observable();
        self.categoryName = ko.observable();
        self.categoryDetails = ko.mapping.toJS(self.params.data);
        self.preview = ko.observable();
        self.loadImage = function () {
            $().ready(function () {
                if (self.preview()) {
                    $("#categoryIcon").attr("src", self.preview());
                }
            });
        };

        if(self.categoryDetails.name){
          self.categoryName(self.categoryDetails.name);
          if(self.categoryDetails.logo && self.categoryDetails.logo.value) {
              ReviewCategoryModel.retrieveImage(self.categoryDetails.logo.value).done(function (data) {
                  if (data && data.contentDTOList[0]) {
                      self.preview("data:image/gif;base64," + data.contentDTOList[0].content);
                      setTimeout(self.loadImage(), 1000);
                      self.dataLoaded(true);
                  }
              });
          }
        }else{
          ReviewCategoryModel.getCategoryDetails(self.categoryDetails.id).done(function (categoryData) {
              self.categoryName(categoryData.category.name);
              ReviewCategoryModel.retrieveImage(categoryData.category.logo.value).done(function (data) {
                  if (data && data.contentDTOList[0]) {
                      self.preview("data:image/gif;base64," + data.contentDTOList[0].content);
                      setTimeout(self.loadImage(), 1000);
                      self.dataLoaded(true);
                  }
              });
          });
        }
    };
});
