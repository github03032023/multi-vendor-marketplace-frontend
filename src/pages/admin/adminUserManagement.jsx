// import { useEffect, useState } from 'react';
// import axiosInstance from '../../api/axiosSetUp';

// export default function AdminUserManagementDashboard() {
//     const [customers, setCustomers] = useState([]);
//     const [vendors, setVendors] = useState([]);
//     const [view, setView] = useState('customer');
//     const [filter, setFilter] = useState('all');
//     const [successMessage, setSuccessMessage] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;

//     useEffect(() => {
//         const includeDeleted = filter === 'deleted';
//         fetchData(includeDeleted);
//         setCurrentPage(1);
//     }, [filter, view]);

//     const fetchData = async (includeDeleted = false) => {
//         try {
//             const query = includeDeleted ? '?includeDeleted=true' : '';
//             const [custRes, vendRes] = await Promise.all([
//                 axiosInstance.get(`/admin/getAllcustomers${query}`),
//                 axiosInstance.get(`/admin/getAllvendors${query}`)
//             ]);
//             setCustomers(custRes.data);
//             setVendors(vendRes.data);
//         } catch (error) {
//             console.error('Error loading admin data', error);
//         }
//     };

//     const showMessage = (msg) => {
//         setSuccessMessage(msg);
//         setTimeout(() => setSuccessMessage(""), 3000);
//     };
//     const deletedRowStyle = {
//         backgroundColor: '#f2f2f2',
//         color: '#888',
//         fontStyle: 'italic'
//     };

