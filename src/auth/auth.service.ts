import { ConflictException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interfaces';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService')
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>,
        private jwtService: JwtService
    ){}


    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{
       try {
            const {username, password} = authCredentialsDto;
            const user = new User();
            user.username = username;
            user.salt =await bcrypt.genSalt();
            user.password = await this.hashPassword(password, user.salt);
            await user.save()
       } catch (error) {
        if(error.code === '23505'){
            throw new ConflictException('Username already exist')
        }else{
            throw new InternalServerErrorException()
        }
       }
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}>{
        const {username, password} = authCredentialsDto;
        const user = await this.userRepository.findOne({ where: { username } }); 
        if(user && await user.validatePassword(password)){
            const payload: JwtPayload = {username}
            const accessToken = await this.jwtService.sign({username})
            this.logger.debug(`Generate JWT Token with payload ${JSON.stringify(payload)}`)
            return {accessToken};
        }else{
            throw new UnauthorizedException('Invalid credentials');
        }

        

    }


    private async hashPassword(password: string, salt: string): Promise<string>{
        return bcrypt.hash(password, salt)
    }
}

