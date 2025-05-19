## 📦 전체 시스템 구성 (MSA)

| 서비스       | 주요 책임                                                                 |
|--------------|--------------------------------------------------------------------------|
| `gateway-api` | API 게이트웨이, 인증 프록시, 인가 검증, 라우팅 역할 수행                  |
| `auth-api`    | 유저 등록, 로그인, JWT 발급 및 검증, 역할(Role) 관리                      |
| `event-api`   | 이벤트 등록/조회, 보상 등록/조회, 유저 보상 요청 및 조건 평가 처리       |
| `MongoDB`     | 각 서비스별로 독립된 DB 인스턴스 사용 (`auth`, `event`)                   |
| `Redis`       | Refresh Token 저장 및 검증용 캐시로 활용                                 |

## 🧱 아키텍처 및 설계 개요
✅ 모듈 기반의 레이어드 아키텍처
- 각 서비스는 NestJS의 모듈 시스템을 기반으로, user, auth, event, reward로 모듈화하여 구성
- 각 모듈은 Controller → Service → Repository 구조의 Layered Architecture를 따름
- 공통 유틸과 모듈 ( JWT, Redis, Mongoose, Role, Interceptor ) 은 common 디렉토리로 분리하여 전역 재사용성 확보

✅ 의존성 최소화를 위한 Repository 인터페이스 분리
- 각 기능별 Repository는 인터페이스를 별도로 정의하고, 서비스는 인터페이스에만 의존
- NestJS의 @Inject()를 사용하여 구체 구현과 결합도를 낮추는 설계 적용
→ 테스트 용이성 및 유지보수성을 고려한 구조

✅ JWT + Redis 기반 인증 설계
- 로그인 시 Access Token과 Refresh Token을 함께 발급
- Access Token은 클라이언트에 전달하고, Refresh Token은 Redis에 저장하여 유효성 검증 및 재발급 처리에 사용
- JWT 발급/검증 책임은 JwtClientService에 위임하여 관심사 분리 구현
- Passport의 JwtStrategy를 활용해 JWT를 파싱하고, 사용자 정보를 request.user에 주입하여
  이후 인증이 필요한 컨트롤러에서 손쉽게 사용자 정보 활용

✅ Mongoose 기반 스키마 유효성 검증 + 인덱스 적용
- 모든 MongoDB 컬렉션은 NestJS + Mongoose 기반의 Schema 정의로 유효성 검증 적용
- 이벤트 스키마에는 title 필드에 인덱스 설정하여 조회 성능을 고려한 설계
    ~~~
    @Prop({ required: true, index: 1 })
    title: string;
    ~~~

✅ 역할 ( Role ) 기반 권한 정책 구현
- 유저의 역할은 UserRoleEnum을 통해 `USER`, `OPERATOR`, `AUDITOR`, `ADMIN` 등으로 구분
- 역할 변경은 change-user-role.policy.ts 내에서 역할별 해시 검증 정책을 통해 처리
- 역할별 고유 코드 인증 방식을 통해 보안성과 권한 구분을 강화

✅ 기타 설계 및 구현 노력
- 응답 포맷 일관화를 위한 ResponseFormatInterceptor 구성
- Global ValidationPipe 설정을 통해 DTO 유효성 검증 강화 ( transform, whitelist, forbidNonWhitelisted 설정을 통해 불필요하거나 허용되지 않은 값은 자동 차단 )
- Graceful Shutdown 처리를 위한 ShutdownHandler 도입
- MongoDB ObjectId를 안전하게 변환하기 위한 toObjectId 유틸 함수 정의
- 파일명 및 폴더명은 기능, 계층 기준으로 명확하게 구분하고 일관된 규칙으로 구성
EX) controller/, service/, dto/, schema/, policy/, interface/, enum/

## 🧪 실행 방법
~~~
# root 디렉토리에서 실행
$ docker-compose up -d --build
~~~

## 🌐 서비스별 포트 및 호출 경로
| 서비스        | 포트                          | 주요 엔드포인트 예시                                                                 |
|---------------|-----------------------------|----------------------------------------------------------------------------------------|
| `gateway-api` | 3012                        | `POST /auth/login`, `GET /events`, `POST /rewards/user-requests` 등                    |
| `auth-api`    | 3010                        | `POST /auth/users`, `POST /auth/login`, `PATCH /auth/users/role`                       |
| `event-api`   | 3011                        | `POST /events`, `GET /events`, `POST /rewards`, `POST /rewards/user-requests`          |
| `MongoDB`     | 27020 (auth), 27021 (event) | 서비스별 독립 MongoDB 인스턴스 (`auth-api`, `event-api`에서 내부 사용)       |
| `Redis`       | 6380                        | Refresh Token 저장소 (내부 서비스 간 인증용으로 사용됨)                              |

🛡️ 권한(Role) 승격용 인증 코드 안내
- 역할 변경(PATCH /auth/users/role) 요청 시, 각 역할에 해당하는 비밀 코드(code)가 필요합니다.
  
- | 역할 (`role`) | 인증 코드 (`code`)                         |
  |----------------|---------------------------------------------|
  | `ADMIN`        | `Ad2025min05!@Secret!Key123~!`             |
  | `OPERATOR`     | `Op2025rator05!@Secret!Key456~!`           |
  | `AUDITOR`      | `Au2025dit05!@Secret!Key789~!`             |

- 예시 요청
  ~~~
  PATCH /auth/users/role
  
  {
    "role": "ADMIN",
    "code": "Ad2025min05!@Secret!Key123~!"
  }
  ~~~