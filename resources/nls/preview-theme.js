define(["ojL10n!resources/nls/generic"], function (Generic) {
  "use strict";
  var PreviewThemeLocale = function () {
    return {
      root: {
        generic: Generic,
        labels: {
          name: "Font Name",
          "header-font": "Header Font Size",
          "menu-item-font-size": "Menu Font Size",
          fontSize: {
            "--base-font-size-h1": "H1 Size",
            "--base-font-size-h2": "H2 Size",
            "--base-font-size-h3": "H3 Size",
            "--base-font-size-h4": "H4 Size",
            "--base-font-size-h5": "H5 Size",
            "--base-font-size-h6": "H6 Size"
          },
          primaryBtn: "Primary Button",
          secondaryBtn: "Secondary Button",
          tertiaryBtn: "Tertiary Button",
          helpBtn: "Help Button",
          "btn-font-size": "Button Font Size",
          colors: {
            "header-background-color": "Header Background Color",
            "header-title-color": "Header Color",
            "bg-color": "Body Background Color",
            "form-bg-color": "Form Background Color",
            "font-base-color": "Font Color",
            "font-base-secondary-color": "Font Secondary Color",
            "link-color": "Link Text Color",
            "label-color": "Label Color",
            "input-color": "Input Text Color",
            "input-bg-color": "Input Background Color",
            "input-border-color": "Input Border Color",
            "btn-primary-bg": "Primary Button Background Color",
            "btn-secondary-bg": "Secondary Button Background Color",
            "btn-tertiary-bg": "Tertiary Button Background Color",
            "btn-form-bg-color": "Form Button Background Color",
            "btn-primary-color": "Primary Button Text Color",
            "btn-secondary-color": "Secondary Button Text Color",
            "btn-tertiary-color": "Tertiary Button Text Color",
            "btn-form-txt-color": "Form Button Text Color",
            "menuset-container-bg": "Menu Background Color",
            "menuset-font-color": "Menu Primary Color",
            "menuset-sub-item-font-color": "Menu Secondary Color"
          }
        },
        sampleTxt: {
          form: "Form Components",
          label: "Label Color",
          anchorTxt: "Anchor Text Color",
          sampleTxt: "lorem epsum lorem epsum lorem epsum lorem epsum lorem epsum lorem epsum lorem epsum",
          home: "Home",
          aboutUs: "About Us",
          font: "Font Color",
          input: "Input Properties",
          primaryBtn: "Primary Button Properties",
          secondaryBtn: "Secondary Button Properties",
          tertiaryBtn: "Tertiary Button Properties",
          helpBtn: "Help Button Properties",
          footer:"Copyright © 2006, 2017, Oracle and/or its affiliates. All rights reserved."
        },
        pageHeader: "Theme Preview",
        setFont: "{size}{unit}"
      },
      ar: true,
      fr: true,
      en: false,
      "en-us": false
    };
  };
  return new PreviewThemeLocale();
});
