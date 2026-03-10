import { serviceFactory } from '@/class/service-factory';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

export default function AdminSignupScreen() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        // Validate inputs
        if (!fullName || !email || !adminId || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters');
            return;
        }

        if (!email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        try {
            // Sign up using the auth service
            await serviceFactory.authService.signUp({
                email,
                password,
                fullName,
                role: 'admin',
                adminId,
            });

            Alert.alert(
                'Registration Successful!',
                'Admin account created successfully! You can now login with your credentials.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.push('/AdminLogin'),
                    },
                ]
            );
        } catch (error) {
            console.error('Signup error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
            Alert.alert('Registration Failed', errorMessage);
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
                        <Text style={styles.shieldIcon}>🛡️</Text>
                        <Text style={styles.title}>Admin Registration</Text>
                    </View>

                    {/* Full Name Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter admin full name"
                            placeholderTextColor="#999"
                            value={fullName}
                            onChangeText={setFullName}
                            editable={!isLoading}
                        />
                    </View>

                    {/* Gmail Address Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email Address</Text>
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

                    {/* Admin ID Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Admin ID</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., ADMIN_AIRZA_01"
                            placeholderTextColor="#999"
                            value={adminId}
                            onChangeText={setAdminId}
                            autoCapitalize="characters"
                            editable={!isLoading}
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Min 8 characters"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            editable={!isLoading}
                        />
                    </View>

                    {/* Register Button */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.registerButton,
                            pressed && styles.registerButtonPressed,
                            isLoading && styles.registerButtonDisabled
                        ]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.registerButtonText}>✓ Register Admin</Text>
                        )}
                    </Pressable>

                    {/* Login Link */}
                    <View style={styles.loginLinkContainer}>
                        <Pressable onPress={() => router.push('/AdminLogin')}>
                            <Text style={styles.loginLink}>←  Back to Login</Text>
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
        marginBottom: 32,
    },
    shieldIcon: {
        fontSize: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
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
    registerButton: {
        backgroundColor: '#10b981',
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 8,
    },
    registerButtonPressed: {
        opacity: 0.9,
    },
    registerButtonDisabled: {
        opacity: 0.6,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginText: {
        fontSize: 14,
        color: '#666',
    },
    loginLink: {
        fontSize: 14,
        color: '#1a73e8',
        fontWeight: '600',
    },
});
