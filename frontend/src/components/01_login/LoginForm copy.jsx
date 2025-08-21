import { useState, useRef} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useAppContext } from 'ContextAPI/AppContext';
// import { useAppContext } from "../../ContextAPI/AppContext";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const { login } = useAppContext();
  const { login, updateVar, } = useAppContext();

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleDivClick = (ref) => {
    if (ref?.current) {
      ref.current.focus();
    }
  };

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/token/`,
        { username, password },
        { withCredentials: true } // Required for cookies
      );
  
      // Handle successful login
      login(response.data.access); 
      updateVar("userName",response.data.name);
      updateVar("userRole",response.data.role);
      // updateVar("teacherDesignation",response.data.teacherDesignation);

      console.log(response.data);
      // console.log(response.data.username);
      // console.log(response.data.name);
      // console.log(response.data.role);

  
      // Uncomment this if refresh tokens are required to be stored locally
      // localStorage.setItem('refreshToken', response.data.refresh); //---------------- remove it for production -------------
    } catch (err) {
      // Check if the error is an authentication error
      if (err.response && err.response.status === 401) {
        setError("Invalid username or password. Please try again.");
      } 
      // Handle other types of server errors
      else if (err.response) {
        setError(`Error: ${err.response.status} - ${err.response.data.detail || "An error occurred."}`);
      } 
      // Handle network errors or no response
      else if (err.request) {
        setError("Network error: Unable to connect to the server. Please check your internet connection.");
      } 
      // Handle other unexpected errors
      else {
        setError(`Unexpected error: ${err.message}`);
      }
    }
  };
  
  

  
  

  return (
    <div>
      <form onSubmit={handleLogin}>
        {/* Mobile Number Input */}
        <div
          className="mobile-number"
          onClick={() => handleDivClick(usernameRef)} // Focus username input when div is clicked
          style={{ cursor: "pointer" }}
        >
          <span>Mobile Number</span>
          <div className="input-box">
            <input
              ref={usernameRef} // Attach ref to the username input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            {username && (
              <span
                type="button"
                onClick={() => setUsername("")}
                className="clear-btn"
              >
                x
              </span>
            )}
          </div>
        </div>

        {/* Password Input */}
        <div
          className="password mobile-number"
          onClick={() => handleDivClick(passwordRef)} // Focus password input when div is clicked
          style={{ cursor: "pointer" }}
        >
          <span>Password</span>
          <div className="input-box">
            <input
              ref={passwordRef} // Attach ref to the password input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {password && (
              <span
                type="button"
                onClick={() => setPassword("")}
                className="clear-btn"
              >
                x
              </span>
            )}
          </div>
        </div>

        {/* Remember Me and Forgot Password */}
        <div className="remember-and-forgot-password">
          <div className="remember">
            <input type="checkbox" id="remember-me" name="remember-me" />
            <label htmlFor="remember-me">Remember Me</label>
          </div>

          <div className="forgot-password">
            <a href="/forgot-password">Forgot Password?</a>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-button">
          <button className="submit-button" type="submit">
            Login
          </button>
        </div>

        {/* Error Message */}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string,
  setUsername: PropTypes.func,
  setPassword: PropTypes.func,
};

export default LoginForm;

// export default LoginForm;
// import { useState } from "react";
// import { useRef } from "react";
// import PropTypes from 'prop-types';
// import axios from "axios";
// import { useAppContext } from "../../ContextAPI/AppContext";

// const LoginForm = ( ) => {

//   const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const { login } = useAppContext();

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post(
//                 `${import.meta.env.VITE_API_URL}/token/`,
//                 { username, password },
//                 { withCredentials: true }, // Required for cookies
//             );

//             login(response.data.access);

//             // localStorage.setItem('refreshToken', response.data.refresh);
//         } catch (err) {
//             setError('Invalid credentials: ' , err.message);
//         }
//     };

//   const inputRef = useRef(null);

//   const handleDivClick = () => {
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   };

//   return (
//     <div >
//     <form onSubmit={handleLogin}>
//         <div
//           className="mobile-number"
//           onClick={handleDivClick} // Focus input when div is clicked
//         >
//           <span>Mobile Number</span>
//           <input
//             ref={inputRef} // Attach ref to the input
//             type="text"
//             style={{ marginLeft: "10px", padding: "5px" }}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </div>
//         <div className="Password mobile-number"   onClick={handleDivClick}>
//             <span>Password</span>
//             <input
//                 ref={inputRef}
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//             />
//         </div>

//         <div className="remember-and-forgot-password">
//             <div className="remember">
//                 <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
//                 <label htmlFor="vehicle1"> I have a bike</label>
//             </div>

//             <div className="forgot-password">
//                 <a href="">Forgot Password?</a>
//             </div>
//         </div>

//         <button className="submit-button" type="submit">Login</button>
//     </form>
//   </div>
//   );
// };

// LoginForm.propTypes = {
//   username: PropTypes.string.isRequired,
//   setUsername: PropTypes.string.isRequired,
// };

// export default LoginForm;

// import { useRef } from "react";
// import PropTypes from 'prop-types';

// const LoginForm = ({username, setUsername}) => {
//   const inputRef = useRef(null);

//   const handleDivClick = () => {
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   };

//   return (
//     <div
//     className="mobile-number"
//     onClick={handleDivClick} // Focus input when div is clicked
//   >
//     <span>Mobile Number</span>
//     <input
//       ref={inputRef} // Attach ref to the input
//       type="text"
//       style={{ marginLeft: "10px", padding: "5px" }}
//     />
//   </div>
//   );
// };

// LoginForm.propTypes = {
//   username: PropTypes.string.isRequired,
//   setUsername: PropTypes.string.isRequired,
// };

// export default LoginForm;
