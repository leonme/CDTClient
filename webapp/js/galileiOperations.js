cdt = {};
cdt.util = cdt.util || {};
cdt.util = {
    Operations: {

        // Creates the model content
        createFlowgraphDiagram: function (oNodes, oFlows) {
            var oResource = new sap.galilei.model.Resource();
            var oDiagram,
                oModel,
                oNode,
                oInput,
                oOutput,
                oNode1,
                oNode2,
                oNodeSymbol,
                oInputSymbol,
                oOutputSymbol,
                oFlow,
                oSourceOutput,
                oTargetInput,
                oSourceOutputSymbol,
                oTargetInputSymbol,
                oFlowSymbol,
                oAutoLayout;

            // Creates nodes and node symbols
            function createNodes() {
                var index,
                    oNodeDefinition,
                    index2,
                    oInputDefinition,
                    oOutputDefinition;

                if (oNodes && oNodes.length > 0) {
                    for (index = 0; index < oNodes.length; index++) {
                        // Creates node
                        oNodeDefinition = oNodes[index];
                        oNode = new sap.modeling.flowgraph.Node(oResource, {
                            name: oNodeDefinition.name,
                            displayName: oNodeDefinition.displayName
                        });
                        // Creates inputs
                        if (oNodeDefinition.inputs && oNodeDefinition.inputs.length > 0) {
                            for (index2 = 0; index2 < oNodeDefinition.inputs.length; index2++) {
                                oInputDefinition = oNodeDefinition.inputs[index2];
                                oInput = new sap.modeling.flowgraph.Input(oResource, {
                                    name: oInputDefinition.name,
                                    displayName: oInputDefinition.displayName
                                });
                                oNode.inputs.push(oInput);
                            }
                        }
                        // Creates outputs
                        if (oNodeDefinition.outputs && oNodeDefinition.outputs.length > 0) {
                            for (index2 = 0; index2 < oNodeDefinition.outputs.length; index2++) {
                                oOutputDefinition = oNodeDefinition.outputs[index2];
                                oOutput = new sap.modeling.flowgraph.Output(oResource, {
                                    name: oOutputDefinition.name,
                                    displayName: oOutputDefinition.displayName
                                });
                                oNode.outputs.push(oOutput);
                            }
                        }
                        oModel.nodes.push(oNode);

                        // Creates node symbol
                        oNodeSymbol = new sap.modeling.flowgraph.ui.NodeSymbol(oResource, {
                            object: oNode
                        });
                        oDiagram.symbols.push(oNodeSymbol);

                        // Creates input symbols
                        for (index2 = 0; index2 < oNode.inputs.length; index2++) {
                            oInput = oNode.inputs.get(index2);
                            oInputSymbol = new sap.modeling.flowgraph.ui.InputSymbol(oResource, {
                                object: oInput
                            });
                            oNodeSymbol.symbols.push(oInputSymbol);
                        }

                        // Creates output symbols
                        for (index2 = 0; index2 < oNode.outputs.length; index2++) {
                            oOutput = oNode.outputs.get(index2);
                            oOutputSymbol = new sap.modeling.flowgraph.ui.OutputSymbol(oResource, {
                                object: oOutput
                            });
                            oNodeSymbol.symbols.push(oOutputSymbol);
                        }

                        oNodeSymbol.updateBoundarySymbols();
                    }
                }
            }

            // Creates flows symbols
            function createFlows() {
                var index,
                    oFlowDefinition;

                if (oFlows && oFlows.length > 0) {
                    for (index = 0; index < oFlows.length; index++) {
                        // Creates join
                        oFlowDefinition = oFlows[index];
                        // Finds source and target nodes
                        oNode1 = oResource.selectObject({
                            "classDefinition.name": "Node",
                            name: oFlowDefinition.sourceNode
                        });
                        oNode2 = oResource.selectObject({
                            "classDefinition.name": "Node",
                            name: oFlowDefinition.targetNode
                        });
                        if (oNode1 && oNode2) {
                            oSourceOutput = oNode1.outputs.selectObject({
                                name: oFlowDefinition.sourceOutput
                            });
                            oTargetInput = oNode2.inputs.selectObject({
                                name: oFlowDefinition.targetInput
                            });
                            if (oSourceOutput && oTargetInput) {
                                // Creates flow
                                oFlow = new sap.modeling.flowgraph.Flow(oResource, {
                                    name: oFlowDefinition.name,
                                    displayName: oFlowDefinition.displayName,
                                    source: oSourceOutput,
                                    target: oTargetInput
                                });
                                oModel.flows.push(oFlow);

                                // Finds source and target symbols
                                if (oSourceOutput.relatedSymbols.length > 0) {
                                    oSourceOutputSymbol = oSourceOutput.relatedSymbols.get(0);
                                }
                                if (oTargetInput.relatedSymbols.length > 0) {
                                    oTargetInputSymbol = oTargetInput.relatedSymbols.get(0);
                                }

                                if (oSourceOutputSymbol && oTargetInputSymbol) {
                                    // Creates flow symbol
                                    oFlowSymbol = new sap.modeling.flowgraph.ui.FlowSymbol(oResource, {
                                        object: oFlow,
                                        sourceSymbol: oSourceOutputSymbol,
                                        targetSymbol: oTargetInputSymbol
                                    });
                                    oDiagram.symbols.push(oFlowSymbol);
                                }
                            }
                        }
                    }
                }
            }

            // Creates a new model
            oModel = new sap.modeling.flowgraph.Model(oResource);

            // Creates a new diagram
            oDiagram = new sap.modeling.flowgraph.ui.Diagram(oResource, {model: oModel});

            // Creates nodes
            createNodes();

            // Creates flows
            createFlows();

            return oDiagram;
        },
        // Creates the diagram editor
        createEditor: function (oDiagram, sParentSelector) {
            oEditor = new sap.galilei.ui.editor.DiagramEditor(oDiagram, sParentSelector, {
                extension: {
                    extensionClass: sap.modeling.flowgraph.ui.DiagramEditorExtension
                },
                viewer: {
                    viewBorderWidth: 0,
                    pageHorzNumber: 5,
                    pageVertNumber: 4,
                    showPageLimit: false,
                    showGrid: true,
                    showZoomTools: true
                }
            });
            return oEditor;
        },

        setupToolbar: function (oEditor) {

            $("input[id*='pointer']").on("click", function () {
                oEditor.selectTool(sap.galilei.ui.editor.tool.PointerTool.NAME);
            });

            // For Lasso mode, select the predefined LassoTool
            $("input[id*='lasso']").on("click", function () {
                oEditor.selectTool(sap.galilei.ui.editor.tool.LassoTool.NAME);
            });

            // Undo, calls the undo() function of the editor
            $("input[id*='lasso']").on("click", function () {
                oEditor.undo();
            });

            // Redo, calls the redo() function of the editor
            $("input[id*='redo']").on("click", function () {
                oEditor.redo();
            });

            // Delete, calls the deleteSelectedSymbols() function of the editor
            $("input[id*='delete']").on("click", function () {
                oEditor.deleteSelectedSymbols();
            });

            // Selects the create StartEventSymbol tool
            $("input[id*='startEventTool']").on("mousedown", function () {
                console.log("Start event tool");
                oEditor.selectTool("sap.modeling.bpmn.ui.StartEventSymbol");
            });

            // Selects the create TaskSymbol tool
            $("input[id*='taskTool']").on("mousedown", function () {
                console.log("Task tool");
                oEditor.selectTool("sap.modeling.bpmn.ui.TaskSymbol");
            });

            // Selects the create GatewaySymbol tool
            $("input[id*='gatewayTool']").on("mousedown", function () {
                console.log("Gateway tool");
                oEditor.selectTool("sap.modeling.bpmn.ui.GatewaySymbol");
            });

            // Selects the create EndEventSymbol tool
            $("input[id*='endEventTool']").on("mousedown", function () {
                console.log("End event tool");
                oEditor.selectTool("sap.modeling.bpmn.ui.EndEventSymbol");
            });

            // Selects the create SequenceFlowSymbol tool
            $("input[id*='flowTool']").on("mousedown", function () {
                console.log("Flow tool");
                oEditor.selectTool("sap.modeling.bpmn.ui.LinkSymbols");
            });
            $("input[id*='flowgraphTool']").on("mousedown", function () {
                console.log("Flow tool");
                oEditor.selectTool("sap.modeling.flowgraph.ui.FlowSymbol");
            });

            $("input[id*='nodeTool']").on("mousedown", function () {
                console.log("Node tool");
                oEditor.selectTool("sap.modeling.flowgraph.ui.NodeSymbol");
            });
            // Zoom in, calls the zoomIn() function of the viewer.
            $("input[id*='zoomIn']").on("mousedown", function () {
                oEditor.viewer.zoomIn();
            });

            // Zoom out, calls the zoomOut() function of the viewer.
            $("input[id*='zoomOut']").on("mousedown", function () {
                oEditor.viewer.zoomOut();
            });

            // Global view, calls the showGlobalView() function of the viewer.
            $("input[id*='globalView']").on("mousedown", function () {
                oEditor.viewer.showGlobalView();
            });

            // Save, generates the JSON format and shows it in the console log
            $("input[id*='save']").on("mousedown", function () {
                //        var oWriter = new sap.galilei.model.JSONWriter(), // Creates a JSON
                //															// writer
                //            oResult = oWriter.save(oResource); // Calls the save() function to
                // generate the JSON.

                // Displays the number of objects.
                // The first object is the model, the second is the diagram.
                // You can iterate in oResource.objects to get the model, diagram,
                // objects and symbols.
                //        console.log("There are " + oResource.objects.length + " objects in the resource.");
                //        console.log("There are " + oEditor.model.startEvents.length + " start events in the model.");
                //        console.log("There are " + oEditor.model.activities.length + " tasks in the model.");
                //        console.log("There are " + oEditor.model.gateways.length + " gateways in the model.");
                //        console.log("There are " + oEditor.model.endEvents.length + " end events in the model.");
                //        console.log("There are " + oEditor.model.sequenceFlows.length + " sequence flows in the model.");
                //        console.log("There are " + oEditor.diagram.symbols.length + " symbols in the diagram.");

                // Displays the JSON
                //        console.log("JSON of the model and diagram:");
                //        console.log(oResult);
                //        alert("Open the browser console to see the saved JSON of the model and diagram.", "Message");
                var oExporter = new sap.modeling.cdt.GalileiBpmn2Transformation();
                var sXML = oExporter.transformDiagram(oEditor.model, oEditor.diagram);
                //var oBlob = new Blob([oExporter.writer.serialize()], { type: "text/xml" });
                var oBlob = sap.galilei.ui.common.Blob.createBlobFromString(sXML, "text/xml");
                sap.galilei.ui.common.FileManager.saveAs(oBlob, "routing.bpmn2");
            });

            // Load a JSON format
            $("input[id*='load']").on("mousedown", function () {
                var dialog = new sap.m.Dialog({
                    title: 'Load routing ...',
                    contentWidth: '30%',
                    contentHeight: '20%',
                    draggable: true,

                });

                var simpleForm = new sap.ui.layout.form.SimpleForm({
                    labelSpanL: 2,
                    editable: true,
                    layout: 'ResponsiveGridLayout'
                });
                var columnNameLabel = new sap.m.Label({
                    text: 'Routing Name',
                    textAlign: 'Center',
                    required: true,
                });
                var columnNameInput = new sap.m.Input({
                    id: 'routingName'
                });
                columnNameLabel.setLabelFor(columnNameInput);
                simpleForm.addContent(columnNameLabel).addContent(columnNameInput);
                dialog.addContent(simpleForm);
                dialog.addButton(new sap.m.Button("OK", {
                    text: 'OK', press: function () {
                        cdt.util.Operations.openCleanDiagramConfirmMsg(sap.ui.getCore().byId('routingName').getValue(), oEditor);
                        dialog.close();
                        dialog.destroy();

                    }
                }));

                dialog.open();
            });

            $("input[id*='autoLayoutTool']").on("mousedown", function () {
                cdt.util.Operations.autoLayout(oEditor);
            });
        },
        openCleanDiagramConfirmMsg: function (routing, oEditor) {
            var dialog = new sap.m.Dialog({
                title: 'Confirm',
                type: 'Message',
                content: new sap.m.Text({text: 'Are you sure you want to clean the diagram and load the routing?'}),
                beginButton: new sap.m.Button({
                    text: 'Ok',
                    press: function () {
                        var url_gettingRoutings = getBaseUrl() + '/cdt/routings/' + routing.trim();
                        sap.ui.core.BusyIndicator.show(0);
                        var bpmn = getServiceResponse(url_gettingRoutings);

                        var oExporter = new sap.modeling.cdt.Bpmn2GalileiTransformation();
                        oEditor.diagram.symbols.deleteAll();
                        oExporter.transformDiagram(bpmn, oEditor.model, oEditor.diagram);
                        oEditor.updateDiagram();
                        cdt.util.Operations.autoLayout(oEditor);
                        sap.ui.core.BusyIndicator.hide();
                        dialog.close();
                    }
                }),
                endButton: new sap.m.Button({
                    text: 'Cancel',
                    press: function () {
                        dialog.close();
                    }
                }),
                afterClose: function () {
                    dialog.destroy();
                }
            });

            dialog.open();
        },
        autoLayout: function (oEditor) {
            // Creates a diagram auto-layout helper.
            oAutoLayout = new sap.galilei.ui.editor.layout.DiagramAutoLayout();
            // Layouts the diagram (all top-level symbols) using the "Layered" algorithm that is based on klay.js. The klay.js needs to be included manually.
            // The layouter is sap.galilei.ui.common.layout.KlayLayouter.
            // For the options, see http://layout.rtsys.informatik.uni-kiel.de:9444/Providedlayout.html?algorithm=de.cau.cs.kieler.klay.layered
            // The other layouters are "Directed" and "Organic". They are based on dagre.js. The dagre.js needs to be included manually.
            // You could also develop your own layouter.
            oAutoLayout.layoutDiagram(oEditor.diagram, {
                    isSupportMultiEdges: true,
                    isIncludeSubLinkSymbols: true,
                    isDirected: true,
                    // Specify the layouter name and its options (klay.js options)
                    layout: {
                        name: "Layered", // klay.js only supports the "Layered" algorithm
                        direction: "RIGHT", // Layout direction
                        nodePlace: "LINEAR_SEGMENTS",
                        edgeRouting: "ORTHOGONAL",
                        spacing: 100, // Distance between nodes
                        edgeSpacingFactor: 0.4
                    },
                    animationDuration: 500
                },
                oEditor,
                function (oAutoLayout) {
                    // If success, show the global view.
                    oAutoLayout.editor.showGlobalView();
                },
                function (error) {
                    throw error;
                }
            );
        }
    }
};
