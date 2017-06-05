/**
 
 * Date: 23/06/15
 * (c) Copyright 2013-2015 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.galilei.ui5.utils.Device");

(function () {
    "use strict";

    /**
     * @class
     * Provides style sheet management functions.
     * @public
     */
    sap.galilei.ui5.utils.Device = sap.galilei.core.defineClass({
        // Define statics
        statics: {
            /**
             * Indicates whether the device should use sapUiSizeCompact.
             */
            _isSupportCompactSize: undefined,

            /**
             * Adds the sapUiSizeCompact class if the current device is desktop or it does not support touch.
             * @static
             * @name setCompactSize
             * @memberOf sap.galilei.ui5.utils.Device#
             */
            setCompactSize: function () {
                if (typeof(document) !== "undefined") {
                    // Applies compact mode if the device is desktop or if touch is not supported
                    if (sap.galilei.ui5.utils.Device.isSupportCompactSize()) {
                        jQuery(document.body).addClass("sapUiSizeCompact");
                    }
                }
            },


            /**
             * Adds the sapUiSizeCozy class if the current device is desktop with touch support or it mobile device.
             * @static
             * @name setCozySize
             * @memberOf sap.galilei.ui5.utils.Device#
             */
            setCozySize: function () {
                if (typeof(document) !== "undefined") {
                    if (!sap.galilei.ui5.utils.Device.isSupportCompactSize()) {
                        jQuery(document.body).addClass("sapUiSizeCozy");
                    }
                }
            },

            /**
             * Adds the sapUiSizeCompact or sapUiSizeCozy class depending on the device.
             * @static
             * @name setUiSize
             * @memberOf sap.galilei.ui5.utils.Device#
             */
            setUiSize: function () {
                if (typeof(document) !== "undefined") {
                    if (sap.galilei.ui5.utils.Device.isSupportCompactSize()) {
                        sap.galilei.ui5.utils.Device.setCompactSize();
                    } else {
                        sap.galilei.ui5.utils.Device.setCozySize();
                    }
                }
            },

            /**
             * Checks whether the current device should be in compact mode.
             * By default, if the device is desktop or it does not support touch, it should be in compact mode.
             * @static
             * @name isSupportCompactSize
             * @memberOf sap.galilei.ui5.utils.Device#
             * @returns {Boolean}
             */
            isSupportCompactSize: function () {
                if (sap.galilei.ui5.utils.Device._isSupportCompactSize !== undefined) {
                    return sap.galilei.ui5.utils.Device._isSupportCompactSize;
                }

                // If the device is desktop or it does not support touch, it should be in compact mode.
                return (sap.ui.Device.system.desktop || !sap.ui.Device.support.touch);
            },

            /**
             * Sets the current compact mode.
             * @static
             * @name setSupportCompactSize
             * @memberOf sap.galilei.ui5.utils.Device#
             * @param {Boolean} bCompactSize Sets the compact size mode.
             */
            setSupportCompactSize: function (bCompactSize) {
                sap.galilei.ui5.utils.Device._isSupportCompactSize = bCompactSize;
            }
        }
    });
}());
