import React, { useState, useRef, useEffect } from "react";

const StarRating = ({ rating, onRatingChange, interactive = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            key={index}
            type={interactive ? "button" : undefined}
            className={`text-xl transition-colors duration-200 ${
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            } ${
              ratingValue <= (hover || rating)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            onClick={interactive ? () => onRatingChange(ratingValue) : undefined}
            onMouseEnter={interactive ? () => setHover(ratingValue) : undefined}
            onMouseLeave={interactive ? () => setHover(0) : undefined}
            disabled={!interactive}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;