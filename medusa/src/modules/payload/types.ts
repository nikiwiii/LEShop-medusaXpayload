export interface PayloadModuleOptions {
  serverUrl: string
  apiKey: string
  userCollection?: string
}

export interface SyncResult {
  success: boolean
  payloadId?: string
  error?: string
}
