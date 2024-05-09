import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const StudentCard = ({ length }) => {
  return (
    <Card className="w-[250px] my-4 text-center">
      <CardHeader className="space-y-1">
        <CardTitle>Total Students</CardTitle>
        <CardDescription className="text-xl">{length}</CardDescription>
      </CardHeader>
    </Card>
  );
};
