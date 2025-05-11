import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../style/DoctorSpecialties.css'; // Importing the CSS

const DoctorSpecialties = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(6); // Show 6 records per page

  // Fetch Doctors
  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/doctors');
      setDoctors(res.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  // Fetch Specialties
// Fetch Specialties
const fetchSpecialties = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/specialties');
    console.log(res.data); // Log the response data to check the structure
    setSpecialties(res.data || []); // Use res.data directly as it's an array
  } catch (error) {
    console.error('Error fetching specialties:', error);
  }
};


  // Handle the specialty change for each doctor
  const handleChange = async (doctorId, newSpecialtyId) => {
    try {
      await axios.post(`http://localhost:5000/api/admin/doctors/${doctorId}/specialty`, {
        specialtyId: newSpecialtyId,
      });
      fetchDoctors(); // Refresh list after update
    } catch (error) {
      console.error('Error updating specialty:', error);
    }
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(doctors.length / doctorsPerPage); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
  }, []);

  return (
    <div className="specialties-page">
      <Navbar />
      <Sidebar />
      <h2 className="page-title">Assign Specialties to Doctors</h2>
      <div className="table-container">
        <table className="specialty-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Current Specialty</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
            {currentDoctors.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>{doc.specialty_name || 'Not Assigned'}</td>
                <td>
                  <select
                    value={doc.specialty_id || ''} // Check for no specialty assigned
                    onChange={(e) => handleChange(doc.id, e.target.value)}
                  >
                    <option value="">-- Select Specialty --</option>
                    {specialties.map((spec) => (
                      <option key={spec.id} value={spec.id}>
                        {spec.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${currentPage === number ? 'active' : ''}`}
            >
              <button
                onClick={() => handlePageChange(number)}
                className="page-link"
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorSpecialties;
