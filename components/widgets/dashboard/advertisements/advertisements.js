define([
    "ojs/ojcore",
    "knockout",
    "ojs/ojfilmstrip"
], function (oj, ko) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.ads = [
            { imageSrc: "dashboard/promo1.jpg" },
            { imageSrc: "dashboard/promo2.jpg" },
            { imageSrc: "dashboard/promo3.jpg" }
        ];
    };
});