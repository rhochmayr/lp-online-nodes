import React from 'react';
import { PersistedNode } from '../types';
import { formatBytes, formatAddress, formatTimestamp } from '../utils/formatters';
import { Monitor, Cpu, MemoryStick, HardDrive, Clock, Circle } from 'lucide-react';

interface NodeCardProps {
  node: PersistedNode;
  isSelected: boolean;
  onToggleUserNode?: (resourceProvider: string) => void;
  isUserNode?: boolean;
}

const NodeCard: React.FC<NodeCardProps> = ({ node, isSelected, onToggleUserNode, isUserNode = false }) => {
  const { resource_offer } = node;
  const { spec } = resource_offer;
  const isOnline = node.isCurrentlyOnline;

  const totalVRAM = spec.gpus.reduce((sum, gpu) => sum + gpu.vram, 0);
  const uniqueGPUs = [...new Set(spec.gpus.map(gpu => gpu.name))];

  return (
    <div className={`relative bg-gray-900 border ${isUserNode ? 'border-blue-600' : 'border-gray-800'} rounded-lg p-4 hover:bg-gray-800 transition-colors duration-200`}>
      {isUserNode && (
        <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
          Your Node
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Circle className={`w-3 h-3 ${isOnline ? 'text-green-500 fill-current' : 'text-red-500 fill-current'}`} />
          <div>
            <h3 className="text-white font-medium text-sm">{formatAddress(resource_offer.resource_provider)}</h3>
            <p className="text-gray-500 text-xs">{isOnline ? 'Available' : 'Unavailable'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onToggleUserNode && (
            <button
              onClick={() => onToggleUserNode(node.resource_provider)}
              className={`p-1 rounded transition-colors duration-200 text-xs ${
                isUserNode 
                  ? 'text-blue-500 hover:text-blue-400' 
                  : 'text-gray-500 hover:text-gray-400'
              }`}
              title={isUserNode ? 'Remove from your nodes' : 'Mark as your node'}
            >
              {isUserNode ? 'Mine' : 'Mark'}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Monitor className="w-3 h-3 text-gray-500" />
            <div>
              <div className="text-white font-medium">{spec.gpu}</div>
              <div className="text-xs text-gray-500">GPUs</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MemoryStick className="w-3 h-3 text-gray-500" />
            <div>
              <div className="text-white font-medium">{formatBytes(totalVRAM * 1024 * 1024)}</div>
              <div className="text-xs text-gray-500">VRAM</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-gray-500" />
            <div>
              <div className="text-white font-medium">{(spec.cpu / 1000).toFixed(1)} GHz</div>
              <div className="text-xs text-gray-500">CPU</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MemoryStick className="w-3 h-3 text-gray-500" />
            <div>
              <div className="text-white font-medium">{formatBytes(spec.ram)}</div>
              <div className="text-xs text-gray-500">RAM</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-3">
          <div className="text-xs text-gray-400 mb-2">GPU Models:</div>
          <div className="space-y-1">
            {uniqueGPUs.map((gpu, index) => {
              const count = spec.gpus.filter(g => g.name === gpu).length;
              return (
                <div key={index} className="text-xs text-gray-500 flex justify-between">
                  <span>{gpu}</span>
                  <span>{count > 1 ? `x${count}` : ''}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Clock className="w-3 h-3" />
          <span>Last seen: {formatTimestamp(node.lastSeen)}</span>
        </div>
      </div>
    </div>
  );
};

export default NodeCard;