import { supabase } from '@/lib/services/supabase-client';
import type { CandidateRow, ElectionRow, VoterRegistryRow } from '@/lib/types/database';

export interface CreateElectionInput {
  title: string;
  description?: string;
  startsAtIso: string;
  endsAtIso: string;
}

export interface AddCandidateInput {
  electionId: string;
  displayName: string;
  partyName?: string;
  candidateNumber: number;
}

export class AdminService {
  async createElection(input: CreateElectionInput): Promise<ElectionRow> {
    const { data: authUser, error: userError } = await supabase.auth.getUser();
    if (userError) {
      throw new Error(userError.message);
    }

    if (!authUser.user) {
      throw new Error('User is not authenticated');
    }

    const { data, error } = await supabase
      .from('elections')
      .insert({
        title: input.title,
        description: input.description ?? null,
        starts_at: input.startsAtIso,
        ends_at: input.endsAtIso,
        status: 'draft',
        created_by: authUser.user.id,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as ElectionRow;
  }

  async addCandidate(input: AddCandidateInput): Promise<CandidateRow> {
    const { data, error } = await supabase
      .from('candidates')
      .insert({
        election_id: input.electionId,
        display_name: input.displayName,
        party_name: input.partyName ?? null,
        candidate_number: input.candidateNumber,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as CandidateRow;
  }

  async registerVoterForElection(electionId: string, voterId: string): Promise<VoterRegistryRow> {
    const { data, error } = await supabase
      .from('voter_registry')
      .upsert(
        {
          election_id: electionId,
          voter_id: voterId,
          is_eligible: true,
        },
        { onConflict: 'election_id,voter_id' }
      )
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as VoterRegistryRow;
  }

  async updateElectionStatus(electionId: string, status: ElectionRow['status']): Promise<ElectionRow> {
    const { data, error } = await supabase
      .from('elections')
      .update({ status })
      .eq('id', electionId)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as ElectionRow;
  }
}
