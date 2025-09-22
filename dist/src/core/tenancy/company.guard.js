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
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const companyId = request.params.companyId || request.headers['x-company-id'];
        if (!companyId) {
            throw new common_1.ForbiddenException('Company ID is required');
        }
        if (!user?.userId) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        const membership = await this.prisma.companyMember.findUnique({
            where: {
                companyId_userId: {
                    companyId,
                    userId: user.userId,
                },
            },
            include: {
                company: true,
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('User is not a member of this company');
        }
        request.membership = membership;
        return true;
    }
};
exports.CompanyGuard = CompanyGuard;
exports.CompanyGuard = CompanyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyGuard);
//# sourceMappingURL=company.guard.js.map