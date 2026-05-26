const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('📝 Tentativa de login:', { username, passwordLength: password?.length });

    // Validação
    if (!username || !password) {
      console.log('❌ Login falhou: campos vazios');
      return res.status(400).json({
        success: false,
        message: 'Usuário e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const user = await User.findOne({ username });
    if (!user) {
      console.log('❌ Login falhou: usuário não encontrado:', username);
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    console.log('✅ Usuário encontrado:', username);

    // Verificar senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Login falhou: senha incorreta');
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    console.log('✅ Senha correta, gerando token...');

    // Atualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'vps-guardian-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ Login bem-sucedido:', username);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login'
    });
  }
});

// Verificar token (para manter sessão)
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar token'
    });
  }
});

// Trocar senha
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validação
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Senha atual e nova senha são obrigatórias'
      });
    }

    if (newPassword.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'A nova senha deve ter no mínimo 3 caracteres'
      });
    }

    // Buscar usuário
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar senha atual
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }

    // Atualizar senha
    await user.updatePassword(newPassword);

    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao trocar senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao trocar senha'
    });
  }
});

// Atualizar perfil (usuário e email)
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se username já existe (se diferente do atual)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Nome de usuário já está em uso'
        });
      }
      user.username = username;
    }

    if (email !== undefined) {
      user.email = email;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar perfil'
    });
  }
});

module.exports = router;
