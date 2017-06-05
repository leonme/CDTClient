/**
 * Defines helpers for URL.
 
 * Date: 29/10/14
 * (c) Copyright 2013-2014 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.galilei.ui5.utils.Url");

(function () {
    "use strict";

    /**
     * @class
     * Defines helpers for URL.
     * @public
     */
    sap.galilei.ui5.utils.Url = sap.galilei.core.defineClass({
        // Define class name
        fullClassName: "sap.galilei.ui5.utils.Url",

        // Define static members
        statics: {
            /**
             * Gets the current web page protocol. Example: http: or https:
             */
            protocol: {
                get: function () {
                    if (location) {
                        return location.protocol;
                    }
                    return "";
                }
            },

            /**
             * Gets the current web page host name (possibly doted name).
             */
            hostName: {
                get: function () {
                    if (location) {
                        return location.hostname;
                    }
                    return "";
                }
            },

            /**
             * Gets the current web page port. Example: 8080
             */
            port: {
                get: function () {
                    if (location) {
                        return location.port;
                    }
                    return "";
                }
            },

            /**
             * Gets the current web page host name and port. Example: hostname:8080
             */
            host: {
                get: function () {
                    if (location) {
                        return location.host;
                    }
                    return "";
                }
            },

            /**
             * Gets the current web page protocol, host name and port. Example: https://serverdomainname:8080
             */
            origin: {
                get: function () {
                    if (location) {
                        return location.origin || (location.protocol + "//" + location.host);
                    }
                    return "";
                }
            },

            /**
             * Gets the current web page path name. Example: /powerdesigner-web/resources/index.html
             */
            pathName: {
                get: function () {
                    if (location) {
                        return location.pathname;
                    }
                    return "";
                }
            },

            /**
             * Gets the current web page hash (parameters). Example: https://serverdomainname:8080/powerdesigner-web/resources/index.html#appPage|%7B%22id%22%3A%22workspace-Workspace%22%2C%22viewName%22%3A%22workspace.Workspace%22%7D|1
             */
            hash: {
                get: function () {
                    if (location) {
                        return location.hash;
                    }
                    return "";
                }
            },

            /**
             * Gets the current web page full URL. Example: #appPage|%7B%22id%22%3A%22workspace-Workspace%22%2C%22viewName%22%3A%22workspace.Workspace%22%7D|1
             */
            href: {
                get: function () {
                    if (location) {
                        return location.href;
                    }
                    return "";
                }
            },

            /**
             * Defines the web application context. Example: /powerdesigner-web
             */
            applicationContext: {
                field: "_applicationContext",
                get: function () {
                    var sContext = this._applicationContext,
                        sApplicationResources,
                        index;

                    if (!sContext) {
                        sContext = this.pathName;
                        if (sContext) {
                            // Removes the page name.
                            index = sContext.lastIndexOf("/");
                            if (index !== -1) {
                                sContext = sContext.substring(0, index);
                                // Removes the last part (application resources) of path name.
                                index = sContext.lastIndexOf("/");
                                if (index !== -1) {
                                    sApplicationResources = sContext.substring(index);
                                    if (sApplicationResources && this.applicationResources &&
                                            sApplicationResources.toLowerCase() === this.applicationResources.toLowerCase()) {
                                        sContext = sContext.substring(0, index);
                                    }
                                }
                            }
                        }
                    }
                    return sContext;
                },
                set: function (sContext) {
                    this._applicationContext = sContext;
                }
            },

            /**
             * Defines the web application resources folder. Example: /resources
             */
            applicationResources: "/resources",

            /**
             * Gets the full URL and append the relative path. Example: http://serverdomainname:8080/powerdesigner-web/<path>.
             * @param {string} sRelativePath The relative path.
             * @param {boolean} bIncludeResources Indicates whether the URL should include the /resources path.
             * @param {boolean} bEncodeURL Indicates whether the URL should ne encoded.
             * @returns {string}
             */
            getFullUrl: function (sRelativePath, bIncludeResources, bEncodeURL) {
                var sURL = this.origin + this.getAbsolutePath(sRelativePath, bIncludeResources);

                if (sURL && bEncodeURL) {
                    sURL = this.encodeUrl(sURL);
                }
                return sURL;
            },

            /**
             * Gets the absolute path. Example: /powerdesigner-web/resources/pages/printDiagram.html
             * @param {string} sRelativePath The relative path.
             * @param {boolean} bIncludeResources Indicates whether the URL should include the /resources path. Default: false.
             * @returns {string}
             */
            getAbsolutePath: function (sRelativePath, bIncludeResources) {
                var sPath = "";

                if (sRelativePath) {
                    if (sRelativePath.substring(0, 1) !== "/") {
                        sPath = "/";
                    }
                    sPath += sRelativePath;
                }
                if (bIncludeResources && this.applicationResources !== undefined) {
                    sPath = this.applicationResources + sPath;
                }
                return this.applicationContext + sPath;
            },

            /**
             * Encodes a URL.
             * @param {string} sURL The URL.
             * @returns {string}
             */
            encodeUrl: function (sURL) {
                if (sURL && window.encodeURI) {
                    return encodeURI(sURL);
                }
                return sURL;
            },

            /**
             * Decodes a URL.
             * @param {string} sURL The URL.
             * @returns {string}
             */
            decodeUrl: function (sURL) {
                if (sURL && window.decodeURI) {
                    return decodeURI(sURL);
                }
                return sURL;
            },

            /**
             * Encodes a URI component.
             * @param {string} sURI The URI.
             * @returns {string}
             */
            encodeURIComponent: function (sURI) {
                if (sURI && window.encodeURIComponent) {
                    return encodeURIComponent(sURI);
                }
                return sURI;
            },

            /**
             * Decodes a URI component.
             * @param {string} sURI The URI.
             * @returns {string}
             */
            decodeURIComponent: function (sURI) {
                if (sURI && window.decodeURIComponent) {
                    return decodeURIComponent(sURI);
                }
                return sURI;
            },

            /*
             * Opens a new tab window.
             */
            openUrlInNewTab: function (sURL, sWindowName, sOptions) {
                var oTabWindow;

                sWindowName = sWindowName || "_blank";
                // Workaround for IE: Make sure that the new window can be resized, take the full screen.
                if (!sOptions && (navigator.appVersion.indexOf("MSIE 9") !== -1 || navigator.appVersion.indexOf("MSIE 10") !== -1 || navigator.appVersion.indexOf("MSIE 11") !== -1 || navigator.appVersion.indexOf("rv:11.0")) !== -1) {
                    sOptions = "resizable=yes, scrollbars=yes, top=0, left=0";
                    if (window.screen && window.screen.availWidth && window.screen.availHeight) {
                        sOptions += ", width=" + window.screen.availWidth + ", height=" + window.screen.availHeight;
                    }
                }

                if (sURL && window && window.open) {
                    oTabWindow = window.open(sURL, sWindowName, sOptions);
                    if (oTabWindow && oTabWindow.focus) {
                        setTimeout(function () {
                            oTabWindow.focus();
                        }, 1000);
                    }
                }
                return oTabWindow;
            }
        }
    });
}());