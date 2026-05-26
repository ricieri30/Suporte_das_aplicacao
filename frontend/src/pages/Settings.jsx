import { useState } from 'react';
import { Save, Key } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Settings() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    if (passwords.newPassword.length < 3) {
      toast.error('Nova senha deve ter pelo menos 3 caracteres');
      return;
    }

    try {
      await api.post('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success('Senha alterada com sucesso!');
      setShowPasswordModal(false);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao alterar senha');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Configurações</h1>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Segurança</h2>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-sky-500/50"
        >
          <Key className="w-5 h-5" />
          Trocar Senha
        </button>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Backup</h2>
        <div className="space-y-4 text-slate-300">
          <div className="flex justify-between">
            <span>Retenção máxima:</span>
            <span className="font-semibold text-white">6 backups</span>
          </div>
          <div className="flex justify-between">
            <span>Horário diário:</span>
            <span className="font-semibold text-white">01:00</span>
          </div>
          <div className="flex justify-between">
            <span>Limpeza automática:</span>
            <span className="font-semibold text-green-400">Ativa</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Monitoramento</h2>
        <div className="space-y-4 text-slate-300">
          <div className="flex justify-between">
            <span>Threshold CPU:</span>
            <span className="font-semibold text-white">90%</span>
          </div>
          <div className="flex justify-between">
            <span>Threshold RAM:</span>
            <span className="font-semibold text-white">90%</span>
          </div>
          <div className="flex justify-between">
            <span>Threshold Disco:</span>
            <span className="font-semibold text-white">85%</span>
          </div>
        </div>
      </div>

      {/* Modal Trocar Senha */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Trocar Senha</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Senha Atual</label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Nova Senha</label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Confirmar Nova Senha</label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleChangePassword}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
