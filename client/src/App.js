import { useState } from "react";
import axios from "axios";

import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");

  const typeCodeHandler = (e) => {
    setCode(e.target.value);
  };

  const submitHandler = async () => {
    const payload = { language, code };

    try {
      const { data } = await axios.post("http://localhost:5000/run", payload);
      setOutput(data.output.stdout);
    } catch (err) {
      setOutput(err.response.data.error.message);
    }
  };

  const selectLanguageHandler = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="App">
      <h1>Online Code Compiler</h1>
      <div>
        <label>Language: </label>
        <select value={language} onChange={selectLanguageHandler}>
          <option value="cpp">C++</option>
          <option value="py">Python</option>
        </select>
      </div>
      <br />
      <textarea cols="80" rows="20" value={code} onChange={typeCodeHandler}></textarea>
      <br />
      <button onClick={submitHandler}>Submit</button>
      <p>{output}</p>
    </div>
  );
}

export default App;
