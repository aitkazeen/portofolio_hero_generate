import { useCallback, useEffect, useState } from 'react';
import { gqlRequest } from '../api/client';
import { PROFILE_QUERY } from '../api/queries';
import type { ProfileDto } from '../api/types';

interface ProfileQueryResult {
  profile: ProfileDto;
}

export type ProfileQueryState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; profile: ProfileDto };

/** Fetches the card's single Profile row from the backend's GraphQL API. */
export function useProfile(): ProfileQueryState & { reload: () => void } {
  const [state, setState] = useState<ProfileQueryState>({ status: 'loading' });

  const load = useCallback(() => {
    setState({ status: 'loading' });
    gqlRequest<ProfileQueryResult>(PROFILE_QUERY)
      .then(({ profile }) => setState({ status: 'success', profile }))
      .catch((error: unknown) => {
        setState({ status: 'error', message: error instanceof Error ? error.message : 'Failed to load profile' });
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
