import { buildVoteCommitment, randomNonce } from '@/lib/security/crypto';
import { supabase } from '@/lib/services/supabase-client';
import type { CandidateRow, VerifyChainResultRow, VoteBlockRow, VoterRegistryRow } from '@/lib/types/database';

export interface CastVoteInput {
  electionId: string;
  candidateId: string;
  encryptedVote: string;
  nonce?: string;
}

export class VotingService {
  async getElectionCandidates(electionId: string): Promise<CandidateRow[]> {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('election_id', electionId)
      .order('candidate_number', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as CandidateRow[];
  }

  async getMyRegistryStatus(electionId: string): Promise<VoterRegistryRow | null> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(userError.message);
    }

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('voter_registry')
      .select('*')
      .eq('election_id', electionId)
      .eq('voter_id', user.id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return (data as VoterRegistryRow | null) ?? null;
  }

  async castVote(input: CastVoteInput): Promise<VoteBlockRow> {
    const nonce = input.nonce ?? (await randomNonce());
    const voteCommitment = await buildVoteCommitment(input.electionId, input.candidateId, nonce);

    const { data, error } = await supabase.rpc('cast_vote_secure', {
      p_election_id: input.electionId,
      p_encrypted_vote: input.encryptedVote,
      p_vote_commitment: voteCommitment,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data as VoteBlockRow;
  }

  async verifyElectionChain(electionId: string): Promise<VerifyChainResultRow> {
    const { data, error } = await supabase.rpc('verify_chain', {
      p_election_id: electionId,
    });

    if (error) {
      throw new Error(error.message);
    }

    const rows = (data ?? []) as VerifyChainResultRow[];
    if (!rows[0]) {
      return {
        is_valid: false,
        invalid_block_index: null,
        reason: 'No verification result returned',
      };
    }

    return rows[0];
  }
}
