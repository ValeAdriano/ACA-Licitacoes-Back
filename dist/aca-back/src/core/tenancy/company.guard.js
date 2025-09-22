"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CompanyGuard = class CompanyGuard {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(ctx) {
        const req = ctx.switchToHttp().getRequest();
        const companyId = req.headers['x-company-id'] || req.query.companyId || req.body?.companyId;
        if (!companyId)
            throw new common_1.BadRequestException('companyId ausente');
        const authUserId = req.user?.authUserId;
        if (!authUserId)
            throw new common_1.ForbiddenException('Usuário não autenticado');
        const user = await this.prisma.appUser.findUnique({ where: { authUserId } });
        if (!user)
            throw new common_1.ForbiddenException('Usuário não registrado');
        const membership = await this.prisma.companyMember.findFirst({ where: { companyId, userId: user.id } });
        if (!membership)
            throw new common_1.ForbiddenException('Sem vínculo com a empresa');
        req.companyId = companyId;
        req.membership = membership;
        return true;
    }
};
exports.CompanyGuard = CompanyGuard;
exports.CompanyGuard = CompanyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyGuard);
//# sourceMappingURL=company.guard.js.map