export interface LifecycleRule {
  id: string;
  status: 'Enabled' | 'Disabled';
  filter?: any;
  transitions?: any[];
  expiration?: any;
}
