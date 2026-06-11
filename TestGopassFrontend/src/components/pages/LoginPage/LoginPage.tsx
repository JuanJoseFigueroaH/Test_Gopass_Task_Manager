'use client';

import { useState } from 'react';
import { useAuthStore } from '@/application/stores/auth.store';
import { Button } from '@/components/atoms/Button/Button';
import { Input } from '@/components/atoms/Input/Input';
import styles from './LoginPage.module.css';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onRegisterClick?: () => void;
  successMessage?: string;
}

export function LoginPage({ onLoginSuccess, onRegisterClick, successMessage }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const result = await login({ email, password });
    if (result.success) {
      onLoginSuccess();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" rx="1" fill="#22c55e"/>
              <rect x="14" y="3" width="7" height="7" rx="1" fill="#22c55e"/>
              <rect x="3" y="14" width="7" height="7" rx="1" fill="#22c55e"/>
              <rect x="14" y="14" width="7" height="7" rx="1" fill="#22c55e"/>
            </svg>
          </div>
          <h1 className={styles.title}>GoPass</h1>
          <p className={styles.subtitle}>Task Manager</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          {successMessage && (
            <div className={styles.success}>
              {successMessage}
            </div>
          )}

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            fullWidth
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>

          {onRegisterClick && (
            <p className={styles.registerLink}>
              ¿No tienes cuenta?{' '}
              <button type="button" onClick={onRegisterClick} className={styles.linkButton}>
                Regístrate aquí
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
