import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { LoginAccountDto } from './dto/login-account.dto';

type JwtPayload = { sub: string; authority: string };

@Injectable()
export class AuthService {
  constructor(private readonly config: ConfigService) {}

  login(dto: LoginAccountDto) {
    if (dto.type === 'mobile') {
      return this.loginMobile(dto);
    }
    return this.loginEmail(dto);
  }

  private loginEmail(dto: LoginAccountDto) {
    const demoEmail = this.config.get<string>('LOGIN_DEMO_EMAIL')?.trim();
    const demoPassword = this.config.get<string>('LOGIN_DEMO_PASSWORD');
    if (!demoEmail || demoPassword === undefined || demoPassword === '') {
      throw new ServiceUnavailableException(
        'Login is not configured. Set LOGIN_DEMO_EMAIL and LOGIN_DEMO_PASSWORD in apps/api/.env',
      );
    }

    const email = dto.username ?? '';
    const ok =
      email === demoEmail.toLowerCase() && dto.password === demoPassword;
    if (!ok) {
      return {
        status: 'error' as const,
        type: dto.type,
        currentAuthority: 'guest' as const,
      };
    }

    const authority =
      this.config.get<string>('LOGIN_DEMO_AUTHORITY')?.trim() || 'admin';
    const accessToken = this.signAccessToken({
      sub: email,
      authority,
    });

    return {
      status: 'ok' as const,
      type: dto.type ?? 'account',
      currentAuthority: authority,
      accessToken,
    };
  }

  /** Minimal stub so the Pro mobile tab does not break (no real SMS). */
  private loginMobile(dto: LoginAccountDto) {
    const mobile = dto.mobile?.trim() ?? '';
    const captcha = dto.captcha?.trim() ?? '';
    if (!mobile || !captcha) {
      return {
        status: 'error' as const,
        type: 'mobile',
        currentAuthority: 'guest' as const,
      };
    }

    const authority =
      this.config.get<string>('LOGIN_DEMO_AUTHORITY')?.trim() || 'admin';
    const accessToken = this.signAccessToken({
      sub: `${mobile}@phone.local`,
      authority,
    });

    return {
      status: 'ok' as const,
      type: 'mobile',
      currentAuthority: authority,
      accessToken,
    };
  }

  getCurrentUser(authorization?: string) {
    const token = this.extractBearer(authorization);
    if (!token) {
      throw new UnauthorizedException();
    }
    let payload: JwtPayload;
    try {
      payload = this.verifyAccessToken(token);
    } catch {
      throw new UnauthorizedException();
    }

    const email = payload.sub;
    const name = email.split('@')[0] || email;

    return {
      success: true,
      data: {
        name,
        email,
        userid: email,
        access: payload.authority,
        avatar:
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      },
    };
  }

  private extractBearer(authorization?: string): string | null {
    if (!authorization) return null;
    const m = /^Bearer\s+(\S+)$/i.exec(authorization.trim());
    return m?.[1] ?? null;
  }

  private signAccessToken(payload: JwtPayload): string {
    const secret = this.config.getOrThrow<string>('JWT_SECRET');
    return jwt.sign(payload, secret, { expiresIn: '7d' });
  }

  private verifyAccessToken(token: string): JwtPayload {
    const secret = this.config.getOrThrow<string>('JWT_SECRET');
    const decoded = jwt.verify(token, secret);
    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      !('sub' in decoded) ||
      !('authority' in decoded)
    ) {
      throw new Error('Invalid token payload');
    }
    return decoded as JwtPayload;
  }
}
