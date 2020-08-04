"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var common_1 = require("@nestjs/common");
var nestjs_mdb_lib_service_1 = require("./nestjs-mdb-lib.service");
var NestjsMdbLibModule = /** @class */ (function () {
    function NestjsMdbLibModule() {
    }
    NestjsMdbLibModule = __decorate([
        common_1.Module({
            providers: [nestjs_mdb_lib_service_1.NestjsMdbLibService],
            exports: [nestjs_mdb_lib_service_1.NestjsMdbLibService]
        })
    ], NestjsMdbLibModule);
    return NestjsMdbLibModule;
}());
exports.NestjsMdbLibModule = NestjsMdbLibModule;
