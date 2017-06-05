/**
 * Provides export diagram as image functions.
 
 * Date: 17/10/14
 * (c) Copyright 2013-2014 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.galilei.ui5.diagram.ExportDiagram");

(function () {
    "use strict";

    /**
     * @class
     * Provides printing diagram functions.
     * @public
     */
    sap.galilei.ui5.diagram.ExportDiagram = sap.galilei.core.defineClass({
        // Define class name
        fullClassName: "sap.galilei.ui5.diagram.ExportDiagram",

        // Define statics
        statics: {
            /**
             * Prints the diagram. Shows the print diagram dialog, then print the diagram.
             * @static
             * @name exportImage
             * @memberOf sap.galilei.ui5.diagram.ExportDiagram#
             * @param {sap.galilei.ui.editor.DiagramEditor} oDiagramEditor The diagram editor.
             * @param {object} oOptions (optional) The export options. The options are:
             *     includeDecoratorLayers: Indicates whether decorator layers should be included. Default: false.
             *     fileName: The file name without extension.
             *     imageType: The image type. It could be: "image/png", "image/jpeg", "image/svg". The default is "image/svg".
             *     maxWidth: The maximum width in pixels for PNG or JPEG.
             *     maxHeight: The maximum height in pixels for PNG or JPEG.
             */
            exportImage: function (oDiagramEditor, oOptions) {
                var sFilename,
                    sImageType,
                    oGlobalViewRect,
                    nMaxWidth,
                    nMaxHeight,
                    bIncludeDecoratorLayers,
                    oImageRect,
                    oImageOptions,
                    oBlob;

                if (oDiagramEditor) {
                    oOptions = oOptions || {};
                    sFilename = oOptions.fileName || oDiagramEditor.diagram.name || oDiagramEditor.diagram.Name || "Diagram"; // PowerDesigner diagram may have Name.
                    sImageType = oOptions.imageType || "image/svg";
                    nMaxWidth = oOptions.maxWidth || 4096;
                    nMaxHeight = oOptions.nMaxHeight || 4096;
                    bIncludeDecoratorLayers = oOptions.includeDecoratorLayers !== undefined ? oOptions.includeDecoratorLayers : false;

                    oImageOptions = {
                        includeDecoratorLayers: bIncludeDecoratorLayers,
                        replaceImageURL: true
                    };

                    try {
                        if (sImageType === "image/png" || sImageType === "image/jpeg") {
                            // Generates PNG or JPEG
                            if (sImageType === "image/png") {
                                sFilename += ".png";
                            } else {
                                sFilename += ".jpg";
                            }
                            oGlobalViewRect = oDiagramEditor.viewer.getGlobalViewRect() || (new sap.galilei.ui.common.Rect());
                            oGlobalViewRect.inflate(sap.galilei.ui.common.svg.Svg.SVG_RECT_MARGIN, sap.galilei.ui.common.svg.Svg.SVG_RECT_MARGIN);
                            // Limit image size
                            if (!isNaN(nMaxWidth) && !isNaN(nMaxHeight) && (oGlobalViewRect.width > nMaxWidth || oGlobalViewRect.height > nMaxHeight)) {
                                oImageRect = oGlobalViewRect.resize(nMaxWidth, nMaxHeight, true, true, false, true);
                                nMaxWidth = oImageRect.width;
                                nMaxHeight = oImageRect.height;
                            } else {
                                nMaxWidth = oGlobalViewRect.width;
                                nMaxHeight = oGlobalViewRect.height;
                            }

                            oImageOptions.width = nMaxWidth;
                            oImageOptions.height = nMaxHeight;
                            oImageOptions.adjustTargetImageSize = true;

                            oDiagramEditor.viewer.generateImageBlob(function (oBlob) {
                                sap.galilei.ui.common.FileManager.saveAs(oBlob, sFilename);
                            }, sImageType, oImageOptions);
                        } else {
                            // Generates the SVG blob
                            sFilename += ".svg";
                            oBlob = oDiagramEditor.viewer.generateSVGBlob(oImageOptions, function (oBlob) {
                                sap.galilei.ui.common.FileManager.saveAs(oBlob, sFilename);
                            });
                        }
                    } catch (e) {
                        //noinspection Eslint
                    }
                }
            }
        }
    });
}());