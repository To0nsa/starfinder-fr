import React, { useState } from 'react';
import styles from './Homepage.module.css';

const Homepage = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnimate = () => {
    setIsAnimating(!isAnimating);
  };

  return (
    <main className={styles.container}>
      <span className={styles.blackHole}></span>
      <article className={`${styles.article} ${isAnimating ? styles.animate : ''}`}>
        <section className={styles.arrowBox}>
            <p className={styles.presentationText}> Yooo, qu'est-ce que tu fais là ? Tu veux en savoir plus sur la nouvelle édition de Starfinder ?
            T'es au bon endroit, ouais au milieu de l'espace ! C'est simple sur
            <img className={styles.logoInText} src="/Assets/starfinder-fr-logo1.webp" alt="starfinder-fr logo" />
            tu trouveras une traduction du contenu lié au playtest
            de Starfinder seconde édition, articles de blog, tests de terrain...</p>
            <p className={`${styles.cryForHelp} ${isAnimating ? styles.animate : ''}`}>NOOOOOOOOO</p>
        </section>
        <section className={styles.spaceAdventurerContainer}>
          <img className={styles.spaceAdventurer} src="/Assets/space-adventurer.webp" alt="space adventurer lost in the space" />
        </section>
      </article>
      <button onClick={handleAnimate} className={styles.animateButton}>Ne pas toucher à ce bouton</button>
    </main>
  );
}

export default Homepage;