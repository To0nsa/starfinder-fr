import React from 'react';

import { FaDiscord } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <main className={styles.footerContainer}>
        <article className={styles.footerArticle}>

          <div className={styles.topFlexContainer}>
            <section className={styles.topLeftFlexbox}>
              <img className={styles.footerLogo} src='/Assets/starfinder-fr-logo2.webp' alt="logo pathfinder-fr" />
            </section>
            <section className={styles.topCenterFlexbox}>
              <span> Site principal<br /><a href="https://www.pathfinder-fr.org/" target="_blank">Pathfinder-FR</a></span>
            </section>
            <section className={styles.topRightFlexbox}>
              <a href="https://discord.com/servers/pathfinder-fr-106857891419443200" target="_blank">
                <button className={styles.footerButton}><FaDiscord className={styles.footerIcon} /></button>
              </a>
              <a href="https://www.facebook.com/pathfinderfr/" target="_blank">
                <button className={styles.footerButton}><FaFacebook className={styles.footerIcon} /></button>
              </a>
              <a href="https://twitter.com/PathfinderFR" target="_blank">
                <button className={styles.footerButton}><FaXTwitter className={styles.footerIcon} /></button>
              </a>
            </section>
          </div>

          <section className={styles.bottomFlexbox}>
            <span>
              <hr className={styles.footerHr} />La gamme Starfinder est une création de <a href="https://paizo.com/" target="_blank">Paizo Publishing</a>
              traduite en français par <a href="https://black-book-editions.fr/" target="_blank">Black Book Editions</a>.
              Ce site se base sur les licences <a href="https://www.pathfinder-fr.org/Wiki/OGL.ashx" target="_blank">Open Game License</a>,
              <a href="https://www.pathfinder-fr.org/Wiki/PCUP.ashx" target="_blank">Pathfinder Community Use Policy et les conditions d'utilisation BBE.</a>
            </span>
          </section>
        </article>
      </main>
    </footer>
  );
}

export default Footer;