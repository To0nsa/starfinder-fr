import React from 'react';
import { useSidenav } from '/src/contexts/SidenavContext';
import Footer from '/src/Components/Layout/Footer/Footer';
import RoutesComponent from '/src/routes/RoutesComponent';
import styles from './MainContent.module.css'

function MainContent() {
  const { isExpanded, isHovered } = useSidenav();

  return (
    <>
      {(isExpanded || isHovered) && <div className={styles.overlay}></div>}
      <div className={`${styles.mainContent} ${isExpanded || isHovered ? styles.expanded : ''}`}>
        <RoutesComponent />
        <Footer />
      </div>
    </>
  );
}

export default MainContent;