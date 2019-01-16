/**
 * This module serves as a factory to create generic control elements for Widget specification, Form Element Control specification, etc.
 * @module base-models/control
 */
define([], function() {
  "use strict";

  /**
   * This is the constructor for the generic control element.
   * @class
   * @alias Control
   * @memberof module:base-models/control
   * @param  {String} controlName     The name of the control.
   * @param  {Object} controlParams   The parameters passed to control.
   * @param  {Object} controlMetadata The metadata held by the control.
   * @example
   * var rootControl = new Control('RowControls', {params: 'value'}, {metadata: 'metadata'});
   */
  var Control = function(controlName, controlParams, controlMetadata) {
    this.controlName = controlName;
    this.controlParams = controlParams;
    this.controlMetadata = controlMetadata;
  };

  /**
   * Utility method to extend different controls from a parent control.
   * @static
   * @memberof Control
   * @function extend
   * @param  {Function} ChildClass  The constructor of the child class.
   * @param  {Object} ParentClass The instance of the parent class.
   * @returns {void}
   * @example
   * var rootControl = new Control('RowControls', {params: 'value'}, {metadata: 'metadata'});
   * var extendedControl = function(controlName){
   *     this.someProperty = controlName;
   *     this.extendedFunction = function(args){
   *          console.log(args);
   *     };
   * };
   * Control.extend(extendedControl, rootControl);
   */
  Control.extend = function(ChildClass, ParentClass) {
    ChildClass.prototype = ParentClass;
    ChildClass.prototype.super = ParentClass.constructor;
    ChildClass.prototype.constructor = ChildClass;
  };

  /**
   * This function is available on the prototype chain of Control, and is available to each and every child created via [extend]{@linkcode Control.extend}.
   * @param  {Object} [property] Optional property whose prototype is required.
   * @return {Object}          The prototype of the invocation object or prototype of <code>property</code>, if specified.
   * @example
   * var rootControl = new Control('RowControls', {params: 'value'}, {metadata: 'metadata'});
   * var extendedControl = function(controlName){
   *       this.someProperty = controlName;
   *       this.extendedFunction = function(args){
   *         console.log(args);
   *       };
   * };
   * Control.extend(extendedControl, rootControl);
   * var secondaryControl = new extendedControl('GridControls');
   * secondaryControl.getParent(); // returns the parent prototype on which methods of parent can be invoked.
   */
  Control.prototype.getParent = function(property) {
    return Object.getPrototypeOf(property || this);
  };
  return Control;
});