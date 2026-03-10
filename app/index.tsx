import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
    const router = useRouter();

    const handleAdminLogin = () => {
        router.push('/AdminLogin');
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <ThemedText type="title" style={styles.title}>VoteKro</ThemedText>
                <ThemedText style={styles.subtitle}>Secure Digital Voting System</ThemedText>

                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed
                    ]}
                    onPress={handleAdminLogin}
                >
                    <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                        Login as Admin
                    </ThemedText>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#ADD8E6',
        borderRadius: 16,
        padding: 40,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        color: '#1a1a1a',
        marginBottom: 8,
    },
    subtitle: {
        color: '#333333',
        marginBottom: 32,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#0a7ea4',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 8,
        minWidth: 200,
        alignItems: 'center',
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});
