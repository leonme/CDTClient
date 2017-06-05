/**
 * Date: 08/04/14
 * (c) Copyright 2013-2014 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.galilei.ui5.GalileiModel");

(function() {
    jQuery.sap.require("sap.ui.model.ClientModel");
    jQuery.sap.require("sap.galilei.ui5.GalileiPropertyBinding");

    "use strict";

    /**
     * @class
     * Model implementation for Galilei Objects
     * @name sap.galilei.ui5.GalileiModel
     * @extends sap.ui.model.ClientModel
     *
     * @public
     * @constructor
     * @param {object} oData containing the model name to be created and the resource to be attached to ??!!
     */
    var GalileiModel = sap.ui.model.ClientModel.extend("sap.galilei.ui5.GalileiModel", /** @lends sap.galilei.ui5.GalileiModel */ {

        constructor: function (oData) {
            sap.ui.model.ClientModel.apply(this, arguments);

            if (oData && typeof oData === "object") {
                this.setData(oData);
            }
        },

        metadata: {
            publicMethods: []
        },

        /**
         * Gets or sets the controller
         */
        _controller: undefined,

        /**
         * Sets the controller.
         * @memberOf sap.galilei.ui5.GalileiModel#
         * @param {Controller} oController The controller.
         */
        getController: function (oController) {
            return this._controller;
        },

        /**
         * Sets the controller.
         * @memberOf sap.galilei.ui5.GalileiModel#
         * @param {Controller} oController The controller.
         */
        setController: function (oController) {
            this._controller = oController;
            return this;
        }
    });

    /**
     * Private method iterating the registered bindings of this model instance and initiating their check for update
     * @param {boolean} bForceUpdate
     * @param {boolean} bAsync
     * @private
     */
    GalileiModel.prototype.checkUpdate = function(bForceUpdate, bAsync) {
        if (bAsync) {
            if (this.sUpdateTimer) {
                jQuery.sap.clearDelayedCall(this.sUpdateTimer);
                this.sUpdateTimer = undefined;
            }
            this.sUpdateTimer = jQuery.sap.delayedCall(60, this, function() {
                // It is called after property change
                this.checkUpdate(bForceUpdate, false);
            });
            return;
        }

        if (this.sUpdateTimer) {
            jQuery.sap.clearDelayedCall(this.sUpdateTimer);
            this.sUpdateTimer = undefined;
        }
        var aBindings = this.aBindings.slice(0),
            nBindingsCount,
            nBindingIndex;

        for (nBindingIndex = 0, nBindingsCount = aBindings.length; nBindingIndex < nBindingsCount; nBindingIndex++) {
            aBindings[nBindingIndex].checkUpdate(bForceUpdate);
        }
        
        this.fireRequestCompleted({type: "checkUpdate"});
    };

    /**
     * Updates the binding of a property.
     * @param {String} sPropertyName The property name.
     * @param {boolean} bForceUpdate
     */
    GalileiModel.prototype.checkUpdateProperty = function(sPropertyName, bForceUpdate) {
        var aBindings = this.aBindings.slice(0),
            nBindingsCount,
            nBindingIndex,
            oBinding;

        if (sPropertyName && aBindings) {
            for (nBindingIndex = 0, nBindingsCount = aBindings.length; nBindingIndex < nBindingsCount; nBindingIndex++) {
                oBinding = aBindings[nBindingIndex];
                if (oBinding.getPath() === "/" + sPropertyName) {
                    oBinding.checkUpdate(bForceUpdate);
                    break;
                }
            }
        }
    };

    /**
     * @review should this method be supported???
     *
     * Sets the Galilei data to the model.
     *
     * @public
     * @function
     * @name sap.galilei.ui5.GalileiModel#setData
     * @param {object} oData the data to set on the model
     */
    GalileiModel.prototype.setData = function (oData) {
        var oOldData = this.oData;

        this.oData = oData;
        if (oOldData !== oData) {
            this.removeListener();
            this.addListener(oData);
        }
        this.checkUpdate(undefined, true);
    };

    /**
     * Adds object changed listener.
     * @function
     * @name sap.galilei.ui5.GalileiModel#addListener
     * @param oObject
     */
    GalileiModel.prototype.addListener = function (oObject) {
        var oGalileiObject = sap.galilei.model.getClass("sap.galilei.model.Object"),
            oObjectListener;

        if (oGalileiObject && oObject) {
            oObjectListener = {
                onObjectChanged: jQuery.proxy(this.onObjectChanged, this),
                galileiModel: this,
                resource: oObject.resource
            };
            oGalileiObject.addObjectListener(oObjectListener);
        }
    };

    /**
     * Removes object changed listener.
     * @function
     * @name sap.galilei.ui5.GalileiModel#removeListener
     * @param oObject
     */
    GalileiModel.prototype.removeListener = function () {
        var oGalileiObject = sap.galilei.model.getClass("sap.galilei.model.Object"),
            index,
            max,
            oObjectListener;

        if (this.sUpdateTimer !== undefined) {
            jQuery.sap.clearDelayedCall(this.sUpdateTimer);
            this.sUpdateTimer = undefined;
        }
        if (this._currentTimerId !== undefined) {
            clearTimeout(this._currentTimerId);
            this._currentTimerId = undefined;
        }

        if (oGalileiObject && oGalileiObject._aObjectListeners) {
            for (max = oGalileiObject._aObjectListeners.length, index = max - 1; index >= 0; index--) {
                oObjectListener = oGalileiObject._aObjectListeners[index];
                if (oObjectListener.galileiModel === this) {
                    oGalileiObject._aObjectListeners.splice(index, 1);
                }
            }
        }
    };

    /**
     * Frees resources.
     * @function
     * @name sap.galilei.ui5.GalileiModel#dispose
     */
    GalileiModel.prototype.dispose = function () {
        this.oData = undefined;
        this.removeListener();
    };

    /**
     * Object changed listener.
     * @function
     * @name sap.galilei.ui5.GalileiModel#onObjectChanged
     * @param {object} oEventArgs The argument
     */
    GalileiModel.prototype.onObjectChanged = function (oEventArgs) {
        var self = this;

        if (sap.galilei.model.unmonitorChanges !== true) {
            if (this._currentTimerId !== undefined) {
                clearTimeout(this._currentTimerId);
                this._currentTimerId = undefined;
            }
            this._currentTimerId = setTimeout(function () {
                // It is called after loading of each collection
                self.checkUpdate(undefined, false);
                self._currentTimerId = undefined;
            }, 60);
        }
    };

    /**
     * @override sap.ui.model.Model.prototype.bindProperty
     *
     * @public
     * @function
     * @name sap.galilei.ui5.GalileiModel#bindProperty
     * @param {string} sPath the path pointing to the property that should be bound
     * @param {object} [oContext=null] the context object for this data binding (optional)
     * @param {object} [mParameters=null] additional model specific parameters (optional)
     * @return {sap.galilei.ui5.GalileiPropertyBinding}
     */
    GalileiModel.prototype.bindProperty = function (sPath, oContext, mParameters) {
        return new sap.galilei.ui5.GalileiPropertyBinding(this, sPath, oContext, mParameters);
    };

    /**
     * @override sap.ui.model.Model.prototype.bindList
     *
     * @public
     * @function
     * @name sap.galilei.ui5.GalileiModel#bindList
     * @param {string} sPath the path pointing to the list / array that should be bound
     * @param {object} [oContext=null] the context object for this data binding (optional)
     * @param {sap.ui.model.Sorter} [aSorters=null] initial sort order (can be either a sorter or an array of sorters) (optional)
     * @param {array} [aFilters=null] predefined filter/s (can be either a filter or an array of filters) (optional)
     * @param {object} [mParameters=null] additional model specific parameters (optional)
     * @return {sap.galilei.ui5.GalileiListBinding}
     */
    GalileiModel.prototype.bindList = function (sPath, oContext, aSorters, aFilters, mParameters) {
        jQuery.sap.require("sap.galilei.ui5.GalileiListBinding");
        return new sap.galilei.ui5.GalileiListBinding(this, sPath, oContext, aSorters, aFilters, mParameters);
    };

    /**
     * @override sap.ui.model.Model.prototype.bindTree
     *
     * @public
     * @function
     * @name sap.galilei.ui5.GalileiModel#bindTree
     * @param {string} sPath the path pointing to the tree / array that should be bound
     * @param {object} [oContext=null] the context object for this data binding (optional)
     * @param {array} [aFilters=null] predefined filter/s contained in an array (optional)
     * @param {object} [mParameters=null] additional model specific parameters (optional)
     * @return {sap.ui.model.TreeBinding}
     */
    GalileiModel.prototype.bindTree = function (sPath, oContext, aFilters, mParameters, aSorters) {
        jQuery.sap.require("sap.galilei.ui5.GalileiTreeBinding");
        return new sap.galilei.ui5.GalileiTreeBinding(this, sPath, oContext, aFilters, mParameters, aSorters);
    };

    GalileiModel.prototype.isList = function(sPath, oContext) {
        var sAbsolutePath = this.resolve(sPath, oContext);
        return jQuery.isArray(this._getObject(sAbsolutePath));
    };

    /**
     * @override sap.ui.model.ClientModel.prototype.setProperty
     *
     * Sets a new value for the given property <code>sPropertyName</code> in the model.
     * If the model value changed all interested parties are informed.
     *
     * @public
     * @function
     * @name sap.galilei.ui5.GalileiModel#setProperty
     * @param {string}  sPath Path of the property to set.
     * @param {variant} oValue Value to set the property to.
     * @param {object} [oContext=null] The context which will be used to set the property.
     */
    GalileiModel.prototype.setProperty = function (sPath, oValue, oContext) {
        var sObjectPath = sPath.substring(0, sPath.lastIndexOf("/")),
            sProperty = sPath.substr(sPath.lastIndexOf("/") + 1),
            oObject;

        // Checks if path / context is valid
        if (!this.resolve(sPath, oContext)) {
            return;
        }

        if (!sObjectPath && !oContext) {
            oContext = this.oData;
        }

        oObject = this.getProperty(sObjectPath, oContext);
        if (oObject) {
            oObject[sProperty] = oValue;
            this.checkUpdate(undefined, true);
        }
    };

    var _unresolvedBinding = {};



    /**
     * Returns the value for the property with the given <code>sPropertyName</code>
     *
     * @param {string} sPath the path to the property
     * @param {object} [oContext=null] the context which will be used to retrieve the property
     * @type any
     * @return the value of the property
     * @public
     */
    GalileiModel.prototype.getProperty = function(sPath, oContext) {
        return this._getObject(sPath, oContext);

    };

    function _getResolvedValue (oResolvedValue) {
        this.__resolvedValue = oResolvedValue;
    }

    /**
     * @param {string} sPath
     * @param {object} [oContext]
     * @returns {any} the node of the specified path/context
     */
    GalileiModel.prototype._getObject = function (sPath, oContext) {
        var oNode = this.isLegacySyntax() ? this.oData : null,
            oClassDefinition,
            oReference,
            oResource,
            oReferenceLoaded;
        if (oContext instanceof sap.ui.model.Context) {
            oNode = this._getObject(oContext.getPath());
        } else if (oContext) {
            oNode = oContext;
        }
        if (!sPath) {
            return oNode;
        }
        var aParts = sPath.split("/"),
            iIndex = 0;
        if (!aParts[0]) {
            // absolute path starting with slash
            oNode = this.oData;
            iIndex++;
        }
        while (oNode && aParts[iIndex]) {
            if (oNode.isAlive == false) {
                oNode = undefined;
                break;
            }
            // check if this is a reference
            oClassDefinition = oNode && oNode.classDefinition;
            oResource = oNode.resource;
            oReference = oClassDefinition && oClassDefinition.allReferences[aParts[iIndex]];

            if (oReference && oReference.isAsync === true && oResource && oResource.activeReader) {
                if (!oReference.isMany) {
                    oReferenceLoaded = oResource.getObjectAtomicReferenceAsync(oNode, aParts[iIndex], true);
                } else {
                    oReferenceLoaded = oResource.loadObjectReferenceObjectsAsync(oNode, aParts[iIndex], true);
                }

                if (oReferenceLoaded.state() !== "resolved") {
                    // collection is being resolved, stop here...
                    oNode = undefined;
                } else {
                    if (isNaN(aParts[iIndex]) || oNode instanceof Array) {
                        oNode = oNode[aParts[iIndex]];
                    } else {
                        oNode = oNode.get(aParts[iIndex]);
                    }
                    iIndex++;
                }
            } else {
                if (isNaN(aParts[iIndex]) || oNode instanceof Array) {
                    oNode = oNode[aParts[iIndex]];
                } else {
                    oNode = oNode.get(aParts[iIndex]);
                }
                iIndex++;
            }

            // manage deferred case
            if (oNode && oNode.promise !== undefined) {
                if (oNode.state() !== "resolved") {
                    oNode = _unresolvedBinding;
                    break;
                } else {
                    jQuery.when(oNode).done(_getResolvedValue);
                    oNode = oNode.promise().__resolvedValue;
                }
            }
        }

        // manage collection case
        if (oNode instanceof sap.galilei.model.BaseCollection){
            oNode = oNode.toArray();
        }

        // finally return result
        return oNode;
    };
}());