define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/offers",
    "text!./promotional-offers.json",
    "ojs/ojfilmstrip"
], function (oj, ko, $, ResourceBundle,dummyData) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.resource = ResourceBundle;
        self.ads = [];
        self.ads = JSON.parse(dummyData).image;
        self.maxItemsPerPage = ko.observable();
        self.link = function (data) {
            window.open(data.url);
        };
        if(rootParams.baseModel.small()){
          self.maxItemsPerPage = 1;
        }
        else{
          self.maxItemsPerPage = 2;
        }
    };
});
