import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

type UserRole = 'admin' | 'auditor';

export default function LoginScreen() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<UserRole>('admin'); // Default to admin role
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const route = selectedRole === 'admin' ? '/AdminDashboard' : '/AuditorDashboard'; // Ternary to determine route based on selected role
        router.push(route);
        console.log('Login pressed', { role: selectedRole, adminId, password });
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
                    <Text style={styles.subtitle}>Choose role and login</Text>

                    {/* Role Tabs */}
                    <View style={styles.tabContainer}>
                        <Pressable
                            style={[
                                styles.tab,
                                selectedRole === 'admin' && styles.tabActive
                            ]}
                            onPress={() => setSelectedRole('admin')}
                        >
                            <Text style={[
                                styles.tabText,
                                selectedRole === 'admin' && styles.tabTextActive
                            ]}>
                                Admin
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.tab,
                                selectedRole === 'auditor' && styles.tabActive
                            ]}
                            onPress={() => setSelectedRole('auditor')}
                        >
                            <Text style={[
                                styles.tabText,
                                selectedRole === 'auditor' && styles.tabTextActive
                            ]}>
                                Auditor
                            </Text>
                        </Pressable>
                    </View>

                    {/* Admin ID Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Admin ID</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type ADMIN01"
                            placeholderTextColor="#999"
                            value={adminId}
                            onChangeText={setAdminId}
                            autoCapitalize="characters"
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
                        />
                    </View>

                    {/* Login Button */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.loginButton,
                            pressed && styles.loginButtonPressed
                        ]}
                        onPress={handleLogin}
                    >
                        <Text style={styles.loginButtonText}>Login</Text>
                    </Pressable>

                    {/* Register Link - Only show for Admin */}
                    {selectedRole === 'admin' && (
                        <View style={styles.registerLinkContainer}>
                            <Text style={styles.registerText}>Don't have an account? </Text>
                            <Pressable onPress={() => router.push('/AdminSignup')}>
                                <Text style={styles.registerLink}>Register here</Text>
                            </Pressable>
                        </View>
                    )}
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
        borderBottomWidth: 1,
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
        color: '#333',
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
    tabContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: '#1a73e8',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
    },
    tabTextActive: {
        color: '#fff',
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
