import { useState, useEffect } from 'react';
import { Play, Square, RotateCw, Search } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Containers() {
  const [containers, setContainers] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContainers();
    const interval = setInterval(fetchContainers, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchContainers = async () => {
    try {
      const { data } = await api.get('/containers');
      setContainers(data.containers || []);
      setLoading(false);
    } catch (error) {
      toast.error('Erro ao carregar containers');
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.post(`/containers/${id}/${action}`);
      toast.success(`Container ${action === 'start' ? 'iniciado' : action === 'stop' ? 'parado' : 'reiniciado'}!`);
      fetchContainers();
    } catch (error) {
      toast.error(`Erro ao ${action} container`);
    }
  };

  const filtered = containers.filter(c => 
    c.name?.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <div className="text-white">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Containers</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar containers..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((container) => (
          <div key={container.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-sky-500/10 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{container.name}</h3>
                <p className="text-sm text-slate-400">{container.image}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                container.state === 'running' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {container.state}
              </span>
            </div>

            <div className="flex gap-2">
              {container.state === 'running' ? (
                <>
                  <button
                    onClick={() => handleAction(container.id, 'stop')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  >
                    <Square className="w-4 h-4" />
                    Stop
                  </button>
                  <button
                    onClick={() => handleAction(container.id, 'restart')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-colors"
                  >
                    <RotateCw className="w-4 h-4" />
                    Restart
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleAction(container.id, 'start')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Start
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
