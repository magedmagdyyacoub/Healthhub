import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../style/Specialties.css';

const Specialties = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const fetchSpecialties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/specialties');
      console.log('API Response:', res.data);
      setSpecialties(res.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching specialties:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpecialties();
  }, [fetchSpecialties]);

  const handleAddSpecialty = async () => {
    if (newSpecialty.trim() === '') return;
    try {
      const res = await axios.post('http://localhost:5000/api/specialties', { name: newSpecialty });
      setSpecialties((prev) => [...prev, res.data]);
      setNewSpecialty('');
    } catch (error) {
      console.error('Error adding specialty:', error);
    }
  };

  const handleUpdateSpecialty = async (id) => {
    if (editingName.trim() === '') return;
    try {
      const res = await axios.put(`http://localhost:5000/api/specialties/${id}`, { name: editingName });
      setSpecialties((prev) =>
        prev.map((spec) => (spec.id === id ? res.data : spec))
      );
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Error updating specialty:', error);
    }
  };

  const handleDeleteSpecialty = async (id) => {
    if (window.confirm('Are you sure you want to delete this specialty?')) {
      try {
        await axios.delete(`http://localhost:5000/api/specialties/${id}`);
        setSpecialties((prev) => prev.filter((spec) => spec.id !== id));
        console.log('Specialty deleted successfully');
      } catch (error) {
        console.error('Error deleting specialty:', error);
      }
    }
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = specialties.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(specialties.length / recordsPerPage);

  return (
    <div className="specialties-page">
      <Navbar />
      <Sidebar />
      <h2 className="page-title">Manage Specialties</h2>

      <div className="specialty-form">
        <input
          type="text"
          placeholder="New Specialty"
          value={newSpecialty}
          onChange={(e) => setNewSpecialty(e.target.value)}
        />
        <button onClick={handleAddSpecialty}>Add Specialty</button>
      </div>

      {loading ? (
        <p>Loading specialties...</p>
      ) : (
        <div className="table-container">
          <table className="specialty-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((spec) => (
                  <tr key={spec.id}>
                    <td>
                      {editingId === spec.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                        />
                      ) : (
                        spec.name
                      )}
                    </td>
                    <td className="actions">
                      {editingId === spec.id ? (
                        <button className="btn-edit" onClick={() => handleUpdateSpecialty(spec.id)}>Save</button>
                      ) : (
                        <button className="btn-edit" onClick={() => {
                          setEditingId(spec.id);
                          setEditingName(spec.name);
                        }}>
                          Edit
                        </button>
                      )}
                      <button className="btn-delete" onClick={() => handleDeleteSpecialty(spec.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center" }}>No specialties available</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Specialties;
