import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SchedulePage from "./pages/SchedulePage";
import CurrentStatusPage from "./pages/CurrentStatusPage";
import StatisticsHistoryPage from "./pages/StatisticsHistoryPage";

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
            <TabsTrigger value="currentStatus">
              <CpuIcon />
              Current Status
            </TabsTrigger>
            <TabsTrigger value="statisticsHistory">
              <ChartSplineIcon />
              Statistics
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="schedule">
          <SchedulePage />
        </TabsContent>
        <TabsContent value="currentStatus">
          <CurrentStatusPage />
        </TabsContent>
        <TabsContent value="statisticsHistory">
          <StatisticsHistoryPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
