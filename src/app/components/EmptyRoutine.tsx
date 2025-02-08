import EmptyState from "./EmptyState";

const EmptyRoutine = () => (
  <div className="flex items-center justify-center h-full">
    <EmptyState
      icon="ListTodoIcon"
      title="Empty Routine"
      description="Cultivate bodily discipline as a path to spiritual growth, creating intentional movements that honor God's temple."
      buttonText="Create New Routine"
      buttonHref="/routine/new"
    />
  </div>
);

export default EmptyRoutine;
