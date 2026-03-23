import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BASE_URL = "https://localhost:7197";
const API_PRODUCT = `${BASE_URL}/api/products`;

const ProductSlider = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(API_PRODUCT);
            const data = await res.json();
            setProducts(Array.isArray(data) ? data.filter((p) => p.isActive) : []);
        } catch (err) {
            console.error("Error fetching products for slider:", err);
        }
    };

    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/150?text=No+Image";
        if (url.startsWith("http")) return url;
        return `${BASE_URL}${url.startsWith("/") ? url : "/" + url}`;
    };

    const addToCart = (product) => {
        const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
        let newCart = [...currentCart];

        const index = newCart.findIndex((item) => item.id === product.id);

        if (index >= 0) {
            newCart[index].quantity += 1;
        } else {
            newCart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(newCart));
        window.dispatchEvent(new Event("storage"));
        console.log("Đã thêm vào giỏ:", product.name);
    };

    return (
        <div className="product-slider py-4">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={2}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                breakpoints={{
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                }}
                className="pb-10"
            >
                {products.length > 0 ? (
                    products.slice(0, 10).map((p) => (
                        <SwiperSlide key={p.id}>
                            <div className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all flex flex-col group h-full">
                                <div className="h-40 relative overflow-hidden bg-gray-50 rounded-t-xl">
                                    <img
                                        src={getImageUrl(p.imageUrl)}
                                        alt={p.name}
                                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => (e.target.src = "https://via.placeholder.com/150?text=No+Image")}
                                    />
                                    {p.stockQuantity <= 0 && (
                                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-[10px] font-bold text-red-500 uppercase">
                                            Hết hàng
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-xs font-bold text-gray-800 line-clamp-2 h-8 mb-2 leading-tight">
                                        {p.name}
                                    </h3>
                                    <div className="mt-auto">
                                        <p className="text-sm font-black text-sky-600">
                                            {p.price?.toLocaleString()}đ
                                        </p>
                                        <button
                                            onClick={() => addToCart(p)}
                                            disabled={p.stockQuantity <= 0}
                                            className="w-full mt-3 bg-sky-500 text-white text-[10px] font-black py-2 rounded-lg 
                                                       hover:bg-sky-600 active:scale-95 transition-all duration-150
                                                       disabled:bg-gray-300 disabled:active:scale-100"
                                        >
                                            + THÊM VÀO GIỎ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-400">Đang tải sản phẩm...</div>
                )}
            </Swiper>
        </div>
    );
};

export default ProductSlider;
