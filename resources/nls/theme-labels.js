define([], function () {
    "use strict";
    var ThemeLabels = function () {
        return {
            root: {
                labels: {
                    themeId: "Brand ID",
                    themeName: "Brand Name",
                    themeDesc: "Brand Description",
                    themeType: "Brand Type",
                    brandLogo: "Images",
                    hellp: "Help",
                    colorPalette: "Color Palette",
                    colorSpectrum: "Color Spectrum",
                    fontWeights: "Font Weights",
                    retail: "Retail",
                    downloadImg:"Download Images",
                    corporate: "Corporate",
                    pickColor: "Pick a Color",
                    applyTheme: "Apply Brand",
                    help: "Help",
                    fontSection: "Typography",
                    fontSizeDetails: "Font Size",
                    helpTitle: "Click to see folder structure of Zip file",
                    colors: {
                        "--base-color-primary": "Base Color Primary",
                        "--base-color-secondary": "Base Color Secondary",
                        "--base-color-secondary-text": "Base Color Secondary Text",
                        "--base-color-secondary-darken": "Base Color Secondary Darken",
                        "--button-primary-background": "Button Primary Background",
                        "--button-primary-foreground": "Button Primary Foreground",
                        "--button-primary-border-color": "Button Primary Border Color",
                        "--button-secondary-background": "Button Secondary Background",
                        "--button-secondary-foreground": "Button Secondary Foreground",
                        "--button-secondary-border-color": "Button Secondary Border Color",
                        "--button-tertiary-background": "Button Tertiary Background",
                        "--button-tertiary-foreground": "Button Tertiary Foreground",
                        "--button-tertiary-border-color": "Button Tertiary Border Color",
                        "--base-text-primary": "Base Text Primary",
                        "--base-text-secondary": "Base Text Secondary",
                        "--base-text-tertiary": "Base Text Tertiary",
                        "--link-base": "Link Base Color",
                        "--link-hover": "Link Hover Color",
                        "--base-color-success": "Success Color",
                        "--base-color-warning": "Warning Color",
                        "--base-color-danger": "Danger Color",
                        "--base-font-url":"Font URL",
                        "--base-font-family":"Font Family"
                    },
                    fontDetails: {
                        "--base-font-url": "Base Font URL",
                        "--base-font-family": "Base Font Family"
                    },
                    fontSize: {
                        "--base-font-size-h1": "Header 1 Font Size",
                        "--base-font-size-h2": "Header 2 Font Size",
                        "--base-font-size-h3": "Header 3 Font Size",
                        "--base-font-size-h4": "Header 4 Font Size",
                        "--base-font-size-h5": "Header 5 Font Size",
                        "--base-font-size-h6": "Header 6 Font Size",
                        "--form-input-text": "Form Input Font Size",

                        "--base-font-size-small": "Small Font Size",
                        "--base-font-size-large": "Large Font Size",
                        "--base-font-size-larger": "Larger Font Size",
                        "--base-font-size-default": "Default Font Size",
                        "--base-font-size-medium": "Medium Font Size"
                    },
                    components: {
                        "--header-background-color": "Header Background Color",
                        "--header-foreground-color": "Header Foreground Color",
                        "--footer-background-color": "Footer Background Color",
                        "--footer-foreground-color": "Footer Foreground Color"
                    },
                    "base-colors": {
                        "--base-color-primary": "Primary Color",
                        "--base-color-secondary": "Secondary Color",
                        "--base-color-secondary-text": "Secondary Text Color",
                        "--base-color-secondary-darken": "Secondary Color Dark",
                        "--base-color-success": "Success Color",
                        "--base-color-success-light": "Success Color Light",
                        "--base-color-warning": "Warning Color",
                        "--base-color-warning-light": "Warning Color Light",
                        "--base-color-danger": "Danger Color",
                        "--base-color-danger-light": "Danger Color Light",
                        "--base-border-default": "Border Default Color",
                        "--base-text-primary": "Primary Text Color",
                        "--base-text-secondary": "Secondary Text Color",
                        "--base-text-tertiary": "Tertairy Text Color",
                        "--base-background-primary": "Primary Background Color",
                        "--base-background-tertiary": "Tertairy Background Color",
                        "--base-background-secondary": "Secondary Background Color",
                        "--base-background-disable": "Background Disable Color",
                        "--scroll-track": "Scroll Track",
                        "--scroll-thumb": "Scroll Thumb",
                        "--menu-background": "Menu Background Color"
                    },
                    "base-variables": {
                        "--base-dimension-header-height": "Header Height",
                        "--base-dimension-footer-height": "Footer Height",
                        "--base-dimension-docked-menu-height": "Docked Menu Height",
                        "--base-dimension-menu-width": "Menu Width"
                    },
                    "button-colors": {
                        "--button-help-background": "Help Background Color",
                        "--button-help-color": "Help Color",
                        "--button-help-border-color": "Help Border Color",
                        "--button-primary-background": "Primary Background Color",
                        "--button-primary-foreground": "Primary Foreground Color",
                        "--button-primary-border-color": "Primary Border Color",
                        "--button-secondary-background": "Secondary Background Color",
                        "--button-secondary-foreground": "Secondary Foreground color",
                        "--button-secondary-border-color": "Secondary Border Color",
                        "--button-tertiary-background": "Tertairy Background Color",
                        "--button-tertiary-foreground": "Tertairy Foreground Color",
                        "--button-tertiary-border-color": "Tertairy Border Color"
                    },
                    "button-variables": {
                        "--button-height": "Height",
                        "--button-padding-top-bottom": "Padding Top Bottom",
                        "--button-padding-left-right": "Padding Left Right",
                        "--button-border-radius": "Border Radius",
                        "--button-border-width": "Border Width",
                        "--button-font-size-text": "Font Size",
                        "--button-font-size-icon": "Icon Size"
                    },
                    "font-weights": {
                        "--base-font-weight-regular": "Regular Weight",
                        "--base-font-weight-light": "Light Weight",
                        "--base-font-weight-bold": "Bold Weight"
                    },
                    "navigation-bar": {
                        "--nav-default-text": "Default Text Color",
                        "--nav-hover-text": "Hover Text Color",
                        "--nav-hover-border": "Hover Border Color",
                        "--nav-default-border": "Default Border Color",
                        "--nav-hover-background": "Hover Background Color",
                        "--nav-selected-text": "Selected Text Color",
                        "--nav-selected-border": "Selected Border Color",
                        "--nav-selected-background": "Selected Background Color",
                        "--nav-default-background": "Deafalut Background Color"
                    },
                    "table": {
                        "--table-header-background": "Header Background Color",
                        "--table-header-color": "Header Color",
                        "--table-tr-hover-color": "Row Hover Color"
                    },
                    "banner-colors": {
                        "--banner-background": "Background Color",
                        "--banner-text-primary": "Primary Color",
                        "--banner-text-secondary": "Secondary Color"
                    },
                    "banner-variables": {
                        "--banner-padding": "Padding"
                    },
                    "link": {
                        "--link-base": "Base Color",
                        "--link-hover": "Hover Color"
                    },
                    "form-variables": {
                        "--form-line-height": "Form Line Height",
                        "--form-border-width": "Form Border Width",
                        "--form-input-text": "Form Input",
                        "--form-input-border-radius": "Input Border Radius",
                        "--form-input-button-height": "Form Button Height",
                        "--form-input-button-border-radius": "Form Button Border Radius",
                        "--form-input-button-border-width": "Form Button Border Width",
                        "--form-padding-top-bottom": "Padding Top Bottom",
                        "--form-padding-left-right": "Padding Left Right",
                        "--form-padding-small-top-bottom": "Small Form Padding Top Bottom",
                        "--form-padding-small-left-right": "Small Form Padding Left Right",
                        "--form-title-margin-top-bottom": "Form Title Margin Top Bottom",
                        "--form-title-margin-left-right": "Form Title Margin Left Right"
                    },
                    "form-colors": {
                        "--form-input-background-base": "Input Background Color",
                        "--form-input-background-hover": "Input Hover Color",
                        "--form-input-background-focus": "Input Focus Color",
                        "--form-input-background-disable": "Input Disable Color",
                        "--form-input-color-base": "Input Text Color",
                        "--form-input-color-hover": "Input Text Hover Color",
                        "--form-input-color-focus": "Input Text Focus Color",
                        "--form-input-color-disable": "Input Text Disable Color",
                        "--form-input-border-color": "Input Border Color"
                    }
                },
                heading: {
                    logo: "Assets",
                    colors: "Colors",
                    component: "Components",
                    baseColors: "Base Colors",
                    baseVariables: "Base Dimensions",
                    buttonColors: "Button Colors",
                    buttonVariables: "Button Dimensions",
                    navBar: "Navigation Bar",
                    tableColors: "Table",
                    bannerColors: "Banner Colors",
                    bannerVariables: "Banner Dimensions",
                    linkColors: "Link Colors",
                    formColors: "Form Colors",
                    formVariables: "Form Dimensions",
                    view: "View",
                    create: "Brand Information",
                    saveTheme: "Create Brand",
                    updateTheme: "Update Brand",
                    customizeBrand: "Customize Brand",
                    typo:"Typography",
                    fontSize:"Font Size",
                    fontWeights: "Font Weights"
                }
            },
            ar: false,
            fr: false,
            en: false,
            "en-us": false
        };
    };
    return new ThemeLabels();
});