import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Simple login route for testing
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // For now, accept any email/password for testing
    // TODO: Replace with real database user lookup
    const mockUser = {
      id: 1,
      email: email // Use whatever email they send
    };

    // Create JWT token
    const token = jwt.sign(
      { id: mockUser.id, email: mockUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: mockUser.id,
        email: mockUser.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;