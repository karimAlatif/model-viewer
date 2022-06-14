import React, { Component } from 'react';
import logo from './logo.svg';
import Editor from './Editor';
import 'antd/dist/antd.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div style={{height: '100%'}}>
            <Editor />
        </div>
      </div>
    );
  }
}

export default App;
