import { useState, useEffect } from 'react';
import { Archive, Trash2, Download } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function Backups() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      const { data } = await api.get('/backups');
      setBackups(data.backups || []);
      setLoading(false);
    } catch (error) {
      toast.error('Erro ao carregar backups');
      setLoading(false);
    }
  };

  const createBackup = async () => {
    try {
      toast.loading('Criando backup...');
      await api.post('/backups/create');
      toast.success('Backup criado com sucesso!');
      fetchBackups();
    } catch (error) {
      toast.error('Erro ao criar backup');
    }
  };

  const deleteBackup = async (filename) => {
    if (!confirm('Tem certeza que deseja deletar este backup?')) return;
    try {
      await api.delete(`/backups/${filename}`);
      toast.success('Backup deletado!');
      fetchBackups();
    } catch (error) {
      toast.error('Erro ao deletar backup');
    }
  };

  if (loading) return <div className="text-white">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Backups</h1>
        <button
          onClick={createBackup}
          className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-sky-500/50"
        >
          Criar Backup
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="text-sky-400 text-sm font-medium mb-2">Total de Backups</div>
          <div className="text-3xl font-bold text-white">{backups.length}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="text-sky-400 text-sm font-medium mb-2">Retenção</div>
          <div className="text-3xl font-bold text-white">6 backups</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="text-sky-400 text-sm font-medium mb-2">Horário</div>
          <div className="text-3xl font-bold text-white">01:00</div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="text-left p-4 text-slate-400 font-medium">Arquivo</th>
              <th className="text-left p-4 text-slate-400 font-medium">Tamanho</th>
              <th className="text-left p-4 text-slate-400 font-medium">Data</th>
              <th className="text-right p-4 text-slate-400 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {backups.map((backup, idx) => (
              <tr key={idx} className="border-t border-slate-700/50 hover:bg-slate-700/20">
                <td className="p-4 text-white font-mono text-sm">{backup.filename}</td>
                <td className="p-4 text-slate-400">{backup.size}</td>
                <td className="p-4 text-slate-400">{backup.date}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => deleteBackup(backup.filename)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
