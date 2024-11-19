
import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/UserForm.css"
import api from '../services/api';

const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "IT",
  "Customer Support",
  "Legal",
  "Procurement",
  "Research and Development",
  "Product Management",
  "Business Development",
  "Quality Assurance",
  "Public Relations",
  "Administration",
  "Training and Development",
  "Security",
  "Data Science",
  "Other"
];

const UserForm = ({ isOpen, onClose, selectedUser, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedUser) {
      setFormData(selectedUser);
    } else {
      resetForm();
    }
  }, [selectedUser]);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      department: ''
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.department) newErrors.department = 'Department is required';

    setErrors(newErrors);

    // Combine errors into a single string for the toast
    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors).join(', ');
      toast.error(`Validation errors: ${errorMessages}`);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (selectedUser) {
        const response = await api.updateUser(selectedUser.id, formData);
        toast.success(response.data.message);
      } else {
        const response = await api.createUser(formData);
        toast.success(response.data.message);
      }
      onUserUpdated();
      onClose();
    } catch (message) {
      toast.error(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <div className="form-title">
            <FaUser className="user-icon" />
            <h2>{selectedUser ? 'Edit User' : 'Add New User'}</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-btn">
              {selectedUser ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
