"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.Status = void 0;
var Status;
(function (Status) {
    Status["ACTIVE"] = "Active";
    Status["INACTIVE"] = "Inactive";
})(Status || (exports.Status = Status = {}));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
