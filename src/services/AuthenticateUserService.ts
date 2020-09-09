import { getRepository } from "typeorm";
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken'; 

import User from '../models/UserModel';

interface RequestAuthenticateUser {
    email: string;
    password: string;
}

interface ResponseAuthenticateUser {
    user: User,
    token: string
}

class AuthenticateUserService {
    public async execute({ email, password }: RequestAuthenticateUser): Promise<ResponseAuthenticateUser> {
        const userRepository = getRepository(User);

        const user = await userRepository.findOne({ where: { email } });

        if(!user) {
            throw new Error('Incorrect email/password combination');
        }

        const passwordMatched = await compare(password, user.password);

        if(!passwordMatched) {
            throw new Error('Incorrect email/password combination');
        }

        const token = sign({}, 'SECRET_KEY', {
            subject: user.id,
            expiresIn: '1d'
        });

        return {
            user,
            token
        }
    }
}

export default AuthenticateUserService;