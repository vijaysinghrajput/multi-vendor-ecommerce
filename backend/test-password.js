const bcrypt = require('bcrypt');

const storedHash = '$2b$12$LQv3c1yqBw2fyuDsBpD9v.gPy8Vx8DIyrXCS8XjqMtkOBmxWoitGy';
const password = 'admin123';

console.log('Testing password comparison...');
console.log('Password:', password);
console.log('Stored hash:', storedHash);

bcrypt.compare(password, storedHash)
  .then(result => {
    console.log('Password match result:', result);
    if (result) {
      console.log('✅ Password matches!');
    } else {
      console.log('❌ Password does not match!');
    }
  })
  .catch(error => {
    console.error('Error comparing password:', error);
  });