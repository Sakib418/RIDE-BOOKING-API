"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverApprovalStatus = exports.DriverOnlineStatus = void 0;
var DriverOnlineStatus;
(function (DriverOnlineStatus) {
    DriverOnlineStatus["ONLINE"] = "ONLINE";
    DriverOnlineStatus["OFFLINE"] = "OFFLINE";
})(DriverOnlineStatus || (exports.DriverOnlineStatus = DriverOnlineStatus = {}));
var DriverApprovalStatus;
(function (DriverApprovalStatus) {
    DriverApprovalStatus["PENDING"] = "PENDING";
    DriverApprovalStatus["APPROVED"] = "APPROVED";
    DriverApprovalStatus["SUSPENDED"] = "SUSPENDED";
})(DriverApprovalStatus || (exports.DriverApprovalStatus = DriverApprovalStatus = {}));
