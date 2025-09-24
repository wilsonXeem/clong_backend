import { db } from './src/config/db.js';
import { user } from './src/models/user.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const [newUser] = await db
      .insert(user)
      .values({
        email: 'admin@gmail.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      })
      .returning({ email: user.email, role: user.role });

    console.log(`✅ Admin account created: ${newUser.email} with role: ${newUser.role}`);
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
};

createAdmin();