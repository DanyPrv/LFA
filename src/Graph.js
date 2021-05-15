import './App.css';
import React, {useState} from "react";
import {Row, Col, Container} from 'react-bootstrap';
import {initialGraph} from "./helpers";
import { useForm } from "react-hook-form"
import Graph from "react-graph-vis";
export default function GraphContainer() {
  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm();

  const [graphState, setGraphState] = useState(initialGraph);
  const [selectedNode, setSelectedNode] = useState([]);
  const [selectedEdges, setSelectedEdges] = useState([]);
  const [addNode, setAddNode] = useState(false);
  const [addEdge, setAddEdge] = useState(false);
  const options = {
    edges: {
      color: "#ff0000"
    },
    height: "500px"
  };

  const events = {
    select: function(event) {
      let { nodes, edges } = event;
      setSelectedEdges(edges);
      setSelectedNode(nodes);
    }
  };
  const deleteNode= () =>{
    const newGraph = {
      nodes: graphState.nodes.filter(node=> node.id !== selectedNode[0]),
      edges: graphState.edges.filter(edge=> !selectedEdges.includes(edge.id))
    }
    setGraphState(newGraph);
    setSelectedNode([]);
    setSelectedEdges([]);
  }
  const deleteEdge = () =>{
    const newGraph = {
      nodes: graphState.nodes,
      edges: graphState.edges.filter(edge=> edge.id !== selectedEdges[0])
    }
    setGraphState(newGraph);
    setSelectedNode([]);
    setSelectedEdges([]);
  }
  const addNodeToGraph = (data) => {
    const newGraph = {
      nodes: [...graphState.nodes, {id:data.key, label:data.value}],
      edges: graphState.edges
    }
    setGraphState(newGraph);
    reset();
    setAddNode(false);
  }
  const addEdgeToGraph = (data) => {
    const newGraph = {
      nodes: graphState.nodes,
      edges:  [...graphState.edges, {id:data.key, from:data.from, to: data.to}]
    }
    setGraphState(newGraph);
    reset();
    setAddEdge(false);
  }
  const onSetAddNode=(value)=>{
    setAddNode(value);
    setAddEdge(false);
  }
  const onSetAddEdge=(value)=>{
    setAddEdge(value);
    setAddNode(false);
  }
  return (
    <div  className="App">
      <Container>
        <h1>
          Graph editor
          <button className="btn btn-outline-primary ml-3" onClick={()=>window.location.href='/'}>Go back</button>
        </h1>
        <Row>
          <Col className="block-example border border-primary" xs={8}>
            <Graph
              graph={graphState}
              options={options}
              events={events}
            />
          </Col>
          <Col xs={4}>
            <Row>
              <button className="btn btn-primary ml-3" onClick={()=>onSetAddNode(!addNode)}>Add node</button>
              <button className="btn btn-primary ml-3" onClick={()=>onSetAddEdge(!addEdge)}>Add edge</button>

              {selectedNode.length?(
                <button className="btn btn-primary ml-3" onClick={()=>deleteNode()}> Delete node {selectedNode[0]}</button>
              ):null}
              {selectedNode.length===0 && selectedEdges.length===1 ?(
                <button className="btn btn-primary ml-3" onClick={()=>deleteEdge()}> Delete edge {selectedEdges[0]}</button>
              ):null}
            </Row>

            {addNode &&
            <Row>
              <Row>
                <h3 className="ml-3 mt-3">Add node</h3>
              </Row>
              <Row className="ml-3 mt-3">
                <form onSubmit={handleSubmit(addNodeToGraph)}>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">Value:</span>
                    </div>
                    <input {...register("value",{required:true})} />
                  </div>
                  {errors.value &&
                  <h6 style={{color:"red"}}>
                    Please enter a value
                  </h6>}
                  <div className="input-group mt-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">Key</span>
                    </div>
                    <input {...register("key",{
                      validate: value =>
                        ![
                          ...graphState.edges.map(edge=>edge.id.toString()),
                          ...graphState.nodes.map(node=>node.id.toString())
                        ].includes(value),
                      required: true
                    })} />
                  </div>
                  {errors.key &&
                  <h6 style={{color:"red"}}>
                    {errors.key.type==='validate'?'This key is already taken':'Please enter a key'}
                  </h6>}
                  <button className="btn btn-primary mt-3">Submit</button>
                </form>
              </Row>
            </Row>
            }

            {addEdge &&
            <>
              <Row>
                <h3 className="ml-3 mt-3">Add edge</h3>
              </Row>
              <Row className="ml-3 mt-3">
                <form onSubmit={handleSubmit(addEdgeToGraph)}>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">From:</span>
                    </div>
                    <select {...register("from")} className="col-md-auto">
                      {graphState.nodes.map(node=> <option id={`from-${node.id}`} value={node.id}>{`${node.id} | ${node.label}`}</option>)}
                    </select>
                  </div>
                  {errors.from &&
                  <h6 style={{color:"red"}}>
                    Please enter a value
                  </h6>}

                  <div className="input-group mt-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">To</span>
                    </div>
                    <select className="col-md-auto" {...register("to", {
                      validate: value => {
                        const fromMatch = graphState.edges.filter(edge=> edge.from.toString() === getValues('from'));
                        return !fromMatch.map(edge=>edge.to.toString()).includes(value);
                      }
                    })} >
                      {graphState.nodes.map(node=> <option id={`to-${node.id}`} value={node.id}>{`${node.id} | ${node.label}`}</option>)}
                    </select>
                  </div>
                  {errors.to &&
                  <h6 style={{color:"red"}}>
                    This edge already exist
                  </h6>}

                  <div className="input-group mt-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">Key</span>
                    </div>
                    <input {...register("key",{
                      validate: value =>
                        ![
                          ...graphState.edges.map(edge=>edge.id.toString()),
                          ...graphState.nodes.map(node=>node.id.toString())
                        ].includes(value),
                      required:true
                    })} />
                  </div>
                  {errors.key &&
                  <h6 style={{color:"red"}}>
                    {errors.key.type==='validate'?'This key is already taken':'Please enter a key'}
                  </h6>}
                  <button className="btn btn-primary mt-3">Submit</button>
                </form>
              </Row>
            </>
            }
          </Col>
        </Row>
      </Container>
    </div>
  );
}