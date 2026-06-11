import { render, screen } from '@testing-library/react';
import { ProjectsPage } from './ProjectsPage';

jest.mock('@/application/stores/project.store', () => ({
  useProjectStore: () => ({
    projects: [],
    isLoading: false,
    fetchProjects: jest.fn(),
    createProject: jest.fn(),
    updateProject: jest.fn(),
    deleteProject: jest.fn(),
  }),
}));

jest.mock('@/components/templates/MainTemplate/MainTemplate', () => ({
  MainTemplate: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/templates/ProjectsTemplate/ProjectsTemplate', () => ({
  ProjectsTemplate: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

describe('ProjectsPage', () => {
  const mockOnProjectSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders projects page', () => {
    render(<ProjectsPage onProjectSelect={mockOnProjectSelect} />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });
});
