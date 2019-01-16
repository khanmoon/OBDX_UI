define(["knockout", "framework/js/constants/constants", "text!extensions/extension.json", "text!lzn/manifest", "promise"], function(ko, Constants, extensions, localization, Promise) {
  "use strict";
  var require = window.require,
    addTrailingSlash = function(path) {
      return path && path.replace(/\/?$/, "/");
    };
  var Extensions = JSON.parse(extensions);

  (function(ko, require) {
    var koAMDHelper = new ko.nativeTemplateEngine(),
      sources = {};
    var defaultPath = "./partials";
    var defaultSuffix = ".html";
    var defaultRequireTextPluginName = "text";

    var localizationPromise = new Promise(function(resolve) {
      if (localization) {
        require(["text!lzn/" + localization + "/manifest.json"], function(localizationManifest) {
          resolve(JSON.parse(localizationManifest));
        });
      } else {
        resolve();
      }
    });

    koAMDHelper.loader = function(templateName, done) {
      localizationPromise.then(function(Localization) {
        var partialPath = (function(){
        if(Extensions.partials.indexOf(templateName) > -1){
          return "extensions/partials";
        } else if(Localization && Localization.partials.indexOf(templateName) > -1){
          return "lzn/" + localization + "/partials";
        }
          return defaultPath;
        })();
        require([defaultRequireTextPluginName + "!" + addTrailingSlash(partialPath) + templateName + defaultSuffix + (Constants.buildFingerPrint.timeStamp ? ("?bust=" + Constants.buildFingerPrint.timeStamp) : "")], done);
      });
    };

    ko.templateSources.requireTemplate = function(key) {
      this.key = key;
      this.template = ko.observable(" ");
      this.requested = false;
      this.retrieved = false;
    };

    ko.templateSources.requireTemplate.prototype.text = function() {
      if (!this.requested && this.key) {
        koAMDHelper.loader(this.key, function(templateContent) {
          this.retrieved = true;
          this.template(templateContent);
        }.bind(this));
        this.requested = true;
      }
      if (!this.key) {
        this.template("");
      }
      if (arguments.length === 0) {
        return this.template();
      }
    };

    koAMDHelper.createRootTemplate = function(template, doc) {
      var el;
      if (typeof template === "string") {
        el = (doc || document).getElementById(template);
        if (el && el.tagName.toLowerCase() === "script") {
          return new ko.templateSources.domElement(el);
        }
        if (!(template in sources)) {
          sources[template] = new ko.templateSources.requireTemplate(template);
        }
        return sources[template];
      } else if (template && (template.nodeType === 1 || template.nodeType === 8)) {
        return new ko.templateSources.anonymousTemplate(template);
      }
    };

    koAMDHelper.renderTemplate = function(template, bindingContext, options, templateDocument) {
      var templateSource,
        existingAfterRender = options && options.afterRender,
        localTemplate = options && options.templateProperty && bindingContext.$module && bindingContext.$module[options.templateProperty];
      if (existingAfterRender) {
        existingAfterRender = options.afterRender = options.afterRender.original || options.afterRender;
      }
      if (localTemplate && (typeof localTemplate === "function" || typeof localTemplate === "string")) {
        templateSource = {
          text: function() {
            return typeof localTemplate === "function" ? localTemplate.call(bindingContext.$module) : localTemplate;
          }
        };
      } else {
        templateSource = koAMDHelper.createRootTemplate(template, templateDocument);
      }
      if (typeof existingAfterRender === "function" && templateSource instanceof ko.templateSources.requireTemplate && !templateSource.retrieved) {
        options.afterRender = function() {
          if (templateSource.retrieved) {
            existingAfterRender.apply(this, arguments);
          }
        };
        options.afterRender.original = existingAfterRender;
      }

      return koAMDHelper.renderTemplateSource(templateSource, bindingContext, options, templateDocument);
    };
    ko.amdTemplateEngine = koAMDHelper;
    ko.setTemplateEngine(koAMDHelper);
  })(ko, require);
});
