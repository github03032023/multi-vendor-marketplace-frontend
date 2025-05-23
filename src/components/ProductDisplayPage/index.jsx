import React, { useEffect, useState, useContext } from 'react';
import { useDispatch } from "react-redux";
import axiosInstance from '../../api/axiosSetUp';
import { useParams, useNavigate } from 'react-router-dom';
import '../ProductDisplayPage/ProductDisplayPage.css';
import { addToCart } from "../../slices/cartSlice";
import { addItemToCart } from "../../api/cartActions";
import { UserContext } from '../../context/userContext';

const ProductDisplayPage = () => {
  const { productCode } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [wishlistMsg, setWishlistMsg] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '', image: null });
  const [selectedImage, setSelectedImage] = useState(null);
  const [reviews, setReviews] = useState([]);

  const isLoggedIn = !!localStorage.getItem('token');
  const { userName, role } = useContext(UserContext);
  console.log("userName-", userName);
  console.log("role-", role);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/productReview/getReviewedProducts/${productCode}`);
        setProduct(res.data.product);
        setReviews(res.data.reviews);
        setSelectedImage(res.data.product.images[0]?.url);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [productCode]);

  const handleAddToCart = () => {
    const productToAdd = {
      productId: product._id,
      productName: product.productName,
      productCode: product.productCode,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images,
      vendorId: product.vendorId,
    };
    dispatch(addItemToCart(product.productCode, 1));
    dispatch(addToCart(productToAdd));
    navigate(`/cart`);
  };

  const handleAddToWishlist = async () => {
    if (!isLoggedIn) {
      alert('Please log in to add items to your wishlist.');
      return navigate('/login');
    }

    try {
      await axiosInstance.post('/wishlist/addProductsToWishlist', { productId: product._id });
      setWishlistMsg('Added to wishlist!');
    } catch (error) {
      setWishlistMsg(error.response.data.message || 'Error adding to wishlist.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!userName) {
      alert('Please log in to submit a review.');
      return navigate('/login');
    }

    const formData = new FormData();
    formData.append('productId', product._id);
    formData.append('rating', reviewForm.rating);
    formData.append('comment', reviewForm.comment);
    if (reviewForm.image) formData.append('image', reviewForm.image);

    try {
      await axiosInstance.post('/productReview/reviewProduct', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setReviewForm({ rating: 0, comment: '', image: null });
      const res = await axiosInstance.get(`/productReview/getReviewedProducts/${productCode}`);
      setReviews(res.data.reviews);
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container my-4">
      <div className="row">
        {/* Left: Image Preview */}
        <div className="col-md-5">
          <div className="image-preview mb-3">
            <img src={selectedImage} alt="Main" className="img-fluid main-img" />
          </div>
          <div className="d-flex flex-wrap">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt="Thumbnail"
                className={`thumbnail-img me-2 mb-2 ${selectedImage === img.url ? 'selected' : ''}`}
                onClick={() => setSelectedImage(img.url)}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="col-md-7">
          <h3>{product.productName}</h3>
          <p><strong>Price:</strong> Rs.{product.price}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Model:</strong> {product.model}</p>
          <p><strong>Color:</strong> {product.color}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Type:</strong> {product.type}</p>
          <p><strong>Suitable For:</strong> {product.suitableFor}</p>
          <p><strong>Vendor Company Name:</strong> {product.vendorId.companyDetails.companyName}</p>
          <p><strong>Product Origin:</strong> {product.vendorId.companyDetails.companyAddress.country}</p>
          {userName && role === "customer" && (
            <div className="mt-3 d-flex flex-wrap gap-2">
              <button className="btn btn-outline-danger" onClick={handleAddToWishlist}>
                Add to Wishlist
              </button>
              <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
              {/* <button className="btn btn-success" onClick={handleProceedToPay}>Buy Now</button> */}
            </div>
          )}
          {wishlistMsg && <div className="mt-2 text-info">{wishlistMsg}</div>}
        </div>
      </div>

      {!isLoggedIn && (
          <div className="alert alert-warning">
            Please <a href="/login">log in</a> to add items to cart
          </div>
        )}

      {/* Reviews Section */}
      <div className="mt-5">
        <h4>Customer Reviews</h4>
        {reviews.length === 0 ? (
          <p className="text-muted">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((rev, idx) => (
            <div key={idx} className="border rounded p-3 my-2">
              <p><strong>{rev.customerId.name}</strong> rated <strong>{rev.rating} ★</strong></p>
              <p>{rev.comment}</p>
              {rev.image?.url && <img src={rev.image.url} alt="Review" className="img-thumbnail" width="100" />}
            </div>
          ))
        )}
      </div>

      {/* Review Submission */}
      {userName && role === "customer" && (
      <div className="mt-4">
        <h5>Submit Your Review</h5>
        {!isLoggedIn ? (
          <div className="alert alert-warning">
            Please <a href="/login">log in</a> to submit a review.
          </div>
        ) : (
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-3">
              <label className="form-label">Rating</label>
              <select
                className="form-select"
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
              >
                <option value={0}>Select</option>
                {[1, 2, 3, 4, 5].map((star) => (
                  <option key={star} value={star}>{star}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Comment</label>
              <textarea
                className="form-control"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows={3}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Upload Image (optional)</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                multiple
                className="form-control"
                onChange={(e) => setReviewForm({ ...reviewForm, image: e.target.files[0] })}
              />
            </div>

            <button type="submit" className="btn btn-dark">Submit Review</button>
          </form>
        )}
      </div>
      )}
    </div>
  );
};

export default ProductDisplayPage;
