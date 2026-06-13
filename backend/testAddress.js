import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';
import User from './models/User.js';

dotenv.config();

const testAddress = async () => {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    await mongoose.connect(process.env.MONGODB_URI);
    
    const user = await User.findOne({});
    if (!user) {
      console.log('No user found');
      process.exit(1);
    }
    
    console.log('User found, saving address...');
    
    const address = {
      label: 'HOME',
      fullName: 'Super Admin',
      phone: '1234567890',
      email: 'admin@admin.com',
      street: '123 Main St',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      country: 'Country'
    };
    
    user.addresses.push(address);
    await user.save();
    
    console.log('Success!');
    process.exit(0);
  } catch (error) {
    console.error('Validation Error details:');
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`- ${key}: ${error.errors[key].message}`);
      });
    } else {
      console.error(error);
    }
    process.exit(1);
  }
};

testAddress();
