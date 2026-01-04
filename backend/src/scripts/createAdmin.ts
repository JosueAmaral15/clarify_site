import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Conectar ao MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/clarify_site';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB');

    // Verificar se já existe um admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Já existe um usuário admin:', existingAdmin.email);
      process.exit(0);
    }

    // Criar usuário admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@clarify.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminName = process.env.ADMIN_NAME || 'Admin Clarify';

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const adminUser = new User({
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: 'admin',
      isActive: true
    });

    await adminUser.save();

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Senha:', adminPassword);
    console.log('');
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error);
    process.exit(1);
  }
};

createAdminUser();
