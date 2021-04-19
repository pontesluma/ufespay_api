import jwt from 'jsonwebtoken';

class SessionController {
  setDependencies(userRepository){
    this.userRepository = userRepository;
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;

      const user = await this.userRepository.findByEmail(email);

      if(!user) {
        return res.status(400).json({ message: 'Invalid email!' });
      }

      if(password !== user.password) {
        return res.status(400).json({ message: 'Wrong password!' });
      }
      
      const id = user._id;

      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 20 * 60,
      });

      return res.status(200).json({ token, user });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Something went wrong!' });
    }
  }

  async signOut(req, res) {
    res.status(200).json({ token: null });
  }
}

export default SessionController;