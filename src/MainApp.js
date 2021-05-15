import './App.css';
import React  from "react";

export default function MainApp() {
  return (
    <div className="App">
      <h1>Please chose one</h1>
      <button className="btn btn-primary" onClick={()=>window.location.href='/regex'}>Regex</button>
      <button className="btn btn-primary mt-3" onClick={()=>window.location.href='/graph'}>Graph</button>
    </div>
  );
}

