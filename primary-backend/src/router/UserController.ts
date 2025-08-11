import { Body, Get, Post, Request, Route, Security, Tags } from "tsoa";
import { prismaClient } from "../db";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import { SigninSchema, SignupSchema } from "../types";

interface SignupRequest {
  username: string;
  password: string;
  name: string;
}

interface SigninRequest {
  username: string;
  password: string;
}

interface UserResponse {
  name: string;
  email: string;
}

@Route("user")
@Tags("User")
export class UserController {
  @Post("signup")
  public async signup(@Body() body: SignupRequest): Promise<{ message: string }> {
    const parsedData = SignupSchema.safeParse(body);
    if (!parsedData.success) {
      throw { status: 411, message: "Incorrect inputs" };
    }

    const userExists = await prismaClient.user.findFirst({
      where: { email: parsedData.data.username },
    });

    if (userExists) {
      throw { status: 403, message: "User already exists" };
    }

    await prismaClient.user.create({
      data: {
        email: parsedData.data.username,
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    });

    return { message: "Please verify your account by checking your email" };
  }

  @Post("signin")
  public async signin(@Body() body: SigninRequest): Promise<{ token: string }> {
    const parsedData = SigninSchema.safeParse(body);
    if (!parsedData.success) {
      throw { status: 411, message: "Incorrect inputs" };
    }

    const user = await prismaClient.user.findFirst({
      where: {
        email: parsedData.data.username,
        password: parsedData.data.password,
      },
    });

    if (!user) {
      throw { status: 403, message: "Sorry credentials are incorrect" };
    }

    const token = jwt.sign({ id: user.id }, JWT_PASSWORD);
    return { token };
  }

  @Get("/")
  @Security("jwt")
  public async getUser(@Request() req: any): Promise<{ user: UserResponse | null }> {
    const id = req.user?.id;

    const user = await prismaClient.user.findFirst({
      where: { id },
      select: { name: true, email: true },
    });

    return { user };
  }
}
