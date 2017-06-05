/**
 
 * Date: 08/04/14
 * (c) Copyright 2013-2014 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.galilei.ui5.GalileiPropertyBinding");

(function() {

    jQuery.sap.require("sap.ui.model.ClientPropertyBinding");

    "use strict";

    /**
     * @class
     * Property binding implementation for Galilei Objects
     * @name sap.galilei.ui5.GalileiPropertyBinding
     * @extends sap.ui.model.ClientPropertyBinding
     *
     * @constructor
     * @param {sap.galilei.ui5.GalileiModel} oModel
     * @param {string} sPath
     * @param {sap.ui.model.Context} oContext
     * @param {object} [mParameters]
     */
    var GalileiPropertyBinding = sap.ui.model.ClientPropertyBinding.extend("sap.galilei.ui5.GalileiPropertyBinding",
        {
            constructor: function (oModel, sPath, oContext, mParameters) {
                var self = this,
                    oDeferredValue;
                if (sPath && sPath.indexOf("{") !== -1) {
                    sPath = sPath.replace(/({[^}]+})/g, function (sToken) {
                        var resolvedPath = oContext && oContext.getProperty(sToken.substring(1, sToken.length - 1)),
                            result;
                        if (resolvedPath && resolvedPath.promise && resolvedPath.state() === "resolved") {
                            jQuery.when(resolvedPath).done(function (sResolved) {
                                result = sResolved;
                            });
                        } else {
                            result = resolvedPath;
                        }
                        return result;
                    });
                }
                sap.ui.model.ClientPropertyBinding.call(this, oModel, sPath, oContext, mParameters);
            }
        });


    /**
     * @override sap.ui.model.PropertyBinding.prototype.setValue
     *
     * @function
     * @name sap.galilei.ui5.GalileiPropertyBinding#setValue
     * @param {object} oValue
     */
    GalileiPropertyBinding.prototype.setValue = function (oValue) {
        // ********************************
        // NOTE: this implementation was taken from UI5 documentation on property binding
        // ********************************
        if (!jQuery.sap.equal(this.oValue, oValue)) {
            // the binding value will be updated by the model. The model calls checkupdate on all bindings after updating its value.
            this.oModel.setProperty(this.sPath, oValue, this.oContext);
        }
    };

    /***
     *
     * @returns {undefined|*}
     */
    GalileiPropertyBinding.prototype.getValue = function () {
        return this.oValue;
    };

    /**
     * Check whether this Binding would provide new values and in case it changed,
     * inform interested parties about this.
     *
     * @function
     * @name sap.galilei.ui5.GalileiPropertyBinding#checkUpdate
     * @param {boolean} bForceupdate
     */
    GalileiPropertyBinding.prototype.checkUpdate = function (bForceupdate) {
        // ********************************
        // NOTE: this implementation was taken from UI5 documentation on property binding
        // ********************************
        var self = this,
            oValue = this._getValue();
        if (!jQuery.sap.equal(oValue, self.oValue) || bForceupdate) { // optimize for not firing the events when unneeded
            self.oValue = oValue;
            self._fireChange({reason: sap.ui.model.ChangeReason.Change});
        }
    };
}());