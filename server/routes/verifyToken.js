//fetchProtectedData
const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token verification error:', err);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Access denied. Token expired.' });
            }
            return res.status(403).json({ message: 'Invalid token.' });
        }
        next(); // Pass control to the next middleware/route
    });
}


// async function verifyToken() {
//     const token = localStorage.getItem('token');
  
//     if (!token) {
//         alert('You are not logged in. Redirecting to login page.');
//         window.location.href = '/login.html'; // Redirect to login page
//         return;
//     }
  
//     try {
//         const response = await fetch('http://localhost:3000/auth/chat', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`, // Include the token
//             },
//         });
  
//         if (response.ok) {
//             // Token is valid, user can access the chat page
//             const data = await response.json();
//             console.log('Chat data:', data);
//             // Proceed to render the chat page
//         } else {
//             // Token invalid or expired
//             alert('Session expired or unauthorized access. Please log in again.');
//             window.location.href = 'login.html';
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred while accessing the chat page.');
//         window.location.href = 'login.html';
//     }
// }

module.exports = verifyToken;