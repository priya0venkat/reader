import React from 'react';

const categories = [
    { name: 'Fruits & Veggies', color: '#4CAF50', icon: '🍎' },
    { name: 'Proteins', color: '#F44336', icon: '🍗' },
    { name: 'Carbohydrates', color: '#FF9800', icon: '🍞' },
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
