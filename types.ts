
export interface DeviceNode {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy';
  os: string;
  battery: number;
  lastActive: string;
  ipAddress: string;
  cpuUsage: number;
  ramUsage: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  extension?: string;
}

export interface ActivityLog {
  id: string;
  deviceId: string;
  timestamp: string;
  action: string;
  details: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface Stats {
  totalNodes: number;
  activeNodes: number;
  alerts: number;
  dataTraffic: string;
}
