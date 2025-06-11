import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/userinfo.css';

const UserInfo = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        nim: user?.nim || '',
        birthDate: user?.birthDate || '',
        gender: user?.gender || '',
        phone: user?.phone || '',
        province: user?.province || '',
        city: user?.city || ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch('http://localhost:8080/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    birthDate: formData.birthDate,
                    gender: formData.gender,
                    phone: formData.phone,
                    province: formData.province,
                    city: formData.city
                })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setIsEditing(false);
                alert('Profil berhasil diperbarui!');
                window.location.reload();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Gagal memperbarui profil');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Gagal memperbarui profil: ' + error.message);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan.')) {
            try {
                const response = await fetch('/api/users/delete', {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Akun berhasil dihapus');
                    logout();
                    navigate('/');
                }
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('Gagal menghapus akun');
            }
        }
    };

    if (!user) return (
        <div className="container text-center mt-5">
            <div className="alert alert-warning">
                Silakan login terlebih dahulu
            </div>
        </div>
    );

    return (
        <div className="container mt-4">
            <div className="card user-profile-card">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">Profil Pengguna</h3>
                    <div>
                        <button 
                            className="btn btn-light me-2" 
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'Batal' : 'Edit Profil'}
                        </button>
                        <button 
                            className="btn btn-danger"
                            onClick={handleDelete}
                        >
                            Hapus Akun
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3 text-center mb-4">
                            <div className="profile-avatar">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="col-md-9">
                            {isEditing ? (
                                <form onSubmit={handleUpdate}>
                                    <div className="user-info-grid">
                                        <div className="info-item">
                                            <label>Nama Lengkap</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="info-item">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="form-control"
                                                readOnly
                                            />
                                        </div>
                                        <div className="info-item">
                                            <label>NIM</label>
                                            <input
                                                type="text"
                                                name="nim"
                                                value={formData.nim}
                                                onChange={handleChange}
                                                className="form-control"
                                                readOnly
                                            />
                                        </div>
                                        <div className="info-item">
                                            <label>Tanggal Lahir</label>
                                            <input
                                                type="date"
                                                name="birthDate"
                                                value={formData.birthDate}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="info-item">
                                            <label>Jenis Kelamin</label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className="form-control"
                                            >
                                                <option value="">Pilih Jenis Kelamin</option>
                                                <option value="LAKI_LAKI">Laki-laki</option>
                                                <option value="PEREMPUAN">Perempuan</option>
                                            </select>
                                        </div>
                                        <div className="info-item">
                                            <label>No. HP</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="info-item">
                                            <label>Provinsi</label>
                                            <input
                                                type="text"
                                                name="province"
                                                value={formData.province}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="info-item">
                                            <label>Kota</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <button type="submit" className="btn btn-primary">
                                            Simpan Perubahan
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="user-info-grid">
                                    <div className="info-item">
                                        <label>Nama Lengkap</label>
                                        <p>{user.name || '-'}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>Email</label>
                                        <p>{user.email || '-'}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>NIM</label>
                                        <p>{user.nim || '-'}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>Tanggal Lahir</label>
                                        <p>{user.birthDate || '-'}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>Jenis Kelamin</label>
                                        <p>{user.gender === 'LAKI_LAKI' ? 'Laki-laki' : user.gender === 'PEREMPUAN' ? 'Perempuan' : '-'}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>No. HP</label>
                                        <p>{user.phone || '-'}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>Provinsi</label>
                                        <p>{user.province || '-'}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>Kota</label>
                                        <p>{user.city || '-'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;