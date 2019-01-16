define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ManageCategoryLocale = function() {
    return {
      root: {
        generic : Generic,
        heading: {
            manageCategory: "Biller Category Maintenance",
            infoHeader: "Create and Maintain Category"
        },
        labels: {
            update: "Update",
            billerIcon: "Biller Icon",
            billerCategory: "Biller Category",
            mappedBiller: "Mapped Billers",
            addCategory: "Add Category",
            categoryIcon: "Category Icon",
            listofCategories: "Billers Categories",
            templateName: "category",
            imageId1: "Image1",
            fileId1: "File1",
            deleteCategory: "Delete Category",
            removeCategory: "Remove Category",
            deleteCategoryMsg: "Are you sure you want to delete the category ?",
            editMessage: "Category updated successfully.",
            createMessage: "Category saved successfully.",
            deleteMessage: "Category deleted successfully.",
            priorityMessage: "Priority updated successfully.",
            noCategoryMappedError: "Please remap all the billers currently mapped to the category before deletion",
            enterName: "Enter Category Name",
            referenceNo: "Reference Number : ",
            categoryName: "Category Name",
            categoryPriority: "Category Priority",
            categoryIconTitle: "Category Icon Title",
            noData: "No Data to display",
            updatePriority: "Update Priority"
        },
        messages: {
            invalidCategory: "Category Name can comprise alphanumerics (A-Z any case, 0-9)&,/,-\"space",
            invalidUrl:"Please enter a valid onlilne validation URL.",
            emptyFileErrorMsg: "The uploaded file is empty, Please upload a valid file.",
            fileSizeErrorMsg: "The uploaded file exceeds the maximum permissible size of 100 KB. Please reduce the file size and try again.",
            noFileFoundErrorMessage: "Please choose a file to upload",
            specificationLimit : "You can enter upto 10 labels only",
            changePriority: "The order in which the customers see categories in Biller category dropdown will be as set here. You can re-arrange the order by selecting and dragging a category up or down",
            categoryNote: "Create new categories and map billers here. When creating new billers of bill payment, if you cannot find the ideal category to map then new categories can be created here.",
            categoryIconNote: "An icon also needs to be uploaded at the time of creating a category. This icon will be displayed to customer in bill payment screens."
        },
        confirmScreen: {
            deleteSuccessMessage: "Biller has been deleted.",
            updateSuccessMessage: "Biller details updated successfully.",
            completed: "Completed",
            initiated: "Initiated",
            pendingApproval: "Pending Approval",
            status: "Status : "
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new ManageCategoryLocale();
});
