
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import UserForm from './UserForm';
import "../styles/UserList.css"

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

useEffect(() => {
  const filtered = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredUsers(filtered);
}, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers(page, searchTerm);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (message) {
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await api.deleteUser(id);
        toast.success(response.data.message);
        fetchUsers();
      } catch (message) {
        toast.error(message);
      }
    }
  };

  return (
    <div className="user-management">
      <div className="header">
        <h1>User Management</h1>
        <button className="add-user" onClick={() => setShowModal(true)}>
          Add User
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
                <tr>
                <td colSpan="6" className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <p>No users found</p>
                </td>
                </tr>
            ) : (
                filteredUsers.map(user => (
                <tr key={user.id}>
                    <td data-label="ID">{user.id}</td>
                    <td data-label="First Name">{user.firstName}</td>
                    <td data-label="Last Name">{user.lastName}</td>
                    <td data-label="Email">{user.email}</td>
                    <td data-label="Department">{user.department}</td>
                    <td data-label="Actions">
                    <div className="action-buttons">
                        <button 
                        className="btn-icon edit"
                        onClick={() => {
                            setSelectedUser(user);
                            setShowModal(true);
                        }}
                        >
                        <FaEdit />
                        </button>
                        <button 
                        className="btn-icon delete"
                        onClick={() => handleDelete(user.id)}
                        >
                        <FaTrash />
                        </button>
                    </div>
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </table>
      </div>
      
      <div className="pagination">
        <button
          className="btn-nav"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          <FaChevronLeft /> Previous
        </button>
        <div className="page-numbers">
          {page > 3 && (
            <>
              <button className="btn-page" onClick={() => setPage(1)}>
                1
              </button>
              <span className="dots">...</span>
            </>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((num) => {
              const visibleStart = Math.max(page - 2, 1);
              const visibleEnd = Math.min(page + 2, totalPages);
              return num >= visibleStart && num <= visibleEnd;
            })
            .map((num) => (
              <button
                key={num}
                className={`btn-page ${page === num ? 'active' : ''}`}
                onClick={() => setPage(num)}
              >
                {num}
              </button>
            ))}
          {page < totalPages - 2 && (
            <>
              <span className="dots">...</span>
              <button className="btn-page" onClick={() => setPage(totalPages)}>
                {totalPages}
              </button>
            </>
          )}
        </div>
        <button
          className="btn-nav"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next <FaChevronRight />
        </button>
      </div>


      <UserForm
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        selectedUser={selectedUser}
        onUserAdded={fetchUsers}
        onUserUpdated={() => {
          fetchUsers();
          setSelectedUser(null);
        }}
      />
    </div>
  );
};

export default UserList;