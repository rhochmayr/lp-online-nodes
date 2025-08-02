export interface GPU {
  name: string;
  vendor: string;
  vram: number;
}

export interface ResourceSpec {
  gpu: number;
  gpus: GPU[];
  cpu: number;
  ram: number;
  disk: number;
}

export interface ResourceOffer {
  id: string;
  created_at: number;
  resource_provider: string;
  index: number;
  spec: ResourceSpec;
  modules: any[];
  mode: string;
  default_pricing: {
    instruction_price: number;
    payment_collateral: number;
    results_collateral_multiple: number;
    mediation_fee: number;
  };
  module_pricing: {};
  trusted_parties: {
    solver: string;
    mediator: string[];
    api_host: string;
  };
}

export interface NodeProvider {
  id: string;
  deal_id: string;
  resource_provider: string;
  state: number;
  resource_offer: ResourceOffer;
}

export interface Stats {
  totalProviders: number;
  totalGPUs: number;
  totalVRAM: number;
  totalCPU: number;
  totalRAM: number;
  totalDisk: number;
  uniqueGPUModels: Set<string>;
  onlineProviders: number;
}

export interface PersistedNode extends NodeProvider {
  lastSeen: number;
  isCurrentlyOnline: boolean;
}