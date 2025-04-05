import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
    Container,
    useMediaQuery,
    useScrollTrigger,
    Slide,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useRouter } from "next/router";

interface NavbarProps {
    title?: string;
    links: {
        title: string;
        path: string;
    }[];
}

function HideOnScroll(props: { children: React.ReactElement }) {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

const Navbar: React.FC<NavbarProps> = ({
    title = "My App",
    links = [
        { title: "Home", path: "/" },
        { title: "About", path: "/calendar" },
    ],
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const router = useRouter();

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const isActive = (path: string) => {
        return router.pathname === path;
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                {title}
            </Typography>
            <List>
                {links.map((link) => (
                    <Link href={link.path} key={link.title} passHref>
                        <ListItem button>
                            sx={{
                                color: isActive(link.path) ? theme.palette.primary.main : "inherit",
                                borderLeft: isActive(link.path)
                                    ? `4px solid ${theme.palette.primary.main}`
                                    : "none",
                                paddingLeft: isActive(link.path) ? 1 : 2,
                            }}
                        >
                            <ListItemText primary={link.title} />
                        </ListItem>
                    </Link>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <HideOnScroll>
                <AppBar
                    position="sticky"
                    color="default"
                    elevation={1}
                    sx={{ backgroundColor: "background.paper" }}
                >
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
                            >
                                {title}
                            </Typography>

                            {isMobile ? (
                                <>
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        edge="start"
                                        onClick={handleDrawerToggle}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                </>
                            ) : (
                                <Box sx={{ display: "flex" }}>
                                    {links.map((link) => (
                                        <Link href={link.path} key={link.title} passHref>
                                            <Button
                                                sx={{
                                                    mx: 1,
                                                    color: isActive(link.path)
                                                        ? "primary.main"
                                                        : "inherit",
                                                    position: "relative",
                                                    "&::after": isActive(link.path)
                                                        ? {
                                                              content: '""',
                                                              position: "absolute",
                                                              bottom: "0",
                                                              left: "0",
                                                              width: "100%",
                                                              height: "3px",
                                                              backgroundColor: "primary.main",
                                                              borderRadius: "2px",
                                                          }
                                                        : {},
                                                }}
                                            >
                                                {link.title}
                                            </Button>
                                        </Link>
                                    ))}
                                </Box>
                            )}
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar;
