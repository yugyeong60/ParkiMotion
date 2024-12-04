import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Page1 from './components/Page1';
import Page2 from './components/Page2';
import Eyes from './examination/Eyes';
import Hands from './examination/Hands';
import Walking from './examination/Walking';
import Patient from './patients/Patient';
import Dashbord from './components/dashbord';

function App() {
  const [token, setToken] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page1 setToken={setToken} />} />
        <Route path="/dashbord" element={<Dashbord token={token} />} />
        <Route path="/page2" element={<Page2 token={token} />} />
        <Route path="/eyes" element={<Eyes token={token} />} />
        <Route path="/hands" element={<Hands token={token} />} />
        <Route path="/walking" element={<Walking token={token} />} />
        <Route path="/patient" element={<Patient />} />

      </Routes>
    </Router>
  );
}

export default App;
