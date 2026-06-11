'use client';

import { useState } from 'react';
import { ProjectsPage } from '@/components/pages/ProjectsPage/ProjectsPage';
import { TasksPage } from '@/components/pages/TasksPage/TasksPage';
import { LoginPage } from '@/components/pages/LoginPage/LoginPage';
import { RegisterPage } from '@/components/pages/RegisterPage/RegisterPage';
import { Project } from '@/domain/entities/project.entity';
import { useAuthStore } from '@/application/stores/auth.store';

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { isAuthenticated } = useAuthStore();

  const handleRegisterSuccess = () => {
    setSuccessMessage('Registro exitoso. Por favor inicia sesión.');
    setShowRegister(false);
  };

  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <RegisterPage 
          onRegisterSuccess={handleRegisterSuccess} 
          onLoginClick={() => setShowRegister(false)}
        />
      );
    }
    return (
      <LoginPage 
        onLoginSuccess={() => {}} 
        onRegisterClick={() => setShowRegister(true)}
        successMessage={successMessage}
      />
    );
  }

  if (selectedProject) {
    return (
      <TasksPage
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return <ProjectsPage onProjectSelect={setSelectedProject} />;
}
