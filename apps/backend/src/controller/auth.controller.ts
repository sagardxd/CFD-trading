import { type Request, type Response } from "express";

export const signUpController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body
        const response = await AuthService.signupService(email);
        if (response.status) {
            return res.status(201).json({})
        }
        return res.status(500).json({})
    } catch (error) {
        return res.status(500);
    }
}

export const signInController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body
        const response = await AuthService.signinService(email);
        if (response.success) {
            return res.status(201).json({message: response.message})
        }
        return res.status(500).json({message: response.message})
    } catch (error) {
        return res.status(500);
    }
}

export const signInWithTokenController = async (req: Request, res: Response) => {
    const token = req.query.token as string
    try {
        if (!token) return res.status(403).json({ message: "not token provided" })

        const response = await AuthService.signinWithTokenService(token)
        if (!response.success) throw new Error

        res.cookie("token", response.cookie)
        res.status(200).json({message: "cookie set hogai"})
        return;
    } catch (error) {
        return res.status(500).json({})
    }
}