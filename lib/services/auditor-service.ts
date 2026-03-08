import { supabase } from '@/lib/services/supabase-client';
import type { AuditLogRow, VerifyChainResultRow, VoteBlockRow } from '@/lib/types/database';

export class AuditorService {
  async getLedger(electionId: string): Promise<VoteBlockRow[]> {
    const { data, error } = await supabase
      .from('vote_blocks')
      .select('*')
      .eq('election_id', electionId)
      .order('block_index', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as VoteBlockRow[];
  }

  async verifyLedger(electionId: string): Promise<VerifyChainResultRow> {
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

  async getAuditLogs(limit = 100): Promise<AuditLogRow[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as AuditLogRow[];
  }
}
