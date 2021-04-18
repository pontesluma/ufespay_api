class UserController {
  setDependencies(userRepository, walletRepository){
    this.userRepository = userRepository;
    this.walletRepository = walletRepository;
  }

  async create(req, res) {
    try {
      const { name, email, password } = req.body;
  
      // check if email already exist
      const existentUser = await this.userRepository.findByEmail(email);
  
      if (existentUser) {
        return res.status(400).json({ message: 'E-mail already in use.'});
      }
  
      // create wallet
      const wallet = await this.walletRepository.create();
  
      // create user
      const user = await this.userRepository.create(name, email, password, wallet._id);
  
      return res.status(200).json({ user });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Something went wrong!' });
    }
  }

  async index(req, res) {
    try {
      const { userId } = req;
  
      const user = await this.userRepository.findById(userId);
  
      if (!user) {
        return res.status(400).json({ message: 'User do not exist.'});
      }
  
      return res.status(200).json({ user });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Something went wrong!' });
    }
  }

  async list(req, res) {
    try {
      const { userId } = req;

      const users = await this.userRepository.getOthers(userId);
  
      return res.status(200).json({ users });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Something went wrong!' });
    }
  }

  async update(req, res) {
    try {
      const { userId } = req;
      const { name, email, newPassword, password } = req.body;

      const user = await this.userRepository.findById(userId);

      if(newPassword && user.password !== password) {
        return res.status(400).json({ message: 'Wrong password.' });
      } 

      const newUserData = { name, email, password: newPassword };

      Object.keys(newUserData).forEach(key => {
        if (!newUserData[key]) delete newUserData[key];
      });

      const updatedUser = await this.userRepository.update(userId, newUserData);

      return res.status(200).json({ user: updatedUser });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Something went wrong!' });
    }
  }

  async delete(req, res) {
    try {
      const { userId } = req;

      // get user
      const user = await this.userRepository.findById(userId);

      if (!user) {
        return res.status(400).json({ message: 'User do not exist.'});
      }

      // delete wallet
      await this.walletRepository.delete(user.wallet);

      // delete user
      await this.userRepository.delete(user.email);

      return res.status(200).send();
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Something went wrong!' });
    }
  }
}

export default UserController;