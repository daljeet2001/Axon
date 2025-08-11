import { Body, Get, Path, Post, Request, Route, Security, Tags } from "tsoa";
import { prismaClient } from "../db";
import { ZapCreateSchema } from "../types";

interface ZapActionMetadata {
  [key: string]: any;
}

interface ZapAction {
  availableActionId: number;
  actionMetadata: ZapActionMetadata;
}

interface ZapCreateInput {
  availableTriggerId: string;
  actions: ZapAction[];
}

@Route("zap")
@Tags("Zap")
export class ZapController {
  /**
   * Create a new Zap
   */
  @Security("jwt")
  @Post("/")
  public async createZap(
    @Request() req: any,
    @Body() body: ZapCreateInput
  ): Promise<{ zapId: number }> {
    const id = req.user?.id || req.id;

    const parsedData = ZapCreateSchema.safeParse(body);
    if (!parsedData.success) {
      throw {
        status: 411,
        message: "Incorrect inputs",
      };
    }

    const zapId = await prismaClient.$transaction(async (tx) => {
      const zap = await prismaClient.zap.create({
        data: {
          userId: parseInt(id),
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
        where: {
          id: zap.id,
        },
        data: {
          triggerId: trigger.id,
        },
      });

      return zap.id;
    });

    return { zapId };
  }

  /**
   * Get all Zaps for the authenticated user
   */
  @Security("jwt")
  @Get("/")
  public async getZaps(@Request() req: any) {
    const id = req.user?.id || req.id;
    const zaps = await prismaClient.zap.findMany({
      where: {
        userId: id,
      },
      include: {
        actions: {
          include: {
            type: true,
          },
        },
        trigger: {
          include: {
            type: true,
          },
        },
      },
    });
    return { zaps };
  }

  /**
   * Get a specific Zap by ID
   */
  @Security("jwt")
  @Get("/{zapId}")
  public async getZap(
    @Request() req: any,
    @Path() zapId: number
  ) {
    const id = req.user?.id || req.id;
    const zap = await prismaClient.zap.findFirst({
      where: {
        id: zapId,
        userId: id,
      },
      include: {
        actions: {
          include: {
            type: true,
          },
        },
        trigger: {
          include: {
            type: true,
          },
        },
      },
    });
    return { zap };
  }
}
