import { signOut } from "next-auth/react";
import { IoLogOutOutline } from "react-icons/io5";
import { motion } from "framer-motion";

export const LogoutButton = ({ isExpanded }: { isExpanded: boolean }) => {
  return (
    <motion.div
      className={`flex items-center pl-8 ${
        isExpanded ? "pl-1 pr-4 py-2 m-2 rounded-xl hover:bg-red-100" : "p-2  "
      } transition-all duration-300 cursor-pointer`}
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <IoLogOutOutline size={24} className="text-red-600 min-w-[24px]" />
      {isExpanded && (
        <motion.span
          className="ml-4 font-medium text-red-800"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          Log Out
        </motion.span>
      )}
    </motion.div>
  );
};
