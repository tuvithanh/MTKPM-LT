import React, { useState } from "react";
import { DiscountCalculator as DiscountService } from "./discountCalculator";

const DiscountCalculator = () => {
    const [calculator] = useState(new DiscountService());

    const [formData, setFormData] = useState({
        productName: "",
        basePrice: 0,
        percentageCode: "",
        percentageDiscount: 0,
        fixedCode: "",
        fixedDiscount: 0,
        quantity: 0,
        bulkMinQuantity: 0,
        bulkDiscountPercent: 0,
    });

    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === "number" ? Number(value) : value,
        });
    };

    const calculatePrice = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            const res = await calculator.calculatePrice(formData);
            setResult(res);
        } catch (err) {
            setError(err.message);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };

    return (
        <div className="discount-calculator">
            <h2>Tính Giá Với Mã Giảm Giá</h2>

            <form onSubmit={calculatePrice}>
                {/* Thông tin sản phẩm */}
                <div className="form-group">
                    <label>Tên sản phẩm:</label>
                    <input
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        type="text"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Giá gốc:</label>
                    <input
                        name="basePrice"
                        value={formData.basePrice}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                        required
                    />
                </div>

                {/* % discount */}
                <div className="discount-section">
                    <h3>Giảm Giá Theo %</h3>
                    <input
                        name="percentageCode"
                        value={formData.percentageCode}
                        onChange={handleChange}
                        placeholder="VD: SUMMER50"
                    />
                    <input
                        name="percentageDiscount"
                        value={formData.percentageDiscount}
                        onChange={handleChange}
                        type="number"
                    />
                </div>

                {/* Fixed */}
                <div className="discount-section">
                    <h3>Giảm Giá Cố Định</h3>
                    <input
                        name="fixedCode"
                        value={formData.fixedCode}
                        onChange={handleChange}
                        placeholder="VD: SAVE10K"
                    />
                    <input
                        name="fixedDiscount"
                        value={formData.fixedDiscount}
                        onChange={handleChange}
                        type="number"
                    />
                </div>

                {/* Bulk */}
                <div className="discount-section">
                    <h3>Giảm Giá Khi Mua Lẻ</h3>
                    <input
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        type="number"
                    />
                    <input
                        name="bulkMinQuantity"
                        value={formData.bulkMinQuantity}
                        onChange={handleChange}
                        type="number"
                    />
                    <input
                        name="bulkDiscountPercent"
                        value={formData.bulkDiscountPercent}
                        onChange={handleChange}
                        type="number"
                    />
                </div>

                <button type="submit">Tính Giá</button>
            </form>

            {/* ERROR */}
            {error && <div className="error">{error}</div>}

            {/* RESULT */}
            {result && (
                <div className="result">
                    <h3>Kết Quả</h3>
                    <p>
                        <strong>Giá gốc:</strong>{" "}
                        {formatCurrency(result.data.originalPrice)}
                    </p>
                    <p>
                        <strong>Giá cuối:</strong>{" "}
                        {formatCurrency(result.data.finalPrice)}
                    </p>
                    <p>
                        <strong>Tiết kiệm:</strong>{" "}
                        {formatCurrency(result.data.totalSavings)}
                    </p>

                    {result.data.appliedDiscounts?.length > 0 && (
                        <div className="discounts">
                            <h4>Mã giảm giá:</h4>
                            <ul>
                                {result.data.appliedDiscounts.map((d, i) => (
                                    <li key={i}>{d}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="description">
                        <pre>{result.description}</pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscountCalculator;