type AuthResponse =  {
    token: string
}

export type SignupReponse = AuthResponse & {userId: string} 

export type SigninResponse = AuthResponse;