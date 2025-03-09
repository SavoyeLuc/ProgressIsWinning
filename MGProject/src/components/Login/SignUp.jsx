import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from './InputField';
import { setAuthToken, setUserData } from '../../utils/auth';
import { register } from '../../utils/api';

// API base URL
const API_URL = 'http://localhost:5000/';
console.log(API_URL);

const SignUp = () => {
  const navigate = useNavigate();
  const [selectedDot, setSelectedDot] = useState(3); // Middle dot selected by default
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Map dot index to political leaning code
  const dotToPolLean = {
    0: 'FL', // Far Left
    1: 'L',  // Left
    2: 'SL', // Slightly Left
    3: 'M',  // Middle
    4: 'SR', // Slightly Right
    5: 'R',  // Right
    6: 'FR'  // Far Right
  };

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
      // Prepare data for API
      const apiData = {
        ...formData,
        polLean: dotToPolLean[selectedDot]
      };
      
      console.log('Sending data to API:', JSON.stringify(apiData));

      // Call registration API
      const response = await register(apiData);
      console.log('Response data:', response);

      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }

      // Store token and user data
      setAuthToken(response.token);
      setUserData(response.user);

      // Redirect to home page
      navigate('/home');
    } catch (err) {
      console.error('Error details:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container signup-container">
      <h2 className="form-title">Create Account</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="login-form">
        <InputField 
          type="text" 
          placeholder="First Name" 
          icon="person" 
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
        />
        <InputField 
          type="text" 
          placeholder="Last Name" 
          icon="person" 
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
        />
        <InputField 
          type="text" 
          placeholder="Username" 
          icon="account_circle" 
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <InputField 
          type="email" 
          placeholder="Email address" 
          icon="mail" 
          name="email"
          value={formData.email}
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
        
        <div className="political-spectrum">
          <label>Political Leaning</label>
          <div className="dot-container">
            {[...Array(7)].map((_, index) => (
              <button
                key={index}
                type="button"
                className={`dot ${selectedDot === index ? 'selected' : ''}`}
                onClick={() => setSelectedDot(index)}
              />
            ))}
          </div>
          <div className="spectrum-labels">
            <span>Liberal</span>
            <span>Conservative</span>
          </div>
        </div>

        <button 
          type="submit" 
          className="login-button" 
          disabled={isLoading}
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>

      <p className="signup-prompt">
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
};

export default SignUp;
