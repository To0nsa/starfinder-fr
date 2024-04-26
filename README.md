# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesComponent from './RoutesComponent';

import Header from './Header';
import Sidenav from './Sidenav';
import Footer from './Footer'; 

const App = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <Router>
      <Header isNavOpen={isNavOpen} toggleNav={() => setIsNavOpen(!isNavOpen)} />
      <Sidenav isOpen={isNavOpen} />
      <main>
        <RoutesComponent />
      </main>
      <Footer />
    </Router>
  );
}

export default App;

return (
    <aside className={`${styles.sidenav} ${isNavOpen ? styles.open : ''}`}>
      <nav>
        <ul>
          <li><Link to="/homepage">Homepage</Link></li>
          {/* Add more navigation links as needed */}
        </ul>
      </nav>
    </aside>
  );
};

