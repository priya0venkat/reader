import React from 'react';

const categories = [
    { name: 'Carbohydrates', color: '#FF9800', icon: '🍞' },
    { name: 'Proteins', color: '#F44336', icon: '🍗' },
    { name: 'Fats', color: '#FFC107', icon: '🧈' },
    { name: 'Sugars', color: '#E91E63', icon: '🍬' },
    { name: 'Vitamins', color: '#4CAF50', icon: '🥗' },
    { name: 'Fiber', color: '#8BC34A', icon: '🥦' },
    { name: 'Dairy', color: '#2196F3', icon: '🥛' }
];

function CategoryButtons({ onCategoryClick }) {
    return (
        <div className="category-buttons-container">
            {categories.map((cat) => (
                <button
                    key={cat.name}
                    className="category-btn"
                    style={{ backgroundColor: cat.color }}
                    onClick={() => onCategoryClick(cat.name)}
                >
                    <span className="btn-icon">{cat.icon}</span>
                    <span className="btn-label">{cat.name}</span>
                </button>
            ))}
        </div>
    );
}

export default CategoryButtons;
