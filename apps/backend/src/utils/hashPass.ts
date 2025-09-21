import { config, logger } from '@repo/config'
import bcrypt from 'bcrypt'

export const hashPass = async (pass: string) => {
    try {
        const hashedPass = await bcrypt.hash(pass, config.HASH_SALT)
        return hashedPass;
    } catch (error) {
        logger.error('hashPass', 'Error hashing pass', error)
        return pass;
    }
}

export const isHashedPassMatch = async (pass: string, hashedPass: string): Promise<boolean> =>  {
    try {
        const isMatch = bcrypt.compare(pass, hashedPass);
        return isMatch
    } catch (error) {
        logger.error('hashPass', 'Error hashing pass', error)
        return false;
    }
}