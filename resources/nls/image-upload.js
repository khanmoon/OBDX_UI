define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var AccountInputLocale = function() {
    return {
      root: {
        drag: "Drag files here",
        or: "Or",
        remove: "Remove",
        removeImage: "Remove Image",
        removeImageTitle: "Click to Remove Image",
        fileUpload: "File Upload",
        goalImage: "Goal Category Image",
        goalImageTitle: "Goal Category Image",
        maxFileSize: "Image size should not exceed {fileSize} KB. Upload .jpg, .jpeg, .png files only.",
        emptyFileErrorMsg: "The uploaded file is empty, Please upload a valid file.",
        fileSizeErrorMsg: "The uploaded file exceeds the maximum permissible size of {fileSize} KB. Please reduce the file size and try again.",
        fileTypeError: "Invalid file type. Upload .jpg, .jpeg, .png files only.",
        maxSize: "1000000",
        generic: Generic,
        alertMessage: "The File API is not fully supported in this browser."
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new AccountInputLocale();
});