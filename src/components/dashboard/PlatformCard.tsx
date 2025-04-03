import { platformAPI } from "@/lib/api";
import { motion } from "framer-motion";
import { ExternalLink, RefreshCw } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface PlatformStat {
  problems: number;
  ranking?: string;
  rating?: number;
  contests: number;
  badges?: number;
  maxRank?: string;
}

interface PlatformCardProps {
  platform: {
    id: string;
    name: string;
    logo: string;
    stats: PlatformStat;
    color: string;
    username?: string;
  };
  onRefresh?: () => void;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ platform, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to get the appropriate platform URL
  const getPlatformUrl = () => {
    switch (platform.id) {
      case "leetcode":
        return "https://leetcode.com/problemset/all/?status=NOT_STARTED&difficulty=ALL&page=1&ladders=daily-problem";
      case "codeforces":
        return "https://codeforces.com/";
      case "codechef":
        return "https://www.codechef.com/";
      default:
        return "#";
    }
  };

  // Function to get the appropriate profile URL
  const getProfileUrl = () => {
    // Note: This would typically use platform.stats.username,
    // but since that's not available in the current data structure,
    // this implementation assumes profiles will be accessed through the general platform URL
    switch (platform.id) {
      case "leetcode":
        return `https://leetcode.com/${platform.username || ""}`;
      case "codeforces":
        return `https://codeforces.com/profile/${platform.username || ""}`;
      case "codechef":
        return `https://www.codechef.com/users/${platform.username || ""}`;
      default:
        return "#";
    }
  };

