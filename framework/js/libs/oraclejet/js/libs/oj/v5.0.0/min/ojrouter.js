/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore","knockout","signals","promise"],function(e,t,r){var n;!function(){var n,o,i,a,u,s="/",l="oj_Router",c=" | ",f=1024,h="popstate",d="hasChanged",p={hasChanged:!1},g=!1,v=[],_=window.location,m="parameters";function b(e){return e?e.split("/"):[]}function R(e){return $(b(e)[0])}function w(t,r){var n=document.createElement("a");return n.href=_.href,void 0!==t.search&&(n.search=t.search),void 0!==t.pathname&&(n.pathname=t.pathname),n.search=function(t,r){var n,o,i="",a=t.indexOf(l);if(-1!==a){var u=t.indexOf("&",a);-1===u&&(u=t.length),n=t.substring(0,a),o=t.substr(u)}else n=t+(-1===t.indexOf("?")?"?":"&"),o="";r&&Object.getOwnPropertyNames(r).length>0?i=function(t){var r=JSON.stringify(t),n=encodeURIComponent(r),o=e.LZString.compressToEncodedURIComponent(r),i=!1,a=l+"=";o.length<=n.length&&(i=!0);a+=i?"1"+o:"0"+n;if(a.length>f)throw new Error("Size of bookmarkable data is too big.");return a}(r):n=n.substring(0,n.length-1);return n+i+o}(n.search,r),n.href.replace(/\?$/,"")}function S(e){return e._parentRouter?S(e._parentRouter)+"."+e._name:e._name}function y(e,t){var r;return e._childRouters.every(function(e){if(e._parentState){if(e._parentState===t)return r=e,!1}else r=e;return!0}),r}function I(t){var r=t.filter(function(e){return e.value!==e.router._stateId()});return e.Logger.option("level")===e.Logger.LEVEL_INFO&&(e.Logger.info("Potential changes are: "),r.forEach(function(t){e.Logger.info("   { router: %s, value: %s }",t.router&&S(t.router),t.value)})),r}function E(e){var t=this[e.router._name];void 0!==t&&(e.router._extra=t)}function C(){return v[0]&&v[0].cancel}function L(t){var r,n,o=t.charAt(0);if(t=t.slice(1),"0"===o)t=decodeURIComponent(t);else{if("1"!==o)throw new Error("Error retrieving bookmarkable data. Format is invalid");t=e.LZString.decompressFromEncodedURIComponent(t)}if(r=JSON.parse(t),e.Logger.option("level")===e.Logger.LEVEL_INFO)for(n in e.Logger.info("Bookmarkable data: "),r)e.Logger.info("   { router: %s, value: %s }",n,r[n]);return r}function x(e,t,r){var n;return e._childRouters.every(function(e){return!((!e._parentState||e._parentState===r)&&e.stateFromIdCallback(t))||(n=e,!1)}),n}function P(t){e.Router._transitionedToState.dispatch(t)}function O(e,t){this.router=e,this.value=t}function k(e){var t,r,n=e[e.length-1];for(n?(t=n.router,r=R(n.value)):(t=u,(r=u._defaultStateId)&&e.push(new O(t,r)));t=y(t,r);)(r=t._defaultStateId)&&e.push(new O(t,r));var o=function e(t){var r=[];return t._currentState()&&(r.push(new O(t)),t._childRouters.forEach(function(t){r=r.concat(e(t))})),r}(u),i=[];return o.forEach(function(t,r){var n=e[r];n&&t.router===n.router||i.unshift(t)}),e=i.concat(e)}function j(t,r,n){var o=t();return o||e.Logger.info("%s is false for state: %s",r,n),o}function A(e,t,r,n){return"function"==typeof e&&(t=t?t.then(function(t){return t&&(t=j(e,r,n)),t}):new Promise(function(t){t(j(e,r,n))})),t}function U(t){var r;return C()?Promise.resolve(!1):(e.Logger.info("Start _canExit."),r=t?null===(r=function e(t,r){var n,o=t._currentState();if(o){for(n=0;n<t._childRouters.length;n++)r=e(t._childRouters[n],r);r=A(o.viewModel&&o.viewModel.canExit?o.viewModel.canExit:o._canExit,r,"canExit",o._id)}return r}(t,null))?Promise.resolve(!0):r.then(function(e){return e&&!C()}):Promise.resolve(!0))}function M(t,r){if(C())return Promise.resolve();e.Logger.info("Start _canEnter.");var n=null;return t.forEach(function(e){var t=e.getState();t&&(n=A(t._canEnter,n,"canEnter",t._id))}),n=null===n?Promise.resolve({allChanges:t,origin:r}):n.then(function(e){var n;return e&&!C()&&(n={allChanges:t,origin:r}),n})}function F(t){if(!t)return Promise.resolve(p);var r,n=Promise.resolve().then(function(){e.Logger.info("Entering _updateAll."),e.Router._updating=!0}),o=t.allChanges;return o.forEach(function(o){r=o.router.currentState.peek(),n=n.then(function(){if(!C())return function(t,r){var n=t.router.stateFromIdCallback(R(t.router._stateId())),o=t.getState();return Promise.resolve().then(function(){e.Logger.option("level")===e.Logger.LEVEL_INFO&&e.Logger.info("Updating state of %s to %s.",S(t.router),t.value)}).then(n?n._exit:void 0).then(function(){var e,n,i,a=t.router;if("popState"===r){for(e=(n=a._navHistory.length)-1;e>=0;e--)if(a._navHistory[e]===t.value){i=!0,a._navHistory.splice(e,n-e);break}n-e==1&&(a._navigationType="back")}if(i||(delete a._navigationType,a._navHistory.push(R(a._stateId()))),t.value&&o){var u=b(t.value);o._paramOrder.forEach(function(e,t){var r=$(u[t+1]);r!==o._parameters[e]&&(o._parameters[e]=r)})}a._stateId(t.value)}).then(o?o._enter:void 0)}(o,t.origin)})}),n.then(function(){var t,n,i=!1;if(o.length){i=!C();var a=o[o.length-1];t=a.router,n=a.state}return e.Router._updating=!1,e.Logger.info("_updateAll returns %s.",String(i)),{hasChanged:i,router:t,oldState:r,newState:n}},function(t){return e.Router._updating=!1,Promise.reject(t)})}function T(e){var t;try{t=I(t=o.parse())}catch(e){return Promise.reject(e)}return M(t,e).then(F)}function H(t,r){if(e.Logger.option("level")===e.Logger.LEVEL_INFO){var n=r.path?"path="+r.path:"",o=r.deferredHandling?"deferredHandling=true":"",i=r.router?S(r.router):"null";e.Logger.info(">> %s: origin=%s router=%s %s %s",t,r.origin,i,n,o)}}function N(){var t,r=v[0];return H("Resolving",r),r.cancel?(H("Cancelled",r),t=Promise.resolve(p)):t=function(e){if(H("Executing",e),!e.deferredHandling){if("sync"===e.origin)return T();if("popState"===e.origin)return U(e.router).then(function(t){return t?T(e.origin):Promise.resolve(p)})}return e.router._go(e)}(r),t.then(function(e){if(H("Done with",v.shift()),!0===e[d]){var t,r=function e(t){if(!t)return{title:"",segment:""};var r=e(y(t,t._stateId()));if(""===r.title){var n=t._currentState();if(n){var o=n._title;void 0!==o?("function"==typeof o&&(o=o()),r.title=String(o)):void 0!==(o=n._label)&&(o=String(o),""!==r.segment&&(o+=c+r.segment),r.segment=o)}}return r}(u);""!==r.title?t=r.title:n&&n.length>0?(t=n,""!==r.segment&&(t+=c+r.segment)):t=r.segment,t!==window.document.title&&(window.document.title=t)}return P(e),e},function(t){return v=[],e.Logger.error("Error when executing transition: %o",t||"Unknown"),P(p),Promise.reject(t)})}function D(t){var r,n;H("Queuing  ",t);t.path,e.Context.getPageContext().getBusyContext();return 1===(n=v.push(t))?a=N():((r=v[n-2]).deferredHandling||(H("Cancelling",r),r.cancel=!0),a=a.then(N)),a}function V(){var t,r,n=R(u._stateId()),o=null;if(e.Logger.info("Handling popState event with URL: %s",_.href),n)for(t=0;t<u._childRouters.length;t++)if(n===(r=u._childRouters[t])._parentState){o=r;break}D({router:o,origin:"popState"})}function B(){g||(o||(o=new e.Router.urlPathAdapter),o.init(s),n=window.document.title,window.addEventListener(h,V,!1),e.Logger.info("Initializing rootInstance."),e.Logger.info("Base URL is %s",s),e.Logger.info("Current URL is %s",_.href),g=!0)}function Z(e){var t=e;return t&&t.replace&&(t=(t=t.replace(/~/g,"~0")).replace(/\//g,"~1")),t}function $(e){var t=e;return t&&t.replace&&(t=(t=t.replace(/~1/g,"/")).replace(/~0/g,"~")),t}O.prototype.getState=function(){return this.state||this.value&&(this.state=this.router.stateFromIdCallback(R(this.value))),this.state},O.prototype.addParameter=function(e){e&&(this.value+="/"+e)},e.Router=function(e,r,n){var o=this;function i(e,r){var n={};if(n.name=r.moduleConfig.name,e){var o={};n.params=o;var i=o.ojRouter={};i.parentRouter=r,Object.defineProperty(i,"direction",{get:function(){return r._navigationType},enumerable:!0});var a,u=i[m]={},s=e[m];Object.keys(s).forEach(function(e){a=s[e],u[e]=t.observable(a)}),n.lifecycleListener=function(e){var t=r.currentState();t&&(t.viewModel=e.viewModel)}}return n}this._name=e,this._parentState=n||(r?R(r._stateId()):void 0),this._parentRouter=r,this._childRouters=[],this._extra=void 0,this._stateId=t.observable(),this._stateIdComp=t.pureComputed({read:function(){return R(this._stateId())},write:function(e){this.go(e).then(null,function(e){throw e})},owner:o}),this._states=null,this._defaultStateId=void 0,this._currentState=t.pureComputed(function(){var e=R(o._stateId());return t.ignoreDependencies(o.stateFromIdCallback,o,[e])}),this._currentValue=t.pureComputed(function(){var e,r=R(o._stateId()),n=t.ignoreDependencies(o.stateFromIdCallback,o,[r]);return n&&(e=n.value),e}),this._navigationType=void 0,this._navHistory=[],this._moduleConfig=Object.create(null,{name:{value:t.pureComputed(function(){var e,t=R(this._stateId())||this._defaultStateId||this._states[0],r=this.stateFromIdCallback(t);return r&&((e=r.value)&&"string"==typeof e||(e=r._id)),e},o),enumerable:!0},params:{value:Object.create(null,{ojRouter:{value:new function(){Object.defineProperties(this,{parentRouter:{value:o,enumerable:!0},direction:{get:function(){return o._navigationType},enumerable:!0}})},enumerable:!0}}),enumerable:!0},lifecycleListener:{value:Object.create(null,{attached:{value:function(e){var r=t.unwrap(e.valueAccessor()).params.ojRouter.parentRouter._currentState();r&&(r.viewModel=e.viewModel)},writable:!0,enumerable:!0}}),enumerable:!0}}),this._getObservableModuleConfig=function(){if(!this._observableModuleConfig){var e=o.currentState,r=e.peek(),n=t.observable(i(r,o));e.subscribe(function(e){var t=n.peek();if(t.name!=function(e){var t="oj-blank";if(e)return(t=e.value)&&"string"==typeof t||(t=e._id),t}(e))n(i(e,o));else{var r,a=t.params.ojRouter[m];for(var u in a)r=e[m][u],a[u](r)}}),this._observableModuleConfig=n}return this._observableModuleConfig},Object.defineProperties(this,{parent:{value:this._parentRouter,enumerable:!0}})},Object.defineProperties(e.Router.prototype,{name:{get:function(){return this._name},enumerable:!0},states:{get:function(){return this._states},enumerable:!0},stateId:{get:function(){return this._stateIdComp},enumerable:!0},currentState:{get:function(){return this._currentState},enumerable:!0},currentValue:{get:function(){return this._currentValue},enumerable:!0},direction:{get:function(){return this._navigationType},enumerable:!0},defaultStateId:{get:function(){return this._defaultStateId},set:function(e){this._defaultStateId=e},enumerable:!0},moduleConfig:{get:function(){return this._moduleConfig},enumerable:!0},observableModuleConfig:{get:function(){return this._getObservableModuleConfig()},enumerable:!0}}),u=new e.Router("root",void 0,void 0),e.Router.prototype.getChildRouter=function(e){var t;return e&&"string"==typeof e&&(e=e.trim()).length>0&&this._childRouters.every(function(r){return r._name!==e||(t=r,!1)}),t},e.Router.prototype.getCurrentChildRouter=function(){return y(this,R(this._stateId()||this._defaultStateId))},e.Router.prototype.createChildRouter=function(t,r){var n,o,i;for(e.Assert.assertString(t),r=r||R(this._stateId()),t=encodeURIComponent(t.trim()),n=0;n<this._childRouters.length;n++){if((o=this._childRouters[n])._name===t)throw new Error('Invalid router name "'+t+'", it already exists.');if(o._parentState===r)throw new Error('Cannot create more than one child router for parent state id "'+o._parentState+'".')}return i=new e.Router(t,this,r),this._childRouters.push(i),i},e.Router.prototype.stateFromIdCallback=function(t){return function(t,r){var n;return r&&t._states&&(e.Assert.assertString(r),t._states.every(function(e){return e._id!==r||(n=e,!1)})),n}(this,t)},e.Router.prototype.configure=function(t){return this._stateId(void 0),delete this._defaultStateId,this._navigationType=void 0,this._navHistory=[],"function"==typeof t?(this._states=null,this.stateFromIdCallback=t):(this._states=[],delete this.stateFromIdCallback,Object.keys(t).forEach(function(r){var n=t[r];this._states.push(new e.RouterState(r,n,this)),"boolean"==typeof n.isDefault&&n.isDefault&&(this._defaultStateId=r)},this)),this},e.Router.prototype.getState=function(e){return this.stateFromIdCallback(e)},e.Router.prototype.go=function(e,t){return B(),t=t||[],Array.isArray(e)&&(e=e.map(Z).join("/")),D({router:this,path:e,origin:"go",historyUpdate:t.historyUpdate})},e.Router.prototype._go=function(t){var r,n,a=!0,u=t.path,s=!1,l=!1;switch(t.historyUpdate){case"skip":l=!0;break;case"replace":s=!0}if(u){if("string"!=typeof u)return Promise.reject(new Error("Invalid object type for state id."));a=!1}if(a&&!(u=this._defaultStateId))return e.Logger.info(function(){return"Undefined state id with no default id on router "+S(this)}),Promise.resolve(p);if("/"===u.charAt(0))r=u;else{if(!(r=function e(t){var r,n;return t?(r=e(t._parentRouter))&&((n=t._stateId())?r+=n+"/":r=void 0):r="/",r}(this._parentRouter)))return Promise.reject(new Error('Invalid path "'+u+'". The parent router does not have a current state.'));r+=u}e.Logger.info("Destination path: %s",r);try{n=k(n=function(e,t){var r,n,o,a,u,s=[],l=[],c=e,f=b(t),h=0;for(f.splice(0,1);c;)l.unshift(c),c=c._parentRouter;for(;r=f.shift();){if(a){if(a._paramOrder[h]){u.addParameter(r),h++;continue}h=0}if(!(c=l.shift())&&!(c=x(n,r,o)))return i=t,s;if(!(a=(u=new O(c,r)).getState()))throw new Error('Invalid path "'+t+'". State id "'+r+'" does not exist on router "'+c._name+'".');s.push(u),n=c,o=r}return s}(this,r))}catch(e){return Promise.reject(e)}var c=I(n);return s||c.length>0?(e.Logger.info("Deferred mode or new state is different."),U(this).then(function(t){return t?M(c).then(F).then(function(t){if(t[d])if(l)e.Logger.info("Skip history update.");else{var r=o.buildUrlFromStates(n);e.Logger.info("%s URL to %s",s?"Replacing":"Pushing",r),window.history[s?"replaceState":"pushState"](null,"",r)}return t}):Promise.resolve(p)})):Promise.resolve(p)},e.Router.prototype.store=function(e){this._extra=e;for(var t,r,n,o,i={},a=this;a;)void 0!==a._extra&&(i[a._name]=a._extra),a=a._parentRouter;for(a=this;a;){for(r=0;r<a._childRouters.length;r++)if(n=a._childRouters[r],(o=R(a._stateId()))&&o===n._parentState){void 0!==n._extra&&(i[n._name]=n._extra),t=n;break}a=t,t=void 0}window.history.replaceState(null,"",w({},i))},e.Router.prototype.retrieve=function(){return this._extra},e.Router.prototype.dispose=function(){for(var t,r;this._childRouters.length>0;)this._childRouters[0].dispose();if(this._parentRouter){for(t=this._parentRouter._childRouters,r=0;r<t.length;r++)if(t[r]._name===this._name){t.splice(r,1);break}delete this._parentState}else s="/",o=null,this._name="root",window.document.title=n,window.removeEventListener(h,V),e.Router._transitionedToState.removeAll(),g=!1;delete this._navigationType,this._navHistory=[],this._states=null,delete this._defaultStateId,delete this._extra},e.Router._transitionedToState=new r.Signal,e.Router._updating=!1,Object.defineProperties(e.Router,{rootInstance:{value:u,enumerable:!0},transitionedToState:{value:e.Router._transitionedToState,enumerable:!0}}),e.Router.defaults={},Object.defineProperties(e.Router.defaults,{urlAdapter:{get:function(){return o||(o=new e.Router.urlPathAdapter),o},set:function(e){if(g)throw new Error("Incorrect operation. Cannot change URL adapter after calling sync() or go().");o=e},enumerable:!0,readonly:!1},baseUrl:{get:function(){return s},set:function(e){if(g)throw new Error("Incorrect operation. Cannot change base URL after calling sync() or go().");s=e?e.match(/[^?#]+/)[0]:"/"},enumerable:!0,readonly:!1},rootInstanceName:{get:function(){return u._name},set:function(t){if(g)throw new Error("Incorrect operation. Cannot change the name of the root instance after calling sync() or go().");e.Assert.assertString(t),u._name=encodeURIComponent(t.trim())},enumerable:!0,readonly:!1}}),e.Router.sync=function(){var t={router:u,origin:"sync"};return B(),e.Logger.info("Entering sync with URL: %s",_.href),i?(t.path=i,t.deferredHandling=!0,t.historyUpdate="replace",i=void 0,D(t)):e.Router._updating?(e.Logger.info("Sync called while updating, waiting for updates to end."),new Promise(function(t){e.Router._transitionedToState.addOnce(function(r){e.Logger.info("Sync updates done."),t(r)})})):D(t)},e.Router.urlPathAdapter=function(){var t="";this.init=function(e){var r=document.createElement("a");r.href=e;var n=r.pathname;"/"!==(n=n.replace(/^([^\/])/,"/$1")).slice(-1)&&(n+="/"),t=n},this.parse=function(){var r,n,o,i,a=u,s=_.pathname.replace(t,""),c=b(decodeURIComponent(s)).map($),f=[];for(e.Logger.info("Parsing: %s",s);a&&(n=c.shift());)(o=(i=new O(a,n)).getState())&&o._paramOrder.forEach(function(e){i.addParameter(c.shift())}),f.push(i),a=y(a,n);return f=k(f),(r=_.search.split(l+"=")[1])&&(r=r.split("&")[0])&&f.forEach(E,L(r)),f},this.buildUrlFromStates=function(e){for(var r,n=!1,o="",i={};r=e.pop();)r.value&&(n||r.value!==r.router._defaultStateId)&&(o=o?r.value+"/"+o:r.value,n=!0),void 0!==r.router._extra&&(i[r.router._name]=r.router._extra);return w({pathname:t+o},i)}},e.Router.urlParamAdapter=function(){this.init=function(){},this.parse=function(){var t,r,n,o,i,a=_.search,s=function(e){var t={};return(e=e.split("?")[1])&&e.split("&").forEach(function(e){var r,n=e.split(/\=(.+)?/),o=n[0];o.length&&(r=n[1]&&decodeURIComponent(n[1]),t[o]=r)}),t}(a),c=u,f=[];for(e.Logger.info("Parsing: %s",a);c;)r=s[c._name]||c._defaultStateId,r=(n=b(r)).shift(),i=new O(c,r),r&&((o=i.getState())&&o._paramOrder.forEach(function(e){i.addParameter(n.shift())}),f.push(i)),c=y(c,r);return f=k(f),(t=s[l])&&f.forEach(E,L(t)),f},this.buildUrlFromStates=function(e){for(var t,r,n,o=!1,i="",a={};t=e.pop();)t.value&&(o||t.value!==t.router._defaultStateId)&&(r="&"+t.router._name+"=",n=t.value,i=r+encodeURIComponent(n)+i,o=!0),void 0!==t.router._extra&&(a[t.router._name]=t.router._extra);return i&&(i="?"+i.substr(1)),w({search:i},a)}}}(),function(){e.LZString={compressToEncodedURIComponent:function(e){return null===e?"":function(e,t,r){if(null===e)return"";var n,o,i,a,u,s={},l={},c="",f=2,h=3,d=2,p="",g=0,v=0,_=e.length;for(u=0;u<_;u++)if(i=e[u],Object.prototype.hasOwnProperty.call(s,i)||(s[i]=h++,l[i]=!0),a=c+i,Object.prototype.hasOwnProperty.call(s,a))c=a;else{if(Object.prototype.hasOwnProperty.call(l,c)){if(c.charCodeAt(0)<256){for(n=d;n--;)g<<=1,v==t-1?(v=0,p+=r(g),g=0):v++;for(o=c.charCodeAt(0),n=8;n--;)g=g<<1|1&o,v==t-1?(v=0,p+=r(g),g=0):v++,o>>=1}else{for(o=1,n=d;n--;)g=g<<1|o,v==t-1?(v=0,p+=r(g),g=0):v++,o=0;for(o=c.charCodeAt(0),n=16;n--;)g=g<<1|1&o,v==t-1?(v=0,p+=r(g),g=0):v++,o>>=1}0==--f&&(f=Math.pow(2,d),d++),delete l[c]}else for(o=s[c],n=d;n--;)g=g<<1|1&o,v==t-1?(v=0,p+=r(g),g=0):v++,o>>=1;0==--f&&(f=Math.pow(2,d),d++),s[a]=h++,c=String(i)}if(""!==c){if(Object.prototype.hasOwnProperty.call(l,c)){if(c.charCodeAt(0)<256){for(n=d;n--;)g<<=1,v==t-1?(v=0,p+=r(g),g=0):v++;for(o=c.charCodeAt(0),n=8;n--;)g=g<<1|1&o,v==t-1?(v=0,p+=r(g),g=0):v++,o>>=1}else{for(o=1,n=d;n--;)g=g<<1|o,v==t-1?(v=0,p+=r(g),g=0):v++,o=0;for(o=c.charCodeAt(0),n=16;n--;)g=g<<1|1&o,v==t-1?(v=0,p+=r(g),g=0):v++,o>>=1}0==--f&&(f=Math.pow(2,d),d++),delete l[c]}else for(o=s[c],n=d;n--;)g=g<<1|1&o,v==t-1?(v=0,p+=r(g),g=0):v++,o>>=1;0==--f&&(f=Math.pow(2,d),d++)}for(o=2,n=d;n--;)g=g<<1|1&o,v==t-1?(v=0,p+=r(g),g=0):v++,o>>=1;for(;;){if(g<<=1,v==t-1){p+=r(g);break}v++}return p}(e,6,function(e){return n.charAt(e)})},decompressFromEncodedURIComponent:function(e){return null===e?"":""===e?null:function(e,t,n){var o,i,a,u,s,l,c,f=[],h=4,d=4,p=3,g="",v="",_={val:n(0),position:t,index:1};for(o=0;o<3;o+=1)f[o]=o;a=0,s=Math.pow(2,2),l=1;for(;l!=s;)u=_.val&_.position,_.position>>=1,0==_.position&&(_.position=t,_.val=n(_.index++)),a|=(u>0?1:0)*l,l<<=1;switch(a){case 0:for(a=0,s=Math.pow(2,8),l=1;l!=s;)u=_.val&_.position,_.position>>=1,0==_.position&&(_.position=t,_.val=n(_.index++)),a|=(u>0?1:0)*l,l<<=1;c=r(a);break;case 1:for(a=0,s=Math.pow(2,16),l=1;l!=s;)u=_.val&_.position,_.position>>=1,0==_.position&&(_.position=t,_.val=n(_.index++)),a|=(u>0?1:0)*l,l<<=1;c=r(a);break;case 2:return""}f[3]=c,i=v=c;for(;;){if(_.index>e)return"";for(a=0,s=Math.pow(2,p),l=1;l!=s;)u=_.val&_.position,_.position>>=1,0==_.position&&(_.position=t,_.val=n(_.index++)),a|=(u>0?1:0)*l,l<<=1;switch(c=a){case 0:for(a=0,s=Math.pow(2,8),l=1;l!=s;)u=_.val&_.position,_.position>>=1,0==_.position&&(_.position=t,_.val=n(_.index++)),a|=(u>0?1:0)*l,l<<=1;f[d++]=r(a),c=d-1,h--;break;case 1:for(a=0,s=Math.pow(2,16),l=1;l!=s;)u=_.val&_.position,_.position>>=1,0==_.position&&(_.position=t,_.val=n(_.index++)),a|=(u>0?1:0)*l,l<<=1;f[d++]=r(a),c=d-1,h--;break;case 2:return v}if(0==h&&(h=Math.pow(2,p),p++),f[c])g=f[c];else{if(c!==d)return null;g=i+i[0]}v+=g,f[d++]=i+g[0],i=g,0==--h&&(h=Math.pow(2,p),p++)}}(e.length,32,function(r){return function(e,r){var n;t||(t={});if(!t[e])for(t[e]={},n=0;n<e.length;n++)t[e][e[n]]=n;return t[e][r]}(n,e.charAt(r))})}};var t,r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$"}(),n=/^{(\w+)}$/,e.RouterState=function(t,r,o){r=r||{},e.Assert.assertString(t);var i=(t=t.trim()).split("/");this._id=i.shift(),this._parameters={},this._paramOrder=new Array(i.length),i.forEach(function(e,t){var r=e.match(n);r&&(e=r[1],this._parameters[e]=null,this._paramOrder[t]=e)},this),this._canEnter=r.canEnter,this._canEnter&&e.Assert.assertFunctionOrNull(this._canEnter),this._enter=r.enter,this._enter&&e.Assert.assertFunctionOrNull(this._enter),this._canExit=r.canExit,this._canExit&&e.Assert.assertFunctionOrNull(this._canExit),this._exit=r.exit,this._exit&&e.Assert.assertFunctionOrNull(this._exit),this._value=r.value,this._label=r.label,this._title=r.title,this._router=o,this.viewModel=void 0,Object.defineProperties(this,{id:{value:this._id,enumerable:!0},value:{get:function(){return this._value},set:function(e){this._value=e},enumerable:!0},label:{get:function(){return this._label},set:function(e){this._label=e},enumerable:!0},title:{get:function(){return this._title},set:function(e){this._title=e},enumerable:!0},canEnter:{get:function(){return this._canEnter},set:function(e){this._canEnter=e},enumerable:!0},enter:{get:function(){return this._enter},set:function(e){this._enter=e},enumerable:!0},canExit:{get:function(){return this._canExit},set:function(e){this._canExit=e},enumerable:!0},exit:{get:function(){return this._exit},set:function(e){this._exit=e},enumerable:!0},parameters:{get:function(){return this._parameters},enumerable:!0}})},e.RouterState.prototype.go=function(){return this._router?this._router.go(this._id):(e.Router._transitionedToState.dispatch({hasChanged:!1}),Promise.reject(new Error("Router is not defined for this RouterState object.")))},e.RouterState.prototype.isCurrent=function(){if(!this._router)throw new Error("Router is not defined for this RouterState object.");return this._router._stateId()===this._id}});