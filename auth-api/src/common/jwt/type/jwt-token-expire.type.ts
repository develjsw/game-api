type TimeType = 's' | 'm' | 'h' | 'd' | 'w' | 'y'; // 초, 분, 시, 일, 주, 년

type JwtExpireStringType = `${number}${TimeType}`;
type JwtExpireType = JwtExpireStringType | number;

export type AccessTokenExpireType = JwtExpireType;
export type RefreshTokenExpireType = JwtExpireType;
