export type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };
export type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

export type FakeCaptcha = {
    code?: number;
    status?: string;
  };
}