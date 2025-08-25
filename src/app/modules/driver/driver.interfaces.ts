export enum DriverOnlineStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export enum DriverApprovalStatus {
  PENDING = "PENDING",   
  APPROVED = "APPROVED", 
  SUSPENDED = "SUSPENDED" 
}

export interface IDriverProfile {
  licenseNo: string;
  vehicle: {
    make: string;
    model: string;
    plate: string;
  };
  approvalStatus: DriverApprovalStatus;
  onlineStatus: DriverOnlineStatus;
           
  
}