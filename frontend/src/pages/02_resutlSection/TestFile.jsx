
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../ContextAPI/AppContext';


const TestFile = () => {
    const [schoolData, setSchoolData] = useState(null);
    const { handleTokenExpiration } = useAppContext();
    // useEffect(() => {
    //     // Make an API call using axios 
    //     const apiUrl = `${import.meta.env.VITE_API_URL}/school-info/`; 
    //     axios.get(apiUrl)
    //         .then((response) => {
    //             setSchoolData(response.data);
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching data:', error);
    //         });
    // }, []);

    useEffect(() => {
        // const token = localStorage.getItem('access_token');
        
        const accessToken = localStorage.getItem('accessToken');
        // console.log('Token retrieved:', accessToken);  // Log the token to check
    
        if (accessToken) {
            const apiUrl = `${import.meta.env.VITE_API_URL}/school-info/`; 
            axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                // console.log('response.data:', response.data);
                setSchoolData(response.data);
            })
            .catch((error) => {
                // console.error('Error fetching data:', error);
                if (error.response.status === 401) {
                    handleTokenExpiration(setSchoolData, apiUrl);
                }
            });
        } else {
            console.log('No token found. User must be logged in');
        }
    }, []);
    

    if (!schoolData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{schoolData.school_name}</h1>
            <p>Location: {schoolData.location}</p>
            <p>Students: {schoolData.students}</p> 
        </div>
    );
};

export default TestFile;
