import { db } from './src/config/db';
import { user } from './src/models/user';
import { eq } from 'drizzle-orm';

const makeAdmin = async () => {
  try {
    const [updatedUser] = await db
      .update(user)
      .set({ role: 'admin' })
      .where(eq(user.email, 'wilsonzim566@gmail.com'))
      .returning({ email: user.email, role: user.role });

    if (updatedUser) {
      console.log(`✅ User ${updatedUser.email} is now admin`);
    } else {
      console.log('❌ User not found. Please register first.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
};

makeAdmin();