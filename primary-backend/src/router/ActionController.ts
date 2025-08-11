import { Get, Route, Tags } from "tsoa";
import { prismaClient } from "../db";

interface AvailableAction {
  id: number;
  name: string;
  // add any other fields your `availableAction` table has
}

@Route("action")
@Tags("Action")
export class ActionController {
  @Get("available")
  public async getAvailableActions(): Promise<{ availableActions: AvailableAction[] }> {
    const availableActions = await prismaClient.availableAction.findMany({});
    return { availableActions };
  }
}
