import { BaseService } from '@/class/base-service';
import { buildVoteCommitment, randomNonce } from '@/class/crypto';
import type { CandidateRow, VerifyChainResultRow, VoteBlockRow, VoterRegistryRow } from '@/class/database-types';
import { AuthenticationError } from '@/class/errors';
import type {
    CastVoteInput,
    IAuthRepository,
    ICandidateRepository,
    IVoteLedgerRepository,
    IVoterRegistryRepository,
} from '@/class/service-contracts';

export class VotingService extends BaseService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly candidateRepository: ICandidateRepository,
    private readonly voterRegistryRepository: IVoterRegistryRepository,
    private readonly voteLedgerRepository: IVoteLedgerRepository
  ) {
    super();
  }

  async getElectionCandidates(electionId: string): Promise<CandidateRow[]> {
    this.requireNonEmpty(electionId, 'Election id');
    return this.candidateRepository.listByElection(electionId);
  }

  async getMyRegistryStatus(electionId: string): Promise<VoterRegistryRow | null> {
    this.requireNonEmpty(electionId, 'Election id');

    const userId = await this.authRepository.getCurrentUserId();
    if (!userId) {
      return null;
    }

    return this.voterRegistryRepository.getByElectionAndVoter(electionId, userId);
  }

  async castVote(input: CastVoteInput): Promise<VoteBlockRow> {
    this.requireNonEmpty(input.electionId, 'Election id');
    this.requireNonEmpty(input.candidateId, 'Candidate id');
    this.requireNonEmpty(input.encryptedVote, 'Encrypted vote');

    const userId = await this.authRepository.getCurrentUserId();
    if (!userId) {
      throw new AuthenticationError('User is not authenticated');
    }

    const nonce = input.nonce ?? (await randomNonce());
    const voteCommitment = await buildVoteCommitment(input.electionId, input.candidateId, nonce);

    return this.voteLedgerRepository.castVoteSecure(input.electionId, input.encryptedVote, voteCommitment);
  }

  async verifyElectionChain(electionId: string): Promise<VerifyChainResultRow> {
    this.requireNonEmpty(electionId, 'Election id');
    return this.voteLedgerRepository.verifyChain(electionId);
  }
}
