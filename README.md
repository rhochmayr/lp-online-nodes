# GPU Node Provider Dashboard

A real-time dashboard for monitoring GPU node providers on the Lilypad Testnet. This application provides comprehensive insights into available compute resources, allowing users to track and manage GPU nodes across the network.

## Features

### 🔄 Real-time Monitoring
- **Live Data Updates**: Automatic refresh every 5s-5m (configurable)
- **Visual Progress Bar**: Shows countdown to next refresh
- **Online/Offline Status**: Real-time availability tracking
- **Persistent History**: Maintains records of all seen nodes

### 📊 Comprehensive Statistics
- Total and online provider counts
- GPU inventory (count, models, VRAM)
- CPU, RAM, and disk resources
- Separate stats for selected nodes

### 🎯 Node Management
- **Mark Your Nodes**: Identify and track your own providers
- **Smart Filtering**: Search by provider address or GPU model
- **Availability Filter**: Show only currently online nodes
- **Persistent Selection**: Your preferences survive page reloads

### 💾 Data Persistence
- **Local Storage**: All selections and node history saved locally
- **Offline Tracking**: Maintains records of previously seen nodes
- **Auto-selection**: Your marked nodes are automatically selected

### 🎨 Modern UI
- **Dark Theme**: Easy on the eyes for extended monitoring
- **Responsive Design**: Works on desktop and mobile
- **Real-time Indicators**: Visual status indicators and progress bars
- **Intuitive Layout**: Clean, organized interface

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Data Source**: Lilypad Testnet API

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lp-online-nodes
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

### Monitoring Nodes
- The dashboard automatically loads and refreshes node data
- Use the refresh interval dropdown to adjust update frequency
- Toggle "Available Only" to filter out offline nodes
- Search for specific providers or GPU models

### Managing Your Nodes
1. **Mark Nodes**: Click "Mark" on any node to add it to your collection
2. **Your Nodes Section**: Marked nodes appear in a dedicated section
3. **Auto-selection**: Your nodes are automatically selected for statistics
4. **Persistent**: Your selections survive page reloads and refreshes

### Understanding the Data

#### Node Information
- **Provider Address**: Truncated blockchain address
- **Status**: Green (online) or Red (offline) indicator
- **GPU Count**: Number of available GPUs
- **VRAM**: Total video memory across all GPUs
- **CPU/RAM/Disk**: Additional compute resources
- **Last Seen**: Timestamp of last availability

#### Statistics Grid
- **Total/Selected**: Shows network totals vs your selected nodes
- **Real-time Updates**: Statistics update with each refresh
- **Resource Breakdown**: Detailed breakdown of all resource types

## API Integration

The dashboard connects to the Lilypad Testnet API:
```
https://solver-testnet.lilypad.tech/api/v1/resource_offers?not_matched=true
```

### Error Handling
- **Service Downtime**: Graceful handling of API unavailability
- **Network Issues**: Automatic retry suggestions
- **Data Validation**: Robust error handling for malformed responses

## Data Storage

All data is stored locally in your browser:
- `selected-nodes`: Currently selected node IDs
- `user-nodes`: Your marked provider addresses  
- `all-seen-nodes`: Complete history of observed nodes

## Development

### Project Structure
```
src/
├── components/          # React components
│   ├── NodeCard.tsx    # Individual node display
│   ├── StatsGrid.tsx   # Statistics overview
│   └── LoadingSpinner.tsx
├── hooks/              # Custom React hooks
│   ├── useNodeData.ts  # API data management
│   └── useLocalStorage.ts # Persistent storage
├── utils/              # Utility functions
│   └── formatters.ts   # Data formatting helpers
├── types.ts            # TypeScript definitions
└── App.tsx             # Main application component
```

### Key Components

- **useNodeData**: Manages API calls, data persistence, and statistics
- **useLocalStorage**: Provides persistent state management
- **NodeCard**: Displays individual node information and controls
- **StatsGrid**: Shows aggregate statistics for all/selected nodes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
- Check the browser console for detailed error messages
- Verify API availability at the Lilypad endpoint
- Ensure localStorage is enabled in your browser