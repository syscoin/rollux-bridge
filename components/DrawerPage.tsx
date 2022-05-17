import { Box, Drawer, styled, Typography } from "@mui/material";
import Navigation from "./Navigation";
const drawerWidth = "12rem";

const Nav = styled(Box)({
  width: drawerWidth,
});

const Main = styled(Box)({
  width: `calc(100% - ${drawerWidth})`,
});
const DrawerPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box display="flex">
      <Nav component="nav">
        <Drawer
          variant="permanent"
          open
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <Typography variant="h6" color="primary.white" sx={{ p: 2 }}>
            Syscoin Bridge
          </Typography>
          <Navigation />
        </Drawer>
      </Nav>
      <Main component="main">{children}</Main>
    </Box>
  );
};

export default DrawerPage;
