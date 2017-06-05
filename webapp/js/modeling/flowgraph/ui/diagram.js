/**
 * Simplified Flow Graph Model diagram.
 
 * Date: 13/03/15
 * (c) Copyright 2013-2015 SAP AG. All rights reserved
 */

(function () {

    "use strict";

    var oResource,
        oReader,
        oDiagramDef = {
            contents: {
                "Sap.Modeling.FlowGraph.Diagram": {
                    classDefinition: "sap.galilei.model.Package",
                    displayName: "Flow Graph Diagram",
                    namespaceName: "sap.modeling.flowgraph.ui",
                    classifiers: {
                        /**
                         * @class
                         * @name Diagram
                         * The Flow Graph Diagram
                         */
                        "Diagram": {
                            displayName: "Diagram",
                            parent: "sap.galilei.ui.diagram.Diagram"
                        },

                        /**
                         * @class
                         *
                         * @name NodeSymbol
                         * The node symbol
                         */
                        "NodeSymbol": {
                            displayName: "Node Symbol",
                            parent: "sap.galilei.ui.diagram.CompositeSymbol",
                            properties: {
                                "NodeSymbol.isKeepSize": { name: "isKeepSize", defaultValue: true },
                                "NodeSymbol.isAdjustToContent": { name: "isAdjustToContent", defaultValue: false }
                            },
                            methods: {
                                updateBoundarySymbols: function (oOldParentBBox, oNewParentBBox, bMoveLinkSymbols, oViewer, oTransitionDef) {
                                    var self = this,
                                        nHeaderHeight = 18,
                                        nAnchorHeight = 14,
                                        nPaddingY = 8,
                                        nInnerPaddingY = 6,
                                        nStatusIconHeight = 16,
                                        nMaxNodeHeight = 90,
                                        nTotalHeight = 0,
                                        nMaxWidth = 0,
                                        bSizeNode = false,
                                        nOffsetY,
                                        cx,
                                        cy,
                                        index,
                                        max,
                                        oBoundarySymbol;

                                    this.getOrCreateShape();
                                    oNewParentBBox = oNewParentBBox || this.getBBox();

                                    // Measures inputs and outputs total height (nTotalHeight) and maximum width (nMaxWidth)
                                    function measureAnchorsSize() {
                                        var nHeight = 0;

                                        for (index = 0, max = self.boundarySymbols.length; index < max; index++) {
                                            oBoundarySymbol = self.boundarySymbols.get(index);
                                            oBoundarySymbol.getOrCreateShape();
                                            nTotalHeight += nAnchorHeight;
                                            if (index > 0) {
                                                nTotalHeight += nInnerPaddingY;
                                            }
                                            nMaxWidth = Math.max(nMaxWidth, oBoundarySymbol.width);
                                        }
                                    }

                                    // Measures inputs and outputs total height (nTotalHeight) and maximum width (nMaxWidth)
                                    measureAnchorsSize();

                                    // Computes height and Y offset
                                    nOffsetY = (oNewParentBBox.height - nHeaderHeight - nTotalHeight - nStatusIconHeight) / 2;
                                    if (nOffsetY < nPaddingY) {
                                        // Increases the height
                                        oNewParentBBox.height = nHeaderHeight + nPaddingY + nTotalHeight + nPaddingY + nStatusIconHeight;
                                        bSizeNode = true;
                                        nOffsetY = nPaddingY;
                                    }
                                    if (oNewParentBBox.height !== nHeaderHeight + nTotalHeight + nPaddingY + nPaddingY + nStatusIconHeight) {
                                        // Reduces the height
                                        oNewParentBBox.height = nHeaderHeight + nTotalHeight + nPaddingY + nPaddingY + nStatusIconHeight;
                                        if (oNewParentBBox.height < nMaxNodeHeight) {
                                            oNewParentBBox.height = nMaxNodeHeight;
                                        }
                                        bSizeNode = true;
                                        nOffsetY = (oNewParentBBox.height - nHeaderHeight - nTotalHeight - nStatusIconHeight) / 2;
                                    }

                                    // Checks the width
                                    if (oNewParentBBox.width < nMaxWidth) {
                                        oNewParentBBox.width = nMaxWidth;
                                        bSizeNode = true;
                                    }

                                    // Resizes the node symbol
                                    if (bSizeNode) {
                                        this.setBBox(oNewParentBBox, { moveLinkSymbols: bMoveLinkSymbols, updateBoundarySymbols: false }, oViewer, oTransitionDef);
                                    }

                                    // Layouts input symbols
                                    cx = oNewParentBBox.x;
                                    cy = oNewParentBBox.y + nHeaderHeight + nOffsetY + nAnchorHeight / 2;
                                    for (index = 0, max = this.boundarySymbols.length; index < max; index++) {
                                        oBoundarySymbol = this.boundarySymbols.get(index);
                                        if (sap.galilei.model.isInstanceOf(oBoundarySymbol, "sap.modeling.flowgraph.ui.InputSymbol")) {
                                            this.setBoundarySymbolAttachPoint(oBoundarySymbol, cx, cy, bMoveLinkSymbols, oViewer, oTransitionDef);
                                            cy += nAnchorHeight + nInnerPaddingY;
                                        }
                                    }

                                    // Layouts output symbols
                                    cx = oNewParentBBox.x + oNewParentBBox.width;
                                    for (index = 0, max = this.boundarySymbols.length; index < max; index++) {
                                        oBoundarySymbol = this.boundarySymbols.get(index);
                                        if (sap.galilei.model.isInstanceOf(oBoundarySymbol, "sap.modeling.flowgraph.ui.OutputSymbol")) {
                                            this.setBoundarySymbolAttachPoint(oBoundarySymbol, cx, cy, bMoveLinkSymbols, oViewer, oTransitionDef);
                                            cy += nAnchorHeight + nInnerPaddingY;
                                        }
                                    }
                                }
                            },
                            statics: {
                                objectClass: { value: "sap.modeling.flowgraph.Node" },
                                layoutTemplate: {
                                    mainShape: [
                                        { shape: "RoundedRectangle", r: 4, domClass: "node", stroke: "#AAA8A7", strokeWidth: 1, fill: "url(#nodeFill)", padding: 0, width: 90, height: 90, minWidth: 60, minHeight: 80 },
                                        { shape: "Panel", shapes: [
                                            { shape: "Image", href: "images/Warning.png", dockPosition: "bottomRight", marginRight: 24, marginBottom: 4, width: 16, height: 16,
                                              events: {
                                                "pointerdown": function (oEvent, oSymbol, oExtension) {
                                                    console.log("Clicked on the icon of node " + oSymbol.object.name);
                                                }
                                            }},
                                            { shape: "Image", href: "images/Node16.png", dockPosition: "bottomRight", marginRight: 4, marginBottom: 4, width: 16, height: 16,
                                              events: {
                                                  "pointerdown": function (oEvent, oSymbol, oExtension) {
                                                      console.log("Clicked on the icon of node " + oSymbol.object.name);
                                                  }
                                              }}
                                        ]}
                                    ],
                                    contentShape: {
                                        shape: "Stack", horizontalAlignment: "width", verticalAlignment: "top", innerAlignment: "center",
                                        padding: 0, innerPadding: 0,
                                        shapes: [
                                            { shape: "Stack", orientation: "horizontal", padding: 4, innerPadding: 2, shapes: [
                                                { shape: "Image", href: "images/Node16.png", width: 16, height: 16 },
                                                { shape: "Text", domClass: "nodeName", text: "{object/displayName}", font: "bold 14px Calibri", fill: "black", horizontalAlignment: "width", verticalAlignment: "height", isWordWrap: true , isEllipsis: true}
                                            ]}
                                        ]
                                    }
                                }
                            }
                        },

                        /**
                         * @class
                         * @name InputSymbol
                         * The Input symbol
                         */
                        "InputSymbol": {
                            displayName: "Input Symbol",
                            parent: "sap.galilei.ui.diagram.BoundarySymbol",
                            properties: {
                                "InputSymbol.isKeepPosition": { name: "isKeepPosition", defaultValue: true },
                                "InputSymbol.offsetX": { name: "offsetX", get: function () { return this.width / 2 - this.height / 2; } }
                            },
                            methods: {
                                /**
                                 * Get the attach points list defined on the symbol.
                                 * @param {Boolean} bIsSource true is for source; false is for target; undefined is for both.
                                 * @returns {Array|undefined} If the attach points are defined, the function returns the points array;
                                 */
                                getAttachPoints: function (bIsSource) {
                                    var oBBox = this.getBBox();

                                    // Use the same points for source & target
                                    return {
                                        isFixedPoints: true,
                                        points: [
                                            [oBBox.x + oBBox.height / 2 + 1, oBBox.y + oBBox.height / 2]
                                        ]
                                    };
                                }
                            },
                            statics: {
                                objectClass: { value: "sap.modeling.flowgraph.Input" },
                                layoutTemplate: {
                                    mainShape: [
                                        { shape: "RoundedRectangle", r: 7, domClass: "node", stroke: "#AAA8A7", strokeWidth: 1, fill: "url(#nodeFill)", padding: 0, width: 80, height: 14 },
                                        { shape: "Text", domClass: "inputName", text: "{object/displayName}", font: "bold 12px Calibri", fill: "black", horizontalAlignment: "width", verticalAlignment: "height", isWordWrap: true, isEllipsis: true}
                                    ]
                                }
                            }
                        },

                        /**
                         * @class
                         * @name OutputSymbol
                         * The Output symbol
                         */
                        "OutputSymbol": {
                            displayName: "Output Symbol",
                            parent: "sap.galilei.ui.diagram.BoundarySymbol",
                            properties: {
                                "OutputSymbol.isKeepPosition": { name: "isKeepPosition", defaultValue: true },
                                "OutputSymbol.offsetX": { name: "offsetX", get: function () { return -this.width / 2 + this.height / 2; } }
                            },
                            methods: {
                                /**
                                 * Get the attach points list defined on the symbol.
                                 * @param {Boolean} bIsSource true is for source; false is for target; undefined is for both.
                                 * @returns {Array|undefined} If the attach points are defined, the function returns the points array;
                                 */
                                getAttachPoints: function (bIsSource) {
                                    var oBBox = this.getBBox();

                                    // Use the same points for source & target
                                    return {
                                        isFixedPoints: true,
                                        points: [
                                            [oBBox.x + oBBox.width - oBBox.height / 2 - 1, oBBox.y + oBBox.height / 2]
                                        ]
                                    };
                                }
                            },
                            statics: {
                                objectClass: { value: "sap.modeling.flowgraph.Output" },
                                layoutTemplate: {
                                    mainShape: [
                                        { shape: "RoundedRectangle", r: 7, domClass: "node", stroke: "#AAA8A7", strokeWidth: 1, fill: "url(#nodeFill)", padding: 0, width: 80, height: 14 },
                                        { shape: "Text", domClass: "outputName", text: "{object/displayName}", font: "bold 12px Calibri", fill: "black", horizontalAlignment: "width", verticalAlignment: "height", isWordWrap: true, isEllipsis: true}
                                    ]
                                },
                                // Adds event handlers to allow the creation of flow using drag & drop from an output
                                events: {
                                    "dragstart": function (oEvent, oSymbol, oExtension) {
                                        var oEditor = oExtension.editor,
                                            oTool = oEditor.selectTool("sap.modeling.flowgraph.ui.FlowSymbol", false),
                                            aViewPoint,
                                            aClientPoint;

                                        oEvent.preventDefault();
                                        oEvent.stopPropagation();

                                        // Gets client point
                                        aClientPoint = oEditor.viewer.normalizePointerEvent(oEvent, false);

                                        // Converts client point to view point in order to reuse CreateLinkSymbolTool.
                                        aViewPoint = oEditor.viewer.clientPointToViewPoint(aClientPoint);

                                        oEvent.clientViewX = aViewPoint[0];
                                        oEvent.clientViewY = aViewPoint[1];
                                        // Do not modify clientX, clientY
                                        oEvent._clientX = aClientPoint[0];
                                        oEvent._clientY = aClientPoint[1];
                                        oEvent._type = "drag";
                                        oTool.isContextButton = true;
                                        oEvent.contextButtonSymbol = oSymbol;
                                        oTool.onPointerDown(oEvent);
                                        oTool.onDragStart(oEvent);
                                    },
                                    "pointermove": function (oEvent, oSymbol, oExtension) {
                                        var oEditor = oExtension.editor;

                                        if (oEditor.tool && oEditor.tool.onPointerMove) {
                                            oEditor.tool.onPointerMove(oEvent);
                                        }
                                    },
                                    "drag": function (oEvent, oSymbol, oExtension) {
                                        var oEditor = oExtension.editor;

                                        if (oEditor.tool && oEditor.tool.onDrag) {
                                            oEditor.tool.onDrag(oEvent);
                                        }
                                    },
                                    "dragend": function (oEvent, oSymbol, oExtension) {
                                        var oEditor = oExtension.editor;

                                        if (oEditor.tool && oEditor.tool.onDragEnd) {
                                            oEditor.tool.onDragEnd(oEvent);
                                        }
                                    }
                                }
                            }
                        },

                        /**
                         * @class
                         * @name FlowSymbol
                         * The Flow symbol
                         */
                        "FlowSymbol": {
                            displayName: "Flow Symbol",
                            parent: "sap.galilei.ui.diagram.LinkSymbol",
                            properties: {
                                supportedSourceDirections: {
                                    defaultValue: function () { return [sap.galilei.ui.common.LinkDirection.west, sap.galilei.ui.common.LinkDirection.east]; }
                                },
                                supportedTargetDirections: {
                                    defaultValue: function () { return [sap.galilei.ui.common.LinkDirection.west, sap.galilei.ui.common.LinkDirection.east]; }
                                },
                                contentOffsetX: {
                                    dataType: sap.galilei.model.dataTypes.gDouble, defaultValue: 15
                                },
                                contentOffsetY: {
                                    dataType: sap.galilei.model.dataTypes.gDouble, defaultValue: 1
                                }
                            },
                            statics: {
                                objectClass: { value: "sap.modeling.flowgraph.Flow" },
                                layoutTemplate: {
                                    stroke: "#808080",
                                    strokeWidth: 1,
                                    lineStyle: "{lineStyle}",
                                    targetArrow: "Arrows.FilledEnd"
                                }
                            }
                        }
                    }
                }
            }
        };

    oResource = new sap.galilei.model.Resource();
    oReader = new sap.galilei.model.JSONReader();
    oReader.load(oResource, oDiagramDef);
}());