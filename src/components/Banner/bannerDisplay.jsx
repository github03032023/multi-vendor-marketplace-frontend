import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosSetUp';
import { Carousel, Container, Row, Col } from 'react-bootstrap';

const BannerDisplay = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    axiosInstance.get('/banner/get').then(res => {
      if (res.data?.images) {
        setBanners(res.data.images);
      }
    });
  }, []);

  return (
    <Container fluid className="p-0">
      {banners.length > 0 ? (
        <Row>
          <Col>
            <Carousel fade interval={4000} className="shadow-lg">
              {banners.map((img, idx) => {
                // const transformedUrl = img.url.replace('/upload/', '/upload/w_1200,h_400,c_fill/');
                const transformedUrl = img.url;
                return (
                  <Carousel.Item key={idx}>
                    <img
                      src={transformedUrl}
                      alt={img.description || `Banner ${idx + 1}`}
                      className="d-block w-100"
                      style={{ height: '600px', objectFit: 'cover' }}
                    />
                    {img.description && (
                      <Carousel.Caption className="bg-dark bg-opacity-50 p-2 rounded">
                        <p className="text-white mb-0">{img.description}</p>
                      </Carousel.Caption>
                    )}
                  </Carousel.Item>
                );
              })}
            </Carousel>
          </Col>
        </Row>
      ) : (
        <div className="text-center py-5">No banners available.</div>
      )}
    </Container>
  );
};

export default BannerDisplay;

