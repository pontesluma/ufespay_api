import UserRepository from '../database/repositories/UserRepository.js';

import jwt from 'jsonwebtoken';

class SessionController {
  async signIn(req, res) {
    const { email, password } = req.body;

    const userRepository = new UserRepository();

    const user = await userRepository.findByEmail(email);

    if(!user) {
      return res.status(400).json({ message: 'Invalid email!' });
    }

    if(password !== user.password) {
      return res.status(400).json({ message: 'Wrong password!' });
    }
    
    const id = user._id;

    const token = jwt.sign({ id }, 'secret', {
      expiresIn: 20 * 60,
    });

    return res.status(200).json({ token, user });
  }

  async signOut(req, res) {
    res.status(200).json({ token: null });
  }
}

export default SessionController;