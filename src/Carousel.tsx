import React, { useEffect, useState } from 'react';
import './Carousel.css'; // You can style using CSS for simplicity

const Carousel = () => {
  const items = [
    { color: 'red', rating: 1 },
    { color: 'yellow', rating: 2 },
    { color: 'green', rating: 3 },
    { color: 'blue', rating: 4 },
    { color: 'grey', rating: 5 },
    { color: 'black', rating: 6 },
    { color: 'purple', rating: 7 }
  ];

  const [visibleItems, setVisibleItems] = useState([...items.slice(0, 5)]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(items[0]);
  const [isRunning, setIsRunning] = useState(true);
  const [isFast, setIsFast] = useState(true); // Fast phase state
  const [slowPhaseCount, setSlowPhaseCount] = useState(0); // Counter for slow phase

  useEffect(() => {
    if (!isRunning) return;

    let intervalTime = isFast ? 200 : 1000; // Fast phase: 200ms, slow phase: 1000ms
    const interval = setInterval(() => {
      moveCarousel();
    }, intervalTime);

    // Slow down after 2 seconds
    const slowDownTimer = setTimeout(() => {
      setIsFast(false);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex, isFast, isRunning]);

  const moveCarousel = () => {
    const nextIndex = (currentIndex + 1) % items.length;
    setCurrentIndex(nextIndex);
    setSelectedItem(items[nextIndex]);

    const newVisibleItems = items
      .slice(nextIndex, nextIndex + 5)
      .concat(items.slice(0, Math.max(0, nextIndex + 5 - items.length)));

    setVisibleItems(newVisibleItems);

    // Handle stopping logic during the slow phase
    if (!isFast) {
      // We're in the slow phase now, increment the counter
      setSlowPhaseCount(prev => prev + 1);

      // Randomly stop the carousel with a higher chance on the lowest-rated item
      const stopProbability = selectedItem.rating === 1 ? 0.4 : 0.1;
      if (Math.random() < stopProbability || slowPhaseCount >= items.length) {
        setIsRunning(false); // Stop the carousel when random condition is met or after one full cycle
      }
    }
  };

  return (
    <div className="carousel-container">
      <div className="carousel-slider">
        {visibleItems.map((item, index) => (
          <div className="carousel-item" key={index} style={{ backgroundColor: item.color }}>
            <p>{item.color}</p>
            <p>Rating: {item.rating}</p>
          </div>
        ))}
      </div>
      <div className="selected-item">
        <h3>Selected Item</h3>
        <p>Color: {selectedItem.color}</p>
        <p>Rating: {selectedItem.rating}</p>
      </div>
    </div>
  );
};

export default Carousel;
