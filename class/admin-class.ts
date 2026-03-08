import { AuthService } from '@/class/auth-class';
import { BaseService } from '@/class/base-service';
import type { CandidateRow, ElectionRow, VoterRegistryRow } from '@/class/database-types';
import type {
    AddCandidateInput,
    CreateElectionInput,
    ICandidateRepository,
    IElectionRepository,
    IVoterRegistryRepository,
} from '@/class/service-contracts';

export class AdminService extends BaseService {
  constructor(
    private readonly authService: AuthService,
    private readonly electionRepository: IElectionRepository,
    private readonly candidateRepository: ICandidateRepository,
    private readonly voterRegistryRepository: IVoterRegistryRepository
  ) {
    super();
  }

  async createElection(input: CreateElectionInput): Promise<ElectionRow> {
    this.requireNonEmpty(input.title, 'Election title');
    this.requireValidDateRange(input.startsAtIso, input.endsAtIso);

    const userId = await this.authService.requireCurrentUserId();
    return this.electionRepository.create(input, userId);
  }

  async addCandidate(input: AddCandidateInput): Promise<CandidateRow> {
    this.requireNonEmpty(input.electionId, 'Election id');
    this.requireNonEmpty(input.displayName, 'Candidate name');

    return this.candidateRepository.create(input);
  }

  async registerVoterForElection(electionId: string, voterId: string): Promise<VoterRegistryRow> {
    this.requireNonEmpty(electionId, 'Election id');
    this.requireNonEmpty(voterId, 'Voter id');

    return this.voterRegistryRepository.registerEligible(electionId, voterId);
  }

  async updateElectionStatus(electionId: string, status: ElectionRow['status']): Promise<ElectionRow> {
    this.requireNonEmpty(electionId, 'Election id');
    return this.electionRepository.updateStatus(electionId, status);
  }
}
