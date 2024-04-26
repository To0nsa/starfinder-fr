import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { useSidenav } from '/src/contexts/SidenavContext';
import { useAuth } from '/src/contexts/AuthContext';

import { RiLoginCircleLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { ImSearch } from "react-icons/im";

import styles from './Header.module.css';

const Header = () => {
  const { isExpanded, toggleSidenav } = useSidenav();
  const { isLoggedIn, userData, logout } = useAuth();
  const [isAuthMenuVisible, setIsAuthMenuVisible] = useState(false);
  const authMenuRef = useRef(null);

  const toggleAuthMenuVisibility = () => {
    setIsAuthMenuVisible(!isAuthMenuVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (authMenuRef.current && !authMenuRef.current.contains(event.target)) {
        setIsAuthMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); 


  const barClassName = (barNumber) => {
    switch (barNumber) {
      case 1: return `${styles.bar1} ${isExpanded ? styles.change : ''}`;
      case 2: return `${styles.bar2} ${isExpanded ? styles.change : ''}`;
      case 3: return `${styles.bar3} ${isExpanded ? styles.change : ''}`;
      default: return '';
    }
  };

  return (
    <header className={styles.header}>
      <article className={styles.leftArticle}>
        <button className={styles.buttonMenu} aria-label='Toggle menu' onClick={toggleSidenav}>
          <section>
            <div className={styles.container}>
              <div className={barClassName(1)}></div>
              <div className={barClassName(2)}></div>
              <div className={barClassName(3)}></div>
            </div>
          </section>
        </button>
        <section>
          <Link to="/" aria-label="Logo of starfinder-fr and link to homepage">
            <img className={styles.logoStarfinderFr} src='/Assets/starfinder-fr-logo1.webp' alt="Starfinder-fr logo" />
          </Link>
        </section>
        <section>
          <h1 className={styles.titleHeader}>SF2e PLAYTEST - Traduction FR</h1>
        </section>
      </article>

      {/* <article className={styles.middleArticle}>
        <input className={styles.searchbar} type="text" placeholder="Search..." aria-label='Search bar' />
        <button className={styles.buttonSearch} aria-label='Search button'>
          <ImSearch className={styles.searchIcon} size="16px" />
        </button>
      </article> */}

      <article className={styles.rightArticle}>
        {!isLoggedIn ? (
          <section>
            <button className={styles.iconButton} aria-label='Login'
              onClick={toggleAuthMenuVisibility}>
              <RiLoginCircleLine className={styles.icon}/>
            </button>
            {isAuthMenuVisible && (
            <div className={styles.authMenu} ref={authMenuRef}>
              <div>
                <Link to="/login" className={styles.authMenuItem}>Se connecter</Link>
                <Link to="/signup" className={styles.authMenuItem}>S'enregistrer</Link>
              </div>
            </div>
            )}
          </section>
        ) : (
          <section>
            <button className={styles.iconButton} aria-label='Profile'
              onClick={toggleAuthMenuVisibility}>
              <CgProfile className={styles.icon}/>
            </button>
            {isAuthMenuVisible && (
            <div className={styles.authMenu} ref={authMenuRef}>
              <div>
                <Link to="/profilepage" className={styles.authMenuItem}>Profil de {userData.username || 'Utilisateur'}</Link>
                <span className={styles.authMenuItem} onClick={logout}>Se déconnecter</span>
              </div>
            </div>
            )}
          </section>
        )}
      </article>
    </header>
  );
};

export default Header;