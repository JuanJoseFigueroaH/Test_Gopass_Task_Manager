import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';
import { Project } from '@/domain/entities/project.entity';

const mockProject: Project = {
  id: '1',
  name: 'Test Project',
  description: 'Test Description',
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  tasks: [],
};

describe('ProjectCard', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders project name', () => {
    render(
      <ProjectCard
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onClick={mockOnClick}
      />
    );
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('renders project description', () => {
    render(
      <ProjectCard
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onClick={mockOnClick}
      />
    );
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('shows Active badge when project is active', () => {
    render(
      <ProjectCard
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onClick={mockOnClick}
      />
    );
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    render(
      <ProjectCard
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onClick={mockOnClick}
      />
    );
    fireEvent.click(screen.getByText('Test Project'));
    expect(mockOnClick).toHaveBeenCalledWith(mockProject);
  });
});
