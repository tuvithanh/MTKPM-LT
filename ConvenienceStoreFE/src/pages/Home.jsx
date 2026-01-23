// src/pages/Home.jsx
import React from "react";
import BannerSlider from "../components/BannerSlider";

const Home = () => {
  return (
    <div>
      <BannerSlider />

      {/* Các phần nội dung khác của trang chủ sẽ nằm ở đây */}
      <section className="container mx-auto mt-8 p-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Sản Phẩm Nổi Bật
        </h2>
        <p>Đây là phần hiển thị các sản phẩm hot nhất của GS25.</p>
        {/* Ví dụ: Component ProductGrid hoặc ProductCard Factory */}
      </section>

      <section className="container mx-auto mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Tin Tức Mới Nhất
        </h2>
        <p>Cập nhật những tin tức và sự kiện từ GS25.</p>
        {/* Ví dụ: Component NewsFeed */}
      </section>
    </div>
  );
};

export default Home;
