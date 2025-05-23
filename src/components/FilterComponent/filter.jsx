// import React from 'react';
// import { Input } from "@/components/ui/input";

// const FilterComponent = ({ filters, setFilters, brands, categories, searchQuery, setSearchQuery }) => {

//     const handleClearFilters = () => {
//         setFilters({ sort: "", brand: "", category: "" });
//         setSearchQuery("");
//     };

//     return (
//         <div
//             className="container-fluid my-3"
//             style={{
//                 position: 'sticky',
//                 top: 0,
//                 zIndex: 1000,
//                 backgroundColor: 'white',
//                 boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
//             }}
//         >
//             <div className="row g-3 p-4 border-bottom">
//                 {/* Search Products */}
//                 <div className="col-md-6 col-lg-3">
//                     <label className="form-label fw-semibold text-muted">🔍 Search Products</label>
//                     <Input
//                         type="search"
//                         value={searchQuery}
//                         placeholder="Search by product name"
//                         onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
//                         className="form-control"
//                     />
//                 </div>

//                 {/* Sort by Price */}
//                 <div className="col-md-6 col-lg-3">
//                     <label className="form-label fw-semibold text-muted">🔢 Sort by Price</label>
//                     <select
//                         value={filters.sort}
//                         onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
//                         className="form-select"
//                     >
//                         <option value="">None</option>
//                         <option value="lowToHigh">Price: Low to High</option>
//                         <option value="highToLow">Price: High to Low</option>
//                     </select>
//                 </div>

//                 {/* Filter by Brand */}
//                 <div className="col-md-6 col-lg-3">
//                     <label className="form-label fw-semibold text-muted">🏷️ Filter by Brand</label>
//                     <select
//                         value={filters.brand}
//                         onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
//                         className="form-select"
//                     >
//                         <option value="">All Brands</option>
//                         {brands.map((brand, idx) => (
//                             <option key={idx} value={brand}>{brand}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Filter by Category */}
//                 <div className="col-md-6 col-lg-3">
//                     <label className="form-label fw-semibold text-muted">📦 Filter by Category</label>
//                     <select
//                         value={filters.category}
//                         onChange={(e) => setFilters({ ...filters, category: e.target.value })}
//                         className="form-select"
//                     >
//                         <option value="">All Categories</option>
//                         {categories.map((category, idx) => (
//                             <option key={idx} value={category}>{category}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Clear Filters Button */}
//                 <div className="col-12 d-flex justify-content-end mt-2">
//                     <button
//                         onClick={handleClearFilters}
//                         className="btn btn-outline-danger btn-sm"
//                     >
//                         🔄 Clear Filters
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FilterComponent;



import React from 'react';

const FilterComponent = ({
  filters,
  setFilters,
  brands,
  categories,
  searchQuery,
  setSearchQuery
}) => {

  const handleClearFilters = () => {
    setFilters({ sort: "", brand: "", category: "" });
    setSearchQuery("");
  };

  return (
    <div
      className="container-fluid my-3"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'white',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      }}
    >
      <div className="row g-3 p-4 border-bottom">
        {/* Search Products */}
        <div className="col-md-6 col-lg-3">
          <label className="form-label fw-semibold text-muted">🔍 Search Products</label>
          <input
            type="search"
            value={searchQuery}
            placeholder="Search by product name"
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            className="form-control"
          />
        </div>

        {/* Sort by Price */}
        <div className="col-md-6 col-lg-3">
          <label className="form-label fw-semibold text-muted">🔢 Sort by Price</label>
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="form-select"
          >
            <option value="">None</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>

        {/* Filter by Brand */}
        <div className="col-md-6 col-lg-3">
          <label className="form-label fw-semibold text-muted">🏷️ Filter by Brand</label>
          <select
            value={filters.brand}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
            className="form-select"
          >
            <option value="">All Brands</option>
            {brands.map((brand, idx) => (
              <option key={idx} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Filter by Category */}
        <div className="col-md-6 col-lg-3">
          <label className="form-label fw-semibold text-muted">📦 Filter by Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="form-select"
          >
            <option value="">All Categories</option>
            {categories.map((category, idx) => (
              <option key={idx} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="col-12 d-flex justify-content-end mt-2">
          <button
            onClick={handleClearFilters}
            className="btn btn-outline-danger btn-sm"
          >
            🔄 Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
