'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Home() {
  const images = [
    'https://images-eu.ssl-images-amazon.com/images/G/31/img21/MA2025/GW/BAU/Unrec/PC/934044814._CB551384116_.jpg',
    'https://images-eu.ssl-images-amazon.com/images/G/31/INSLGW/pc_common_12th._CB555377188_.jpg',  
    '/carousel/carousel-1.jpg',
    '/carousel/carousel-2.jpg',
    '/carousel/carousel-3.jpg',
    '/carousel/carousel-4.jpg',
    '/carousel/carousel-5.jpg',
    '/carousel/carousel-6.jpg',
    '/carousel/carousel-7.jpg',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex flex-col items-center flex-grow w-full bg-white">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          className="w-full"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <img src={src} alt={`Slide ${index + 1}`} className="w-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
      </main>
    </div>
  );
}
