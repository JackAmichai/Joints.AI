import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, History, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Welcome Back</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link href="/dashboard/intake">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                  <Plus className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">New Assessment</h3>
                  <p className="text-sm text-slate-500">Report a new pain or injury</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <History className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Your Plans</h3>
                <p className="text-sm text-slate-500">View past assessments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Progress</h3>
                <p className="text-sm text-slate-500">Track your recovery</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-4">Recent Plans</h2>
      <Card>
        <CardContent className="p-6">
          <p className="text-slate-500">No plans yet. Start a new assessment to get your personalized exercise program.</p>
        </CardContent>
      </Card>
    </div>
  );
}
