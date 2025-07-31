const bcrypt = require('bcrypt');

const password = 'admin123';
const saltRounds = 12;

console.log('Generating new hash for password:', password);

bcrypt.hash(password, saltRounds)
  .then(hash => {
    console.log('New hash:', hash);
    
    // Test the new hash
    return bcrypt.compare(password, hash);
  })
  .then(result => {
    console.log('New hash verification:', result ? '✅ Success' : '❌ Failed');
  })
  .catch(error => {
    console.error('Error:', error);
  });