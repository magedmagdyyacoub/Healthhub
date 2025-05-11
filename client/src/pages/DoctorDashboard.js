import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DatePicker } from 'antd';
import { Button, Modal, Form, Input, Select } from 'antd';

const { RangePicker } = DatePicker;

const DoctorDashboard = () => {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    day_of_work: [],
    start_time: '',
    end_time: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const [infoRes, scheduleRes, appointmentsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/doctor/info', config),
          axios.get('http://localhost:5000/api/doctor/schedule', config),
          axios.get('http://localhost:5000/api/doctor/appointments', config),
        ]);

        setDoctorInfo(infoRes.data);
        setSchedule(scheduleRes.data);
        setAppointments(appointmentsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleAddSchedule = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.post(
        'http://localhost:5000/api/doctor/schedule',
        values,
        config
      );

      setSchedule([...schedule, response.data]);
      setNewSchedule({ day_of_work: [], start_time: '', end_time: '' });
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.delete(`http://localhost:5000/api/doctor/schedule/${id}`, config);
      setSchedule(schedule.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const handleUpdateSchedule = async (id, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.put(
        `http://localhost:5000/api/doctor/schedule/${id}`,
        updatedData,
        config
      );

      setSchedule(schedule.map((item) => (item.id === id ? response.data : item)));
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const openModal = (schedule) => {
    setEditingSchedule(schedule);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingSchedule(null);
  };

  const handleModalSubmit = async (values) => {
    if (editingSchedule) {
      await handleUpdateSchedule(editingSchedule.id, values);
    } else {
      await handleAddSchedule(values);
    }
    closeModal();
  };

  if (!doctorInfo) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
      <h1 style={{ color: '#007bff' }}>Welcome, Dr. {doctorInfo.name}</h1>
      <p><strong>Email:</strong> {doctorInfo.email}</p>
      <p><strong>Specialty:</strong> {doctorInfo.specialty}</p>

      <hr />

      {/* Add New Schedule Form */}
      <Button
        type="primary"
        style={{ marginBottom: '20px' }}
        onClick={() => setModalVisible(true)}
      >
        Add New Schedule
      </Button>

      <h2>Work Schedule</h2>
      {schedule.length === 0 ? (
        <p>No schedule set yet.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          {schedule.map((item) => (
            <li
              key={item.id}
              style={{
                background: '#ffffff',
                border: '1px solid #ddd',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '5px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong>{item.day_of_work}</strong>: {item.start_time} - {item.end_time}
              </div>
              <div>
                <Button
                  type="link"
                  style={{ marginRight: '10px' }}
                  onClick={() => openModal(item)}
                >
                  Edit
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => handleDeleteSchedule(item.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <hr />

      {/* Appointments Section */}
      <h2>Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <ul>
          {appointments.map((appt, i) => (
            <li key={i}>
              Patient: {appt.patient_name} | Time: {new Date(appt.appointment_time).toLocaleString()} | Status: {appt.status}
            </li>
          ))}
        </ul>
      )}

      {/* Modal for Adding or Editing Schedule */}
      <Modal
        title={editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
        visible={modalVisible}
        onCancel={closeModal}
        footer={null}
      >
        <Form
          initialValues={{
            day_of_work: editingSchedule ? editingSchedule.day_of_work : [],
            start_time: editingSchedule ? editingSchedule.start_time : '',
            end_time: editingSchedule ? editingSchedule.end_time : '',
          }}
          onFinish={handleModalSubmit}
        >
          <Form.Item label="Day of Work" name="day_of_work" rules={[{ required: true }]}>
            <Select
              
              placeholder="Select Days"
              allowClear
              options={[
                { value: 'Monday', label: 'Monday' },
                { value: 'Tuesday', label: 'Tuesday' },
                { value: 'Wednesday', label: 'Wednesday' },
                { value: 'Thursday', label: 'Thursday' },
                { value: 'Friday', label: 'Friday' },
                { value: 'Saturday', label: 'Saturday' },
                { value: 'Sunday', label: 'Sunday' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Start Time" name="start_time" rules={[{ required: true }]}>
            <Input type="time" />
          </Form.Item>
          <Form.Item label="End Time" name="end_time" rules={[{ required: true }]}>
            <Input type="time" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingSchedule ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;
