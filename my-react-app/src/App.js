import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Investors from './pages/Investors';
import InvestorCommitments from './pages/investor_commitment'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/investors" element={<Investors />} />
          <Route path="/" element={<Investors />} />
          <Route path="/investor/:investor_name" element={<InvestorCommitments />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
