import { useState, useEffect } from 'react';
import { NodeProvider, PersistedNode, Stats } from '../types';
import { useLocalStorage } from './useLocalStorage';

const API_URL = 'https://solver-testnet.lilypad.tech/api/v1/resource_offers?not_matched=true';

export const useNodeData = (refreshInterval: number = 30000) => {
  const [allSeenNodes, setAllSeenNodes] = useLocalStorage<PersistedNode[]>('all-seen-nodes', []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const updateNodesWithFreshData = (freshData: NodeProvider[]) => {
    const now = Date.now();
    const freshNodeIds = new Set(freshData.map(node => node.resource_provider));
    
    // Create a map of fresh data for quick lookup
    const freshDataMap = new Map(
      freshData.map(node => [node.resource_provider, node])
    );
    
    // Update existing nodes and mark online/offline status
    const updatedNodes = allSeenNodes.map(existingNode => {
      const freshNode = freshDataMap.get(existingNode.resource_provider);
      
      if (freshNode) {
        // Node is still online, update with fresh data
        return {
          ...freshNode,
          lastSeen: now,
          isCurrentlyOnline: true
        };
      } else {
        // Node is offline, keep existing data but mark as offline
        return {
          ...existingNode,
          isCurrentlyOnline: false
          // Don't update lastSeen - it should reflect when we last saw it online
        };
      }
    });
    
    // Add any new nodes that we haven't seen before
    const existingNodeIds = new Set(allSeenNodes.map(node => node.resource_provider));
    const newNodes = freshData
      .filter(node => !existingNodeIds.has(node.resource_provider))
      .map(node => ({
        ...node,
        lastSeen: now,
        isCurrentlyOnline: true
      }));
    
    // Combine updated existing nodes with new nodes
    const allNodes = [...updatedNodes, ...newNodes];
    
    setAllSeenNodes(allNodes);
    
    return allNodes;
  };

  const fetchNodes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: NodeProvider[] = await response.json();
      updateNodesWithFreshData(data);
      setLastUpdated(new Date());
    } catch (err) {
      let errorMessage = 'Failed to fetch data';
      
      if (err instanceof Error) {
        if (err.message === 'Failed to fetch' || err.message.includes('fetch')) {
          errorMessage = 'API service is temporarily unavailable. The service may be restarting or experiencing network issues. Please try again in a few moments.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      console.error('Failed to fetch nodes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
    
    // Refresh data based on selected interval
    const interval = setInterval(fetchNodes, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const calculateStats = (nodeList: PersistedNode[]): Stats => {
    const stats: Stats = {
      totalProviders: 0,
      totalGPUs: 0,
      totalVRAM: 0,
      totalCPU: 0,
      totalRAM: 0,
      totalDisk: 0,
      uniqueGPUModels: new Set(),
      onlineProviders: 0
    };

    const uniqueProviders = new Set<string>();

    nodeList.forEach(node => {
      const provider = node.resource_provider;
      if (!uniqueProviders.has(provider)) {
        uniqueProviders.add(provider);
        stats.totalProviders++;
        if (node.isCurrentlyOnline) {
          stats.onlineProviders++;
        }
      }

      const { spec } = node.resource_offer;
      stats.totalGPUs += spec.gpu;
      stats.totalCPU += spec.cpu;
      stats.totalRAM += spec.ram;
      stats.totalDisk += spec.disk;
      
      spec.gpus.forEach(gpu => {
        stats.totalVRAM += gpu.vram;
        stats.uniqueGPUModels.add(gpu.name);
      });
    });

    return stats;
  };

  return {
    nodes: allSeenNodes,
    loading,
    error,
    lastUpdated,
    refetch: fetchNodes,
    calculateStats
  };
};