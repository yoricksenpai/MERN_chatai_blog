import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

const secret = "bj3behrj2o3ierbhj3j2no";

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, {}, (err, info) => {
      if (err) reject(err);
      resolve(info);
    });
  });
};

export const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const info = await verifyToken(token);
    const user = await UserModel.findById(info.id);
    
    if (!user) {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        path: '/'
      });
      return res.status(401).json({ message: 'User not found' });
    }

    // Rafraîchir le token
    const newToken = jwt.sign({ id: user._id }, secret, { expiresIn: '15d' });
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
      maxAge: 15 * 24 * 60 * 60 * 1000 // 15 jours
    });

    // Inclure l'email dans les informations utilisateur
    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      isAuthorized: user.isAuthorized
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/'
    });
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authorMiddleware = (req, res, next) => {
  if (!req.user?.isAuthorized) {
    return res.status(403).json({ message: 'Author access required' });
  }
  next();
};

export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};