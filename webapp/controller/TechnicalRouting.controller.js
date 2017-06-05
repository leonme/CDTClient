sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function (jQuery, Fragment, Controller, JSONModel, Editor) {
	"use strict";
    // Defines the default parameters for the diagram editor control.
	sap.galilei.ui5.EditorSettings.showGrid = true;
	sap.galilei.ui5.EditorSettings.snapToGrid = true;
	sap.galilei.ui5.EditorSettings.viewBackgroundFill = "#FFFFFF";
	sap.galilei.ui5.EditorSettings.pageBackgroundFill = "#FFFFFF";
	sap.galilei.ui5.EditorSettings.useContextButtonPad = true;

	var CController = Controller.extend("com.sap.cdt.controller.TechnicalRouting", {
        onInit: function () {
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("TechRoutingDiagram", "reloadDiagram", this.handleReloadDiagram, this);
        },

        handleReloadDiagram: function (channel, oEvent, oData) {
            var oEditor = this.getDiagramEditor();
            // var oExporter = new sap.modeling.bpmn.ui.Bpmn2GalileiTransformation();
//            oEditor.extensionClass = "sap.modeling.flowgraph.ui.DiagramEditorExtension";
//            oEditor.createExtension();
            oEditor.deleteAllSymbols();
            // oExporter.transformDiagram(oData, oEditor.model, oEditor.diagram);
            oEditor.updateDiagram();
            cdt.util.Operations.autoLayout(oEditor);
        },
        // Gets the Diagram Editor UI5 control
        getDiagramEditorControl: function () {
            var oView = this.getView();
            return oView && oView.byId("techGalileiEditor");
        },

        // Gets the DiagramEditor that is attached to the Diagram Editor UI5 control
        getDiagramEditor: function () {
            var oEditorControl = this.getDiagramEditorControl();

            return oEditorControl && oEditorControl.getInnerEditor();
        },
        // Waits the diagramEditorReady event to make sure that the Diagram Editor UI5 control is initialized and the DiagramEditor is created.
        onDiagramEditorReady: function (oEvent) {
            console.log("Diagram Editor Ready");
        },

        // After the view is displayed, adds some symbols.
        onAfterRendering: function () {
            var oEditorControl = this.getDiagramEditorControl(),
                oDiagramEditor = this.getDiagramEditor(),
                oEditor = this.getDiagramEditor(),
                oDiagram,
                oResource = oDiagramEditor && oDiagramEditor.resource,
                oTask,
                oTaskSymbol,
                oTask2,
                oTaskSymbol2,
                oSequenceFlowSymbol;

            if (oEditorControl) {
                /*                // Creates a resource
                 oResource = new sap.galilei.model.Resource();
                 // Creates a model
                 oModel = new sap.modeling.bpmn.Model(oResource);
                 // Creates a diagram and associate it to the model
                 oDiagram = new sap.modeling.bpmn.ui.Diagram(oResource, { model: oModel});*/
                var oNodes = [
                    {
                        name: "Source1",
                        displayName: "Source 1",
                        outputs: [
                            { name: "db1", displayName: "db1" }
                        ]
                    },
                    {
                        name: "Source2",
                        displayName: "Source 2",
                        outputs: [
                            { name: "db2", displayName: "db2" }
                        ]
                    },
                    {
                        name: "Join1",
                        displayName: "Join 1",
                        inputs: [
                            { name: "in1", displayName: "In 1" },
                            { name: "in2", displayName: "In 2" },
                            { name: "in3", displayName: "In 3" }
                        ],
                        outputs: [
                            { name: "out", displayName: "Out" }
                        ]
                    }
                ];

                var oFlows = [
                    { name: "DbSource1", displayName: "DB Source 1", sourceNode: "Source1", sourceOutput: "db1", targetNode: "Join1", targetInput: "in1" },
                    { name: "DbSource2", displayName: "DB Source 2", sourceNode: "Source2", sourceOutput: "db2", targetNode: "Join1", targetInput: "in2" }
                ];
                oDiagram = cdt.util.Operations.createFlowgraphDiagram(oNodes, oFlows);
                oEditor.extensionClass = "sap.modeling.flowgraph.ui.DiagramEditorExtension";
                oEditor.createExtension();
                // Sets the current diagram in the editor control
                oEditorControl.setDiagram(oDiagram);
            }

            cdt.util.Operations.setupToolbar(oEditor);
            cdt.util.Operations.autoLayout(oEditor);
        }
	});
	return CController;
});