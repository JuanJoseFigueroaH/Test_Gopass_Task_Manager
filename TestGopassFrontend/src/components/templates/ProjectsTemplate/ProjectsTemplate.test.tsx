import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectsTemplate } from './ProjectsTemplate';

describe('ProjectsTemplate', () => {
  const defaultProps = {
    title: 'Projects',
    subtitle: 'Manage your projects',
    onCreateClick: jest.fn(),
    isLoading: false,
    isEmpty: false,
    emptyMessage: 'No projects',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and subtitle', () => {
    render(<ProjectsTemplate {...defaultProps}>Content</ProjectsTemplate>);
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Manage your projects')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<ProjectsTemplate {...defaultProps} isLoading>Content</ProjectsTemplate>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<ProjectsTemplate {...defaultProps} isEmpty>Content</ProjectsTemplate>);
    expect(screen.getByText('No projects')).toBeInTheDocument();
  });

  it('renders children when not empty', () => {
    render(
      <ProjectsTemplate {...defaultProps}>
        <div data-testid="project-card">Project</div>
      </ProjectsTemplate>
    );
    expect(screen.getByTestId('project-card')).toBeInTheDocument();
  });

  it('calls onCreateClick when button is clicked', () => {
    render(<ProjectsTemplate {...defaultProps}>Content</ProjectsTemplate>);
    fireEvent.click(screen.getByText('New Project'));
    expect(defaultProps.onCreateClick).toHaveBeenCalled();
  });
});
