import { ClipboardList } from 'lucide-react';

interface EmptyStateProps {
    message?: string;
    description?: string;
}

export function EmptyState({
    message = 'No hay tareas',
    description = 'Empieza agregando una nueva tarea a tu lista.'
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50">
            <div className="h-14 w-14 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-4 text-slate-400">
                <ClipboardList className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">{message}</h3>
            <p className="text-sm text-slate-500 max-w-sm">{description}</p>
        </div>
    );
}
