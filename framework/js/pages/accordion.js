/**
 * This file contains the functional part of a custom plugin degined to be used
 * with material design. This plugin will enable developers to implement a clean
 * implementation of accordion.
 *
 * Paper Accordion is an implementation of standard accordion developed according
 * to Material Specifications.
 *
 * Usage: $('element Selector').paperAccordion(options);
 *
 * Options are configurable part of a plugin, with the first implementation it
 * includes
 *
 * single : boolean
 *
 * if set to false the user will be able to open multiple accordion tabs at once.
 *
 * @author Sandeep Shukla/Oracle (sandeep.shukla@oracle.com)
 * @version 1.0
 */
/*globals jQuery*/
(function($) {
  "use strict";
  var PaperAccordion = window.PaperAccordion || {};

  PaperAccordion = function(el, options) {
    var self = this;

    self.$el = $(el);
    self.el = el;

    self.$el.data("paperAccordion", self);

    var init = function() {
      self.options = $.extend({}, PaperAccordion.defaultOptions, options);
      self.$el.find(".card-body").hide();

      self.$el.find(".card").css({
        "-webkit-transition": (self.options.transitionTime / 1000) + "s",
        "-moz-transition": (self.options.transitionTime / 1000) + "s",
        "-o-transition": (self.options.transitionTime / 1000) + "s",
        "transition": (self.options.transitionTime / 1000) + "s"
      });
      self.$el.find(".card-header").css({
        "-webkit-transition": (self.options.transitionTime / 1000) + "s",
        "-moz-transition": (self.options.transitionTime / 1000) + "s",
        "-o-transition": (self.options.transitionTime / 1000) + "s",
        "transition": (self.options.transitionTime / 1000) + "s"
      });

      self.$el.find(".card-header").on("click", function(item, param) {
        var clickedOn = this,
          compareText = "";
        self.$el.find(".card-header").each(function(index, item) {
          if (item === clickedOn) {
            self.options.currentActive = index + 1;
          }
        });

        if ($(this).attr("disabled")) {
          return false;
        }

        if (param === "open" && $(this).parent().attr("class").indexOf("active") !== -1) {
          return false;
        }
        compareText = $.trim($(this).find(".card-title").text());
        if (self.options.single) {
          $(this).closest(".accordion").find(".active").each(function() {
            if ($.trim($(this).find(".card-header").text()) !== compareText) {
              $(this).removeClass("active")
                .removeClass("zoom")
                .find(".card-body")
                .slideToggle(self.options.transitionTime);
              $(this).find(".card-header")
                .find(".collapse-icon")
                .toggleClass("icon-arrow-right")
                .toggleClass("icon-arrow-down");
            }
          });
        }

        $(this).closest(".card")
          .toggleClass("active")
          .toggleClass(self.options.zoom ? "zoom" : "")
          .find(".card-body")
          .slideToggle(self.options.transitionTime);

        $(this).find(".collapse-icon")
          .toggleClass("icon-arrow-right")
          .toggleClass("icon-arrow-down");

      });

      $(self.$el.find(".card-header")[self.options.defaultOpen - 1]).find(".collapse-icon")
        .toggleClass("icon-arrow-right")
        .toggleClass("icon-arrow-down")
        .closest(".card")
        .toggleClass("active")
        .toggleClass(self.options.zoom ? "zoom" : "")
        .find(".card-body")
        .slideToggle(self.options.transitionTime);

      if (self.options.disableOthers) {
        self.$el.find(".card-header").each(function() {
          if (!$(this).closest(".card").hasClass("active")) {
            $(this).addClass("disabled").attr("disabled", "disabled");
          }
        });
      }
    };

    init();
    return PaperAccordion;
  };

  /**
   * This function will allow user to enable a panel by providing index of panel {starting from 1}.
   * @param int
   * @return htmlElement
   */
  PaperAccordion.prototype.enable = function(index) {
    var self = this;
    return $(self.$el.find(".card-header")[+index - 1]).removeClass("disabled").removeAttr("disabled");
  };

  /**
   * This function will allow user to enable all panels.
   * @param int
   * @return htmlElement
   */
  PaperAccordion.prototype.enableAll = function() {
    var self = this;
    return $.each(self.$el.find(".card-header"), function() {
      $(this).removeClass("disabled").removeAttr("disabled");
    });
  };

  /**
   * This function will allow user to open a panel by providing index of panel {starting from 1}.
   * Calling this method will make sure that in case the panel is already open, it should not
   * be closed.
   * @param int
   * @return htmlElement
   */
  PaperAccordion.prototype.open = function(index) {
    var self = this;
    this.enable(index);
    return $(self.$el.find(".card-header")[+index - 1]).trigger("click", "open");
  };

  /**
   * This function will allow user to close a panel by providing index of panel {starting from 1}.
   * @param int
   * @return htmlElement
   */
  PaperAccordion.prototype.close = function(index) {
    var self = this;
    this.enable(index);
    return $(self.$el.find(".card-header")[+index - 1]).trigger("click", "close");
  };

  /**
   * This function will allow user to disable a panel by providing index of panel {starting from 1}.
   * @param htmlElement
   * @return htmlElement
   */
  PaperAccordion.prototype.disable = function(elem) {
    return $(elem).addClass("disabled").attr("disabled", "disabled");
  };

  /**
   * This function will allow user to get index of current active panel{starting from 1}.
   * @return int
   */
  PaperAccordion.prototype.getCurrentActive = function() {
    var self = this;
    return self.options.currentActive;
  };

  /*
   * Below are the default options provided, and the purpose they serve.
   *
   * single - boolean -       If set to false, user will be able to open multiple
   *                          accordion sliders at once, by default user can open
   *                          only one tab at a time.
   *
   * transitionTime - int     Transition time in milliseconds. Default 400ms.
   *
   * defaultOpen - int        Open the specified panel by default.
   *
   * disableOthers - boolean  If set to true, will disable all the other panels, developer
   *                          would have to manually activate the next panel.
   *
   */
  PaperAccordion.defaultOptions = {
    single: true,
    transitionTime: 400,
    defaultOpen: 1,
    disableOthers: false,
    currentActive: 1,
    zoom: true
  };

  $.fn.paperAccordion = function(options) {
    return this.each(function() {
      (new PaperAccordion(this, options));
    }).data("paperAccordion");
  };

}(jQuery));
