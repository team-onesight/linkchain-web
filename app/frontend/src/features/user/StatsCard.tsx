import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SectionContainer } from "@/components/styled/layout";

export const StatsCard = () => {

  return (
    <SectionContainer className="py-8">
      <Card>
        <CardContent className="p-4 flex justify-around text-center">
          <div>

            <p className="text-sm text-muted-foreground">Links Saved</p>
          </div>
          <Separator orientation="vertical" className="h-auto" />
          <div>
            <p className="text-2xl font-bold">128</p>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
          <Separator orientation="vertical" className="h-auto" />
          <div>
            <p className="text-2xl font-bold">72</p>
            <p className="text-sm text-muted-foreground">Following</p>
          </div>
        </CardContent>
      </Card>
    </SectionContainer>
  );
};
