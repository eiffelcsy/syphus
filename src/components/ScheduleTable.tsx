import React from 'react';
import TaskCard from './TaskCard';

interface ScheduleTableProps {
  tasks: any[];
  onEdit: (task: any) => void;
  onCheckboxChange: (task: any) => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ tasks, onEdit, onCheckboxChange }) => {
  const calculateRowSpan = (task: any) => {
    const [startHour, startMinute] = task.start_time.split(':').map(Number);
    const [endHour, endMinute] = task.end_time.split(':').map(Number);
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;
    const durationInMinutes = endTimeInMinutes - startTimeInMinutes;
    return durationInMinutes / 30;
  };

  const getTimeIndex = (hour: number, minute: number) => {
    return hour * 2 + (minute === 30 ? 1 : 0);
  };

  const isCovered = (index: number, coveredIndexes: Set<number>) => {
    return coveredIndexes.has(index);
  };

  return (
    <div className="schedule-table-wrapper">
      <table className="schedule-table">
        <tbody>
          {(() => {
            const coveredIndexes = new Set<number>();

            return Array.from({ length: 24 * 2 }).map((_, index) => {
              const hour = Math.floor(index / 2);
              const minutes = index % 2 === 0 ? '00' : '30';
              const time = `${hour.toString().padStart(2, '0')}:${minutes}`;
              const task = tasks.find((task) => {
                if (!task.start_time || !task.end_time) return false;

                const [taskHour, taskMinute] = task.start_time.split(':').map(Number);
                return taskHour === hour && taskMinute === (minutes === '00' ? 0 : 30);
              });

              if (task) {
                const rowSpan = calculateRowSpan(task);
                const startIndex = getTimeIndex(hour, minutes === '00' ? 0 : 30);
                for (let i = 0; i < rowSpan; i++) {
                  coveredIndexes.add(startIndex + i);
                }
                return (
                  <tr key={index}>
                    <td className='time-label'>{minutes === '00' ? time : ''}</td>
                    <td className='task-slot' rowSpan={rowSpan}>
                      <TaskCard task={task} onEdit={() => onEdit(task)} onCheckboxChange={onCheckboxChange} />
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={index}>
                  <td className='time-label'>{minutes === '00' ? time : ''}</td>
                  {isCovered(index, coveredIndexes) ? null : <td className='task-slot'></td>}
                </tr>
              );
            });
          })()}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
