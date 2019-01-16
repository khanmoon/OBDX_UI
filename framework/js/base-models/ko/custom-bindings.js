/**
 * This file lists all the knockout custom bindings.
 * @requires knockout
 * @requires jquery
 * @requires framework/js/constants/brand-assets
 * @requires framework/js/constants/constants
 */
define([
  "knockout",
  "jquery",
  "framework/js/constants/brand-assets",
  "framework/js/constants/constants",
  "fetch"
], function (ko, $, BrandAssets, Constants) {
  "use strict";
  /**
   * This file lists all the methods needed for knockout custom bindings.
   * @class
   * @alias CustomBindings
   * @memberof module:baseModel
   */
  var CustomBindings = function () {
    /**
     * The instance of <code>IntersectionObserver</code>.
     * @member {Object|undefined}
     */
    // eslint-disable-next-line no-use-before-define
    var observer = "IntersectionObserver" in window ? new IntersectionObserver(onIntersection) : void 0;

    /**
     *
     * @function onIntersection
     * @memberof CustomBindings
     * @inner
     * @param  {IntersectionObserverEntry} entries The [IntersectionObserverEntry]{@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry} interface of the Intersection Observer API describes the intersection between the target element and its root container at a specific moment of transition.
     * @returns {void}
     */
    function onIntersection(entries) {
      entries.forEach(function (entry) {
        if (entry.intersectionRatio > 0) {
          var element = entry.target;
          observer.unobserve(element);
          element.setAttribute("src", element.getAttribute("lazySrc"));
          element.removeAttribute("lazySrc");
        }
      });
    }

    /**
     * The binding handler to create custom child context. This creates a childContext which can be used on DOM.<br>
     * For more information, refer the [official knockout documentation]{@linkcode http://knockoutjs.com/documentation/custom-bindings-controlling-descendant-bindings.html#example-supplying-additional-values-to-descendant-bindings}.
     * @alias childContext
     * @instance
     * @memberof CustomBindings
     * @example
     * <div data-bind="childContext:{name: '$baseModel', context: $data}">
     * ....
     * available here as $baseModel for all descendents.
     * </div>
     * @type {Object}
     */
    ko.bindingHandlers.childContext = {
      init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        bindingContext[valueAccessor().name] = valueAccessor().context;
        ko.applyBindingsToDescendants(bindingContext, element);
        return {
          controlsDescendantBindings: true
        };
      }
    };

    /**
     * The <code>component</code> binding preprocessor. Adds bindings for <code>baseModel</code> and <code>dashboard</code> automagically.<br>
     * For more information, refer the [official knockout documentation]{@linkcode http://knockoutjs.com/documentation/binding-preprocessing.html#binding-preprocessor-reference}.
     * @alias component.preprocess
     * @instance
     * @memberof CustomBindings
     * @type {Object}
     */
    ko.bindingHandlers.component.preprocess = function (stringFromMarkup) {
      var matches = stringFromMarkup.match(/\{\s*?['"]?name['"]?\s*?\:\s*?['"]?([^'",]*)['"]?,?/);
      var componentName = matches[1];
      if (["dashboard", "confirm-dialog"].indexOf(componentName) === -1) {
        return stringFromMarkup.replace(/(params\s*?:\s*?\{)/, "$1baseModel: $baseModel, dashboard: $dashboard, ");
      }
      return stringFromMarkup;
    };

    /**
     * The binding handler to set the page title and favicon icon for the page.<br>
     * This is marked as a virual binding, hence can be used as a comment tag style binding too.
     * @alias pageTitle
     * @instance
     * @memberof CustomBindings
     * @example
     * <!-- ko pageTitle: pageTitle -->
     * <!-- /ko -->
     * @type {Object}
     */
    ko.bindingHandlers.pageTitle = {
      update: function (element, valueAccessor) {
        var title = ko.utils.unwrapObservable(valueAccessor());
        document.title = title;
      },
      init: function () {
        var link = document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "shortcut icon";
        link.href = Constants.imageResourcePath + "/favicon.ico";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
    };
    ko.virtualElements.allowedBindings.pageTitle = true;

    /**
     * Inner utility function to handle image loading via [ko.bindingHandlers.loadImage]{@linkcode CustomBindings~loadImage}.
     * @inner
     * @param  {HTMLElement} element         The DOM element involved in this binding
     * @param  {Observable} valueAccessor   A JavaScript function that you can call to get the current model property that is involved in this binding. Call this without passing any parameters (i.e., call valueAccessor()) to get the current model property value. To easily accept both observable and plain values, call ko.unwrap on the returned value.
     * @param  {Object} allBindings     A JavaScript object that you can use to access all the model values bound to this DOM element. Call allBindings.get('name') to retrieve the value of the name binding (returns undefined if the binding doesn’t exist); or allBindings.has('name') to determine if the name binding is present for the current element.
     * @param  {Object} viewModel       This parameter is deprecated in Knockout 3.x. Use bindingContext.$data or bindingContext.$rawData to access the view model instead.
     * @param  {Object} bindingContext  An object that holds the binding context available to this element’s bindings. This object includes special properties including $parent, $parents, and $root that can be used to access data that is bound against ancestors of this context.
     * @param  {String} resourcePath    The string resource path of the image.
     * @param  {String} locationOfImage The calculated location of the image.
     * @returns {void}
     */
    function loadImage(element, valueAccessor, allBindings, viewModel, bindingContext, resourcePath, locationOfImage, isExternal) {
      if (observer) {
        observer.observe(element);
        element.setAttribute("lazySrc", (isExternal ? resourcePath : (locationOfImage + "/" + resourcePath)));
        resourcePath = Constants.imageResourcePath + "/placeholder.svg";
      } else {
        var fold = $(window).height() + $(window).scrollTop();
        var top = $(window).scrollTop();
        if (fold > $(element).offset().top && top <= $(element).offset().top + $(element).height()) {
          element.setAttribute("isLazy", "false");
          resourcePath = isExternal ? resourcePath : (locationOfImage + "/" + resourcePath);
        } else {
          element.setAttribute("isLazy", "true");
          element.setAttribute("lazySrc", (isExternal ? resourcePath : (locationOfImage + "/" + resourcePath)));
          resourcePath = Constants.imageResourcePath + "/placeholder.svg";
        }
      }
      var attribute = "";
      ko.utils.arrayForEach(element.getAttribute("data-bind").split(","), function (item) {
        if (!item.indexOf("loadImage") > -1) {
          attribute += item + ",";
        }
      });
      if (element.nodeName === "IMG" || element.nodeName === "VIDEO") {
        element.setAttribute("src", resourcePath);
      } else if (element.nodeName === "OBJECT") {
        element.setAttribute("type", "image/svg+xml");
        element.setAttribute("data", resourcePath);
      }
      element.setAttribute("data-bind", attribute.slice(0, -1));
      if (bindingContext.$data && bindingContext.$data.errorImage) {
        element.setAttribute("onerror", "this.onerror=null;this.src='" + Constants.imageResourcePath + bindingContext.$data.errorImage + "';");
      }
      var allBindingsKeys = ko.expressionRewriting.parseObjectLiteral(element.getAttribute("data-bind"));
      var clickBinding = allBindingsKeys.filter(function (obj) {
        return obj.key === "click";
      });
      if (clickBinding[0]) {
        var attributeBinding = allBindingsKeys.filter(function (obj) {
          return obj.key === "attr";
        });
        if (!attributeBinding.length || !attributeBinding[0].value.match("alt") || !attributeBinding[0].value.match("title")) {
          // eslint-disable-next-line no-console
          console.error("Clickable images need both title attribute and alt attribute. Image name:", resourcePath);
          element.parentElement.removeChild(element);
          return false;
        }
        var latestAttribute = "";
        ko.utils.arrayForEach(allBindingsKeys, function (item) {
          if (item.key !== "click") {
            latestAttribute += item.key + ":" + item.value + ",";
          }
        });
        element.setAttribute("data-bind", latestAttribute.slice(0, -1));
        element.setAttribute("height", "100%");
        element.setAttribute("width", "100%");
        var a = document.createElement("a");
        a.setAttribute("data-bind", "click:" + clickBinding[0].value);
        if (element.getAttribute("id")) {
          a.setAttribute("id", element.getAttribute("id"));
          element.removeAttribute("id");
        }
        a.setAttribute("href", "#");
        $(element).wrap(a);
      } else {
        var altAttribute = allBindingsKeys.filter(function (obj) {
          return obj.key === "alt";
        });
        if (!altAttribute) {
          var attrBinding = allBindingsKeys.filter(function (obj) {
            return obj.key === "attr";
          });
          if (!attrBinding.length || !attrBinding[0].value.match("alt")) {
            element.setAttribute("alt", "");
          }
        } else {
          element.setAttribute("alt", "");
        }
      }
    }

    /**
     * The binding handler to load images from a common root path.<br><br>
     * If images are clickable then wraps it in a anchor element.<br>
     * Validates if <code>alt</code> and <code>title</code> attributes are specified for clickable images.<br>
     * Else set empty <code>alt</code> for images anyway.
     * @alias loadImage
     * @instance
     * @memberof CustomBindings
     * @example
     * <img data-bind="loadImage: 'account-nickname/edit.png'" />
     * <img data-bind="loadImage: {url: 'some-external-url', isExternal: true}" />
     * @type {Object}
     */
    ko.bindingHandlers.loadImage = {
      init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var resourcePath = ko.utils.unwrapObservable(valueAccessor());
        if (resourcePath) {
          var locationOfImage = Constants.imageResourcePath,
            isExternal = !!resourcePath.isExternal;
          element.setAttribute("src", Constants.imageResourcePath + "/placeholder.svg");
          bindingContext.$root.userInfoPromise.then(function () {
            bindingContext.$root.fetchCurrentBrand().then(function () {
              if (Constants.brandID && BrandAssets.images.indexOf(resourcePath) !== -1 && !isExternal) {
                require(["baseService"], function (BaseService) {
                  var baseService = BaseService.getInstance();
                  if (Constants.brandID) {
                    baseService.fetchImage({
                      url: "brands/{brandID}?name={resourcePath}&type=I",
                      element: element
                    }, {
                      brandID: Constants.brandID,
                      resourcePath: resourcePath
                    });
                  } else {
                    loadImage(element, valueAccessor, allBindings, viewModel, bindingContext, resourcePath, locationOfImage);
                  }
                });
              } else {
                loadImage(element, valueAccessor, allBindings, viewModel, bindingContext, resourcePath.url || resourcePath, locationOfImage, isExternal);
              }
            });
          });
        } else {
          element.setAttribute("src", "");
        }
      }
    };

    /**
     * The binding handler to fade in or fade out element based on a boolean observable.
     * @alias fadeVisible
     * @instance
     * @memberof CustomBindings
     * @example
     * <div data-bind="fadeVisible: someObservable">
     * ....
     * </div>
     * @type {Object}
     */
    ko.bindingHandlers.fadeVisible = {
      update: function (element, valueAccessor) {
        var value = valueAccessor();
        if (ko.unwrap(value)) {
          $(element).fadeIn();
        } else {
          $(element).fadeOut();
        }
      }
    };
    /**
     * The html binding does not process bindings within the inserted HTML.<br/>
     * This custom binding helps do that. For more information [see this]{@link https://stackoverflow.com/a/28775676}.
     * @alias htmlBound
     * @instance
     * @memberof CustomBindings
     * @type {Object}
     * @example
     * <div data-bind="htmlBound: someObservableWithDataBind">
     * ....
     * </div>
     */
    ko.bindingHandlers.htmlBound = {
      init: function () {
        return {
          controlsDescendantBindings: true
        };
      },
      update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        ko.utils.setHtml(element, valueAccessor());
        ko.applyBindingsToDescendants(bindingContext, element);
      }
    };
    /**
     * Knockout Extender used to check if an observable is set or not.
     * @function loaded
     * @instance
     * @memberof CustomBindings
     * @param {Observable} target The observable under consideration.
     * @param {Promise} promise   Promise attached to the observable.<br><br>
     *                            Not yet complete.
     * @example
     * self.someObservable = ko.observable().extend({loaded: false});
     * // some where else
     * self.someObservable('value');
     * // on HTML
     * <!-- ko if: $component.someObservable.loaded -->
     * // do something here
     * <!-- /ko -->
     * @returns {Observable} The observable is returned.
     */
    ko.extenders.loaded = function (target, promise) {
      target.loaded = ko.observable();
      /**
       * Internal function to check if promise is passed or not.<br><br>
       * Not yet complete.
       * @param  {String}  newValue The new value of the observable.
       * @returns {void}
       */
      function isLoaded(newValue) {
        if (!(promise instanceof Promise)) {
          target.loaded(!!(newValue));
        }
      }
      isLoaded(target());
      target.subscribe(isLoaded);
      return target;
    };
  };
  return new CustomBindings();
});