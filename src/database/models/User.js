import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
  deleted_at: { type: Date, default: undefined },
});

const User = mongoose.model('User', UserSchema);

export default User;