import logo from './logo.svg';
import './index.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Sidebar from './components/Sidebar'
import MoonExchange from './components/MoonExchange';
import Home from './pages/home';
import History from './pages/history';
import Summary from './pages/summary';

function App() {
  return (
    <Router basename="">
      <div className="body">
        <Sidebar/>
        <Switch>
          {/* <Route path="/error" component={Error}></Route> */}
          <Route path="/home" component={Home}></Route>
          <Route path="/history" component={History}></Route>
          <Route path="/summary" component={Summary}></Route>
          <Route path="/" component={Home}></Route>
        </Switch>
      </div>
    </Router>
    // <div className="App">
    //   <h1>Buy Moon Coin</h1>
    //   <MoonExchange />
    // </div>
  );
}

export default App;
