import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';

dotenv.config();

const userSchema = new mongoose.Schema({
  firstName: String,
  email: String,
  isAdmin: Boolean,
});

const User = mongoose.model('User', userSchema);

const makeFirstUserAdmin = async () => {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Find the first user
    const user = await User.findOne({});
    if (user) {
      user.isAdmin = true;
      await user.save();
      console.log(`Successfully made ${user.email} an admin!`);
    } else {
      console.log('No users found in the database. Please sign up first.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

makeFirstUserAdmin();
