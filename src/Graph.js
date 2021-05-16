import './App.css';
import React, {useState} from "react";
import cloneDeep from 'lodash/cloneDeep';
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
      setSelectedEdges([]);
      setSelectedNode([]);
      let { nodes, edges } = event;
      reset();
      setSelectedEdges(edges);
      setSelectedNode(nodes);
      setAddNode(false);
      setAddEdge(false);
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
  const editNodeToGraph = (data) => {
    let newGraph = cloneDeep(graphState);
    newGraph.nodes.forEach(node=>{
      if(node.id===selectedNode[0]){
        node.id = data.key;
        node.label = data.value;
      }
    })
    newGraph.edges.forEach(edge=>{
      if(edge.from === selectedNode[0]){
        edge.from = data.key;
      }
      if(edge.to === selectedNode[0]){
        edge.to = data.key;
      }
    })
    setSelectedNode([]);
    setSelectedEdges([]);
    setGraphState(newGraph);
    reset();
  }
  const editEdgeToGraph = (data) => {
    let newGraph = cloneDeep(graphState);
    newGraph.edges.forEach(edge=>{
      if(edge.id === selectedEdges[0]){
        edge.from = data.from;
        edge.to = data.to;
        edge.id = data.key;
      }
    })
    setSelectedNode([]);
    setSelectedEdges([]);
    setGraphState(newGraph);
    reset();
    setAddEdge(false);
  }

  const onSetAddNode=(value)=>{
    reset();
    setAddNode(value);
    setAddEdge(false);
    setSelectedEdges([]);
    setSelectedNode([]);
  }
  const onSetAddEdge=(value)=>{
    reset();
    setSelectedEdges([]);
    setSelectedNode([]);
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
                          ...graphState.edges.map(edge=>edge.id),
                          ...graphState.nodes.map(node=>node.id)
                        ].includes(value),
                      required: true
                    })} />
                  </div>
                  {errors.key &&
                  <h6 style={{color:"red"}}>
                    {errors.key.type==='validate'?'This key is already taken':'Please enter a key'}
                    <br/>
                    Used keys: {[ ...graphState.edges.map(edge=>edge.id), ...graphState.nodes.map(node=>node.id)].join(', ')}
                  </h6>}
                  <button className="btn btn-primary mt-3">Submit</button>
                  <button className="btn btn-primary mt-3 ml-3" onClick={()=>onSetAddNode(!addNode)}>Close</button>
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
                        const fromMatch = graphState.edges.filter(edge=> edge.from === getValues('from'));
                        return !fromMatch.map(edge=>edge.to).includes(value);
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
                          ...graphState.edges.map(edge=>edge.id),
                          ...graphState.nodes.map(node=>node.id)
                        ].includes(value),
                      required:true
                    })} />
                  </div>
                  {errors.key &&
                  <h6 style={{color:"red"}}>
                    {errors.key.type==='validate'?'This key is already taken':'Please enter a key'}
                    <br/>
                    Used keys: {[ ...graphState.edges.map(edge=>edge.id), ...graphState.nodes.map(node=>node.id)].join(', ')}
                  </h6>}
                  <button className="btn btn-primary mt-3">Submit</button>
                  <button className="btn btn-primary mt-3 ml-3" onClick={()=>onSetAddEdge(!addEdge)}>Close</button>
                </form>
              </Row>
            </>
            }

            {selectedNode.length>0 &&
            <Row>
              <Row>
                <h3 className="ml-3 mt-3">Edit node</h3>
              </Row>
              <Row className="ml-3 mt-3">
                <form onSubmit={handleSubmit(editNodeToGraph)}>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">Value:</span>
                    </div>
                    <input
                      defaultValue={graphState.nodes.filter(node=>node.id === selectedNode[0])[0].label || ''}
                      {...register("value",{required:true})}
                    />
                  </div>
                  {errors.value &&
                  <h6 style={{color:"red"}}>
                    Please enter a value
                  </h6>}
                  <div className="input-group mt-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">Key</span>
                    </div>
                    <input
                      defaultValue={graphState.nodes.filter(node=>node.id === selectedNode[0])[0].id || ''}
                      {...register("key",{
                      validate: value =>
                        ![
                          ...graphState.edges.map(edge=>edge.id),
                          ...graphState.nodes.map(node=>node.id)
                        ].includes(value) || value===selectedNode[0],
                      required: true
                    })} />
                  </div>
                  {errors.key &&
                  <h6 style={{color:"red"}}>
                    {errors.key.type==='validate'?'This key is already taken':'Please enter a key'}
                    <br/>
                    Used keys: {[ ...graphState.edges.map(edge=>edge.id), ...graphState.nodes.map(node=>node.id)].join(', ')}
                  </h6>}
                  <button className="btn btn-primary mt-3">Save</button>
                </form>
              </Row>
            </Row>
            }

            {selectedEdges.length === 1 && selectedNode.length === 0 &&
            <>
              <Row>
                <h3 className="ml-3 mt-3">Edit edge</h3>
              </Row>
              <Row className="ml-3 mt-3">
                <form onSubmit={handleSubmit(editEdgeToGraph)}>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">From:</span>
                    </div>
                    <select
                      defaultValue={graphState.edges.filter(edge=>edge.id === selectedEdges[0])[0].from || ''}
                      {...register("from")} className="col-md-auto">
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
                    <select
                      className="col-md-auto"
                      defaultValue={graphState.edges.filter(edge=>edge.id === selectedEdges[0])[0].to || ''}
                      {...register("to", {
                      validate: value => {
                        const fromMatch = graphState.edges.filter(edge=>
                          edge.from === getValues('from') && edge.id !== selectedEdges[0]);
                        return !fromMatch.map(edge=>edge.to).includes(value);
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
                    <input
                      defaultValue={selectedEdges[0]}
                      {...register("key",{
                      validate: value =>
                        ![
                          ...graphState.edges.map(edge=>edge.id),
                          ...graphState.nodes.map(node=>node.id)
                        ].includes(value) || value===selectedEdges[0],
                      required:true
                    })} />
                  </div>
                  {errors.key &&
                  <h6 style={{color:"red"}}>
                    {errors.key.type==='validate'?'This key is already taken':'Please enter a key'}
                    <br/>
                    Used keys: {[ ...graphState.edges.map(edge=>edge.id), ...graphState.nodes.map(node=>node.id)].join(', ')}
                  </h6>}
                  <button className="btn btn-primary mt-3">Save</button>
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