import { Todo } from '@/types/todo';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number, completed: boolean) => void;
    onDelete: (id: number) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    return (
        <div className="flex items-center justify-between p-4 mb-3 bg-white rounded-lg shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
                <Checkbox
                    checked={todo.completed}
                    onCheckedChange={(checked) => onToggle(todo.id, checked === true)}
                    id={`todo-${todo.id}`}
                    className="h-5 w-5"
                />
                <label
                    htmlFor={`todo-${todo.id}`}
                    className={`text-sm font-medium transition-colors cursor-pointer select-none ${todo.completed ? 'line-through text-slate-400' : 'text-slate-700'
                        }`}
                >
                    {todo.todo}
                </label>
            </div>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors h-8 w-8"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar tarea</span>
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar tarea?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto borrará la tarea "{todo.todo}" de tu lista.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(todo.id)} className="bg-red-500 text-white hover:bg-red-600">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
