import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosSetUp';
import { useNavigate } from 'react-router-dom';

const HomepageSections = () => {
  const [sections, setSections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get('/homePageSection/getAllHomePageSections')
      .then((res) => setSections(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      {sections.map((section) => (
        <div key={section._id} className="mb-5">
          <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
          <p className="text-muted mb-3">{section.description}</p>

          {/* Scrollable Row */}
          <div className="overflow-x-auto pb-3">
            <div className="d-flex flex-row gap-3 flex-nowrap">
              {section.images.map((img, idx) => (
                <div
                  key={idx}
                  className="card border-0"
                  style={{ minWidth: '200px', cursor: 'pointer' }}
                  onClick={() => {
                    if (img.linkedProduct?.productCode) {
                      navigate(`/product/${img.linkedProduct.productCode}`);
                    }
                  }}
                >
                  <div className="position-relative overflow-hidden rounded shadow-sm">
                    <img
                      src={img.url}
                      alt={`Section ${idx}`}
                      className="img-fluid rounded hover-shadow"
                      style={{
                        height: '160px',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </div>

                  {/* Description */}
                  <div className="mt-2 text-center">
                    <p className="text-muted small mb-0">{img.description}</p>
                    {/* {img.linkedProduct?.productName && (
                      <p className="text-secondary small">
                        Linked: {img.linkedProduct.productName}
                      </p>
                    )} */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="my-4" />
        </div>
      ))}
    </div>
  );
};

export default HomepageSections;
