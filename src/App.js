import React, { Component } from 'react';
import './App.css';

// 使用konva绘制的canvas
// import { initScene } from './tools/renderRadar.js';
// 使用原生canvas脚本绘制
import { initScene } from './tools/renderPureRadar.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        "label": "Your score:",
        "score": 92,
        "scores": [
          { "type": "health", "score": "98" },
          { "type": "wealth", "score": "93" },
          { "type": "career", "score": "90" },
          { "type": "love", "score": "83" },
          { "type": "happiness", "score": "87" }
        ]
      }
    }
  }

  componentDidMount() {
    const { data } = this.state;
    // 获取canvas画布的宽度
    const offsetWidth = document.getElementById('radar-canvas').offsetWidth;
    // 绘制canvas
    initScene('radar-canvas', data, offsetWidth, offsetWidth);
  }

  render() {
    return (
      <div className="App">
        <div className="demo">
          <h1>Konva canvas demo:</h1>
          <div className="radar-canvas" id="radar-canvas"></div>
        </div>
      </div>
    );
  }
}

export default App;
