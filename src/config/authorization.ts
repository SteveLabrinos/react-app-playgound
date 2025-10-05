export type JwtPayload = {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
};

export const authConfig = {
  checkInterval: 10,
  iframeFocusCheckInterval: 60,
  activityEvents: ["mousedown", "keydown"],
  renewBeforeExpiration: 60,
};
