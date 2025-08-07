# Contributing to Multi-Vendor E-Commerce Platform

Thank you for your interest in contributing to our multi-vendor e-commerce platform! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Issue Reporting](#issue-reporting)
- [Security Vulnerabilities](#security-vulnerabilities)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Use welcoming and inclusive language
- Be collaborative and constructive
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git
- Code editor (VS Code recommended)

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/multi-vendor-ecommerce.git
   cd multi-vendor-ecommerce
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/vijaysinghrajput/multi-vendor-ecommerce.git
   ```

4. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   
   # Mobile App
   cd ../mobile-app
   npm install
   ```

5. Set up environment variables (see `docs/ENV_SETUP.md`)

6. Start development servers:
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run start:dev
   
   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   
   # Mobile App (Terminal 3)
   cd mobile-app
   npx expo start
   ```

## Development Workflow

### 1. Sync with Upstream

Before starting work, sync your fork:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 2. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Write clean, readable code
- Follow coding standards
- Add tests for new functionality
- Update documentation as needed

### 4. Test Your Changes

```bash
# Backend tests
cd backend
npm run test
npm run test:e2e
npm run lint

# Frontend tests
cd frontend
npm run test
npm run lint
npm run build

# Mobile tests
cd mobile-app
npm run test
npm run lint
```

### 5. Commit and Push

```bash
git add .
git commit -m "feat: add new feature description"
git push origin feature/your-feature-name
```

### 6. Create Pull Request

Create a pull request from your feature branch to the `dev` branch.

## Branch Naming Convention

Use the following naming convention for branches:

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes
- `docs/documentation-update` - Documentation updates
- `refactor/code-improvement` - Code refactoring
- `test/test-improvement` - Test improvements
- `chore/maintenance-task` - Maintenance tasks

### Examples

- `feature/user-authentication`
- `fix/payment-gateway-error`
- `hotfix/security-vulnerability`
- `docs/api-documentation`
- `refactor/user-service`

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `perf` - Performance improvements
- `ci` - CI/CD changes
- `build` - Build system changes

### Examples

```
feat(auth): add JWT token refresh functionality

fix(payment): resolve Razorpay webhook validation issue

docs(api): update authentication endpoints documentation

refactor(user): simplify user profile update logic

test(orders): add unit tests for order service

chore(deps): update dependencies to latest versions
```

## Pull Request Process

### Before Creating a PR

- [ ] Ensure your branch is up to date with `dev`
- [ ] Run all tests and ensure they pass
- [ ] Run linting and fix any issues
- [ ] Update documentation if needed
- [ ] Add/update tests for new functionality

### PR Requirements

- [ ] Clear title and description
- [ ] Link to related issues
- [ ] Screenshots/videos for UI changes
- [ ] Test instructions
- [ ] Breaking changes documented
- [ ] Security implications considered

### Review Process

1. **Automated Checks**: CI/CD pipeline runs automatically
2. **Code Review**: At least one team member reviews
3. **Testing**: Reviewer tests the functionality
4. **Approval**: PR approved by reviewer(s)
5. **Merge**: PR merged to target branch

### Merge Strategy

- Use "Squash and merge" for feature branches
- Use "Merge commit" for release branches
- Delete feature branches after merging

## Code Style Guidelines

### General Principles

- Write clean, readable, and maintainable code
- Follow SOLID principles
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Remove unused code and imports

### Backend (NestJS/TypeScript)

- Use TypeScript strict mode
- Follow NestJS conventions
- Use decorators appropriately
- Implement proper error handling
- Use DTOs for validation
- Follow RESTful API design

```typescript
// Good
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }
}

// Bad
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id) {
    return this.usersService.findOne(id);
  }
}
```

### Frontend (Next.js/React/TypeScript)

- Use functional components with hooks
- Implement proper TypeScript types
- Use Material-UI components consistently
- Follow React best practices
- Implement proper error boundaries

```tsx
// Good
interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: UserUpdateData) => {
    setLoading(true);
    try {
      const updatedUser = await updateUser(data);
      onUpdate(updatedUser);
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      {/* Component JSX */}
    </Card>
  );
};
```

### Mobile App (React Native/Expo)

- Use React Native best practices
- Implement platform-specific code when needed
- Use Expo SDK components
- Follow mobile UI/UX guidelines
- Implement proper navigation

## Testing Guidelines

### Backend Testing

- Write unit tests for services and utilities
- Write integration tests for controllers
- Write e2e tests for critical user flows
- Use Jest and Supertest
- Aim for 80%+ code coverage

```typescript
// Unit test example
describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should create a user', async () => {
    const userData = { email: 'test@example.com', name: 'Test User' };
    const savedUser = { id: '1', ...userData };
    
    jest.spyOn(repository, 'save').mockResolvedValue(savedUser as User);
    
    const result = await service.create(userData);
    
    expect(result).toEqual(savedUser);
    expect(repository.save).toHaveBeenCalledWith(userData);
  });
});
```

### Frontend Testing

- Write unit tests for components
- Write integration tests for pages
- Use React Testing Library
- Test user interactions
- Mock API calls

```tsx
// Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  };

  it('should display user information', () => {
    render(<UserProfile user={mockUser} onUpdate={jest.fn()} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should call onUpdate when form is submitted', () => {
    const mockOnUpdate = jest.fn();
    render(<UserProfile user={mockUser} onUpdate={mockOnUpdate} />);
    
    fireEvent.click(screen.getByText('Update Profile'));
    
    expect(mockOnUpdate).toHaveBeenCalled();
  });
});
```

## Documentation Guidelines

### Code Documentation

- Add JSDoc comments for public APIs
- Document complex algorithms
- Include examples in documentation
- Keep documentation up to date

### API Documentation

- Use Swagger/OpenAPI for backend APIs
- Include request/response examples
- Document error responses
- Provide authentication details

### README Updates

- Update setup instructions if needed
- Add new features to feature list
- Update dependencies if changed
- Include migration guides for breaking changes

## Issue Reporting

### Before Creating an Issue

- Search existing issues
- Check if it's already fixed in latest version
- Gather relevant information

### Bug Reports

Use the bug report template and include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots/videos if applicable
- Error messages and logs

### Feature Requests

Use the feature request template and include:

- Clear description of the feature
- Problem it solves
- Proposed solution
- User stories
- Acceptance criteria

## Security Vulnerabilities

### Reporting Security Issues

**DO NOT** create public issues for security vulnerabilities.

Instead:

1. Email security concerns to: security@yourcompany.com
2. Include detailed description
3. Provide steps to reproduce
4. Include potential impact assessment

### Security Best Practices

- Never commit secrets or credentials
- Use environment variables for sensitive data
- Validate all user inputs
- Implement proper authentication and authorization
- Use HTTPS in production
- Keep dependencies updated
- Follow OWASP guidelines

## Getting Help

### Resources

- [Project Documentation](./docs/)
- [API Documentation](http://localhost:3000/api/docs)
- [Environment Setup Guide](./docs/ENV_SETUP.md)

### Communication

- GitHub Issues for bugs and features
- GitHub Discussions for questions
- Pull Request comments for code review
- Email for security issues

### Team Members

- **Project Lead**: @username
- **Backend Lead**: @username
- **Frontend Lead**: @username
- **Mobile Lead**: @username
- **DevOps Lead**: @username

## Recognition

We appreciate all contributions! Contributors will be:

- Listed in the project README
- Mentioned in release notes
- Invited to team discussions
- Considered for maintainer roles

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to our multi-vendor e-commerce platform! 🚀