import { Body, Get, Path, Post, Request, Route, Security, Tags } from "tsoa";
import { prismaClient } from "../db";
import { ZapCreateSchema } from "../types";

// --------------------
// DTOs
// --------------------
export interface ZapActionMetadata {
  [key: string]: string | number | boolean | null;
}

export interface ZapAction {
  availableActionId: string; 
  actionMetadata: ZapActionMetadata;
}

export interface ZapCreateInput {
  availableTriggerId: string;
  actions: ZapAction[];
}

export interface ZapResponse {
  id: string;
  userId: number; 
  triggerId: string;
  actions: ZapAction[];
}

// --------------------
// Controller
// --------------------
@Route("zap")
@Tags("Zap")
export class ZapController {
  @Security("jwt")
  @Post("/")
  public async createZap(
    @Request() req: any,
    @Body() body: ZapCreateInput
  ): Promise<{ zapId: string }> { // FIXED: string
    const id = req.user?.id || req.id;

    const parsedData = ZapCreateSchema.safeParse(body);
    if (!parsedData.success) {
      throw { status: 411, message: "Incorrect inputs" };
    }

    const zapId = await prismaClient.$transaction(async (tx) => {
      const zap = await tx.zap.create({
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

      const trigger = await tx.trigger.create({
        data: {
          triggerId: parsedData.data.availableTriggerId,
          zapId: zap.id,
        },
      });

      await tx.zap.update({
        where: { id: zap.id },
        data: { triggerId: trigger.id },
      });

      return zap.id; 
    });

    return { zapId };
  }

  @Security("jwt")
  @Get("/")
  public async getZaps(@Request() req: any): Promise<{ zaps: ZapResponse[] }> {
    const id = req.user?.id || req.id;
    const zaps = await prismaClient.zap.findMany({
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
          actionMetadata: a.metadata as ZapActionMetadata,
        })),
      })),
    };
  }

  @Security("jwt")
  @Get("/{zapId}")
  public async getZap(
    @Request() req: any,
    @Path() zapId: string 
  ): Promise<{ zap: ZapResponse | null }> {
    const id = req.user?.id || req.id;
    const zap = await prismaClient.zap.findFirst({
      where: { id: zapId, userId: parseInt(id, 10) }, 
      include: {
        actions: { include: { type: true } },
        trigger: { include: { type: true } },
      },
    });

    if (!zap) return { zap: null };

    return {
      zap: {
        id: zap.id,
        userId: zap.userId,
        triggerId: zap.triggerId,
        actions: zap.actions.map((a) => ({
          availableActionId: a.actionId,
          actionMetadata: a.metadata as ZapActionMetadata,
        })),
      },
    };
  }
}
