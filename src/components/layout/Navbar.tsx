"use client";

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
import { usePathname } from "next/navigation";
import Image from "next/image";

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
    title = "Studentious",
    links = [
        { title: "Home", path: "/" },
        { title: "About", path: "/calendar" },
    ],
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const pathname = usePathname();

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const isActive = (path: string) => pathname === path;

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
            <Box display="flex" justifyContent="center" mt={2} mb={1}>
                <Image src="/logo.png" alt="Studentious logo" width={48} height={48} />
            </Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
                {title}
            </Typography>
            <List>
                {links.map((link) => (
                    <Link href={link.path} key={link.title} passHref>
                        <ListItem
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
                <AppBar position="sticky" color="default" elevation={1}>
                    <Container maxWidth="xl">
                        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
                            <Link href="/" style={{ display: "flex", alignItems: "center" }}>
                                <Image
                                    src="/icon2.png"
                                    alt="Studentious logo"
                                    width={40}
                                    height={40}
                                />
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                    sx={{ ml: 1, color: "text.primary" }}
                                >
                                    {title}
                                </Typography>
                            </Link>

                            {isMobile ? (
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="end"
                                    onClick={handleDrawerToggle}
                                >
                                    <MenuIcon />
                                </IconButton>
                            ) : (
                                <Box sx={{ display: "flex" }}>
                                    {links.map((link) => (
                                        <Link href={link.path} key={link.title} passHref>
                                            <Button
                                                sx={{
                                                    mx: 1,
                                                    color: isActive(link.path)
                                                        ? "primary.main"
                                                        : "text.primary",
                                                    position: "relative",
                                                    "&::after": isActive(link.path)
                                                        ? {
                                                              content: '""',
                                                              position: "absolute",
                                                              bottom: 0,
                                                              left: 0,
                                                              width: "100%",
                                                              height: "3px",
                                                              backgroundColor:
                                                                  theme.palette.primary.main,
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
                ModalProps={{ keepMounted: true }}
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
