// src/components/BannerSlider.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules"; // Import các module cần thiết
import "swiper/css"; // Core Swiper
import "swiper/css/navigation"; // Navigation styles
import "swiper/css/pagination"; // Pagination styles

import { BANNERS } from "../constants/bannerData"; // Import dữ liệu banner

const BannerSlider = () => {
  return (
    <div className="w-full relative group">
      {" "}
      {/* group để hiển thị nút khi hover */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0} // Không có khoảng cách giữa các slide
        slidesPerView={1} // Hiển thị 1 slide mỗi lần
        navigation={{
          nextEl: ".swiper-button-next-custom", // Custom next button class
          prevEl: ".swiper-button-prev-custom", // Custom prev button class
        }}
        pagination={{ clickable: true }} // Cho phép click vào dấu chấm để chuyển slide
        autoplay={{
          delay: 4000, // Tự động chuyển slide sau 4 giây
          disableOnInteraction: false, // Không dừng khi người dùng tương tác
        }}
        loop={true} // Lặp lại vô hạn
        className="w-full h-auto" // Đảm bảo Swiper chiếm toàn bộ chiều rộng
      >
        {BANNERS.map((banner) => (
          <SwiperSlide key={banner.id}>
            <a href={banner.link} className="block w-full">
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full h-auto object-cover max-h-[450px] md:max-h-[600px]" // Ảnh full width, chiều cao linh hoạt
              />
              {/* Overlay có thể thêm text nếu muốn */}
              {/* <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
                <h2 className="text-white text-3xl font-bold text-center">{banner.title}</h2>
              </div> */}
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Custom Navigation Buttons */}
      <div
        className="swiper-button-prev-custom absolute top-1/2 left-4 md:left-8 -translate-y-1/2 z-10 
                      bg-white/70 hover:bg-white transition-all duration-300 
                      rounded-full w-10 h-10 flex items-center justify-center cursor-pointer 
                      shadow-md opacity-0 group-hover:opacity-100 invisible group-hover:visible"
      >
        <svg
          className="w-6 h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
      </div>
      <div
        className="swiper-button-next-custom absolute top-1/2 right-4 md:right-8 -translate-y-1/2 z-10 
                      bg-white/70 hover:bg-white transition-all duration-300 
                      rounded-full w-10 h-10 flex items-center justify-center cursor-pointer 
                      shadow-md opacity-0 group-hover:opacity-100 invisible group-hover:visible"
      >
        <svg
          className="w-6 h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default BannerSlider;
