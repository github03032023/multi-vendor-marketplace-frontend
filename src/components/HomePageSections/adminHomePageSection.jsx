import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosSetUp';
import Resizer from 'react-image-file-resizer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminHomepageSection = () => {
  const [sections, setSections] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [],
  });

  useEffect(() => {
    axiosInstance.get('/homePageSection/getAllHomePageSections')
      .then(res => setSections(res.data))
      .catch(err => toast.error('Error loading sections'));

    axiosInstance.get('/product/fetchAllProducts')
      .then(res => setProducts(res.data.products))
      .catch(err => toast.error('Error loading products'));
  }, []);

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        400, 400,
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

    try {
      const resizedFile = await resizeFile(file);
      const preview = URL.createObjectURL(resizedFile);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, { file: resizedFile, preview, description: '', linkedProduct: '' }]
      }));
    } catch (err) {
      toast.error('Image resize failed');
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index][field] = value;
    setFormData({ ...formData, images: updatedImages });
  };

  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      toast.warning('Please add at least one image.');
      return;
    }

    if (formData.images.some(img => !img.description.trim())) {
      toast.warning('All images must have a description.');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    formData.images.forEach(img => data.append('images', img.file));
    data.append('linkedProducts', JSON.stringify(formData.images.map(img => img.linkedProduct || '')));
    data.append('imageDescriptions', JSON.stringify(formData.images.map(img => img.description)));

    try {
      const res = await axiosInstance.post('/homePageSection/createHomePageSection', data);
      setSections([...sections, res.data]);
      setFormData({ title: '', description: '', images: [] });
      toast.success('Section created successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Error creating section');
    }
  };

  const handleDeleteSection = (sectionId) => {
    if (!window.confirm('Delete this section?')) return;

    axiosInstance.delete(`/homePageSection/deleteHomePageSection/${sectionId}`)
      .then(() => {
        setSections(sections.filter(s => s._id !== sectionId));
        toast.success('Section deleted!');
      })
      .catch(err => {
        console.error(err);
        toast.error('Error deleting section');
      });
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="mb-4">Create Homepage Section</h2>

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3">
          <label className="form-label fw-bold">Title</label>
          <input type="text" className="form-control" value={formData.title} required
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">Description</label>
          <textarea className="form-control" value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        </div>

        <h5 className="mb-3">Images</h5>
        {formData.images.map((img, index) => (
          <div key={index} className="card p-3 mb-3 shadow-sm">
            <div className="row">
              <div className="col-md-2 mb-2 text-center">
                <img src={img.preview} alt="preview" className="img-fluid rounded" />
              </div>
              <div className="col-md-10">
                <div className="mb-2">
                  <label className="form-label">Description *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={img.description}
                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Linked Product (optional)</label>
                  <select
                    className="form-control"
                    value={img.linkedProduct}
                    onChange={(e) => handleInputChange(index, 'linkedProduct', e.target.value)}
                  >
                    <option value="">-- None --</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.productName} ({p.productCode})
                      </option>
                    ))}
                  </select>
                </div>
                <button type="button" className="btn btn-sm btn-outline-danger mt-2" onClick={() => removeImage(index)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="mb-3">
          <input type="file" accept="image/*" onChange={handleImageChange} className="form-control" />
        </div>

        <button type="submit" className="btn btn-success px-4">Create Section</button>
      </form>

      <h2 className="mb-4">Existing Sections</h2>
      <div className="row">
        {sections.map(section => (
          <div className="col-md-12 mb-4" key={section._id}>
            <div className="border p-3 rounded shadow-sm bg-light">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-0">{section.title}</h4>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteSection(section._id)}>
                  Delete Section
                </button>
              </div>
              <p className="text-muted">{section.description}</p>
              <div className="d-flex flex-row gap-3 overflow-auto">
                {section.images.map((img, idx) => (
                  <div key={idx} className="text-center">
                    <img src={img.url} alt="section" style={{ width: '120px', height: 'auto' }} className="rounded mb-1" />
                    <div className="small text-muted">{img.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHomepageSection;
