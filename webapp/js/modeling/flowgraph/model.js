/**
 * Simplified Flow Graph Model.
 
 * Date: 13/03/15
 * (c) Copyright 2013-2015 SAP AG. All rights reserved
 */

(function () {

    /**
     * Flow graph meta-model definition
     * */
    var oResource,
        oReader,
        oModelDef = {
            contents: {
                /**
                 * Sap.Modeling.FlowGraph.Model definition
                 */
                "Sap.Modeling.FlowGraph.Model": {
                    classDefinition: "sap.galilei.model.Package",
                    displayName: "Flow Graph Model",
                    namespaceName: "sap.modeling.flowgraph",
                    classifiers: {
                        /**
                         * @class
                         * Node
                         * A Node can have several input anchors and several output anchors.
                         */
                        "Node": {
                            displayName: "Node",
                            parent: "sap.galilei.common.NamedObject",
                            properties: {
                            },
                            references: {
                                /**
                                 * Input anchors
                                 */
                                inputs: {
                                    name: "inputs",
                                    contentType: "sap.modeling.flowgraph.Input",
                                    isMany: true,
                                    isContainment: true
                                },
                                /**
                                 * Output anchors
                                 */
                                outputs: {
                                    name: "outputs",
                                    contentType: "sap.modeling.flowgraph.Output",
                                    isMany: true,
                                    isContainment: true
                                }
                            }
                        },
                        /**
                         * @class
                         * Input Anchor.
                         * An Input Anchor belongs to a Node.
                         */
                        "Input": {
                            displayName: "Input",
                            parent: "sap.galilei.common.NamedObject",
                            properties: {
                                /**
                                 * Gets the parent node
                                 */
                                "Intput.node": {
                                    name: "node", get: function () { return this.container; }
                                },
                                "Input.type": { name: "type", dataType: sap.galilei.model.dataTypes.gString, defaultValue: "normal" }
                            }
                        },
                        /**
                         * @class
                         * Output Anchor
                         * An Output Anchor belongs to a Node.
                         */
                        "Output": {
                            displayName: "Output",
                            parent: "sap.galilei.common.NamedObject",
                            properties: {
                                /**
                                 * Gets the parent node
                                 */
                                "Output.node": {
                                    name: "node", get: function () { return this.container; }
                                },
                                "Output.type": { name: "type", dataType: sap.galilei.model.dataTypes.gString, defaultValue: "normal" }
                            }
                        },
                        /**
                         * @class
                         * Flow
                         * The Flow connects an output anchor of the source node to an input anchor of the target node.
                         */
                        "Flow": {
                            displayName: "Flow",
                            parent: "sap.galilei.common.LinkObject",
                            properties: {
                                /**
                                 * Gets or sets the output anchor of source node
                                 */
                                "sourceOutput": {
                                    get: function () {
                                        return this.source;
                                    },
                                    set: function (oSource) {
                                        this.source = oSource;
                                    }
                                },
                                /**
                                 * Gets or sets the input anchor of target node
                                 */
                                "targetInput": {
                                    get: function () {
                                        return this.target;
                                    },
                                    set: function (oSource) {
                                        this.target = oSource;
                                    }
                                },
                                /**
                                 * Gets the node of the source output anchor
                                 */
                                "sourceNode": {
                                    get: function () {
                                        return this.source && this.source.container;
                                    }
                                },
                                /**
                                 * Gets the node of the target input anchor
                                 */
                                "targetNode": {
                                    get: function () {
                                        return this.target && this.target.container;
                                    }
                                }
                            }
                        },
                        /**
                         * @class
                         * Flow Graph Model.
                         * The Flow Graph Model has nodes and flows.
                         */
                        "Model": {
                            displayName: "Model",
                            parent: "sap.galilei.common.Model",
                            references: {
                                "nodes": {
                                    name: "nodes",
                                    contentType: "sap.modeling.flowgraph.Node",
                                    isMany: true,
                                    isContainment: true
                                },
                                "flows": {
                                    name: "flows",
                                    contentType: "sap.modeling.flowgraph.Flow",
                                    isMany: true,
                                    isContainment: true
                                }
                            }
                        }
                    }
                }
            }
        };

    oResource = new sap.galilei.model.Resource();
    oReader = new sap.galilei.model.JSONReader();
    oReader.load(oResource, oModelDef);
}());
