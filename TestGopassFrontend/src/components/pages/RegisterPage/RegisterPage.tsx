'use client';

import { useState } from 'react';
import { useAuthStore } from '@/application/stores/auth.store';
import { Button } from '@/components/atoms/Button/Button';
import { Input } from '@/components/atoms/Input/Input';
import styles from '../LoginPage/LoginPage.module.css';

interface RegisterPageProps {
  onRegisterSuccess: () => void;
  onLoginClick?: () => void;
}

export function RegisterPage({ onRegisterSuccess, onLoginClick }: RegisterPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [localError, setLocalError] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const result = await register({ email, password, firstName, lastName });
    if (result.success) {
      onRegisterSuccess();
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
          <p className={styles.subtitle}>Crear Cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="firstName" className={styles.label}>Nombre</label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Juan"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="lastName" className={styles.label}>Apellido</label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Pérez"
              required
              disabled={isLoading}
            />
          </div>

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

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirmar Contraseña</label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          {(error || localError) && (
            <div className={styles.error}>
              {localError || error}
            </div>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            fullWidth
          >
            {isLoading ? 'Registrando...' : 'Crear Cuenta'}
          </Button>

          {onLoginClick && (
            <p className={styles.registerLink}>
              ¿Ya tienes cuenta?{' '}
              <button type="button" onClick={onLoginClick} className={styles.linkButton}>
                Inicia sesión
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
