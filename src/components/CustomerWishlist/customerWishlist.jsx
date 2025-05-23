import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../api/axiosSetUp';
import { UserContext } from '../../context/userContext';
import { Trash2 } from 'lucide-react';

const CustomerWishlist = () => {
  const { userName } = useContext(UserContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await axiosInstance.get('/wishlist/getWishlist');
      setWishlist(res.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await axiosInstance.delete(`/wishlist/deleteWishlist/${id}`);
      setWishlist(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error removing wishlist item:', error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (!userName) {
    return <div className="container my-5"><p>Please login to view your wishlist.</p></div>;
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">My Wishlist</h2>

      {loading ? (
        <p>Loading wishlist...</p>
      ) : wishlist.length === 0 ? (
        <div className="alert alert-info">Your wishlist is empty.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {wishlist.map(({ _id, productId }) => (
            <div key={_id} className="col">
              <div className="card h-100 shadow-sm">
                {productId.images?.[0]?.url && (
                  <img
                    src={productId.images[0].url}
                    className="card-img-top"
                    alt={productId.productName}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{productId.productName}</h5>
                  <p className="card-text text-muted mb-2">{productId.category}</p>
                  <p className="card-text fw-bold mb-4">₹{productId.price}</p>

                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => removeFromWishlist(_id)}
                    >
                      <Trash2 size={16} className="me-1" /> Remove
                    </button>
                    <a href={`/product/${productId.productCode}`} className="btn btn-primary">
                      View Product
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerWishlist;
