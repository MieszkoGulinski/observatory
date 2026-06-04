import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SchedulePage from "./pages/SchedulePage";
import StatusPage from "./pages/StatusPage";
import SystemLoadPage from "./pages/SystemLoadPage";

import { CalendarDaysIcon, ChartSplineIcon, CpuIcon } from "lucide-react";

function App() {
  return (
    <div className="p-2">
      <Tabs defaultValue="schedule">
        <div className="flex gap-2">
          <TabsList>
            <TabsTrigger value="schedule">
              <CalendarDaysIcon /> Schedule
            </TabsTrigger>
            <TabsTrigger value="status">
              <CpuIcon />
              System Status
            </TabsTrigger>
            <TabsTrigger value="systemLoad">
              <ChartSplineIcon />
              System Load
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="schedule">
          <SchedulePage />
        </TabsContent>
        <TabsContent value="status">
          <StatusPage />
        </TabsContent>
        <TabsContent value="systemLoad">
          <SystemLoadPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
