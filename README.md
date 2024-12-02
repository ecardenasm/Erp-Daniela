# Proyecto Diana ERP

An Enterprise Resource Planning (ERP) system built with React, TypeScript, and Hexagonal Architecture.

## Architecture Overview

This project follows a Hexagonal Architecture (Ports and Adapters) pattern combined with Atomic Design principles for the UI components.

### Core Domains

- **Production Management**: Controls and monitors production lines
- **Quality Control**: Tracks product quality metrics
- **Inventory Management**: Manages raw materials and finished products
- **Supplier Management**: Handles supplier relationships
- **Employee Management**: Manages workforce and scheduling
- **Machinery Management**: Tracks equipment status and maintenance

### Project Structure

```
src/
├── core/                     # Domain logic and business rules
│   ├── ports/               # Interface definitions
│   ├── domain/              # Domain entities and logic
│   └── services/            # Application services
├── infrastructure/          # External implementations
│   ├── api/                 # API clients
│   └── repositories/        # Data storage implementations
├── ui/                      # User interface components
│   ├── atoms/              # Basic UI elements
│   ├── molecules/          # Simple component combinations
│   ├── organisms/          # Complex components
│   ├── templates/          # Page layouts
│   └── pages/              # Full pages
└── shared/                 # Shared utilities and types
```

### Key Features

- **Real-time Production Monitoring**: Live tracking of production lines
- **Quality Control Dashboard**: Quality metrics visualization
- **Inventory Management**: Stock level tracking and alerts
- **Supplier Portal**: Supplier relationship management
- **Employee Management**: Workforce scheduling and management
- **Machinery Maintenance**: Equipment status monitoring

### Technical Stack

- **Frontend**: React + TypeScript
- **State Management**: React Context + Custom Hooks
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

### Module Details

#### Production Module
- Real-time production line monitoring
- Production rate tracking
- Capacity management
- Status indicators

#### Quality Module
- Quality metrics dashboard
- Defect tracking
- Quality trend analysis
- Inspection reports

#### Inventory Module
- Stock level monitoring
- Automatic reorder alerts
- Inventory forecasting
- Stock movement tracking

#### Suppliers Module
- Supplier categorization
- Performance tracking
- Order management
- Contact information

#### Employees Module
- Shift management
- Personnel requests
- Attendance tracking
- Role assignments

#### Machinery Module
- Equipment status monitoring
- Maintenance scheduling
- Performance metrics
- Alert system

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Best Practices

- **Component Composition**: Use atomic design principles
- **State Management**: Implement domain-driven design
- **Error Handling**: Centralized error management
- **Type Safety**: Strict TypeScript usage
- **Testing**: Unit and integration tests
- **Performance**: Lazy loading and code splitting
