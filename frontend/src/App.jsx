import { useState, useEffect } from 'react'
import { Shield, Activity, Database, Settings, LayoutDashboard } from 'lucide-react'

function App() {
  const [data, setData] = useState({ containers: [], metrics: { cpu: 0, ram: 0, disk: 0 } })
  const API_KEY = 'vps-guardian-secret-key'; // In production, this should come from process.env

  useEffect(() => {
    fetch('/api/dashboard', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    })
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-xl">
          <Shield size={28} />
          <span>VPS Guardian</span>
        </div>
        <nav className="flex flex-col gap-2">
          <button className="flex items-center gap-3 p-3 rounded-lg bg-blue-600/20 text-blue-400">
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors">
            <Activity size={20} /> Containers
          </button>
          <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors">
            <Database size={20} /> Backups
          </button>
          <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors">
            <Settings size={20} /> Configurações
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-400">Visão geral do seu servidor VPS</p>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400">Uso de CPU</span>
              <Activity className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold">{data.metrics.cpu}%</div>
            <div className="w-full bg-slate-700 h-2 rounded-full mt-4">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${data.metrics.cpu}%` }}></div>
            </div>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400">Memória RAM</span>
              <Database className="text-emerald-500" />
            </div>
            <div className="text-3xl font-bold">{data.metrics.ram}%</div>
            <div className="w-full bg-slate-700 h-2 rounded-full mt-4">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${data.metrics.ram}%` }}></div>
            </div>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400">Disco</span>
              <Database className="text-purple-500" />
            </div>
            <div className="text-3xl font-bold">{data.metrics.disk}%</div>
            <div className="w-full bg-slate-700 h-2 rounded-full mt-4">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${data.metrics.disk}%` }}></div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
          <div className="bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity size={32} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Nenhum container detectado</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            A estrutura base do VPS Guardian foi instalada. Configure seu arquivo .env e carregue sua lógica de negócio para começar a monitorar.
          </p>
        </div>
      </main>
    </div>
  )
}

export default App
