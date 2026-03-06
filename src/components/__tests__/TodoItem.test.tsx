import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from '@/components/TodoItem';
import { Todo } from '@/types/todo';

const mockTodo: Todo = {
    id: 1,
    todo: 'Test task',
    completed: false,
    userId: 1,
};

describe('TodoItem', () => {
    const onToggleMock = jest.fn();
    const onDeleteMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the todo item text correctly', () => {
        render(<TodoItem todo={mockTodo} onToggle={onToggleMock} onDelete={onDeleteMock} />);
        expect(screen.getByText('Test task')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('renders completed todo with line-through', () => {
        const completedTodo = { ...mockTodo, completed: true };
        render(<TodoItem todo={completedTodo} onToggle={onToggleMock} onDelete={onDeleteMock} />);

        expect(screen.getByText('Test task')).toHaveClass('line-through');
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('calls onToggle when checkbox is clicked', () => {
        render(<TodoItem todo={mockTodo} onToggle={onToggleMock} onDelete={onDeleteMock} />);

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        expect(onToggleMock).toHaveBeenCalledWith(1, true);
    });

    it('opens alert dialog and calls onDelete when confirmed', () => {
        render(<TodoItem todo={mockTodo} onToggle={onToggleMock} onDelete={onDeleteMock} />);

        // Click delete button
        const deleteButton = screen.getByRole('button', { name: /eliminar tarea/i });
        fireEvent.click(deleteButton);

        // Verify dialog opens
        expect(screen.getByText('¿Eliminar tarea?')).toBeInTheDocument();

        // Click confirm in dialog
        const confirmButton = screen.getByRole('button', { name: /^eliminar$/i });
        fireEvent.click(confirmButton);

        expect(onDeleteMock).toHaveBeenCalledWith(1);
    });
});
