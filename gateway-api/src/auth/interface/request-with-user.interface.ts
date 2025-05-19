import { Request } from 'express';
import { JwtPayloadInterface } from './jwt-payload.interface';

// 확장된 Request 타입 설정(user=jwtpayload)을 위한 Interface 설정
export interface RequestWithUserInterface extends Request {
    user: JwtPayloadInterface;
}
