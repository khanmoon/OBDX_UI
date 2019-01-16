define(["jquery", "framework/js/constants/constants"], function($, Constants) {
  "use strict";
  return new function() {
    var self = this;
    var cssTokens = {};
    function loadFonts(url) {
      var link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("type", "text/css");
      link.setAttribute("href", url.slice(1, -1));
      link.setAttribute("media", "none");
      link.setAttribute("onload", "if(media!='all')media='all'");
      document.head.appendChild(link);
    }

    function parseBrandCSS(response) {
      var sizeUnit = "rem";
      var styleAsset = JSON.parse(atob(response));
      var styleAssetString = ":root{";
      for (var i = 0; i < Object.keys(styleAsset).length; i++) {
        var element = Object.keys(styleAsset)[i];
        for (var j = 0; j < Object.keys(styleAsset[element]).length; j++) {
          var key = Object.keys(styleAsset[element])[j];
          if (element !== "fontDetails") {
            styleAssetString += key + ":" + styleAsset[element][key] + (((element !== "font-weights" && typeof (styleAsset[element][key]) === "number")) ? (sizeUnit + ";") : ";");
          } else {
            styleAssetString += key + ":\"" + styleAsset[element][key] + "\";";
          }
        }
      }
      styleAssetString += "}";
      return styleAssetString;
    }

    function appendBrandStyle(data) {
      if (data && data.assetDTO) {
        var style = document.createElement("style");
        var cssString = parseBrandCSS(data.assetDTO.asset);
        style.textContent = cssString;
        document.head.appendChild(style);
      }
    }

    /**
     * @summary Utility function that tokenizes a css root prop string.<br>
     * @function getCSSTokens
     * @memberof CSS
     * @instance
     * @param  {String} cssString    The string containing tokens to be formatted.
     * @returns {Object} The object containing tokens.
     */
    self.getCSSTokens = function (cssString) {
      if (cssString && cssString.match(/\:root{(.*?)}/)) {
        cssString.match(/\:root{(.*?)}/)[1].split(";").forEach(function (element) {
          var token = element.match(/(^.*?):(.*)$/);
          cssTokens[token[1]] = token[2];
        });
      }
      return cssTokens;
    };

    /**
     * @summary Utility function that replaces the css string with css tokens collected before<br>
     * @function replaceCSSTokens
     * @memberof CSS
     * @inner
     * @param  {String} cssString The string containing tokens to be formatted.
     * @returns {String} The css with replaced tokens.
     */
    var replaceCSSTokens = function (cssString) {
      Object.keys(self.getCSSTokens()).forEach(function (variable) {
        var regex = new RegExp("var\\(" + variable + "\\)", "g");
        cssString = cssString.replace(regex, self.getCSSTokens()[variable]);
      });
      return cssString;
    };

    /**
     * @summary Utility function that checks whether browser supports CSS custom properties.<br>
     * @function isCSSCustomPropAvailable
     * @memberof CSS
     * @instance
     * @returns {Boolean} <code>true</code> or <code>false</code> depending on whether CSS custom properties are supported or not, respectively.
     */
    self.isCSSCustomPropAvailable = function () {
      return window.CSS && window.CSS.supports && window.CSS.supports("--fake-var", 0);
    };

    /**
     * @summary Function that replaces the CSS strings based on CSS Custom Variables browser support.
     * @function replaceCSS
     * @memberof CSS
     * @instance
     * @param  {String} content The string containing tokens to be formatted.
     * @returns {String} The transformed CSS string is returned.
     */
    self.replaceCSS = function (content) {
      if (!self.isCSSCustomPropAvailable()) {
        return replaceCSSTokens(content);
      }
      return content;
    };

    self.loadCSS = function(brandPromise) {
      var mainCSS = "framework/css/main" + (Constants.buildFingerPrint.timeStamp ? ("." + Constants.buildFingerPrint.timeStamp) : "");
      $("body").addClass("page-is-changing");
      if (!self.isCSSCustomPropAvailable()) {
        require(["text!" + mainCSS + ".css"], function(mainCSSString) {
          brandPromise.then(function(data) {
            self.getCSSTokens(mainCSSString);
            if (data.assetDTO) {
              var brandCSSString = parseBrandCSS(data.assetDTO.asset);
              if (brandCSSString) {
                self.getCSSTokens(brandCSSString);
              }
            }
            loadFonts(self.getCSSTokens()["--base-font-url"]);
            var node = document.createElement("style");
            node.textContent = self.replaceCSS(mainCSSString);
            document.head.appendChild(node);
            $("body").removeClass("page-is-changing");
            $("div.cd-logo").removeClass("cd-logo");
          });
        });
      } else {
        require(["css!" + mainCSS], function() {
          brandPromise.then(function(data) {
            appendBrandStyle(data);
            var style = getComputedStyle(document.querySelector(":root"));
            loadFonts(style.getPropertyValue("--base-font-url"));
          });
          $("body").removeClass("page-is-changing");
          $("div.cd-logo").removeClass("cd-logo");
        });
      }
    };
  };
});
