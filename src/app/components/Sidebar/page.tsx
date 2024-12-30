import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoHomeOutline,
  IoStatsChartOutline,
  IoCreateOutline,
  IoInformationCircleOutline,
  IoChevronForwardOutline,
  IoChevronBackOutline,
  IoNotificationsOutline,
  IoCartOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import Link from "next/link";
import { LogoutButton } from "@/app/util/LogoutButon";

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const sidebarVariants = {
    expanded: { width: "240px" },
    collapsed: { width: isMobile ? "0px" : "80px" },
  };

  const menuItems = [
    { path: "/", icon: IoHomeOutline, label: "Home" },
    { path: "/stats", icon: IoStatsChartOutline, label: "Statistics" },
    { path: "/edit", icon: IoCreateOutline, label: "Edit" },
    { path: "/order", icon: IoCartOutline, label: "Order Page" },
    { path: "/today-work", icon: IoCalendarOutline, label: "Today Work" },
    {
      path: "/notifications",
      icon: IoNotificationsOutline,
      label: "Notifications",
    },
    { path: "/info", icon: IoInformationCircleOutline, label: "Info" },
  ];

  return (
    <>
      <AnimatePresence>
        {!isExpanded && isMobile && (
          <motion.button
            className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-green-500 text-white p-2 rounded-l-full shadow-lg z-50"
            onClick={() => setIsExpanded(true)}
            initial={{ x: 0 }}
            animate={{ x: 0 }}
            exit={{ x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <IoChevronForwardOutline size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed top-0 left-0 h-screen bg-transparent bg-opacity-80 backdrop-filter backdrop-blur-lg text-gray-800 shadow-lg z-40"
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col h-full">
          <motion.button
            className="self-end m-4 p-2 text-gray-600 hover:text-gray-800 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <IoChevronBackOutline size={24} />
            ) : (
              <IoChevronForwardOutline size={24} />
            )}
          </motion.button>
          <nav className="flex-1 mt-8">
            {menuItems.map(({ path, icon: Icon, label }) => (
              <Link key={path} href={path}>
                <motion.div
                  className="flex items-center px-4 py-3 m-2 rounded-xl hover:bg-green-100 transition-all duration-300 cursor-pointer"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {(!isMobile || isExpanded) && (
                    <Icon size={24} className="text-gray-600 min-w-[24px]" />
                  )}
                  {isExpanded && (
                    <motion.span
                      className="ml-4 font-medium text-gray-800"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {label}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            ))}
          </nav>
          <div
            className={`mt-auto mb-4 ${
              isMobile && !isExpanded ? "hidden" : "block"
            }`}
          >
            <LogoutButton isExpanded={isExpanded} />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
