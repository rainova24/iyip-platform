import api from './api';

class AuthService {
    getToken() {
        return localStorage.getItem('token');
    }

    saveToken(token) {
        localStorage.setItem('token', token);
    }

    removeToken() {
        localStorage.removeItem('token');
    }

    isLoggedIn() {
        return this.getToken() !== null;
    }

    async login(email, password) {
        try {
            const response = await api.post('/api/auth/login', { email, password });

            if (response.data.token) {
                this.saveToken(response.data.token);
            }

            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    }

    async register(name, email, password) {
        try {
            const response = await api.post('/api/auth/register', { name, email, password });
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    }

    logout() {
        this.removeToken();
    }
}

export const authService = new AuthService();