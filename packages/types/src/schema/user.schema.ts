import {z} from 'zod'

export const userSchema = z.object({
    email: z.email()
})  