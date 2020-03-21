import React, { useState } from "react";
import { Drawer, IconButton } from "@material-ui/core";

import ListIcon from "../ListIcon";

import MenuIcon from "@material-ui/icons/Menu";
import DriveEtaIcon from "@material-ui/icons/DriveEta";
import TrafficIcon from "@material-ui/icons/Traffic";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";

export default function TemporaryDrawer() {
  const [left, setLeft] = useState(false);

  const toggleDrawer = (anchor, open) => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setLeft({ left, [anchor]: open });
  };

  const list = anchor => (
    <div
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      style={{ width: 250 }}
    >
      <ListIcon text={"Driver List"} icon={<DriveEtaIcon />} />
      <ListIcon text={"Traffic List"} icon={<TrafficIcon />} />
      <ListIcon text={"Logout"} icon={<MeetingRoomIcon />} />
    </div>
  );

  return (
    <div>
      {["left"].map(anchor => (
        <React.Fragment key={anchor}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(anchor, true)}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
          <Drawer
            anchor={anchor}
            open={left[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}