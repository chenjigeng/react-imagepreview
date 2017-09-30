import React, { Component } from 'react';
import logo from './logo.svg';
import demo1 from './1.jpeg'
import demo2 from './2.jpg'
import demo3 from './3.jpg'
import './App.css';
import imagePreviewSingleton from './lib'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" onClick={(e) => {imagePreviewSingleton.show(logo, e.target)}}/>
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <header className="App-header">
          <img src={demo1} className="App-logo" alt="logo" onClick={(e) => {imagePreviewSingleton.show(demo1, e.target)}}/>
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <header className="App-header">
          <img src={demo2} className="App-logo" alt="logo" onClick={(e) => {imagePreviewSingleton.show(demo2, e.target)}}/>
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <header className="App-header">
          <img src={demo3} className="App-logo" alt="logo" onClick={(e) => {imagePreviewSingleton.show(demo3, e.target)}}/>
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
