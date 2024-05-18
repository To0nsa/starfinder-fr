import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { Swiper, SwiperSlide } from './CustomSwiper';  // Import your custom Swiper wrapper
import { db } from '/src/environments/firebase-config';
import Card from './Card';
import styles from '/src/Components/Swiper/Swiper.module.css';

const CardSwiper = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsCollectionRef = collection(db, 'translatedPosts');
    const q = query(postsCollectionRef, orderBy('translatedPostDate', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsArray = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      });
      setPosts(postsArray);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Swiper
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={5}
      spaceBetween={150}
      navigation={true}
      className={styles.mySwiper}
    >
      {posts.map((post) => (
        <SwiperSlide key={post.id}>
          <Card post={post} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CardSwiper;