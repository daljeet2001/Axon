import { Get, Route, Tags } from "tsoa";
import { prismaClient } from "../db";

interface AvailableAction {
  id: string;
  name: string;
  image: string;

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
