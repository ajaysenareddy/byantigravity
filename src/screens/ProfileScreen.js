import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                </View>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
            </View>

            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="person-outline" size={24} color={COLORS.text} />
                    <Text style={styles.menuText}>Edit Profile</Text>
                    <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="card-outline" size={24} color={COLORS.text} />
                    <Text style={styles.menuText}>Payment Methods</Text>
                    <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="settings-outline" size={24} color={COLORS.text} />
                    <Text style={styles.menuText}>Settings</Text>
                    <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={logout}>
                    <Ionicons name="log-out-outline" size={24} color={COLORS.danger} />
                    <Text style={[styles.menuText, styles.logoutText]}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: COLORS.lightGray,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: COLORS.gray,
    },
    menu: {
        marginTop: 20,
        backgroundColor: COLORS.white,
        paddingVertical: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        marginLeft: 16,
    },
    logoutText: {
        color: COLORS.danger,
    },
});

export default ProfileScreen;
