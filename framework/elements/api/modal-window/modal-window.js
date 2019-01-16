define([
  "knockout",
  "jquery",
  "ojL10n!resources/nls/generic"
], function (ko, $, resourceBundle) {
  "use strict";
  /**
   * This file contains the modal-window-bindings
   * @namespace ModalWindow~viewModel
   * @member
   * @implements [ModalWindow]{@link modal-window-bindings}
   * @constructor ModalWindow
   * @property {String} dialogId - unique id for each modal
   */
  var vm = function (rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.dialogId = rootParams.id;
    self.header = rootParams.header ? rootParams.header : null;
    self.closeHandler = rootParams.closeHandler;
    self.focusedElementBeforeModal = null;
    self.modalWindowNls = resourceBundle;
    self.hideHeader = rootParams.hideHeader || false;
    self.display = rootParams.display || (self.hideHeader ? "close-header" : "normal");

    /**
    Function gets called on click of close button of modal window.
    On sucessfully closing, the back button of navigation bar is activated

    * @function closeDialog
    * @memberOf ModalWindow
    **/
    self.closeDialog = function () {
      $("#" + self.dialogId).hide();
      if (self.focusedElementBeforeModal) self.focusedElementBeforeModal.focus();
      if (self.closeHandler) {
        self.closeHandler();
      }
      $("#" + self.dialogId).off();

    };

    if (!self.header) {
      return;
    }

    $(document).on("openModal", "#" + self.dialogId, function (event, firstElementToFocus) {
      var modal = $("#" + self.dialogId)[0];
      modal.setAttribute("style", "display:flex;");
      self.focusedElementBeforeModal = document.activeElement;

      var focusableElementsString = "input:not([disabled]), a[href], area[href], select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex=\"0\"], [contenteditable]";
      if (firstElementToFocus) {
        firstElementToFocus = modal.querySelector(firstElementToFocus);
        if (!firstElementToFocus) {
          // eslint-disable-next-line no-console
          console.warn("INVALID SELECTOR. FOCUSSING THE FIRST FOCUSABLE ELEMENT");
        }

      }

      (firstElementToFocus ? firstElementToFocus : modal.querySelector("div[role=\"alert\"]")).focus();

      function trapTabKey(e) {
        var focusableElements = modal.querySelectorAll(this.focusableElementsString);

        focusableElements = Array.prototype.slice.call(focusableElements);

        var firstTabStop = focusableElements[0];
        var lastTabStop = focusableElements[focusableElements.length - 1];

        if (e.keyCode === 9) {

          if (e.shiftKey) {
            if (document.activeElement === firstTabStop) {
              e.preventDefault();
              lastTabStop.focus();
            }

          } else if (document.activeElement === lastTabStop) {
            e.preventDefault();
            firstTabStop.focus();
          }
        }

        if (e.keyCode === 27) {
          self.closeDialog();
        }
      }
      modal.addEventListener("keydown", trapTabKey.bind({
        focusableElementsString: focusableElementsString
      }));
    });
    $(document).on("closeModal", "#" + self.dialogId, self.closeDialog);
  };
  vm.prototype.dispose = function () {
    $(document).off("closeModal", "#" + this.dialogId);
    $(document).off("openModal", "#" + this.dialogId);
  };
  return vm;
});
