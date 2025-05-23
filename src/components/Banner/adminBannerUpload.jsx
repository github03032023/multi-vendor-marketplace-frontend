import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosSetUp';
import Resizer from 'react-image-file-resizer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './adminBannerCarousel.css';

const AdminBannerUpload = () => {
  const [banners, setBanners] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    axiosInstance
      .get('/banner/get')
      .then((res) => {
        const bannerObj = res.data;
        if (bannerObj && Array.isArray(bannerObj.images)) {
          setBanners([bannerObj]);
        } else {
          setBanners([]);
        }
      })
      .catch(() => setBanners([]));
  }, []);

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1200,
        600,
        'JPEG',
        80,
        0,
        (uri) => resolve(uri),
        'file'
      );
    });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setImages((prev) => [...prev, { file, preview, description: '' }]);
  };

  const handleDescriptionChange = (index, value) => {
    const updated = [...images];
    updated[index].description = value;
    setImages(updated);
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length < 3) return toast.error('Please add at least three images.');

    const data = new FormData();
    images.forEach((img) => data.append('images', img.file));
    data.append('descriptions', JSON.stringify(images.map((img) => img.description)));

    try {
      const res = await axiosInstance.post('/banner/upload', data);
      setBanners([res.data]);
      setImages([]);
      toast.success(res.data.message || 'Banner Uploaded Successfully');
    } catch (err) {
      console.error(err);
      toast.error('Upload failed. Please try again.');
    }
  };

  const handleDelete = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      await axiosInstance.delete(`/banner/delete/${bannerId}`);
      setBanners([]);
      toast.success('Banner deleted successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Delete failed.');
    }
  };

  return (
    <div className="container py-4">
      <ToastContainer />
      <h2 className="mb-4 text-center">Upload Homepage Banners</h2>

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3">
          <label className="form-label">Select Banner Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="form-control" />
        </div>

        {images.map((img, index) => (
          <div key={index} className="card p-3 mb-3">
            <img
              src={img.preview}
              alt="preview"
              className="img-fluid rounded mb-2"
              style={{ maxHeight: '200px' }}
            />
            <label>Description</label>
            <input
              type="text"
              className="form-control mb-2"
              value={img.description}
              onChange={(e) => handleDescriptionChange(index, e.target.value)}
            />
            <button type="button" className="btn btn-sm btn-danger" onClick={() => removeImage(index)}>
              Remove
            </button>
          </div>
        ))}

        <div className="mb-3">
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <button type="submit" className="btn btn-success px-4">
          Upload Banner
        </button>
      </form>
      {/* className="btn btn-primary w-100" */}
  
      <h3 className="mb-3 text-center">Current Banners</h3>
      {banners.length > 0 && banners[0].images.length > 0 ? (
        <div className="border rounded p-3 shadow-sm">
          <div id="bannerCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {banners[0].images.map((img, idx) => (
                <div className={`carousel-item ${idx === 0 ? 'active' : ''}`} key={img._id || idx}>
                  <img
                    src={img.url}
                    className="d-block w-100 rounded"
                    alt={`banner ${idx}`}
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                  />
                  {img.description && (
                    <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-2 rounded">
                      <p>{img.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true" />
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true" />
            </button>
          </div>
          <button className="btn btn-danger mt-3 px-4" onClick={() => handleDelete(banners[0]._id)}>
            Delete All Banners
          </button>
        </div>
      ) : (
        <p className="text-muted text-center">No banners found.</p>
      )}
    </div>
  );
};

export default AdminBannerUpload;

