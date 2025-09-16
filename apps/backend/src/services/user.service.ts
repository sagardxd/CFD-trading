import { logger } from "@repo/config";
import { prisma } from "../db/prisma-client"
import { $ZodCheckGreaterThan } from "zod/v4/core";

export const UserExists = async (email: string) => {
    try {
        const user = await prisma.user.findFirstOrThrow({
            where: {
                email
            }
        })
        console.log("user", user);
        return user;
    } catch (error) {
        logger.error("UserExists", "Error in finding if the user exists!", error)
        return null;
    }
}

export const CreateUser = async (email: string) => {
    try {
        const user = await prisma.user.create({
            data: {
                email: email,
            }
        })
        logger.info(`User created: ${user}`)
        return user;
    } catch (error) {
        logger.error("CreateUser", "Error creating user!", error)
        return null;
    }
}

export const UpdateLastloggedIn = async (userId: string) => {
    try {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                lastLoggedIn: new Date()
            }
        })
    } catch (error) {
        logger.error("UpdateLastloggedIn", "Error updating the last logged in of user!", error)
    }
}