import React, { useState, useEffect } from "react";

const BASE_URL = "https://localhost:7197";

export default function CartPage({ onNavigate }) {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [isProcessing, setIsProcessing] = useState(false);

    // Discount code states
    const [discountCode, setDiscountCode] = useState("");
    const [discountPercent, setDiscountPercent] = useState(0);
    const [discountMessage, setDiscountMessage] = useState(""
    );
    const [discountApplied, setDiscountApplied] = useState(false);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(savedCart);
        calculateTotal(savedCart);
    }, []);

    const calculateTotal = (items) => {
        const total = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        );
        setTotalPrice(total);
    };

    const updateQuantity = (id, change) => {
        const updatedCart = cartItems.map((item) => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + change);
                return { ...item, quantity: newQty };
            }
            return item;
        });
        saveCart(updatedCart);
    };

    const removeItem = (id) => {
        const updatedCart = cartItems.filter((item) => item.id !== id);
        saveCart(updatedCart);
    };

    const saveCart = (newCart) => {
        setCartItems(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        calculateTotal(newCart);
        window.dispatchEvent(new Event("storage"));
    };

    // Apply discount code
    const applyDiscount = async () => {
        if (!discountCode.trim()) {
            setDiscountMessage("❌ Vui lòng nhập mã giảm giá");
            return;
        }

        try {
            const response = await fetch(
                `${BASE_URL}/api/discount/validate/${discountCode}`,
                { method: "GET" }
            );
            const data = await response.json();

            if (response.ok && data.discountPercent > 0) {
                setDiscountPercent(data.discountPercent);
                setDiscountApplied(true);
                setDiscountMessage(`✅ Áp dụng giảm ${data.discountPercent}%`);
            } else {
                setDiscountPercent(0);
                setDiscountApplied(false);
                setDiscountMessage("❌ Mã giảm giá không hợp lệ");
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
            setDiscountMessage("❌ Lỗi kết nối server");
            setDiscountPercent(0);
            setDiscountApplied(false);
        }
    };

    // Calculate final price after discount
    const getFinalPrice = () => {
        if (discountApplied && discountPercent > 0) {
            return totalPrice - (totalPrice * discountPercent) / 100;
        }
        return totalPrice;
    };

    const getDiscountAmount = () => {
        if (discountApplied && discountPercent > 0) {
            return (totalPrice * discountPercent) / 100;
        }
        return 0;
    };

    const handleCheckout = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("Vui lòng đăng nhập để thanh toán!");
            onNavigate("login");
            return;
        }

        setIsProcessing(true);

        const checkoutData = {
            userId: user.id,
            paymentMethod: paymentMethod,
            discountCode: discountCode || "",
            discountPercent: discountPercent || 0,
            items: cartItems.map((item) => ({
                id: item.id,
                price: item.price,
                quantity: item.quantity,
            })),
        };

        try {
            const response = await fetch(`${BASE_URL}/api/order/checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(checkoutData),
            });

            const result = await response.json();

            if (response.ok) {
                if (paymentMethod === "VNPAY") {
                    window.location.href = result.paymentUrl;
                } else {
                    alert("🎉 Đặt hàng thành công! Đơn hàng sẽ được giao đến bạn sớm.");
                    localStorage.removeItem("cart");
                    setCartItems([]);
                    window.dispatchEvent(new Event("storage"));
                    onNavigate("home");
                }
            } else {
                alert("Lỗi: " + (result.message || "Không thể thực hiện thanh toán"));
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
            alert("Lỗi kết nối đến máy chủ.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen py-10">
            <div className="max-w-[1000px] mx-auto px-4">
                <h1 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                    <span className="bg-sky-500 text-white p-2 rounded-lg text-xl">
                        🛒
                    </span>
                    GIỎ HÀNG CỦA BẠN
                </h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-dashed border-gray-300">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-gray-500 mb-6">
                            Giỏ hàng của bạn đang trống rỗng
                        </p>
                        <button
                            onClick={() => onNavigate("products")}
                            className="bg-sky-500 text-white px-8 py-3 rounded-full font-bold hover:bg-sky-600 transition-all"
                        >
                            TIẾP TỤC MUA SẮM
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
                                >
                                    <img
                                        src={`${BASE_URL}${item.imageUrl}`}
                                        alt={item.name}
                                        className="w-20 h-20 object-contain bg-gray-50 rounded-lg"
                                        onError={(e) =>
                                            (e.target.src = "https://via.placeholder.com/150")
                                        }
                                    />
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-slate-700 text-sm line-clamp-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-sky-600 font-black mt-1">
                                            {item.price?.toLocaleString()}đ
                                        </p>
                                    </div>
                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="px-3 py-1 hover:bg-gray-200 font-bold"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1 text-sm font-bold min-w-[40px] text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="px-3 py-1 hover:bg-gray-200 font-bold"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-500"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-md border border-sky-100 sticky top-24">
                                <h2 className="text-lg font-bold mb-4 border-b pb-4">
                                    Tóm tắt đơn hàng
                                </h2>

                                {/* PHẦN NHẬP MÃ GIẢM GIÁ */}
                                <div className="mb-6 pb-6 border-b">
                                    <p className="text-sm font-bold text-gray-700 mb-3">
                                        💝 Mã giảm giá:
                                    </p>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={discountCode}
                                            onChange={(e) => {
                                                setDiscountCode(e.target.value.toUpperCase());
                                                setDiscountMessage("");
                                            }}
                                            placeholder="Nhập mã giảm giá"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500"
                                        />
                                        <button
                                            onClick={applyDiscount}
                                            className="bg-sky-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-600 transition-all text-sm"
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                    {discountMessage && (
                                        <p className={`text-xs font-medium ${discountApplied ? "text-green-600" : "text-red-600"}`}> {discountMessage}</p>
                                    )}
                                </div>

                                {/* PHẦN CHỌN PHƯƠNG THỨC THANH TOÁN */}
                                <div className="mb-6">
                                    <p className="text-sm font-bold text-gray-700 mb-3">
                                        Phương thức thanh toán:
                                    </p>
                                    <div className="space-y-2">
                                        <label
                                            className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === "COD" ? "border-sky-500 bg-sky-50" : "border-gray-100"}`}
                                        >
                                            <input
                                                type="radio"
                                                name="pay"
                                                value="COD"
                                                checked={paymentMethod === "COD"}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="accent-sky-500"
                                            />
                                            <span className="text-sm font-medium">
                                                💵 Tiền mặt (COD)
                                            </span>
                                        </label>
                                        <label
                                            className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === "VNPAY" ? "border-sky-500 bg-sky-50" : "border-gray-100"}`}
                                        >
                                            <input
                                                type="radio"
                                                name="pay"
                                                value="VNPAY"
                                                checked={paymentMethod === "VNPAY"}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="accent-sky-500"
                                            />
                                            <span className="text-sm font-medium">
                                                💳 Ví VNPay / Thẻ
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* PHẦN TÍNH TIỀN */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Tạm tính</span>
                                        <span>{totalPrice.toLocaleString()}đ</span>
                                    </div>
                                    {discountApplied && discountPercent > 0 && (
                                        <div className="flex justify-between text-red-600 text-sm font-bold">
                                            <span>Giảm giá ({discountPercent}%)</span>
                                            <span>-{getDiscountAmount().toLocaleString()}đ</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Phí vận chuyển</span>
                                        <span className="text-green-500 font-medium">Miễn phí</span>
                                    </div>
                                </div>

                                <div className="border-t pt-4 mb-6">
                                    <div className="flex justify-between items-end">
                                        <span className="font-bold text-gray-800">TỔNG CỘNG:</span>
                                        <span className={`text-2xl font-black ${discountApplied ? "text-red-500" : "text-orange-500"}`}> {getFinalPrice().toLocaleString()}đ</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                    className={`w-full text-white py-4 rounded-xl font-black transition-all shadow-lg uppercase tracking-wider ${isProcessing ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600 shadow-orange-100"}`}
                                >
                                    {isProcessing ? "ĐANG XỬ LÝ..." : "THANH TOÁN NGAY"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}