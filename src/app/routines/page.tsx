import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserRoutines } from "../actions/routine";

const Routines = async () => {
  const routines = await getCurrentUserRoutines();

  if (routines.length === 0) {
    redirect("/routines/new");
  }

  return (
    <div className="max-w-lg mx-auto h-full flex flex-col">
      <ul className="space-y-4">
        {routines.map((routine) => (
          <li key={routine.id}>
            <Link href={`/routines/${routine.id}`}>
              <Card>
                <CardHeader className="flex flex-row space-y-0 justify-between items-center gap-2 cursor-pointer hover:bg-slate-50 border px-3 py-3">
                  <CardTitle className="truncate text-md" title={routine.name}>
                    {routine.name}
                  </CardTitle>
                  {routine.isSelected && <Badge>Selected</Badge>}
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Routines;
