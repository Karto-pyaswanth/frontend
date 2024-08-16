import React, { useState, useEffect } from 'react';
import './ContactForm.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '' ,
        age: '',
        email: '',
        phone: ''
    });
    const [contacts, setContacts] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/contacts');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setContacts(data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editIndex !== null) {
                const contactId = contacts[editIndex]._id; // Use unique identifier
                const response = await fetch(`http://localhost:5001/api/contacts/${contactId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                if (!response.ok) throw new Error('Network response was not ok');
                const updatedContact = await response.json();
                const updatedContacts = contacts.map((contact, index) =>
                    index === editIndex ? updatedContact : contact
                );
                setContacts(updatedContacts);
                setEditIndex(null);
            } else {
                const response = await fetch('http://localhost:5001/api/contacts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                if (!response.ok) throw new Error('Network response was not ok');
                const newContact = await response.json();
                setContacts([...contacts, newContact]);
            }
            setFormData({ name: '', age: '', email: '', phone: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (index) => {
        setFormData(contacts[index]);
        setEditIndex(index);
    };

    const handleDelete = async (index) => {
        try {
            const contactId = contacts[index]._id; // Use unique identifier
            const response = await fetch(`http://localhost:5001/api/contacts/${contactId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const updatedContacts = contacts.filter((_, i) => i !== index);
            setContacts(updatedContacts);
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    return (
        <div>
            <div className="form-container">
                <h2>Contact Form</h2>
                <form onSubmit={handleSubmit}>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label>Age:</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />

                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        title="Please enter a valid email address"
                    />

                    <label>Phone Number:</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        pattern="\d{10}"
                        title="Phone number must be 10 digits"
                    />

                    <button type="submit">{editIndex !== null ? 'Update' : 'Add'} Contact</button>
                </form>
            </div>

            <div className="contact-list-container">
                <h3>Contact List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact, index) => (
                            <tr key={contact._id}>
                                <td>{contact.name}</td>
                                <td>{contact.age}</td>
                                <td>{contact.email}</td>
                                <td>{contact.phone}</td>
                                <td>
                                    <button onClick={() => handleEdit(index)}>Edit</button>
                                    <button onClick={() => handleDelete(index)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContactForm;