  // Handle refresh click to update platform data
  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isRefreshing) return;

    setIsRefreshing(true);

    try {
      toast.info(`Refreshing ${platform.name} data...`);

      // Call the API to update platform data
      const response = await platformAPI.updatePlatformData(platform.id);

      toast.success(`${platform.name} data refreshed!`);

      // Trigger the parent component to refresh data
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error(`Error refreshing ${platform.name} data:`, error);
      toast.error(
        `Failed to refresh ${platform.name} data. Please try again later.`
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  // Open platform in a new tab
  const handleCardClick = () => {
    window.open(getPlatformUrl(), "_blank");
  };

  // Function to render the platform logo
  const renderLogo = () => {
    switch (platform.id) {
      case "leetcode":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.102 17.933L9.546 21.89C8.927 22.261 8.101 22.261 7.482 21.89L0.926 17.933C0.307 17.563 0 16.937 0 16.255V8.346C0 7.663 0.307 7.038 0.926 6.667L7.482 2.709C8.101 2.339 8.927 2.339 9.546 2.709L16.102 6.667C16.721 7.038 17.029 7.663 17.029 8.346V16.255C17.029 16.937 16.721 17.563 16.102 17.933Z"
              fill="#FFA116"
            />
            <path
              d="M23.102 17.933L16.546 21.89C15.927 22.261 15.101 22.261 14.482 21.89L7.926 17.933C7.307 17.563 7 16.937 7 16.255V8.346C7 7.663 7.307 7.038 7.926 6.667L14.482 2.709C15.101 2.339 15.927 2.339 16.546 2.709L23.102 6.667C23.721 7.038 24.029 7.663 24.029 8.346V16.255C24.029 16.937 23.721 17.563 23.102 17.933Z"
              fill="#B3B3B3"
              fillOpacity="0.3"
            />
          </svg>
        );
      case "codeforces":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="7" height="14" fill="#1890FF" />
            <rect x="8.5" y="5" width="7" height="19" fill="#1890FF" />
            <rect x="17" y="10" width="7" height="14" fill="#1890FF" />
          </svg>
        );
      case "codechef":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.911 24C14.8 24 17.418 22.972 19.326 21.228C19.483 21.088 19.335 20.864 19.139 20.913C18.537 21.063 17.915 21.142 17.277 21.142C13.04 21.142 9.6 17.714 9.6 13.492C9.6 11.005 10.736 8.781 12.504 7.306C12.682 7.158 12.628 6.881 12.409 6.803C11.748 6.585 11.044 6.468 10.314 6.468C5.958 6.468 2.4 10.005 2.4 14.336C2.4 19.247 6.695 24 11.911 24Z"
              fill="#9C5221"
            />
            <path
              d="M18.7 6.468C22.266 6.468 24 9.33 24 11.861C24 14.392 21.542 15.9 19.2 15.9C16.858 15.9 16.6 14.392 16.6 13.729C16.6 13.066 17.4 12.238 18.228 12.238C19.056 12.238 19.2 12.76 19.2 13.134C19.2 13.508 18.947 13.729 18.7 13.729C18.452 13.729 18.343 13.618 18.228 13.508C18.114 13.618 18 13.839 18 14.023C18 14.429 18.452 14.696 18.914 14.696C19.856 14.696 20.742 14.073 20.742 12.9C20.742 11.726 19.856 10.973 18.7 10.973C17.138 10.973 15.8 12.238 15.8 13.729C15.8 15.221 16.766 17.042 19.2 17.042C21.293 17.042 24 15.221 24 11.861C24 8.501 21.634 5.326 17.9 5.326C15.365 5.326 14.264 6.468 13.799 6.468C13.333 6.468 13.333 6.132 13.333 6.005C13.333 5.878 13.4 5.752 13.438 5.677C12.4 5.326 11.297 5.125 10.159 5.125C5.472 5.125 1.714 8.868 1.714 13.534C1.714 18.2 5.472 21.942 10.159 21.942C14.845 21.942 18.603 18.2 18.603 13.534C18.603 12.86 18.525 12.203 18.375 11.575C18.325 11.344 18.603 11.169 18.775 11.323C19.778 12.217 20.399 13.534 20.399 15C20.399 17.903 17.9 20.351 14.933 20.351C11.966 20.351 9.467 17.903 9.467 15C9.467 12.097 11.966 9.649 14.933 9.649C15.242 9.649 15.544 9.682 15.837 9.742C16.064 9.787 16.166 9.526 15.986 9.384C15.118 8.705 14.051 8.301 12.885 8.301C10.059 8.301 7.733 10.572 7.733 13.324C7.733 16.076 10.059 18.347 12.885 18.347C15.712 18.347 18.037 16.076 18.037 13.324C18.037 12.994 18.008 12.673 17.952 12.36C17.918 12.177 18.144 12.061 18.277 12.193C18.959 12.865 19.37 13.788 19.37 14.807C19.37 16.957 17.566 18.68 15.301 18.68C13.035 18.68 11.231 16.957 11.231 14.807C11.231 12.656 13.035 10.933 15.301 10.933C15.404 10.933 15.506 10.936 15.607 10.942C15.806 10.954 15.879 10.709 15.714 10.616C15.199 10.315 14.597 10.143 13.953 10.143C12.091 10.143 10.571 11.607 10.571 13.398C10.571 15.19 12.091 16.654 13.953 16.654C15.815 16.654 17.335 15.19 17.335 13.398"
              fill="#9C5221"
            />
          </svg>
        );
      default:
        return platform.logo;
    }
  };

  return (
    <motion.div
      whileHover={{ translateY: -5 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-xl overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${platform.color}20` }}
            >
              {renderLogo()}
            </div>
            <h3 className="font-bold">{platform.name}</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700 ${
                isRefreshing ? "opacity-70" : ""
              }`}
              title={`Refresh ${platform.name} data`}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>

            <a
              href={getPlatformUrl()}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
              title={`Visit ${platform.name}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Problems</p>
            <p className="font-bold">{platform.stats.problems}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Contests</p>
            <p className="font-bold">{platform.stats.contests}</p>
          </div>

          {platform.stats.rating !== undefined && (
            <div>
              <p className="text-sm text-gray-400 mb-1">Rating</p>
              <p className="font-bold">{platform.stats.rating}</p>
            </div>
          )}

          {platform.stats.ranking && (
            <div>
              <p className="text-sm text-gray-400 mb-1">Ranking</p>
              <p className="font-bold">{platform.stats.ranking}</p>
            </div>
          )}

          {platform.stats.maxRank && (
            <div>
              <p className="text-sm text-gray-400 mb-1">Max Rank</p>
              <p className="font-bold">{platform.stats.maxRank}</p>
            </div>
          )}

          {platform.stats.badges !== undefined && (
            <div>
              <p className="text-sm text-gray-400 mb-1">Badges</p>
              <p className="font-bold">{platform.stats.badges}</p>
            </div>
          )}
        </div>
      </div>

      {platform.id === "leetcode" && (
        <div className="bg-gradient-to-r from-yellow-600/30 to-transparent px-6 py-2 text-xs text-yellow-300">
          Click to solve today's challenge
        </div>
      )}
      {platform.id === "codeforces" && (
        <div className="bg-gradient-to-r from-blue-600/30 to-transparent px-6 py-2 text-xs text-blue-300">
          Click to see upcoming contests
        </div>
      )}
      {platform.id === "codechef" && (
        <div className="bg-gradient-to-r from-amber-700/30 to-transparent px-6 py-2 text-xs text-amber-300">
          Click to browse problems
        </div>
      )}
    </motion.div>
  );
};

export default PlatformCard;
