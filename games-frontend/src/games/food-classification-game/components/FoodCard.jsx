import React from 'react';

function FoodCard({ food }) {
    return (
        <div className="food-card">
            <div className="image-container">
                <div className="food-image">
                    {food.emoji}
                </div>
            </div>
            <h2 className="food-name">{food.name} has?</h2>
        </div>
    );
}

export default FoodCard;
