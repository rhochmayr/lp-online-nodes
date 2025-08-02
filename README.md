# GPU Node Provider Dashboard

A real-time dashboard for monitoring GPU node providers on the Lilypad Testnet. This application provides comprehensive insights into available compute resources, allowing users to track and manage GPU nodes across the network.

## Table of Contents

- [Screenshots](#screenshots)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Docker Deployment](#docker-deployment)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Screenshots

*Screenshots will be added here to showcase the dashboard interface*

## Features

- **Real-time Monitoring**: Live data updates with configurable refresh intervals (5s-5m)
- **Node Management**: Mark and track your own providers with persistent selection
- **Smart Filtering**: Search by provider address or GPU model, filter by availability
- **Comprehensive Statistics**: GPU inventory, VRAM, CPU, RAM, and disk resources
- **Data Persistence**: All selections and node history saved locally
- **Modern UI**: Dark theme, responsive design, real-time indicators

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

- **Monitor Nodes**: Dashboard auto-refreshes with configurable intervals, filter by availability or search terms
- **Manage Your Nodes**: Click "Mark" to add nodes to your collection, which appear in a dedicated section
- **View Statistics**: Compare network totals vs your selected nodes with real-time resource breakdowns

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

## Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- (Optional) Cloudflare account for tunnel setup

### Quick Start

1. **Copy the environment template**:
```bash
cp .env.example .env
```

2. **Start the application**:
```bash
# Local only
docker-compose up --build

# With Cloudflare Tunnel (uncomment COMPOSE_PROFILES=tunnel in .env)
docker-compose up --build
```

3. **Access the application**:
   - Open your browser to `http://localhost:3000`

4. **Stop the application**:
```bash
docker-compose down
```

### Using Docker Compose directly

```bash
# Local only
docker-compose up --build

# With Cloudflare Tunnel
COMPOSE_PROFILES=tunnel docker-compose up --build
```

### Cloudflare Tunnel Setup

#### Step 1: Create a Cloudflare Tunnel

1. **Set up the tunnel**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Zero Trust** > **Access** > **Tunnels**
   - Click **Create a tunnel**
   - Choose **Cloudflared** and give your tunnel a name
   - Save the tunnel

2. **Get your tunnel token**:
   - In the tunnel configuration, you'll see a command like:
     ```bash
     cloudflared service install eyJhIjoiX...
     ```
   - Copy the token (the long string after `install`)

3. **Configure your tunnel**:
   - In the **Public Hostnames** tab, add a route:
     - **Subdomain**: `gpu-dashboard` (or your preferred subdomain)
     - **Domain**: Your domain registered with Cloudflare
     - **Service**: `http://gpu-dashboard:80`
   - Save the configuration

#### Step 2: Enable the Tunnel

1. **Edit your `.env` file**:
```bash
# Replace with your actual tunnel token
TUNNEL_TOKEN=eyJhIjoiX...your_actual_token_here

# Optional: Enable the tunnel profile
COMPOSE_PROFILES=tunnel
```

2. **Start with tunnel enabled**:
```bash
# Enable the tunnel profile in .env by uncommenting:
# COMPOSE_PROFILES=tunnel
docker-compose up --build -d

# Or enable the profile for a single command
COMPOSE_PROFILES=tunnel docker-compose up --build -d
```

3. **Check the status**:
```bash
docker-compose ps
docker-compose logs cloudflare-tunnel
```

4. **Access your application**:
   - Your app will be available at `https://gpu-dashboard.yourdomain.com`
   - Local access still available at `http://localhost:3000`

### Docker Commands Reference

```bash
# Local development
docker-compose up --build

# With Cloudflare Tunnel
docker-compose up --build -d  # (with COMPOSE_PROFILES=tunnel in .env)
# OR
COMPOSE_PROFILES=tunnel docker-compose up --build -d

# View logs
docker-compose logs -f
docker-compose logs cloudflare-tunnel

# Stop services
docker-compose down

# Rebuild without cache
docker-compose build --no-cache

# Remove all containers and volumes
docker-compose down -v --remove-orphans

# Check which services are running
docker-compose ps
```

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `APP_PORT` | Port for the web application | `3000` | No |
| `TUNNEL_TOKEN` | Cloudflare tunnel token | - | Only for tunnel |
| `COMPOSE_PROFILES` | Docker Compose profiles to activate | - | No |

### Troubleshooting

#### Cloudflare Tunnel Issues
- **Tunnel not starting**: Ensure `COMPOSE_PROFILES=tunnel` is set in `.env`
- **Tunnel not connecting**: Check your `TUNNEL_TOKEN` in `.env`
- **502 Bad Gateway**: Ensure the web app container is healthy before tunnel starts
- **DNS issues**: Verify your domain is using Cloudflare nameservers

#### Application Issues
- **Container won't start**: Check logs with `docker-compose logs gpu-dashboard`
- **Build failures**: Try `docker-compose build --no-cache`
- **Port conflicts**: Change `APP_PORT` in `.env`

#### Health Checks
- **Web app health**: `curl http://localhost:3000/health`
- **Tunnel metrics**: `curl http://localhost:2000/ready` (when tunnel is running)

### Profile Benefits

- **Single compose file**: Everything in one place
- **Optional services**: Tunnel only runs when needed
- **Environment-driven**: Control via `.env` file

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