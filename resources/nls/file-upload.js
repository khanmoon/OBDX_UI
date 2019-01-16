define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var BulkLocale = function() {
    return {
      root: {
        pageTitle: {
          bulk: "File Upload"
        },
        moduleName: {
          bulk: "File Upload"
        },
        bulk: {
          fuid_title: "File Identifier",
          fuid_description: "File Identifier",
          userfimap_title: "User-File Identifier Mapping",
          userfimap_description: "User-File Identifier Mapping",
          fileupload_title: "File Upload",
          fileupload_description: "Upload"
        },
        messages: Messages,
        generic: Generic
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
  return new BulkLocale();
});