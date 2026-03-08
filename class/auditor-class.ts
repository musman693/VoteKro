import { BaseService } from '@/class/base-service';
import type { AuditLogRow, VerifyChainResultRow, VoteBlockRow } from '@/class/database-types';
import type { IAuditLogRepository, IVoteLedgerRepository } from '@/class/service-contracts';

export class AuditorService extends BaseService {
  constructor(
    private readonly voteLedgerRepository: IVoteLedgerRepository,
    private readonly auditLogRepository: IAuditLogRepository
  ) {
    super();
  }

  async getLedger(electionId: string): Promise<VoteBlockRow[]> {
    this.requireNonEmpty(electionId, 'Election id');
    return this.voteLedgerRepository.listLedger(electionId);
  }

  async verifyLedger(electionId: string): Promise<VerifyChainResultRow> {
    this.requireNonEmpty(electionId, 'Election id');
    return this.voteLedgerRepository.verifyChain(electionId);
  }

  async getAuditLogs(limit = 100): Promise<AuditLogRow[]> {
    return this.auditLogRepository.listRecent(limit);
  }
}
