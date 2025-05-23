import React, { useState, useEffect, useRef } from "react";
import axiosInstance from '../../api/axiosSetUp';
import axios from 'axios';
import { toast } from "sonner";
import "bootstrap/dist/css/bootstrap.min.css";
import { Info } from 'lucide-react';
import { Tooltip } from "bootstrap";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    brand: "",
    model: "",
    color: "",
    type: "",
    suitableFor: "",
    images: ""
  });

  useEffect(() => {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
    });
  }, []);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [imagePreviews]);
  const [errors, setErrors] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const inputRef = useRef(null);

  const vendorId = localStorage.getItem('vendorId');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/product/getAllActiveProducts/${vendorId}`);
      setProducts(data.products || []);
      setFilteredProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    validateField(e.target.name, e.target.value);
  };

  const removeExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    setRemovedImages((prev) => [...prev, imageToRemove.publicId]);
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {

    const updatedFiles = [...selectedFile];
    const updatedPreviews = [...imagePreviews];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setSelectedFile(updatedFiles);
    setImagePreviews(updatedPreviews);

    if (inputRef.current) {
      if (updatedFiles.length === 0) {
        inputRef.current.value = ''; // Clear input completely
      } else {
        const dataTransfer = new DataTransfer();
        updatedFiles.forEach(file => dataTransfer.items.add(file));
        inputRef.current.files = dataTransfer.files;
      }
    }
  };


  const validateField = (fieldName, value) => {
    let fieldErrors = { ...errors };
    switch (fieldName) {
      case "productName":
        fieldErrors.productName = value.trim() === "" ? "Product Name is required" : "";
        break;
      case "price":
        fieldErrors.price = value === "" || isNaN(value) || value <= 0 ? "Valid price > 0 is required" : "";
        break;
      case "quantity":
        fieldErrors.quantity = value === "" || isNaN(value) || value < 0 ? "Quantity >= 0 is required" : "";
        break;
      case "category":
        fieldErrors.category = value.trim() === "" ? "Category is required" : "";
        break;
      case "description":
        fieldErrors.description = value.trim() === "" ? "Description is required" : "";
        break;
      case "brand":
        fieldErrors.brand = value.trim() === "" ? "Brand is required" : "";
        break;
      case "model":
        fieldErrors.model = value.trim() === "" ? "Model is required" : "";
        break;
      case "color":
        fieldErrors.color = value.trim() === "" ? "Color is required" : "";
        break;
      default:
        break;
    }
    setErrors(fieldErrors);
  };

  const validateForm = () => {
    let fieldErrors = {};
    if (!formData.productName?.trim()) fieldErrors.productName = "Product Name is required";
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) fieldErrors.price = "Valid price > 0 required";
    if (formData.quantity === "" || isNaN(formData.quantity) || formData.quantity < 0) fieldErrors.quantity = "Quantity must be >= 0";
    if (!formData.category?.trim()) fieldErrors.category = "Category is required";
    if (!formData.description?.trim()) fieldErrors.description = "Description is required";
    if (!formData.brand?.trim()) fieldErrors.brand = "Brand is required";
    if (!formData.model?.trim()) fieldErrors.model = "Model is required";
    if (!formData.color?.trim()) fieldErrors.color = "Color is required";
    if (!selectedFile && !editingProduct) fieldErrors.image = "Product image is required";

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const uploadedfiles = Array.from(e.target.files);
    setSelectedFile(uploadedfiles);

    const previews = uploadedfiles.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));

    setImagePreviews(previews);
  };


  const uploadImagesToCloudinary = async (files) => {
    const uploadedImages = [];
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'products');
      console.log([...formData.entries()]);

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );
        uploadedImages.push({
          url: response.data.secure_url,
          publicId: response.data.public_id,
          // filename + ' Image'
          altText: file.name.replace(/\.[^/.]+$/, "") + " Image",
        });
      } catch (error) {
        console.error("Cloudinary upload failed for:", file.name, error);
        toast.error(`Upload failed for ${file.name}`);
        throw new Error(`Cloudinary upload failed for ${file.name}`);
      }
    }
    return uploadedImages;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUploading(true);

    let uploadedImages = [];
    console.log("removedImages-", removedImages);



    if (removedImages.length > 0) {
      await axiosInstance.delete("/product/deleteCloudinaryImage", {
        data: { publicIds: removedImages },
      });
    }

    if (selectedFile?.length > 0) {
      selectedFile.forEach((file) => {
        console.log("file value on handleSubmit-", file);
      });
    }


    if (selectedFile?.length > 0) {
      uploadedImages = await uploadImagesToCloudinary(selectedFile);
    }

    if (uploadedImages?.length > 0) {
      uploadedImages.forEach((uploadedimage) => {
        console.log("file value after cloudinary upload-", uploadedimage);
      });
    }

    // Final image set = remaining existingImages + newly uploaded images
    const finalImages = [...existingImages, ...uploadedImages];

    if (uploadedImages?.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        images: uploadedImages,
      }));
    }


    if (editingProduct && (!finalImages || finalImages.length === 0)) {
      alert("Please upload at least one image to update the product.");
      toast.error("Please upload at least one image to update the product.");
      setUploading(false);
      return;
    }

    const submissionData = {
      productName: formData.productName,
      description: formData.description,
      price: formData.price,
      quantity: formData.quantity,
      category: formData.category,
      brand: formData.brand,
      model: formData.model,
      color: formData.color,
      type: formData.type,
      suitableFor: formData.suitableFor,
      vendorId: vendorId,
      images: finalImages,
    };

    try {
      setUploading(true);
      if (editingProduct) {
        await axiosInstance.put(
          `/product/updateProduct/${editingProduct.productCode}`,
          submissionData);
        toast.success("Product updated successfully!");
        resetForm();
      } else {
        await axiosInstance.post(
          "/product/registerProduct",
          submissionData);
        toast.success("Product added successfully!");
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Error submitting product:", error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to save product");
      }

      // Cleanup previously uploaded Cloudinary images
      const publicIds = uploadedImages.map((img) => img.publicId).filter(Boolean);

      if (publicIds?.length > 0) {
        try {
          await axiosInstance.delete("/product/deleteCloudinaryImage", {
            data: { publicIds: publicIds },
          });
        } catch (err) {
          console.error("Bulk delete failed", err);
        }
      }

    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName || "",
      description: product.description || "",
      price: product.price || "",
      quantity: product.quantity || "",
      category: product.category || "",
      brand: product.brand || "",
      model: product.model || "",
      color: product.color || "",
      type: product.type || "",
      suitableFor: product.suitableFor || "",
      images: product.images || []
    });
    setExistingImages(product.images || []);
    setRemovedImages([]);
    setImagePreviews([]);
    setSelectedFile([]);
    setErrors({});
  };

  const handleDelete = async (productCode) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axiosInstance.delete(`/product/deleteProduct/${productCode}`);
        toast.success("Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Failed to delete product");
        }
      }
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.productName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
      setCurrentPage(1);
    }
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
      brand: "",
      model: "",
      color: "",
      type: "",
      suitableFor: "",
    });
    // setSelectedFile(null);
    setSelectedFile([]);
    setEditingProduct(null);
    setErrors({});
    setExistingImages([]);
    setRemovedImages([]);
    setImagePreviews([]);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container py-4">
      <h2 className="h3 fw-bold text-center mb-4">Product Management</h2>
  
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search product..."
          className="form-control"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
  
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-primary shadow-lg p-4 rounded mb-4"
      >
        {/* Product Name */}
        <div className="form-floating mb-3 position-relative">
          <input
            type="text"
            className="form-control"
            id="productName"
            placeholder="Product Name"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
          />
          <label htmlFor="productName">Product Name</label>
          <Info
            size={16}
            className="position-absolute top-50 end-0 translate-middle-y me-3 text-primary"
            data-bs-toggle="tooltip"
            data-bs-placement="left"
            title="Enter the main product name"
            style={{ cursor: 'pointer' }}
          />
          {errors.productName && <small className="text-danger">{errors.productName}</small>}
        </div>
  
        {/* Description */}
        <div className="form-floating mb-3">
          <textarea
            className="form-control"
            placeholder="Product Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ height: '100px' }}
          />
          <label>Description</label>
          {errors.description && <small className="text-danger">{errors.description}</small>}
        </div>
  
        {/* Brand, Model, Color */}
        <div className="row">
          {['brand', 'model', 'color'].map((field) => (
            <div className="col-md-4 mb-3" key={field}>
              <div className="form-floating position-relative">
                <input
                  type="text"
                  className="form-control"
                  id={field}
                  placeholder={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                />
                <label htmlFor={field} className="text-capitalize">{field}</label>
                <Info
                  size={16}
                  className="position-absolute top-50 end-0 translate-middle-y me-3 text-success"
                  data-bs-toggle="tooltip"
                  data-bs-placement="left"
                  title={`Enter the ${field} of the product`}
                  style={{ cursor: 'pointer' }}
                />
                {errors[field] && <small className="text-danger">{errors[field]}</small>}
              </div>
            </div>
          ))}
        </div>
  
        {/* Price, Quantity */}
        <div className="row">
          {['price', 'quantity'].map((field) => (
            <div className="col-md-6 mb-3" key={field}>
              <div className="form-floating position-relative">
                <input
                  type="number"
                  className="form-control"
                  id={field}
                  placeholder={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                />
                <label htmlFor={field} className="text-capitalize">{field}</label>
                <Info
                  size={16}
                  className="position-absolute top-50 end-0 translate-middle-y me-3 text-primary"
                  data-bs-toggle="tooltip"
                  data-bs-placement="left"
                  title={`Enter the ${field}`}
                  style={{ cursor: 'pointer' }}
                />
                {errors[field] && <small className="text-danger">{errors[field]}</small>}
              </div>
            </div>
          ))}
        </div>
  
        {/* Category, Type, Suitable For */}
        <div className="row">
          {[
            { name: 'category', required: true },
            { name: 'type', required: false },
            { name: 'suitableFor', required: false },
          ].map(({ name, required }) => (
            <div className="col-md-4 mb-3" key={name}>
              <div className="form-floating position-relative">
                <input
                  type="text"
                  className="form-control"
                  id={name}
                  placeholder={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                />
                <label htmlFor={name} className="text-capitalize">
                  {name} {required ? '' : <span className="text-muted">(optional)</span>}
                </label>
                <Info
                  size={16}
                  className="position-absolute top-50 end-0 translate-middle-y me-3 text-success"
                  data-bs-toggle="tooltip"
                  data-bs-placement="left"
                  title={`Enter ${name}${required ? '' : ' (optional)'}`}
                  style={{ cursor: 'pointer' }}
                />
                {errors[name] && <small className="text-danger">{errors[name]}</small>}
              </div>
            </div>
          ))}
        </div>
  
        <div className="row g-4 align-items-start">
          {/* Image Upload */}
          <div className="col-md-3">
            <div className="border rounded p-3 h-100">
              <label className="form-label fw-semibold text-primary">Upload Images</label>
              <input
                type="file"
                multiple
                name="images"
                onChange={handleFileChange}
                className="form-control"
                ref={inputRef}
              />
              {errors.image && <small className="text-danger d-block mt-2">{errors.image}</small>}
            </div>
          </div>
  
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="col-md-4">
              <div className="border rounded p-3 h-100">
                <h6 className="fw-semibold text-secondary border-bottom pb-2 mb-3">Existing Images</h6>
                <div className="d-flex flex-wrap gap-3">
                  {existingImages.map((img, index) => (
                    <div key={`existing-${index}`} className="position-relative text-center" style={{ width: "100px" }}>
                      <img
                        src={img.url}
                        alt={img.altText || "Existing"}
                        className="img-thumbnail"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="btn-close position-absolute top-0 end-0 bg-white rounded-circle"
                        aria-label="Remove"
                        style={{ transform: "translate(25%, -25%)" }}
                      />
                      <small className="d-block text-truncate mt-1" style={{ maxWidth: "100px" }}>
                        {img.altText || `Image ${index + 1}`}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
  
          {/* New Images */}
          {imagePreviews.length > 0 && (
            <div className="col-md-5">
              <div className="border rounded p-3 h-100">
                <h6 className="fw-semibold text-success border-bottom pb-2 mb-3">New Images</h6>
                <div className="d-flex flex-wrap gap-3">
                  {imagePreviews.map((img, index) => (
                    <div key={`preview-${index}`} className="position-relative text-center" style={{ width: "100px" }}>
                      <img
                        src={img.url}
                        alt={img.name}
                        className="img-thumbnail"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="btn-close position-absolute top-0 end-0 bg-white rounded-circle"
                        aria-label="Remove"
                        style={{ transform: "translate(25%, -25%)" }}
                      />
                      <small className="d-block text-truncate mt-1" style={{ maxWidth: "100px" }}>
                        {img.name}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
  
        {/* Submit Buttons */}
        <div className="text-end mt-4">
          <button
            type="submit"
            className="btn btn-primary btn-lg px-5"
            disabled={uploading}
          >
            {uploading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
          </button>
          {editingProduct && (
            <button
              type="button"
              className="btn btn-secondary btn-lg ms-3 px-5"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
  
      {/* Product List */}
      <div className="bg-white p-4 rounded shadow-sm">
        {loading ? (
          <p>Loading products...</p>
        ) : currentProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product.productName}</td>
                    <td>Rs.{product.price}</td>
                    <td>{product.quantity}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(product.productCode)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
  
            {/* Pagination */}
            <div className="d-flex justify-content-center mt-3">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`btn btn-sm mx-1 ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
  
};

export default ProductManagement;



