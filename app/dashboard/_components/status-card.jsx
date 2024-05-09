import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const StatusCard = ({ icon, title, value }) => {
  return (
    <Card className="flex items-center text-center w-full">
      <CardContent className="w-32 flex justify-center">{icon}</CardContent>
      <CardHeader className="space-y-1 w-full">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-xl">{value}</CardDescription>
      </CardHeader>
    </Card>
  );
};
