(function () {
    'use strict';

    const sb = window._supabase;

    window.ARIVINE_AUTH = {
        async signUp(email, password, fullName) {
            const { data, error } = await sb.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });
            return { data, error };
        },

        async signIn(email, password) {
            const { data, error } = await sb.auth.signInWithPassword({
                email,
                password
            });
            return { data, error };
        },

        async signOut() {
            const { error } = await sb.auth.signOut();
            if (!error) {
                window.location.href = 'index.html';
            }
            return { error };
        },

        async getSession() {
            const { data, error } = await sb.auth.getSession();
            return data.session;
        },

        async getUser() {
            const { data: { user } } = await sb.auth.getUser();
            return user;
        },

        onAuthStateChange(callback) {
            return sb.auth.onAuthStateChange(callback);
        }
    };

    // Update Navigation based on Auth Status
    async function updateAuthNavigation() {
        const session = await window.ARIVINE_AUTH.getSession();
        const navRight = document.querySelector('.nav-right');
        if (!navRight) return;

        // Find or create Login/Account link
        let authLink = document.getElementById('auth-link');
        if (!authLink) {
            authLink = document.createElement('a');
            authLink.id = 'auth-link';
            authLink.className = 'nav-link';
            // Insert before Cart
            const cartLink = navRight.querySelector('.cart-link');
            navRight.insertBefore(authLink, cartLink);
        }

        if (session) {
            authLink.textContent = 'Account';
            authLink.href = 'account.html';
        } else {
            authLink.textContent = 'Login';
            authLink.href = 'login.html';
        }
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateAuthNavigation);
    } else {
        updateAuthNavigation();
    }

    // Handle redirection for account page
    if (window.location.pathname.endsWith('account.html')) {
        (async () => {
            const session = await window.ARIVINE_AUTH.getSession();
            if (!session) {
                window.location.href = 'login.html';
            }
        })();
    }

    // Also update on auth state change
    sb.auth.onAuthStateChange((event, session) => {
        updateAuthNavigation();
        if (event === 'SIGNED_OUT' && window.location.pathname.endsWith('account.html')) {
            window.location.href = 'index.html';
        }
    });

})();
