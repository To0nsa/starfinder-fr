import React, { useEffect, useRef } from 'react';
import { register } from 'swiper/element/bundle';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export function Swiper(props) {
  const swiperRef = useRef(null);
  const { children, ...rest } = props;

  useEffect(() => {
    // Register Swiper web component
    register();

    // Object with parameters
    const params = { ...rest };

    // Assign it to swiper element
    Object.assign(swiperRef.current, params);

    // Initialize swiper
    swiperRef.current.initialize();
  }, [rest]);

  return (
    <swiper-container init="false" ref={swiperRef}>
      {children}
    </swiper-container>
  );
}

export function SwiperSlide(props) {
  const { children, ...rest } = props;

  return (
    <swiper-slide {...rest}>
      {children}
    </swiper-slide>
  );
}