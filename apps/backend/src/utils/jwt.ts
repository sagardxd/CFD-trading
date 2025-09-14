import { config } from '@repo/config'
import jwt from 'jsonwebtoken'

export const jwtSign = (user: {email: string, id: string}) => {
    return jwt.sign(user, config.JWT_TOKEN_PASS);
}   

export const jwtVerify = (token: string) => {
    return jwt.verify(token, config.JWT_TOKEN_PASS) as {email: string, id: string};
}   