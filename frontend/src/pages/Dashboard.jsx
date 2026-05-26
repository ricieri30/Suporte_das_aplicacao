import { useState, useEffect } from 'react';
import { Shield, LogOut, Container, Database, Settings, RefreshCw, Play, Square, RotateCw, Trash2, Download, Upload, Key, User } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { format } from 'date-fns';

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('containers');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const { data: dashData } = await api.get('/dashboard');
      setData(dashData.data);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    }
  };

  const containerAction = async (id, action) => {
    setLoading(true);
    try {
      await api.post(`/containers/${id}/${action}`);
      toast.success(`Container ${action === 'start' ? 'iniciado' : action === 'stop' ? 'parado' : 'reiniciado'}!`);
      fetchData();
    } catch (error) {
      toast.error('Erro ao executar ação');
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    setLoading(true);
    try {
      await api.post('/backups');
      toast.success('Backup criado com sucesso!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao criar backup');
    } finally {
      setLoading(false);
    }
  };

  const deleteBackup = async (name) => {
    if (!confirm('Deseja realmente deletar este backup?')) return;
    try {
      await api.delete(`/backups/${name}`);
      toast.success('Backup deletado!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao deletar backup');
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-700/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-primary-500" />
              <h1 className="text-2xl font-bold">VPS Guardian</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={fetchData} className="btn-secondary">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button onClick={onLogout} className="btn-secondary">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {[
            { id: 'containers', label: 'Containers', icon: Container },
            { id: 'backups', label: 'Backups', icon: Database },
            { id: 'settings', label: 'Configurações', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Containers Tab */}
        {activeTab === 'containers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card">
                <div className="text-sm text-gray-400">Total de Containers</div>
                <div className="text-3xl font-bold text-primary-500">{data.containers.total}</div>
              </div>
              <div className="card">
                <div className="text-sm text-gray-400">Em Execução</div>
                <div className="text-3xl font-bold text-green-500">{data.containers.running}</div>
              </div>
              <div className="card">
                <div className="text-sm text-gray-400">Parados</div>
                <div className="text-3xl font-bold text-red-500">{data.containers.stopped}</div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Lista de Containers</h3>
              <div className="space-y-3">
                {data.containers.list.map(container => (
                  <div key={container.id} className="bg-gray-700/30 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${container.state === 'running' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="font-medium">{container.name}</span>
                        <span className="text-sm text-gray-400">{container.image}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{container.status}</div>
                    </div>
                    <div className="flex space-x-2">
                      {container.state === 'running' ? (
                        <>
                          <button onClick={() => containerAction(container.id, 'restart')} className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors" disabled={loading}>
                            <RotateCw className="w-4 h-4" />
                          </button>
                          <button onClick={() => containerAction(container.id, 'stop')} className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors" disabled={loading}>
                            <Square className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => containerAction(container.id, 'start')} className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors" disabled={loading}>
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Backups Tab */}
        {activeTab === 'backups' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Backups</h2>
              <button onClick={createBackup} className="btn-primary flex items-center space-x-2" disabled={loading}>
                <Upload className="w-4 h-4" />
                <span>Criar Backup</span>
              </button>
            </div>

            <div className="card">
              <div className="space-y-3">
                {data.backups.list.map(backup => (
                  <div key={backup.name} className="bg-gray-700/30 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{backup.name}</div>
                      <div className="text-sm text-gray-400">
                        {format(new Date(backup.created), 'dd/MM/yyyy HH:mm')} • {(backup.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <button onClick={() => deleteBackup(backup.name)} className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {data.backups.list.length === 0 && (
                  <div className="text-center text-gray-400 py-8">Nenhum backup encontrado</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Configurações</h2>
            
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Segurança</h3>
              <button onClick={() => setShowPasswordModal(true)} className="btn-primary flex items-center space-x-2">
                <Key className="w-4 h-4" />
                <span>Trocar Senha</span>
              </button>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Métricas do Sistema</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">CPU</div>
                  <div className="text-2xl font-bold text-primary-500">{data.system.cpu.usage}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Memória</div>
                  <div className="text-2xl font-bold text-primary-500">{data.system.memory.percent}%</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password Modal */}
      {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} />}
    </div>
  );
}

function PasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      toast.success('Senha alterada com sucesso!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao trocar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Trocar Senha</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Senha Atual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nova Senha</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input w-full"
              required
              minLength={3}
            />
          </div>
          <div className="flex space-x-3">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
