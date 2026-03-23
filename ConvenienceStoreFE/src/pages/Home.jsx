import React from "react";
import BannerSlider from "../components/BannerSlider";

const Home = () => {
  return (
    <div>
      <BannerSlider />

      <section className="container mx-auto mt-8 p-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Sản Phẩm Nổi Bật
        </h2>
        <p>Đây là phần hiển thị các sản phẩm hot nhất.</p>
      </section>

      <section className="container mx-auto mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Tin Tức Mới Nhất
        </h2>
        <p>Cập nhật những tin tức và sự kiện.</p>
      </section>
    </div>
  );
};

export default Home;