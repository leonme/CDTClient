/**
 * Supports locale and language specific functions.
 
 * Date: 29/10/14
 * (c) Copyright 2013-2014 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.galilei.ui5.utils.Locale");

(function () {
    "use strict";

    /**
     * @class
     * Provides locale related management functions.
     * @public
     */
    sap.galilei.ui5.utils.Locale = sap.galilei.core.defineClass({
        // Define class name
        fullClassName: "sap.galilei.ui5.utils.Locale",

        // Define static members
        statics: {
            /**
             * Indicates whether the resource model is initialized.
             */
            initialized: false,

            /**
             * Gets or sets the resource model.
             */
            resourceModel: undefined,

            /**
             * Initializes the resource model for the current locale.
             * @static
             * @name initializeResource
             * @memberOf sap.galilei.ui5.utils.Locale#
             */
            initializeResource: function () {
                if (!this.initialized) {
                    this.updateResourceBundle();
                    this.initialized = true;
                }
            },

            /**
             * Gets the current locale key.
             */
            currentLocale: {
                get: function () {
                    return sap.ui.getCore().getConfiguration().getLanguage();
                }
            },

            /**
             * Updates the UI locale
             * @static
             * @name _updateUILocale
             * @memberOf sap.galilei.ui5.utils.Locale#
             * @private
             */
            changeLocale: function (sLocaleKey) {
                if (sLocaleKey && sLocaleKey !== this.currentLocale) {
                    sap.ui.getCore().getConfiguration().setLanguage(sLocaleKey);
                    this.updateResourceBundle();
                }
            },

            /**
             * Updates resource bundle model.
             * @static
             * @name updateResourceBundle
             * @memberOf sap.galilei.ui5.utils.Locale#
             */
            updateResourceBundle: function () {
                var sLocaleKey = this.currentLocale;

                if (sLocaleKey) {
                    this.resourceModel = new sap.ui.model.resource.ResourceModel({ bundleName: "i18n.ui5_i18n", bundleLocale: sLocaleKey });
                    sap.ui.getCore().setModel(this.resourceModel, "ui5_i18n");
                }
            },

            /**
             * Gets a localized property value.
             * @static
             * @name getProperty
             * @memberOf sap.galilei.ui5.utils.Locale#
             * @param {string} sProperty The property name.
             * @param {string} sDefaultValue The default value.
             * @returns {string}
             */
            getProperty: function (sProperty, sDefaultValue) {
                var sValue = sDefaultValue;

                if (this.resourceModel && sProperty) {
                    sValue = this.resourceModel.getProperty(sProperty);
                    if ((!sValue || sValue === sProperty) && sDefaultValue) {
                        sValue = sDefaultValue;
                    }
                }
                return sValue;
            }
        }
    });

    sap.galilei.ui5.utils.Locale.initializeResource();
}());