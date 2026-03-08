import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { supabase } from '@/class/supabase-client';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type DbStatus = 'loading' | 'success' | 'failed';

export default function HomeScreen() {
  const [dbStatus, setDbStatus] = useState<DbStatus>('loading');
  const [dbMessage, setDbMessage] = useState('Checking database connection...');

  useEffect(() => {
    const checkDatabase = async () => {
      setDbStatus('loading');

      const { error } = await supabase.from('elections').select('id').limit(1);

      if (error) {
        setDbStatus('failed');
        setDbMessage(`Database check failed: ${error.message}`);
        return;
      }

      setDbStatus('success');
      setDbMessage('Database is running successfully');
    };

    checkDatabase();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">VoteKro</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Database Status</ThemedText>
        {dbStatus === 'loading' ? (
          <ThemedView style={styles.statusRow}>
            <ActivityIndicator size="small" color="#0a7ea4" />
            <ThemedText>{dbMessage}</ThemedText>
          </ThemedView>
        ) : (
          <ThemedText
            style={dbStatus === 'success' ? styles.successText : styles.errorText}
            type="defaultSemiBold">
            {dbMessage}
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">System Check</ThemedText>
        <ThemedText>
          This screen checks your Supabase connection when the app loads.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Next Step</ThemedText>
        <ThemedText>
          If it shows success, start building admin, voter, and auditor flows.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  successText: {
    color: '#1f9d55',
  },
  errorText: {
    color: '#c53030',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
