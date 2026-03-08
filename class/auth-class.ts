import { BaseService } from '@/class/base-service';
import type { ProfileRow } from '@/class/database-types';
import { AuthenticationError } from '@/class/errors';
import type { IAuthRepository, IProfileRepository } from '@/class/service-contracts';

export class AuthService extends BaseService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly profileRepository: IProfileRepository
  ) {
    super();
  }

  async signIn(email: string, password: string): Promise<void> {
    this.requireNonEmpty(email, 'Email');
    this.requireNonEmpty(password, 'Password');
    await this.authRepository.signIn(email, password);
  }

  async signOut(): Promise<void> {
    await this.authRepository.signOut();
  }

  async getCurrentProfile(): Promise<ProfileRow | null> {
    const userId = await this.authRepository.getCurrentUserId();
    if (!userId) {
      return null;
    }

    return this.profileRepository.getByUserId(userId);
  }

  async requireCurrentUserId(): Promise<string> {
    const userId = await this.authRepository.getCurrentUserId();
    if (!userId) {
      throw new AuthenticationError('User is not authenticated');
    }

    return userId;
  }
}
