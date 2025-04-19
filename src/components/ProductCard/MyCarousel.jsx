import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MyCarousel = ({ images }) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true); // Start autoplay
  };

  const handleMouseLeave = () => {
    setIsHovering(false); // Stop autoplay
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Carousel
        interval={isHovering ? 2000 : null} // Only autoplay on hover
        controls={images.length > 1}
        indicators={images.length > 1}
        pause={false} // Don't pause on hover (we're controlling manually)
      >
        {images.map((img, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={img.url}
              alt={img.altText || `Slide ${index}`}
              style={{ height: '300px', objectFit: 'cover' }}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default MyCarousel;
