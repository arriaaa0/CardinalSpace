const bcrypt = require('bcryptjs');
const fs = require('fs');

async function generateHashes() {
  const adminHash = await bcrypt.hash('admin123', 12);
  const userHash = await bcrypt.hash('user123', 12);
  
  console.log('Admin password hash:', adminHash);
  console.log('User password hash:', userHash);
  
  const adminId = require('crypto').randomUUID();
  const userId = require('crypto').randomUUID();
  
  const sql = `
INSERT INTO "User" (id, name, email, "password", role, "createdAt", "updatedAt") VALUES ('${adminId}', 'Admin User', 'admin@example.com', '${adminHash.replace(/'/g, "''")}', 'ADMIN', datetime('now'), datetime('now'));
INSERT INTO "User" (id, name, email, "password", role, "createdAt", "updatedAt") VALUES ('${userId}', 'Test User', 'user@example.com', '${userHash.replace(/'/g, "''")}', 'USER', datetime('now'), datetime('now'));
`;
  
  console.log('\nSQL to run:');
  console.log(sql);
}

generateHashes().catch(console.error);
