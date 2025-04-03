import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { platformAPI } from "@/lib/api";
import axios from "axios";
import { useState } from "react";

const PlatformTest = () => {
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!leetcodeUsername) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }

    setConnecting(true);
    setError(null);
    try {
      const result = await platformAPI.connectPlatform(
        "leetcode",
        leetcodeUsername
      );
      toast({
        title: "Success",
        description: `Connected to LeetCode account: ${leetcodeUsername}`,
      });
      console.log("Connect result:", result);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to connect LeetCode account"
      );
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to connect LeetCode account",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const fetchLeetCodeData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await platformAPI.getPlatformData("leetcode");
      setData(result);
      toast({
        title: "Data Fetched",
        description: "Successfully fetched LeetCode data",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch LeetCode data");
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to fetch LeetCode data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLeetCodeData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await platformAPI.updatePlatformData("leetcode");
      setData(result);
      toast({
        title: "Data Updated",
        description: "Successfully updated LeetCode data",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update LeetCode data");
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to update LeetCode data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testLeetCodeDirectly = async () => {
    setLoading(true);
    setError(null);
    try {
      // Direct LeetCode GraphQL API test
      const apiUrl = "https://leetcode.com/graphql";
      const query = {
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              submitStats: submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                  submissions
                }
              }
            }
          }
        `,
        variables: {
          username: leetcodeUsername || "leetcode", // Use input username or default to "leetcode"
        },
      };

      const response = await axios.post(apiUrl, query);
      setData({
        directTest: true,
        leetcodeResponse: response.data,
      });

      toast({
        title: "Direct Test Succeeded",
        description: "Successfully queried LeetCode API directly",
      });
    } catch (err: any) {
      console.error("Direct LeetCode test error:", err);
      setError(
        "Failed to directly test LeetCode API: " +
          (err.message || "Unknown error")
      );
      toast({
        title: "Error",
        description: "Failed to directly test LeetCode API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testBackendLeetCodeService = async () => {
    setLoading(true);
    setError(null);
    try {
      const username = leetcodeUsername || "leetcode"; // Use input username or default to "leetcode"
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      // We need to attach the auth token for the backend request
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(
        `${API_URL}/platforms/test/leetcode/${username}`,
        { headers }
      );
      setData({
        backendTest: true,
        serviceTestResponse: response.data,
      });

      toast({
        title: "Backend Test Succeeded",
        description: "Successfully tested backend LeetCode service",
      });
    } catch (err: any) {
      console.error("Backend LeetCode service test error:", err);
      setError(
        "Failed to test backend LeetCode service: " +
          (err.response?.data?.message || err.message || "Unknown error")
      );
      toast({
        title: "Error",
        description: "Failed to test backend LeetCode service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">LeetCode Integration Test</h2>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            value={leetcodeUsername}
            onChange={(e) => setLeetcodeUsername(e.target.value)}
            placeholder="LeetCode Username"
            disabled={connecting}
          />
          <Button
            onClick={handleConnect}
            disabled={connecting || !leetcodeUsername}
          >
            {connecting ? "Connecting..." : "Connect"}
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={fetchLeetCodeData} disabled={loading}>
            {loading ? "Loading..." : "Fetch Data"}
          </Button>
          <Button
            onClick={updateLeetCodeData}
            disabled={loading}
            variant="outline"
          >
            {loading ? "Updating..." : "Update Data"}
          </Button>
          <Button
            onClick={testLeetCodeDirectly}
            disabled={loading}
            variant="secondary"
          >
            {loading ? "Testing..." : "Test LeetCode Directly"}
          </Button>
          <Button
            onClick={testBackendLeetCodeService}
            disabled={loading}
            variant="destructive"
          >
            {loading ? "Testing..." : "Test Backend Service"}
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-500 p-3 rounded">{error}</div>
        )}

        {data && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">LeetCode Data</h3>
            <pre className="bg-gray-800 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformTest;
