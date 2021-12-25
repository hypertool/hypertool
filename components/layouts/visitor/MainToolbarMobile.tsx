import { useRef, useEffect } from "react";
import { motion, useCycle } from "framer-motion";
import { styled } from "@mui/material/styles";
import { Button, Typography } from "@mui/material";
import Image from "next/image";
import Router from "next/router";

import MenuItem from "./MenuItem";
import Logo from "../../../public/logo.png";

const Toolbar = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  margin: 0,
}));

const Background = styled(motion.div)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  display: "flex",
  width: "100%",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  margin: 0,
  padding: 0,
  background:
    "linear-gradient(45deg, rgba(66,66,66,1) 0%, rgba(134,134,134,1) 100%)",
  zIndex: 4,
}));

const ToggleButton = styled(Button)(({ theme }) => ({
  zIndex: 8,
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: 24,
  paddingLeft: theme.spacing(1),
  color: 'white'
}));

const LogoButton = styled(Button)(({ theme }) => ({
  maxWidth: 300,
}));

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="white"
    strokeLinecap="round"
    {...props}
  />
);

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 10 + 1000}px at 36px 36px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(0px at 36px 36px)",
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

const menuItems = [
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
  {
    name: "Docs",
    url: "/docs",
    description:
      "Read articles on career advice, tips on writing better code and a lot more, curated just for you.",
    icon: "local_library",
  },
];

const MainToolbarMobile = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);

  const openURL = (url: string) => () => {
    Router.push(url);
  };

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
    <Toolbar>
      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        ref={containerRef}
      >
        <Background variants={sidebar}>
          <motion.div variants={variants}>
            {menuItems.map((item) => (
              <MenuItem
                key={item.name}
                url={item.url}
                title={item.name}
                icon={item.icon}
                description={item.description}
              />
            ))}
          </motion.div>
        </Background>

        <ToggleButton onClick={() => toggleOpen()}>
          <svg width="36" height="36" viewBox="-6 -8 36 36">
            <Path
              variants={{
                closed: { d: "M 2 2.5 L 20 2.5" },
                open: { d: "M 3 16.5 L 17 2.5" },
              }}
            />
            <Path
              d="M 2 9.423 L 20 9.423"
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 },
              }}
              transition={{ duration: 0.1 }}
            />
            <Path
              variants={{
                closed: { d: "M 2 16.346 L 20 16.346" },
                open: { d: "M 3 2.5 L 17 16.346" },
              }}
            />
          </svg>
        </ToggleButton>
      </motion.nav>
      <LogoButton onClick={openURL("/")}>
        <Image src={Logo} width={48} height={48} alt="Logo" />
        <LogoText variant="h1">
          Hypertool
        </LogoText>
      </LogoButton>
    </Toolbar>
  );
};

MainToolbarMobile.displayName = "MainToolbarMobile";

export default MainToolbarMobile;
