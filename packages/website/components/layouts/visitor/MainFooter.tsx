import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import Link from "next/link";

const Container = styled("footer")(({ theme }) => ({
    width: "100%",
    display: "flex",
    backgroundColor: "black",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: theme.spacing(15),
    paddingRight: theme.spacing(15),
    paddingTop: theme.spacing(5),

    [theme.breakpoints.down("sm")]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
    },
}));

const Top = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",

    [theme.breakpoints.up("lg")]: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-start",
    },
}));

const Logo = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    [theme.breakpoints.up("lg")]: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
}));

const Right = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    flexDirection: "row",

    marginTop: theme.spacing(3),

    [theme.breakpoints.up("lg")]: {
        marginTop: 0,
    },
}));

const Column = styled("div")(({ theme }) => ({
    width: 200,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    [theme.breakpoints.up("lg")]: {
        alignItems: "flex-start",
    },
}));

const GroupTitle = styled("div")(({ theme }) => ({
    fontSize: 14,
    fontWeight: "bold",
    color: "#707070",

    [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(3),
    },
}));

const GroupItem = styled("a")(({ theme }) => ({
    fontSize: 14,
    marginTop: theme.spacing(1),
    textDecoration: "none",
    color: "white",
}));

const Copyright = styled("div")(({ theme }) => ({
    fontSize: 14,
    marginTop: theme.spacing(3),
    color: "white",
    padding: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(4),
    },
}));

const CompanyTitle = styled(Typography)({
    fontSize: 18,
});

const groups = [
    /*
     * {
     *     title: "Company",
     *     children: [
     *         {
     *             title: "Pricing",
     *             url: "/pricing",
     *         },
     *         {
     *             title: "Articles",
     *             url: "/articles",
     *         },
     *     ],
     * },
     */
    {
        title: "Connect",
        children: [
            {
                title: "Email",
                url: "mailto:hello@hypertool.io",
            },
            {
                title: "LinkedIn",
                url: "https://linkedin.com/company/hypertool",
            },
            {
                title: "GitHub",
                url: "https://github.com/hypertool",
            },
        ],
    },
];

const MainFooter = () => {
    return (
        <Container>
            <Top>
                <Logo>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="https://res.cloudinary.com/academyjs/image/upload/v1640633721/logo_ynhdgd.png"
                        width={56}
                        height={56}
                        alt="Logo"
                    />
                    <CompanyTitle>Hypertool</CompanyTitle>
                </Logo>
                <Right>
                    {groups.map((group) => (
                        <Column key={group.title}>
                            <GroupTitle>{group.title}</GroupTitle>
                            {group.children.map((item) => (
                                <Link
                                    href={item.url}
                                    key={item.title}
                                    passHref={true}
                                >
                                    <GroupItem>{item.title}</GroupItem>
                                </Link>
                            ))}
                        </Column>
                    ))}
                </Right>
            </Top>
            <Copyright>Copyright 2021—2022, Mothership Technologies</Copyright>
        </Container>
    );
};

export default MainFooter;
