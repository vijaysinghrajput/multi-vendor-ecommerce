const { DataSource } = require('typeorm');
const { User } = require('./dist/modules/users/entities/user.entity');

// Database configuration
const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'mac',
  password: '',
  database: 'multi_vendor_ecommerce',
  entities: [User],
  synchronize: false,
});

async function debugUser() {
  try {
    await dataSource.initialize();
    console.log('Database connected');
    
    const userRepository = dataSource.getRepository(User);
    
    // Find user with password field
    const user = await userRepository.findOne({
      where: { email: 'admin@example.com' },
      select: ['id', 'email', 'password', 'firstName', 'lastName', 'role', 'status', 'loginAttempts', 'lockedUntil'],
    });
    
    console.log('User found:', !!user);
    if (user) {
      console.log('User ID:', user.id);
      console.log('User email:', user.email);
      console.log('User password field:', user.password);
      console.log('User password type:', typeof user.password);
      console.log('User password length:', user.password ? user.password.length : 'null');
      console.log('User role:', user.role);
      console.log('User status:', user.status);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await dataSource.destroy();
  }
}

debugUser();