"use client";

import React from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";


export default function NavbarHome() {
  const router = useRouter();
  const pathname = usePathname();

  // 根据当前路径决定激活哪个 tab
  const getValueFromPath = () => {
    switch (pathname) {
      case "/rooms":
        return 0;
      case "/explore":
        return 1;
      case "/home":
        return 2;
      case "/messages":
        return 3;
      case "/profile":
        return 4;
      default:
        return 2; // 默认首页
    }
  };

  const [value, setValue] = React.useState(getValueFromPath);

  // 当路径变化时，更新 value
  React.useEffect(() => {
    setValue(getValueFromPath());
  }, [pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        router.push("/rooms");
        break;
      case 1:
        router.push("/explore");
        break;
      case 2:
        router.push("/home");
        break;
      case 3:
        router.push("/messages");
        break;
      case 4:
        router.push("/profile");
        break;
    }
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
      elevation={3}
    >
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction label="rooms"  />
        <BottomNavigationAction label="explore"  />
        <BottomNavigationAction label="home"  />
        <BottomNavigationAction label="messages"  />
        <BottomNavigationAction label="profile"  />
      </BottomNavigation>
    </Paper>
  );
}
