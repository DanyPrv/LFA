import './App.css';
import React  from "react";

export default function App() {
  const [regex, setRegex] = React.useState("");
  const [text, setText] = React.useState("");
  const [result, setResult] = React.useState(null);
  const [invalidRegex, setInvalidRegex] = React.useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    let regexConst;
    setInvalidRegex(false);
    try {
      regexConst = new RegExp(regex,'igm');
    } catch (error){
      setInvalidRegex(true);
      setResult(null);
      return;
    }
    let match=regexConst.exec(text);
    const array= [];
    while (match) {
      array.push({first:match.index, last:regexConst.lastIndex});
      match=regexConst.exec(text);
    }
    const res = [];
    array.forEach(item =>{
      let preStr = text.substring(0, item.first);
      let currentStr = text.substring(item.first,item.last);
      let postStr = text.substring(item.last, text.length);
      res.push(preStr+`<span style="color: red">${currentStr}</span>`+postStr);
    })
    setResult(res);
  }

  return (
    <div className="App">
      <h1>Test regex on string</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon3">Regex:</span>
          </div>
          <input
            name="regex"
            type="text"
            value={regex}
            onChange={e => setRegex(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon3">Search in  :</span>
          </div>
          <input
            name="text"
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
      <div>
        {invalidRegex &&
          <h3 style={{color:"red"}}>
            Invalid Regex
          </h3>}
        {result &&
          <>
            <h3>
              {result.length ?
                <>Found {result.length} results:</> : <>No search result</>}
            </h3>
            {result.map((item, index)=>{
              return (<h4 className="p-1" key={index} dangerouslySetInnerHTML={{__html: item}}>
              </h4>);
            })}
          </>
        }
      </div>
    </div>
  );
}

