import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import InputField from "./components/Login/InputField";
import Home from './pages/Home';
import CreatePost from './components/Posts/CreatePost';
import SignUp from './components/Login/SignUp';

const AuthLayout = ({ children }) => {
  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => document.body.classList.remove('auth-page');
  }, []);
  
  return children;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const url = 'github.com/auth/login';

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(url, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      username: e.target[0].value,
      password: e.target[1].value,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
      navigate('/home');
      } else {
        
      // handle login failure
      console.error('Login failed:', data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });

    navigate('/home');
  };

  return (
    <AuthLayout>
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <InputField type="email" placeholder="Email address" icon="mail" />
          <InputField type="password" placeholder="Password" icon="lock" />

          <a href="#" className="forgot-password-link">Forgot password?</a>
          <button type="submit" className="login-button">Log In</button>
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
        <Route path="/create-comment" element={<CreateComment />} />
      </Routes>
    </Router>
  );
};

export default App;