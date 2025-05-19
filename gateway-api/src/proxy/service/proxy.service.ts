import { HttpException, HttpStatus, Injectable, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

const TIMEOUT_MS = 5000;

@Injectable()
export class ProxyService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {}

    async forward(@Req() req: Request, @Res() res: Response): Promise<void> {
        const { method, body, headers, query } = req;

        const baseUrl: string = this.getBaseUrl(req.path);
        const url = `${baseUrl}${req.path}`;
        try {
            const response: AxiosResponse = await lastValueFrom(
                this.httpService.request({
                    method,
                    url,
                    headers: this.setProxyHeaders(headers, req.user),
                    ...(this.hasBody(method) && { data: JSON.stringify(body) }),
                    params: query,
                    timeout: TIMEOUT_MS
                })
            );

            res.status(response.status).json(response.data);
        } catch (error: any) {
            console.error(error);

            if (error instanceof AxiosError) {
                const axiosResponse: AxiosResponse | undefined = error.response;

                if (axiosResponse) {
                    // 내부 API가 반환한 statusCode, message 등을 그대로 전달
                    res.status(axiosResponse.status).send(axiosResponse.data);
                } else {
                    res.status(HttpStatus.BAD_GATEWAY).send({
                        statusCode: HttpStatus.BAD_GATEWAY,
                        message: `프록시 요청 실패: ${error.code || 'UNKNOWN_ERROR'}`
                    });
                }
            }
        }
    }

    private setProxyHeaders(
        headers: Record<string, any>,
        user?: { sub?: string; role?: string; type?: string }
    ): Record<string, string> {
        const forbidden: string[] = ['host', 'content-length', 'connection', 'transfer-encoding', 'accept-encoding'];

        const defaultHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };

        const filtered: Record<string, string> = {};

        for (const [key, value] of Object.entries(headers)) {
            if (forbidden.includes(key.toLowerCase())) continue;
            if (typeof value === 'string') {
                filtered[key.toLowerCase()] = value;
            }
        }

        // 인증된 사용자 정보 추가
        if (user?.sub) {
            filtered['x-user-id'] = user.sub;
        }

        if (user?.role) {
            filtered['x-user-role'] = user.role;
        }

        if (user?.type) {
            filtered['x-user-token-type'] = user.type;
        }

        return {
            ...defaultHeaders,
            ...filtered
        };
    }

    private hasBody(method: string): boolean {
        return ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method.toUpperCase());
    }

    private getBaseUrl(path: string): string {
        const [_, servicePrefix] = path.split('/');

        let configKey: string;

        switch (servicePrefix) {
            case 'events':
            case 'rewards':
                configKey = 'EVENT_SERVER_API_URL';
                break;
            case 'auth':
                configKey = 'AUTH_SERVER_API_URL';
                break;
            default:
                throw new HttpException(`${servicePrefix}는 유효하지 않은 서비스 접두사입니다.`, HttpStatus.NOT_FOUND);
        }

        const baseUrl: string | undefined = this.configService.get<string>(configKey);

        if (!baseUrl) {
            throw new HttpException(
                `설정 누락 : 환경 변수에 ${configKey} 값이 설정되어 있지 않습니다.`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        return baseUrl;
    }
}
