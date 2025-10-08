# TaskForm Component

A reusable React component for creating and editing tasks using Ant Design's Drawer component.

## Features

- **Side Drawer Interface**: Clean, spacious form in a side drawer
- **Dual Mode**: Supports both create and edit modes
- **Comprehensive Form**: Includes all required task fields
- **Form Validation**: Built-in validation for required fields
- **Loading States**: Shows loading indicator during submission
- **Auto-population**: Automatically populates form when editing

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `visible` | boolean | Yes | Controls drawer visibility |
| `onClose` | function | Yes | Callback when drawer is closed |
| `onSubmit` | function | Yes | Callback when form is submitted with task data |
| `loading` | boolean | No | Shows loading state during submission |
| `task` | object | No | Task object for edit mode |
| `mode` | string | No | 'create' or 'edit' (default: 'create') |

## Usage

```jsx
import TaskForm from './TaskForm';

const MyComponent = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formMode, setFormMode] = useState('create');

  const handleSubmit = async (taskData) => {
    // Handle form submission
    console.log('Task data:', taskData);
  };

  return (
    <TaskForm
      visible={drawerVisible}
      onClose={() => setDrawerVisible(false)}
      onSubmit={handleSubmit}
      loading={false}
      task={editingTask}
      mode={formMode}
    />
  );
};
```

## Form Fields

### Basic Information
- **Title**: Task title (required)
- **Description**: Task description (required)
- **Media Type**: Type of media required (required)
- **Specific Requirements**: Detailed requirements (required)

### Quantity & Payment
- **Required Quantity**: Number of submissions needed (required)
- **Buffer Quantity**: Extra submissions (optional)
- **Payment Per Submission**: Amount in currency (required)

### Status & Priority
- **Status**: Active/Inactive/Completed (required)
- **Priority**: High/Medium/Low (required)
- **Broadcast Immediately**: Yes/No

### Location Filters (Optional)
- **States**: Multiple selection
- **Cities**: Multiple selection
- **Pincodes**: Multiple selection

### Demographics Filters (Optional)
- **Gender**: Any/Male/Female/Other
- **Age Range**: Min and Max age

## Data Structure

The component transforms form data into the following structure:

```javascript
{
  title: string,
  description: string,
  mediaType: string,
  specificRequirements: string,
  requiredQuantity: number,
  bufferQuantity: number,
  paymentPerSubmission: number,
  status: string,
  filters: {
    location: {
      states: string[],
      cities: string[],
      pincodes: string[]
    },
    gender: string,
    ageRange: {
      min: number,
      max: number
    }
  },
  broadcastOptions: {
    immediate: boolean,
    priority: string
  }
}
```

## Styling

The component uses Ant Design's design system with:
- Consistent spacing and typography
- Responsive layout with proper column grids
- Clear section divisions with dividers
- Professional form styling
