'use client';

import { Task, TaskStatus, TaskPriority } from '@/domain/entities/project.entity';
import { Badge } from '@/components/atoms/Badge/Badge';
import { CheckCircle, Clock, AlertCircle, XCircle, Trash2, Edit } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const statusConfig = {
  [TaskStatus.PENDING]: { icon: Clock, variant: 'default' as const, label: 'Pending' },
  [TaskStatus.IN_PROGRESS]: { icon: AlertCircle, variant: 'warning' as const, label: 'In Progress' },
  [TaskStatus.COMPLETED]: { icon: CheckCircle, variant: 'success' as const, label: 'Completed' },
  [TaskStatus.CANCELLED]: { icon: XCircle, variant: 'danger' as const, label: 'Cancelled' },
};

const priorityConfig = {
  [TaskPriority.LOW]: { variant: 'default' as const, label: 'Low' },
  [TaskPriority.MEDIUM]: { variant: 'info' as const, label: 'Medium' },
  [TaskPriority.HIGH]: { variant: 'warning' as const, label: 'High' },
  [TaskPriority.URGENT]: { variant: 'danger' as const, label: 'Urgent' },
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const statusInfo = statusConfig[task.status] || statusConfig[TaskStatus.PENDING];
  const priorityInfo = priorityConfig[task.priority] || priorityConfig[TaskPriority.MEDIUM];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-gopass-black-700 border border-gopass-black-500 rounded-lg p-4 hover:border-gopass-green-500/50 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const nextStatus = task.status === TaskStatus.COMPLETED 
                ? TaskStatus.PENDING 
                : TaskStatus.COMPLETED;
              onStatusChange(task.id, nextStatus);
            }}
            className="p-1 hover:bg-gopass-black-600 rounded transition-colors"
          >
            <StatusIcon className={`w-5 h-5 ${
              task.status === TaskStatus.COMPLETED ? 'text-gopass-green-400' : 'text-gray-400'
            }`} />
          </button>
          <h4 className={`font-medium ${
            task.status === TaskStatus.COMPLETED ? 'text-gray-500 line-through' : 'text-white'
          }`}>
            {task.title}
          </h4>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 hover:bg-gopass-black-600 rounded transition-colors"
          >
            <Edit className="w-3.5 h-3.5 text-gray-400 hover:text-gopass-green-400" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 hover:bg-gopass-black-600 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>
      {task.description && (
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={statusInfo.variant}>
          {statusInfo.label}
        </Badge>
        <Badge variant={priorityInfo.variant}>
          {priorityInfo.label}
        </Badge>
        {task.dueDate && (
          <span className="text-xs text-gray-500">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
