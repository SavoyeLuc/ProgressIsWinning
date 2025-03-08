import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from './InputField';

const SignUp = () => {
  const navigate = useNavigate();
  const [selectedDot, setSelectedDot] = useState(3); // Middle dot selected by default

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/home');
  };
  
  return (
    <div className="login-container signup-container">
      <h2 className="form-title">Create Account</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <InputField type="text" placeholder="First Name" icon="person" />
        <InputField type="text" placeholder="Last Name" icon="person" />
        <InputField type="text" placeholder="Username" icon="account_circle" />
        <InputField type="email" placeholder="Email address" icon="mail" />
        <InputField type="password" placeholder="Password" icon="lock" />
        
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

        <button type="submit" className="login-button">Sign Up</button>
      </form>

      <p className="signup-prompt">
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
};

export default SignUp;
