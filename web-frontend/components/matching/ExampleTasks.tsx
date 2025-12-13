import Card from "@/components/Card";

interface ExampleTask {
  text: string;
}

interface ExampleTasksProps {
  tasks: string[];
  onSelectTask: (task: string) => void;
}

export default function ExampleTasks({
  tasks,
  onSelectTask,
}: ExampleTasksProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Example Tasks</h3>
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <button
            key={index}
            onClick={() => onSelectTask(task)}
            className="w-full text-left px-4 py-3 bg-card-bg-hover rounded-lg text-sm text-text-secondary hover:bg-border hover:text-text-primary transition-colors"
          >
            {task}
          </button>
        ))}
      </div>
    </Card>
  );
}
