import { useEffect, useRef } from "react";

import { Button, Icon, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { motion, useCycle } from "framer-motion";
import Link from "next/link";
import Router from "next/router";

const Toolbar = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgb(0, 0, 0, 0.0)",
    border: 0,
    width: "100%",
}));

const LogoText = styled(Typography)(({ theme }) => ({
    fontSize: 24,
    marginLeft: theme.spacing(1),
    color: "white",
}));

const Background = styled(motion.div)(({ theme }) => ({
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "100%",
    minHeight: "100vh",
    background:
        "linear-gradient(0deg, rgba(50,50,50,1) 0%, rgba(36,36,36,1) 100%)",
    zIndex: 4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
}));

const LogoButton = styled(Button)(({ theme }) => ({
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    zIndex: 8,
}));

const ToolbarItem = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    color: "white",
}));

const ToolbarText = styled("div")(({ theme }) => ({
    marginLeft: theme.spacing(1),
    color: "white",
}));

const NavigationContainer = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
}));

const NavigationText = styled(Typography)(({ theme }) => ({
    fontSize: 16,
    margin: theme.spacing(2),
}));

const GroupButton = styled(Button)(({ theme }) => ({
    marginTop: 0,
    margin: theme.spacing(2),
    maxWidth: 400,
}));

const NavigationCloseButton = styled(Button)(({ theme }) => ({
    position: "absolute",
    top: 20,
    right: theme.spacing(2),
}));

interface Link {
    name: string;
    url: string;
    description: string;
    icon?: string;
    image?: string;
}

interface Action {
    text: string;
    url: string;
}

interface MenuGroup {
    name: string;
    links: Link[];
    button?: Action;
}

const menuGroups: MenuGroup[] = [
    {
        name: "Overview",
        links: [
            {
                name: "Pricing",
                url: "/pricing",
                description:
                    "Hypertool offers a variety of plans with a free tier, suitable for teams as well as individuals.",
                icon: "sell",
            },
            {
                name: "Articles",
                url: "/articles",
                description:
                    "Read articles on career advice, tips on writing better code and a lot more, curated just for you.",
                icon: "book",
            },
        ],
    },
    {
        name: "Plans",
        links: [
            {
                name: "Lite",
                url: "/pricing",
                description:
                    "Hypertool offers a variety of plans with a free tier, suitable for teams as well as individuals.",
                icon: "person",
            },
            {
                name: "Basic",
                url: "/pricing",
                description:
                    "Hypertool offers a variety of plans with a free tier, suitable for teams as well as individuals.",
                icon: "star",
            },
            {
                name: "Standard",
                url: "/pricing",
                description:
                    "Hypertool offers a variety of plans with a free tier, suitable for teams as well as individuals.",
                icon: "people",
            },
            {
                name: "Premium",
                url: "/pricing",
                description:
                    "Hypertool offers a variety of plans with a free tier, suitable for teams as well as individuals.",
                icon: "stars",
            },
        ],
        button: {
            text: "Compare Plans",
            url: "/pricing",
        },
    },
];

const toolbarMenuItems = [
    {
        name: "Download",
        url: "https://github.com/hypertool/hypertool",
        icon: "download",
    },
    {
        name: "Docs",
        url: "/",
        icon: "books",
    },
];

const sidebar = {
    open: (height = 1000) => ({
        clipPath: `circle(${height * 10 + 1000}px at 100% 0%)`,
        transition: {
            type: "spring",
            stiffness: 20,
            restDelta: 2,
        },
    }),
    closed: {
        clipPath: "circle(0px at 100% 0%)",
        transition: {
            delay: 0.5,
            type: "spring",
            stiffness: 400,
            damping: 40,
        },
    },
};

const variants = {
    open: {
        transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
};

const MainToolbarDesktop = () => {
    const [isOpen, toggleOpen] = useCycle(false, true);
    const containerRef = useRef(null);

    const openURL = (url: string) => () => {
        Router.push(url);
    };

    const renderLink = (menuItem: {
        url: string;
        name: string;
        icon: string;
    }) => (
        <ToolbarItem key={menuItem.url} onClick={openURL(menuItem.url)}>
            <Icon>{menuItem.icon}</Icon>
            <ToolbarText>{menuItem.name}</ToolbarText>
        </ToolbarItem>
    );

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflowY = "hidden";
        } else {
            document.body.style.overflowY = "auto";
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            toggleOpen();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Router.asPath]);

    return (
        <>
            <Toolbar>
                <LogoButton onClick={openURL("/")}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="https://res.cloudinary.com/academyjs/image/upload/v1640633721/logo_ynhdgd.png"
                        width={48}
                        height={48}
                        alt="Logo"
                    />
                    <LogoText variant="h1">Hypertool</LogoText>
                </LogoButton>
                <div>
                    {toolbarMenuItems.map((menuItem) => renderLink(menuItem))}
                    {/* <ToolbarItem onClick={() => toggleOpen()}>
            <Icon>menu</Icon>
            <ToolbarText>Explore</ToolbarText>
          </ToolbarItem>
          <motion.nav
            initial={false}
            animate={isOpen ? "open" : "closed"}
            ref={containerRef}
          >
            <Background variants={sidebar}>
              <NavigationCloseButton onClick={() => toggleOpen()}>
                <Icon style={{ color: "white " }}>close</Icon>
                <ToolbarText>Close</ToolbarText>
              </NavigationCloseButton>
              <NavigationContainer>
                {menuGroups.map((group) => (
                  <motion.div key={group.name} variants={variants}>
                    <NavigationText variant="h2">{group.name}</NavigationText>
                    {group.links.map((item) => (
                      <MenuItem
                        key={item.name}
                        url={item.url}
                        title={item.name}
                        icon={item.icon}
                        description={item.description}
                      />
                    ))}
                    {group.button && (
                      <Link href={group.button.url} passHref={true}>
                        <GroupButton
                          variant="contained"
                          color="primary"
                          size="large"
                        >
                          {group.button.text}
                        </GroupButton>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </NavigationContainer> 
            </Background>
          </motion.nav>*/}
                </div>
            </Toolbar>
        </>
    );
};

MainToolbarDesktop.displayName = "MainToolbarDesktop";

export default MainToolbarDesktop;
