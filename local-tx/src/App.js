import './App.css';
import React, {Component} from 'react'

class App extends React.Component {
  state = { lastPressedKey: null };
  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyPress);
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyPress);
  }
  handleKeyPress = event => {
    this.setState({ lastPressedKey: event.key });
    console.log("Press key",event.key)
    console.log("Press keyCode",event.keyCode)
  };

  render() {
    return <div>Key last pressed: {this.state.lastPressedKey}</div>;
  }
}

// ReactDOM.render(<App />, document.getElementById("root"));

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>

//       </header>
//     </div>
//   );
// }

export default App;
