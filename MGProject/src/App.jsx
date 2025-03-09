import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import InputField from "./components/Login/InputField";
import Home from './pages/Home';
import CreatePost from './components/Posts/CreatePost';
import SignUp from './components/Login/SignUp';
import { setAuthToken, setUserData } from './utils/auth';

const AuthLayout = ({ children }) => {
  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => document.body.classList.remove('auth-page');
  }, []);
  
  return children;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call login API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      setAuthToken(data.token);
      setUserData(data.user);

      // Redirect to home page
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="login-container">
        <h2 className="form-title">Log In</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <InputField 
            type="text"
            placeholder="Username"
            icon="account_circle"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
          <InputField 
            type="password" 
            placeholder="Password" 
            icon="lock" 
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />

          <a href="#" className="forgot-password-link">Forgot password?</a>
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <p className="signup-prompt">
          Don&apos;t have an account? <a href="#" onClick={(e) => {
            e.preventDefault();
            navigate('/signup');
          }} className="signup-link">Sign up</a>
        </p>
      </div>
    </AuthLayout>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthLayout><LoginForm /></AuthLayout>} />
        <Route path="/login" element={<AuthLayout><LoginForm /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </Router>
  );
};

export default App;