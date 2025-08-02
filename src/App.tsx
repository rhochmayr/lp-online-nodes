import React, { useMemo, useState } from 'react';
import { useNodeData } from './hooks/useNodeData';
import { useLocalStorage } from './hooks/useLocalStorage';
import StatsGrid from './components/StatsGrid';
import NodeCard from './components/NodeCard';
import LoadingSpinner from './components/LoadingSpinner';
import { PersistedNode } from './types';
import { RefreshCw, Search, Activity, AlertCircle, ChevronDown } from 'lucide-react';

function App() {
  const [refreshInterval, setRefreshInterval] = useState(30000);
  const { nodes, loading, error, lastUpdated, refetch, calculateStats } = useNodeData(refreshInterval);
  const [selectedNodes, setSelectedNodes] = useLocalStorage<string[]>('selected-nodes', []);
  const [userNodes, setUserNodes] = useLocalStorage<string[]>('user-nodes', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState(0);

  // Progress bar countdown effect
  React.useEffect(() => {
    if (loading) {
      setRefreshProgress(0);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / refreshInterval) * 100, 100);
      setRefreshProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [refreshInterval, lastUpdated, loading]);
  // Auto-select user nodes when nodes load
  React.useEffect(() => {
    if (nodes.length > 0 && userNodes.length > 0 && !loading) {
      const userNodeIds = nodes
        .filter(node => userNodes.includes(node.resource_provider))
        .map(node => node.id);
      
      // Only update if there are new user nodes to select
      const currentlySelected = new Set(selectedNodes);
      const newUserNodes = userNodeIds.filter(id => !currentlySelected.has(id));
      
      if (newUserNodes.length > 0) {
        setSelectedNodes(prev => [...new Set([...prev, ...newUserNodes])]);
      }
    }
  }, [nodes, userNodes, selectedNodes, loading]);

  const refreshOptions = [
    { value: 5000, label: '5s' },
    { value: 15000, label: '15s' },
    { value: 30000, label: '30s' },
    { value: 60000, label: '1m' },
    { value: 300000, label: '5m' }
  ];

  const filteredNodes = useMemo(() => {
    const filtered = nodes.filter(node => {
      const matchesSearch = node.resource_provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          node.resource_offer.spec.gpus.some(gpu => 
                            gpu.name.toLowerCase().includes(searchTerm.toLowerCase())
                          );
      const matchesStatus = !showOnlineOnly || node.isCurrentlyOnline;
      return matchesSearch && matchesStatus;
    });
    
    // Sort by online status first, then by resource provider
    return filtered.sort((a, b) => {
      if (a.isCurrentlyOnline !== b.isCurrentlyOnline) {
        return a.isCurrentlyOnline ? -1 : 1;
      }
      return a.resource_provider.localeCompare(b.resource_provider);
    });
  }, [nodes, searchTerm, showOnlineOnly]);

  const selectedNodeData = useMemo(() => {
    return nodes.filter(node => selectedNodes.includes(node.id));
  }, [nodes, selectedNodes]);

  const allStats = useMemo(() => calculateStats(filteredNodes), [filteredNodes, calculateStats]);
  const selectedStats = useMemo(() => calculateStats(selectedNodeData), [selectedNodeData, calculateStats]);

  const userNodeData = useMemo(() => {
    const userNodesFiltered = filteredNodes.filter(node => userNodes.includes(node.resource_provider));
    
    // Sort user nodes: online first, then offline
    return userNodesFiltered.sort((a, b) => {
      if (a.isCurrentlyOnline !== b.isCurrentlyOnline) {
        return a.isCurrentlyOnline ? -1 : 1;
      }
      return a.resource_provider.localeCompare(b.resource_provider);
    });
  }, [filteredNodes, userNodes]);

  const otherNodes = useMemo(() => {
    const otherNodesFiltered = filteredNodes.filter(node => !userNodes.includes(node.resource_provider));
    
    // Sort other nodes: online first, then offline
    return otherNodesFiltered.sort((a, b) => {
      if (a.isCurrentlyOnline !== b.isCurrentlyOnline) {
        return a.isCurrentlyOnline ? -1 : 1;
      }
      return a.resource_provider.localeCompare(b.resource_provider);
    });
  }, [filteredNodes, userNodes]);


  const toggleUserNode = (resourceProvider: string) => {
    setUserNodes(prev => 
      prev.includes(resourceProvider)
        ? prev.filter(rp => rp !== resourceProvider)
        : [...prev, resourceProvider]
    );
    
    // Auto-select/deselect all nodes from this resource provider
    const providerNodes = nodes.filter(node => node.resource_provider === resourceProvider);
    if (userNodes.includes(resourceProvider)) {
      // Removing from user nodes, deselect all nodes from this provider
      setSelectedNodes(prev => prev.filter(nodeId => !providerNodes.some(node => node.id === nodeId)));
    } else {
      // Adding to user nodes, select all nodes from this provider
      const providerNodeIds = providerNodes.map(node => node.id);
      setSelectedNodes(prev => [...new Set([...prev, ...providerNodeIds])]);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                GPU Node Dashboard
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Lilypad Testnet Resource Providers
                {lastUpdated && (
                  <span className="ml-2 text-xs">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search providers or GPUs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:border-gray-600 outline-none transition-colors duration-200"
                />
              </div>
              
              <div className="relative">
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-gray-600 outline-none appearance-none pr-8"
                >
                  {refreshOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
              </div>
              
              <button
                onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors duration-200 ${
                  showOnlineOnly 
                    ? 'bg-green-900 text-green-400 border border-green-700' 
                    : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
                }`}
              >
                <Activity className="w-4 h-4" />
                Available Only
              </button>
              
              <button
                onClick={refetch}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-gray-400 border border-gray-700 rounded hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Progress Bar */}
      <div className="w-full h-0.5 bg-gray-800 relative overflow-hidden">
        <div 
          className="h-full bg-green-500 transition-all duration-100 ease-linear"
          style={{ width: `${refreshProgress}%` }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">Error loading data: {error}</span>
            <button
              onClick={refetch}
              className="ml-auto px-3 py-1 bg-red-800 text-red-400 border border-red-700 rounded hover:bg-red-700 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <StatsGrid stats={allStats} selectedStats={selectedStats} />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-8">
            {/* User Nodes Section */}
            {userNodeData.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-semibold text-white">Your Nodes</h2>
                  <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
                    {userNodeData.length}
                  </div>
                </div>
                <div className="space-y-3">
                  {userNodeData.map((node) => (
                    <NodeCard
                      key={node.id}
                      node={node}
                      isSelected={selectedNodes.includes(node.id)}
                      onToggleUserNode={toggleUserNode}
                      isUserNode={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Other Nodes */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-white">
                    {userNodeData.length > 0 ? 'Other Available Nodes' : 'Available Nodes'}
                  </h2>
                  <div className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded font-medium">
                    {otherNodes.length}
                  </div>
                </div>
                
                {otherNodes.length > 0 && (
                  <div className="text-sm text-gray-500">
                    Click "Mark" to add nodes to your collection
                  </div>
                )}
              </div>

              {otherNodes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500">No nodes found matching your criteria</div>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setShowOnlineOnly(false);
                    }}
                    className="mt-4 px-4 py-2 bg-gray-800 text-gray-400 rounded hover:bg-gray-700 transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {otherNodes.map((node) => (
                    <NodeCard
                      key={node.id}
                      node={node}
                      isSelected={selectedNodes.includes(node.id)}
                      onToggleUserNode={toggleUserNode}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;