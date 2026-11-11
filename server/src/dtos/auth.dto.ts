export interface AuthResponseDto {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AuthServiceResult {
  user: AuthResponseDto["user"];
  token: string;
}
