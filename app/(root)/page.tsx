import { TodoForm, TodoList } from "@/components/Todo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoForm />
          <TodoList />
        </CardContent>
      </Card>
    </div>
  );
}
