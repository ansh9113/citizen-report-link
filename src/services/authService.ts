
// Types
export interface User {
    id: string;
    name: string;
    email?: string;
    mobile?: string;
    role: 'citizen' | 'admin';
    address?: string;
    department?: string;
    designation?: string;
    password?: string; // In real app, this would be hashed!
}

export interface AuthResponse {
    user: Omit<User, 'password'>;
    token: string;
}

const DELAY = 800; // ms to simulate network

// Storage Keys
const USERS_KEY = 'cr_users';
const CURRENT_USER_KEY = 'cr_current_user';

// Helper to sleep
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: Get users
const getUsers = (): User[] => {
    const usersStr = localStorage.getItem(USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
};

// Helper: Save users
const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
    // REGISTER
    register: async (userData: Omit<User, 'id'>): Promise<AuthResponse> => {
        await sleep(DELAY);
        const users = getUsers();

        // Check duplicates
        if (userData.mobile && users.find(u => u.mobile === userData.mobile)) {
            throw new Error('User with this mobile number already exists');
        }
        if (userData.email && users.find(u => u.email === userData.email)) {
            throw new Error('User with this email already exists');
        }

        const newUser: User = {
            ...userData,
            id: crypto.randomUUID(),
        };

        users.push(newUser);
        saveUsers(users);

        const { password, ...userWithoutPass } = newUser;
        const response = { user: userWithoutPass, token: 'mock-jwt-token-' + newUser.id };

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response));
        return response;
    },

    // LOGIN
    login: async (identifier: string, password: string): Promise<AuthResponse> => {
        await sleep(DELAY);
        const users = getUsers();

        const user = users.find(u =>
            (u.mobile === identifier || u.email === identifier) && u.password === password
        );

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const { password: _, ...userWithoutPass } = user;
        const response = { user: userWithoutPass, token: 'mock-jwt-token-' + user.id };

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response));
        return response;
    },

    // LOGOUT
    logout: async () => {
        await sleep(300);
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    // GET CURRENT SESSION
    getCurrentUser: (): AuthResponse | null => {
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    // UPDATE PROFILE
    updateProfile: async (userId: string, updates: Partial<User>): Promise<AuthResponse> => {
        await sleep(DELAY);
        const users = getUsers();
        const index = users.findIndex(u => u.id === userId);

        if (index === -1) throw new Error('User not found');

        const updatedUser = { ...users[index], ...updates };
        users[index] = updatedUser;
        saveUsers(users);

        const { password: _, ...userWithoutPass } = updatedUser;
        const response = {
            user: userWithoutPass,
            token: localStorage.getItem(CURRENT_USER_KEY) ? JSON.parse(localStorage.getItem(CURRENT_USER_KEY)!).token : 'token'
        };

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response));
        return response;
    },

    // GET ALL USERS (For Admin Analytics)
    getAllUsers: async (): Promise<User[]> => {
        await sleep(DELAY);
        return getUsers();
    }
};
