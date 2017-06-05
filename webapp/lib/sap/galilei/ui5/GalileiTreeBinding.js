jQuery.sap.declare("sap.galilei.ui5.GalileiTreeBinding");

(function() {

    "use strict";

    jQuery.sap.require("sap.ui.model.ClientTreeBinding");

    /**
     * @class
     * Tree binding implementation for Galilei Objects
     * @name sap.galilei.ui5.GalileiTreeBinding
     * @extends sap.ui.model.ClientTreeBinding
     */
    var GalileiTreeBinding = sap.ui.model.ClientTreeBinding.extend("sap.galilei.ui5.GalileiTreeBinding");

    /**
     * Return node contexts for the tree
     * @param {object} oContext to use for retrieving the node contexts
     * @param {integer} iStartIndex the startIndex where to start the retrieval of contexts
     * @param {integer} iLength determines how many contexts to retrieve beginning from the start index.
     * @return {object[]} the contexts array
     * @protected
     */
    GalileiTreeBinding.prototype.getNodeContexts = function(oContext, iStartIndex, iLength) {
        var sBindingPath = this.getPath(),
            sRelativePath = sBindingPath.slice(1),
            oCollection,
            aCollection,
            nCollectionCount,
            nCollectionIndex,
            oCollectionObject;

        if (!iStartIndex) {
            iStartIndex = 0;
        }
        if (!iLength) {
            iLength = this.oModel.iSizeLimit;
        }

        var sContextPath = oContext.getPath();
        if (!jQuery.sap.endsWith(sContextPath,"/")) {
            sContextPath = sContextPath + "/";
        }
        if (!jQuery.sap.startsWith(sContextPath,"/")) {
            sContextPath = "/" + sContextPath;
        }

        var aContexts = [],
            that = this,
            oNode = this.oModel._getObject(sContextPath),
            aArrayNames = this.mParameters && this.mParameters.arrayNames,
            aChildArray;

        oCollection = (oNode && oNode[sRelativePath]) || oNode;
        if (oCollection) {
            if (oCollection instanceof sap.galilei.model.BaseCollection) {
                aCollection = oCollection.toArray();
            } else if (oCollection instanceof Array) {
                aCollection = oCollection;
            } else {
                aCollection = [];
            }

            for (nCollectionIndex = 0, nCollectionCount = aCollection.length; nCollectionIndex < nCollectionCount; nCollectionIndex++) {
                oCollectionObject = aCollection[nCollectionIndex];
                that._saveSubContext(oCollectionObject, aContexts, sContextPath, sBindingPath + "/" === sContextPath ? nCollectionIndex : sRelativePath + "/" + nCollectionIndex);
            }
        }

        this._applySorter(aContexts);

        this._setLengthCache(sContextPath, aContexts.length);

        return aContexts.slice(iStartIndex, iStartIndex + iLength);
    };
}());
