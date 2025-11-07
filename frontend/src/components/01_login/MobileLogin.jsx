// import React, { useState } from 'react'; 


import './sass/index.scss';
import logo from '../../assets/images/eduSyncLogo.svg'

import LoginForm from './LoginForm'


const MobileLogin = ( ) => { 

    return (
    // <div className="login-container ">
    <div className="login-container mobile-login">
        <div className="login-left">
            <div className="login-left-content">
                <div className="edusync-logo">
                    <img src={logo} alt="image" />
                    <div className="logo-text">
                        EduSync
                    </div>
                </div>
                <div className="welcome">
                    <h1> Welcome Back!</h1>
                </div>
                <div className="login-instruction">
                    <h2> Please Log in to your account.</h2>
                </div>
                <div className="login-form">
                    <LoginForm /> 
                </div>

                

                
            </div>
            {/* <div className="copy-right">
                © 2019–2025 NexaSofts. All Rights Reserved.
            </div> */}
        </div> 
        {/* <div className="copy-right">
            © 2019–2025 <a href=""> NexaSofts </a>. All Rights Reserved.
        </div> */}
    </div>
            
    );

};

export default MobileLogin;
