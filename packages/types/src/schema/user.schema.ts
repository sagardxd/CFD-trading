import {z} from 'zod'

export const userSchema = z.object({
    email: z.email(),
    password: z.string().min(6, 'minimun 6 letters needed').max(20, 'max limit to password is 12 digits')
})  