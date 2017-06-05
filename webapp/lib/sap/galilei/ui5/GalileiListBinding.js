/**
 * Date: 08/04/14
 * (c) Copyright 2013-2014 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.galilei.ui5.GalileiListBinding");

(function() {
    "use strict";

    jQuery.sap.require("sap.ui.model.ClientListBinding");
    jQuery.sap.require("sap.ui.model.ChangeReason");

    /**
     * @class
     * List binding implementation for Galilei Objects
     * @name sap.galilei.ui5.GalileiListBinding
     * @extends sap.ui.model.ClientListBinding
     *
     * @constructor
     * @param {sap.galilei.ui5.GalileiModel} oModel
     * @param {string} sPath
     * @param {sap.ui.model.Context} oContext
     * @param {sap.ui.model.Sorter|sap.ui.model.Sorter[]} [aSorters] initial sort order (can be either a sorter or an array of sorters)
     * @param {sap.ui.model.Filter|sap.ui.model.Filter[]} [aFilters] predefined filter/s (can be either a filter or an array of filters)
     * @param {object} [mParameters]
     */
    var GalileiListBinding = sap.ui.model.ClientListBinding.extend("sap.galilei.ui5.GalileiListBinding");

    /**
     * Return contexts for the list or a specified subset of contexts
     * @param {int} [iStartIndex=0] the startIndex where to start the retrieval of contexts
     * @param {int} [iLength=length of the list] determines how many contexts to retrieve beginning from the start index.
     * Default is the whole list length.
     *
     * @private
     * @function
     * @name sap.ui.model.GalileiListBinding#getContexts
     * @return {Array} the contexts array
     */
    GalileiListBinding.prototype.getContexts = function(iStartIndex, iLength) {
        this.iLastStartIndex = iStartIndex;
        this.iLastLength = iLength;

        if (!iStartIndex) {
            iStartIndex = 0;
        }
        if (!iLength) {
            iLength = Math.min(this.iLength, this.oModel.iSizeLimit);
        }

        var aContexts = this._getContexts(iStartIndex, iLength),
            oContextData = {};

        if (this.bUseExtendedChangeDetection) {

            for (var i = 0; i < aContexts.length; i++) {
                oContextData[aContexts[i].getPath()] = aContexts[i].getObject();
            }

            //Check diff
            if (this.aLastContexts && iStartIndex < this.iLastEndIndex) {
                var that = this;
                var aDiff = jQuery.sap.arrayDiff(this.aLastContexts, aContexts, function(oOldContext, oNewContext) {
                    return jQuery.sap.equal(
                        oOldContext && that.oLastContextData && that.oLastContextData[oOldContext.getPath()],
                        oNewContext && oContextData && oContextData[oNewContext.getPath()]
                    );
                });
                aContexts.diff = aDiff;
            }

            this.iLastEndIndex = iStartIndex + iLength;
            this.aLastContexts = aContexts.slice(0);
            this.oLastContextData = jQuery.extend(true, {}, oContextData);
        }

        return aContexts;
    };

    /**
     * Update the list, indices array and apply sorting and filtering
     * @private
     * @function
     * @name sap.galilei.ui5.GalileiListBinding#update
     */
    GalileiListBinding.prototype.update = function (aList) {
        // ********************************
        // NOTE: this implementation was taken from UI5 documentation on list binding
        // ********************************
        var oList = aList || this.oModel.getObject(this.sPath, this.oContext);

        if (oList && oList instanceof Array) {
            this.oList = oList;
            this.updateIndices();
            this.applyFilter();
            this.applySort();
            this.iLength = this._getLength();
        } else {
            this.oList = [];
            this.aIndices = [];
            this.iLength = 0;
        }
    };

    /**
     * Check whether this Binding would provide new values and in case it changed,
     * inform interested parties about this.
     *
     * @function
     * @name sap.galilei.ui5.GalileiListBinding#checkUpdate
     * @param {boolean} bForceupdate
     */
    GalileiListBinding.prototype.checkUpdate = function (bForceupdate) {
        // ********************************
        // NOTE: this implementation was taken from UI5 documentation on list binding
        // ********************************

        if (this.bSuspended && !this.bIgnoreSuspend) {
            return;
        }

        if (!this.bUseExtendedChangeDetection) {
            var oList = this.oModel.getObject(this.sPath, this.oContext);
            if (!jQuery.sap.equal(this.oList, oList) || bForceupdate) {
                self.oList = oList;
                this.update(oList);
                this._fireChange({reason: sap.ui.model.ChangeReason.Change});
            }
        } else {
            var bChangeDetected = false;
            var that = this;

            //If the list has changed we need to update the indices first
            var oList = this.oModel.getObject(this.sPath, this.oContext);
            if (oList && this.oList.length != oList.length) {
                bChangeDetected = true;
            }
            if (!jQuery.sap.equal(this.oList, oList)) {
                this.update();
            }

            //Get contexts for visible area and compare with stored contexts
            var aContexts = this._getContexts(this.iLastStartIndex, this.iLastLength);
            if (this.aLastContexts) {
                if (this.aLastContexts.length != aContexts.length) {
                    bChangeDetected = true;
                } else {
                    jQuery.each(this.aLastContexts, function(iIndex, oContext) {
                        if (!jQuery.sap.equal(aContexts[iIndex].getObject(), that.oLastContextData[oContext.getPath()])) {
                            bChangeDetected = true;
                            return false;
                        }
                    });
                }
            } else {
                bChangeDetected = true;
            }
            if (bChangeDetected || bForceupdate) {
                this._fireChange({reason: sap.ui.model.ChangeReason.Change});
            }
        }
    };
}());





