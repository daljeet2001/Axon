import { Get, Route, Tags } from "tsoa";
import { prismaClient } from "../db";

interface AvailableTrigger {
  id: string;
  name: string;
  image: string;
}

@Route("trigger")
@Tags("Trigger")
export class TriggerController {
  @Get("available")
  public async getAvailableTriggers(): Promise<{ availableTriggers: AvailableTrigger[] }> {
    const availableTriggers = await prismaClient.availableTrigger.findMany({});
    return { availableTriggers };
  }
}
