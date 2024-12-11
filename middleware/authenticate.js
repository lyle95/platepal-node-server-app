import jwt from 'jsonwebtoken';
const secretKey = 'platepal';

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, secretKey); // Replace `JWT_SECRET` with your actual secret
    console.log("Decoded Token:", decoded);
    req.user = decoded; // Attach user data to `req.user`
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export default authenticate;
