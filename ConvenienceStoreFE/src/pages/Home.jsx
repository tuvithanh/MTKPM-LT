import React from "react";
import BannerSlider from "../components/BannerSlider";
import ProductSlider from "../components/ProductSlider";

// Import images from assets
import khuyenmaiImg from "../assets/khuyenmai.jpg";
import orionNewsImg from "../assets/orion-post-new-43.png";

const Home = () => {
    const newsItems = [
        {
            id: 1,
            title: "Siêu Khuyến Mãi Cuối Tuần - Giảm Đến 50%",
            description: "Cơ hội ngàn vàng để sắm đồ với giá cực sốc tại GS25. Đừng bỏ lỡ!",
            image: khuyenmaiImg,
            date: "23/03/2026"
        },
        {
            id: 2,
            title: "Sản Phẩm Mới: Bánh Orion Phiên Bản Đặc Biệt",
            description: "Thưởng thức hương vị mới từ Orion chỉ có tại chuỗi cửa hàng tiện lợi GS25.",
            image: orionNewsImg,
            date: "22/03/2026"
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <BannerSlider />

            {/* SẢN PHẨM NỔI BẬT */}
            <section className="max-w-[1200px] mx-auto mt-12 px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                        <span className="w-2 h-8 bg-sky-500 rounded-full"></span>
                        SẢN PHẨM NỔI BẬT
                    </h2>
                    <button className="text-sky-600 font-bold text-sm hover:underline">Xem tất cả</button>
                </div>
                <ProductSlider />
            </section>

            {/* TIN TỨC MỚI NHẤT */}
            <section className="max-w-[1200px] mx-auto my-16 px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                        <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                        TIN TỨC MỚI NHẤT
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {newsItems.map(item => (
                        <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                            <div className="h-64 overflow-hidden">
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                            </div>
                            <div className="p-6">
                                <div className="text-xs font-bold text-orange-500 mb-2 uppercase tracking-widest">{item.date}</div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-sky-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;