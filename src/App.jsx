import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { SidenavProvider } from './contexts/SidenavContext';
import { AuthProvider } from './contexts/AuthContext';

import Header from './Components/Layout/Header/Header';
import Sidenav from './Components/Layout/Sidenav/Sidenav';
import MainContent from './Components/MainContent/MainContent';

function App() {

  return (
    <AuthProvider>
      <SidenavProvider>
        <Router>
          <div>
            <Header></Header>
            <Sidenav></Sidenav>
            <div>
              <MainContent />
            </div>
          </div>
        </Router>
      </SidenavProvider>
    </AuthProvider>
  );
}

export default App
