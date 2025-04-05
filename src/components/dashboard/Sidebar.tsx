import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import {
  BarChart2,
  BookOpen,
  Code,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Trophy,
  Users,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Problems",
      href: "/problems",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Leaderboard",
      href: "/leaderboard",
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      name: "Community",
      href: "/community",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: <BarChart2 className="h-5 w-5" />,
    },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Codolio</span>
        </Link>

        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link key={item.href} to={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.href
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
                {location.pathname === item.href && (
                  <motion.div
                    layoutId="sidebar-highlight"
                    className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-800">
        <Link to="/settings">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </div>
        </Link>
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{user && getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user?.name || "User"}</p>
            <p className="text-sm text-gray-400">
              {user?.email || "No email available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Use Sheet component for mobile sidebar
  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 p-4 flex items-center justify-between bg-background/80 backdrop-blur-md z-40 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">Codolio</span>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 p-0 bg-background border-r border-gray-800"
            >
              <NavContent />
            </SheetContent>
          </Sheet>
        </div>
        <div className="h-16"></div> {/* Space for fixed header */}
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="w-64 border-r border-gray-800 h-screen sticky top-0 bg-background flex-shrink-0">
      <NavContent />
    </div>
  );
};

export default Sidebar;
