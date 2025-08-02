import React from 'react';
import { Stats } from '../types';
import { formatBytes, formatNumber } from '../utils/formatters';
import { Activity, Cpu, HardDrive, MemoryStick, Monitor, Users } from 'lucide-react';

interface StatsGridProps {
  stats: Stats;
  selectedStats: Stats;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats, selectedStats }) => {
  const statItems = [
    {
      label: 'Total Providers',
      value: formatNumber(stats.totalProviders),
      selected: formatNumber(selectedStats.totalProviders),
      icon: Users,
    },
    {
      label: 'Online Providers',
      value: formatNumber(stats.onlineProviders),
      selected: formatNumber(selectedStats.onlineProviders),
      icon: Activity,
    },
    {
      label: 'Total GPUs',
      value: formatNumber(stats.totalGPUs),
      selected: formatNumber(selectedStats.totalGPUs),
      icon: Monitor,
    },
    {
      label: 'GPU Models',
      value: formatNumber(stats.uniqueGPUModels.size),
      selected: formatNumber(selectedStats.uniqueGPUModels.size),
      icon: Monitor,
    },
    {
      label: 'Total VRAM',
      value: formatBytes(stats.totalVRAM * 1024 * 1024),
      selected: formatBytes(selectedStats.totalVRAM * 1024 * 1024),
      icon: MemoryStick,
    },
    {
      label: 'Total CPU',
      value: `${formatNumber(stats.totalCPU / 1000)} GHz`,
      selected: `${formatNumber(selectedStats.totalCPU / 1000)} GHz`,
      icon: Cpu,
    },
    {
      label: 'Total RAM',
      value: formatBytes(stats.totalRAM),
      selected: formatBytes(selectedStats.totalRAM),
      icon: MemoryStick,
    },
    {
      label: 'Total Disk',
      value: formatBytes(stats.totalDisk),
      selected: formatBytes(selectedStats.totalDisk),
      icon: HardDrive,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:bg-gray-800 transition-colors duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded bg-gray-800">
                <Icon className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Selected</div>
                <div className="text-sm font-medium text-gray-300">{item.selected}</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500">{item.label}</div>
              <div className="text-lg font-semibold text-white">{item.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;