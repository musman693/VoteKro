import { serviceFactory } from '@/class/service-factory';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            console.log('Attempting login for:', email);

            // Sign in using the auth service
            await serviceFactory.authService.signIn(email, password);

            console.log('Login successful, fetching profile...');

            // Get the user profile to check their role
            const profile = await serviceFactory.authService.getCurrentProfile();

            console.log('Profile fetched:', profile);

            if (!profile) {
                Alert.alert('Error', 'Profile not found. Please contact support.');
                await serviceFactory.authService.signOut();
                return;
            }

            // Check if the user is an admin
            if (profile.role !== 'admin') {
                Alert.alert('Error', 'This account is not registered as admin.');
                await serviceFactory.authService.signOut();
                return;
            }

            // Navigate to admin dashboard
            console.log('Navigating to dashboard...');
            router.push('/AdminDashboard');
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';

            // Check for common error messages
            if (errorMessage.includes('Email not confirmed')) {
                Alert.alert(
                    'Email Not Verified',
                    'Please check your email and click the verification link before logging in.'
                );
            } else if (errorMessage.includes('Invalid login credentials')) {
                Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
            } else {
                Alert.alert('Login Failed', errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoHome = () => {
        router.push('/');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 16 }]}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('@/assets/images/icon.png')}
                        style={styles.logoIcon}
                    />
                    <Text style={styles.logoText}>VoteKro</Text>
                </View>
                <Pressable
                    style={({ pressed }) => [
                        styles.homeButton,
                        pressed && styles.homeButtonPressed
                    ]}
                    onPress={handleGoHome}
                >
                    <Text style={styles.homeButtonText}>← Home</Text>
                </Pressable>
            </View>

            {/* Main Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    {/* Title */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.lockIcon}>🔐</Text>
                        <Text style={styles.title}>Login</Text>
                    </View>

                    {/* Subtitle */}
                    <Text style={styles.subtitle}>Admin Login</Text>

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="admin@example.com"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!isLoading}
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter password"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            editable={!isLoading}
                        />
                    </View>

                    {/* Login Button */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.loginButton,
                            pressed && styles.loginButtonPressed,
                            isLoading && styles.loginButtonDisabled
                        ]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginButtonText}>Login</Text>
                        )}
                    </Pressable>

                    {/* Register Link */}
                    <View style={styles.registerLinkContainer}>
                        <Text style={styles.registerText}>Don't have an account? </Text>
                        <Pressable onPress={() => router.push('/AdminSignup')}>
                            <Text style={styles.registerLink}>Register here</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 3,
        borderBottomColor: '#1a73e8',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoIcon: {
        width: 24,
        height: 24,
    },
    logoText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a73e8',
    },
    homeButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#1a73e8',
    },
    homeButtonPressed: {
        backgroundColor: '#f0f0f0',
    },
    homeButtonText: {
        fontSize: 14,
        color: '#1a73e8',
        fontWeight: '500',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 32,
        width: '100%',
        maxWidth: 440,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 8,
    },
    lockIcon: {
        fontSize: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d0d0d0',
        borderRadius: 6,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1a1a1a',
    },
    loginButton: {
        backgroundColor: '#1a73e8',
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 8,
    },
    loginButtonPressed: {
        opacity: 0.9,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    registerLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    registerText: {
        fontSize: 14,
        color: '#666',
    },
    registerLink: {
        fontSize: 14,
        color: '#1a73e8',
        fontWeight: '600',
    },
});
