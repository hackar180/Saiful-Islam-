
import { DeviceNode, FileItem, ActivityLog } from './types';

export const MOCK_DEVICES: DeviceNode[] = [
  { 
    id: 'NX-001', 
    name: 'Galaxy-S24-Ultra', 
    status: 'online', 
    os: 'Android 14', 
    battery: 88, 
    lastActive: 'Just now', 
    ipAddress: '192.168.1.105', 
    cpuUsage: 12, 
    ramUsage: 45, 
    location: { lat: 24.7136, lng: 46.6753, address: 'Riyadh, Saudi Arabia' } 
  },
  { 
    id: 'NX-002', 
    name: 'Pixel-8-Pro', 
    status: 'online', 
    os: 'Android 14', 
    battery: 92, 
    lastActive: 'Just now', 
    ipAddress: '192.168.1.112', 
    cpuUsage: 8, 
    ramUsage: 32, 
    location: { lat: 19.0760, lng: 72.8777, address: 'Mumbai, India' } 
  },
  { 
    id: 'NX-003', 
    name: 'Xperia-1-V', 
    status: 'busy', 
    os: 'Android 13', 
    battery: 45, 
    lastActive: '2 mins ago', 
    ipAddress: '192.168.1.118', 
    cpuUsage: 78, 
    ramUsage: 89, 
    location: { lat: 14.5995, lng: 120.9842, address: 'Manila, Philippines' } 
  },
  { 
    id: 'NX-004', 
    name: 'Mi-14-Pro', 
    status: 'offline', 
    os: 'Android 14', 
    battery: 0, 
    lastActive: '4 hours ago', 
    ipAddress: '192.168.1.120', 
    cpuUsage: 0, 
    ramUsage: 0, 
    location: { lat: 21.4858, lng: 39.1925, address: 'Jeddah, Saudi Arabia' } 
  },
  { 
    id: 'NX-005', 
    name: 'OnePlus-12', 
    status: 'online', 
    os: 'Android 14', 
    battery: 76, 
    lastActive: '1 min ago', 
    ipAddress: '192.168.1.125', 
    cpuUsage: 15, 
    ramUsage: 50, 
    location: { lat: 28.6139, lng: 77.2090, address: 'Delhi, India' } 
  },
];

export const MOCK_FILES: FileItem[] = [
  { name: 'DCIM', type: 'folder', modified: '2024-05-20 10:30' },
  { name: 'Documents', type: 'folder', modified: '2024-05-18 14:12' },
  { name: 'Downloads', type: 'folder', modified: '2024-05-22 09:45' },
  { name: 'Telegram', type: 'folder', modified: '2024-05-22 18:20' },
  { name: 'system_log.txt', type: 'file', size: '12 KB', modified: '2024-05-22 20:01', extension: 'txt' },
  { name: 'config_backup.json', type: 'file', size: '4 KB', modified: '2024-05-21 11:30', extension: 'json' },
  { name: 'user_vault.db', type: 'file', size: '2.4 MB', modified: '2024-05-19 16:45', extension: 'db' },
];

export const MOCK_LOGS: ActivityLog[] = [
  { id: 'L1', deviceId: 'NX-001', timestamp: '14:20:05', action: 'Auth Success', details: 'Telegram session established', type: 'success' },
  { id: 'L2', deviceId: 'NX-003', timestamp: '14:21:12', action: 'High Load', details: 'CPU usage exceeded 85% threshold', type: 'warning' },
  { id: 'L3', deviceId: 'NX-004', timestamp: '10:15:30', action: 'Disconnect', details: 'Keep-alive signal lost', type: 'error' },
  { id: 'L4', deviceId: 'NX-002', timestamp: '14:25:45', action: 'Command Recv', details: 'Executed "sys_info_get"', type: 'info' },
];
