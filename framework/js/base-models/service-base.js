/**
 * Service Base contains all the network methods to fire middleware requests.
 * @module baseService
 * @requires jquery
 * @requires baseModel
 * @requires framework/js/constants/constants
 * @requires platform
 */
define([
    "jquery",
    "baseModel",
    "framework/js/constants/constants",
    "platform"
], function ($, BaseModel, Constants, Platform) {
    "use strict";
    /**
     * Service Base contains all the network methods to fire middleware requests.
     * @class
     * @alias BaseService
     * @memberof module:baseService
     * @hideconstructor
     */
    var BaseService = function() {
            /**
             * Assign <code>this</code> to <code>self</code>.
             * @member {Object}
             */
            var self = this,
                /**
                 * Creates a map of requests to handle repost.
                 * @member {Object}
                 */
                map = {},
                /**
                 * Creates a map of requests to handle throttled fetch requests.
                 * @member {Object}
                 */
                fetchPromiseMap = {},
                /**
                 * Creates a map of eTags per request URL.
                 * @member {Object}
                 */
                eTags = {},
                /**
                 * Holds the current active request count.
                 * @member {Number}
                 */
                counter = 0,
                /**
                 * Array to hold the nonce values to be set for each middleware request.
                 * @member {Array}
                 */
                nonceKeys = [],
                /**
                 * Instance of [BaseKOModel]{@linkcode BaseKOModel}.
                 * @member {BaseKOModel}
                 */
                baseModel = BaseModel.getInstance(),
                /**
                 * Boolean to determine whether the request is a mock request.
                 * @type {Boolean}
                 */
                isMocked = false,
                /**
                 * Stores the base URL of the middleware request, uses local JSON path if request is mocked.<br>
                 * Uses [appBaseURL]{@linkcode Constants.appBaseURL} to determine middleware root URL.
                 * @type {String}
                 */
                baseUrl = isMocked ? "../json/" : Constants.appBaseURL,
                /**
                 * Boolean to enable/disable nonce.
                 * @type {Boolean}
                 */
                nonceEnabled = true,
                /**
                 * Stores success/failure for batch requests.
                 * @type {Boolean}
                 */
                batchSuccess = true,
                /**
                 * Hold the platform properties.
                 * @type {function}
                 */
                platform,
                /**
                 * Array of jQuery [Deferred]{@linkcode http://api.jquery.com/category/deferred-object/} to hold state of nonce request.
                 * @type {Array.<Deferred>}
                 */
                isNonceFetched = [],
                /**
                 * A boolean which holds the state for current pending nonce.
                 * @type {Boolean}
                 */
                isNoncePending = false,
                setRequestHeader = function (xhr, headers) {
                for (var header in headers) {
                        if (headers[header]) {
                            xhr.setRequestHeader(header, headers[header]);
                        }
                    }
                },
                /**
                 * This function return the resource path.
                 * @function getResourcePath
                 * @memberof BaseService
                 * @inner
                 * @param  {String} url     URL String
                 * @param  {String} [version] version of the application
                 * @return {String}          resource path
                 */
                getResourcePath = function (url, version) {
				version = version || Constants.appDefaultVersion;
                var serverURL = platform("getServerURL");
                    if (serverURL) {
                        return url.replace(serverURL + baseUrl, "").replace("/" + version + "/", "");
                    }
                    return url.replace(baseUrl, "").replace("/" + version + "/", "");
                },
                /**
                 * This function strips out empty query parameters from the URL.
                 * @function normalizeURL
                 * @memberof BaseService
                 * @inner
                 * @param  {String} url The URL to clean.
                 * @return {String}     Normalized URL is returned.
                 */
                normalizeURL = function (url) {
                    if (url.split("?").length > 1) {
                        return url.split("?")[0] + "?" + url.split("?").pop().replace(/(&?)\w+=(?:&|undefined(&)?|null(&)?|$)/g, "$1").replace(/&$/, "");
                    }
                    return url;
                },
                /**
                 * This function appends user-locale information to all outgoing network requests.<br>
                 * Uses [add]{@linkcode BaseModel} method from <code>QueryParams</code> to append <code>locale</code> query parameter picked from current user locale from <code>oj.Config.getLocale()</code>.
                 * @function addUserLocale
                 * @memberof BaseService
                 * @inner
                 * @param  {String} url The URL to which user-locale query parameter is to be added.
                 * @return {String}     Returns the URL with <code>locale</code> query parameter which holds user-locale code.
                 */
                addUserLocale = function (url) {
                    return baseModel.QueryParams.add(url, {
                        locale: baseModel.getLocale()
                    });
                },

                /**
                 * The generic function which serves as <code>completeHandler</code> for all ajax requests.
                 * @function genericCompleteHandler
                 * @inner
                 * @memberof BaseService
                 * @param  {jQuery.jqXHR} jqXHR      The jqXHR object returned from jQuery [ajax]{@linkcode http://api.jquery.com/jquery.ajax/} call.
                 * @param  {String} textStatus       The string categorizing the status of the request viz.<br><code>"success"</code>, <code>"notmodified"</code>, <code>"nocontent"</code>, <code>"error"</code>, <code>"timeout"</code>, <code>"abort"</code>, or <code>"parsererror"</code><br>
                 *                                   For more details, see [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings}.
                 * @returns {void}
             */
            genericCompleteHandler = function(jqXHR, textStatus) {
                var eTag;
                if (this && this.type !== "GET") {
                    delete map[this.type + this.url];
                }
                batchSuccess = true;
                var key = JSON.parse(jqXHR.getResponseHeader("x-nonce"));
                if (key && key.nonce) {
                    nonceKeys = nonceKeys.concat(JSON.parse(jqXHR.getResponseHeader("x-nonce")).nonce);
                    nonceEnabled = true;
                } else {
                    nonceEnabled = false;
                }
                if (this && this.url && this.type === "GET") {
                    eTag = jqXHR.getResponseHeader("ETag");
                    if (eTag) {
                        eTags[this.url] = eTag;
                    }
                }
                Constants.currentServerDate.setTime(new Date(jqXHR.getResponseHeader("Date")).getTime());
                if (jqXHR.status === 403) {
                    var options = {};
                    options.url = "me";
                    options.type = "GET";
                    options.contentType = "application/json";
                    options.complete = function(jqXHR1) {
                        if (jqXHR1.status === 401) {
                            window.location.search="";
                        }
                    };

                    if (self.getResourceURL("me", this.version) !== this.url) {
                        // Noncompliant@+1 {{Move the declaration of "fireAjax" before this usage.}}
                        // eslint-disable-next-line no-use-before-define
                        fireAjax(options, {});
                    }
                }
                if (jqXHR.getResponseHeader("BATCH_ID")) {
                    for (var i = 0; i < jqXHR.responseJSON.batchDetailResponseDTOList.length; i++) {

                        key = JSON.parse(jqXHR.responseJSON.batchDetailResponseDTOList[i].header["x-nonce"] || "{}");
                        if (key && key.nonce) {
                            nonceKeys.push(key.nonce[0]);
                        }
                        if (jqXHR.responseJSON.batchDetailResponseDTOList[i].status >= 400) {
                            batchSuccess = false;
                        }
                    }
                    if (!batchSuccess) {
                        baseModel.showMessages(jqXHR);
                    }
                } else {
                    if (this.showMessage) {
                        baseModel.showMessages(jqXHR);
                    }
                    if (textStatus === "timeout" && this.timeoutMessage) {
                        baseModel.showMessages(null, [this.timeoutMessage], "ERROR");
                    }
                }
                if (jqXHR.status === 417) {
                    baseModel.showMessages(jqXHR);
                    jqXHR.abort();
                    counter--;
                    this.url = getResourcePath(this.url, this.version);
                        // Noncompliant@+1 {{Move the declaration of "fireBatchAjax" before this usage.}}
                        // eslint-disable-next-line no-use-before-define
                    baseModel.showAuthScreen(jqXHR, this, this.requestType === "batch" ? fireBatchAjax : this.requestType === "upload" ? self.uploadFile : fireAjax, this.success);
                        return false;
                    }
                if (this && !this.selfLoader) {
                    counter--;
                }
                if (counter === 0) {
                    setTimeout(function() {
                        if (counter === 0) {
                            $(".se-pre-con").fadeOut("slow");
                        }
                    }, 100);
                    baseModel.lastUpdatedTime(new Date());
                }
            },

                /**
                 * Method to fetch nonce keys for base service. This method will fire a
                 * POST request and based fetch nonce keys from the response header
                 * and add them to [nonceKeys]{@linkcode BaseService~nonceKeys} array, from which a key is popped and added to each
                 * going request.
                 * @function getNonceForServiceInstance
                 * @memberof BaseService
                 * @instance
                 * @param  {Number} [nonceCount=15]      The number of nonce requested.
                 * @param  {Number} [otp]                The OTP for the current request.
                 * @param  {Number} [referenceNumber]    Reference Number for the current request.
                 * @returns {void}
                 */
            getNonceForServiceInstance = function(nonceCount) {
                if ((nonceEnabled || nonceCount) && (nonceKeys.length < 3 || nonceCount) && !isNoncePending) {
                    isNoncePending = true;
                    var options = {};
                    var currentNonce = $.Deferred();
                    options.type = "POST";
                    options.contentType = "application/json";
                    options.showMessage = true;
                    options.headers = {
                        "x-noncecount": nonceCount ? nonceCount : 15
                    };
                    options.complete = function(jqXHR) {
                        genericCompleteHandler.apply(this, [jqXHR]);
                        currentNonce.resolve();
                        isNoncePending = false;
                    };

                    $("body").removeClass("loaded");
                    counter++;
                    isNonceFetched.push(currentNonce);
                    Platform.getInstance().then(function(instance) {
                        platform = instance;
                        options.url = self.getResourceURL("session/nonce");
                        platform("addHeader", options.headers);
                        options.url = addUserLocale(options.url);
                        options.url = normalizeURL(options.url);
                        $.ajax(options);
                    });
                }
            },
                /**
                 * This object specifies the default ajax settings for all network calls fired via exported methods of [BaseService]{@linkcode BaseService}.<br>
                 * See [list]{@linkcode module:baseService} of all such methods.
                 * @type {Object}
                 */
                defaults = {
                    type: "GET",
                    url: "",
                    async: true,
                    contentType: "application/json",
                    throttle: true,
                    dataType: "json",
                    showMessage: true,
                selfLoader: false,
                headers: {},
                beforeSend: function(xhr) {
                    getNonceForServiceInstance();
                    setRequestHeader(xhr, {
                        "X-Helpdesk-Key": Constants.helpDeskSessionKey,
                        "X-Target-Unit": Object.prototype.hasOwnProperty.call(this.headers, "X-Target-Unit") ? this.headers["X-Target-Unit"] : Constants.currentEntity,
                        "X-Current-Module": baseModel.currentPage.module,
                        "X-Current-Component": baseModel.currentPage.component,
                        "x-nonce": nonceKeys.pop(),
                        "If-Match": eTags[this.url]
                    });
                    if (!this.selfLoader) {
                        counter++;
                        $(".se-pre-con").show();
                    }
                    if (this.type !== "GET" && !(this.headers.boundary && this.headers.boundary.indexOf("--OBDXbatch") > -1)) {
                        if (!((this.type + this.url) in map)) {
                            map[(this.type + this.url)] = this.type + this.url;
                        } else {
                            xhr.abort();
                            counter--;
                        }
                    }
                },
                complete: genericCompleteHandler
            },

                /**
                 * This function utilizes [format]{@linkcode BaseModel#format} to parameterize URL.
                 * Supports same arguments as [format]{@linkcode BaseModel#format}. See its documentation for more details.
                 * @function parameterizeURL
                 * @inner
                 * @memberof BaseService
                 */
                parameterizeURL = baseModel.format,

                /**
                 * This function clears the [isNonceFetched]{@linkcode BaseService#isNonceFetched} array based on which deferreds are resolved.
                 * @function clearIsNonceFetched
                 * @inner
                 * @memberof BaseService
                 */
                clearIsNonceFetched = function () {
                    isNonceFetched.forEach(function (deferred, index, array) {
                        if (deferred.state() === "resolved") {
                            array.splice(index, 1);
                        }
                    });
                },
                /**
                 * The main function which fires the actual <code>ajax</code> request.<br>
                 * This function is called internally from all the exported methods of [BaseService]{@linkcode BaseService}.
                 * Returns a promise which resolves/rejects with the network request.
                 * @function fireAjax
                 * @memberof BaseService
                 * @inner
                 * @param  {Object} settings The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
             * @param  {Object} params   The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
             * @return {Promise}         Returns the promise which resolves/rejects with the network request.
             */
            fireAjax = function(settings, params) {
                if (settings.nonceRequired) {
                    nonceEnabled = true;
                }
                getNonceForServiceInstance();
                return new Promise(function(resolve, reject) {
                    Promise.all(isNonceFetched).then(function() {
                        clearIsNonceFetched();
                        var options = $.extend(true, {}, defaults, settings);
                        options.version = options.version || Constants.appDefaultVersion;
                        if (!options.externalURL) {
                            options.url = self.getResourceURL(options.url, options.version);
                        }
                        if (params) {
                            options.url = parameterizeURL(options.url, params, true);
                        }
                        options.promiseResolve = resolve;
                        options.url = addUserLocale(options.url);
                        options.url = normalizeURL(options.url);
                        platform("addHeader", options.headers);
                        $.ajax(options).done(function(data, textStatus, jqXHR) {
                            resolve(data, textStatus, jqXHR);
                        }).fail(function(jqXHR, textStatus, errorThrown) {
                            if (jqXHR.status !== 417) {
                                reject(jqXHR, textStatus, errorThrown);
                            }
                        });
                    });
                });
            },

            /**
             * The main function which fires the actual batch <code>ajax</code> request.<br>
             * This function is called internally from [batch]{@linkcode BaseService#batch}.
             * @function fireBatchAjax
             * @memberof BaseService
             * @inner
             * @param  {Object} settings The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
             * @param  {Object} params   The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
             * @returns {void}
             */
            fireBatchAjax = function(settings) {
                var matches = settings.data.match(/x-nonce:\s(.*?)\r\n/g);
                getNonceForServiceInstance((nonceKeys.length - matches.length) < 0 && Math.abs(nonceKeys.length - matches.length));
                return new Promise(function(resolve, reject) {
                    Promise.all(isNonceFetched).then(function() {
                        clearIsNonceFetched();
                        matches.forEach(function(oldNonceHeader) {
                            settings.data = settings.data.replace(oldNonceHeader, "x-nonce: " + nonceKeys.pop() + "\r\n");
                        });
                        var options = $.extend(true, {}, defaults, settings);
                        options.promiseResolve = resolve;
                        var serverURL = platform("getServerURL");
                        if (serverURL) {
                            options.url = serverURL + baseUrl + "/batch";
                        } else {
                            options.url = baseUrl + "/batch";
                        }
                        platform("addHeader", options.headers);
                        $.ajax(options).done(function(data, textStatus, jqXHR) {
                            resolve(data, textStatus, jqXHR);
                        }).fail(function(jqXHR, textStatus, errorThrown) {
                            if (jqXHR.status !== 417) {
                                reject(jqXHR, textStatus, errorThrown);
                            }
                        });
                        });
                    });
                },

                /**
                 * Generates a random string using <code>Math</code> for use by [batch]{@linkcode BaseService#batch}.
                 * @function generateRandomString
                 * @inner
                 * @memberof BaseService
                 * @param  {Number} length The length of string desired
                 * @return {String}        Random string of desired length is returned.
                 */
                generateRandomString = (function (length) {
                    return function () {
                        return Math.round((Math.pow(36, length + 1) - (Math.random() * Math.pow(36, length)))).toString(36).slice(1);
                    };
                })(10),

                /**
                 * Create payload for batch request.
                 * @function buildBatchRequest
                 * @memberof BaseService
                 * @inner
                 * @param  {Object} data     The non-formatted payload parameter sent to <code>buildBatchRequest</code> for formatting.
             * @param  {String} boundary The boundary string for separating individual requests of batch request.
             * @return {Object}          The payload object to be fired is returned.
             */
            buildBatchRequest = function(data, boundary) {
                var payload = "";
                var batchPayloadFormat = {
                    boundary: "--{boundary}\r\n",
                    header: "{key}: {value}\r\n",
                    url: "\r\n{methodType} {url} HTTP/{majorminorversion}\r\n",
                    payload: "\r\n{payload}\r\n",
                    end: "--{boundary}--\r\n"
                };
                for (var i = 0; i < data.batchDetailRequestList.length; i++) {
                    payload += baseModel.format(batchPayloadFormat.boundary, {
                        boundary: boundary
                    });
                    payload += baseModel.format(batchPayloadFormat.header, {
                        key: "x-nonce",
                        value: "nonce"
                    });
                    for (var key in data.batchDetailRequestList[i].headers) {
                        if (data.batchDetailRequestList[i].headers[key] !== null) {
                            payload += baseModel.format(batchPayloadFormat.header, {
                                key: key,
                                value: data.batchDetailRequestList[i].headers[key]
                            });
                        }
                    }
                    payload += baseModel.format(batchPayloadFormat.url, {
                        methodType: data.batchDetailRequestList[i].methodType,
                        url: parameterizeURL(data.batchDetailRequestList[i].uri.value, data.batchDetailRequestList[i].uri.params, true),
                        majorminorversion: "1.1"
                    });
                    if (data.batchDetailRequestList[i].payload && data.batchDetailRequestList[i].payload.trim())
                        payload += (baseModel.format(batchPayloadFormat.payload, {
                            payload: data.batchDetailRequestList[i].payload.trim()
                        }));

                }
                return payload += (baseModel.format(batchPayloadFormat.end, {
                    boundary: boundary
                }));
            },
            /**
                 * This function sets the [fetchPromiseMap]{@linkcode BaseService#fetchPromiseMap} and deletes the saved promises after throttle period, as set by <code>framework/js/constants</code>.
                 * @function populatePromiseMap
                 * @memberof BaseService
                 * @inner
                 * @param  {Object} settings The ajax settings object.
                 * @param  {Object} params The ajax params object.
                 * @return {void}
             */
            populatePromiseMap = function(settings, params) {
                if (settings.throttle === false) return fireAjax(settings, params);
                var url = settings.url,
                    version = settings.version || Constants.appDefaultVersion;
                if (!settings.externalURL) {
                    url = version + "~" + url + "~" + (settings.headers ? settings.headers["X-Target-Unit"] : "");
                }
                if (params) {
                    url = parameterizeURL(url, params, true);
                }
                if (!fetchPromiseMap[url]) {
                    fetchPromiseMap[url] = {
                        promise: fireAjax(settings, params).then(function(data) {
                            setTimeout(function() {
                                fetchPromiseMap[url] = null;
                            }, Constants.throttleSeconds * 1000);
                            return data;
                        }).catch(function(err) {
                            setTimeout(function() {
                                fetchPromiseMap[url] = null;
                            }, Constants.throttleSeconds * 1000);
                            return err;
                        })
                    };
                }
                return fetchPromiseMap[url].promise;
            };

        /**
         * This function return the resource URL.
         * @function getResourceURL
         * @memberof BaseService
         * @inner
         * @param  {String} url     URL String
         * @param  {String} [version] version of the application
         * @return {String}         resource URL
         */
        self.getResourceURL = function(url, version) {
            var serverURL = platform("getServerURL");
            if (serverURL) {
                return serverURL + baseUrl + "/" + (version ? version : Constants.appDefaultVersion) + "/" + url;
            }
            return baseUrl + "/" + (version ? version : Constants.appDefaultVersion) + "/" + url;
        };

        /**
         * Download a file.
         * @function downloadFile
         * @instance
             * @memberof BaseService
             * @param  {Object} options The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
             * @param  {Object} params  The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
             * @returns {void}
             * @example
             * var baseService = BaseService.getInstance();
             * var options = {
             *     url: 'accounts/loan/{accountId}/schedule?media=application/pdf&fromDate={fromDate}&toDate={toDate}'
             * };
         * var params = { 'accountId': accountId, 'fromDate': fromDate, 'toDate': toDate };
         * baseService.downloadFile(options, params);
         */
        self.downloadFile = function(options, params) {
            $(".se-pre-con").show();
            options.url = self.getResourceURL(options.url, options.version);
            if (params) {
                options.url = parameterizeURL(options.url, params, true);
            }
            options.url = addUserLocale(options.url);
            options.url = normalizeURL(options.url);
            getNonceForServiceInstance();
            platform("downloadFile", options, nonceKeys.pop(), genericCompleteHandler);

        };

            /**
             * Fires a <code>POST</code> request for passed parameters. Delegates the <code>ajax</code> call to [fireAjax]{@linkcode BaseService~fireAjax}.
             * @function add
             * @memberof BaseService
             * @instance
             * @param  {Object} settings The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
             * @param  {Object} params   The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
             * @returns {Promise}        Returns the promise returned from [fireAjax]{@linkcode BaseService~fireAjax}.
             * @example
             * var baseService = BaseService.getInstance();
             * var options = {
             *     url: 'accounts/deposit/{accountId}/penalities',
             *     data: postDataToBeSent
             * };
             * var params = { 'accountId': accountId };
         * return baseService.add(options, params);
         */
        self.add = function(settings, params) {
            settings.type = "POST";
            var successHandler = settings.success;
            settings.success = function(data, status, jqXHR) {
                data = baseModel.characterEncoding(data);
                if (successHandler) {
                    successHandler(data, status, jqXHR);
                }
            };
            return fireAjax(settings, params);
        };

        /**
         * Fires a <code>GET</code> request for passed parameters and downloads an image from the OBDX Middleware.
         * @function fetchImage
         * @memberof BaseService
         * @instance
         * @param  {Object} settings The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
         * @param  {Object} params   The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
         * @returns {Promise}        Returns the promise returned which resolves with <code>src</code> content in form of Blob to display the image.
         * @example
         * var baseService = BaseService.getInstance();
         * var options = {
         *     url: "brands/{brandID}?name={resourcePath}&type=I",
         *     element: document.getElementById("myImageElement")
         * };
         * var params = {brandID: Constants.brandID, resourcePath: resourcePath};
         * return baseService.fetchImage(options, params);
         */
        self.fetchImage = function(settings, params) {
            var headers = new Headers(),
                options = $.extend(true, {}, defaults, settings);
            options.version = options.version || Constants.appDefaultVersion;
            if (!options.externalURL) {
                options.url = self.getResourceURL(options.url, options.version);
            }
            if (params) {
                options.url = parameterizeURL(options.url, params, true);
            }
            options.url = addUserLocale(options.url);
            options.url = normalizeURL(options.url);
            headers.append("X-Target-Unit", Constants.currentEntity);
            headers.append("x-nonce", nonceKeys.pop());
            var imageFetchRequest = new Request(options.url, {
                method: "GET",
                credentials: "same-origin",
                headers: headers
            });
            return fetch(imageFetchRequest).then(function(response) {
                return response.blob();
            }).then(function(blob) {
                var blobResponse = window.URL.createObjectURL(blob);
                if (options.element) {
                    options.element.src = blobResponse;
                }
                return blobResponse;
            });
        };

        /**
         * Fires a batch request for passed parameters. Delegates the <code>ajax</code> call to [fireBatchAjax]{@linkcode BaseService~fireBatchAjax}.
         * @function batch
         * @memberof BaseService
         * @instance
         * @param  {Object} settings The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
         * @param  {Object} params   The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
         * @param  {Object} data     The non-formatted payload parameter sent to <code>buildBatchRequest</code> for formatting.
         * @returns {void}
         * @example
         * var baseService = BaseService.getInstance();
         * var options = {
             *     url: 'batch'
         * };
         * baseService.batch(options, {}, batchRequestData);
         */
        self.batch = function(settings, params, data) {
            var boundary = "--OBDXbatch" + generateRandomString();
            settings.type = "POST";
            settings.contentType = "multipart/mixed";
			settings.requestType = "batch";
            settings.headers = {
                "boundary": boundary,
                "X-BATCH_TYPE": params.type,
                "X-Target-Unit": Constants.currentEntity
            };
            settings.data = buildBatchRequest(data, boundary);

            var successHandler = settings.success;
            settings.success = function(data, status, jqXHR) {
                for (var i = 0; i < data.batchDetailResponseDTOList.length; i++) {
                    data.batchDetailResponseDTOList[i].responseObj = baseModel.characterEncoding(JSON.parse(data.batchDetailResponseDTOList[i].responseText));
                }
                if (successHandler) {
                    successHandler(data, status, jqXHR);
                }
            };

            fireBatchAjax(settings, params);

        };

            /**
             * Fires an <code>PUT</code> request for passed parameters. Delegates the <code>ajax</code> call to [fireAjax]{@linkcode BaseService~fireAjax}.
             * @function update
             * @memberof BaseService
             * @instance
             * @param  {Object} settings The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
             * @param  {Object} params   The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
             * @returns {Promise}        Returns the promise returned from [fireAjax]{@linkcode BaseService~fireAjax}.
             * @example
             * var baseService = BaseService.getInstance();
             * var options = {
             *     url: 'accounts/deposit/{accountId}/penalities',
             *     data: updateData
             * };
             * var params = { 'accountId': accountId };
             * return baseService.update(options, params);
             */
            self.update = function (settings, params) {
                if (!isMocked) {
                    settings.type = "PUT";
                    return fireAjax(settings, params);
                }
            };

            /**
             * Fires a <code>PATCH</code> request for passed parameters. Delegates the <code>ajax</code> call to [fireAjax]{@linkcode BaseService~fireAjax}.
             * @function patch
             * @memberof BaseService
             * @instance
             * @param  {Object} settings The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
             * @param  {Object} params   The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
             * @returns {Promise}        Returns the promise returned from [fireAjax]{@linkcode BaseService~fireAjax}.
             * @example
             * var baseService = BaseService.getInstance();
             * var options = {
             *     url: 'accounts/deposit/{accountId}/penalities'
             * };
         * var params = { 'accountId': accountId };
         * return baseService.patch(options, params);
         */
        self.patch = function(settings, params) {
            if (!isMocked) {
                settings.type = "PATCH";
                return fireAjax(settings, params);
            }
        };

        /**
         * Fires a <code>DELETE</code> request for passed parameters. Delegates the <code>ajax</code> call to [fireAjax]{@linkcode BaseService~fireAjax}.
         * @function remove
         * @memberof BaseService
         * @instance
         * @param  {Object} settings The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
         * @param  {Object} params   The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
         * @returns {Promise}        Returns the promise returned from [fireAjax]{@linkcode BaseService~fireAjax}.
         * @example
         * var baseService = BaseService.getInstance();
         * var options = {
         *     url: 'accounts/deposit/{accountId}/penalities'
         * };
         * var params = { 'accountId': accountId };
         * return baseService.remove(options, params);
         */
        self.remove = function(settings, params) {
            if (!isMocked) {
                settings.type = "DELETE";
                settings.dataFilter = function(data) {
                    if (!data) {
                        return "{}";
                    }
                    return data;
                };
                return fireAjax(settings, params);
            }
        };

        /**
         * Fires a <code>GET</code> request for passed parameters. Delegates the <code>ajax</code> call to [fireAjax]{@linkcode BaseService~fireAjax}.
         * @function fetch
         * @memberof BaseService
         * @instance
         * @param  {Object} settings The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
         * @param  {Object} params   The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
         * @returns {Promise}        Returns the promise returned from [fireAjax]{@linkcode BaseService~fireAjax}.
         * @example
         * var baseService = BaseService.getInstance();
         * var options = {
         *     url: 'accounts/deposit/{accountId}/penalities'
         * };
         * var params = { 'accountId': accountId };
         * return baseService.fetch(options, params);
         */
        self.fetch = function(settings, params) {
            settings.type = "GET";
            var successHandler = settings.success;
            settings.success = null;
            return populatePromiseMap(settings, params).then(function(data) {
                var encodedData = baseModel.characterEncoding(data);
                if (successHandler) {
                    successHandler(encodedData);
                }
                return encodedData;
            });
        };

        /**
         * Fetches a JSON. Uses <code>json</code> plugin of <code>RequireJS</code> to fetch the JSON.
         * @function fetchJSON
         * @memberof BaseService
         * @instance
         * @param  {Object} settings The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
         * @param  {Object} params   The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
         * @returns {Promise}        Returns the promise which resolves or reject when request succeeds or fails respectively.
         * @example
         * var baseService = BaseService.getInstance();
         * var options = {
         *     url: 'dashboard/{moduleName}'
         * };
         * var params = { 'moduleName': moduleName };
         * return baseService.fetchJSON(options, params);
         */
        self.fetchJSON = function(settings, params) {
            settings.url = parameterizeURL(settings.url, params, true);
            return new Promise(function(resolve) {
                require(["json!" + settings.url], function(json) {
                    resolve(json);
                    if (settings.success) settings.success(json);
                });
            });
        };
        /**
         * This function invalidates the existing nonce in the nonce storage.
         * @function invalidateNonce
         * @memberof BaseService
         * @instance
         * @return {void}
         */
        self.invalidateNonce = function() {
            clearIsNonceFetched();
            nonceKeys.length = 0;
        };
        /**
         * Uploads a file to the server.
         * @function uploadFile
         * @memberof BaseService
         * @instance
         * @param  {Object} settings The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
         * @param  {Object} params   The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
         * @returns {void}
         * @example
         * var baseService = BaseService.getInstance();
         * var options = {
         *    url: 'brand/{brandId}',
         *    formData: form,
         *    type: 'PUT'
         * };
             * var params = { 'brandId': brandId };
             * baseService.uploadFile(options, params);
             */
            self.uploadFile = function (settings, params) {
                settings.type = "POST";
                if (!isMocked) {
                    var xhr = new XMLHttpRequest(),
                        response,

                        //Extend the settings object
                        options = $.extend(true, {}, defaults, settings);

                    //Appending the url with the context
                    options.url = self.getResourceURL(options.url, options.version);
                    if (params) {
                        options.url = parameterizeURL(options.url, params, true);
                    }
                    options.url = addUserLocale(options.url);
                    options.url = normalizeURL(options.url);
                    options.requestType = "upload";
                    //readying xhr for nonce
                    xhr.open(settings.type || "POST", options.url, true);
                    xhr.responseType = "json";

                    options.beforeSend(xhr);
                    Object.keys(options.headers).forEach(function (key) {
                        xhr.setRequestHeader([key], options.headers[key]);
                    });
                    xhr.send(options.formData);
                    return new Promise(function (resolve, reject) {
                        xhr.onreadystatechange = function () {
                            if (this.readyState === 4) {
                                if (typeof this.response === "string") {
                                    response = JSON.parse(this.response);
                                } else {
                                    response = this.response;
                                }
                                if (this.status === 200) {
                                    resolve();
                                } else if (this.status !== 417) {
                                    reject();
                                }
                                if (options.success && (this.status === 200 || this.status === 201)) {
                                    options.success(response, this.status, this);
                                } else if (options.error && this.status !== 417) {
                                    options.error(response, this.status, this);
                                }
                                this.responseJSON = response;
                                genericCompleteHandler.apply(options, [xhr]);
                            }
                        };
                    });
                }
            };
        };

        /**
         * Holds the instance of [BaseService]{@linkcode BaseService}
         * @memberof module:baseService
         * @inner
         * @type {BaseService}
         */
    var instance;

    /**
     * Creates a instance of service base and returns it.
     * @function createInstance
     * @memberof module:baseService
     * @inner
     * @return {BaseService} Instance of service base.
     */
    function createInstance() {
        var baseService = new BaseService();
        /**
         * The exported methods of base service.
         * @type {Object}
         * @name ServiceBaseExports
         * @instance
         * @property {Function} add - Fires a <code>POST</code> request. See [add]{@linkcode BaseService#add} for detailed usage and documentation.
         * @property {Function} patch - Fires a <code>PATCH</code> request. See [patch]{@linkcode BaseService#patch} for detailed usage and documentation.
         * @property {Function} fetch - Fires a <code>GET</code> request. See [fetch]{@linkcode BaseService#fetch} for detailed usage and documentation.
         * @property {Function} update - Fires an <code>PUT</code> request. See [update]{@linkcode BaseService#update} for detailed usage and documentation.
         * @property {Function} remove - Fires a <code>DELETE</code> request. See [remove]{@linkcode BaseService#remove} for detailed usage and documentation.
         * @property {Function} batch - Fires a <code>batch</code> request. See [batch]{@linkcode BaseService#batch} for detailed usage and documentation.
         * @property {Function} fetchJSON - Fetches a local <code>JSON</code>. See [fetchJSON]{@linkcode BaseService#fetchJSON} for detailed usage and documentation.
         * @property {Function} downloadFile - Download a file. See [downloadFile]{@linkcode BaseService#downloadFile} for detailed usage and documentation.
         * @property {Function} uploadFile - Upload a file. See [uploadFile]{@linkcode BaseService#uploadFile} for detailed usage and documentation.
         */
        var ServiceBaseExports = {
            add: baseService.add,
            patch: baseService.patch,
            fetch: baseService.fetch,
            update: baseService.update,
            remove: baseService.remove,
            batch: baseService.batch,
            fetchJSON: baseService.fetchJSON,
            downloadFile: baseService.downloadFile,
            fetchImage: baseService.fetchImage,
            uploadFile: baseService.uploadFile,
            getResourceURL: baseService.getResourceURL,
            invalidateNonce: baseService.invalidateNonce
        };
        return ServiceBaseExports;
    }
    return {
        /**
         * Get the Service Base instance. Checks [instance]{@linkcode module:baseService~instance} for instance. If exists, returns it, else invokes [createInstance]{@linkcode module:baseService~createInstance} to create an instance and returns it.
         * @function getInstance
         * @memberof module:baseService
         * @static
         * @returns {BaseService} The base service instance.
         */
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
});