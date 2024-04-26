import React from 'react';
import { SidenavData } from "/src/lib/SidenavData";
import { SidenavProvider, useSidenav } from '/src/contexts/SidenavContext';
import styles from './Sidenav.module.css';

const Sidenav = () => {
  const { isExpanded,
    activeMenu,
    handleMouseEnter,
    handleMouseLeave,
    toggleSubMenu } = useSidenav();

    const animateSubMenu = (itemId) => {
      return activeMenu === itemId;
    };


  return (
    <SidenavProvider>
    <aside className={`${styles.sidenav} ${isExpanded ? styles.expanded : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {SidenavData.map((item) => (
        <div key={item.id} className={`${styles.menuItem} ${activeMenu === item.id ? styles.menuActive : ''}`}>
          <div onClick={() => toggleSubMenu(item.id)} className={styles.menuTitle}>
            <div className={styles.menuIconContainer}>
              <span className={styles.menuIcon}>{item.icon}</span>
            </div>
            <div className={styles.menuNameContainer}>
              <span className={styles.menuName}>{item.menuName}</span>
            </div>
          </div>
          {activeMenu === item.id && (
            <nav className={`${styles.submenu} ${animateSubMenu(item.id) ? styles.submenuAnimating : ''}`}>
              {item.submenu.map((subItem, index) => (
                <a key={index} href={subItem.link} className={styles.submenuItem}>
                  {subItem.title}
                </a>
              ))}
            </nav>
          )}
        </div>
      ))}
    </aside>
    </SidenavProvider>
  );
};

export default Sidenav;