//     const toggleStatus = async (role, id) => {
//         try {
//             await axiosInstance.put(`/admin/toggle-status/${role}/${id}`);
//             showMessage(`✅ ${role.charAt(0).toUpperCase() + role.slice(1)} status updated.`);
//             fetchData();
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const approveVendor = async (id) => {
//         try {
//             await axiosInstance.put(`/admin/vendor/approve/${id}`);
//             showMessage("✅ Vendor approved successfully.");
//             fetchData();
//         } catch (error) {
//             console.error("Error approving vendor:", error);
//         }
//     };

//     const deleteUserOrVendor = async (role, id) => {
//         try {
//             await axiosInstance.put(`/admin/delete/${role}/${id}`);
//             showMessage(`🗑️ ${role.charAt(0).toUpperCase() + role.slice(1)} deleted successfully.`);
//             fetchData();
//         } catch (error) {
//             console.error(`Error deleting ${role}:`, error);
//         }
//     };

//     const undeleteUser = async (role, id) => {
//         try {
//             await axiosInstance.put(`/admin/undelete/${role}/${id}`);
//             showMessage(`✅ ${role} restored and reactivated.`);
//             fetchData();
//         } catch (error) {
//             console.error("Error undeleting user:", error);
//             showError("Failed to undelete user.");
//         }
//     };
//     const filterData = (data) => {
//         switch (filter) {
//             case 'active':
//                 return data.filter(d => d.isActive && !d.isDeleted);
//             case 'inactive':
//                 return data.filter(d => !d.isActive && !d.isDeleted);
//             case 'deleted':
//                 return data.filter(d => d.isDeleted);
//             case 'approved':
//                 return data.filter(d => d.isApproved && !d.isDeleted);
//             case 'all':
//             default:
//                 return data.filter(d => !d.isDeleted); // exclude deleted
//         }
//     };
//     const paginatedData = (data) => {
//         const start = (currentPage - 1) * itemsPerPage;
//         return data.slice(start, start + itemsPerPage);
//     };

//     const totalPages = (dataLength) => Math.ceil(dataLength / itemsPerPage);

//     const renderPagination = (filteredData) => {
//         const total = totalPages(filteredData.length);
//         if (total <= 1) return null;
//         return (
//             <nav className="mt-3">
//                 <ul className="pagination justify-content-center">
//                     {Array.from({ length: total }, (_, i) => (
//                         <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
//                             <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
//                         </li>
//                     ))}
//                 </ul>
//             </nav>
//         );
//     };

//     const dataToRender = view === 'customer' ? customers : vendors;
//     const filtered = filterData(dataToRender);
//     const paginated = paginatedData(filtered);

//     return (
//         <div className="container mt-4">
//             <h2>User Management Dashboard</h2>

//             {successMessage && <div className="alert alert-success">{successMessage}</div>}

//             <div className="d-flex gap-3 mb-4">
//                 <select value={view} onChange={(e) => setView(e.target.value)} className="form-select w-auto">
//                     <option value="customer">Customers</option>
//                     <option value="vendor">Vendors</option>
//                 </select>

//                 <select value={filter} onChange={(e) => setFilter(e.target.value)} className="form-select w-auto">
//                     <option value="all">All</option>
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                     <option value="deleted">Deleted</option>
//                     {view === 'vendor' && <option value="approved">Approved</option>}
//                 </select>
//             </div>

//             {view === 'customer' ? (
//                 <section>
//                     <h4>Customers</h4>
//                     <table className="table table-bordered">
//                         <thead>
//                             <tr>
//                                 <th>Name</th><th>Email</th><th>Phone</th><th>State</th><th>Country</th><th>Status</th><th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {paginated.map(c => {
//                                 const primaryAddress = c.addresses?.[0] || {};
//                                 return (
//                                     <tr key={c._id} style={c.isDeleted ? deletedRowStyle : {}}>
//                                         <td>{c.name}</td>
//                                         <td>{c.email}</td>
//                                         <td>{c.phone || 'N/A'}</td>
//                                         <td>{primaryAddress.state || 'N/A'}</td>
//                                         <td>{primaryAddress.country || 'N/A'}</td>
//                                         <td>{c.isDeleted ? 'Deleted' : c.isActive ? 'Active' : 'Inactive'}</td>
//                                         <td>
//                                             {!c.isDeleted ? (
//                                                 <>
//                                                     <button className="btn btn-sm btn-warning me-2" onClick={() => toggleStatus('customer', c._id)}>
//                                                         {c.isActive ? 'Deactivate' : 'Activate'}
//                                                     </button>
//                                                     <button className="btn btn-sm btn-danger" onClick={() => deleteUserOrVendor('customer', c._id)}>
//                                                         Delete
//                                                     </button>
//                                                 </>
//                                             ) : (
//                                                 <button className="btn btn-sm btn-secondary" onClick={() => undeleteUser('customer', c._id)}>
//                                                     Restore
//                                                 </button>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                     {renderPagination(filtered)}
//                 </section>
//             ) : (
//                 <section>
//                     <h4>Vendors</h4>
//                     <table className="table table-bordered">
//                         <thead>
//                             <tr>
//                                 <th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>State</th><th>Country</th><th>Approved</th><th>Status</th><th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {paginated.map(v => {
//                                 const company = v.companyDetails || {};
//                                 const companyAddress = v.companyDetails.companyAddress || {};
//                                 return (
//                                     <tr key={v._id} style={v.isDeleted ? deletedRowStyle : {}}>
//                                         <td>{v.name}</td>
//                                         <td>{v.email}</td>
//                                         <td>{v.phone || 'N/A'}</td>
//                                         <td>{company.companyName || 'N/A'}</td>
//                                         <td>{companyAddress.state || 'N/A'}</td>
//                                         <td>{companyAddress.country || 'N/A'}</td>
//                                         <td>{v.isApproved ? 'Yes' : 'No'}</td>
//                                         <td>{v.isDeleted ? 'Deleted' : v.isActive ? 'Active' : 'Inactive'}</td>
//                                         <td>
//                                             {!v.isApproved && v.isActive && !v.isDeleted && (
//                                                 <button className="btn btn-sm btn-success me-2" onClick={() => approveVendor(v._id)}>
//                                                     Approve
//                                                 </button>
//                                             )}
//                                             <button className="btn btn-sm btn-warning me-2" onClick={() => toggleStatus('vendor', v._id)}>
//                                                 {v.isActive ? 'Deactivate' : 'Activate'}
//                                             </button>
//                                             {!v.isDeleted ? (
//                                                 <button className="btn btn-sm btn-danger me-2" onClick={() => deleteUserOrVendor('vendor', v._id)}>
//                                                     Delete
//                                                 </button>
//                                             ) : (
//                                                 <button className="btn btn-sm btn-secondary" onClick={() => undeleteUser('vendor', v._id)}>
//                                                     Restore
//                                                 </button>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                     {renderPagination(filtered)}
//                 </section>
//             )}
//         </div>
//     );
// }



import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosSetUp';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Add icons if not already included

export default function AdminUserManagementDashboard() {
    const [customers, setCustomers] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [view, setView] = useState('customer');
    const [filter, setFilter] = useState('all');
    const [successMessage, setSuccessMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const includeDeleted = filter === 'deleted';
        fetchData(includeDeleted);
        setCurrentPage(1);
    }, [filter, view]);

    const fetchData = async (includeDeleted = false) => {
        try {
            const query = includeDeleted ? '?includeDeleted=true' : '';
            const [custRes, vendRes] = await Promise.all([
                axiosInstance.get(`/admin/getAllcustomers${query}`),
                axiosInstance.get(`/admin/getAllvendors${query}`)
            ]);
            setCustomers(custRes.data);
            setVendors(vendRes.data);
        } catch (error) {
            console.error('Error loading admin data', error);
        }
    };

    const showMessage = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    const toggleStatus = async (role, id) => {
        try {
            await axiosInstance.put(`/admin/toggle-status/${role}/${id}`);
            showMessage(`✅ ${role.charAt(0).toUpperCase() + role.slice(1)} status updated.`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const approveVendor = async (id) => {
        try {
            await axiosInstance.put(`/admin/vendor/approve/${id}`);
            showMessage("✅ Vendor approved successfully.");
            fetchData();
        } catch (error) {
            console.error("Error approving vendor:", error);
        }
    };

    const deleteUserOrVendor = async (role, id) => {
        try {
            await axiosInstance.put(`/admin/delete/${role}/${id}`);
            showMessage(`🗑️ ${role.charAt(0).toUpperCase() + role.slice(1)} deleted successfully.`);
            fetchData();
        } catch (error) {
            console.error(`Error deleting ${role}:`, error);
        }
    };

    const undeleteUser = async (role, id) => {
        try {
            await axiosInstance.put(`/admin/undelete/${role}/${id}`);
            showMessage(`✅ ${role} restored and reactivated.`);
            fetchData();
        } catch (error) {
            console.error("Error undeleting user:", error);
        }
    };

    const filterData = (data) => {
        switch (filter) {
            case 'active': return data.filter(d => d.isActive && !d.isDeleted);
            case 'inactive': return data.filter(d => !d.isActive && !d.isDeleted);
            case 'deleted': return data.filter(d => d.isDeleted);
            case 'approved': return data.filter(d => d.isApproved && !d.isDeleted);
            case 'all':
            default: return data.filter(d => !d.isDeleted);
        }
    };

    const paginatedData = (data) => {
        const start = (currentPage - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    };

    const totalPages = (dataLength) => Math.ceil(dataLength / itemsPerPage);

    const renderPagination = (filteredData) => {
        const total = totalPages(filteredData.length);
        if (total <= 1) return null;
        return (
            <nav className="mt-3">
                <ul className="pagination justify-content-center">
                    {Array.from({ length: total }, (_, i) => (
                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                        </li>
                    ))}
                </ul>
            </nav>
        );
    };

    const dataToRender = view === 'customer' ? customers : vendors;
    const filtered = filterData(dataToRender);
    const paginated = paginatedData(filtered);

    const statusBadge = (isDeleted, isActive) => {
        if (isDeleted) return <span className="badge bg-secondary">Deleted</span>;
        return <span className={`badge ${isActive ? 'bg-success' : 'bg-warning text-dark'}`}>{isActive ? 'Active' : 'Inactive'}</span>;
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm p-4 rounded-4">
                <h2 className="text-center text-primary mb-4">Admin User Management</h2>

                {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

                <div className="row g-3 mb-4">
                    <div className="col-md-6">
                        <select value={view} onChange={(e) => setView(e.target.value)} className="form-select">
                            <option value="customer">Customers</option>
                            <option value="vendor">Vendors</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="form-select">
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="deleted">Deleted</option>
                            {view === 'vendor' && <option value="approved">Approved</option>}
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle text-center">
                        <thead className="table-primary">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                {view === 'vendor' && <th>Company</th>}
                                <th>State</th>
                                <th>Country</th>
                                {view === 'vendor' && <th>Approved</th>}
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map(user => {
                                const address = view === 'vendor' ? user.companyDetails?.companyAddress : user.addresses?.[0] || {};
                                return (
                                    <tr key={user._id} className={user.isDeleted ? 'table-light text-muted fst-italic' : ''}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone || 'N/A'}</td>
                                        {view === 'vendor' && <td>{user.companyDetails?.companyName || 'N/A'}</td>}
                                        <td>{address?.state || 'N/A'}</td>
                                        <td>{address?.country || 'N/A'}</td>
                                        {view === 'vendor' && <td>{user.isApproved ? '✅' : '❌'}</td>}
                                        <td>{statusBadge(user.isDeleted, user.isActive)}</td>
                                        <td className="d-flex flex-wrap gap-1 justify-content-center">
                                            {!user.isDeleted && (
                                                <>
                                                    {view === 'vendor' && !user.isApproved && user.isActive && (
                                                        <button className="btn btn-sm btn-success" onClick={() => approveVendor(user._id)}>
                                                            <i className="bi bi-check-circle"></i> Approve
                                                        </button>
                                                    )}
                                                    <button className="btn btn-sm btn-warning" onClick={() => toggleStatus(view, user._id)}>
                                                        <i className="bi bi-toggle2-on"></i> {user.isActive ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => deleteUserOrVendor(view, user._id)}>
                                                        <i className="bi bi-trash"></i> Delete
                                                    </button>
                                                </>
                                            )}
                                            {user.isDeleted && (
                                                <button className="btn btn-sm btn-secondary" onClick={() => undeleteUser(view, user._id)}>
                                                    <i className="bi bi-arrow-counterclockwise"></i> Restore
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {renderPagination(filtered)}
            </div>
        </div>
    );
}
