import { createParamDecorator } from "@nestjs/common";
import { User } from "./user.entity";

export const GetUser = createParamDecorator((data,req): User => {
    // console.log("reqq", req.args[0].user)
    return req.args[0].user;
})


