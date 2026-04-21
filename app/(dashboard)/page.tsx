"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, History, TrendingUp, Target, Flame, CheckCircle } from "lucide-react";

interface Stats {
  totalExercises: number;
  completedExercises: number;
  currentStreak: number;
  plansCompleted: number;
}

export default function DashboardPage() {
  const stats: Stats = {
    totalExercises: 24,
    completedExercises: 18,
    currentStreak: 3,
    plansCompleted: 2,
  };

  const progressPercent = Math.round((stats.completedExercises / stats.totalExercises) * 100);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Welcome Back</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedExercises}</p>
                <p className="text-xs text-slate-500">Exercises Done</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{progressPercent}%</p>
                <p className="text-xs text-slate-500">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.currentStreak}</p>
                <p className="text-xs text-slate-500">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.plansCompleted}</p>
                <p className="text-xs text-slate-500">Plans Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link href="/assess/method">
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

        <Link href="/dashboard/history">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
        </Link>

        <Link href="/dashboard/settings">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Settings</h3>
                  <p className="text-sm text-slate-500">Manage your profile</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-32 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              const heights = [60, 80, 40, 100, 70, 30, 50];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-slate-900 rounded-t transition-all"
                    style={{ height: `${heights[i]}%` }}
                  />
                  <span className="text-xs text-slate-500">{day}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span>This week: 8 exercises completed</span>
            <span>Last week: 5 exercises</span>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Recent Plans</h2>
      <Card>
        <CardContent className="p-6">
          <p className="text-slate-500">No plans yet. Start a new assessment to get your personalized exercise program.</p>
        </CardContent>
      </Card>
    </div>
  );
}
