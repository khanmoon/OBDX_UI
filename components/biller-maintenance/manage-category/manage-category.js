define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/manage-category",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojknockout",
    "ojs/ojlistviewdnd",
    "ojs/ojjsontreedatasource",
    "ojs/ojavatar",
    "ojs/ojvalidationgroup"
], function(oj, ko, $, ManageCategoryModel, resourceBundle) {
    "use strict";
    return function (params) {
      var self = this;
       ko.utils.extend(self, params.rootModel);
       self.mode = ko.observable();
        var getNewKoModel = function () {
            var KoModel = ManageCategoryModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.groupValid = ko.observable();
        self.reorderEnable = ko.observable("enabled");
        self.priorityUpdated = ko.observable(false);
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.categoryDetails = self.rootModelInstance().CategoryDetails;
        self.resourceBundle = resourceBundle;
        params.dashboard.headerName(self.resourceBundle.heading.manageCategory);
        self.billerCategoryList = ko.observableArray([]);
        self.categoryDataSource = ko.observable();
        self.dataSourceCreated = ko.observable(false);
        self.billerCategoryArray = ko.observableArray();
        self.initialArray = [];
        var contentMap = {};
        self.file = ko.observable();
        self.isImageExist = ko.observable(false);
        self.preview = ko.observable();
        self.scroll = ko.observable(false);
        self.imageId1 =ko.observable(self.resourceBundle.labels.imageId1);
        self.fileId1 = ko.observable(self.resourceBundle.labels.fileId1);
        self.template = ko.observable("image-upload/category");
        self.categoryId = ko.observable();
        self.successMessage = ko.observable();
        self.newCategoryCreated = ko.observable(false);
        params.baseModel.registerComponent("image-upload", "goals");
        self.transactionID = ko.observable();
        self.status = ko.observable();
        self.renderer = function(context) {
          var renderer = oj.KnockoutTemplateUtils.getRenderer("category_icons", true);
          return renderer.call(this, context);
        };
        var payLoad = { batchDetailRequestList: [] };
          ManageCategoryModel.fetchCategory().done(function (data) {
              for (var i = 0; i < data.categoryDTOs.length; i++) {
                if (data.categoryDTOs[i].logo.value) {
                    var id;
                    if (data.categoryDTOs[i].logo.value) {
                        id = data.categoryDTOs[i].logo.value;
                        var contentURL = {
                            value: "/contents/{id}",
                            params: { "id": id }
                        };
                        var obj = {
                            methodType: "GET",
                            uri: contentURL,
                            headers: {
                                "Content-Id": i + 1,
                                "Content-Type": "application/json"
                            }
                        };
                        payLoad.batchDetailRequestList.push(obj);
                    }
                }
              }
              if (data.categoryDTOs.length > 0) {
                ManageCategoryModel.fireBatch(payLoad).done(function (batchData) {
                    if (batchData && batchData.batchDetailResponseDTOList) {
                        for (var j = 0; j < batchData.batchDetailResponseDTOList.length; j++) {
                            var batchResponse = JSON.parse(batchData.batchDetailResponseDTOList[j].responseText);
                            if (batchResponse.contentDTOList) {
                                if(batchResponse.contentDTOList[0].contentId)
                                  contentMap[batchResponse.contentDTOList[0].contentId.value] = batchResponse.contentDTOList[0].content;
                            }
                        }
                    }
                    for (var i = 0; i < data.categoryDTOs.length; i++) {
                        if (data.categoryDTOs[i].logo.value) {
                            if (data.categoryDTOs[i].logo.value) {
                                data.categoryDTOs[i].logo.id = data.categoryDTOs[i].logo.value;
                                data.categoryDTOs[i].logo.value = contentMap[data.categoryDTOs[i].logo.value];
                            }
                        }
                    }
                    self.initializeArray(data);
                }).fail(function() {
                  self.initializeArray(data);
                });
              } else {
                  self.dataSourceCreated(true);
              }
          });

          self.initializeArray = function(data) {
            var categorydata = data.categoryDTOs;
            var array = $.map(categorydata, function (u) {
                var obj = {"attr": {
                    "initials" : oj.IntlConverterUtils.getInitials(u.name),
                    "billerCategoryName": ko.observable(u.name),
                    "mappedBillers": ko.observable(u.billerCount),
                    "billerCategoryLogo": u.logo.value ? ko.observable("data:image/gif;base64,"+u.logo.value) : ko.observable(),
                    "contentId": ko.observable(u.logo.id),
                    "mode": ko.observable("LIST"),
                    "categoryId": ko.observable(u.id)
                }};
                return obj;
            });
            self.initialArray = $.map(categorydata, function (u) {
                var obj = {"attr": {
                    "initials" : oj.IntlConverterUtils.getInitials(u.name),
                    "billerCategoryName": u.name,
                    "mappedBillers": u.billerCount,
                    "billerCategoryLogo": u.logo.value ? "data:image/gif;base64,"+u.logo.value : null,
                    "contentId": u.logo.id,
                    "mode": "LIST",
                    "categoryId": u.id
                }};
                return obj;
            });
            self.billerCategoryArray(array);
            self.categoryDataSource(new oj.JsonTreeDataSource(self.billerCategoryArray()));
            self.dataSourceCreated(true);
          };

          self.handleMoveSuccess = function() {
            var listview = document.getElementById("listview");
            listview.refresh();

            // restore focus on current item (should use whenReady)
            $("#"+listview.currentItem).focus();
            self.priorityUpdated(true);
        };
        self.handleReorder = function(event) {
            var listview, source, dest, items, i, callback;

            listview = document.getElementById("listview");
            dest = listview.getContextByNode(event.detail.reference);
            items = event.detail.items;
            for (i=0; i<items.length; i++)
            {
                source = listview.getContextByNode(items[i]);
                // invoke callback when last item has been moved successfully
                if (i === items.length-1)
                    callback = {"success": self.handleMoveSuccess};
                self.categoryDataSource().move(source.key, dest.key, event.detail.position, callback);
            }
        };

        self.uploadAndConfirm = function (categoryData) {
            self.reorderEnable("enabled");
            var index = $.map(self.billerCategoryArray(), function(obj, index) {
                if(obj.attr.categoryId() === categoryData.categoryId()) {
                    return index;
                }
            })[0];
            if(document.getElementById(self.imageId1()) !== null) {
                self.isImageExist(true);
            } else {
                self.isImageExist(false);
            }
            if(document.getElementById(self.fileId1())) {
                if (document.getElementById(self.fileId1()).files.length === 0) {
                    params.baseModel.showMessages(null, [self.resourceBundle.messages.noFileFoundErrorMessage], "INFO");
                    return;
                }
                var file = document.getElementById(self.fileId1()).files[0];
                if (file.size <= 0) {
                    params.baseModel.showMessages(null, [self.resourceBundle.messages.emptyFileErrorMsg], "INFO");
                    return;
                } else if (file.size > 100000) {
                    params.baseModel.showMessages(null, [self.resourceBundle.messages.fileSizeErrorMsg], "INFO");
                    return;
                }
            }
            var tracker = document.getElementById("tracker");
            if (tracker.valid === "valid") {
                if(self.isImageExist() && !self.billerCategoryArray()[index].attr.contentId()) {
                    var form = new FormData();
                    form.append("file", self.file());
                    form.append("moduleIdentifier", "BILLER");
                    ManageCategoryModel.uploadImage(form).done(function (data) {
                        if (data && data.contentDTOList[0] && data.contentDTOList[0].contentId) {
                            self.categoryDetails.logo.value(data.contentDTOList[0].contentId.value);
                        }
                        self.save(index, categoryData);
                    });
                } else if(self.isImageExist() && self.billerCategoryArray()[index].attr.contentId()) {
                    self.updateCategory(index, categoryData);
                }
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };
        self.save = function(index, data) {
            self.reorderEnable("enabled");
            self.categoryDetails.name(data.billerCategoryName());
            ManageCategoryModel.createCategory(ko.mapping.toJSON(self.categoryDetails)).done(function(data, status, jqXhr) {
                    self.successMessage(self.resourceBundle.labels.createMessage);
                    self.transactionID(data.status.referenceNumber);
                    if(jqXhr.status === 200 || jqXhr.status === 201) {
                        self.billerCategoryArray()[index].attr.mappedBillers(data.category.billerCount);
                        self.billerCategoryArray()[index].attr.billerCategoryLogo(self.preview());
                        self.billerCategoryArray()[index].attr.contentId(data.category.logo.value);
                        self.billerCategoryArray()[index].attr.categoryId(data.category.id);
                        self.billerCategoryArray()[index].attr.initials = oj.IntlConverterUtils.getInitials(data.category.name);
                        self.billerCategoryArray()[index].attr.mode("LIST");
                        self.status(self.resourceBundle.confirmScreen.completed);
                    } else if(jqXhr.status === 202) {
                        self.billerCategoryArray.pop();
                        self.billerCategoryArray.remove(function (billerCategoryArray) {
                            return billerCategoryArray.attr.categoryId() === undefined;
                        });
                        self.status(self.resourceBundle.confirmScreen.pendingApproval);
                    }
                    self.categoryDataSource(new oj.JsonTreeDataSource(self.billerCategoryArray()));

                    // scroll to the last element in the list
                    if($("#scrollableDiv")[0]) {
                        var difference = $("#scrollableDiv")[0].scrollHeight - $("#scrollableDiv")[0].clientHeight;
                        $("#scrollableDiv").animate({ scrollTop: difference }, "fast");
                    }
                    $("#success").trigger("openModal");
            });
            self.newCategoryCreated(false);
        };

        self.updatePriority = function(){
          var categoryDetails = null;
          var id = null;
          payLoad.batchDetailRequestList = [];
          if(self.categoryDataSource() && self.categoryDataSource().data){
            var categoryArray = self.categoryDataSource().data.children;
            for (var i = 0; i < categoryArray.length; i++) {
              id = categoryArray[i].attr.categoryId();
              categoryDetails = ko.mapping.toJS(getNewKoModel().CategoryDetails);
              categoryDetails.id = id;
              categoryDetails.priority = i + 1;
              categoryDetails.priorityUpdateFlag = true;
              var contentURL = {
                  value: "/categories/{id}",
                  params: { "id": id }
              };
              var obj = {
                  methodType: "PUT",
                  uri: contentURL,
                  payload: ko.mapping.toJSON(categoryDetails),
                  headers: {
                      "Content-Id": i + 1,
                      "Content-Type": "application/json"
                  }
              };
              payLoad.batchDetailRequestList.push(obj);
            }
            if (payLoad.batchDetailRequestList.length > 0) {
              ManageCategoryModel.fireBatch(payLoad).done(function () {
                self.successMessage(self.resourceBundle.labels.priorityMessage);
                self.status(self.resourceBundle.confirmScreen.completed);
                $("#success").trigger("openModal");
                self.priorityUpdated(false);
              });
            }
          }
        };
        self.updateCategory = function(index, data) {
            self.reorderEnable("enabled");
            self.categoryDetails.logo.value(data.contentId());
            self.categoryDetails.id(data.categoryId());
            self.categoryDetails.name(data.billerCategoryName());
            self.categoryDetails.billerCount(data.mappedBillers());
            self.categoryDetails.priorityUpdateFlag(false);
            ManageCategoryModel.updateCategory(data.categoryId(), ko.mapping.toJSON(self.categoryDetails)).done(function(data, status, jqXhr) {
                self.successMessage(self.resourceBundle.labels.editMessage);
                self.transactionID(data.status.referenceNumber);
                if(jqXhr.status === 200 || jqXhr.status === 201) {
                        if(data.category) {
                            self.billerCategoryArray()[index].attr.mappedBillers(data.category.billerCount);
                            self.billerCategoryArray()[index].attr.contentId(data.category.logo.value);
                            self.billerCategoryArray()[index].attr.categoryId(data.category.id);
                            self.billerCategoryArray()[index].attr.initials = oj.IntlConverterUtils.getInitials(data.category.name);
                        }
                         self.billerCategoryArray()[index].attr.billerCategoryLogo(self.preview());
                        self.status(self.resourceBundle.confirmScreen.completed);
                } else if(jqXhr.status === 202) {
                        self.billerCategoryArray()[index].attr.billerCategoryName(self.initialArray[index].attr.billerCategoryName);
                        self.billerCategoryArray()[index].attr.mappedBillers(self.initialArray[index].attr.mappedBillers);
                        self.billerCategoryArray()[index].attr.billerCategoryLogo(self.initialArray[index].attr.billerCategoryLogo);
                        self.billerCategoryArray()[index].attr.contentId(self.initialArray[index].attr.contentId);
                        self.billerCategoryArray()[index].attr.categoryId(self.initialArray[index].attr.categoryId);
                        self.billerCategoryArray()[index].attr.initials = oj.IntlConverterUtils.getInitials(self.initialArray[index].attr.billerCategoryName);
                        self.status(self.resourceBundle.confirmScreen.pendingApproval);
                }
                self.billerCategoryArray()[index].attr.mode("LIST");
                $("#success").trigger("openModal");
            });
            self.newCategoryCreated(false);
        };
        self.addNewRow = function () {
            if(!self.newCategoryCreated()) {
                self.reorderEnable("disabled");
                self.isImageExist(false);
                self.billerCategoryArray.push({"attr": {
                    "initials" : null,
                    "billerCategoryName": ko.observable(),
                    "mappedBillers": ko.observable(),
                    "billerCategoryLogo": ko.observable(),
                    "contentId": ko.observable(),
                    "mode": ko.observable("CREATE"),
                    "categoryId": ko.observable("NEW")
                }});
                self.checkScroll();
                self.categoryDataSource(new oj.JsonTreeDataSource(self.billerCategoryArray()));
                self.newCategoryCreated(true);

                // scroll to the create category section
                if($("#scrollableDiv")[0]) {
                    var difference = $("#scrollableDiv")[0].scrollHeight - $("#scrollableDiv")[0].clientHeight + 76;
                    $("#scrollableDiv").animate({ scrollTop: difference }, "fast");
                }
                document.getElementById("addLink").scrollIntoView();
            }
        };
        self.confirmDelete = function (data) {
            if(data.mappedBillers() === 0 && data.mode() === "LIST") {
                self.categoryId(data.categoryId());
                $("#deleteCategory").trigger("openModal");
            }
            else {
                params.baseModel.showMessages(null, [self.resourceBundle.labels.noCategoryMappedError], "ERROR");
            }
        };

        self.editData = function(event, data) {
            self.reorderEnable("disabled");
            var categoryId = data.currentTarget.id.split("_")[1];
            var index = $.map(self.billerCategoryArray(), function(obj, index) {
                if(obj.attr.categoryId() === categoryId) {
                    return index;
                }
            })[0];
            self.billerCategoryArray()[index].attr.mode("EDIT");
            if(self.billerCategoryArray()[index].attr.billerCategoryLogo()) {
                self.isImageExist(true);
                self.preview(self.billerCategoryArray()[index].attr.billerCategoryLogo());
            } else {
                self.isImageExist(false);
                self.preview(null);
            }
            self.newCategoryCreated(true);
        };
        self.deleteCategory = function () {
            $("#deleteCategory").hide();
            ManageCategoryModel.deleteCategory(self.categoryId()).done(function(data, status, jqXhr) {
                self.successMessage(self.resourceBundle.labels.deleteMessage);
                self.transactionID(data.status.referenceNumber);
                if(jqXhr.status === 200 || jqXhr.status === 201) {
                    self.removeCategory(self.categoryId());
                    self.status(self.resourceBundle.confirmScreen.completed);
                } else if(jqXhr.status === 202) {
                    self.status(self.resourceBundle.confirmScreen.pendingApproval);
                }
                $("#success").trigger("openModal");
            });
        };
        self.checkScroll = function() {
            if(self.billerCategoryArray().length >= 5) {
                $("#scrollableDiv").css("height","500px");
            } else {
                $("#scrollableDiv").css("height","auto");
            }
        };
        self.removeCategory = function (categoryId) {
            self.reorderEnable("enabled");
            var index = $.map(self.billerCategoryArray(), function(obj, index) {
                if(obj.attr.categoryId() === categoryId) {
                    return index;
                }
            })[0];
            if (self.billerCategoryArray()[index].attr.mode() === "CREATE" || self.billerCategoryArray()[index].attr.mode() === "LIST") {
                if(self.billerCategoryArray()[index].attr.mode() === "CREATE") {
                    // scroll to the bottom of the list
                    if($("#scrollableDiv")[0]) {
                        var difference = ($("#scrollableDiv")[0].scrollHeight - $("#scrollableDiv")[0].clientHeight);
                        $("#scrollableDiv").animate({ scrollTop: difference }, "fast");
                    }
                }
                else {
                    // scroll to the top
                    $("#scrollableDiv").animate({ scrollTop: 0 }, "fast");
                }
                self.billerCategoryArray.remove(function (billerCategoryArray) {
                    return billerCategoryArray.attr.categoryId() === categoryId;
                });
            } else if(self.billerCategoryArray()[index].attr.mode() === "EDIT"){
                // scroll to the top
                $("#scrollableDiv").animate({ scrollTop: 0 }, "fast");
                self.billerCategoryArray()[index].attr.mode("LIST");
            }
            self.checkScroll();
            self.categoryDataSource(new oj.JsonTreeDataSource(self.billerCategoryArray()));
            self.newCategoryCreated(false);
        };
        self.cancelDeleteCategory = function () {
            $("#deleteCategory").hide();
        };
        self.back = function(){
           history.back();
        };
        self.closeDialog = function() {
            $("#success").hide();
        };
    };
});
