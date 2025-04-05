import { platformAPI } from "@/lib/api";
import { motion } from "framer-motion";
import { Calendar, CheckCircle, Loader2, Trophy, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

// Activity type definition
interface Activity {
  id: string;
  type: "problem_solved" | "contest_participated" | "contest_upcoming";
  platform: string;
  problem?: string;
  problemUrl?: string;
  difficulty?: string;
  time: string;
  status?: string;
  contest?: string;
  contestUrl?: string;
  change?: string;
  date?: string;
}

const ActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setLoading(true);

        // Fetch platform data
        const response = await platformAPI.getAllPlatformsData();

        if (response && response.data) {
          const platforms = response.data;
          const newActivities: Activity[] = [];

          // Process LeetCode data
          if (platforms.leetcode) {
            // Add recent problems solved (latest 3)
            if (platforms.leetcode.recentSubmissions) {
              // Filter for accepted submissions only
              const acceptedSubmissions = platforms.leetcode.recentSubmissions
                .filter((sub) => sub.status === "Accepted")
                .slice(0, 3);

              acceptedSubmissions.forEach((submission) => {
                const timestamp = new Date(submission.timestamp);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - timestamp.getTime());
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                let timeText;
                if (diffDays === 0) {
                  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
                  if (diffHours === 0) {
                    const diffMinutes = Math.floor(diffTime / (1000 * 60));
                    timeText = `${diffMinutes} minutes ago`;
                  } else {
                    timeText = `${diffHours} hours ago`;
                  }
                } else if (diffDays === 1) {
                  timeText = "Yesterday";
                } else {
                  timeText = `${diffDays} days ago`;
                }

                newActivities.push({
                  id: `problem-${submission.timestamp}`,
                  type: "problem_solved",
                  platform: "LeetCode",
                  problem: submission.problemName,
                  problemUrl: submission.problemUrl,
                  difficulty: submission.difficulty || "Unknown",
                  time: timeText,
                  status: "accepted",
                });
              });
            }

            // Add previous contest participation
            if (
              platforms.leetcode.contestHistory &&
              platforms.leetcode.contestHistory.length > 0
            ) {
              // Get the most recent contest (sort by date)
              const sortedContests = [
                ...platforms.leetcode.contestHistory,
              ].sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              );

              const recentContest = sortedContests[0];
              const contestDate = new Date(recentContest.date);
              const now = new Date();
              const diffTime = Math.abs(now.getTime() - contestDate.getTime());
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

              let timeText;
              if (diffDays === 0) {
                timeText = "Today";
              } else if (diffDays === 1) {
                timeText = "Yesterday";
              } else {
                timeText = `${diffDays} days ago`;
              }

              // Only add if the contest is in the past
              if (contestDate <= now) {
                newActivities.push({
                  id: `contest-${recentContest.date}`,
                  type: "contest_participated",
                  platform: "LeetCode",
                  contest: recentContest.contestName || "LeetCode Contest",
                  contestUrl: recentContest.contestUrl,
                  time: timeText,
                  change: recentContest.rating
                    ? `Rating: ${recentContest.rating}`
                    : undefined,
                  date: contestDate.toLocaleDateString(),
                });
              }
            }

            // Add upcoming contest
            if (
              platforms.leetcode.upcomingContests &&
              platforms.leetcode.upcomingContests.length > 0
            ) {
              // Get the next upcoming contest
              const nextContest = platforms.leetcode.upcomingContests[0];
              const contestDate = new Date(nextContest.date);

              // Format date
              const formattedDate = contestDate.toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              newActivities.push({
                id: `upcoming-${nextContest.date}`,
                type: "contest_upcoming",
                platform: "LeetCode",
                contest: nextContest.contestName || "Upcoming Contest",
                contestUrl: nextContest.contestUrl,
                time: "Upcoming",
                date: formattedDate,
              });
            }
          }

          // Set activities
          setActivities(newActivities);
        }
      } catch (error) {
        console.error("Failed to fetch activity data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, []);

  const getActivityIcon = (activity: Activity) => {
    switch (activity.type) {
      case "problem_solved":
        return activity.status === "accepted" ? (
          <div className="p-2 rounded-full bg-green-500/20 text-green-500">
            <CheckCircle className="h-4 w-4" />
          </div>
        ) : (
          <div className="p-2 rounded-full bg-red-500/20 text-red-500">
            <XCircle className="h-4 w-4" />
          </div>
        );
      case "contest_participated":
        return (
          <div className="p-2 rounded-full bg-blue-500/20 text-blue-500">
            <Trophy className="h-4 w-4" />
          </div>
        );
      case "contest_upcoming":
        return (
          <div className="p-2 rounded-full bg-yellow-500/20 text-yellow-500">
            <Calendar className="h-4 w-4" />
          </div>
        );
      default:
        return null;
    }
  };

  const getActivityContent = (activity: Activity) => {
    switch (activity.type) {
      case "problem_solved":
        return (
          <>
            <p>
              Solved{" "}
              <span className="font-medium">
                {activity.problemUrl ? (
                  <a
                    href={activity.problemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {activity.problem}
                  </a>
                ) : (
                  activity.problem
                )}
              </span>{" "}
              on {activity.platform}
            </p>
            <p className="text-sm text-gray-400">
              {activity.difficulty} • {activity.time}
            </p>
          </>
        );
      case "contest_participated":
        return (
          <>
            <p>
              Participated in{" "}
              <span className="font-medium">
                {activity.contestUrl ? (
                  <a
                    href={activity.contestUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {activity.contest}
                  </a>
                ) : (
                  activity.contest
                )}
              </span>
            </p>
            <p className="text-sm">
              {activity.change && (
                <span className="text-blue-500">{activity.change}</span>
              )}
              {activity.change && activity.date && " • "}
              {activity.date && (
                <span className="text-gray-400">{activity.date}</span>
              )}
              {(activity.change || activity.date) && " • "}
              <span className="text-gray-400">{activity.time}</span>
            </p>
          </>
        );
      case "contest_upcoming":
        return (
          <>
            <p>
              Upcoming contest:{" "}
              <span className="font-medium">
                {activity.contestUrl ? (
                  <a
                    href={activity.contestUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {activity.contest}
                  </a>
                ) : (
                  activity.contest
                )}
              </span>
            </p>
            <p className="text-sm text-gray-400">{activity.date}</p>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading activity data...</span>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[200px] text-center">
        <Calendar className="h-10 w-10 text-gray-500 mb-4" />
        <p className="text-gray-400">No recent activity found.</p>
        <p className="text-sm text-gray-500 mt-1">
          Solve problems or participate in contests to see your activity here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
        >
          {getActivityIcon(activity)}
          <div className="flex-1">{getActivityContent(activity)}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default ActivityFeed;
