import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { JwtPayload } from "./jwt-payload.interfaces";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { UnauthorizedException } from "@nestjs/common";
import * as config from 'config'


export class jwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret')
        })
    }
    
    async validate(payload:JwtPayload): Promise<User>{
        const {username} = payload;
        console.log("username", username)
        console.log(payload,username,"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1")
        const user = await this.userRepository.findOne({ where: { username} }) 
        if(!user){
            throw new UnauthorizedException();
        }

        return user
    }

}