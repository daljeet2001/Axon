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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZapController = void 0;
const tsoa_1 = require("tsoa");
const db_1 = require("../db");
const types_1 = require("../types");
// --------------------
// Controller
// --------------------
let ZapController = class ZapController {
    createZap(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.id;
            const parsedData = types_1.ZapCreateSchema.safeParse(body);
            if (!parsedData.success) {
                throw { status: 411, message: "Incorrect inputs" };
            }
            const zapId = yield db_1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const zap = yield tx.zap.create({
                    data: {
                        userId: parseInt(id, 10), // FIXED: cast to number
                        triggerId: "",
                        actions: {
                            create: parsedData.data.actions.map((x, index) => ({
                                actionId: x.availableActionId,
                                sortingOrder: index,
                                metadata: x.actionMetadata,
                            })),
                        },
                    },
                });
                const trigger = yield tx.trigger.create({
                    data: {
                        triggerId: parsedData.data.availableTriggerId,
                        zapId: zap.id,
                    },
                });
                yield tx.zap.update({
                    where: { id: zap.id },
                    data: { triggerId: trigger.id },
                });
                return zap.id;
            }));
            return { zapId };
        });
    }
    getZaps(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.id;
            const zaps = yield db_1.prismaClient.zap.findMany({
                where: { userId: parseInt(id, 10) },
                include: {
                    actions: { include: { type: true } },
                    trigger: { include: { type: true } },
                },
            });
            return {
                zaps: zaps.map((z) => ({
                    id: z.id,
                    userId: z.userId,
                    triggerId: z.triggerId,
                    actions: z.actions.map((a) => ({
                        availableActionId: a.actionId,
                        actionMetadata: a.metadata,
                    })),
                })),
            };
        });
    }
    getZap(req, zapId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.id;
            const zap = yield db_1.prismaClient.zap.findFirst({
                where: { id: zapId, userId: parseInt(id, 10) },
                include: {
                    actions: { include: { type: true } },
                    trigger: { include: { type: true } },
                },
            });
            if (!zap)
                return { zap: null };
            return {
                zap: {
                    id: zap.id,
                    userId: zap.userId,
                    triggerId: zap.triggerId,
                    actions: zap.actions.map((a) => ({
                        availableActionId: a.actionId,
                        actionMetadata: a.metadata,
                    })),
                },
            };
        });
    }
};
exports.ZapController = ZapController;
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Post)("/"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ZapController.prototype, "createZap", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Get)("/"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZapController.prototype, "getZaps", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Get)("/{zapId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ZapController.prototype, "getZap", null);
exports.ZapController = ZapController = __decorate([
    (0, tsoa_1.Route)("zap"),
    (0, tsoa_1.Tags)("Zap")
], ZapController);
